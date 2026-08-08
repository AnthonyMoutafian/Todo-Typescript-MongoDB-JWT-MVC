import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="homeBox">
      <Link to="/register">Registration</Link>

      <Link to="/login">Login</Link>
    </div>
  );
}
