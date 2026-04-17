import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Clock } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import ConsentModal from "@/components/shared/ConsentModal";
import doodleCluster1 from "@/assets/doodle-cluster-1.png";
import doodleCluster2 from "@/assets/doodle-cluster-2.png";
import doodleCluster3 from "@/assets/doodle-cluster-3.png";
import doodleCluster5 from "@/assets/doodle-cluster-5.png";
import { ACCENT_NAVY, B_TICKER } from "@/data/homeSharedData";

const RegisterFormView = () => {
  const { selectedRole, formData, setFormData, handleConsentAccept, triggerToast } = useAppContext();
  const navigate = useAppNavigate();
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [ngoSubmitted, setNgoSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "corporate_spoc") {
      triggerToast("SPOC roles are assigned by TSG Admin. Your request has been submitted for review.");
      return;
    }
    if (selectedRole === "ngo") {
      setIsConsentOpen(true);
      return;
    }
    setIsConsentOpen(true);
  };

  const handleConsentAcceptLocal = () => {
    setIsConsentOpen(false);
    if (selectedRole === "ngo") {
      setNgoSubmitted(true);
      return;
    }
    handleConsentAccept();
  };

  const roleLabel = selectedRole === "tata_employee" ? "Tata Employee"
    : selectedRole === "retired_employee" ? "Retired Employee"
    : selectedRole === "ngo" ? "Partner Organisation"
    : selectedRole === "family_member" ? "Family Member"
    : selectedRole?.replace("-", " ");

  if (ngoSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="max-w-lg text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Clock size={40} />
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Application Submitted</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
              <p className="text-amber-800 font-semibold text-lg mb-2">Your application is under review.</p>
              <p className="text-amber-700 text-sm">TSG Admin will respond within 48 hours. You will receive an email notification once your account is approved.</p>
            </div>
            <p className="text-zinc-500 text-sm mb-8">
              In the meantime, if you have any questions, please contact us at <span className="font-semibold text-zinc-700">support@tataengage.com</span>
            </p>
            <button onClick={() => navigate("home")} className="btn-outline px-8 py-3 cursor-pointer">
              Return to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderFields = () => {
    switch (selectedRole) {
      case "tata_employee":
        return (
          <>
            <div className="mb-6 p-5 rounded-2xl flex items-start gap-4" style={{ backgroundColor: `${B_TICKER}0f`, border: `1px solid ${B_TICKER}28` }}>
              <Info size={20} className="mt-0.5 shrink-0" style={{ color: B_TICKER }} />
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: B_TICKER }}>Tata Employee Registration</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  If you have an official Tata email (@tata.com), enter it below for instant verification.
                  If you don't have a Tata email, use your personal email and provide your SPOC's email for manual verification.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Full Name*</label>
                <input type="text" required placeholder="Enter full name" className="form-input" />
              </div>
              <div>
                <label className="form-label">Tata Company*</label>
                <select required className="form-input">
                  <option value="">Select Company</option>
                  <option>Tata Consultancy Services</option>
                  <option>Tata Motors</option>
                  <option>Tata Steel</option>
                  <option>Tata Power</option>
                  <option>Titan Company</option>
                  <option>Tata Communications</option>
                  <option>Indian Hotels (IHCL)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Designation*</label>
                <input type="text" required placeholder="Enter designation" className="form-input" />
              </div>
              <div>
                <label className="form-label">Date of Birth*</label>
                <input type="date" required className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">City/Country*</label>
                <input type="text" required placeholder="Enter city, country" className="form-input" />
              </div>
              <div>
                <label className="form-label">LinkedIn URI</label>
                <input type="url" placeholder="https://linkedin.com/in/..." className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Email Address*</label>
                <input
                  type="email"
                  required
                  placeholder="Enter work or personal email"
                  className="form-input"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <p className="text-xs text-zinc-400 mt-1">Use your @tata.com email for instant verification</p>
              </div>
              <div>
                <label className="form-label">SPOC Email</label>
                <input type="email" placeholder="Enter your SPOC's email" className="form-input" />
                <p className="text-xs text-zinc-400 mt-1">Required if you don't have an official Tata email.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Professional Skills*</label>
                <input type="text" placeholder="e.g. Project Management, Coding" className="form-input" />
              </div>
              <div>
                <label className="form-label">Language Proficiency*</label>
                <input type="text" placeholder="e.g. English, Hindi" className="form-input" />
              </div>
            </div>
            <div>
              <label className="form-label">Area of Interest*</label>
              <select required className="form-input">
                <option value="">Select Interest</option>
                <option>Education</option>
                <option>Environment</option>
                <option>Livelihood</option>
                <option>Health</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Password*</label>
                <input type="password" required placeholder="••••••••" className="form-input" />
              </div>
              <div>
                <label className="form-label">Confirm Password*</label>
                <input type="password" required placeholder="••••••••" className="form-input" />
              </div>
            </div>
          </>
        );
      case "retired_employee":
        return (
          <>
            <div className="mb-6 p-5 rounded-2xl flex items-start gap-4" style={{ backgroundColor: `${B_TICKER}0f`, border: `1px solid ${B_TICKER}28` }}>
              <Info size={20} className="mt-0.5 shrink-0" style={{ color: B_TICKER }} />
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: B_TICKER }}>Retired Employee Registration</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Welcome back to the Tata family! As a retiree, you'll need to provide a personal email and the email of a SPOC from your last Tata company who can confirm your service history.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Full Name*</label>
                <input type="text" required placeholder="Enter full name" className="form-input" />
              </div>
              <div>
                <label className="form-label">Last Tata Company*</label>
                <select required className="form-input">
                  <option value="">Select Company</option>
                  <option>Tata Consultancy Services</option>
                  <option>Tata Motors</option>
                  <option>Tata Steel</option>
                  <option>Tata Power</option>
                  <option>Titan Company</option>
                  <option>Tata Communications</option>
                  <option>Indian Hotels (IHCL)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Last Designation Held*</label>
                <input type="text" required placeholder="e.g. Senior Manager" className="form-input" />
              </div>
              <div>
                <label className="form-label">Year of Retirement*</label>
                <input type="number" required placeholder="e.g. 2022" min="1950" max="2026" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Personal Email*</label>
                <input
                  type="email"
                  required
                  placeholder="Enter personal email"
                  className="form-input"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">SPOC / HR Email from Last Company*</label>
                <input type="email" required placeholder="Enter SPOC or HR contact email" className="form-input" />
                <p className="text-xs text-zinc-400 mt-1">This person will verify your employment history with the Tata Group.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Date of Birth*</label>
                <input type="date" required className="form-input" />
              </div>
              <div>
                <label className="form-label">City/Country*</label>
                <input type="text" required placeholder="Enter city, country" className="form-input" />
              </div>
            </div>
            <div>
              <label className="form-label">Areas of Interest*</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Education", "Environment", "Health", "Livelihood", "Mentoring", "Skill Development"].map(tag => (
                  <button key={tag} type="button" className="px-4 py-1.5 rounded-full border border-zinc-200 text-xs font-medium hover:bg-zinc-100 transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Password*</label>
                <input type="password" required placeholder="••••••••" className="form-input" />
              </div>
              <div>
                <label className="form-label">Confirm Password*</label>
                <input type="password" required placeholder="••••••••" className="form-input" />
              </div>
            </div>
          </>
        );
      case "ngo":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">NGO Name*</label>
                <input type="text" placeholder="Enter NGO name" className="form-input" />
              </div>
              <div>
                <label className="form-label">Registration Number*</label>
                <input type="text" placeholder="Enter registration number" className="form-input" />
              </div>
            </div>
            <div>
              <label className="form-label">Email Address*</label>
              <input type="email" placeholder="Enter email" className="form-input" />
            </div>
            <div>
              <label className="form-label">Website</label>
              <input type="url" placeholder="https://www.ngo.org" className="form-input" />
            </div>
            <div>
              <label className="form-label">Address*</label>
              <textarea placeholder="Enter full address" className="form-input min-h-[100px]" />
            </div>
            <div>
              <label className="form-label">Focus Areas*</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Education", "Healthcare", "Rural Development", "Skill Development", "Sustainability"].map(tag => (
                  <button key={tag} type="button" className="px-4 py-1.5 rounded-full border border-zinc-200 text-xs font-medium hover:bg-zinc-100 transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      case "family_member":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Personal Email*</label>
                <input type="email" required placeholder="Enter personal email" className="form-input" />
              </div>
              <div>
                <label className="form-label">Linked Tata Employee Email*</label>
                <input type="email" required placeholder="Enter employee email" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Relation to Tata Employee*</label>
                <select required className="form-input">
                  <option value="">Select Relation</option>
                  <option>Spouse</option>
                  <option>Child</option>
                  <option>Parent</option>
                  <option>Sibling</option>
                </select>
              </div>
              <div>
                <label className="form-label">Full Name*</label>
                <input type="text" required placeholder="Enter full name" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Tata Company (of Employee)*</label>
                <input type="text" required placeholder="Enter company" className="form-input" />
              </div>
              <div>
                <label className="form-label">Designation (of Employee)*</label>
                <input type="text" required placeholder="Enter designation" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Date of Birth*</label>
                <input type="date" required className="form-input" />
              </div>
              <div>
                <label className="form-label">City/Country*</label>
                <input type="text" required placeholder="Enter city, country" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Password*</label>
                <input type="password" required placeholder="••••••••" className="form-input" />
              </div>
              <div>
                <label className="form-label">Confirm Password*</label>
                <input type="password" required placeholder="••••••••" className="form-input" />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ── FORM BODY ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, backgroundColor: "#f5f5fa", position: "relative", display: "flex", justifyContent: "center", padding: "80px 22px 48px", overflow: "hidden" }}>

        {/* Doodles — left */}
        <img src={doodleCluster1} alt="" style={{ position: "absolute", left: -48, top: "40%", transform: "translateY(-50%)", width: 240, opacity: 0.09, pointerEvents: "none", userSelect: "none", rotate: "-8deg" }} />
        <img src={doodleCluster5} alt="" style={{ position: "absolute", left: 52, bottom: 32, width: 160, opacity: 0.07, pointerEvents: "none", userSelect: "none", rotate: "5deg" }} />

        {/* Doodles — right */}
        <img src={doodleCluster2} alt="" style={{ position: "absolute", right: -36, top: "35%", transform: "translateY(-50%)", width: 220, opacity: 0.09, pointerEvents: "none", userSelect: "none", rotate: "12deg" }} />
        <img src={doodleCluster3} alt="" style={{ position: "absolute", right: 64, bottom: 28, width: 150, opacity: 0.07, pointerEvents: "none", userSelect: "none", rotate: "-6deg" }} />

        <div style={{ width: "90%", maxWidth: 1400, position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Section heading */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: ACCENT_NAVY, marginBottom: 8, letterSpacing: "-0.3px" }}>
                Register as {roleLabel}
              </h3>
              {/* Definer bar — B_TICKER */}
              <div style={{ height: 3, width: 40, borderRadius: 4, backgroundColor: B_TICKER }} />
            </div>

            {/* White form card */}
            <div style={{ backgroundColor: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, padding: "40px 36px" }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderFields()}

                <div className="pt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("register-role")}
                    className="flex-1 btn-outline cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-black cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <ConsentModal
        isOpen={isConsentOpen}
        onAccept={handleConsentAcceptLocal}
        onCancel={() => setIsConsentOpen(false)}
      />
    </div>
  );
};

export default RegisterFormView;
