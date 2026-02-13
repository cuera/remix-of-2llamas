import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "erica@1809";

interface Valentine {
  id: string;
  sender_name: string;
  receiver_name: string;
  character_type: string;
  love_note: string | null;
  status: string;
  receiver_choice: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [valentines, setValentines] = useState<Valentine[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("Wrong password");
    }
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    supabase
      .from("valentines")
      .select("id, sender_name, receiver_name, character_type, love_note, status, receiver_choice, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        setValentines(data || []);
        setLoading(false);
      });
  }, [authed]);

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a2e", color: "#fff", fontFamily: "monospace" }}>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "280px" }}>
          <h1 style={{ fontSize: "18px", textAlign: "center", opacity: 0.7 }}>Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #333", background: "#16213e", color: "#fff", fontSize: "14px", outline: "none" }}
          />
          {error && <span style={{ color: "#f44", fontSize: "13px", textAlign: "center" }}>{error}</span>}
          <button type="submit" style={{ padding: "10px", borderRadius: "8px", border: "none", background: "#e91e8b", color: "#fff", fontSize: "14px", cursor: "pointer" }}>
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", color: "#e0e0e0", fontFamily: "monospace", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "20px", opacity: 0.8 }}>Valentines ({valentines.length})</h1>
          <span style={{ fontSize: "12px", opacity: 0.4 }}>otterlyinlove.info</span>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", opacity: 0.5 }}>Loading...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #333", textAlign: "left" }}>
                  <th style={{ padding: "8px 12px", opacity: 0.5, fontWeight: 500 }}>#</th>
                  <th style={{ padding: "8px 12px", opacity: 0.5, fontWeight: 500 }}>Sender</th>
                  <th style={{ padding: "8px 12px", opacity: 0.5, fontWeight: 500 }}>Receiver</th>
                  <th style={{ padding: "8px 12px", opacity: 0.5, fontWeight: 500 }}>Character</th>
                  <th style={{ padding: "8px 12px", opacity: 0.5, fontWeight: 500 }}>Love Note</th>
                  <th style={{ padding: "8px 12px", opacity: 0.5, fontWeight: 500 }}>Status</th>
                  <th style={{ padding: "8px 12px", opacity: 0.5, fontWeight: 500 }}>Answer</th>
                  <th style={{ padding: "8px 12px", opacity: 0.5, fontWeight: 500 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {valentines.map((v, i) => (
                  <tr key={v.id} style={{ borderBottom: "1px solid #222" }}>
                    <td style={{ padding: "8px 12px", opacity: 0.3 }}>{i + 1}</td>
                    <td style={{ padding: "8px 12px" }}>{v.sender_name}</td>
                    <td style={{ padding: "8px 12px" }}>{v.receiver_name}</td>
                    <td style={{ padding: "8px 12px" }}>{v.character_type}</td>
                    <td style={{ padding: "8px 12px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: v.love_note ? 1 : 0.3 }}>
                      {v.love_note || "—"}
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", background: v.status === "complete" ? "#1b4332" : v.status === "opened" ? "#3a2e00" : "#1a1a3e", color: v.status === "complete" ? "#4ade80" : v.status === "opened" ? "#fbbf24" : "#8888cc" }}>
                        {v.status}
                      </span>
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      {v.receiver_choice === "YES" ? "💚 YES" : v.receiver_choice === "NO" ? "💔 NO" : <span style={{ opacity: 0.3 }}>—</span>}
                    </td>
                    <td style={{ padding: "8px 12px", opacity: 0.5, whiteSpace: "nowrap" }}>
                      {new Date(v.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
