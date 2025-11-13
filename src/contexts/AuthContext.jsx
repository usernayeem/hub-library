import React, { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

// Create authentication context
export const AuthContext = createContext();
const auth = getAuth(app);

export const AuthProvider = ({ children }) => {
  // State for current user and loading status
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  // Register new user with email and password
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login existing user with email and password
  const Login = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google auth provider setup
  const provider = new GoogleAuthProvider();

  // Login with Google popup
  const googleAuth = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  // Logout current user
  const Logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Context value object with auth methods and state
  const userData = {
    auth,
    user,
    setUser,
    registerUser,
    Login,
    Logout,
    googleAuth,
    loading,
  };

  return (
    <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
  );
};
