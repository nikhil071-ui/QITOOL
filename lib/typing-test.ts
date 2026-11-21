export const typingPassages = [
  "A clear plan turns a difficult task into a series of small steps. Take your time, watch the punctuation, and aim for steady accuracy before increasing your speed.",
  "Good tools should make useful work feel simpler. They explain what they do, show results clearly, and leave people in control of the choices that come next.",
  "Practice builds confidence through repetition. A comfortable rhythm, relaxed hands, and careful attention often matter more than rushing through every line.",
];

export function typingPassageIndexForStart(currentIndex: number, hasPreviousStart: boolean): number {
  return hasPreviousStart ? (currentIndex + 1) % typingPassages.length : currentIndex;
}
