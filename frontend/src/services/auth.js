import {
  loginUser,
  registerUser,
  getCurrentUser
} from "./api";

export const login = async (email, password) => {
  const data = await loginUser(email, password);

  if (data.token) {
    localStorage.setItem(
      "projectwatch_token",
      data.token
    );
  }

  if (data.user) {
    localStorage.setItem(
      "projectwatch_user",
      JSON.stringify(data.user)
    );
  }

  return data;
};

export const register = async (userData) => {
  return await registerUser(userData);
};

export const getLoggedInUser = async () => {
  return await getCurrentUser();
};

export const logout = () => {
  localStorage.removeItem(
    "projectwatch_token"
  );

  localStorage.removeItem(
    "projectwatch_user"
  );

  window.location.href = "/";
};

export const isLoggedIn = () => {
  return !!localStorage.getItem(
    "projectwatch_token"
  );
};