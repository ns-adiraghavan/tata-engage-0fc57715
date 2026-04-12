import React, { useState } from "react";
import { ArrowLeft, ArrowRight, ShieldAlert, Check } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { B_RED, ACCENT_NAVY } from "@/data/homeSharedData";

const DIAG_TEXTURE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: "repeating-linear-gradient(45deg, rgba(232,64,28,0.07) 0px, rgba(232,64,28,0.07) 1px, transparent 1px, transparent 20px)",
  backgroundSize: "20px 20px",
  pointerEvents: "none",
};

const BULLETS = [
  "Secure form · your data stays confidential",
  "Takes 4 minutes",
  "You'll be confirmed within 2 hours",
  "You can update your availability anytime",
];

const DRAvailabilityForm = () => {
  const { user } = useAuth();
  const navigate = useAppNavigate();
  const { setDrResponses, setHasSubmittedAvailability, triggerToast } = useAppContext();
  const [formData, setFormData] = useState({
    location: "Mumbai, Maharashtra",
    willingToTravel: "Assam, North East India",
    startDate: "2026-04-10",
    endDate: "2026-04-20",
    skills: ["First Aid", "Logistics"],
    travelWillingness: "national",
    medicalNotes: ""
  });

  const availableSkills = ["First Aid", "Logistics", "Search & Rescue", "Medical (Doctor/Nurse)", "Counseling", "Translation", "Driving (Heavy Vehicle)"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResponse = {
      id: `DR-${Math.floor(Math.random() * 10000)}`,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      company: user.company || "Tata Group",
      location: formData.location,
      willingTo: formData.willingToTravel,
      dates: `${formData.startDate} to ${formData.endDate}`,
      skills: formData.skills,
      travel: formData.travelWillingness,
      timestamp: new Date().toISOString()
    };

    setDrResponses(prev => [newResponse, ...prev]);
    setHasSubmittedAvailability(true);
    navigate("dr-confirmation");
    triggerToast("Confirmation email sent to your registered address.");
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 2px accent line */}
      <div style={{ background: B_RED, height: 2, width: "100%" }} />

      <div className="flex flex-1">
        {/* ── LEFT PANEL ── */}
        <div
          className="hidden md:flex w-1/2 flex-col justify-between relative overflow-hidden"
          style={{ backgroundColor: ACCENT_NAVY, padding: "64px 48px" }}
        >
          <div style={DIAG_TEXTURE} />

          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Top — alert badge */}
            <div>
              <div className="flex items-center gap-2.5 mb-10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: B_RED }} />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: B_RED }} />
                </span>
                <span style={{ color: B_RED, fontSize: 11, letterSpacing: "2px" }} className="uppercase font-bold">
                  🚨 Disaster Response Activated
                </span>
              </div>

              {/* Middle — message */}
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 26, fontWeight: 300, lineHeight: 1.6, fontStyle: "italic" }} className="mb-10 max-w-md">
                Your availability helps us respond faster.
              </p>

              {/* Bullets */}
              <div className="space-y-4">
                {BULLETS.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
                      <Check size={11} style={{ color: "rgba(255,255,255,0.5)" }} />
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom — back link */}
            <button
              onClick={() => navigate("dashboard")}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest hover:opacity-80 transition-colors cursor-pointer mt-8"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-full md:w-1/2 bg-white overflow-y-auto" style={{ padding: "64px 48px" }}>
          {/* Mobile-only back button */}
          <button
            onClick={() => navigate("dashboard")}
            className="flex md:hidden items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6 hover:opacity-80 transition-colors cursor-pointer"
            style={{ color: B_RED }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          {/* Alert strip */}
          <div className="flex items-center justify-between px-5 py-3 rounded-lg mb-6" style={{ backgroundColor: B_RED }}>
            <div className="flex items-center gap-3 text-white">
              <ShieldAlert size={20} />
              <span className="text-sm font-bold">Active Disaster Alert — Assam Flood Relief</span>
            </div>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10" style={{ borderLeft: `4px solid ${B_RED}`, border: `1px solid #f1f5f9`, borderLeftWidth: 4, borderLeftColor: B_RED }}>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: B_RED }}>Current Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": `${B_RED}33` } as any}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: B_RED }}>Willing to Travel To</label>
                  <input
                    type="text"
                    required
                    value={formData.willingToTravel}
                    onChange={e => setFormData({ ...formData, willingToTravel: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": `${B_RED}33` } as any}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: B_RED }}>Available From</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": `${B_RED}33` } as any}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: B_RED }}>Available Until</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": `${B_RED}33` } as any}
                  />
                </div>
              </div>

              {/* Skills pill toggles */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: B_RED }}>Relevant Skills & Certifications</label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => {
                    const selected = formData.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className="px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        style={selected
                          ? { backgroundColor: `${B_RED}1a`, border: `1px solid ${B_RED}`, color: B_RED }
                          : { backgroundColor: "#fff", border: "1px solid #e2e8f0", color: "#334155" }
                        }
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Travel willingness card toggles */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: B_RED }}>Travel Willingness</label>
                <div className="grid grid-cols-3 gap-3">
                  {["local", "national", "international"].map(mode => {
                    const active = formData.travelWillingness === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setFormData({ ...formData, travelWillingness: mode })}
                        className="py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                        style={active
                          ? { backgroundColor: ACCENT_NAVY, color: "#fff" }
                          : { backgroundColor: "#fff", border: "1px solid #e2e8f0", color: "#64748b" }
                        }
                      >
                        {active && <Check size={14} />}
                        {mode}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: B_RED }}>Medical Notes / Allergies (Optional)</label>
                <textarea
                  value={formData.medicalNotes}
                  onChange={e => setFormData({ ...formData, medicalNotes: e.target.value })}
                  placeholder="Any specific medical conditions or allergies we should be aware of for field deployment?"
                  className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 resize-none"
                  style={{ "--tw-ring-color": `${B_RED}33` } as any}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer"
                  style={{ backgroundColor: B_RED, boxShadow: `0 10px 25px -5px ${B_RED}33` }}
                >
                  Submit Availability <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DRAvailabilityForm;
