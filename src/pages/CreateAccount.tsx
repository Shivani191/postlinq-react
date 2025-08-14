import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import SubmitButton from "../components/SubmitButton";
//import LinkedInButton from "../components/LinkedInButton";

const CreateAccount: React.FC = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.confirmPassword) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setApiLoading(true);
    setLoadingMessage("Creating your account...");
    try {
      const res = await fetch(
        "https://posted-ai-aqb4fvhqbhh2a2dg.centralus-01.azurewebsites.net/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            confirm_password: form.confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Signup failed");
      }

      alert(data.message); // “Check your email for verification...”
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setApiLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <form className="auth-container" onSubmit={handleSubmit}>
      {apiLoading && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255, 255, 255, 0.8)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
          <span className="loader"></span>
          <p style={{ marginTop: "10px", fontSize: "16px", color: "#333" }}>{loadingMessage}</p>
        </div>
      )}

      <img src="/assets/logo.png" alt="postlinQ Logo" className="logo-image" />

      {error && <div className="error" style={{ color: "red", marginBottom: "12px" }}>{error}</div>}

      <div className="form-control">
        <InputField
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="form-control">
        <PasswordField
          label="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      <div className="form-control">
        <PasswordField
          label="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
      </div>

      <SubmitButton label={loading ? "Creating..." : "Create Account"} disabled={loading} />

      
      <p className="bottom-text">
        Already have an account? 
 <span className="link-style" onClick={() => navigate("/login")} style={{ cursor: "pointer", color:"blue" }}><a> Login</a></span>
      </p>
    </form>
  );
};

export default CreateAccount;
