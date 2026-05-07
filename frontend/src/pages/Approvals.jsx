import React, { useEffect, useState } from "react";
import axios from "axios";

const Approvals = () => {
  const [approvals, setApprovals] = useState([]);
  const [filter, setFilter] = useState("all");
  const [history, setHistory] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔹 Fetch approvals
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/approvals/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApprovals(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApprovals();
  }, [token]);

  // 🔹 Create request (employee)
  const handleCreate = async () => {
    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/approvals/",
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Request submitted ✅");
      setTitle("");
      setDescription("");
      window.location.reload();
    } catch (err) {
      console.log(err.response?.data);
      alert("Create failed ❌");
    }
  };

  // 🔹 Approve / Reject (FIXED BODY)
  const handleAction = async (id, action) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/approvals/${id}/action`,
        {
          action: action,
          comment: action === "rejected" ? "Rejected" : "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      window.location.reload();
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.detail || "Action failed ❌");
    }
  };

  // 🔹 History
  const fetchHistory = async (id) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/approvals/${id}/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(res.data);
    } catch {
      alert("History failed ❌");
    }
  };

  // 🔹 Filter
  const filtered =
    filter === "all"
      ? approvals
      : approvals.filter((a) => a.status === filter);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📝 Approval Requests</h2>

      <p><b>Role:</b> {role}</p>

      {/* 🔥 EMPLOYEE FORM */}
      {role === "employee" && (
        <div style={styles.formBox}>
          <h3>Create Request</h3>

          <input
            style={styles.input}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button style={styles.createBtn} onClick={handleCreate}>
            Submit
          </button>
        </div>
      )}

      {/* 🔥 FILTER */}
      <div style={styles.filterBar}>
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            style={{
              ...styles.filterBtn,
              background: filter === f ? "#6366f1" : "#ddd",
              color: filter === f ? "#fff" : "#000",
            }}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 🔥 APPROVAL CARDS */}
      <div style={styles.grid}>
        {filtered.map((a) => (
          <div key={a.id} style={styles.card}>
            <h3>{a.title}</h3>
            <p>{a.description}</p>

            <span style={getStatusStyle(a.status)}>
              {a.status}
            </span>

            <div style={styles.actions}>
              {a.status === "pending" &&
                (role === "manager" || role === "admin") && (
                  <>
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleAction(a.id, "approved")}
                    >
                      ✔ Approve
                    </button>

                    <button
                      style={styles.rejectBtn}
                      onClick={() => handleAction(a.id, "rejected")}
                    >
                      ✖ Reject
                    </button>
                  </>
                )}

              {(role === "manager" || role === "admin") && (
                <button
                  style={styles.historyBtn}
                  onClick={() => fetchHistory(a.id)}
                >
                  📜 History
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 HISTORY MODAL */}
      {history && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>History</h3>

            {history.length === 0 ? (
              <p>No history</p>
            ) : (
              history.map((h, i) => (
                <p key={i}>
                  {h.action} - {h.timestamp}
                </p>
              ))
            )}

            <button onClick={() => setHistory(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* 🎨 STYLES */
const styles = {
  container: {
    padding: "20px",
    background: "linear-gradient(to right, #e0f2fe, #ede9fe)",
    minHeight: "100vh",
  },

  title: {
    fontSize: "26px",
    marginBottom: "10px",
  },

  formBox: {
    width: "320px",
    padding: "12px",
    background: "#fff",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  textarea: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    height: "60px",
  },

  createBtn: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  filterBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  filterBtn: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  actions: {
    marginTop: "10px",
    display: "flex",
    gap: "8px",
  },

  approveBtn: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  rejectBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  historyBtn: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
  },
};

const getStatusStyle = (status) => {
  const base = {
    padding: "4px 10px",
    borderRadius: "6px",
    display: "inline-block",
    marginTop: "8px",
    fontSize: "12px",
  };

  if (status === "approved") {
    return { ...base, background: "#dcfce7", color: "#16a34a" };
  }
  if (status === "rejected") {
    return { ...base, background: "#fee2e2", color: "#dc2626" };
  }

  return { ...base, background: "#e0f2fe", color: "#0284c7" };
};

export default Approvals;