import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [items, setItems] = useState([]);
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dark, setDark] = useState(true);
  const [userName, setUserName] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "lost",
    location: ""
  });

  const token = localStorage.getItem("token");

  /* ================= FETCH USER + ITEMS ================= */

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "https://campusconnect-31q2.onrender.com/api/auth/me",
        { headers: { Authorization: token } }
      );
      setUserName(res.data.name || "User");
    } catch {
      console.log("User fetch error");
    }
  };

  const fetchItems = async () => {
    const res = await axios.get("https://campusconnect-31q2.onrender.com/api/items");

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    const myItems = res.data.filter(item =>
      item.user && item.user._id === userId
    );

    setItems(myItems);
  };

  useEffect(() => {
  fetchUser();
  fetchItems();
}, [token]);


  /* ================= ADD ITEM ================= */

  const addItem = async () => {
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (image) formData.append("image", image);

    await axios.post(
      "https://campusconnect-31q2.onrender.com/api/items",
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setForm({ title:"", description:"", type:"lost", location:"" });
    setImage(null);
    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(
      `https://campusconnect-31q2.onrender.com/api/items/${id}`,
      { headers:{ Authorization: token } }
    );
    fetchItems();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const theme = {
    bg: dark ? "#0f172a" : "#f8fafc",
    card: dark ? "#1e293b" : "#ffffff",
    text: dark ? "#f8fafc" : "#111827",
    sub: dark ? "#94a3b8" : "#6b7280",
    border: dark ? "#334155" : "#e5e7eb",
    inputBg: dark ? "#334155" : "#f1f5f9"
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "#f59e0b";
    if (status === "matched") return "#3b82f6";
    if (status === "collected") return "#8b5cf6";
    return "gray";
  };

  /* ================= UI ================= */

  return (
    <div style={{
      minHeight:"100vh",
      background: theme.bg,
      color: theme.text,
      transition:"0.3s"
    }}>

      {/* NAVBAR */}
      <div style={{
        padding:"18px 25px",
        background: theme.card,
        borderBottom:`1px solid ${theme.border}`,
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        flexWrap:"wrap",
        gap:"15px"
      }}>

        <h2 style={{fontSize:"18px", fontWeight:"600"}}>
          CampusConnect
        </h2>

        <div style={{
          display:"flex",
          alignItems:"center",
          gap:"15px"
        }}>

          {/* USER PROFILE */}
          <div style={{
            display:"flex",
            alignItems:"center",
            gap:"8px"
          }}>
            <div style={{
              width:"36px",
              height:"36px",
              borderRadius:"50%",
              background:"#4f46e5",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              fontWeight:"600",
              color:"white"
            }}>
              {(userName || "U").charAt(0).toUpperCase()}
            </div>

            <span style={{fontSize:"14px", fontWeight:"500"}}>
              {userName || "User"}
            </span>
          </div>

          <button
            onClick={()=>setDark(!dark)}
            style={styles.modeBtn}
          >
            {dark ? "☀" : "🌙"}
          </button>

          <button
            onClick={logout}
            style={styles.logoutBtn}
          >
            Logout
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div style={{
        padding:"25px",
        maxWidth:"1200px",
        margin:"auto"
      }}>

        {/* ADD ITEM CARD */}
        <div style={{
          background: theme.card,
          border:`1px solid ${theme.border}`,
          padding:"25px",
          borderRadius:"20px",
          marginBottom:"35px"
        }}>
          <h3 style={{marginBottom:"20px"}}>
            Add Lost / Found Item
          </h3>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
            gap:"15px"
          }}>
            <input
              placeholder="Title"
              value={form.title}
              onChange={e=>setForm({...form,title:e.target.value})}
              style={{...styles.input, background:theme.inputBg, color:theme.text}}
            />

            <input
              placeholder="Location"
              value={form.location}
              onChange={e=>setForm({...form,location:e.target.value})}
              style={{...styles.input, background:theme.inputBg, color:theme.text}}
            />

            <select
              value={form.type}
              onChange={e=>setForm({...form,type:e.target.value})}
              style={{...styles.input, background:theme.inputBg, color:theme.text}}
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>

            <input
              type="file"
              onChange={e=>setImage(e.target.files[0])}
              style={{...styles.input, background:theme.inputBg, color:theme.text}}
            />
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e=>setForm({...form,description:e.target.value})}
            style={{
              ...styles.input,
              background:theme.inputBg,
              color:theme.text,
              marginTop:"15px",
              height:"90px"
            }}
          />

          <button
            onClick={addItem}
            style={styles.primaryBtn}
          >
            Add Item
          </button>
        </div>

        {/* ITEMS GRID */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
          gap:"25px"
        }}>
          {items.map(item=>(
            <div key={item._id}
              style={{
                background: theme.card,
                border:`1px solid ${theme.border}`,
                padding:"20px",
                borderRadius:"20px"
              }}>

              <h4>{item.title}</h4>
              <p style={{fontSize:"13px", color:theme.sub}}>
                {item.description}
              </p>

              {item.image && (
                <img
                  src={`https://campusconnect-31q2.onrender.com/uploads/${item.image}`}
                  alt=""
                  style={styles.image}
                  onClick={()=>setSelectedImage(item.image)}
                />
              )}

              <div style={{
                marginTop:"12px",
                padding:"6px 14px",
                borderRadius:"20px",
                fontSize:"12px",
                fontWeight:"600",
                background:getStatusColor(item.status),
                color:"white",
                display:"inline-block"
              }}>
                {item.status}
              </div>

              {/* ✅ DELETE FOR PENDING + COLLECTED */}
              {(item.status==="pending" || item.status==="collected") && (
                <button
                  onClick={()=>deleteItem(item._id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              )}

            </div>
          ))}
        </div>

      </div>

      {selectedImage && (
        <div style={styles.modal}
          onClick={()=>setSelectedImage(null)}>
          <img
            src={`https://campusconnect-31q2.onrender.com/uploads/${selectedImage}`}
            alt=""
            style={{maxWidth:"90%",borderRadius:"20px"}}
          />
        </div>
      )}

    </div>
  );
}

const styles = {
  input:{
    width:"100%",
    padding:"12px",
    borderRadius:"12px",
    border:"1px solid #ccc",
    fontSize:"14px"
  },
  primaryBtn:{
    marginTop:"20px",
    width:"100%",
    padding:"14px",
    borderRadius:"14px",
    border:"none",
    background:"#4f46e5",
    color:"white",
    fontWeight:"600"
  },
  deleteBtn:{
    marginTop:"12px",
    width:"100%",
    padding:"12px",
    borderRadius:"12px",
    border:"none",
    background:"#ef4444",
    color:"white",
    fontWeight:"600"
  },
  modeBtn:{
    padding:"8px 12px",
    borderRadius:"8px",
    border:"none",
    background:"#4f46e5",
    color:"white"
  },
  logoutBtn:{
    padding:"8px 12px",
    borderRadius:"8px",
    border:"none",
    background:"#ef4444",
    color:"white"
  },
  image:{
    width:"100%",
    marginTop:"12px",
    borderRadius:"15px",
    cursor:"pointer"
  },
  modal:{
    position:"fixed",
    top:0,left:0,
    width:"100%",
    height:"100%",
    background:"rgba(0,0,0,0.9)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  }
};

export default Dashboard;
