import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router";
import { api } from "../api/apiClient";
import { useAuth } from "../provider/AuthProvider";

export default function Login() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") nav("/admin", { replace: true });
      else if (user.role === "volunteer") nav("/volunteer", { replace: true });
      else nav("/dashboard", { replace: true });
    }
  }, [user, nav]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      localStorage.setItem("redsaver_token", token);

      await api.post("/users", {
        email: cred.user.email,
        name: cred.user.displayName || "",
        avatar: cred.user.photoURL || "",
      });

      const res = await api.get(`/users/${cred.user.email}`);
      const dbUser = res.data;

      if (dbUser?.role === "admin") nav("/admin", { replace: true });
      else if (dbUser?.role === "volunteer") nav("/volunteer", { replace: true });
      else nav("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="flex flex-col md:flex-row items-center md:justify-center gap-8 w-full max-w-4xl">
        <div className="flex-1 flex justify-center">
          <img
            src="https://img.freepik.com/premium-vector/blood-donation-illustration-concept-social-media-post_562076-1166.jpg?uid=R150327528&ga=GA1.1.831263510.1760181755&semt=ais_hybrid&w=740&q=80"
            alt="Blood Donation"
            className="rounded-lg shadow-lg w-full max-w-md object-cover"
          />
        </div>

        <form
          onSubmit={handleLogin}
          className="card flex-1 w-full max-w-md bg-base-100 shadow-xl rounded-lg p-6"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-error">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full mb-4"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full mb-6"
            required
          />

          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
