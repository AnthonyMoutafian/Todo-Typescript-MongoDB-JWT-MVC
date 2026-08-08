import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function changeHandler(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  async function submitHandler(e) {
    e.preventDefault();

    setError("");

    try {
      const data = await loginUser(user);

      if (!data.success) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.accessToken);

      navigate("/todo");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="loginBox">
      <form className="formBoxLogin" onSubmit={submitHandler}>
        {error && <p>{error}</p>}
        <a className="registerLink" href="/register">
          Register <i className="bi bi-arrow-right"></i>
        </a>

        <input
          placeholder="Enter Email"
          type="email"
          name="email"
          value={user.email}
          onChange={changeHandler}
        />

        <input
          placeholder="Enter Password"
          type="password"
          name="password"
          value={user.password}
          onChange={changeHandler}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
