import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const navigate = useNavigate();

  const register = async () => {
    try {

      const res = await axios.post(
        "https://campusconnect-31q2.onrender.com/api/auth/register",
        form
      );

      alert(res.data.msg || "Registered Successfully");
      navigate("/");

    } catch (err) {
      console.log("Backend Error:", err.response?.data);
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join CampusConnect 🚀</p>

        <input
          style={styles.input}
          placeholder="Full Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Email Address"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          style={styles.input}
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <select
          style={styles.input}
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button style={styles.button} onClick={register}>
          Register
        </button>

        <p style={styles.bottomText}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>
            Login
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
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)"
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.95)",
    padding: "40px 30px",
    borderRadius: "22px",
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
    outline: "none"
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
    marginTop: "5px"
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

export default Register;
