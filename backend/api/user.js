import { API_URL } from "../config";

export const loginUser = async (email, password) => {
  await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Failed to login");

  return await response.json();
};

export const registerUser = async (email, password) => {
  await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Failed to register");

  return await response.json();
};
