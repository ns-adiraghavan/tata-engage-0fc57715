import React from "react";
import { motion } from "framer-motion";
import { Users, Building2, Briefcase, Heart } from "lucide-react";
import doodleCluster1 from "@/assets/doodle-cluster-1.png";
import doodleCluster2 from "@/assets/doodle-cluster-2.png";
import doodleCluster3 from "@/assets/doodle-cluster-3.png";
import doodleCluster5 from "@/assets/doodle-cluster-5.png";
import type { Role } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { ACCENT_NAVY, B_YELLOW, B_TICKER } from "@/data/homeSharedData";

const RegisterRoleView = () => {
  const { selectedRole, handleRoleSelect } = useAppContext();
  const navigate = useAppNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f5fa" }}>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 32px 56px", overflow: "hidden" }}>
        <img src={doodleCluster1} alt="" style={{ position: "absolute", left: -48, top: "50%", transform: "translateY(-60%)", width: 280, opacity: 0.10, pointerEvents: "none", userSelect: "none", rotate: "-8deg" }} />
        <img src={doodleCluster5} alt="" style={{ position: "absolute", left: 60, bottom: 24, width: 180, opacity: 0.07, pointerEvents: "none", userSelect: "none", rotate: "6deg" }} />
        <img src={doodleCluster2} alt="" style={{ position: "absolute", right: -40, top: "50%", transform: "translateY(-50%)", width: 260, opacity: 0.10, pointerEvents: "none", userSelect: "none", rotate: "12deg" }} />
        <img src={doodleCluster3} alt="" style={{ position: "absolute", right: 72, top: 20, width: 160, opacity: 0.07, pointerEvents: "none", userSelect: "none", rotate: "-6deg" }} />

        <div style={{ width: "100%", maxWidth: 840, position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: ACCENT_NAVY, marginBottom: 8, letterSpacing: "-0.4px", lineHeight: 1.15 }}>
                Create Your Account
              </h2>
              <div style={{ width: 48, height: 3, borderRadius: 2, background: B_TICKER, margin: "0 auto 14px" }} />
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Who are you joining as?</p>
            </div>

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
                      border: `2px solid ${active ? B_TICKER : "#e8e8f0"}`,
                      borderRadius: 14,
                      padding: "28px 20px 24px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column" as const,
                      alignItems: "center",
                      textAlign: "center" as const,
                      gap: 12,
                      transition: "all 0.18s",
                      boxShadow: active ? `0 0 0 4px ${B_TICKER}22, 0 8px 24px rgba(0,0,0,0.1)` : "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = B_TICKER; e.currentTarget.style.boxShadow = `0 6px 20px rgba(62,126,176,0.14)`; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "#e8e8f0"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; } }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: active ? "rgba(255,255,255,0.12)" : `${B_TICKER}18`, color: active ? "#fff" : B_TICKER, flexShrink: 0 }}>
                      <role.icon size={23} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: 14, color: active ? "#fff" : ACCENT_NAVY, marginBottom: 6 }}>{role.title}</h4>
                      <p style={{ fontSize: 11.5, color: active ? "rgba(255,255,255,0.55)" : "#94a3b8", lineHeight: 1.55, margin: 0 }}>{role.desc}</p>
                    </div>
                    {active && (
                      <div style={{ fontSize: 11, fontWeight: 700, color: B_YELLOW, letterSpacing: "0.3px", marginTop: 2 }}>Selected ✓</div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <p style={{ fontSize: 13.5, color: "#94a3b8", margin: 0 }}>
                Already have an account?{" "}
                <button onClick={() => navigate("login")} style={{ fontWeight: 700, color: B_TICKER, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
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
