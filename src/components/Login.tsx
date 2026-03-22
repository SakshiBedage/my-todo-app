import React, { useState } from "react";
import { loginUser } from "../services/api";
import type { User } from "../types/user";

interface LoginProps {
  onLoginSuccess: (userData: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }
    try {
      const data: User = await loginUser(username, password);

      sessionStorage.setItem("accessToken", data.accessToken);

      onLoginSuccess(data);
    } catch (err: any) {
      setError(err.message);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-xl rounded-2xl w-96 border border-gray-100"
      >
        <h2 className="text-2xl font-black text-red-600 mb-6 uppercase tracking-tight text-center">
          System Login
        </h2>
        <div className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none border-gray-200"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none border-gray-200"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="mb-4 p-3 text-sm font-bold bg-red-50 text-red-600 border border-red-200 rounded-lg animate-pulse">
              ⚠️ {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
          >
            LOG IN
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
