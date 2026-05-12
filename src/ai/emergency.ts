const emergencyKeywords = [
  "chest pain",
  "can't breathe",
  "difficulty breathing",
  "suicide",
  "unconscious",
  "stroke",
  "severe bleeding",
  "heart attack",
];

export function detectEmergency(text: string): boolean {
  const lower = text.toLowerCase();

  return emergencyKeywords.some(keyword =>
    lower.includes(keyword)
  );
}

