import { useEffect, useMemo, useRef, useState } from "react";
import { RealtimeClient, type ChatMessage, type CallSession, type UserRole } from "../services/realtimeClient";
import { WebRtcPeer } from "../services/webrtcPeer";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../services/authStore";
import { Button } from "../components/ui/button";

const DEFAULT_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "/api";

export function Mentorat() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const backendUrl = DEFAULT_BASE_URL;
  const [mentorId, setMentorId] = useState("");
  const [etudiantId, setEtudiantId] = useState("");

  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const [call, setCall] = useState<CallSession | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [remoteStreamSeen, setRemoteStreamSeen] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<WebRtcPeer | null>(null);

  async function tryGetMediaStream(): Promise<MediaStream | null> {
    try {
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch {
      // ignore
    }
    try {
      return await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    } catch {
      // ignore
    }
    try {
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch {
      // ignore
    }
    return null;
  }

  const client = useMemo(() => {
    if (!auth.token) return null;
    return new RealtimeClient({ baseUrl: backendUrl, token: auth.token });
  }, [backendUrl, auth.token]);

  const role = auth.user?.role as UserRole | undefined;

  useEffect(() => {
    const mentor = searchParams.get("mentorId") ?? "";
    const etudiant = searchParams.get("etudiantId") ?? "";
    if (mentor) setMentorId(mentor);
    if (etudiant) setEtudiantId(etudiant);
  }, [searchParams]);

  useEffect(() => {
    if (!client) return;
    if (!mentorId || !etudiantId) return;
    if (!auth.user?.role) return;

    let cancelled = false;
    setJoining(true);
    setJoinError(null);

    client
      .joinConversation(mentorId, etudiantId)
      .catch((e: any) => {
        if (cancelled) return;
        setJoinError(e?.message ?? "JOIN_FAILED");
      })
      .finally(() => {
        if (cancelled) return;
        setJoining(false);
      });

    return () => {
      cancelled = true;
    };
  }, [client, mentorId, etudiantId, auth.user?.role]);

  useEffect(() => {
    if (!client) return;

    client.onHistory((h) => {
      setConversationId(h.conversationId);
      setMessages(h.messages);
    });

    client.onMessage((m) => {
      setMessages((prev) => [...prev, m]);
    });

    client.onCallRinging(setCall);
    client.onCallConnected(setCall);
    client.onCallMissed(setCall);
    client.onCallEnded(setCall);

    client.onCallAccepted(async (p) => {
      if (!peerRef.current) return;
      if (!role) return;
      const toUserId = role === "mentor" ? etudiantId : mentorId;
      const offer = await peerRef.current.createOffer();
      await client.signal({ conversationId: p.conversationId, toUserId, data: offer });
    });

    client.onSignal(async (s) => {
      const data = s.data as any;
      if (data?.type === "offer" || data?.type === "answer") {
        // If we receive an offer before we've created a peer (callee side),
        // accept and initialize WebRTC now.
        if (data.type === "offer" && !peerRef.current) {
          if (!client || !conversationId || !role) return;

          let stream: MediaStream | null = null;
          try {
            stream = await tryGetMediaStream();
            if (!stream) throw new Error("MEDIA_UNAVAILABLE");
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            setMediaError(null);
          } catch (e: any) {
            // Best-effort: allow the call to proceed even without local media.
            localStreamRef.current = null;
            if (localVideoRef.current) localVideoRef.current.srcObject = null;
            setMediaError(e?.message ?? "MEDIA_UNAVAILABLE");
          }

          const peer = new WebRtcPeer();
          peerRef.current = peer;
          setCallAccepted(true);

          peer.onTrack = (remoteStream) => {
            // eslint-disable-next-line no-console
            console.log("[webrtc] onTrack", remoteStream.getTracks().map((t) => `${t.kind}:${t.readyState}`));
            setRemoteStreamSeen(true);
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
          };

          peer.onIceCandidate = async (candidate) => {
            const toUserId = role === "mentor" ? etudiantId : mentorId;
            await client.signal({ conversationId: s.conversationId, toUserId, data: { candidate: candidate.toJSON() } });
          };

          if (stream) peer.addLocalStream(stream);
          // eslint-disable-next-line no-console
          console.log("[webrtc] local tracks", stream ? stream.getTracks().map((t) => `${t.kind}:${t.readyState}`) : []);
        }

        if (!peerRef.current) return;

        await peerRef.current.setRemoteDescription(data);

        if (data.type === "offer") {
          const answer = await peerRef.current.createAnswer();
          await client.signal({ conversationId: s.conversationId, toUserId: s.fromUserId, data: answer });
          await client.markCallConnected({ conversationId: s.conversationId });
        }
      }

      if (data?.candidate) {
        if (!peerRef.current) return;
        await peerRef.current.addIceCandidate(data.candidate);
      }
    });

    client.registerPresence();

    return () => {
      client.disconnect();
    };
  }, [client]);

  async function acceptIncomingCall() {
    if (!client || !conversationId || !role) return;
    if (peerRef.current) {
      setCallAccepted(true);
      return;
    }

    let stream: MediaStream | null = null;
    try {
      stream = await tryGetMediaStream();
      if (!stream) throw new Error("MEDIA_UNAVAILABLE");
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setMediaError(null);
    } catch (e: any) {
      localStreamRef.current = null;
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      setMediaError(e?.message ?? "MEDIA_UNAVAILABLE");
    }

    const peer = new WebRtcPeer();
    peerRef.current = peer;
    setCallAccepted(true);

    peer.onTrack = (remoteStream) => {
      // eslint-disable-next-line no-console
      console.log("[webrtc] onTrack", remoteStream.getTracks().map((t) => `${t.kind}:${t.readyState}`));
      setRemoteStreamSeen(true);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    };

    peer.onIceCandidate = async (candidate) => {
      const toUserId = role === "mentor" ? etudiantId : mentorId;
      await client.signal({ conversationId, toUserId, data: { candidate: candidate.toJSON() } });
    };

    if (stream) peer.addLocalStream(stream);
    // eslint-disable-next-line no-console
    console.log("[webrtc] local tracks", stream ? stream.getTracks().map((t) => `${t.kind}:${t.readyState}`) : []);

    await client.acceptCall({ conversationId });
  }

  async function send() {
    if (!client || !conversationId || !role) return;
    const toRole: UserRole = role === "mentor" ? "etudiant" : "mentor";
    const toUserId = role === "mentor" ? etudiantId : mentorId;

    await client.sendMessage({ conversationId, toUserId, toRole, text });
    setText("");
  }

  async function startVideo() {
    if (!client || !conversationId || !role) return;

    let stream: MediaStream | null = null;
    try {
      stream = await tryGetMediaStream();
      if (!stream) throw new Error("MEDIA_UNAVAILABLE");
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setMediaError(null);
    } catch (e: any) {
      localStreamRef.current = null;
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      setMediaError(e?.message ?? "MEDIA_UNAVAILABLE");
    }

    const peer = new WebRtcPeer();
    peerRef.current = peer;
    setCallAccepted(true);

    peer.onTrack = (remoteStream) => {
      // eslint-disable-next-line no-console
      console.log("[webrtc] onTrack", remoteStream.getTracks().map((t) => `${t.kind}:${t.readyState}`));
      setRemoteStreamSeen(true);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    };

    peer.onIceCandidate = async (candidate) => {
      const toUserId = role === "mentor" ? etudiantId : mentorId;
      await client.signal({ conversationId, toUserId, data: { candidate: candidate.toJSON() } });
    };

    if (stream) peer.addLocalStream(stream);
    // eslint-disable-next-line no-console
    console.log("[webrtc] local tracks", stream ? stream.getTracks().map((t) => `${t.kind}:${t.readyState}`) : []);

    await client.startCall({ mentorId, etudiantId });

    const offer = await peer.createOffer();
    const toUserId = role === "mentor" ? etudiantId : mentorId;
    await client.signal({ conversationId, toUserId, data: offer });
  }

  async function hangup() {
    if (!client || !conversationId) return;

    peerRef.current?.close();
    peerRef.current = null;

    if (localStreamRef.current) {
      for (const t of localStreamRef.current.getTracks()) t.stop();
      localStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    await client.endCall({ conversationId, reason: "ended" });
    setCallAccepted(false);
    setMediaError(null);
    setRemoteStreamSeen(false);
  }

  const joined = Boolean(conversationId);
  const isRinging = call?.state === "ringing";

  return (
    <div className="min-h-screen" style={{ background: "#F8F7FF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-3">
            <h1 style={{ color: "#1a1035", fontWeight: 900, letterSpacing: "-0.03em", fontSize: "2rem" }}>
              Mentorat
            </h1>
            <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
              Retour
            </Button>
          </div>

          {auth.status !== "authenticated" ? (
            <div
              className="mt-6 rounded-2xl border p-6"
              style={{ background: "#FFFFFF", borderColor: "rgba(124,58,237,0.12)" }}
            >
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Connecte-toi pour accéder au chat et à la visio.
              </p>
              <div className="mt-4">
                <Button type="button" onClick={() => navigate("/login")}>
                  Aller à la connexion
                </Button>
              </div>
            </div>
          ) : !mentorId || !etudiantId ? (
            <div
              className="mt-6 rounded-2xl border p-6"
              style={{ background: "#FFFFFF", borderColor: "rgba(124,58,237,0.12)" }}
            >
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Ouvre le mentorat depuis la fiche d’un mentor pour démarrer une conversation.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {(joining || joinError) && (
                <div
                  className="rounded-2xl border px-4 py-3"
                  style={{ background: "#FFFFFF", borderColor: "rgba(124,58,237,0.12)" }}
                >
                  {joining ? (
                    <p className="text-sm" style={{ color: "#6B7280" }}>
                      Connexion en cours…
                    </p>
                  ) : joinError ? (
                    <p className="text-sm" style={{ color: "#B91C1C" }}>
                      Impossible de rejoindre la conversation: {joinError}
                    </p>
                  ) : null}
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-4">
                {/* Chat */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: "#FFFFFF", borderColor: "rgba(124,58,237,0.12)" }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(124,58,237,0.10)" }}>
                    <div className="text-sm" style={{ color: "#1a1035", fontWeight: 900 }}>
                      Chat
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                      {joined ? "Connecté" : "En attente"}
                    </div>
                  </div>

                  <div className="p-4 h-72 overflow-auto">
                    {messages.length === 0 ? (
                      <p className="text-sm" style={{ color: "#9CA3AF" }}>
                        Aucun message pour le moment.
                      </p>
                    ) : (
                      <div className="grid gap-2">
                        {messages.map((m) => {
                          const isMe = m.fromUserId === auth.user?.id;
                          return (
                            <div key={m.id} className={isMe ? "flex justify-end" : "flex justify-start"}>
                              <div
                                className="max-w-[85%] rounded-2xl px-3 py-2 border"
                                style={{
                                  background: isMe ? "#EDE9FE" : "#FFFFFF",
                                  borderColor: isMe ? "rgba(124,58,237,0.18)" : "rgba(0,0,0,0.06)",
                                }}
                              >
                                <div className="text-xs" style={{ color: "#9CA3AF" }}>
                                  {m.createdAt}
                                </div>
                                <div className="text-sm" style={{ color: "#1F2937", fontWeight: 600 }}>
                                  {m.text}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t" style={{ borderColor: "rgba(124,58,237,0.10)" }}>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") send();
                        }}
                        className="flex-1 h-10 rounded-xl border px-3 text-sm outline-none"
                        placeholder="Écrire un message…"
                        disabled={!joined}
                        style={{ background: "#FFFFFF", borderColor: "rgba(17,24,39,0.15)" }}
                      />
                      <Button type="button" onClick={send} disabled={!joined || !text.trim()}>
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Visio */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: "#FFFFFF", borderColor: "rgba(124,58,237,0.12)" }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(124,58,237,0.10)" }}>
                    <div className="text-sm" style={{ color: "#1a1035", fontWeight: 900 }}>
                      Visio
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                      État: {call?.state ?? "-"}
                    </div>
                  </div>

                  <div className="p-4 grid gap-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#0B0A12" }}>
                        <div className="px-3 py-2 text-xs" style={{ color: "#E5E7EB", background: "rgba(255,255,255,0.06)" }}>
                          Local
                        </div>
                        <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "100%" }} />
                      </div>
                      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#0B0A12" }}>
                        <div className="px-3 py-2 text-xs" style={{ color: "#E5E7EB", background: "rgba(255,255,255,0.06)" }}>
                          Remote
                        </div>
                        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "100%" }} />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button type="button" onClick={startVideo} disabled={!joined}>
                        Démarrer la visio
                      </Button>
                      <Button
                        type="button"
                        onClick={acceptIncomingCall}
                        disabled={!joined || !isRinging || callAccepted}
                      >
                        Accepter l’appel
                      </Button>
                      <Button type="button" variant="ghost" onClick={hangup} disabled={!joined}>
                        Raccrocher
                      </Button>
                    </div>

                    <p className="text-xs" style={{ color: "#9CA3AF" }}>
                      La visio démarre une fois la conversation rejointe.
                    </p>

                    {!remoteStreamSeen && callAccepted ? (
                      <p className="text-xs" style={{ color: "#9CA3AF" }}>
                        En attente du flux vidéo distant…
                      </p>
                    ) : null}
                  </div>

                  {mediaError ? (
                    <div className="text-xs rounded-lg border px-3 py-2" style={{ background: "#FFFBEB", borderColor: "rgba(245,158,11,0.25)", color: "#92400E" }}>
                      Caméra/micro non accessibles : la visio continue en mode dégradé.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
