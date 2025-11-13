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

export const AuthContext = createContext();
const auth = getAuth(app);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const provider = new GoogleAuthProvider();

  const googleAuth = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  const Logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  const fetchUserRole = async (uid) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    try {
      const response = await fetch(`${apiUrl}/api/users/${uid}`);

      if (!response.ok) {
        console.error("Failed to fetch user role");
        return null;
      }

      const userData = await response.json();
      return userData.role || "viewer";
    } catch (error) {
      console.error("Error fetching user role:", error);
      return "viewer";
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const role = await fetchUserRole(currentUser.uid);
        setUser({
          ...currentUser,
          role: role,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const userData = {
    auth,
    user,
    setUser,
    registerUser,
    loginUser,
    Logout,
    googleAuth,
    loading,
  };

  return (
    <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
  );
};
