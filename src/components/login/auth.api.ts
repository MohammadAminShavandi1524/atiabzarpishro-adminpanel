export interface LoginBody {
  email: string;
  password: string;
}

export const login = async (body: LoginBody) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const logout = async () => {
  const response = await fetch("/api/logout", {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
