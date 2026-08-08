import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
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
      const data = await registerUser(user);

      if (!data.success) {
        setError(data.message);
        return;
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="registerBox">
      <form className="formBox" onSubmit={submitHandler}>
        {error && <p>{error}</p>}
        <a className="loginLink" href="/login">
          Login <i className="bi bi-arrow-right"></i>
        </a>

        <input
          placeholder="Enter Name"
          type="text"
          name="name"
          value={user.name}
          onChange={changeHandler}
        />

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

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
