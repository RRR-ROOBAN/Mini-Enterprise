import React, { useEffect, useState } from "react";
import axios from "axios";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [taskId, setTaskId] = useState(1);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ✅ FETCH COMMENTS
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/tasks/${taskId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(res.data || []);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // ✅ ADD COMMENT
  const addComment = async () => {

    if (!content.trim()) {
      alert("Enter comment");
      return;
    }

    try {

      await axios.post(
        `http://127.0.0.1:8000/tasks/${taskId}/comments`,
        {
          content: content,
          is_internal: isInternal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent("");
      setIsInternal(false);

      fetchComments();

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.detail || "Comment failed");
    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.container}>

        <h1 style={styles.heading}>
          💬 Task Comments
        </h1>

        {/* ✅ TASK ID */}
        <div style={styles.taskBox}>

          <label style={styles.label}>
            Task ID
          </label>

          <input
            type="number"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            style={styles.taskInput}
          />

          <button
            onClick={fetchComments}
            style={styles.loadBtn}
          >
            Load Comments
          </button>

        </div>

        {/* ✅ COMMENT BOX */}
        <div style={styles.commentBox}>

          <input
            type="text"
            placeholder="Write comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.input}
          />

          {/* 🔥 INTERNAL TOGGLE */}
          {role !== "employee" && (

            <div style={styles.toggleBox}>

              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
              />

              <span style={styles.toggleText}>
                Internal Comment
              </span>

            </div>
          )}

          <button
            onClick={addComment}
            style={styles.postButton}
          >
            Post
          </button>

        </div>

        {/* ✅ COMMENTS LIST */}
        <div style={styles.timeline}>

          {comments.length === 0 ? (

            <p style={styles.noComments}>
              No comments found
            </p>

          ) : (

            comments.map((item) => (

              <div
                key={item.id}
                style={styles.commentCard}
              >

                <div style={styles.header}>

                  <div>
                    <strong style={styles.user}>
                      👤 User #{item.user_id}
                    </strong>
                  </div>

                  <div style={styles.badges}>

                    {item.is_internal ? (

                      <span style={styles.internalBadge}>
                        Internal
                      </span>

                    ) : (

                      <span style={styles.publicBadge}>
                        Public
                      </span>
                    )}

                  </div>

                </div>

                <p style={styles.commentText}>
                  {item.content}
                </p>

              </div>

            ))
          )}

        </div>

      </div>

    </div>
  );
};

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
    padding: "40px",
    display: "flex",
    justifyContent: "center",
  },

  container: {
    width: "900px",
  },

  heading: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "42px",
  },

  taskBox: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "20px",
  },

  label: {
    color: "#fff",
    fontWeight: "bold",
  },

  taskInput: {
    width: "100px",
    height: "40px",
    borderRadius: "10px",
    border: "none",
    paddingLeft: "10px",
  },

  loadBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  commentBox: {
    background: "rgba(255,255,255,0.08)",
    padding: "18px",
    borderRadius: "18px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "30px",
    backdropFilter: "blur(10px)",
  },

  input: {
    flex: 1,
    height: "45px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    padding: "0 14px",
    fontSize: "14px",
  },

  toggleBox: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#fff",
  },

  toggleText: {
    fontSize: "14px",
  },

  postButton: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  commentCard: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "20px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
  },

  user: {
    color: "#fff",
  },

  badges: {
    display: "flex",
    gap: "8px",
  },

  internalBadge: {
    background: "#ef4444",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "10px",
    fontSize: "12px",
  },

  publicBadge: {
    background: "#2563eb",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "10px",
    fontSize: "12px",
  },

  commentText: {
    color: "#e2e8f0",
    lineHeight: "1.6",
  },

  noComments: {
    color: "#cbd5e1",
    textAlign: "center",
  },
};

export default Comments;