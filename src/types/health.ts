export interface SymptomCheck {
  severity: "low" | "medium" | "high";
  symptoms: string[];
  recommendation: string;
}

