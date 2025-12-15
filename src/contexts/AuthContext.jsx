import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut as fbSignOut } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() { return useContext(AuthContext); }

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const token = await u.getIdToken();
        localStorage.setItem("redsaver_token", token);
        setUser(u);
      } else {
        localStorage.removeItem("redsaver_token");
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signOut() {
    await fbSignOut(auth);
    localStorage.removeItem("redsaver_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
