export interface User {
  username: string;
  role: "ADMIN" | "USER" | "DEMO";
  prompt: string;
  model: string;
  monthlyCost: number;
  totalCost: number;
}
