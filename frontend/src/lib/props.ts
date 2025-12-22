export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ErrorResponse {
  message: string;
  status: number;
}
