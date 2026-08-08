import { useEffect, useState } from "react";
import {
  getCurrentUser,
  uploadAvatar,
  deleteAvatar,
  logoutUser,
} from "../services/api";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "https://placehold.co/250x250?text=No+Image";

export default function Profile() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  async function loadProfile() {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    try {
      const data = await getCurrentUser();

      if (!data.success) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setUser(data.user);
    } catch (err) {
      if (err?.message === "ACCESS_TOKEN_EXPIRED") return;
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  useEffect(() => {
    loadProfile();

    function handleTokenRefreshed() {
      loadProfile();
    }

    window.addEventListener("token-refreshed", handleTokenRefreshed);

    return () => {
      window.removeEventListener("token-refreshed", handleTokenRefreshed);
    };
  }, []);

  async function changeAvatar(e) {
    const file = e.target.files[0];

    if (!file) return;

    await uploadAvatar(file);

    loadProfile();
  }

  async function removeAvatar() {
    await deleteAvatar();

    loadProfile();
  }

  async function logout() {
    await logoutUser();

    localStorage.removeItem("token");

    navigate("/login");
  }

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="profileContainer">
      <div className="profileCard">
        <img
          className="profileAvatar"
          src={user.avatar?.url || DEFAULT_AVATAR}
          alt="avatar"
          referrerPolicy="no-referrer"
        />

        <h2>{user.name}</h2>

        <p>{user.email}</p>

        <h3>Total Todos</h3>

        <h2>{user.todos.length}</h2>

        <label className="uploadBtn">
          Change Avatar
          <input hidden type="file" accept="image/*" onChange={changeAvatar} />
        </label>

        {user.avatar && (
          <button className="deleteAvatarBtn" onClick={removeAvatar}>
            Delete Avatar
          </button>
        )}

        <button onClick={() => navigate("/todo")}>Back To Todos</button>

        <button className="logoutBtn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
