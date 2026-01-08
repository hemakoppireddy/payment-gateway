import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // For Deliverable 1, credentials are fixed
    if (email === "test@example.com") {
      // Store API credentials for dashboard usage
      localStorage.setItem("api_key", "key_test_abc123");
      localStorage.setItem("api_secret", "secret_test_xyz789");

      navigate("/dashboard");
    } else {
      alert("Invalid email");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h2>Merchant Login</h2>

      <form data-test-id="login-form" onSubmit={handleSubmit}>
        <input
          data-test-id="email-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          data-test-id="password-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button
          data-test-id="login-button"
          type="submit"
          style={{ width: "100%", padding: "10px" }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
