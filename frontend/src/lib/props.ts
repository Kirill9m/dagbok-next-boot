export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  prompt: string;
  model: string;
}

export interface ErrorResponse {
  message: string;
  status: number;
}
