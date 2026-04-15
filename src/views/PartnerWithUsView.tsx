import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAppContext } from "@/context/AppContext";
import SubPageDotRail from "@/components/shared/SubPageDotRail";
import Footer from "@/components/layout/Footer";

const B_INDIGO = "#333399";
const B_YELLOW = "#E8A817";
const P_INDIGO = "#eef0ff";
const P_ORANGE = "#fff5eb";
const ACCENT_NAVY = "#0D1B3E";

const SECTIONS = [
  { id: "pwu-hero", label: "Overview" },
  { id: "pwu-mission", label: "Mission" },
  { id: "pwu-need", label: "Need Volunteers?" },
  { id: "pwu-cta", label: "Get Started" },
];

const cardHover = {
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; },
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; },
};

export default function PartnerWithUsView() {
  const navigate = useAppNavigate();
  const { triggerToast } = useAppContext();

  return (
    <div style={{ paddingTop: 0, paddingBottom: 0, background: "#fff", minHeight: "100vh" }}>

      {/* 2px accent line */}
      <div style={{ height: 2, background: B_INDIGO, width: "100%" }} />

      {/* Dot rail */}
      <SubPageDotRail sections={SECTIONS} accentColor={B_INDIGO} />

      {/* 1 — Hero */}
      <div id="pwu-hero" style={{ maxWidth: 900, margin: "0 auto", padding: "100px 56px 48px" }}>
        <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 38, color: B_INDIGO, margin: "0 0 28px" }}>Partner with us</h1>
        <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", borderBottom: `3px solid ${B_YELLOW}` }}>
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=80"
            alt="Community partners"
            style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)", padding: 32 }}>
            <p style={{ fontStyle: "italic", fontSize: 24, fontWeight: 700, color: "#fff", textAlign: "center", maxWidth: 560, lineHeight: 1.4, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
              "if non-profits are the engines of change, Volunteers are the fuel"
            </p>
          </div>
        </div>
      </div>

      {/* 2 — Mission Text */}
      <div id="pwu-mission" style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 18, color: B_INDIGO, lineHeight: 1.7, marginBottom: 20 }}>
          While there are many well-meaning individuals who wish to volunteer their time and expertise, a host of volunteering opportunities across non-profits tend to go unnoticed due to the absence of a mechanism to link willing volunteers to non-profits in need.
        </p>
        <p style={{ fontSize: 18, color: ACCENT_NAVY, fontWeight: 700, lineHeight: 1.7 }}>
          At Tata Engage, we aim to be the bridge that connects civil society organisations and motivated professionals.
        </p>
      </div>

      {/* 3 — Need Volunteers? */}
      <div id="pwu-need" style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 48px" }}>
        <h2 style={{ color: B_INDIGO, fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 24 }}>Need Volunteers?</h2>
        <div style={{ border: "1px solid #e8e8f0", borderRadius: 14, padding: 32, transition: "transform 0.2s, box-shadow 0.2s" }} {...cardHover}>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
            Non-profits that wish to partner with the Tata Sustainability Group need to be associated with a Tata company for a fair duration. Once the non-profit has enrolled itself on Tata Engage, the non-profit representative can login on the website and upload details of projects that require volunteers.
          </p>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 12 }}>
            To enrol, write to us at
          </p>
          <button
            onClick={() => {
              navigator.clipboard?.writeText("tataengage@tata.com");
              triggerToast("Email copied to clipboard");
            }}
            style={{ background: B_YELLOW, color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 12 }}
          >
            tataengage@tata.com
          </button>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            with your NGO profile, years of association with Tata group companies and need for volunteers.
          </p>
        </div>
      </div>

      {/* 4 — Two-path CTA */}
      <div id="pwu-cta" style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 64px", display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 45%", minWidth: 280, background: P_INDIGO, border: "1px solid #d8dafe", borderRadius: 14, padding: 28, transition: "transform 0.2s, box-shadow 0.2s" }} {...cardHover}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 10 }}>Are you a Tata Employee?</h3>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 18 }}>Register on Tata Engage and discover volunteering opportunities across programmes.</p>
          <button
            onClick={() => navigate("register-role")}
            style={{ background: B_INDIGO, color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Register as Volunteer
          </button>
        </div>
        <div style={{ flex: "1 1 45%", minWidth: 280, background: P_ORANGE, border: "1px solid #ffe4c4", borderRadius: 14, padding: 28, transition: "transform 0.2s, box-shadow 0.2s" }} {...cardHover}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 10 }}>Are you an NGO or non-profit?</h3>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 18 }}>Partner with us to access skilled Tata Group volunteers for your projects.</p>
          <button
            onClick={() => navigate("register-role")}
            style={{ background: B_INDIGO, color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Register as NGO Partner
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
