export function conversationIdFor(mentorId: string, etudiantId: string) {
  return `mentor:${mentorId}|etudiant:${etudiantId}`;
}
