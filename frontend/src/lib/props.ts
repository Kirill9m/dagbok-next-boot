interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ErrorResponse {
  message: string;
  status: number;
}
