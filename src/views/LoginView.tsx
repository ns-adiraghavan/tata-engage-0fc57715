import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ShieldCheck, Landmark, Mail, Lock, Eye, MapPin, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import tataEngageLogoNoBg from "@/assets/tata-engage-logo-nobg.png";
import doodleCluster1 from "@/assets/doodle-cluster-1.png";
import doodleCluster2 from "@/assets/doodle-cluster-2.png";
import doodleCluster3 from "@/assets/doodle-cluster-3.png";
import doodleCluster5 from "@/assets/doodle-cluster-5.png";
import { VIKRAM_NAIR, ROHAN_DESAI, PRIYA_SHARMA, ANJALI_MEHTA, ANJALI_GUPTA_REGIONAL, IS_PE_SEASON, togglePESeason } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { ACCENT_NAVY, B_YELLOW, B_TICKER } from "@/data/homeSharedData";

const QUOTES = [
  { text: "The best way to find yourself is to lose yourself in service.", author: "Mahatma Gandhi" },
  { text: "Volunteering is the ultimate exercise in democracy.", author: "Susan J. Ellis" },
  { text: "No one has ever become poor by giving.", author: "Anne Frank" },
];

const STATS = [
  { num: "50,000+", label: "Active Volunteers" },
  { num: "2.5M+",   label: "Hours Logged"      },
  { num: "85",       label: "NGO Partners"      },
];

const TEXTURE = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 22px)",
  backgroundSize: "22px 22px",
};

const DEMO_BUTTONS = [
  {
    label: "Tata Employee SSO",
    icon: ShieldCheck,
    user: PRIYA_SHARMA,
    dest: "volunteer-hub" as const,
    toast: "Login Successful! Welcome back, Priya.",
  },
  {
    label: "Login as SPOC",
    icon: Building2,
    user: ROHAN_DESAI,
    dest: "spoc-hub" as const,
    toast: "Login Successful! Welcome back, Rohan.",
  },
  {
    label: "Login as NGO",
    icon: Landmark,
    user: ANJALI_MEHTA,
    dest: "ngo-hub" as const,
    toast: "Login Successful! Welcome back, Anjali.",
  },
  {
    label: "Anjali (Regional SPOC)",
    icon: MapPin,
    user: ANJALI_GUPTA_REGIONAL,
    dest: "spoc-hub" as const,
    toast: "Login Successful! Welcome back, Anjali (Regional SPOC).",
  },
];

