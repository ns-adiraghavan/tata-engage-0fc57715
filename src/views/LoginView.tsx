import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, ShieldCheck, Landmark, Mail, Lock, Eye, MapPin } from "lucide-react";
import { useLocation } from "react-router-dom";
import doodleCluster1 from "@/assets/doodle-cluster-1.png";
import doodleCluster2 from "@/assets/doodle-cluster-2.png";
import doodleCluster3 from "@/assets/doodle-cluster-3.png";
import doodleCluster5 from "@/assets/doodle-cluster-5.png";
import { VIKRAM_NAIR, ROHAN_DESAI, PRIYA_SHARMA, ANJALI_MEHTA, ANJALI_GUPTA_REGIONAL, IS_PE_SEASON, togglePESeason } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { ACCENT_NAVY, B_TICKER } from "@/data/homeSharedData";

const DEMO_BUTTONS = [
  {
    label: "Tata Employee SSO",
    icon: ShieldCheck,
    user: PRIYA_SHARMA,
    dest: "volunteer-hub" as const,
    toast: "Login Successful! Welcome back, Shrirang.",
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
  const [showPassword, setShowPassword] = useState(false);

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

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 32px 52px", overflow: "hidden" }}>

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
                   <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: ACCENT_NAVY, marginBottom: 6 }}>Email Address</label>
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
