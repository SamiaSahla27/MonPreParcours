import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { RealtimeClient, type ChatMessage, type CallSession, type UserRole } from "../services/realtimeClient";
import { WebRtcPeer } from "../services/webrtcPeer";
import { useNavigate } from "react-router";
import { useAuth } from "../services/authStore";

const DEFAULT_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

export function Mentorat() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [backendUrl, setBackendUrl] = useState(DEFAULT_BASE_URL);
  const [mentorId, setMentorId] = useState("m1");
  const [etudiantId, setEtudiantId] = useState("e1");

  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  const [call, setCall] = useState<CallSession | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<WebRtcPeer | null>(null);

  const client = useMemo(() => {
    if (!auth.token) return null;
    return new RealtimeClient({ baseUrl: backendUrl, token: auth.token });
  }, [backendUrl, auth.token]);

  const role = auth.user?.role as UserRole | undefined;

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

    client.onSignal(async (s) => {
      if (!peerRef.current) return;

      const data = s.data as any;
      if (data?.type === "offer" || data?.type === "answer") {
        await peerRef.current.setRemoteDescription(data);

        if (data.type === "offer") {
          const answer = await peerRef.current.createAnswer();
          await client.signal({ conversationId: s.conversationId, toUserId: s.fromUserId, data: answer });
          await client.markCallConnected({ conversationId: s.conversationId });
        }
      }

      if (data?.candidate) {
        await peerRef.current.addIceCandidate(data);
      }
    });

    client.registerPresence();

    return () => {
      client.disconnect();
    };
  }, [client]);

  async function connectAndJoin() {
    if (!client) return;
    await client.joinConversation(mentorId, etudiantId);
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

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    const peer = new WebRtcPeer();
    peerRef.current = peer;

    peer.onTrack = (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    };

    peer.onIceCandidate = async (candidate) => {
      const toUserId = role === "mentor" ? etudiantId : mentorId;
      await client.signal({ conversationId, toUserId, data: candidate.toJSON() });
    };

    peer.addLocalStream(stream);

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
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Mentorat (Chat + Visio)
      </Typography>

      {auth.status !== "authenticated" ? (
        <Stack spacing={2} sx={{ maxWidth: 900 }}>
          <Typography variant="body1">Connecte-toi pour accéder au mentorat.</Typography>
          <Button variant="contained" onClick={() => navigate("/login")}>
            Aller à la connexion
          </Button>
        </Stack>
      ) : (

      <Stack spacing={2} sx={{ maxWidth: 900 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Backend URL" value={backendUrl} onChange={(e) => setBackendUrl(e.target.value)} fullWidth />
          <TextField label="Utilisateur" value={`${auth.user?.role} — ${auth.user?.email}`} disabled fullWidth />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="mentorId" value={mentorId} onChange={(e) => setMentorId(e.target.value)} />
          <TextField label="etudiantId" value={etudiantId} onChange={(e) => setEtudiantId(e.target.value)} />
          <Button variant="contained" onClick={connectAndJoin}>
            Joindre
          </Button>
        </Stack>

        <Typography variant="body2">Conversation: {conversationId || "(non join)"}</Typography>

        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2, height: 220, overflow: "auto" }}>
          {messages.map((m) => (
            <Box key={m.id} sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {m.createdAt} — {m.fromRole}:{m.fromUserId}
              </Typography>
              <Typography variant="body2">{m.text}</Typography>
            </Box>
          ))}
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Message" value={text} onChange={(e) => setText(e.target.value)} fullWidth />
          <Button variant="contained" onClick={send} disabled={!conversationId}>
            Envoyer
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="outlined" onClick={startVideo} disabled={!conversationId}>
            Démarrer visio
          </Button>
          <Button variant="outlined" onClick={hangup} disabled={!conversationId}>
            Raccrocher
          </Button>
          <Typography variant="body2">État appel: {call?.state ?? "-"}</Typography>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2">Local</Typography>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "100%" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2">Remote</Typography>
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "100%" }} />
          </Box>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          La conversation est autorisée uniquement si ton utilisateur correspond au rôle + id fournis (règle de pairing).
        </Typography>
      </Stack>

      )}
    </Box>
  );
}
