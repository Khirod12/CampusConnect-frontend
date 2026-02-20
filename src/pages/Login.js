import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        "https://campusconnect-31q2.onrender.com/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      const payload = JSON.parse(atob(res.data.token.split(".")[1]));

      if (payload.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch {
      alert("Login Failed");
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h2 style={styles.title}>CampusConnect</h2>
        <p style={styles.subtitle}>Welcome Back 👋</p>

        <input
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          style={styles.input}
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={login}>
          Login
        </button>

        <p style={styles.bottomText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
  },

  card: {
    width: "100%",
    maxWidth: "400px",
    background: "rgba(255,255,255,0.95)",
    padding: "40px 30px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column"
  },

  title: {
    textAlign: "center",
    marginBottom: "5px",
    fontSize: "22px",
    fontWeight: "600",
    color: "#111827"
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "14px",
    color: "#6b7280"
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
    transition: "0.2s"
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "0.2s"
  },

  bottomText: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "13px",
    color: "#6b7280"
  },

  link: {
    color: "#4f46e5",
    fontWeight: "600",
    textDecoration: "none"
  }

};

export default Login;
