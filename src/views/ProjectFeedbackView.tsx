import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Eye, Award, Sparkles, Star, ChevronLeft, ChevronDown, Download, Upload, FileCheck } from "lucide-react";
import { MOCK_APPLICANTS, ANJALI_MEHTA } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import PageShell from "@/components/shared/PageShell";
import { B_YELLOW, B_TEAL, B_RED, B_INDIGO, ACCENT_NAVY } from "@/data/homeSharedData";

const B_ORANGE = "#C14D00";

const ProjectFeedbackView = ({ project }: { project: any }) => {
  const { setNgoData, triggerToast } = useAppContext();
  const navigate = useAppNavigate();
  const [feedbackData, setFeedbackData] = useState<any>(
    MOCK_APPLICANTS.filter(a => a.projectId === project?.id).map(a => ({
      volunteerId: a.id,
      name: a.name,
      assessment: "",
      ratings: { communication: 0, reliability: 0, contribution: 0 },
      submitted: false
    }))
  );
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showCertificatePreview, setShowCertificatePreview] = useState<any>(null);
  const [openVolunteerId, setOpenVolunteerId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitted, setSubmitted] = useState<Set<number>>(new Set());

  const handleRating = (vId: number, category: string, value: number) => {
    setFeedbackData(prev => prev.map(f =>
      f.volunteerId === vId ? { ...f, ratings: { ...f.ratings, [category]: value } } : f
    ));
  };

  const handleAssessment = (vId: number, text: string) => {
    setFeedbackData(prev => prev.map(f =>
      f.volunteerId === vId ? { ...f, assessment: text } : f
    ));
  };

  const submitFeedback = async (vId: number) => {
    setFeedbackData(prev => prev.map(f =>
      f.volunteerId === vId ? { ...f, submitted: true } : f
    ));
    triggerToast("Feedback submitted for volunteer.");

    const updatedFeedback = feedbackData.map((f: any) => f.volunteerId === vId ? { ...f, submitted: true } : f);
    const allSubmitted = updatedFeedback.every((f: any) => f.submitted);

    if (allSubmitted) {
      generateAiSummary();
      setNgoData(prev => ({
        ...prev,
        projects: prev.projects.map(p =>
          p.id === project.id ? { ...p, status: "Closed – Certified" } : p
        )
      }));
    }
  };

  const generateAiSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const allText = feedbackData.map((f: any) => f.assessment).join(". ");

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following volunteer feedback and provide a summary in JSON format with: "themes" (array of strings), "sentimentScore" (number 1-100), and "qualitySignal" (string: "High", "Medium", or "Low"). Feedback: ${allText}`,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || "{}");
      setAiSummary(result);
      triggerToast("AI Feedback Summary Generated!");
    } catch (error) {
      console.error("AI Summary failed:", error);
      setAiSummary({
        themes: ["Strong commitment", "Technical proficiency", "Good teamwork"],
        sentimentScore: 85,
        qualitySignal: "High"
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const allSubmitted = feedbackData.length > 0 && feedbackData.every((f: any) => f.submitted);

  const qualityColor = (signal: string) => {
    if (signal === "High") return B_TEAL;
    if (signal === "Medium") return B_YELLOW;
    return B_RED;
  };

  return (
    <PageShell
      accentColor={B_ORANGE}
      sections={[]}
      pageEyebrow="NGO Dashboard · Feedback"
      pageTitle="Submit Volunteer Feedback"
      pageDesc="Rate and assess each volunteer's contribution to close the project."
    >
      <div className="px-6 md:px-16 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <button onClick={() => navigate("ngo-dashboard")} className="flex items-center gap-2 font-medium mb-4 transition-colors cursor-pointer" style={{ color: B_ORANGE }}>
              <ChevronLeft size={18} /> Back to Dashboard
            </button>
            <p className="text-slate-500 mt-1">{project?.title} • Edition 2025</p>
          </div>
          <button
            onClick={() => setIsBulkMode(!isBulkMode)}
            className="btn-outline py-3 px-6 flex items-center gap-2 cursor-pointer"
          >
            {isBulkMode ? "Individual View" : "Bulk Upload"}
          </button>
        </div>

        {isBulkMode ? (
          <div className="bg-white border rounded-2xl shadow-sm p-12 text-center" style={{ borderColor: "#e8e8f0" }}>
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ border: `2px dashed ${B_ORANGE}4d`, color: ACCENT_NAVY }}>
              <Upload size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: ACCENT_NAVY }}>Bulk Feedback Upload</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Download our Excel template, fill in the volunteer assessments and ratings, and upload it back to close the project in one go.
            </p>
            <div className="border-2 border-dashed rounded-xl p-10 mb-8 cursor-pointer transition-colors hover:bg-slate-50" style={{ borderColor: `${B_ORANGE}4d` }}>
              <p className="text-sm font-bold" style={{ color: ACCENT_NAVY }}>Drop Excel file here</p>
              <p className="text-xs text-slate-400 mt-1">or click to browse</p>
              <input type="file" className="hidden" onChange={() => triggerToast("File uploaded and processed!")} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-outline py-3 px-8 flex items-center gap-2 cursor-pointer">
                <Download size={18} /> Download Template
              </button>
              <label className="py-3 px-8 rounded-lg font-bold text-white flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all" style={{ backgroundColor: B_ORANGE }}>
                <Upload size={18} /> Upload Completed File
                <input type="file" className="hidden" onChange={() => triggerToast("File uploaded and processed!")} />
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search volunteers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 mb-4"
              style={{ "--tw-ring-color": `${B_ORANGE}33` } as any}
            />
            {feedbackData
              .filter((v: any) => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((volunteer: any) => {
                const isOpen = openVolunteerId === volunteer.volunteerId;
                const isSubmitted = submitted.has(volunteer.volunteerId);
                return (
                  <div key={volunteer.volunteerId} className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                    {/* Collapsed row */}
                    <button
                      onClick={() => setOpenVolunteerId(isOpen ? null : volunteer.volunteerId)}
                      className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center text-sm font-bold" style={{ backgroundColor: ACCENT_NAVY }}>
                          {volunteer.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-slate-800">{volunteer.name}</h4>
                          <p className="text-xs text-slate-400">ID: #{volunteer.volunteerId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                          style={isSubmitted ? { backgroundColor: B_TEAL, color: "#fff" } : { backgroundColor: "#fffbeb", color: "#b45309" }}
                        >
                          {isSubmitted ? "Submitted" : "Pending"}
                        </span>
                        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {/* Expandable form */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-slate-100">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-4">
                              <div className="space-y-6">
                                <div>
                                  <label className="text-[10px] font-bold uppercase tracking-widest mb-3 block" style={{ color: B_ORANGE }}>Qualitative Assessment</label>
                                  <textarea
                                    disabled={volunteer.submitted}
                                    value={volunteer.assessment}
                                    onChange={(e) => handleAssessment(volunteer.volunteerId, e.target.value)}
                                    placeholder="Describe the volunteer's performance, key achievements, and areas for growth..."
                                    className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 disabled:opacity-50"
                                    style={{ "--tw-ring-color": `${B_ORANGE}33` } as any}
                                  />
                                </div>
                              </div>

                              <div className="space-y-6">
                                <label className="text-[10px] font-bold uppercase tracking-widest mb-3 block" style={{ color: B_ORANGE }}>Ratings (Optional)</label>
                                {['communication', 'reliability', 'contribution'].map((cat) => (
                                  <div key={cat} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-sm font-bold text-slate-700 capitalize">{cat}</span>
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          disabled={volunteer.submitted}
                                          onClick={() => handleRating(volunteer.volunteerId, cat, star)}
                                          className="p-1 transition-colors"
                                          style={{ color: volunteer.ratings[cat] >= star ? B_YELLOW : "#cbd5e1" }}
                                        >
                                          <Star size={20} fill={volunteer.ratings[cat] >= star ? "currentColor" : "none"} />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {!volunteer.submitted && (
                              <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
                                <button
                                  onClick={() => {
                                    submitFeedback(volunteer.volunteerId);
                                    setSubmitted(prev => new Set(prev).add(volunteer.volunteerId));
                                    setOpenVolunteerId(null);
                                  }}
                                  className="text-white py-3 px-10 rounded-xl font-bold hover:opacity-90 transition-all shadow-sm cursor-pointer"
                                  style={{ backgroundColor: B_ORANGE }}
                                >
                                  Submit Feedback
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>
        )}

        {/* AI Summary */}
        <AnimatePresence>
          {allSubmitted && aiSummary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-8"
            >
              <div className="rounded-2xl p-10 text-white relative overflow-hidden" style={{ backgroundColor: ACCENT_NAVY }}>
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Sparkles size={150} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Sparkles size={24} style={{ color: B_TEAL }} />
                    <h3 className="text-2xl font-bold">NLP Feedback Summary (AI-04)</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Top Themes</p>
                      <div className="flex flex-wrap gap-2">
                        {aiSummary.themes.map((theme: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: `${B_INDIGO}1a`, color: "#a5b4fc" }}>{theme}</span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Sentiment Score</p>
                      <div className="flex items-center gap-4">
                        {/* Circular progress ring */}
                        <svg width="64" height="64" viewBox="0 0 64 64">
                          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                          <circle
                            cx="32" cy="32" r="28" fill="none"
                            stroke={B_TEAL} strokeWidth="4" strokeLinecap="round"
                            strokeDasharray={`${(aiSummary.sentimentScore / 100) * 175.93} 175.93`}
                            transform="rotate(-90 32 32)"
                          />
                          <text x="32" y="36" textAnchor="middle" fill="white" fontSize="16" fontWeight="900">{aiSummary.sentimentScore}</text>
                        </svg>
                        <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>/100</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>NGO Quality Signal</p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm text-white" style={{ backgroundColor: `${qualityColor(aiSummary.qualitySignal)}33`, border: `1px solid ${qualityColor(aiSummary.qualitySignal)}55` }}>
                        <Award size={18} /> {aiSummary.qualitySignal} Signal
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Trigger */}
              <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${B_TEAL}1a`, color: B_TEAL }}>
                    <FileCheck size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: ACCENT_NAVY }}>Certificate Conditions Met ✅</h3>
                    <p className="text-slate-500">Both NGO and Volunteer feedback have been submitted. TSG Admin approval is pending for final certificate generation.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCertificatePreview(feedbackData[0])}
                  className="btn-outline py-4 px-8 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Eye size={18} /> Preview Certificate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {showCertificatePreview && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md"
              onClick={() => setShowCertificatePreview(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden aspect-[1.414/1] p-16"
              style={{ borderWidth: 12, borderColor: `${B_ORANGE}1a` }}
            >
              <div className="absolute top-0 left-0 w-full h-4" style={{ backgroundColor: B_ORANGE }} />
              <div className="absolute bottom-0 left-0 w-full h-4" style={{ backgroundColor: B_ORANGE }} />

              <div className="h-full border-2 p-12 flex flex-col items-center text-center relative" style={{ borderColor: `${B_ORANGE}33` }}>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Building2 size={120} />
                </div>

                <img src="https://www.tata.com/content/dam/tata/images/home-page/tata_logo_blue.png" alt="Tata Logo" className="h-12 mb-12" referrerPolicy="no-referrer" />

                <h2 className="text-4xl font-serif mb-4" style={{ color: ACCENT_NAVY }}>Certificate of Appreciation</h2>
                <p className="uppercase tracking-[0.3em] font-bold mb-12" style={{ color: B_ORANGE }}>Tata Volunteer Week - Edition 2025</p>

                <p className="text-xl text-slate-600 mb-2">This is to certify that</p>
                <h3 className="text-5xl font-serif font-bold text-slate-800 mb-8 underline underline-offset-8" style={{ textDecorationColor: B_TEAL, textDecorationThickness: 4 }}>
                  {showCertificatePreview.name}
                </h3>

                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  has successfully completed the volunteering project <span className="font-bold" style={{ color: ACCENT_NAVY }}>"{project?.title}"</span> with <span className="font-bold" style={{ color: ACCENT_NAVY }}>{ANJALI_MEHTA.organization}</span>. Their contribution and dedication towards social impact are highly appreciated.
                </p>

                <div className="mt-auto pt-16 flex justify-between w-full">
                  <div className="text-center">
                    <div className="w-48 h-0.5 bg-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">NGO Representative</p>
                    <p className="text-sm font-bold text-slate-800">Anjali Mehta</p>
                  </div>
                  <div className="text-center">
                    <div className="w-48 h-0.5 bg-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">TSG Admin</p>
                    <p className="text-sm font-bold text-slate-800">Tata Sustainability Group</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCertificatePreview(null)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageShell>
  );
};

export default ProjectFeedbackView;
