import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/layout/Footer";

const B_INDIGO = "#333399";
const ACCENT_NAVY = "#0D1B3E";

const CATEGORIES = ["Tata Employees", "Their Family Members", "Retired Tata Employees"];

const TSG_ROWS = [
  ["Sourcing meaningful projects", "Inviting volunteer applications"],
  ["Conducting orientation workshops for selected volunteers", "Periodic tracking throughout the project duration"],
  ["Awarding certificates to successful volunteers", "Documentation and knowledge banking"],
];

export default function AboutProEngageView() {
  const navigate = useAppNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div style={{ paddingTop: 0, paddingBottom: 0, background: "#fff", minHeight: "100vh" }}>

      {/* 1 — Hero */}
      <div style={{ background: "#f8f9fb", padding: "100px 56px 64px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 40 }}>
        <div style={{ flex: "1 1 55%", minWidth: 320 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#94A3B8", marginBottom: 10 }}>PROGRAMME</div>
          <h1 style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 900, fontSize: 40, color: ACCENT_NAVY, margin: 0, lineHeight: 1.15 }}>ProEngage</h1>
          <span style={{ display: "inline-block", marginTop: 14, background: B_INDIGO, color: "#fff", fontStyle: "italic", fontWeight: 600, fontSize: 15, padding: "8px 20px", borderRadius: 8 }}>
            accelerate THE CHANGE
          </span>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginTop: 20, maxWidth: 520 }}>
            Participate in ProEngage, a part-time, skill-based volunteering programme, which offers you the unique opportunity to contribute your domain expertise and helm exciting projects that create lasting impact for non-profit organisations.
          </p>
        </div>
        <div style={{ flex: "1 1 40%", minWidth: 280 }}>
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
            alt="Community volunteering"
            style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 14 }}
          />
        </div>
      </div>

      {/* 2 — Core Description */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 20, fontStyle: "italic", color: B_INDIGO, lineHeight: 1.6, marginBottom: 16 }}>
          "Under ProEngage, TSG provides exciting volunteering projects in areas such as HR, finance, business planning, IT, web design, social media and marketing, mentoring and coaching to help non-profits build and sustain their capacity."
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
          Duration of the activity can range from one to six months and volunteering is mainly during weekends and holidays.
        </p>
      </div>

      {/* 3 — Who all can ProEngage? */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 48px", textAlign: "center" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, marginBottom: 20 }}>Who all can ProEngage?</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 20 }}>
          {CATEGORIES.map((c) => (
            <span key={c} style={{ border: "1px solid #e8e8f0", borderRadius: 100, padding: "8px 20px", fontWeight: 600, fontSize: 14, color: "#334155" }}>{c}</span>
          ))}
        </div>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 10 }}>
          Volunteers who are already engaged with a non-profit in an individual capacity can also route their projects through ProEngage to gain recognition and structured support.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
          ProEngage projects require skill-based volunteering — participants contribute professional expertise rather than general time-based effort.
        </p>
      </div>

      {/* 4 — Time Investment */}
      <div style={{ background: "#f5f5fa", padding: "48px 24px", textAlign: "center" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, marginBottom: 16 }}>Time Investment</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, maxWidth: 720, margin: "0 auto" }}>
          Volunteers need to work during their own spare time on weekends, holidays and after-work hours. They will get two working days off from work in a quarter and a total of four working days off for a six-month project — enabling meaningful contribution without disrupting professional commitments.
        </p>
      </div>

      {/* 5 — How We Go About It? */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, marginBottom: 16 }}>How We Go About It?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 14 }}>
          ProEngage is announced twice a year — on the <strong style={{ color: B_INDIGO }}>15th of June</strong> and the <strong style={{ color: B_INDIGO }}>5th of December</strong>. NGOs submit project briefs which are reviewed and curated by TSG for quality and relevance.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 14 }}>
          Once projects are approved, they are published on TataEngage for volunteers to browse and apply based on their skills, interests, and availability. A matching algorithm helps pair volunteers with the best-fit opportunities.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
          Selected volunteers attend orientation workshops conducted by TSG before project kick-off. Project duration ranges from one to six months, with periodic check-ins and milestone tracking throughout.
        </p>
      </div>

      {/* 6 — Role of TSG */}
      <div style={{ background: "#f5f5fa", padding: "48px 24px" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 28 }}>Role of Tata Sustainability Group</h2>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {TSG_ROWS.map((row, i) => (
            <div key={i} style={{ display: "flex", borderTop: i > 0 ? "1px solid #e8e8f0" : "none", padding: "16px 0" }}>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#334155", paddingRight: 16 }}>{row[0]}</div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#334155", paddingLeft: 16 }}>{row[1]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 — Timelines */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, marginBottom: 16 }}>Timelines</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
          ProEngage happens twice a year with the two editions kicking off on the{" "}
          <strong style={{ color: B_INDIGO }}>15th of June</strong> and{" "}
          <strong style={{ color: B_INDIGO }}>5th of December</strong> respectively.
        </p>
      </div>

      {/* 8 — Apply CTA */}
      <div style={{ background: B_INDIGO, padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 16 }}>Ready to contribute your skills?</h2>
        <button
          onClick={() => navigate(isLoggedIn ? "proengage" : "login")}
          style={{ background: "#fff", color: B_INDIGO, border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}
        >
          Browse ProEngage Projects →
        </button>
      </div>

      <Footer />
    </div>
  );
}
