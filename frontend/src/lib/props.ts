export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  prompt: string;
  model: string;
  monthlyCost: number;
  totalCost: number;
}

export interface ErrorResponse {
  message: string;
  status: number;
}
