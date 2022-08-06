import { createContext, useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logInWithEmailAndPassword, logout } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user] = useAuthState(auth);

  const userLogin = async (email, password) => {
    const err = await logInWithEmailAndPassword(email, password);
    if (err) {
      alert(err);
    }
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
