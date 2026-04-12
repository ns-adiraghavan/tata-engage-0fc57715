import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Building2, Briefcase, Heart } from "lucide-react";
import tataEngageLogoNoBg from "@/assets/tata-engage-logo-nobg.png";
import type { Role } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { ACCENT_NAVY, B_INDIGO } from "@/data/homeSharedData";

const QUOTES = [
  { text: "Volunteering is the ultimate exercise in democracy.", author: "Susan J. Ellis" },
  { text: "The best way to find yourself is to lose yourself in service.", author: "Mahatma Gandhi" },
  { text: "Alone we can do so little; together we can do so much.", author: "Helen Keller" },
];

const STATS = [
  { num: "50K+", label: "Volunteers" },
  { num: "85", label: "NGO Partners" },
  { num: "2.5M+", label: "Hours" },
];

const LEFT_TEXTURE = {
  backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 24px)`,
  backgroundSize: "24px 24px",
};

const RegisterRoleView = () => {
  const { selectedRole, handleRoleSelect } = useAppContext();
  const navigate = useAppNavigate();
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setQuoteIdx((p) => (p + 1) % QUOTES.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div
        className="hidden md:flex w-1/2 flex-col justify-between relative"
        style={{ backgroundColor: ACCENT_NAVY, padding: "60px 48px", ...LEFT_TEXTURE }}
      >
        <div>
          <button
            onClick={() => navigate("home")}
            className="text-xs font-medium mb-10 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            ← Back to Home
          </button>
          <img src={tataEngageLogoNoBg} alt="TATA engage" className="h-14 object-contain mb-16" style={{ filter: "brightness(0) invert(1)" }} />
        </div>

        <div className="flex-1 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <p style={{ fontSize: 22, fontWeight: 300, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, fontStyle: "italic" }}>
                "{QUOTES[quoteIdx].text}"
              </p>
              <p className="mt-4" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)" }}>
                — {QUOTES[quoteIdx].author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-10">
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "white" }}>{s.num}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="w-full md:w-1/2 bg-white overflow-y-auto" style={{ padding: "60px 48px" }}>
        {/* Mobile-only back link */}
        <button
          onClick={() => navigate("home")}
          className="md:hidden text-xs font-medium mb-6 cursor-pointer"
          style={{ color: "rgba(0,0,0,0.4)" }}
        >
          ← Back to Home
        </button>

        <div className="mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-center md:justify-start mb-6 md:hidden">
              <img src={tataEngageLogoNoBg} alt="TATA engage" className="h-16 object-contain" />
            </div>
            <h2 className="text-4xl font-bold text-zinc-900 mb-2">Create Your Account</h2>
            <p className="text-zinc-500 text-lg">Join our volunteering platform</p>
          </motion.div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-xl p-8 md:p-12" style={{ borderColor: "#e8e8f0" }}>
          <h3 className="text-xl font-bold text-zinc-900 mb-8">Select Your Role</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { id: "tata_employee", title: "Tata Employee", icon: Briefcase, desc: "Current Tata Group employees with or without official Tata email" },
              { id: "family_member", title: "Family Member", icon: Users, desc: "Spouse, child, parent, or sibling of a Tata employee" },
              { id: "retired_employee", title: "Retired Employee", icon: Heart, desc: "Former Tata Group employees who have retired" },
              { id: "ngo", title: "Partner Organisation", icon: Building2, desc: "NGOs and non-profits seeking volunteer support" },
            ].map((role, i) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleRoleSelect(role.id as Role)}
                className={`role-card ${selectedRole === role.id ? "active" : ""}`}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={
                    selectedRole === role.id
                      ? { backgroundColor: B_INDIGO, color: "white" }
                      : { backgroundColor: "#f4f4f5", color: "#71717a" }
                  }
                >
                  <role.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 mb-1">{role.title}</h4>
                  <p className="text-xs text-zinc-500 leading-tight">{role.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-100 text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{" "}
              <button onClick={() => navigate("login")} className="font-bold text-zinc-900 hover:underline cursor-pointer">
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterRoleView;
