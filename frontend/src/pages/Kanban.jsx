import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Kanban = () => {

  const [tasks, setTasks] = useState({
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  });

  const token = localStorage.getItem("token");

  // ✅ ROLE
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  // ✅ FETCH TASKS
  const fetchTasks = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/tasks/kanban",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data || {});

    } catch (err) {

      console.error(err);

    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ UPDATE STATUS
  const updateStatus = async (taskId, newStatus) => {

    try {

      await axios.patch(
        `http://127.0.0.1:8000/tasks/${taskId}/status?status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();

    } catch {

      alert("Update failed");

    }
  };

  // ✅ DELETE TASK
  const deleteTask = async (taskId) => {

    try {

      await axios.delete(
        `http://127.0.0.1:8000/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();

      alert("Task deleted");

    } catch {

      alert("Delete failed");

    }
  };

  // ✅ COLUMN
  const renderColumn = (title, key, color) => (

    <div
      style={{
        ...styles.column,
        borderTop: `4px solid ${color}`,
      }}
    >

      <h3 style={styles.columnTitle}>
        {title}
      </h3>

      {(tasks[key] || []).length === 0 ? (

        <p style={styles.empty}>
          No tasks
        </p>

      ) : (

        tasks[key].map((task) => (

          <div key={task.id} style={styles.card}>

            <h4 style={styles.taskTitle}>
              {task.title}
            </h4>

            <p style={styles.description}>
              {task.description}
            </p>

            <div style={styles.priority}>
              {task.priority}
            </div>

            <div style={styles.btnGroup}>

              {/* BACK */}
              {key === "in_progress" && (
                <button
                  style={styles.grayBtn}
                  onClick={() =>
                    updateStatus(task.id, "todo")
                  }
                >
                  ← Back
                </button>
              )}

              {key === "review" && (
                <button
                  style={styles.grayBtn}
                  onClick={() =>
                    updateStatus(task.id, "in_progress")
                  }
                >
                  ← Back
                </button>
              )}

              {/* FORWARD */}
              {key === "todo" && (
                <button
                  style={styles.blueBtn}
                  onClick={() =>
                    updateStatus(task.id, "in_progress")
                  }
                >
                  Start →
                </button>
              )}

              {key === "in_progress" && (
                <button
                  style={styles.orangeBtn}
                  onClick={() =>
                    updateStatus(task.id, "review")
                  }
                >
                  Review →
                </button>
              )}

              {key === "review" && (
                <button
                  style={styles.greenBtn}
                  onClick={() =>
                    updateStatus(task.id, "done")
                  }
                >
                  Done →
                </button>
              )}

              {/* ✅ ONLY ADMIN + MANAGER */}
              {role !== "employee" && (
                <>
                  {/* EDIT */}
                  <button
                    style={styles.editBtn}
                    onClick={() =>
                      navigate(`/edit-task/${task.id}`)
                    }
                  >
                    ✏ Edit
                  </button>

                  {/* DELETE */}
                  <button
                    style={styles.deleteBtn}
                    onClick={() =>
                      deleteTask(task.id)
                    }
                  >
                    🗑 Delete
                  </button>
                </>
              )}

            </div>

          </div>
        ))
      )}
    </div>
  );

  return (

    <div style={styles.container}>

      {/* TOP */}
      <div style={styles.topBar}>

        <h1 style={styles.heading}>
          🚀 Enterprise Kanban Board
        </h1>

        <button
          style={styles.backBtn}
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </div>

      {/* BOARD */}
      <div style={styles.board}>

        {renderColumn(
          "TODO",
          "todo",
          "#3b82f6"
        )}

        {renderColumn(
          "IN PROGRESS",
          "in_progress",
          "#f59e0b"
        )}

        {renderColumn(
          "REVIEW",
          "review",
          "#8b5cf6"
        )}

        {renderColumn(
          "DONE",
          "done",
          "#10b981"
        )}

      </div>

    </div>
  );
};

const styles = {

  container: {
    minHeight: "100vh",
    padding: "20px",
    background:
      "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
    fontFamily: "Arial",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  heading: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: "bold",
  },

  backBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },

  board: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "15px",
  },

  column: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "12px",
    minHeight: "420px",
    backdropFilter: "blur(8px)",
  },

  columnTitle: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "24px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "12px",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.15)",
  },

  taskTitle: {
    marginBottom: "6px",
    color: "#111827",
    fontSize: "20px",
  },

  description: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "8px",
  },

  priority: {
    display: "inline-block",
    background: "#dbeafe",
    color: "#2563eb",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    marginBottom: "10px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  btnGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "8px",
  },

  blueBtn: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
  },

  orangeBtn: {
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
  },

  greenBtn: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
  },

  grayBtn: {
    background: "#6b7280",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
  },

  editBtn: {
    background: "#8b5cf6",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
  },

  empty: {
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: "40px",
    fontSize: "16px",
  },
};

export default Kanban;