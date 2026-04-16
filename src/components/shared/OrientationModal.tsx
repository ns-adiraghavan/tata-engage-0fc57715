import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const SPOC_MODULES = [
  { id: 1, title: "Platform Overview",     status: "Completed" },
  { id: 2, title: "TVW Coordinator Guide", status: "Completed" },
  { id: 3, title: "ProEngage Monitoring",  status: "Locked"    },
  { id: 4, title: "Data Privacy",          status: "Locked"    },
  { id: 5, title: "SPOC Code of Conduct",  status: "Locked"    },
];

const VOLUNTEER_MODULES = [
  { id: 1, title: "Welcome to ProEngage",    status: "Completed" },
  { id: 2, title: "Working with Your NGO",   status: "Completed" },
  { id: 3, title: "Mid-Project Check-in",    status: "Locked"    },
  { id: 4, title: "Feedback & Certificate",  status: "Locked"    },
  { id: 5, title: "Volunteer Code of Conduct", status: "Locked"  },
];

const NGO_MODULES = [
  { id: 1, title: "Welcome to Tata Engage",             status: "Completed" },
  { id: 2, title: "Posting & Managing Projects",        status: "Completed" },
  { id: 3, title: "Reviewing Volunteer Applications",   status: "Locked"    },
  { id: 4, title: "M&E Reporting",                      status: "Locked"    },
  { id: 5, title: "NGO Code of Conduct",                status: "Locked"    },
];

// Brand tokens — match dashboard tile dot accents
const KPI_TVW       = "#3E7EB0";   // Volunteer E-Module accent (matches dashboard tile dot)
const KPI_PROENGAGE = "#1A6B3C";   // NGO accent
const B_INDIGO      = "#4F46E5";   // SPOC accent
const ACCENT_NAVY   = "#0D1B3E";

const OrientationModal = () => {
  const { showOrientationModal, setShowOrientationModal } = useAppContext();
  const { user } = useAuth();

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setShowOrientationModal(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [setShowOrientationModal]);

  const isNGO  = user?.role === "ngo";
  const isSPOC = user?.role === "corporate_spoc" || user?.role === "regional_spoc";
  const modules = isNGO ? NGO_MODULES : isSPOC ? SPOC_MODULES : VOLUNTEER_MODULES;

  const accentColor = isNGO ? KPI_PROENGAGE : isSPOC ? B_INDIGO : KPI_TVW;
  const tag      = isNGO ? "NGO Orientation" : isSPOC ? "SPOC Orientation" : "Volunteer E-Module";
  const title    = isNGO ? "NGO Orientation" : isSPOC ? "SPOC Orientation" : "Volunteer E-Module";
  const subtitle = isNGO
    ? "Complete your orientation to manage projects and onboard volunteers effectively."
    : isSPOC
    ? "Master the platform to effectively manage your company's volunteering impact."
    : "Complete your orientation to unlock your project certificate and access NGO contact details.";
  const nextLabel = isNGO ? "Next: Reviewing Volunteer Applications" : isSPOC ? "Next: ProEngage Monitoring" : "Next: Mid-Project Check-in";
  const nextDesc  = isNGO
    ? "Learn how to shortlist and confirm volunteers for your project."
    : isSPOC
    ? "Learn how to track and approve ProEngage applications for your company."
    : "Complete the mid-project module to stay on track with your NGO.";

  return (
    <AnimatePresence>
      {showOrientationModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setShowOrientationModal(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(13,27,62,0.45)", zIndex: 200, backdropFilter: "blur(2px)" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, x: "-50%", y: "-48%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.97, x: "-50%", y: "-48%" }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "fixed", top: "50%", left: "50%",
              width: 720, maxWidth: "calc(100vw - 40px)", maxHeight: "calc(100vh - 80px)",
              background: "#fff", borderRadius: 16, zIndex: 201,
              boxShadow: "0 24px 64px rgba(13,27,62,0.22)",
              display: "flex", flexDirection: "column",
              fontFamily: "'DM Sans', sans-serif", overflow: "hidden",
            }}
          >
            {/* Banner — matches Monthly Update */}
            <div style={{ background: accentColor, padding: "24px 28px", flexShrink: 0 }}>
              <button
                onClick={() => setShowOrientationModal(false)}
                style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 7, color: "rgba(255,255,255,0.95)", fontSize: 13, fontWeight: 500, padding: "5px 12px", cursor: "pointer", marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}
              >
                ← Close
              </button>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 100, padding: "3px 10px", fontSize: 10.5, fontWeight: 700, color: "#fff", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 10 }}>
                {tag}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{title}</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", marginTop: 5 }}>{subtitle}</div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
                {modules.map((m) => {
                  const completed = m.status === "Completed";
                  return (
                    <div
                      key={m.id}
                      style={{
                        padding: "18px 12px",
                        borderRadius: 14,
                        border: completed ? `1.5px solid ${accentColor}33` : "1.5px solid #e8e8f0",
                        background: completed ? `${accentColor}0D` : "#fafafc",
                        opacity: completed ? 1 : 0.65,
                        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                      }}
                    >
                      <div style={{
                        width: 38, height: 38, borderRadius: "50%",
                        background: completed ? accentColor : "#e0e0e8",
                        color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: 12,
                      }}>
                        {completed ? <Check size={18} /> : <Lock size={16} />}
                      </div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: ACCENT_NAVY, lineHeight: 1.3, marginBottom: 6 }}>{m.title}</div>
                      <div style={{ fontSize: 9.5, fontWeight: 700, color: completed ? accentColor : "#aaaabc", textTransform: "uppercase", letterSpacing: "1px" }}>{m.status}</div>
                    </div>
                  );
                })}
              </div>

              {/* Resume CTA */}
              <div style={{ background: `${accentColor}0D`, border: `1px solid ${accentColor}22`, borderRadius: 14, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 240 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: accentColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0 }}>
                    40%
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 2 }}>{nextLabel}</div>
                    <div style={{ fontSize: 12, color: "#6b6b7a", lineHeight: 1.5 }}>{nextDesc}</div>
                  </div>
                </div>
                <button style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                  Resume Orientation
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrientationModal;
