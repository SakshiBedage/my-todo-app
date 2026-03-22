import React, { useEffect, useState } from "react";
import { refreshToken as refreshApi } from "../services/api";
import type { User } from "../types/user";

interface SessionManagerProps {
  user: User;
  onLogout: () => void;
  onSessionRefresh: (newUser: User) => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({
  user,
  onLogout,
  onSessionRefresh,
}) => {
  const [showTokenWarning, setShowTokenWarning] = useState(false);
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // 1. IDLE LOGOUT (1 Minutes)
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      setShowIdleWarning(false);

      idleTimer = setTimeout(
        () => {
          setShowIdleWarning(true);
        },
        1 * 60 * 1000,
      );
    };

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keypress", resetIdleTimer);
    resetIdleTimer();

    return () => {
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keypress", resetIdleTimer);
      clearTimeout(idleTimer);
    };
  }, []);

  // 2. TOKEN EXPIRATION (Shows warning at 29:30)
  useEffect(() => {
    const warningTime = (5 * 60 - 30) * 1000;
    const logoutTime = 5 * 60 * 1000;

    const warnTimer = setTimeout(() => setShowTokenWarning(true), warningTime);
    const autoLogoutTimer = setTimeout(onLogout, logoutTime);

    return () => {
      clearTimeout(warnTimer);
      clearTimeout(autoLogoutTimer);
    };
  }, [user.accessToken, onLogout]);

  // 3. 30-SECOND COUNTDOWN LOGIC
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if ((showTokenWarning || showIdleWarning) && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      onLogout();
    }
    return () => clearInterval(interval);
  }, [showTokenWarning, showIdleWarning, timeLeft, onLogout]);

  const handleRefresh = async () => {
    try {
      const data = await refreshApi(user.refreshToken);
      onSessionRefresh(data);
      setShowTokenWarning(false);
      setShowIdleWarning(false);
      setTimeLeft(30);
    } catch (err) {
      onLogout();
    }
  };

  // If no warnings are active, don't render anything
  if (!showTokenWarning && !showIdleWarning) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border-t-8 border-red-600 transform animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight">
          {showIdleWarning ? "Are you there?" : "Session Expiring"}
        </h2>

        <p className="text-gray-600 mb-6">
          {showIdleWarning
            ? "We noticed you've been inactive."
            : "Your security token is about to expire."}
          <br />
          Logging out in{" "}
          <span className="text-red-600 font-bold text-xl">{timeLeft}s</span>
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRefresh}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95"
          >
            STAY LOGGED IN
          </button>
          <button
            onClick={onLogout}
            className="text-gray-400 font-semibold hover:text-red-600 transition-colors"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionManager;
