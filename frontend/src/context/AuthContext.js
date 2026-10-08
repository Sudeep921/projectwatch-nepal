import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  loginUser,
  verifyLoginOTP,
  getCurrentUser
} from "../services/api";


// ========================================
// AUTH CONTEXT
// ========================================

const AuthContext = createContext(null);


// ========================================
// AUTH PROVIDER
// ========================================

export const AuthProvider = ({
  children
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // ======================================
  // LOAD USER
  // ======================================

  useEffect(() => {

    const loadUser = async () => {

      try {

        const token =
          localStorage.getItem(
            "projectwatch_token"
          );

        const savedUser =
          localStorage.getItem(
            "projectwatch_user"
          );


        if (!token) {

          setUser(null);
          setLoading(false);

          return;

        }


        // --------------------------------
        // LOAD SAVED USER
        // --------------------------------

        if (savedUser) {

          try {

            const parsedUser =
              JSON.parse(savedUser);

            if (
              parsedUser &&
              typeof parsedUser === "object"
            ) {

              setUser(
                parsedUser
              );

            }

          } catch (error) {

            console.warn(
              "Invalid saved user data:",
              error
            );

            localStorage.removeItem(
              "projectwatch_user"
            );

          }

        }


        // --------------------------------
        // VERIFY USER
        // --------------------------------

        try {

          const response =
            await getCurrentUser();


          const currentUser =
            response?.data?.user ||
            response?.user ||
            response?.data ||
            response;


          if (
            currentUser &&
            typeof currentUser === "object"
          ) {

            setUser(
              currentUser
            );

            localStorage.setItem(
              "projectwatch_user",
              JSON.stringify(
                currentUser
              )
            );

          }

        } catch (error) {

          console.warn(
            "Could not verify current user:",
            error
          );


          const message =
            error?.message
              ?.toLowerCase() || "";


          if (
            message.includes("invalid") ||
            message.includes("expired") ||
            message.includes("jwt") ||
            message.includes("unauthorized") ||
            message.includes("401")
          ) {

            localStorage.removeItem(
              "projectwatch_token"
            );

            localStorage.removeItem(
              "projectwatch_user"
            );

            setUser(null);

          }

        }

      } catch (error) {

        console.error(
          "AUTH LOAD ERROR:",
          error
        );

        setUser(null);

      } finally {

        setLoading(false);

      }

    };


    loadUser();

  }, []);


  // ========================================
  // LOGIN
  // ========================================

  const login = async (
    email,
    password
  ) => {

    try {

      console.log(
        "AUTH LOGIN START:",
        email
      );


      const response =
        await loginUser(
          email,
          password
        );


      console.log(
        "AUTH LOGIN RESPONSE:",
        response
      );


      const authData =
        response?.data ||
        response;


      const token =
        authData?.token ||
        authData?.accessToken ||
        response?.token ||
        response?.accessToken;


      const loggedInUser =
        authData?.user ||
        response?.user ||
        null;


      // ------------------------------------
      // IMPORTANT: OTP REQUIRED
      // ------------------------------------

      if (
        authData?.requires2FA === true
      ) {

        console.log(
          "2FA REQUIRED - OTP SENT"
        );


        return {
          ...authData,
          token: undefined,
          user: loggedInUser,
          requires2FA: true
        };

      }


      // ------------------------------------
      // NORMAL TOKEN LOGIN
      // ------------------------------------

      if (token) {

        localStorage.setItem(
          "projectwatch_token",
          token
        );

      }


      if (loggedInUser) {

        localStorage.setItem(
          "projectwatch_user",
          JSON.stringify(
            loggedInUser
          )
        );

        setUser(
          loggedInUser
        );

      }


      console.log(
        "AUTH LOGIN SUCCESS:",
        {
          tokenExists: !!token,
          user: loggedInUser
        }
      );


      return {
        ...authData,
        token,
        user: loggedInUser
      };

    } catch (error) {

      console.error(
        "AUTH LOGIN ERROR:",
        error
      );

      throw error;

    }

  };


  // ========================================
  // VERIFY LOGIN OTP
  // ========================================

  const verifyOTP = async (
    email,
    otp
  ) => {

    try {

      console.log(
        "AUTH OTP VERIFY START:",
        email
      );


      const response =
        await verifyLoginOTP(
          email,
          otp
        );


      console.log(
        "AUTH OTP VERIFY RESPONSE:",
        response
      );


      const authData =
        response?.data ||
        response;


      const token =
        authData?.token ||
        authData?.accessToken ||
        response?.token ||
        response?.accessToken;


      const verifiedUser =
        authData?.user ||
        response?.user ||
        null;


      // ------------------------------------
      // TOKEN MUST EXIST
      // ------------------------------------

      if (!token) {

        throw new Error(
          "OTP verified but login token was not received."
        );

      }


      // ------------------------------------
      // SAVE TOKEN
      // ------------------------------------

      localStorage.setItem(
        "projectwatch_token",
        token
      );


      // ------------------------------------
      // SAVE USER
      // ------------------------------------

      if (verifiedUser) {

        localStorage.setItem(
          "projectwatch_user",
          JSON.stringify(
            verifiedUser
          )
        );

        setUser(
          verifiedUser
        );

      }


      console.log(
        "AUTH OTP VERIFY SUCCESS:",
        {
          tokenExists: !!token,
          user: verifiedUser
        }
      );


      return {
        ...authData,
        token,
        user: verifiedUser
      };

    } catch (error) {

      console.error(
        "AUTH OTP VERIFY ERROR:",
        error
      );

      throw error;

    }

  };


  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {

    try {

      localStorage.removeItem(
        "projectwatch_token"
      );

      localStorage.removeItem(
        "projectwatch_user"
      );

    } catch (error) {

      console.error(
        "LOGOUT ERROR:",
        error
      );

    }


    setUser(null);

  };


  // ========================================
  // UPDATE USER
  // ========================================

  const updateUser = (
    updatedUser
  ) => {

    setUser(
      updatedUser
    );


    if (updatedUser) {

      localStorage.setItem(
        "projectwatch_user",
        JSON.stringify(
          updatedUser
        )
      );

    } else {

      localStorage.removeItem(
        "projectwatch_user"
      );

    }

  };


  // ========================================
  // CONTEXT VALUE
  // ========================================

  const value = {

    user,

    loading,

    login,

    // IMPORTANT
    verifyLoginOTP: verifyOTP,

    logout,

    setUser: updateUser

  };


  // ========================================
  // PROVIDER
  // ========================================

  return React.createElement(
    AuthContext.Provider,
    {
      value
    },
    children
  );

};


// ========================================
// USE AUTH
// ========================================

export const useAuth = () => {

  const context =
    useContext(
      AuthContext
    );


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }


  return context;

};


export default AuthContext;