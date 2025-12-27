export interface User {
  prompt: string;
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

export interface ErrorResponse {
  message: string;
  status: number;
}
