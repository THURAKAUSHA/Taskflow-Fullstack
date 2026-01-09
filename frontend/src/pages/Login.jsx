import { useState } from "react";
import api from "../api/axios";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        // REGISTER
        await api.post("accounts/register/", {
          username,
          password,
        });
      }

      // LOGIN (after register OR normal login)
      const res = await api.post("accounts/login/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      onLogin();
    } catch {
      setError(isSignup ? "Sign up failed" : "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-2 text-center">
            {error}
          </p>
        )}

        <input
          className="w-full mb-3 p-2 rounded text-black"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full mb-4 p-2 rounded text-black"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-green-500 py-2 rounded font-semibold mb-3">
          {isSignup ? "Create Account" : "Login"}
        </button>

        <p
          className="text-sm text-center text-gray-400 cursor-pointer"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </p>
      </form>
    </div>
  );
}
