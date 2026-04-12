import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, ShieldCheck, Landmark, Mail, Lock, Eye, MapPin, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import tataEngageLogoNoBg from "@/assets/tata-engage-logo-nobg.png";
import { VIKRAM_NAIR, ROHAN_DESAI, PRIYA_SHARMA, ANJALI_MEHTA, ANJALI_GUPTA_REGIONAL, IS_PE_SEASON, togglePESeason } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { B_INDIGO, B_YELLOW, ACCENT_NAVY } from "@/data/homeSharedData";

const STATS = [
  { num: "50,000+", label: "Active Volunteers" },
  { num: "2.5M+", label: "Volunteer Hours Logged" },
  { num: "85", label: "NGO Partners" },
];

const DIAG_TEXTURE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: "repeating-linear-gradient(45deg, rgba(51,51,153,0.08) 0px, rgba(51,51,153,0.08) 1px, transparent 1px, transparent 22px)",
  backgroundSize: "22px 22px",
  pointerEvents: "none",
};

const LoginView = () => {
  const { setIsLoggedIn, setUser } = useAuth();
  const navigate = useAppNavigate();
  const { triggerToast } = useAppContext();
  const location = useLocation();
  const isAdminLogin = location.pathname === "/admin-login";
  const [isPESeason, setIsPESeason] = useState(IS_PE_SEASON);
  const [statIdx, setStatIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStatIdx(i => (i + 1) % STATS.length), 4000);
    return () => clearInterval(id);
  }, []);

  const togglePE = () => {
    const newVal = togglePESeason();
    setIsPESeason(newVal);
    triggerToast(newVal ? "PE Season ON — dashboard shows ProEngage mode" : "PE Season OFF — dashboard shows non-PE mode");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div style={{ background: B_INDIGO, height: 2, width: "100%" }} />

      <div className="flex flex-1">
        {/* ── LEFT PANEL ── */}
        <div
          className="hidden md:flex w-1/2 flex-col justify-between relative overflow-hidden"
          style={{ backgroundColor: ACCENT_NAVY, padding: "64px 48px" }}
        >
          <div style={DIAG_TEXTURE} />
          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Top — logo */}
            <div>
              <img src={tataEngageLogoNoBg} alt="TataEngage" className="h-10 object-contain brightness-0 invert mb-6" />
            </div>

            {/* Middle — rotating stat */}
            <div>
              <div
                key={statIdx}
                style={{
                  transition: "opacity 400ms ease",
                  animation: "te-fade-in 400ms ease",
                }}
              >
                <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2, color: "#fff", lineHeight: 1.1 }}>
                  {STATS[statIdx].num}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, marginTop: 8 }}>
                  {STATS[statIdx].label}
                </div>
              </div>
            </div>

            {/* Bottom — register link */}
            <div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }} className="mb-2">
                New to TataEngage?
              </p>
              <button
                onClick={() => navigate("register-role")}
                className="flex items-center gap-2 text-sm font-bold hover:underline cursor-pointer"
                style={{ color: B_YELLOW }}
              >
                Create an account <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-full md:w-1/2 bg-white overflow-y-auto flex items-center justify-center" style={{ padding: "64px 48px" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-10">
              <div className="flex justify-center mb-4 md:hidden">
                <img src={tataEngageLogoNoBg} alt="TATA engage" className="h-16 object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
              <p className="text-slate-500 text-sm mt-2">
                {isAdminLogin ? "Login to your admin dashboard" : "Login to your volunteering dashboard"}
              </p>
            </div>

            {!isAdminLogin && (
              <>
                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    setUser(PRIYA_SHARMA);
                    navigate("volunteer-hub");
                    triggerToast("Login Successful! Welcome back, Priya.");
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-[#003580] text-white py-4 rounded-2xl font-bold hover:bg-[#002a66] transition-all mb-6 cursor-pointer shadow-lg shadow-blue-900/20"
                >
                  <ShieldCheck size={20} />
                  Tata Employee SSO
                </button>

                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    setUser(ROHAN_DESAI);
                    navigate("spoc-hub");
                    triggerToast("Login Successful! Welcome back, Rohan.");
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-[#00b4d8] text-tata-blue py-4 rounded-2xl font-bold hover:bg-[#00a0c2] transition-all mb-6 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Building2 size={20} />
                  Login as SPOC
                </button>

                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    setUser(ANJALI_MEHTA);
                    navigate("ngo-hub");
                    triggerToast("Login Successful! Welcome back, Anjali.");
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all mb-6 cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <Landmark size={20} />
                  Login as NGO
                </button>

                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    setUser(ANJALI_GUPTA_REGIONAL);
                    navigate("spoc-hub");
                    triggerToast("Login Successful! Welcome back, Anjali (Regional SPOC).");
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-violet-600 text-white py-4 rounded-2xl font-bold hover:bg-violet-700 transition-all mb-6 cursor-pointer shadow-lg shadow-violet-600/20"
                >
                  <MapPin size={20} />
                  Anjali (Regional SPOC)
                </button>
                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Demo mode</span>
                  <button onClick={togglePE} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${isPESeason ? "bg-violet-50 border-violet-200 text-violet-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                    {isPESeason ? "🟢 PE Season active" : "⚪ Outside PE Season"}
                  </button>
                </div>
              </>
            )}

            {isAdminLogin && (
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setUser(VIKRAM_NAIR);
                  navigate("admin-dashboard");
                  triggerToast("Login Successful! Welcome, Vikram Nair.");
                }}
                className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all mb-6 cursor-pointer shadow-lg shadow-zinc-900/20"
              >
                <ShieldCheck size={20} />
                Login as Admin
              </button>
            )}

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or Login With</span></div>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="form-label">Email Address / Phone Number</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input type="text" placeholder="Enter email or phone" className="form-input pl-12" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="form-label mb-0">Password</label>
                  <button onClick={() => navigate("forgot-password")} type="button" className="text-xs font-bold text-zinc-900 hover:underline cursor-pointer">Forgot Password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input type="password" placeholder="••••••••" className="form-input pl-12 pr-12" />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 cursor-pointer"><Eye size={18} /></button>
                </div>
              </div>
              <button type="button" disabled className="w-full btn-black py-4 text-lg mt-4 opacity-50 cursor-not-allowed">Log In</button>
            </form>

            {!isAdminLogin && (
              <p className="text-center text-sm text-slate-500 mt-8">
                Don't have an account? <button onClick={() => navigate("register-role")} className="font-bold text-tata-blue hover:underline cursor-pointer">Register Now</button>
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes te-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoginView;
