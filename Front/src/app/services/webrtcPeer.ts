export type WebRtcConfig = {
  iceServers?: RTCIceServer[];
};

export class WebRtcPeer {
  private pc: RTCPeerConnection;

  onTrack?: (stream: MediaStream) => void;
  onIceCandidate?: (candidate: RTCIceCandidate) => void;

  constructor(config?: WebRtcConfig) {
    this.pc = new RTCPeerConnection({ iceServers: config?.iceServers });

    this.pc.ontrack = (ev) => {
      const [stream] = ev.streams;
      if (stream) this.onTrack?.(stream);
    };

    this.pc.onicecandidate = (ev) => {
      if (ev.candidate) this.onIceCandidate?.(ev.candidate);
    };
  }

  addLocalStream(stream: MediaStream) {
    for (const track of stream.getTracks()) {
      this.pc.addTrack(track, stream);
    }
  }

  async createOffer() {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return offer;
  }

  async createAnswer() {
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    return answer;
  }

  async setRemoteDescription(desc: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(desc);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    await this.pc.addIceCandidate(candidate);
  }

  close() {
    this.pc.close();
  }
}
