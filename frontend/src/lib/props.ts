export interface User {
  id: string;
  username: string;
  role: "ADMIN" | "USER" | "DEMO";
  prompt: string;
  model: string;
  monthlyCost: number;
  totalCost: number;
}

export interface ErrorResponse {
  message: string;
  status: number;
}
