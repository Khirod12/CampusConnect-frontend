import { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [adminName, setAdminName] = useState("Admin");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setAdminName(payload.name || "Admin");
    }
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get("https://campusconnect-31q2.onrender.com/api/items");
    setItems(res.data);
  };

  /* MATCH FUNCTION */
  const matchItems = async (lostId, foundId) => {
    await axios.post(
      "https://campusconnect-31q2.onrender.com/api/admin/match",
      { lostItemId: lostId, foundItemId: foundId },
      { headers: { Authorization: token } }
    );
    fetchItems();
  };

  /* COLLECT FUNCTION */
  const collectItem = async (id) => {
    await axios.post(
      `https://campusconnect-31q2.onrender.com/api/admin/collect/${id}`,
      {},
      { headers: { Authorization: token } }
    );
    fetchItems();
  };

  /* DELETE FUNCTION */
  const deleteItem = async (id) => {
    await axios.delete(
      `https://campusconnect-31q2.onrender.com/api/items/${id}`,
      { headers: { Authorization: token } }
    );
    fetchItems();
  };

  const theme = {
    bg: dark ? "#0f172a" : "#f8fafc",
    card: dark ? "#1e293b" : "#ffffff",
    text: dark ? "#f8fafc" : "#111827",
    sub: dark ? "#94a3b8" : "#6b7280",
    border: dark ? "#334155" : "#e5e7eb"
  };

  const filteredItems = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());

    if (filter === "all") return matchSearch;
    if (filter === "lost") return matchSearch && item.type === "lost";
    if (filter === "found") return matchSearch && item.type === "found";
    if (filter === "pending") return matchSearch && item.status === "pending";
    if (filter === "matched") return matchSearch && item.status === "matched";
    if (filter === "collected") return matchSearch && item.status === "collected";

    return true;
  });

  const pendingLost = items.filter(i => i.type === "lost" && i.status === "pending");
  const pendingFound = items.filter(i => i.type === "found" && i.status === "pending");

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      color: theme.text,
      transition: "0.3s"
    }}>

      {/* HEADER */}
      <div style={{
        padding: "15px",
        background: theme.card,
        borderBottom: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2 style={{ margin: 0, fontSize: "18px" }}>
            Admin Dashboard
          </h2>

          <button
            onClick={() => setDark(!dark)}
            style={styles.smallBtn}
          >
            {dark ? "☀" : "🌙"}
          </button>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <div style={styles.dp}>
            {adminName.charAt(0).toUpperCase()}
          </div>

          <div>
            <div style={{ fontSize: "14px", fontWeight: "600" }}>
              {adminName}
            </div>
            <div style={{ fontSize: "12px", color: theme.sub }}>
              Administrator
            </div>
          </div>

          <div style={{ marginLeft: "auto" }}>
            <button
              onClick={() => { localStorage.removeItem("token"); window.location = "/"; }}
              style={styles.logoutBtn}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "15px" }}>

        {/* SEARCH + FILTER */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          <input
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: `1px solid ${theme.border}`,
              background: theme.card,
              color: theme.text
            }}
          />

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: `1px solid ${theme.border}`,
              background: theme.card,
              color: theme.text
            }}
          >
            <option value="all">All</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="pending">Pending</option>
            <option value="matched">Matched</option>
            <option value="collected">Collected</option>
          </select>
        </div>

        {/* ITEMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {filteredItems.map(item => (
            <div key={item._id} style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              padding: "15px",
              borderRadius: "15px"
            }}>

              <h4>{item.title}</h4>
              <p style={{ fontSize: "13px", color: theme.sub }}>
                {item.description}
              </p>

              {item.image && (
                <img
                  src={`https://campusconnect-31q2.onrender.com/uploads/${item.image}`}
                  alt=""
                  style={styles.image}
                  onClick={() => setSelectedImage(item.image)}
                />
              )}

              <div style={styles.status(item.status)}>
                {item.status}
              </div>

              {/* BUTTON LOGIC */}
              {item.status === "matched" && (
                <button style={styles.collectBtn}
                  onClick={() => collectItem(item._id)}>
                  Mark Collected
                </button>
              )}

              {item.status === "collected" && (
                <button style={styles.deleteBtn}
                  onClick={() => deleteItem(item._id)}>
                  Delete Item
                </button>
              )}

            </div>
          ))}
        </div>

        {/* MATCH SECTION */}
        <div style={{
          marginTop: "30px",
          padding: "15px",
          background: theme.card,
          borderRadius: "15px"
        }}>
          <h3 style={{ marginBottom: "15px" }}>Match Lost & Found</h3>

          {pendingLost.length === 0 || pendingFound.length === 0 ? (
            <p style={{ fontSize: "13px", color: theme.sub }}>
              No pending matches available.
            </p>
          ) : (
            pendingLost.map(lost =>
              pendingFound.map(found => (
                <div key={lost._id + found._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                    gap: "8px"
                  }}>
                  <span style={{ fontSize: "13px" }}>
                    {lost.title} ↔ {found.title}
                  </span>

                  <button
                    style={styles.matchBtn}
                    onClick={() => matchItems(lost._id, found._id)}>
                    Match
                  </button>
                </div>
              ))
            )
          )}
        </div>

      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div style={styles.modal}
          onClick={() => setSelectedImage(null)}>
          <img
            src={`https://campusconnect-31q2.onrender.com/uploads/${selectedImage}`}
            style={{ maxWidth: "90%", borderRadius: "15px" }}
            alt=""
          />
        </div>
      )}

    </div>
  );
}

const styles = {

  dp: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold"
  },

  smallBtn: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "white"
  },

  logoutBtn: {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "none",
    background: "#ef4444",
    color: "white"
  },

  image: {
    width: "100%",
    marginTop: "10px",
    borderRadius: "12px",
    cursor: "pointer"
  },

  status: (status) => ({
    marginTop: "8px",
    fontSize: "12px",
    fontWeight: "600",
    color:
      status === "pending" ? "#f59e0b" :
      status === "matched" ? "#3b82f6" :
      "#8b5cf6"
  }),

  collectBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "#10b981",
    color: "white"
  },

  deleteBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "#ef4444",
    color: "white"
  },

  matchBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontSize: "12px"
  },

  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

};

export default AdminPanel;
