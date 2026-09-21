import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({
  children
}) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem(
        "projectwatch_token"
      );

    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);

          localStorage.setItem(
            "projectwatch_user",
            JSON.stringify(data.user)
          );
        }
      })
      .catch((error) => {
        console.error(
          "Authentication check failed:",
          error
        );

        logoutUser();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (
    email,
    password
  ) => {
    const data = await loginUser(
      email,
      password
    );

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

      setUser(data.user);
    }

    return data;
  };

  const register = async (
    userData
  ) => {
    const data =
      await registerUser(userData);

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

      setUser(data.user);
    }

    return data;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const contextValue = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user)
  };

  return React.createElement(
    AuthContext.Provider,
    {
      value: contextValue
    },
    children
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};