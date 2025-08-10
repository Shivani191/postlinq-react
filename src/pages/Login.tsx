import { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import SubmitButton from "../components/SubmitButton";
//import LinkedInButton from "../components/LinkedInButton";
import { useAuth } from "../components/AuthContext";
const Login: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setApiLoading(true);
    setLoadingMessage("Authenticating user..."); 
    try {
      const res = await fetch(
        "https://posted-ai-aqb4fvhqbhh2a2dg.centralus-01.azurewebsites.net/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Login failed, try again");
      }

      // Store JWT for later use
      setToken(data.token);
navigate("/dashboard", { state: { firstName: form.email.split("@")[0] } });

      } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setApiLoading(false);
      setLoadingMessage("");
      console.log({setToken});
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
      <img src="/src/assets/logo.png" alt="postlinQ Logo" className="logo-image" />
      {error && <div className="error" style={{ color: "red", marginBottom: "12px" }}>{error}</div>}
      <div className="form-control">
      <InputField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="form-control">
      <PasswordField label="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </div>
      <SubmitButton label={loading ? "Logging in..." : "Login"} disabled={loading} />
      
      <p className="bottom-text">
      Didn't have an account? <a href="/">Create account</a>
      </p>
    </form>
  );
};

export default Login;
