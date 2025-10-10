interface User {
  id: string;
  name: string;
  email: string;
}

/**
 + * Temporary stub implementation for auth checking.
 + * TODO: Replace with real authentication logic that:
 + * - Validates JWT tokens or session cookies
 + * - Fetches actual user data from auth provider
 + * - Handles token expiry and errors
 + */
const CheckAuthStatus = (): User | null => {
  const isAuthenticated = false;

  if (isAuthenticated) {
    return {
      id: "1",
      name: "user",
      email: "user@email",
    };
  }
  return null;
};

export default CheckAuthStatus;
