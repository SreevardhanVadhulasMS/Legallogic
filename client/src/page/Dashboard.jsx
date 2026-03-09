import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{padding:"40px"}}>

      {/* Header */}

      <div style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:"40px"
      }}>
        <h1 style={{fontSize:"36px", color:"#9b6b1f"}}>
          ⚖️ LegalLogic Dashboard
        </h1>

        <button
          onClick={logout}
          style={{
            padding:"10px 18px",
            background:"#9b6b1f",
            border:"none",
            color:"white",
            borderRadius:"8px",
            cursor:"pointer"
          }}
        >
          Logout
        </button>
      </div>


      {/* Welcome Card */}

      <div style={{
        background:"#fff8ee",
        padding:"30px",
        borderRadius:"12px",
        marginBottom:"40px"
      }}>
        <h2 style={{marginBottom:"10px"}}>
          Welcome to LegalLogic
        </h2>

        <p>
          Manage your legal cases, analyze documents using AI,
          track legal expenses and connect with verified advisors.
        </p>
      </div>


      {/* Feature Cards */}

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(3,1fr)",
        gap:"25px"
      }}>

        <div className="card">
          <h3>📂 Upload Case</h3>
          <p>Upload legal documents and analyze them using AI.</p>
        </div>

        <div className="card">
          <h3>🤖 AI Case Summary</h3>
          <p>Generate instant AI summaries for legal documents.</p>
        </div>

        <div className="card">
          <h3>📑 Recent Cases</h3>
          <p>View your previously uploaded and analyzed cases.</p>
        </div>

        <div className="card">
          <h3>📍 Find Advisors</h3>
          <p>Locate verified lawyers near your location.</p>
        </div>

        <div className="card">
          <h3>💰 Expense Tracker</h3>
          <p>Track legal spending and maintain budgets.</p>
        </div>

        <div className="card">
          <h3>🛡 Case Management</h3>
          <p>Organize case timelines, documents and notes.</p>
        </div>

      </div>


      {/* Activity */}

      <div style={{
        marginTop:"50px"
      }}>
        <h2 style={{marginBottom:"20px"}}>
          Recent Activity
        </h2>

        <div style={{
          background:"white",
          padding:"25px",
          borderRadius:"12px",
          boxShadow:"0 5px 20px rgba(0,0,0,0.05)"
        }}>
          <p>No recent activity yet.</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;