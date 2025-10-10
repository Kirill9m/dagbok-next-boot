interface User {
  name: string;
  email: string;
}

const CheckAuthStatus = (): User | null => {
  const isAuthenticated = true;

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
