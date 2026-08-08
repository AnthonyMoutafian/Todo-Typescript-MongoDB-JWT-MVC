import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Todo from "./components/Todo";
import Profile from "./components/Profile";

const API = import.meta.env.VITE_API_URL;

function AppContent() {
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    function handleSessionExpired() {
      setShowPopup(true);
    }

    function handleForceLogout() {
      localStorage.removeItem("token");

      setShowPopup(false);

      navigate("/login");
    }

    function checkTokenExpiry() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const payloadBase64 = token.split(".")[1];
        if (!payloadBase64) return;
        const decoded = JSON.parse(atob(payloadBase64));

        if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
          setShowPopup(true);
        }
      } catch {
      }
    }

    window.addEventListener("session-expired", handleSessionExpired);
    window.addEventListener("force-logout", handleForceLogout);

    const interval = setInterval(checkTokenExpiry, 1000);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
      window.removeEventListener("force-logout", handleForceLogout);
      clearInterval(interval);
    };
  }, [navigate]);

  async function staySignedIn() {
    try {
      const res = await fetch(`${API}/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Refresh failed");
      }

      const data = await res.json();

      localStorage.setItem("token", data.accessToken);

      setShowPopup(false);

      window.dispatchEvent(new Event("token-refreshed"));
    } catch {
      logout();
    }
  }

  async function logout() {
    try {
      await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    localStorage.removeItem("token");

    setShowPopup(false);

    navigate("/login");
  }

  return (
    <>
      {showPopup && (
        <div className="popupOverlay">
          <div className="sessionPopup">
            <h2>Session Expired</h2>

            <p>Your access token expired. Do you want to continue?</p>

            <div className="popupButtons">
              <button className="stayBtn" onClick={staySignedIn}>
                Stay Signed In
              </button>

              <button className="logoutBtn" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/todo" element={<Todo />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
