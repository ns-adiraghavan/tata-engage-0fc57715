import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Building2, Briefcase, Heart } from "lucide-react";
import tataEngageLogoNoBg from "@/assets/tata-engage-logo-nobg.png";
import type { Role } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { ACCENT_NAVY, B_INDIGO, B_YELLOW } from "@/data/homeSharedData";

const QUOTES = [
  { text: "Volunteering is the ultimate exercise in democracy.", author: "Susan J. Ellis" },
  { text: "The best way to find yourself is to lose yourself in service.", author: "Mahatma Gandhi" },
  { text: "Alone we can do so little; together we can do so much.", author: "Helen Keller" },
];

const STATS = [
  { num: "50K+",  label: "Active Volunteers" },
  { num: "85",    label: "NGO Partners"      },
  { num: "2.5M+", label: "Hours Logged"      },
];

const RegisterRoleView = () => {
  const { selectedRole, handleRoleSelect } = useAppContext();
  const navigate = useAppNavigate();
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setQuoteIdx((p) => (p + 1) % QUOTES.length), 3500);
    return () => clearInterval(id);
  }, []);

  const TEXTURE = {
    backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 22px)",
    backgroundSize: "22px 22px",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* TOP BANNER */}
      <div style={{ backgroundColor: ACCENT_NAVY, position: "relative", overflow: "hidden", padding: "32px 64px", ...TEXTURE }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 340, height: 340, background: "radial-gradient(circle, rgba(51,51,153,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>

          {/* Logo + back */}
          <div style={{ flexShrink: 0 }}>
            <button onClick={() => navigate("home")} style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer", marginBottom: 14, display: "block", letterSpacing: "0.5px" }}>
              ← Back to Home
            </button>
            <img src={tataEngageLogoNoBg} alt="TATA engage" style={{ height: 38, objectFit: "contain", filter: "brightness(0) invert(1)", display: "block" }} />
          </div>

          {/* Rotating quote */}
          <div style={{ flex: 1, textAlign: "center", maxWidth: 500 }}>
            <AnimatePresence mode="wait">
              <motion.div key={quoteIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
                <p style={{ fontSize: 14.5, fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.78)", lineHeight: 1.65, margin: 0 }}>
                  "{QUOTES[quoteIdx].text}"
                </p>
                <p style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.32)", marginTop: 8 }}>
                  — {QUOTES[quoteIdx].author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 28, flexShrink: 0 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>{s.num}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROLE CARDS */}
      <div style={{ flex: 1, backgroundColor: "#f5f5fa", display: "flex", alignItems: "center", justifyContent: "center", padding: "52px 32px" }}>
        <div style={{ width: "100%", maxWidth: 860 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: ACCENT_NAVY, marginBottom: 6, textAlign: "center", letterSpacing: "-0.3px" }}>
              Create Your Account
            </h2>
            <p style={{ fontSize: 14.5, color: "#64748b", textAlign: "center", marginBottom: 36 }}>
              Who are you joining as?
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {[
                { id: "tata_employee",    title: "Tata Employee",        icon: Briefcase,  desc: "Current Tata Group employees, with or without a Tata email"  },
                { id: "family_member",    title: "Family Member",        icon: Users,      desc: "Spouse, child, parent, or sibling of a Tata employee"        },
                { id: "retired_employee", title: "Retired Employee",     icon: Heart,      desc: "Former Tata Group employees who have retired"                },
                { id: "ngo",              title: "Partner Organisation", icon: Building2,  desc: "NGOs and non-profits seeking skilled volunteer support"       },
              ].map((role, i) => {
                const active = selectedRole === role.id;
                return (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => handleRoleSelect(role.id as Role)}
                    style={{
                      backgroundColor: active ? ACCENT_NAVY : "#fff",
                      border: `2px solid ${active ? B_INDIGO : "#e8e8f0"}`,
                      borderRadius: 14,
                      padding: "28px 20px 24px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column" as const,
                      alignItems: "center",
                      textAlign: "center" as const,
                      gap: 12,
                      transition: "all 0.18s",
                      boxShadow: active ? `0 0 0 4px ${B_INDIGO}22, 0 8px 24px rgba(0,0,0,0.1)` : "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = B_INDIGO; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "#e8e8f0"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; } }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: active ? "rgba(255,255,255,0.1)" : "#EEF0FF", color: active ? "#fff" : B_INDIGO, flexShrink: 0 }}>
                      <role.icon size={23} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: 14, color: active ? "#fff" : ACCENT_NAVY, marginBottom: 6 }}>{role.title}</h4>
                      <p style={{ fontSize: 11.5, color: active ? "rgba(255,255,255,0.55)" : "#94a3b8", lineHeight: 1.55 }}>{role.desc}</p>
                    </div>
                    {active && (
                      <div style={{ fontSize: 11, fontWeight: 700, color: B_YELLOW, letterSpacing: "0.3px", marginTop: 2 }}>Selected ✓</div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <p style={{ fontSize: 13.5, color: "#94a3b8" }}>
                Already have an account?{" "}
                <button onClick={() => navigate("login")} style={{ fontWeight: 700, color: ACCENT_NAVY, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Login here
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default RegisterRoleView;
