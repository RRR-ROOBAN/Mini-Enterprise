import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

function Dashboard() {

  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({});
  const [

    org,

    setOrg

  ] = useState(

    null

  );

  const navigate = useNavigate();

  useEffect(() => {

    fetchUser();

    fetchSummary();

    // fetchOrganization();

  }, []);

  const fetchUser = async () => {
    try {

      const res = await API.get("/auth/me");

      setUser(res.data || {});

    } catch {

      toast.error("Failed to load user");

    }
  };

  const fetchSummary = async () => {
    try {

      const res = await API.get("/dashboard/summary");

      setSummary(res.data || {});

    } catch {

      setSummary({});

    }
  };

  const fetchOrganization =

    async () => {

      try {

        const res =

          await API.get(

            "/organization/me"

          );

        console.log(

          res.data

        );

        setOrg(

          res.data

        );

      }

      catch (

      err

      ) {

        console.log(

          err

        );

      }

    };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    toast.success("Logged out");

    navigate("/");

  };

  const done = Number(summary?.completed_tasks ?? 0);
  const progress = Number(summary?.in_progress ?? 0);
  const pending = Number(summary?.pending_tasks ?? 0);
  const total = Number(summary?.total_tasks ?? 0);

  const max = Math.max(done, progress, pending, 1);

  return (

    <div style={styles.container}>

      <div style={styles.topBar}>

        <div style={styles.userCard}>

          <h3 style={{ margin: 0 }}>

            👋 Welcome,

            {user?.name || "User"}

          </h3>

          <span style={styles.roleBadge}>

            {user?.role || "employee"}

          </span>

        </div>


        <div style={styles.topRight}>


          <button

            onClick={() =>

              navigate(

                "/notifications"

              )

            }

            style={styles.bellBtn}

          >

            🔔

          </button>


          <button

            onClick={handleLogout}

            style={styles.logoutBtn}

          >

            Logout

          </button>


        </div>

      </div>

      {/* 🔥 TITLE */}
      <h1 style={styles.title}>
        📊 Enterprise Dashboard
      </h1>

      {

        org && (

          <div style={styles.orgBox}>


            <h3>

              🏢 {

                org.organization

              }

            </h3>


            <p>

              💎 {

                org.plan

              }

              Plan

            </p>


            <p>

              💳 {

                org.credits

              }

              Credits

            </p>


          </div>

        )

      }

      {/* 🔥 NAVBAR */}
      <div style={styles.navBar}>
        <button
          onClick={() => navigate("/documents")}
          style={styles.navBtn}
        >
          📁 Documents
        </button>


        {/* ✅ ONLY ADMIN + MANAGER */}
        {user?.role !== "employee" && (
          <button
            onClick={() => navigate("/create-task")}
            style={styles.navBtn}
          >
            📝 Create Task
          </button>
        )}

        <button
          onClick={() => navigate("/kanban")}
          style={styles.navBtn}
        >
          👀 View Tasks
        </button>
        
        <button

          onClick={() => navigate("/approvals")}

          style={styles.navBtn}

        >

          ✅ Approvals

        </button>

        

        <button
          onClick={() => navigate("/comments")}
          style={styles.navBtn}
        >
          💬 Comments
        </button>



        <button
          onClick={() => navigate("/activity")}
          style={styles.navBtn}
        >
          📋 Activity
        </button>

        <button

          onClick={() =>

            navigate(

              "/ai-insights"

            )

          }

          style={styles.navBtn}

        >

          🧠 AI Insights

        </button>

        {user?.role === "admin" && (

          <button
            onClick={() => navigate("/audit-logs")}
            style={styles.navBtn}
          >
            📋 Audit Logs
          </button>

        )}

        <button

          onClick={() =>

            navigate(

              "/billing"

            )

          }

          style={styles.navBtn}

        >

          💳 Billing

        </button>


        <button

          onClick={() =>

            navigate(

              "/subscription"

            )

          }

          style={styles.navBtn}

        >

          🚀 Subscription

        </button>



      </div>

      {/* 🔥 SUMMARY CARDS */}
      <div style={styles.summaryGrid}>

        <div style={styles.card}>
          <h2 style={styles.cardNumber}>
            {total}
          </h2>
          <p style={styles.cardText}>
            Total Tasks
          </p>
        </div>


        <div style={styles.card}>
          <h2 style={styles.cardNumber}>
            {done}
          </h2>
          <p style={styles.cardText}>
            Completed
          </p>
        </div>


        <div style={styles.card}>
          <h2 style={styles.cardNumber}>
            {progress}
          </h2>
          <p style={styles.cardText}>
            In Progress
          </p>
        </div>


        <div style={styles.card}>
          <h2 style={styles.cardNumber}>
            {pending}
          </h2>
          <p style={styles.cardText}>
            Pending
          </p>
        </div>


        <div style={styles.card}>
          <h2 style={styles.cardNumber}>
            {summary?.pending_approvals || 0}
          </h2>
          <p style={styles.cardText}>
            Approvals
          </p>
        </div>

      </div>

      {/* 🔥 ANALYTICS GRAPH */}
      <div style={styles.chartBox}>

        <h2 style={styles.chartTitle}>
          📈 Task Analytics
        </h2>

        {[
          {
            label: "Completed",
            value: done,
            color: "#10b981",
          },
          {
            label: "In Progress",
            value: progress,
            color: "#6366f1",
          },
          {
            label: "Pending",
            value: pending,
            color: "#f59e0b",
          },
        ].map((item, index) => (

          <div key={index} style={styles.row}>

            <div style={styles.label}>
              {item.label}
            </div>

            <div style={styles.barContainer}>

              <div
                style={{
                  ...styles.bar,
                  width: `${(item.value / max) * 100}%`,
                  background: item.color,
                }}
              />

            </div>

            <div style={styles.value}>
              {item.value}
            </div>

          </div>
        ))}

      </div>

      {/* 🔥 ENTERPRISE FEATURES */}
      <div style={styles.enterpriseBox}>

        <h2 style={styles.chartTitle}>
          🚀 Enterprise Features
        </h2>

        <div style={styles.enterpriseGrid}>

          {/* ✅ Audit Logs */}
          <div style={styles.enterpriseCard}>

            <h3>📋 Audit Logs</h3>

            <p>
              Tracks all enterprise activities
              including task creation,
              approvals, updates and workflow
              monitoring.
            </p>

            <button
              style={styles.featureBtn}
              onClick={() => navigate("/audit-logs")}
            >
              View Audit Logs
            </button>

          </div>

          {/* ✅ Notifications */}
          <div style={styles.enterpriseCard}>

            <h3>🔔 Notifications</h3>

            <p>
              Real-time notification system for
              task assignment, approvals,
              comments and workflow alerts.
            </p>

            <button
              style={styles.featureBtn}
              onClick={() => navigate("/notifications")}
            >
              View Notifications
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

/* 🎨 STYLES */
const styles = {

  container: {

    minHeight: "100vh",

    padding: "30px",

    background:

      "radial-gradient(circle at top left,#1e3a8a,#020617)",

    color: "#fff"

  },

  topBar: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "20px",

  },

  topRight: {

    display: "flex",

    alignItems: "center",

    gap: "12px"

  },

  userCard: {

    color: "#fff",

  },

  userCard: {
    color: "#fff",
  },

  roleBadge: {
    background: "#2563eb",
    padding: "4px 12px",
    borderRadius: "10px",
    fontSize: "12px",
  },

  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
  },


  orgBox: {

    background:

      "rgba(255,255,255,0.08)",

    padding: "20px",

    borderRadius: "18px",

    marginBottom: "25px",

    textAlign: "center",

    border:

      "1px solid rgba(255,255,255,0.08)"

  },

  title: {
    textAlign: "center",
    color: "#fff",
    marginBottom: "30px",
    fontSize: "42px",
  },

  navBar: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "35px",
  },

  navBtn: {

    background:

      "linear-gradient(135deg,#2563eb,#7c3aed)",

    border: "none",

    padding: "16px 24px",

    borderRadius: "18px",

    color: "#fff",

    fontWeight: "700",

    fontSize: "17px",

    cursor: "pointer",

    transition: "0.3s",

    boxShadow:

      "0 8px 20px rgba(99,102,241,0.3)"

  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: "20px",
  },

  card: {

    background:

      "linear-gradient(145deg,#1e293b,#0f172a)",

    padding: "35px",

    borderRadius: "24px",

    boxShadow:

      "0 12px 30px rgba(0,0,0,0.35)",

    border:

      "1px solid rgba(255,255,255,0.08)",

    transition:

      "0.3s",

    cursor: "pointer",

    position: "relative",

    overflow: "hidden"

  },

  cardNumber: {

    fontSize: "52px",

    fontWeight: "800",

    background:

      "linear-gradient(90deg,#60a5fa,#a855f7)",

    WebkitBackgroundClip:

      "text",

    WebkitTextFillColor:

      "transparent",

    marginBottom: "12px"

  },

  cardText: {

    fontSize: "22px",

    color: "#d1d5db",

    fontWeight: "500"

  },

  chartBox: {
    marginTop: "40px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "20px",
    color: "#fff",
  },

  chartTitle: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#fff",
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },

  label: {
    width: "120px",
    color: "#fff",
  },

  barContainer: {
    flex: 1,
    height: "14px",
    background: "#374151",
    borderRadius: "10px",
    overflow: "hidden",
  },

  bar: {
    height: "100%",
    borderRadius: "10px",
    transition: "0.4s",
  },

  value: {
    width: "40px",
    textAlign: "right",
    color: "#fff",
  },

  enterpriseBox: {
    marginTop: "40px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "20px",
    color: "#fff",
  },

  enterpriseGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "20px",
  },

  enterpriseCard: {
    background:
      "linear-gradient(135deg,#1e293b,#111827)",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  },

  bellBtn: {

    background: "transparent",

    border: "none",

    fontSize: "26px",

    cursor: "pointer",

    color: "#facc15",

    padding: "0",

    boxShadow: "none"

  },

  featureBtn: {
    marginTop: "18px",
    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Dashboard;