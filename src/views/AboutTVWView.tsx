import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/layout/Footer";

const B_INDIGO = "#333399";
const B_YELLOW = "#E8A817";

const CATEGORIES = ["Tata Employees", "Their Family Members", "Retired Tata Employees"];

const TSG_FEATURES = ["Centralised Campaigns", "Cross-collaboration Support", "Regional Meets", "Trackers & Announcements", "Rewards & Recognition"];

const EDITIONS = [
  { label: "TVW25", detail: "Held from 3rd Mar – 31st Mar 2025" },
  { label: "TVW24", detail: "Held from 2nd Sep – 30th Sep 2024" },
  { label: "TVW23", detail: "Held from 3rd Mar – 31st Mar 2024" },
  { label: "TVW22", detail: "Held from 4th Sep – 30th Sep 2023" },
  { label: "TVW21", detail: "Held from 6th Mar – 31st Mar 2023" },
  { label: "TVW20", detail: "Held from 5th Sep – 30th Sep 2022" },
  { label: "TVW19", detail: "Held from 7th Mar – 31st Mar 2022" },
  { label: "TVW18", detail: "Held from 6th Sep – 30th Sep 2021" },
  { label: "TVW17", detail: "Held from 1st Mar – 31st Mar 2021" },
  { label: "TVW16", detail: "Held from 7th Sep – 30th Sep 2020" },
  { label: "TVW15", detail: "Held from 2nd Mar – 31st Mar 2020" },
  { label: "TVW14", detail: "Held from 2nd Sep – 30th Sep 2019" },
];

export default function AboutTVWView() {
  const navigate = useAppNavigate();
  const { isLoggedIn } = useAuth();
  const { triggerToast } = useAppContext();

  return (
    <div style={{ paddingTop: 0, paddingBottom: 0, background: "#fff", minHeight: "100vh" }}>

      {/* 1 — Hero */}
      <div style={{ background: "#0D1B3E", padding: "100px 56px 64px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>PROGRAMME</div>
          <h1 style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 900, fontSize: 38, color: "#fff", margin: 0, lineHeight: 1.2 }}>
            Tata Volunteering Week
          </h1>
          <span style={{ display: "inline-block", marginTop: 16, background: B_YELLOW, color: "#fff", fontStyle: "italic", fontWeight: 600, fontSize: 15, padding: "8px 20px", borderRadius: 8 }}>
            experience THE CHANGE
          </span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "20px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>4-week celebration</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Tata family across the world</div>
        </div>
      </div>

      {/* 2 — Intro Text */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 20, fontStyle: "italic", color: B_INDIGO, lineHeight: 1.6, marginBottom: 28 }}>
          "Talks and planning can help determine the right path to herald change. But to effect change, we need to walk the talk."
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 14 }}>
          Tata Volunteering Week is a 4-week group celebration of volunteering held twice a year — bringing together the Tata family across the world. Over 16+ editions, TVW has consistently broken participation records, mobilising lakhs of employees, their families, and retired colleagues.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
          From environmental clean-ups and education workshops to health camps and skill-building sessions, TVW covers a wide spectrum of community impact — making volunteering accessible, inclusive, and impactful for everyone.
        </p>
      </div>

      {/* 3 — Who Can Volunteer? */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 48px", textAlign: "center" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, marginBottom: 20 }}>Who Can Volunteer?</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 20 }}>
          {CATEGORIES.map((c) => (
            <span key={c} style={{ border: "1px solid #e8e8f0", borderRadius: 100, padding: "8px 20px", fontWeight: 600, fontSize: 14, color: "#334155" }}>{c}</span>
          ))}
        </div>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 20 }}>
          Activities are designed for all — from generic awareness drives open to everyone, to specialised skill-based projects. Volunteering guidelines ensure safety, inclusivity, and meaningful engagement.
        </p>
        <button
          onClick={() => navigate("register-role")}
          style={{ background: B_INDIGO, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
        >
          Register Now →
        </button>
      </div>

      {/* 4 — How We Go About It? */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 48px", textAlign: "center" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, marginBottom: 16 }}>How We Go About It?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 20 }}>
          Each Tata company organises its own TVW events — typically half-day group volunteering sessions coordinated by Corporate SPOCs and supported by NGO partners. Employees sign up via TataEngage, choose activities aligned with their interests, and participate as teams.
        </p>
        <button
          onClick={() => navigate(isLoggedIn ? "tvw" : "login")}
          style={{ background: B_INDIGO, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
        >
          View Volunteering Opportunities →
        </button>
      </div>

      {/* 5 — Role of TSG */}
      <div style={{ background: "#f5f5fa", padding: "48px 24px", textAlign: "center" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, marginBottom: 24 }}>Role of Tata Sustainability Group</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 0 }}>
          {TSG_FEATURES.map((f, i) => (
            <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#334155", padding: "0 16px" }}>{f}</span>
              {i < TSG_FEATURES.length - 1 && <span style={{ color: "#cbd5e1", fontSize: 18 }}>|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* 6 — Timelines */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, marginBottom: 16 }}>Timelines</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
          TVW is held twice a year — starting on the{" "}
          <strong style={{ color: B_INDIGO }}>3rd of March</strong> and the{" "}
          <strong style={{ color: B_INDIGO }}>5th of September</strong>.
          {" "}Each edition runs for four weeks, giving employees ample time to participate across multiple activities and locations.
        </p>
      </div>

      {/* 7 — Scroll Down Memory Lane */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 12 }}>Scroll Down Memory Lane</h2>
        <p style={{ fontSize: 15, color: "#475569", textAlign: "center", lineHeight: 1.7, marginBottom: 28 }}>
          Twenty four editions of Tata Volunteering Week (TVW) have been held so far — each bigger and more impactful than the last.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {EDITIONS.map((ed) => (
            <button
              key={ed.label}
              onClick={() => triggerToast(`Opening ${ed.label} archive...`)}
              style={{
                background: B_YELLOW, color: "#fff", border: "none", borderRadius: 8,
                padding: "14px 18px", textAlign: "left", cursor: "pointer", fontSize: 14, fontWeight: 600,
              }}
            >
              Read about {ed.label} <span style={{ fontWeight: 400, opacity: 0.85 }}>· {ed.detail}</span>
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
