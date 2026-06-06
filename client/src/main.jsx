import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Activity, Lock, Plus, ShieldCheck } from "lucide-react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function App() {
  const [token, setToken] = useState("");
  const [items, setItems] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("ChangeMe123!");

  async function register() {
    const res = await fetch(API + "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: "admin" })
    });
    const data = await res.json();
    setToken(data.token);
  }

  async function loadData(activeToken = token) {
    if (!activeToken) return;
    const headers = { Authorization: "Bearer " + activeToken };
    const [recordsRes, analyticsRes] = await Promise.all([
      fetch(API + "/api/messages", { headers }),
      fetch(API + "/api/analytics", { headers })
    ]);
    setItems(await recordsRes.json());
    setAnalytics(await analyticsRes.json());
  }

  async function addRecord() {
    const res = await fetch(API + "/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ title: "Portfolio demo record", priority: "high", status: "active" })
    });
    if (res.ok) loadData();
  }

  useEffect(() => { loadData(); }, [token]);

  return (
    <main className="app">
      <section className="toolbar">
        <div>
          <p className="eyebrow">Full Stack Portfolio</p>
          <h1>Secure Chat Application</h1>
        </div>
        <button onClick={addRecord} disabled={!token}><Plus size={18}/> Add</button>
      </section>
      <section className="grid">
        <div className="panel auth">
          <Lock size={22}/>
          <h2>Authentication</h2>
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          <button onClick={register}><ShieldCheck size={18}/> Register Demo Admin</button>
        </div>
        <div className="panel">
          <Activity size={22}/>
          <h2>Analytics</h2>
          <p className="metric">{analytics ? analytics.total : 0}</p>
          <p>Tracked messages</p>
        </div>
      </section>
      <section className="panel">
        <h2>Messages</h2>
        <div className="cards">
          {items.map((item) => (
            <article className="card" key={item.id}>
              <strong>{item.title}</strong>
              <span>{item.status}</span>
              <small>{item.priority}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
