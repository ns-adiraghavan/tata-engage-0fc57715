import { useAppNavigate } from "@/hooks/useAppNavigate";
import Footer from "@/components/layout/Footer";

const B_INDIGO = "#333399";
const P_INDIGO = "#eef0ff";
const B_YELLOW = "#E8A817";

const PILLS = ["breeds empathy", "demonstrates commitment", "precipitates solutions", "improves understanding", "spurs action"];

const FEATURES = [
  { heading: "Bringing together", desc: "not only Tata employees, but also their families and retired Tata employees" },
  { heading: "Connecting the volunteers", desc: "with not only the causes close to their hearts, but also the NGOs who work towards the cause more competently" },
  { heading: "Helping employees", desc: "to donate not just their time, but also talent to bring about a greater difference" },
  { heading: "Curating volunteering opportunities", desc: "ranging from a one-hour experiential activity to a six-month professional project" },
  { heading: "Designing programmes", desc: "that not only contribute towards community development, but also towards the volunteer's professional and personal growth" },
];

const PROGRAMMES = [
  { name: "Tata Volunteering Week (TVW)", desc: "The flagship annual week of community service across the Tata Group.", nav: "about-tvw" },
  { name: "ProEngage", desc: "Skill-based volunteering matching professionals with NGO projects.", nav: "about-proengage" },
  { name: "Volunteering for Disaster Response", desc: "Rapid mobilisation of volunteers during natural disasters.", nav: "disaster-response" },
];

const TEAM = [
  { name: "Shrirang Dhavale", title: "Cluster Head and General Manager" },
  { name: "Gauri Rajadhyaksha", title: "Deputy General Manager" },
  { name: "Supriya Ramachandran", title: "Manager" },
  { name: "Trupti Prabhu", title: "Assistant Manager" },
];

export default function AboutView() {
  const navigate = useAppNavigate();

  return (
    <div style={{ paddingTop: 0, paddingBottom: 0, background: "#fff", minHeight: "100vh" }}>
      {/* 1 — Hero */}
      <div style={{ background: "#0D1B3E", padding: "100px 24px 64px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 900, fontSize: 42, color: "#fff", margin: 0, lineHeight: 1.2 }}>
          About Tata Engage
        </h1>
        <p style={{ fontStyle: "italic", fontWeight: 300, fontSize: 18, color: "rgba(255,255,255,0.75)", marginTop: 12, marginBottom: 28 }}>
          Institutionalising the spirit of giving across the Tata Group
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {PILLS.map((p) => (
            <span key={p} style={{ background: P_INDIGO, color: B_INDIGO, fontSize: 13, fontWeight: 600, padding: "6px 16px", borderRadius: 20 }}>
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* 2 — Legacy */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, marginBottom: 20 }}>Legacy</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Jamsetji Tata's foresight went far beyond pure business. His spirit of selfless giving and philosophy of constructive philanthropy became a tradition for the group he founded.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
          While every Tata employee, and Tata company, is distinctive, what binds them is the Tata values and the ethos of giving back to society.
        </p>
      </div>

      {/* 3 — About TSG */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 56px", display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 55%", minWidth: 300 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#94A3B8" }}>
            by TATA SUSTAINABILITY GROUP
          </span>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginTop: 14 }}>
            The Tata Sustainability Group (TSG) guides Tata companies on sustainability and social responsibility, embedding the ethos of giving into everyday business.
          </p>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginTop: 12 }}>
            TSG conceptualised TataEngage as the unified digital vehicle for volunteering — connecting employees, NGOs, and communities on a single platform.
          </p>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginTop: 12 }}>
            Through TataEngage, TSG enables structured, scalable, and impactful volunteering across all Tata Group companies worldwide.
          </p>
          <div style={{ borderLeft: "3px solid #333399", background: "#eef2ff", padding: 16, borderRadius: 6, marginTop: 20, fontSize: 15, color: "#334155", lineHeight: 1.7, fontStyle: "italic" }}>
            Tata Engage is a brainchild of the Tata Sustainability Group — designed to institutionalise volunteerism and make it accessible, measurable, and rewarding for every Tata stakeholder.
          </div>
        </div>
        <div style={{ flex: "1 1 35%", minWidth: 240, background: "#eef0ff", borderRadius: 14, height: 200 }} />
      </div>

      {/* 4 — What TataEngage Does */}
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "40px 24px 56px" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 32 }}>What TataEngage Does</h2>
        {FEATURES.map((f, i) => (
          <div key={i}>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 18, fontWeight: 600, fontStyle: "italic", color: B_INDIGO }}>{f.heading}</div>
              <div style={{ fontSize: 14, color: "#6b6b7a", marginTop: 6 }}>{f.desc}</div>
            </div>
            {i < FEATURES.length - 1 && <div style={{ height: 1, background: "#e8e8f0" }} />}
          </div>
        ))}
      </div>

      {/* 5 — Vision */}
      <div style={{ background: "#f5f5fa", padding: "48px 24px", textAlign: "center" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, marginBottom: 16 }}>Vision</h2>
        <p style={{ fontStyle: "italic", color: "#1E6ED4", fontSize: 17, maxWidth: 640, margin: "0 auto", lineHeight: 1.7 }}>
          To encourage Tata volunteers around the globe to engage with the community by contributing their time and skills.
        </p>
      </div>

      {/* 6 — The Purpose */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 24px" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 28 }}>The Purpose</h2>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 45%", minWidth: 280, border: "1px solid #e2e4ea", borderRadius: 14, padding: 24 }}>
            <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 20 }}>
              Helping Tata employees and their families discover meaningful volunteering opportunities — turning intent into impact through structured programmes.
            </p>
            <button onClick={() => navigate("register-role")} style={{ background: B_YELLOW, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Register here to volunteer
            </button>
          </div>
          <div style={{ flex: "1 1 45%", minWidth: 280, border: "1px solid #e2e4ea", borderRadius: 14, padding: 24 }}>
            <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 20 }}>
              Enabling NGOs to access skilled Tata volunteers, amplify their programmes, and create lasting community change at scale.
            </p>
            <button onClick={() => navigate("partner")} style={{ background: B_YELLOW, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Partner with us
            </button>
          </div>
        </div>
      </div>

      {/* 7 — The Programmes */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 56px" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 28 }}>The Programmes</h2>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {PROGRAMMES.map((pr) => (
            <div key={pr.name} style={{ flex: "1 1 30%", minWidth: 250, border: "1px solid #e2e4ea", borderRadius: 14, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#0D1B3E", marginBottom: 6 }}>{pr.name}</div>
              <div style={{ fontSize: 14, color: "#64748B", marginBottom: 16 }}>{pr.desc}</div>
              <span onClick={() => navigate(pr.nav)} style={{ fontSize: 13, fontWeight: 600, color: "#1E6ED4", cursor: "pointer" }}>Learn more →</span>
            </div>
          ))}
        </div>
      </div>

      {/* 8 — Meet the Team */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 28 }}>Meet the Tata Engage Team</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {TEAM.map((t) => (
            <div key={t.name} style={{ textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: P_INDIGO, margin: "0 auto 12px" }} />
              <div style={{ fontWeight: 700, fontSize: 15, color: "#0D1B3E" }}>{t.name}</div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{t.title}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Social Services Cluster</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
