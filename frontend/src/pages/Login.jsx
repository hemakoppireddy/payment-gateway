import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Deliverable 1: fixed merchant
    if (email === "test@example.com") {
      localStorage.setItem("api_key", "key_test_abc123");
      localStorage.setItem("api_secret", "secret_test_xyz789");
      navigate("/dashboard");
    } else {
      alert("Invalid email");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Merchant Login</h2>
        <p className="subtitle">Payment Gateway Dashboard</p>

        <form data-test-id="login-form" onSubmit={handleSubmit}>
          <input
            data-test-id="email-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            data-test-id="password-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button data-test-id="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