const LoginView = () => {
  const { setIsLoggedIn, setUser } = useAuth();
  const navigate = useAppNavigate();
  const { triggerToast } = useAppContext();
  const location = useLocation();
  const isAdminLogin = location.pathname === "/admin-login";
  const [isPESeason, setIsPESeason] = useState(IS_PE_SEASON);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setQuoteIdx((p) => (p + 1) % QUOTES.length), 3500);
    return () => clearInterval(id);
  }, []);

  const togglePE = () => {
    const newVal = togglePESeason();
    setIsPESeason(newVal);
    triggerToast(newVal ? "PE Season ON — dashboard shows ProEngage mode" : "PE Season OFF — dashboard shows non-PE mode");
  };

  const handleLogin = (user: Record<string, any>, dest: string, toast: string) => {
    setIsLoggedIn(true);
    setUser(user);
    navigate(dest as any);
    triggerToast(toast);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f5fa" }}>

      {/* TOP BANNER */}
      <div style={{ backgroundColor: B_TICKER, position: "relative", overflow: "hidden", padding: "92px 64px 28px", ...TEXTURE }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 340, height: 340, background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 220, height: 220, background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <img src={doodleCluster1} alt="" style={{ position: "absolute", left: -30, top: 10, width: 200, opacity: 0.07, pointerEvents: "none", userSelect: "none", rotate: "-12deg" }} />
        <img src={doodleCluster2} alt="" style={{ position: "absolute", right: -20, bottom: -30, width: 220, opacity: 0.07, pointerEvents: "none", userSelect: "none", rotate: "8deg" }} />
        <img src={doodleCluster3} alt="" style={{ position: "absolute", right: "35%", top: -10, width: 140, opacity: 0.05, pointerEvents: "none", userSelect: "none", rotate: "15deg" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          {/* Left — logo + back */}
          <div style={{ flexShrink: 0 }}>
            <button onClick={() => navigate("home")} style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer", marginBottom: 12, display: "block", letterSpacing: "0.5px" }}>
              ← Back to Home
            </button>
            <img src={tataEngageLogoNoBg} alt="TATA engage" style={{ height: 36, objectFit: "contain", filter: "brightness(0) invert(1)", display: "block" }} />
          </div>

          {/* Centre — rotating quote */}
          <div style={{ flex: 1, textAlign: "center", maxWidth: 500 }}>
            <AnimatePresence mode="wait">
              <motion.div key={quoteIdx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
                <p style={{ fontSize: 14, fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, margin: 0 }}>
                  "{QUOTES[quoteIdx].text}"
                </p>
                <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.3)", marginTop: 8 }}>
                  — {QUOTES[quoteIdx].author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — stats */}
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

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "52px 32px", overflow: "hidden" }}>

        {/* Doodles */}
        <img src={doodleCluster1} alt="" style={{ position: "absolute", left: -48, top: "50%", transform: "translateY(-60%)", width: 280, opacity: 0.10, pointerEvents: "none", userSelect: "none", rotate: "-8deg" }} />
        <img src={doodleCluster5} alt="" style={{ position: "absolute", left: 60, bottom: 24, width: 180, opacity: 0.07, pointerEvents: "none", userSelect: "none", rotate: "6deg" }} />
        <img src={doodleCluster2} alt="" style={{ position: "absolute", right: -40, top: "50%", transform: "translateY(-50%)", width: 260, opacity: 0.10, pointerEvents: "none", userSelect: "none", rotate: "12deg" }} />
        <img src={doodleCluster3} alt="" style={{ position: "absolute", right: 72, top: 20, width: 160, opacity: 0.07, pointerEvents: "none", userSelect: "none", rotate: "-6deg" }} />

        <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Heading */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: ACCENT_NAVY, marginBottom: 8, letterSpacing: "-0.4px" }}>
                {isAdminLogin ? "Admin Login" : "Welcome Back"}
              </h2>
              <div style={{ width: 48, height: 3, borderRadius: 2, background: B_TICKER, margin: "0 auto 14px" }} />
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                {isAdminLogin ? "Login to your admin dashboard" : "Login to your volunteering dashboard"}
              </p>
            </div>

            {/* White card */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, padding: "36px 32px" }}>

              {/* Demo login buttons */}
              {!isAdminLogin && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {DEMO_BUTTONS.map(({ label, icon: Icon, user, dest, toast }) => (
                    <button
                      key={label}
                      onClick={() => handleLogin(user, dest, toast)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        backgroundColor: B_TICKER, color: "#fff",
                        padding: "13px 20px", borderRadius: 10,
                        fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
                        transition: "filter 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                      onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
                    >
                      <Icon size={17} />
                      {label}
                    </button>
                  ))}

                  {/* PE season toggle */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Demo mode</span>
                    <button
                      onClick={togglePE}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                        border: `1px solid ${isPESeason ? `${B_TICKER}40` : "#e2e8f0"}`,
                        background: isPESeason ? `${B_TICKER}10` : "#f8fafc",
                        color: isPESeason ? B_TICKER : "#94a3b8",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: isPESeason ? "#22c55e" : "#94a3b8", display: "inline-block" }} />
                      {isPESeason ? "PE Season active" : "Outside PE Season"}
                    </button>
                  </div>
                </div>
              )}

              {isAdminLogin && (
                <button
                  onClick={() => handleLogin(VIKRAM_NAIR, "admin-dashboard", "Login Successful! Welcome, Vikram Nair.")}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    backgroundColor: ACCENT_NAVY, color: "#fff",
                    padding: "13px 20px", borderRadius: 10, marginBottom: 24,
                    fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
                  }}
                >
                  <ShieldCheck size={17} />
                  Login as Admin
                </button>
              )}

              {/* Divider */}
              <div style={{ position: "relative", margin: "4px 0 20px" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
                  <div style={{ width: "100%", borderTop: "1px solid #e8e8f0" }} />
                </div>
                <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                  <span style={{ background: "#fff", padding: "0 10px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                    Or login with
                  </span>
                </div>
              </div>

              {/* Email/password form */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: ACCENT_NAVY, marginBottom: 6 }}>
                    Email Address / Phone Number
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input type="text" placeholder="Enter email or phone" className="form-input" style={{ paddingLeft: 40 }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: ACCENT_NAVY }}>Password</label>
                    <button onClick={() => navigate("forgot-password")} style={{ fontSize: 11, fontWeight: 700, color: B_TICKER, background: "none", border: "none", cursor: "pointer" }}>
                      Forgot Password?
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="form-input" style={{ paddingLeft: 40, paddingRight: 40 }} />
                    <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
                <button type="button" disabled style={{ width: "100%", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 700, background: ACCENT_NAVY, color: "#fff", border: "none", opacity: 0.4, cursor: "not-allowed", marginTop: 4 }}>
                  Log In
                </button>
              </div>
            </div>

            {!isAdminLogin && (
              <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 20 }}>
                Don't have an account?{" "}
                <button onClick={() => navigate("register-role")} style={{ fontWeight: 700, color: B_TICKER, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Register Now
                </button>
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
