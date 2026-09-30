import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  loginUser,
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


        // --------------------------------
        // NO TOKEN
        // --------------------------------

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
        // VERIFY USER FROM BACKEND
        // --------------------------------

        try {

          const response =
            await getCurrentUser();


          /*
            Supported responses:

            {
              user: {...}
            }

            OR

            {
              data: {
                user: {...}
              }
            }

            OR

            {
              data: {...user}
            }
          */

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


          // --------------------------------
          // INVALID TOKEN
          // --------------------------------

          const message =
            error?.message
              ?.toLowerCase() || "";


          if (
            message.includes(
              "invalid"
            ) ||
            message.includes(
              "expired"
            ) ||
            message.includes(
              "jwt"
            ) ||
            message.includes(
              "unauthorized"
            ) ||
            message.includes(
              "401"
            )
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


      // ------------------------------------
      // LOGIN API
      // ------------------------------------

      const response =
        await loginUser(
          email,
          password
        );


      console.log(
        "AUTH LOGIN RESPONSE:",
        response
      );


      /*
        Supported response formats:

        {
          token,
          user
        }

        OR

        {
          data: {
            token,
            user
          }
        }
      */

      const authData =
        response?.data ||
        response;


      // ------------------------------------
      // TOKEN
      // ------------------------------------

      const token =
        authData?.token ||
        authData?.accessToken ||
        response?.token ||
        response?.accessToken;


      // ------------------------------------
      // USER
      // ------------------------------------

      const loggedInUser =
        authData?.user ||
        response?.user ||
        null;


      // ------------------------------------
      // SAVE TOKEN
      // ------------------------------------

      if (token) {

        localStorage.setItem(
          "projectwatch_token",
          token
        );

      }


      // ------------------------------------
      // SAVE USER
      // ------------------------------------

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


      // ------------------------------------
      // CHECK LOGIN DATA
      // ------------------------------------

      if (!token) {

        console.warn(
          "Login successful but token was not found."
        );

      }


      if (!loggedInUser) {

        console.warn(
          "Login successful but user data was not found."
        );

      }


      // ------------------------------------
      // LOGIN SUCCESS LOG
      // ------------------------------------

      console.log(
        "AUTH LOGIN SUCCESS:",
        {
          tokenExists: !!token,
          user: loggedInUser
        }
      );


      // ------------------------------------
      // RETURN LOGIN RESULT
      // ------------------------------------

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
  // LOGOUT
  // ========================================

  const logout = () => {

    try {

      // ------------------------------------
      // REMOVE AUTH TOKEN
      // ------------------------------------

      localStorage.removeItem(
        "projectwatch_token"
      );


      // ------------------------------------
      // REMOVE SAVED USER
      // ------------------------------------

      localStorage.removeItem(
        "projectwatch_user"
      );


    } catch (error) {

      console.error(
        "LOGOUT ERROR:",
        error
      );

    }


    // --------------------------------------
    // CLEAR REACT USER STATE
    // --------------------------------------

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


// ========================================
// EXPORT
// ========================================

export default AuthContext;