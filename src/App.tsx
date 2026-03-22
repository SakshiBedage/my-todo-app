import React, { useState, useCallback } from "react";
import type { User } from "./types/user";
import TodoIndex from "./components/TodoApp";
import Login from "./components/Login";
import SessionManager from "./services/SessionManager";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedToken = sessionStorage.getItem("accessToken");
    const savedUser = sessionStorage.getItem("userData");

    if (savedToken && savedUser) {
      try {
        return JSON.parse(savedUser) as User;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userData");
    setUser(null);
  }, []);

  const handleSessionRefresh = (updatedTokenData: User) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      const mergedUser: User = {
        ...prevUser,
        accessToken: updatedTokenData.accessToken,
        refreshToken: updatedTokenData.refreshToken,
      };

      sessionStorage.setItem("accessToken", mergedUser.accessToken);
      sessionStorage.setItem("userData", JSON.stringify(mergedUser));

      return mergedUser;
    });
  };

  if (!user) {
    return (
      <Login
        onLoginSuccess={(data: User) => {
          sessionStorage.setItem("accessToken", data.accessToken);
          sessionStorage.setItem("userData", JSON.stringify(data));
          setUser(data);
        }}
      />
    );
  }

  return (
    <div className="relative">
      <SessionManager
        user={user}
        onLogout={handleLogout}
        onSessionRefresh={handleSessionRefresh}
      />
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <span className="text-xs font-bold text-gray-500 uppercase">
          Hi, {user.firstName}
        </span>
        <button
          onClick={handleLogout}
          className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-3 py-1 rounded text-xs font-bold transition-colors"
        >
          Logout
        </button>
      </div>
      <TodoIndex />
    </div>
  );
};

export default App;
