import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../firebaseConfig";
import { api } from "../api/apiClient";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken(true);
          localStorage.setItem("redsaver_token", token);

          const res = await api.get(`/users/${firebaseUser.email}`);
          const dbUser = res.data;

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: dbUser?.role || "donor",
          });
        } else {
          setUser(null);
          localStorage.removeItem("redsaver_token");
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem("redsaver_token");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("redsaver_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
