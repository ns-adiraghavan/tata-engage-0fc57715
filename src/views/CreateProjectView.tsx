import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, MapPin, Info, Send, Check, Sparkles, ArrowRight, Save, Copy } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import PageShell from "@/components/shared/PageShell";
import { B_TEAL, ACCENT_NAVY } from "@/data/homeSharedData";

const B_ORANGE = "#C14D00";

const SECTIONS = [
  { id: "cp-details", label: "Details" },
  { id: "cp-skills", label: "Skills" },
  { id: "cp-outcomes", label: "Outcomes" },
  { id: "cp-review", label: "Review" },
];

const CreateProjectView = () => {
  const { clonedProject, setClonedProject, triggerToast } = useAppContext();
  const navigate = useAppNavigate();
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState(clonedProject || {
    title: "",
    skillArea: "",
    mode: "Online",
    duration: "3 months",
    volunteers: 1,
    location: "",
    brief: "",
    outcomes: "",
    isSkillBased: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [qualityScore, setQualityScore] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [scoreHint, setScoreHint] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      let score = 0;
      const conditions: { met: boolean; hint: string }[] = [
        { met: (projectData.brief || "").trim().split(/\s+/).filter(Boolean).length >= 50, hint: "Write at least 50 words in the description to improve your score." },
        { met: (projectData.outcomes || "").trim().length > 0, hint: "Add text to the outcomes/impact section to improve your score." },
        { met: (projectData.outcomes || "").trim().split(/\s+/).filter(Boolean).length >= 30, hint: "Add more detail to your outcome section to improve your score." },
        { met: !!(projectData.duration || "").trim(), hint: "Select a project duration to improve your score." },
        { met: !!(projectData.mode || "").trim(), hint: "Select a project mode to improve your score." },
        { met: !!(projectData.skillArea || "").trim(), hint: "Select a skill area to improve your score." },
        { met: (projectData.title || "").trim().split(/\s+/).filter(Boolean).length >= 4, hint: "Use at least 4 words in your project title." },
        { met: projectData.volunteers > 0, hint: "Set a volunteer count to improve your score." },
      ];
      const points = [2, 2, 1, 1, 1, 1, 1, 1];
      conditions.forEach((c, i) => { if (c.met) score += points[i]; });
      setQualityScore(Math.min(score, 10));
      const firstUnmet = conditions.find(c => !c.met);
      setScoreHint(firstUnmet ? firstUnmet.hint : "");
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [projectData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved(new Date());
      triggerToast("Draft saved automatically");
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const generateTemplate = async (area: string) => {
    if (!area) return;
    setIsGenerating(true);
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a professional project brief template for a volunteering project in the area of ${area}. The template should include sections for Project Overview, Key Responsibilities, and Required Skills. Keep it concise but professional.`,
      });
      if (response.text) {
        setProjectData(prev => ({ ...prev, brief: response.text || "" }));
        triggerToast("AI Template Generated!");
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      const fallback = `Project Overview: [Describe the goal of this ${area} project]\n\nKey Responsibilities:\n- [Task 1]\n- [Task 2]\n\nRequired Skills:\n- [Skill 1]\n- [Skill 2]`;
      setProjectData(prev => ({ ...prev, brief: fallback }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSkillAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = e.target.value;
    setProjectData(prev => ({ ...prev, skillArea: area }));
    if (area && projectData.isSkillBased) generateTemplate(area);
  };

  const handleSaveDraft = () => {
    setClonedProject(null);
    triggerToast("Project saved as draft");
    navigate("ngo-dashboard");
  };

  const handleSubmit = () => {
    setClonedProject(null);
    triggerToast("Project submitted for review");
    navigate("ngo-dashboard");
  };

  const steps = [
    { id: 1, title: "Basics" },
    { id: 2, title: "Brief" },
    { id: 3, title: "Outcomes" },
  ];

  return (
    <PageShell
      accentColor={B_ORANGE}
      sections={SECTIONS}
      pageEyebrow="NGO Dashboard · ProEngage"
      pageTitle="Create a Project"
      pageDesc="Build a well-structured brief to attract the right Tata volunteers."
    >
      <div className="px-6 md:px-16 max-w-6xl mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => { setClonedProject(null); navigate("ngo-dashboard"); }}
            className="flex items-center gap-2 text-slate-500 hover:opacity-80 font-medium transition-colors cursor-pointer"
            style={{ color: B_ORANGE }}
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="text-xs text-slate-400 italic">
                Last auto-saved: {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={handleSaveDraft}
              className="py-2 px-6 text-sm flex items-center gap-2 cursor-pointer rounded-lg font-bold transition-all"
              style={{ backgroundColor: `${B_ORANGE}1a`, color: B_ORANGE }}
            >
              <Save size={16} /> Save as Draft
            </button>
          </div>
        </div>

        {clonedProject && (
          <div className="mb-6 flex items-center gap-2 px-6 py-2 rounded-full w-fit text-white" style={{ backgroundColor: ACCENT_NAVY }}>
            <Copy size={14} />
            <span className="text-xs font-bold">Copied from: {clonedProject.sourceTitle}</span>
          </div>
        )}

        <div id="cp-details" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            {/* ── Progress rail ── */}
            <div className="px-10 pt-10 pb-6">
              <div className="flex items-center justify-between relative">
                {/* Connecting line */}
                <div className="absolute top-[14px] left-[28px] right-[28px] h-0.5 bg-slate-200" />
                <div className="absolute top-[14px] left-[28px] h-0.5 bg-gradient-to-r transition-all duration-500" style={{
                  width: `${((step - 1) / (steps.length - 1)) * 100}%`,
                  backgroundImage: `linear-gradient(to right, ${B_ORANGE}, ${B_TEAL})`,
                }} />
                {steps.map((s) => (
                  <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                      style={
                        step > s.id
                          ? { backgroundColor: B_TEAL, color: "#fff" }
                          : step === s.id
                            ? { backgroundColor: B_ORANGE, color: "#fff" }
                            : { backgroundColor: "#f1f5f9", color: "#94a3b8", border: "2px solid #e2e8f0" }
                      }
                    >
                      {step > s.id ? <Check size={14} /> : s.id}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: step >= s.id ? ACCENT_NAVY : "#94a3b8" }}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 md:p-16 pt-4 md:pt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-bold mb-2" style={{ color: ACCENT_NAVY }}>Project Basics</h2>
                        <p className="text-slate-500">Let's start with the essential details of your project.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                          <label className="form-label">Project Title*</label>
                          <input
                            type="text"
                            placeholder="e.g., Financial Literacy Module for Rural Women"
                            className="form-input focus:ring-[#C14D00]/20 focus:border-[#C14D00]"
                            value={projectData.title}
                            onChange={e => setProjectData({ ...projectData, title: e.target.value })}
                          />
                        </div>

                        {projectData.isSkillBased && (
                          <div id="cp-skills">
                            <label className="form-label">Skill Area*</label>
                            <select
                              className="form-input focus:ring-[#C14D00]/20 focus:border-[#C14D00]"
                              value={projectData.skillArea}
                              onChange={handleSkillAreaChange}
                            >
                              <option value="">Select Area</option>
                              <option value="Finance">Finance</option>
                              <option value="Tech">Tech</option>
                              <option value="Education">Education</option>
                              <option value="Health">Health</option>
                              <option value="Environment">Environment</option>
                              <option value="Marketing">Marketing</option>
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="form-label">Mode*</label>
                          <div className="flex gap-2">
                            {["Online", "Offline", "Hybrid"].map(m => (
                              <button
                                key={m}
                                onClick={() => setProjectData({ ...projectData, mode: m })}
                                className="flex-1 py-3 rounded-lg text-sm font-bold border-2 transition-all"
                                style={projectData.mode === m ? { borderColor: B_ORANGE, backgroundColor: `${B_ORANGE}0d`, color: B_ORANGE } : { borderColor: "#f1f5f9", color: "#94a3b8" }}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div>
                            <p className="text-sm font-bold text-slate-800">Skill-based project</p>
                            <p className="text-xs text-slate-500 mt-0.5">Requires a specific skill area match. Disable for general volunteering tasks.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setProjectData({ ...projectData, isSkillBased: !projectData.isSkillBased })}
                            className="w-12 h-6 rounded-full transition-all relative"
                            style={{ backgroundColor: projectData.isSkillBased ? B_ORANGE : "#e2e8f0" }}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${projectData.isSkillBased ? "left-7" : "left-1"}`} />
                          </button>
                        </div>

                        <div>
                          <label className="form-label">Duration*</label>
                          <select
                            className="form-input focus:ring-[#C14D00]/20 focus:border-[#C14D00]"
                            value={projectData.duration}
                            onChange={e => setProjectData({ ...projectData, duration: e.target.value })}
                          >
                            {[1, 2, 3, 4, 5, 6].map(m => (
                              <option key={m} value={`${m} months`}>{m} {m === 1 ? 'month' : 'months'}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="form-label">Volunteer Count*</label>
                          <input
                            type="number"
                            min="1"
                            className="form-input focus:ring-[#C14D00]/20 focus:border-[#C14D00]"
                            value={projectData.volunteers}
                            onChange={e => setProjectData({ ...projectData, volunteers: parseInt(e.target.value) })}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="form-label">City/Location*</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                              type="text"
                              placeholder="Enter city or 'Virtual'"
                              className="form-input pl-12 focus:ring-[#C14D00]/20 focus:border-[#C14D00]"
                              value={projectData.location}
                              onChange={e => setProjectData({ ...projectData, location: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8" id="cp-skills">
                      <div>
                        <h2 className="text-3xl font-bold mb-2" style={{ color: ACCENT_NAVY }}>Project Brief</h2>
                        <p className="text-slate-500">Describe the project goals and volunteer responsibilities.</p>
                      </div>

                      <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                          <label className="form-label mb-0">Detailed Description*</label>
                          <button
                            onClick={() => generateTemplate(projectData.skillArea)}
                            disabled={isGenerating || !projectData.skillArea}
                            className="flex items-center gap-2 text-xs font-bold hover:underline disabled:opacity-50 px-4 py-2 rounded-lg text-white transition-all"
                            style={{ backgroundColor: B_ORANGE }}
                          >
                            <Sparkles size={14} /> {isGenerating ? "Generating..." : "Generate Template"}
                          </button>
                        </div>
                        <textarea
                          className="form-input min-h-[300px] font-mono text-sm leading-relaxed focus:ring-[#C14D00]/20 focus:border-[#C14D00]"
                          placeholder="Describe your project in detail..."
                          value={projectData.brief}
                          onChange={e => setProjectData({ ...projectData, brief: e.target.value })}
                        />
                        {isGenerating && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${B_ORANGE} transparent ${B_ORANGE} ${B_ORANGE}` }} />
                              <span className="text-sm font-bold" style={{ color: B_ORANGE }}>AI is crafting your brief...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-8" id="cp-outcomes">
                      <div>
                        <h2 className="text-3xl font-bold mb-2" style={{ color: ACCENT_NAVY }}>Outcomes & Impact</h2>
                        <p className="text-slate-500">What are the expected results of this project?</p>
                      </div>

                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2 group">
                          <label className="form-label mb-0">Expected Outcomes*</label>
                          <div className="relative">
                            <Info size={14} className="text-slate-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                              Be specific about the impact. e.g., "100 women trained in basic bookkeeping."
                            </div>
                          </div>
                        </div>
                        {clonedProject && (
                          <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-800 text-xs font-bold animate-pulse">
                            <Sparkles size={16} className="shrink-0" />
                            Please update this section for the new edition
                          </div>
                        )}
                        <textarea
                          className="form-input min-h-[200px] focus:ring-[#C14D00]/20 focus:border-[#C14D00]"
                          placeholder="List the key deliverables and impact metrics..."
                          value={projectData.outcomes}
                          onChange={e => setProjectData({ ...projectData, outcomes: e.target.value })}
                        />
                      </div>

                      <div id="cp-review" className="p-8 rounded-2xl" style={{ backgroundColor: `${B_ORANGE}08`, border: `1px solid ${B_ORANGE}1a` }}>
                        <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: B_ORANGE }}>
                          <CheckCircle2 size={18} /> Final Review
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: B_TEAL }} />
                            Project will be submitted to TSG Admin for approval.
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: B_TEAL }} />
                            Expected review time: 2-3 business days.
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: B_TEAL }} />
                            You can edit the project while it's in 'Draft' or 'Under Review' status.
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Footer Actions */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => step > 1 ? setStep(step - 1) : navigate("ngo-dashboard")}
                  className="btn-outline py-3 px-8 cursor-pointer"
                >
                  {step === 1 ? "Cancel" : "Previous Step"}
                </button>

                <div className="flex gap-4">
                  {step < 3 ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      disabled={step === 1 && !projectData.title}
                      className="py-3 px-10 rounded-lg font-bold text-white flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:opacity-90 transition-all"
                      style={{ backgroundColor: ACCENT_NAVY }}
                    >
                      Next Step <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!projectData.outcomes}
                      className="py-3 px-10 rounded-lg font-bold text-white flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:opacity-90 transition-all"
                      style={{ backgroundColor: B_ORANGE }}
                    >
                      <Send size={18} /> Submit for Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* AI Quality Score */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Quality Score</p>
                  <span className="text-lg font-black" style={{ color: qualityScore > 7 ? B_TEAL : qualityScore > 4 ? B_ORANGE : "#ef4444" }}>
                    {qualityScore}/10
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${qualityScore * 10}%`,
                      backgroundImage: `linear-gradient(to right, ${B_ORANGE}, ${B_TEAL})`,
                    }}
                  />
                </div>
                {scoreHint && (
                  <p className="text-[11px] italic text-slate-500 mt-3 leading-snug">{scoreHint}</p>
                )}
                <p className="text-xs text-slate-400 italic mt-3">Score visible to NGO only — not shown to Admin</p>
              </div>

              {/* Project Checklist */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Project Checklist</p>
                <div className="space-y-2">
                  {[
                    { label: "Title", done: (projectData.title || "").trim().length > 0 },
                    { label: "Skill Area", done: !projectData.isSkillBased || !!(projectData.skillArea || "").trim() },
                    { label: "Mode", done: !!(projectData.mode || "").trim() },
                    { label: "Duration", done: !!(projectData.duration || "").trim() },
                    { label: "Brief (50+ words)", done: (projectData.brief || "").trim().split(/\s+/).filter(Boolean).length >= 50 },
                    { label: "Outcomes (30+ words)", done: (projectData.outcomes || "").trim().split(/\s+/).filter(Boolean).length >= 30 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                        style={item.done ? { backgroundColor: `${B_TEAL}1a`, color: B_TEAL } : { backgroundColor: "#f1f5f9", color: "#94a3b8" }}
                      >
                        {item.done ? <Check size={12} /> : "–"}
                      </div>
                      <span className={`text-sm ${item.done ? "text-slate-700 font-medium" : "text-slate-400"}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => triggerToast("Referral link copied!")}
                className="w-full py-3 px-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm font-bold text-slate-600 hover:border-slate-200 hover:text-slate-800 transition-all cursor-pointer"
              >
                Refer another NGO
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default CreateProjectView;
