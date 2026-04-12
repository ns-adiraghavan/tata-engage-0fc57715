import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { B_INDIGO, ACCENT_NAVY } from "@/data/homeSharedData";

const DIAG_TEXTURE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 22px)",
  backgroundSize: "22px 22px",
  pointerEvents: "none",
};

const ForgotPasswordView = () => {
  const navigate = useAppNavigate();

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
            <div>
              <Lock size={48} style={{ color: "rgba(255,255,255,0.3)" }} className="mb-8" />
              <h2 style={{ fontSize: 28, fontWeight: 900 }} className="text-white mb-4">
                Forgot your password?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontWeight: 300, fontSize: 15, lineHeight: 1.7 }} className="max-w-sm">
                Enter your registered email and we'll send a secure reset link within 2 minutes.
              </p>
            </div>

            <button
              onClick={() => navigate("login")}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest hover:opacity-80 transition-colors cursor-pointer"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <ArrowLeft size={14} /> Back to Login
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-full md:w-1/2 bg-white overflow-y-auto flex items-center justify-center" style={{ padding: "64px 48px" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            {/* Mobile-only back */}
            <button
              onClick={() => navigate("login")}
              className="flex md:hidden items-center gap-2 text-slate-500 hover:opacity-80 font-medium mb-8 transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} /> Back to Login
            </button>

            <h2 className="text-3xl font-bold mb-4" style={{ color: ACCENT_NAVY }}>Reset Password</h2>
            <p className="text-slate-500 mb-8">
              Enter your email address or phone number and we'll send you instructions to reset your password.
            </p>

            <form className="space-y-6">
              <div>
                <label className="form-label">Email Address / Phone Number</label>
                <input type="text" required placeholder="Enter email or phone" className="form-input" />
              </div>
              <button type="button" className="w-full btn-black py-4 text-lg cursor-pointer">Send Reset Link</button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordView;
