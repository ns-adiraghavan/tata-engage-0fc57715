import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { B_INDIGO, B_YELLOW, ACCENT_NAVY } from "@/data/homeSharedData";

const DIAG_TEXTURE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 22px)",
  backgroundSize: "22px 22px",
  pointerEvents: "none",
};

const OtpView = () => {
  const { otp, setOtp, handleOtpVerify } = useAppContext();
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleChange = useCallback((index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp, setOtp]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  }, [otp, setOtp]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
              {/* Envelope SVG */}
              <div className="flex flex-col items-center mb-10">
                <svg width="80" height="60" viewBox="0 0 80 60" fill="none" className="mb-4">
                  <rect x="2" y="2" width="76" height="56" rx="6" stroke="white" strokeWidth="1.5" fill="none" />
                  <polyline points="2,2 40,34 78,2" stroke="white" strokeWidth="1.5" fill="none" />
                </svg>
                <div className="flex gap-2 mt-2">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-white"
                      style={{
                        animation: "te-pulse 1.2s ease-in-out infinite",
                        animationDelay: `${delay}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <h2 style={{ fontSize: 28, fontWeight: 900 }} className="text-white mb-3">
                Check your email
              </h2>
              <p className="mb-2" style={{ color: B_YELLOW, fontSize: 15, fontWeight: 600 }}>
                your registered email
              </p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontWeight: 300, fontSize: 15, lineHeight: 1.6 }}>
                We sent a 6-digit code. It expires in 10 minutes.
              </p>
            </div>

            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              Didn't receive it? Check spam or resend below.
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-full md:w-1/2 bg-white overflow-y-auto flex items-center justify-center" style={{ padding: "64px 48px" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: `${B_INDIGO}15`, color: B_INDIGO }}>
              <Mail size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: ACCENT_NAVY }}>Verify Your Email</h2>
            <p className="text-slate-500 mb-10">
              We've sent a 6-digit verification code to your email address. Please enter it below.
            </p>

            <div className="flex justify-center gap-3 mb-10" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-14 h-16 text-center text-2xl font-bold bg-white border-2 border-slate-300 rounded-lg focus:outline-none transition-all shadow-sm"
                  style={{ borderColor: digit ? B_INDIGO : undefined }}
                />
              ))}
            </div>

            <button onClick={handleOtpVerify} className="w-full btn-black py-4 text-lg mb-6 cursor-pointer">Verify & Complete</button>

            <div className="text-sm text-zinc-500">
              {canResend ? (
                <p>
                  Didn't receive the code?{" "}
                  <button onClick={handleResend} className="font-bold hover:underline cursor-pointer" style={{ color: B_INDIGO }}>
                    Resend Code
                  </button>
                </p>
              ) : (
                <p>
                  Resend code in <span className="font-bold text-zinc-900">{countdown}s</span>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes te-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default OtpView;
