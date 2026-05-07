import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditTask = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "",
    due_date: "",
    assigned_to_id: "",
  });

  // ✅ FETCH TASK
  const fetchTask = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/tasks/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const selectedTask = res.data.find(
        (t) => t.id === Number(id)
      );

      if (selectedTask) {

        setTask({
          title: selectedTask.title || "",
          description:
            selectedTask.description || "",
          priority:
            selectedTask.priority || "",
          due_date:
            selectedTask.due_date
              ? selectedTask.due_date.split("T")[0]
              : "",
          assigned_to_id:
            selectedTask.assigned_to_id || "",
        });
      }

    } catch {

      alert("Failed to fetch task");

    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  // ✅ UPDATE TASK
  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      const payload = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        due_date: task.due_date || null,
        assigned_to_id: Number(task.assigned_to_id),
      };

      await axios.put(
        `http://127.0.0.1:8000/tasks/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Task updated successfully");

      navigate("/kanban");

    } catch (err) {

      console.log(err.response?.data);

      alert("❌ Update failed");

    }
  };

  return (

    <div style={styles.container}>

      <form
        style={styles.card}
        onSubmit={handleUpdate}
      >

        <h1 style={styles.heading}>
          ✏ Edit Task
        </h1>

        <input
          type="text"
          placeholder="Title"
          value={task.title}
          onChange={(e) =>
            setTask({
              ...task,
              title: e.target.value,
            })
          }
          style={styles.input}
        />

        <textarea
          placeholder="Description"
          value={task.description}
          onChange={(e) =>
            setTask({
              ...task,
              description: e.target.value,
            })
          }
          style={styles.textarea}
        />

        <select
          value={task.priority}
          onChange={(e) =>
            setTask({
              ...task,
              priority: e.target.value,
            })
          }
          style={styles.input}
        >
          <option value="">
            Select Priority
          </option>

          <option value="low">
            Low
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="high">
            High
          </option>
        </select>

        <input
          type="date"
          value={task.due_date}
          onChange={(e) =>
            setTask({
              ...task,
              due_date: e.target.value,
            })
          }
          style={styles.input}
        />

        {/* ✅ IMPORTANT FIX */}
        <input
          type="number"
          placeholder="Assign Employee ID"
          value={task.assigned_to_id}
          onChange={(e) =>
            setTask({
              ...task,
              assigned_to_id: e.target.value,
            })
          }
          style={styles.input}
        />

        <button style={styles.button}>
          Update Task
        </button>

      </form>

    </div>
  );
};

const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
  },

  card: {
    width: "430px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 0 25px rgba(0,0,0,0.4)",
  },

  heading: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "40px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: "16px",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: "16px",
  },

  button: {
    width: "100%",
    padding: "14px",
    background:
      "linear-gradient(90deg,#2563eb,#7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "18px",
  },
};

export default EditTask;