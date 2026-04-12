import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, StopCircle, AlertTriangle, Activity, ChevronLeft, Clock, Pause, ArrowRight } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import PageShell from "@/components/shared/PageShell";
import { B_TEAL, B_RED, ACCENT_NAVY, P_TEAL } from "@/data/homeSharedData";

const B_ORANGE = "#C14D00";

const SECTIONS = [
  { id: "apm-health", label: "Health" },
  { id: "apm-volunteers", label: "Volunteers" },
  { id: "apm-audit", label: "Audit Trail" },
];

const MOCK_VOLUNTEERS = [
  { name: "Priya Sharma", email: "priya.s@tcs.com", status: "Active" },
  { name: "Rajesh Kumar", email: "rajesh.k@titan.com", status: "Active" },
  { name: "Anita Desai", email: "anita.d@tatasteel.com", status: "Completed" },
  { name: "Vikram Patel", email: "vikram.p@tatapower.com", status: "Active" },
];

const ActiveProjectManagementView = ({ project }: { project: any }) => {
  const _auth = useAuth();
  const navigate = useAppNavigate();
  const { triggerToast } = useAppContext();

  const MOCK_HEALTH_UPDATES = [
    { month: "January", status: "Updated", date: "2026-01-15" },
    { month: "February", status: "Updated", date: "2026-02-14" },
    { month: "March", status: "At Risk", date: "2026-03-20" },
    { month: "April", status: "Pending", date: null },
  ];

  const [healthUpdates] = useState(MOCK_HEALTH_UPDATES);
  const [projectStatus, setProjectStatus] = useState(project?.status || "Active");
  const [showConfirmModal, setShowConfirmModal] = useState<"close" | null>(null);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);

  const handleStatusChange = (newStatus: string, action: string) => {
    setProjectStatus(newStatus);
    setAuditTrail(prev => [{
      id: Date.now(),
      action,
      user: "Anjali Mehta (NGO)",
      date: new Date().toLocaleString()
    }, ...prev]);
    triggerToast(`Project ${action} successfully. TSG Admin notified.`);
    setShowConfirmModal(null);
  };

  const hasRisk = healthUpdates.some(h => h.status === "At Risk" || (h.month === "April" && h.status === "Pending"));

  const statusBadgeStyle = (): React.CSSProperties => {
    if (projectStatus === "Active") return { backgroundColor: P_TEAL, color: B_TEAL };
    if (projectStatus === "Paused") return { backgroundColor: "#fef3c7", color: "#d97706" };
    return { backgroundColor: "#fee2e2", color: B_RED };
  };

  const healthColor = (status: string) => {
    if (status === "Updated") return B_TEAL;
    if (status === "At Risk") return B_RED;
    return "#e2e8f0";
  };

  return (
    <PageShell
      accentColor={B_ORANGE}
      sections={SECTIONS}
      pageEyebrow="NGO Dashboard · Active Project"
      pageTitle={project?.title || "Active Project"}
      pageDesc="Monitor health, manage volunteers, and close the project when complete."
    >
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <button onClick={() => navigate("ngo-dashboard")} className="flex items-center gap-2 text-slate-500 hover:opacity-80 font-medium mb-4 transition-colors cursor-pointer" style={{ color: B_ORANGE }}>
              <ChevronLeft size={18} /> Back to Dashboard
            </button>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold" style={{ color: ACCENT_NAVY }}>{project?.title || "Active Project"}</h1>
              <span className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={statusBadgeStyle()}>
                {projectStatus}
              </span>
            </div>
            <p className="text-slate-500">Project ID: #{project?.id || "101"} • Stage: Execution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* ── M&E TRACKER ── */}
            <div id="apm-health" className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Monitoring & Evaluation</p>
                <h3 className="text-xl font-black tracking-tight" style={{ color: ACCENT_NAVY }}>M&E Tracker</h3>
              </div>

              {/* Health bar */}
              <div className="flex items-center gap-1 mb-8">
                {healthUpdates.map((u, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: healthColor(u.status) }} />
                    {i < healthUpdates.length - 1 && <div className="w-3 h-0.5 bg-slate-200" />}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthUpdates.map((update, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl flex justify-between items-center"
                    style={
                      update.status === "Pending"
                        ? { backgroundColor: "#f8fafc", border: "1px dashed #e2e8f0" }
                        : { backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: update.status === "Updated" ? `${B_TEAL}1a` : update.status === "At Risk" ? `${B_RED}1a` : "#f1f5f9",
                          color: update.status === "Updated" ? B_TEAL : update.status === "At Risk" ? B_RED : "#94a3b8",
                        }}
                      >
                        <Activity size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{update.month}</h4>
                        <p className="text-xs text-slate-400">{update.date ? `Updated on ${update.date}` : "Awaiting Update"}</p>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: update.status === "Updated" ? B_TEAL : update.status === "At Risk" ? B_RED : "#f1f5f9",
                        color: update.status === "Pending" ? "#64748b" : "#fff",
                      }}
                    >
                      {update.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── VOLUNTEERS ── */}
            <div id="apm-volunteers" className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Team</p>
                <h3 className="text-xl font-black tracking-tight" style={{ color: ACCENT_NAVY }}>Assigned Volunteers</h3>
              </div>
              <div className="space-y-2">
                {MOCK_VOLUNTEERS.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl transition-colors cursor-default"
                    style={{ transition: "background-color 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${B_ORANGE}0d`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: ACCENT_NAVY }}>
                        {v.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{v.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12} /> {v.email}</p>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                      style={v.status === "Active" ? { backgroundColor: `${B_TEAL}1a`, color: B_TEAL } : { backgroundColor: "#f1f5f9", color: "#64748b" }}
                    >
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── AUDIT TRAIL ── */}
            <div id="apm-audit" className="rounded-2xl p-8" style={{ backgroundColor: ACCENT_NAVY }}>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock size={20} style={{ color: B_ORANGE }} /> Project Audit Trail
              </h3>
              <div className="space-y-4">
                {auditTrail.length === 0 ? (
                  <p className="text-sm italic" style={{ color: "rgba(255,255,255,0.4)" }}>No actions logged yet.</p>
                ) : (
                  auditTrail.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: B_ORANGE }} />
                        <div>
                          <p className="font-bold text-white text-sm">{log.action}</p>
                          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>By {log.user}</p>
                        </div>
                      </div>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{log.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ── CONTEXTUAL ACTION ROW ── */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => handleStatusChange("Paused", "Paused")}
                className="flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest border-2 flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-80"
                style={{ borderColor: "#d97706", color: "#d97706" }}
              >
                <Pause size={16} /> Pause
              </button>
              <button
                onClick={() => setShowConfirmModal("close")}
                className="flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90"
                style={{ backgroundColor: B_RED }}
              >
                <StopCircle size={16} /> Close
              </button>
              <button
                onClick={() => { handleStatusChange("Active", "Extension Requested"); }}
                className="flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90"
                style={{ backgroundColor: B_TEAL }}
              >
                <ArrowRight size={16} /> Extend
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* AI Risk Flag */}
            {hasRisk && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-8 text-white shadow-sm relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${B_RED}, #991b1b)` }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <AlertTriangle size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={20} className="text-red-200" />
                    <span className="text-xs font-bold uppercase tracking-widest text-red-100">AI Risk Flag (AI-05)</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 leading-tight">Project health flagged – review recommended</h3>
                  <p className="text-red-100 text-sm mb-6 opacity-90">
                    Our AI has detected a potential risk due to {healthUpdates.some(h => h.status === "At Risk") ? "a monthly health update marked 'At Risk'" : "an overdue health update for April"}.
                  </p>
                  <button className="w-full py-3 bg-white rounded-lg font-bold text-sm hover:bg-red-50 transition-all cursor-pointer" style={{ color: B_RED }}>
                    Review Details
                  </button>
                </div>
              </motion.div>
            )}

            {/* Project Progress */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h3 className="font-bold mb-6" style={{ color: ACCENT_NAVY }}>Project Progress</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-400 uppercase tracking-widest">Completion</span>
                    <span style={{ color: B_ORANGE }}>75%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: B_ORANGE }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Volunteers</p>
                    <p className="text-xl font-semibold text-slate-800">4/5</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                    <p className="text-xl font-semibold text-slate-800">2m left</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              onClick={() => setShowConfirmModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-sm p-10 text-center"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: `${B_RED}1a`, color: B_RED }}>
                <StopCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: ACCENT_NAVY }}>Close Project?</h2>
              <p className="text-slate-500 mb-10">Are you sure you want to close this project? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowConfirmModal(null)} className="flex-1 btn-outline py-4 cursor-pointer">Cancel</button>
                <button
                  onClick={() => handleStatusChange("Closed", "Closed")}
                  className="flex-1 py-4 rounded-lg font-bold text-white transition-all cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: B_RED }}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageShell>
  );
};

export default ActiveProjectManagementView;
