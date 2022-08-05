import { createContext, useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logInWithEmailAndPassword, logout } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user] = useAuthState(auth);

  const userLogin = (email, password) => {
    logInWithEmailAndPassword(email, password);
  };

  const userLogout = () => {
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        userLogin,
        userLogout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
