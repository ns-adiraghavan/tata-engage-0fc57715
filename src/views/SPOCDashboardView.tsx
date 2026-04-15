import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import {
  ROHAN_DESAI, ROHAN_DESAI_VOLUNTEER, ANJALI_GUPTA_REGIONAL,
  SPOC_DIRECTORY, PENDING_APPROVALS_DATA, TCS_TVW_EVENTS,
  PROENGAGE_PIPELINE, AT_RISK_VOLUNTEERS, COMPANY_LEADERBOARD,
  VOLUNTEER_CERTIFICATES, FEEDBACK_MONITOR_DATA,
  IS_PE_SEASON,
} from "@/data/mockData";

// ─── Season flags ─────────────────────────────────────────────────────────────
const IS_TVW_SEASON = true; // flip false to preview off-season

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const B_INDIGO    = "#333399";
const B_YELLOW    = "#F5A623";
const B_TEAL      = "#00A896";
const B_RED       = "#E8401C";
const B_BLUE      = "#1E6BB8";
const ACCENT_NAVY = "#0D1B3E";
const P_INDIGO    = "#EEF0FF";
const P_YELLOW    = "#FEF6E4";
const P_RED       = "#FFF0EE";
const P_TEAL      = "#E6F8F5";
const P_BLUE      = "#EBF4FF";
const P_SPOC      = "#EEEDFE";

const NOTIFICATIONS: Record<string, boolean> = {
  volunteerPipeline: true,
  feedbackMonitor: true,
  tvwActions: false,
};

const notifDot: React.CSSProperties = { position: "absolute", top: -3, right: -6, width: 6, height: 6, borderRadius: "50%", background: "#E8401C", border: "2px solid white" };

// ─── Shared styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties      = { background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "20px 22px" };
const spocCard: React.CSSProperties  = { background: "#fff", border: "1.5px solid #c8c6f0", borderRadius: 14, padding: "20px 22px" };
const modalBack: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(13,27,62,0.45)", backdropFilter: "blur(2px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" };
const modalBox: React.CSSProperties  = { background: "#fff", borderRadius: 16, width: 520, maxWidth: "calc(100vw - 32px)", maxHeight: "85vh", overflowY: "auto", padding: "28px 32px", boxShadow: "0 20px 60px rgba(13,27,62,0.25)", position: "relative" };

// ─── Count-up ────────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start || target === 0) { setVal(0); return; }
    let t0: number | null = null;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return val;
}

// ─── Atoms ───────────────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, spocMode = false }: { eyebrow: string; title: string; spocMode?: boolean }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: spocMode ? "#8882cc" : "#aaaabc", marginBottom: 5 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 21, fontWeight: 900, color: ACCENT_NAVY, margin: 0, letterSpacing: -0.3 }}>{title}</h2>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    Active: [P_TEAL, B_TEAL], Matched: [P_TEAL, B_TEAL], Completed: [P_BLUE, B_BLUE],
    Dropped: [P_RED, B_RED], Applied: [P_INDIGO, B_INDIGO], Pending: [P_YELLOW, "#9a6500"],
    Approved: [P_TEAL, B_TEAL], Rejected: [P_RED, B_RED],
    Full: [P_RED, B_RED], Upcoming: [P_INDIGO, B_INDIGO], Live: [P_TEAL, B_TEAL],
    Paused: [P_YELLOW, "#9a6500"], Inactive: ["#f0f0f4", "#888"],
  };
  const [bg, color] = map[status] ?? ["#f0f0f0", "#555"];
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap" }}>{status}</span>;
}

function RiskDot({ severity }: { severity: string }) {
  return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: severity === "high" ? B_RED : B_YELLOW, marginRight: 5, flexShrink: 0 }} />;
}

function Slicers({ options, active, onChange, accent = B_BLUE }: { options: { id: string; label: string }[]; active: string; onChange: (id: string) => void; accent?: string }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)}
          style={{ padding: "6px 16px", borderRadius: 100, border: `1.5px solid ${active === o.id ? accent : "#dddde8"}`, background: active === o.id ? accent : "transparent", color: active === o.id ? "#fff" : "#666", fontSize: 13, fontWeight: active === o.id ? 600 : 400, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function StatTile({ value, label, pastel, accent, delay, started, tip }: { value: number; label: string; pastel: string; accent: string; delay: number; started: boolean; tip?: string }) {
  const [go, setGo] = useState(false);
  const [showTip, setShowTip] = useState(false);
  useEffect(() => { if (started) { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); } }, [started, delay]);
  const n = useCountUp(value, 1100, go);
  return (
    <div style={{ background: pastel, borderRadius: 12, padding: "16px 12px 14px", textAlign: "center", border: `1px solid ${accent}22`, transition: "transform 0.2s", cursor: "default", position: "relative" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; setShowTip(true); }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; setShowTip(false); }}>
      <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1, letterSpacing: "-1.5px", color: accent, fontFamily: "'DM Sans', sans-serif" }}>{n.toLocaleString()}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT_NAVY, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.5px", lineHeight: 1.3 }}>{label}</div>
      {showTip && tip && (
        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: ACCENT_NAVY, color: "rgba(255,255,255,0.88)", fontSize: 11.5, lineHeight: 1.5, padding: "9px 13px", borderRadius: 9, width: 190, zIndex: 50, pointerEvents: "none", textAlign: "left" }}>
          {tip}<div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, background: ACCENT_NAVY, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        </div>
      )}
    </div>
  );
}

function VolStatTile({ value, label, pastel, accent, delay, started }: { value: number; label: string; pastel: string; accent: string; delay: number; started: boolean }) {
  const [go, setGo] = useState(false);
  useEffect(() => { if (started) { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); } }, [started, delay]);
  const n = useCountUp(value, 1100, go);
  return (
    <div style={{ background: pastel, borderRadius: 14, padding: "20px 14px 16px", textAlign: "center", border: `1px solid ${accent}22`, transition: "transform 0.2s", cursor: "default" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
      <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1, letterSpacing: "-2px", color: accent, fontFamily: "'DM Sans', sans-serif" }}>{n}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: ACCENT_NAVY, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.6px", lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div style={modalBack} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modalBox}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid #e8e8f0" }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: ACCENT_NAVY }}>{title}</div>
          <button onClick={onClose} style={{ fontSize: 18, color: "#aaaabc", background: "none", border: "none", cursor: "pointer", padding: 4 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DrawerShell({ open, onClose, title, subtitle, accentTag, children }: { open: boolean; onClose: () => void; title: string; subtitle?: string; accentTag?: string; children: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(13,27,62,0.45)", zIndex: 200, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.22s", backdropFilter: "blur(2px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: open ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -48%) scale(0.97)", transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", width: 560, maxWidth: "calc(100vw - 40px)", maxHeight: "calc(100vh - 80px)", background: "#fff", borderRadius: 16, zIndex: 201, boxShadow: "0 24px 64px rgba(13,27,62,0.22)", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", overflowY: "auto" }}>
        <div style={{ background: ACCENT_NAVY, padding: "24px 28px", borderRadius: "16px 16px 0 0", flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 7, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500, padding: "5px 12px", cursor: "pointer", marginBottom: 16 }}>← Close</button>
          {accentTag && <div style={{ display: "inline-block", background: `${B_YELLOW}22`, border: `1px solid ${B_YELLOW}44`, borderRadius: 100, padding: "3px 10px", fontSize: 10.5, fontWeight: 700, color: B_YELLOW, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 10 }}>{accentTag}</div>}
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", marginTop: 5 }}>{subtitle}</div>}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      </div>
    </>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10.5, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{children}</div>;
}

function TextInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 9, padding: "10px 13px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", boxSizing: "border-box" }}
      onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 9, padding: "10px 13px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", boxSizing: "border-box", resize: "vertical" }}
      onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 9, padding: "10px 13px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", appearance: "none", background: "#fff", cursor: "pointer", boxSizing: "border-box" }}
      onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

function PrimaryBtn({ children, onClick, color = B_INDIGO }: { children: React.ReactNode; onClick: () => void; color?: string }) {
  return (
    <button onClick={onClick} style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", background: color, border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, color = B_INDIGO }: { children: React.ReactNode; onClick: () => void; color?: string }) {
  return (
    <button onClick={onClick} style={{ fontSize: 13, fontWeight: 600, color, background: "none", border: `1px solid ${color}44`, borderRadius: 9, padding: "8px 16px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
      {children}
    </button>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function SPOCDashboardView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggerToast, setShowOrientationModal } = useAppContext();

  const isRegionalSPOC = user?.role === "regional_spoc";
  const spoc    = isRegionalSPOC ? ANJALI_GUPTA_REGIONAL : ROHAN_DESAI;
  const volData = ROHAN_DESAI_VOLUNTEER;

  const [spocMode, setSpocMode] = useState(false);

  const snapRef = useRef<HTMLDivElement>(null);
  const spocRef = useRef<HTMLDivElement>(null);
  const [snapStarted, setSnapStarted] = useState(false);
  const [spocStarted, setSpocStarted] = useState(false);
  const [activeSection, setActiveSection] = useState("snapshot");

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.target === snapRef.current && e.isIntersecting) setSnapStarted(true);
        if (e.target === spocRef.current && e.isIntersecting) setSpocStarted(true);
      });
    }, { threshold: 0.15 });
    if (snapRef.current) obs.observe(snapRef.current);
    if (spocRef.current) obs.observe(spocRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (spocMode) setSpocStarted(true);
  }, [spocMode]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  // Data state
  const [tvwEvents,  setTvwEvents]  = useState(TCS_TVW_EVENTS);
  const [approvals,  setApprovals]  = useState(PENDING_APPROVALS_DATA);
  const [pipeFilter, setPipeFilter] = useState("All");
  const [pipeSearch, setPipeSearch] = useState("");
  const [showNudged, setShowNudged] = useState(false);
  const [nudgeContact, setNudgeContact] = useState<any>(null);

  // Volunteer tabs
  const [actTab,  setActTab]  = useState("view");
  const [histTab, setHistTab] = useState("applications");

  // TVW registration modal (volunteer section)
  const [tvwRegModal, setTvwRegModal] = useState<any>(null);

  // Hours, Story, Nudge modals
  const [hoursModal, setHoursModal] = useState(false);
  const [storyModal, setStoryModal] = useState(false);
  const [nudgeDrawer, setNudgeDrawer] = useState(false);

  // Hours form state
  const [hoursEvent, setHoursEvent] = useState("");
  const [hoursCount, setHoursCount] = useState("");
  const [hoursDate, setHoursDate] = useState(new Date().toISOString().slice(0, 10));
  const [hoursDesc, setHoursDesc] = useState("");

  // Story form state
  const [storyVolName, setStoryVolName] = useState("");
  const [storyProject, setStoryProject] = useState("");
  const [storyText, setStoryText] = useState("");

  // Modals
  type ModalType = null | "createEvent" | "vibeSubmit" | "volunteerProfile" | "rejectReason" | "projectUpdate" | "feedback" | "applicationDetail";
  const [modal,         setModal]         = useState<ModalType>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedVol,   setSelectedVol]   = useState<any>(null);
  const [rejectTarget,  setRejectTarget]  = useState<any>(null);
  const [rejectReason,  setRejectReason]  = useState("");

  // Project update form
  const [updateText, setUpdateText] = useState("");
  const [updateSubmitted, setUpdateSubmitted] = useState(false);

  // Feedback form
  const [fbCompleted, setFbCompleted] = useState<"" | "yes" | "no">("");
  const [fbMonths, setFbMonths] = useState("");
  const [fbHoursWeek, setFbHoursWeek] = useState("");
  const [fbSupportRatings, setFbSupportRatings] = useState([0, 0, 0]);
  const [fbAttrRatings, setFbAttrRatings] = useState([0, 0, 0, 0, 0]);
  const [fbAddress, setFbAddress] = useState("");
  const [fbNps, setFbNps] = useState(0);
  const [fbNpsHov, setFbNpsHov] = useState(0);
  const [fbSuggestions, setFbSuggestions] = useState("");
  const [fbDropoutReason, setFbDropoutReason] = useState("");
  const [fbSubmitted, setFbSubmitted] = useState(false);
  const [fbSupportHov, setFbSupportHov] = useState([0, 0, 0]);
  const [fbAttrHov, setFbAttrHov] = useState([0, 0, 0, 0, 0]);

  // Application detail
  const [drawerApp, setDrawerApp] = useState<any>(null);

  // Collapsible sub-panels for Manage & Oversight
  const [pipelineOpen, setPipelineOpen] = useState(true);
  const [feedbackPanelOpen, setFeedbackPanelOpen] = useState(false);
  const [downloadsPanelOpen, setDownloadsPanelOpen] = useState(false);

  // Create event form
  const [newEvent, setNewEvent] = useState({ title: "", type: "Community Service", date: "", time: "", venue: "", mode: "In-Person", capacity: "", hours: "", openToAll: false });
  const setNE = (k: string, v: any) => setNewEvent(p => ({ ...p, [k]: v }));

  // Vibe form
  const [vibeCaption,  setVibeCaption]  = useState("");
  const [vibeLocation, setVibeLocation] = useState("");
  const [vibeImpact,   setVibeImpact]   = useState("");

  // Handlers
  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date) { triggerToast("Title and date are required."); return; }
    setTvwEvents(prev => [{
      id: prev.length + 100, title: newEvent.title, type: newEvent.type,
      date: newEvent.date, time: newEvent.time, venue: newEvent.venue,
      mode: newEvent.mode, capacity: `0/${newEvent.capacity}`, status: "Upcoming",
      region: isRegionalSPOC ? (spoc as any).geography : "Global",
      volunteeringHours: Number(newEvent.hours), openToAll: newEvent.openToAll,
      createdBy: `${spoc.firstName} ${spoc.lastName}`, volunteers: [],
    } as any, ...prev]);
    setModal(null);
    setNewEvent({ title: "", type: "Community Service", date: "", time: "", venue: "", mode: "In-Person", capacity: "", hours: "", openToAll: false });
    triggerToast("Event posted to TVW Calendar. Live within 5 minutes.");
  };

  const handleVibeSubmit = () => {
    if (!vibeCaption.trim()) { triggerToast("Please add a caption before submitting."); return; }
    setTvwEvents(prev => prev.map(e => e.id === selectedEvent?.id ? { ...e, vibeStatus: "Pending Admin Review" } : e));
    setModal(null); setVibeCaption(""); setVibeLocation(""); setVibeImpact("");
    triggerToast("Vibe submitted — Admin will review before publishing.");
  };

  const handleApprove = (id: number) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
    triggerToast("Volunteer approved — welcome email sent.");
  };

  const handleReject = () => {
    if (!rejectReason.trim()) { triggerToast("Please provide a rejection reason."); return; }
    setApprovals(prev => prev.map(a => a.id === rejectTarget?.id ? { ...a, status: "Rejected", rejectionReason: rejectReason } : a));
    setModal(null); setRejectTarget(null); setRejectReason("");
    triggerToast("Application rejected — reason sent to applicant.");
  };

  // Pipeline
  const atRiskNames = new Set(AT_RISK_VOLUNTEERS.map(r => r.name));
  const filteredPipeline = PROENGAGE_PIPELINE.filter(v => {
    const bySearch = !pipeSearch || v.name.toLowerCase().includes(pipeSearch.toLowerCase()) || v.project.toLowerCase().includes(pipeSearch.toLowerCase());
    const byFilter = pipeFilter === "All" ? true : pipeFilter === "At Risk" ? atRiskNames.has(v.name) : v.status === pipeFilter;
    return bySearch && byFilter;
  });

  const tcsEntry = COMPANY_LEADERBOARD.find(c => c.name === "TCS");

  const pendingCount = approvals.filter(a => a.status === "Pending").length;

  const SPOC_SECTIONS: { id: string; label: string; badge?: number }[] = [
    { id: "spoc-kpis",        label: "My SPOC Snapshots"  },
    { id: "spoc-activities",  label: "My Activities"       },
    { id: "spoc-history",     label: "My History"          },
    { id: "spoc-oversight",   label: "Manage & Oversight"  },
    ...(!isRegionalSPOC ? [{ id: "spoc-mgt", label: "SPOC Management" }] : []),
    { id: "spoc-validation",  label: "Pending Validation", badge: pendingCount },
    { id: "spoc-annual",      label: "Annual Reporting"   },
    { id: "spoc-resources",   label: "Resource Library"   },
  ];

  const VOL_SECTIONS = [
    { id: "snapshot",   label: "My Engagement Snapshot" },
    { id: "activities", label: "My Activities"          },
    { id: "history",    label: "My History"             },
    { id: "resources",  label: "Resource Library"       },
  ];

  // Activity tabs: View (1), DIY (2), Add (3)
  const actTabs = [
    { id: "view", label: "View Opportunities" },
    { id: "diy",  label: "DIY Activities"     },
    { id: "add",  label: "Add Opportunities"  },
  ];

  // SPOC History tabs
  const spocHistTabs = [
    { id: "company-opps",    label: "Company Opportunities" },
    { id: "pe-applied",      label: "PE — Applied"          },
    { id: "pe-matched",      label: "PE — Matched"          },
    { id: "ongoing",         label: "Ongoing Projects"      },
    { id: "feedback-status", label: "Feedback Status"       },
    { id: "edition-end",     label: "Edition End Summary"   },
  ];
  const [spocHistTab, setSpocHistTab] = useState("company-opps");
  const [spocHistFY,  setSpocHistFY]  = useState("FY 2026");

  // ── Right rail ───────────────────────────────────────────────────────────────
  const rightRailJSX = (
    <div style={{ width: 152, flexShrink: 0, position: "sticky", top: 88, alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 10 }}>
      {spocMode ? (
        <>
          <div style={{ ...card, padding: "14px 16px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: B_INDIGO, marginBottom: 10, opacity: 0.8 }}>SPOC Corner</div>
            {SPOC_SECTIONS.map(s => {
              const hasNotif = (s.id === "spoc-activities" && NOTIFICATIONS.tvwActions) || (s.id === "spoc-validation" && (NOTIFICATIONS.volunteerPipeline || NOTIFICATIONS.feedbackMonitor));
              return (
                <div key={s.id} onClick={() => scrollTo(s.id)}
                  style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f0f0f8", cursor: "pointer", color: activeSection === s.id ? B_INDIGO : "#6b6b7a", fontWeight: activeSection === s.id ? 700 : 400, width: "100%" }}>
                  <span>{activeSection === s.id ? "↑ " : ""}{s.label}{hasNotif && <span style={notifDot} />}</span>
                  {(s.badge ?? 0) > 0 && (
                    <span style={{ background: B_RED, color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 100, marginLeft: 4 }}>{s.badge}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ ...card, padding: "14px 16px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 10 }}>Volunteer</div>
            {VOL_SECTIONS.map(s => (
              <div key={s.id} onClick={() => scrollTo(s.id)}
                style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f0f0f8", cursor: "pointer", color: activeSection === s.id ? B_BLUE : "#6b6b7a", fontWeight: activeSection === s.id ? 700 : 400 }}>
                {activeSection === s.id ? "↑ " : ""}{s.label}
              </div>
            ))}
          </div>
          <div style={{ ...card, padding: "14px 16px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 10 }}>Quick links</div>
            {[
              { label: "Edit Profile",      fn: () => navigate("/profile") },
              { label: "Post TVW Event",    fn: () => IS_TVW_SEASON ? setModal("createEvent") : triggerToast("TVW season not active."), hide: !IS_TVW_SEASON },
              { label: "Download Certs",    fn: () => triggerToast("Preparing ZIP of all certificates…") },
            ].filter(l => !l.hide).map(l => (
              <div key={l.label} onClick={l.fn} style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f0f0f8", cursor: "pointer", color: B_INDIGO, fontWeight: 500 }}>{l.label}</div>
            ))}
          </div>
          {!isRegionalSPOC && tcsEntry && (
            <div style={{ background: P_SPOC, border: "1.5px solid #c8c6f0", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: B_INDIGO, marginBottom: 8, opacity: 0.8 }}>Leaderboard</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#3C3489" }}>#{tcsEntry.rank} · TCS</div>
              <div style={{ fontSize: 11, color: B_INDIGO, marginTop: 3 }}>{tcsEntry.matched.toLocaleString()} matched</div>
              <div style={{ fontSize: 10, color: "#7F77DD", marginTop: 2 }}>↑ 12 this week</div>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ ...card, padding: "14px 16px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 10 }}>Sections</div>
            {VOL_SECTIONS.map(s => (
              <div key={s.id} onClick={() => scrollTo(s.id)}
                style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f0f0f8", cursor: "pointer", color: activeSection === s.id ? B_BLUE : "#6b6b7a", fontWeight: activeSection === s.id ? 700 : 400 }}>
                {activeSection === s.id ? "↑ " : ""}{s.label}
              </div>
            ))}
          </div>
          <div style={{ ...card, padding: "14px 16px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 10 }}>Quick links</div>
            <div onClick={() => navigate("/profile")} style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f0f0f8", cursor: "pointer", color: B_BLUE, fontWeight: 500 }}>Edit Profile</div>
            <div onClick={() => triggerToast("Grievance form opened.")} style={{ fontSize: 12, padding: "5px 0", cursor: "pointer", color: B_BLUE, fontWeight: 500 }}>Raise Grievance</div>
          </div>
        </>
      )}
    </div>
  );

  // ── SPOC Sections ─────────────────────────────────────────────────────────────
  const spocSectionsJSX = (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* I — My SPOC Snapshots (8 KPIs) */}
      <div id="spoc-kpis" ref={spocRef} style={spocCard}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 22 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#8882cc", marginBottom: 5 }}>SPOC Corner · I · {isRegionalSPOC ? (spoc as any).geography : "Full Company"}</div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 21, fontWeight: 900, color: ACCENT_NAVY, margin: 0, letterSpacing: -0.3 }}>My SPOC Snapshots</h2>
          </div>
          <span style={{ background: P_SPOC, color: B_INDIGO, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>FY 2026</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 10 }}>
          {([
            { value: spoc.stats.totalVolunteers, label: "Signed on for PE",    pastel: P_SPOC,   accent: B_INDIGO, tip: "Employees who signed up for a ProEngage project this edition." },
            { value: spoc.stats.activeProEngage, label: "Ongoing Projects",     pastel: P_TEAL,   accent: B_TEAL,   tip: "Employees with an active PE project currently underway." },
            { value: 12,                          label: "Completed Projects",   pastel: P_BLUE,   accent: B_BLUE,   tip: "Employees who completed a PE project this edition." },
            { value: 4,                           label: "Dropouts",             pastel: P_RED,    accent: B_RED,    tip: "Employees who dropped out of a PE project this edition." },
          ] as any[]).map((t, i) => <StatTile key={i} {...t} delay={i * 80} started={spocStarted} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
          {([
            { value: 7,  label: "Badges as SPOC",      pastel: P_YELLOW, accent: B_YELLOW, tip: "Badges earned in your SPOC role." },
            { value: 23, label: "Employees Referred",   pastel: P_INDIGO, accent: B_INDIGO, tip: "Employees who signed up via your referral link." },
            { value: 18, label: "Social Contributions", pastel: P_BLUE,   accent: B_BLUE,   tip: "Social media posts/shares by your company volunteers." },
            { value: isRegionalSPOC ? 0 : SPOC_DIRECTORY.filter((s: any) => s.company === "TCS" && s.role === "Regional SPOC").length, label: "Regional SPOCs", pastel: P_SPOC, accent: B_INDIGO, tip: "Regional SPOCs under your company." },
          ] as any[]).map((t, i) => <StatTile key={i} {...t} delay={400 + i * 80} started={spocStarted} />)}
        </div>
        {AT_RISK_VOLUNTEERS.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ background: P_RED, color: B_RED, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>⚠ {AT_RISK_VOLUNTEERS.length} At-Risk</span>
                <span style={{ fontSize: 12, color: "#6b6b7a" }}>Nudges sent by Admin / AI</span>
              </div>
              <GhostBtn color={B_INDIGO} onClick={() => setShowNudged(n => !n)}>{showNudged ? "Hide" : "View nudged list"}</GhostBtn>
            </div>
            {showNudged && (
              <div style={{ border: "1px solid #e8e8f0", borderRadius: 10, overflow: "hidden" }}>
                {AT_RISK_VOLUNTEERS.map((v, i) => (
                  <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: i < AT_RISK_VOLUNTEERS.length - 1 ? "1px solid #f0f0f8" : "none" }}>
                    <RiskDot severity={v.severity} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{v.name}</div>
                      <div style={{ fontSize: 11, color: "#6b6b7a" }}>{v.project} · {v.reason}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: v.nudged ? P_TEAL : P_YELLOW, color: v.nudged ? B_TEAL : "#9a6500" }}>
                      {v.nudged ? "✓ Nudged" : "Pending nudge"}
                    </span>
                    <button onClick={() => setNudgeContact(v)}
                      style={{ fontSize: 11, fontWeight: 600, color: B_INDIGO, background: P_SPOC, border: "1px solid #c8c6f0", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                      Contact →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* II — My Activities (TVW + PE) */}
      <div id="spoc-activities" style={IS_TVW_SEASON ? spocCard : { ...spocCard, background: "#fafafa" }}>
        <SectionHeading eyebrow="SPOC Corner · II" title="My Activities" spocMode />
        {IS_TVW_SEASON ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#6b6b7a" }}>TVW Edition 23 · Active · {tvwEvents.length} events</div>
              <PrimaryBtn onClick={() => setModal("createEvent")} color={B_INDIGO}>+ Post New Event</PrimaryBtn>
            </div>
            {tvwEvents.map((ev, i) => (
              <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < tvwEvents.length - 1 ? "1px solid #f0f0f8" : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY }}>{ev.title}</div>
                  <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 2 }}>{ev.date} · {ev.mode} · {ev.venue}</div>
                  <div style={{ fontSize: 11, color: "#aaaabc", marginTop: 1 }}>{ev.capacity} registered · {ev.volunteeringHours}h · {ev.createdBy}</div>
                  {(ev as any).vibeStatus && <div style={{ fontSize: 11, color: B_YELLOW, marginTop: 2 }}>Vibe: {(ev as any).vibeStatus}</div>}
                </div>
                <StatusBadge status={ev.status} />
                {ev.status === "Completed" && !(ev as any).vibeStatus && (
                  <GhostBtn color={B_INDIGO} onClick={() => { setSelectedEvent(ev); setModal("vibeSubmit"); }}>Submit Vibe</GhostBtn>
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16, paddingTop: 14, borderTop: "1px solid #f0f0f8" }}>
              <GhostBtn color={B_INDIGO} onClick={() => { setHoursEvent(tvwEvents[0]?.title ?? ""); setHoursCount(""); setHoursDate(new Date().toISOString().slice(0, 10)); setHoursDesc(""); setHoursModal(true); }}>+ Add Volunteering Hours</GhostBtn>
              <GhostBtn color={B_INDIGO} onClick={() => triggerToast("Campaign kit downloading…")}>📦 Campaign Kit</GhostBtn>
              <GhostBtn color={B_INDIGO} onClick={() => { setStoryVolName(""); setStoryProject(""); setStoryText(""); setStoryModal(true); }}>📖 Share Volunteering Story</GhostBtn>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📅</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 6 }}>TVW season is not currently active</div>
            <div style={{ fontSize: 13, color: "#6b6b7a" }}>TVW typically runs in March and August.</div>
          </div>
        )}
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: "2px dashed #e8e8f0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#8882cc", marginBottom: 12 }}>ProEngage — All Year</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <GhostBtn color={B_INDIGO} onClick={() => setNudgeDrawer(true)}>PE Volunteers to Nudge</GhostBtn>
            <GhostBtn color={B_INDIGO} onClick={() => triggerToast("Preparing ZIP of all certificates…")}>⬇ Bulk Download Certs</GhostBtn>
            <GhostBtn color={B_INDIGO} onClick={() => triggerToast("Downloading open PE projects list…")}>📋 Open PE Projects List</GhostBtn>
          </div>
        </div>
      </div>

      {/* III — My History (6 sub-tabs + FY dropdown + export) */}
      <div id="spoc-history" style={spocCard}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, overflowX: "auto", paddingBottom: 4 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#8882cc", marginBottom: 5 }}>SPOC Corner · III</div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 21, fontWeight: 900, color: ACCENT_NAVY, margin: 0, letterSpacing: -0.3 }}>My History</h2>
          </div>
          <select value={spocHistFY} onChange={e => setSpocHistFY(e.target.value)}
            style={{ border: "1.5px solid #c8c6f0", borderRadius: 9, padding: "7px 12px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: B_INDIGO, fontWeight: 600, background: P_SPOC, cursor: "pointer", outline: "none", flexShrink: 0 }}>
            {["FY 2026","FY 2025","FY 2024","FY 2023"].map(y => <option key={y}>{y}</option>)}
          </select>
          <GhostBtn color={B_INDIGO} onClick={() => triggerToast("Exporting to Excel…")}>⬇ Export XLS</GhostBtn>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {spocHistTabs.map(t => (
            <button key={t.id} onClick={() => setSpocHistTab(t.id)}
              style={{ padding: "5px 11px", fontSize: 12, whiteSpace: "nowrap", borderRadius: 100, border: `1.5px solid ${spocHistTab === t.id ? B_INDIGO : "#dddde8"}`, background: spocHistTab === t.id ? B_INDIGO : "transparent", color: spocHistTab === t.id ? "#fff" : "#666", fontWeight: spocHistTab === t.id ? 600 : 400, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>
        {spocHistTab === "company-opps" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { title: "Financial Literacy for Youth", company: "TCS", mode: "Virtual",    status: "Live"     },
              { title: "Coastal Cleanup Drive",         company: "TCS · Mumbai", mode: "In-Person", status: "Upcoming" },
              { title: "Digital Skills for Seniors",    company: "TCS · Pune",   mode: "Hybrid",    status: "Live"     },
            ].map((o, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", border: "1px solid #e8e8f0", borderRadius: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{o.title}</div>
                  <div style={{ fontSize: 11, color: "#6b6b7a", marginTop: 2 }}>{o.company} · {o.mode}</div>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
        )}
        {spocHistTab === "pe-applied" && (
          <div style={{ border: "1px solid #e8e8f0", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: 12, padding: "10px 16px", background: "#f8f8fc", borderBottom: "1px solid #e8e8f0" }}>
              {["Volunteer","Project","Status"].map(h => <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</div>)}
            </div>
            {PROENGAGE_PIPELINE.slice(0, 5).map((v, i) => (
              <div key={v.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: 12, padding: "11px 16px", borderBottom: i < 4 ? "1px solid #f0f0f8" : "none", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{v.name}</div>
                <div style={{ fontSize: 12.5, color: "#6b6b7a" }}>{v.project}</div>
                <StatusBadge status={v.status} />
              </div>
            ))}
          </div>
        )}
        {spocHistTab === "pe-matched" && (
          <div style={{ border: "1px solid #e8e8f0", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr", gap: 12, padding: "10px 16px", background: "#f8f8fc", borderBottom: "1px solid #e8e8f0" }}>
              {["Volunteer","Project","NGO","Match Date"].map(h => <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</div>)}
            </div>
            {PROENGAGE_PIPELINE.filter((v: any) => v.status === "Matched" || v.status === "Active").slice(0, 4).map((v, i, arr) => (
              <div key={v.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr", gap: 12, padding: "11px 16px", borderBottom: i < arr.length - 1 ? "1px solid #f0f0f8" : "none", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{v.name}</div>
                <div style={{ fontSize: 12.5, color: "#6b6b7a" }}>{v.project}</div>
                <div style={{ fontSize: 12, color: "#6b6b7a" }}>{v.ngo}</div>
                <div style={{ fontSize: 12, color: "#aaaabc" }}>Mar 2026</div>
              </div>
            ))}
          </div>
        )}
        {spocHistTab === "ongoing" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PROENGAGE_PIPELINE.filter((v: any) => v.status === "Active" || v.status === "Matched").map((v, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: "1px solid #e8e8f0", borderRadius: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: "#6b6b7a", marginTop: 2 }}>{v.project} · {v.ngo}</div>
                </div>
                <StatusBadge status={v.status} />
              </div>
            ))}
          </div>
        )}
        {spocHistTab === "feedback-status" && (
          <div style={{ border: "1px solid #e8e8f0", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", gap: 12, padding: "10px 16px", background: "#f8f8fc", borderBottom: "1px solid #e8e8f0" }}>
              {["Volunteer","Project","Due","Feedback"].map(h => <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</div>)}
            </div>
            {FEEDBACK_MONITOR_DATA.map((f, i) => (
              <div key={f.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", gap: 12, padding: "11px 16px", borderBottom: i < FEEDBACK_MONITOR_DATA.length - 1 ? "1px solid #f0f0f8" : "none", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{f.name}</div>
                <div style={{ fontSize: 12, color: "#6b6b7a" }}>{f.project}</div>
                <div style={{ fontSize: 12, color: B_RED, fontWeight: 600 }}>{f.dueDate}</div>
                <span style={{ background: P_RED, color: B_RED, fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 100 }}>Overdue</span>
              </div>
            ))}
          </div>
        )}
        {spocHistTab === "edition-end" && (
          <div style={{ border: "1px solid #e8e8f0", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", gap: 12, padding: "10px 16px", background: "#f8f8fc", borderBottom: "1px solid #e8e8f0" }}>
              {["Volunteer","Project","Hours","Outcome"].map(h => <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</div>)}
            </div>
            {[
              { name: "Aarav Mehta", project: "Digital Literacy",   hours: 24, outcome: "Completed" },
              { name: "Sunita Rao",  project: "Financial Inclusion", hours: 18, outcome: "Completed" },
              { name: "Kiran Desai", project: "Climate Awareness",   hours: 6,  outcome: "Dropped"   },
              { name: "Priya Nair",  project: "Education for All",   hours: 30, outcome: "Completed" },
            ].map((v, i, arr) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", gap: 12, padding: "11px 16px", borderBottom: i < arr.length - 1 ? "1px solid #f0f0f8" : "none", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{v.name}</div>
                <div style={{ fontSize: 12, color: "#6b6b7a" }}>{v.project}</div>
                <div style={{ fontSize: 12, color: ACCENT_NAVY, fontWeight: 600 }}>{v.hours}h</div>
                <StatusBadge status={v.outcome} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* IV — Manage & Oversight */}
      <div id="spoc-oversight" style={spocCard}>
        <SectionHeading eyebrow="SPOC Corner · IV · All Year" title="Manage & Oversight" spocMode />
        <div style={{ marginBottom: 14 }}>
          <div onClick={() => setPipelineOpen(o => !o)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "10px 0", borderBottom: "1px solid #e8e8f0", userSelect: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative", display: "inline-flex", fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY }}>Volunteer Pipeline{NOTIFICATIONS.volunteerPipeline && <span style={notifDot} />}</div>
              <span style={{ background: P_SPOC, color: B_INDIGO, fontSize: 10.5, fontWeight: 700, padding: "2px 9px", borderRadius: 100 }}>{filteredPipeline.length}</span>
            </div>
            <span style={{ fontSize: 14, color: "#aaaabc", transition: "transform 0.2s", transform: pipelineOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
          </div>
          <div style={{ overflow: "hidden", maxHeight: pipelineOpen ? 2000 : 0, transition: "max-height 0.35s ease-in-out" }}>
            <div style={{ paddingTop: 14 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
                <input value={pipeSearch} onChange={e => setPipeSearch(e.target.value)} placeholder="Search volunteer or project…"
                  style={{ flex: "1 1 180px", border: "1.5px solid #e0e0e8", borderRadius: 9, padding: "7px 12px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none" }} />
                {["All","Active","Matched","Applied","Completed","Dropped","At Risk"].map(f => (
                  <button key={f} onClick={() => setPipeFilter(f)}
                    style={{ fontSize: 11.5, fontWeight: pipeFilter === f ? 700 : 400, padding: "5px 12px", borderRadius: 100, border: `1.5px solid ${pipeFilter === f ? B_INDIGO : "#dddde8"}`, background: pipeFilter === f ? B_INDIGO : "transparent", color: pipeFilter === f ? "#fff" : "#666", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    {f}
                  </button>
                ))}
              </div>
              <div style={{ border: "1px solid #e8e8f0", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 80px", gap: 12, padding: "10px 16px", background: "#f8f8fc", borderBottom: "1px solid #e8e8f0" }}>
                  {["Volunteer","Project","NGO","Status",""].map(h => (
                    <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</div>
                  ))}
                </div>
                {filteredPipeline.length === 0 && (
                  <div style={{ padding: "20px", color: "#aaaabc", fontSize: 13, textAlign: "center" }}>No volunteers match this filter.</div>
                )}
                {filteredPipeline.map((v, i) => {
                  const isAtRisk = atRiskNames.has(v.name);
                  return (
                    <div key={v.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 80px", gap: 12, padding: "11px 16px", borderBottom: i < filteredPipeline.length - 1 ? "1px solid #f0f0f8" : "none", background: isAtRisk ? `${B_RED}06` : "#fff", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY, display: "flex", alignItems: "center", gap: 5 }}>
                          {isAtRisk && <RiskDot severity="high" />}{v.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#aaaabc" }}>{v.email}</div>
                      </div>
                      <div style={{ fontSize: 12.5, color: "#555" }}>{v.project}</div>
                      <div style={{ fontSize: 12, color: "#6b6b7a" }}>{v.ngo}</div>
                      <StatusBadge status={v.status} />
                      <button onClick={() => { setSelectedVol(v); setModal("volunteerProfile"); }}
                        style={{ fontSize: 11, fontWeight: 600, color: B_INDIGO, background: P_SPOC, border: "1px solid #c8c6f0", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                        View →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {FEEDBACK_MONITOR_DATA.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div onClick={() => setFeedbackPanelOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "10px 0", borderBottom: "1px solid #e8e8f0", userSelect: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ position: "relative", display: "inline-flex", fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY }}>Feedback Monitor{NOTIFICATIONS.feedbackMonitor && <span style={notifDot} />}</div>
                <span style={{ background: P_RED, color: B_RED, fontSize: 10.5, fontWeight: 700, padding: "2px 9px", borderRadius: 100 }}>{FEEDBACK_MONITOR_DATA.length} overdue</span>
              </div>
              <span style={{ fontSize: 14, color: "#aaaabc", transition: "transform 0.2s", transform: feedbackPanelOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
            </div>
            <div style={{ overflow: "hidden", maxHeight: feedbackPanelOpen ? 1000 : 0, transition: "max-height 0.35s ease-in-out" }}>
              <div style={{ paddingTop: 10 }}>
                {FEEDBACK_MONITOR_DATA.map((f, i) => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < FEEDBACK_MONITOR_DATA.length - 1 ? "1px solid #f0f0f8" : "none" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: "#6b6b7a" }}>{f.project} · Due {f.dueDate} · {f.daysOverdue}d overdue</div>
                    </div>
                    <span style={{ background: P_RED, color: B_RED, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>{f.reminders.length} reminder{f.reminders.length !== 1 ? "s" : ""} sent</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div>
          <div onClick={() => setDownloadsPanelOpen(o => !o)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "10px 0", borderBottom: "1px solid #e8e8f0", userSelect: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY }}>Downloads</div>
              <span style={{ background: P_BLUE, color: B_BLUE, fontSize: 10.5, fontWeight: 700, padding: "2px 9px", borderRadius: 100 }}>3 actions</span>
            </div>
            <span style={{ fontSize: 14, color: "#aaaabc", transition: "transform 0.2s", transform: downloadsPanelOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
          </div>
          <div style={{ overflow: "hidden", maxHeight: downloadsPanelOpen ? 200 : 0, transition: "max-height 0.35s ease-in-out" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 14 }}>
              <GhostBtn color={B_INDIGO} onClick={() => triggerToast("Volunteer list downloading as Excel…")}>⬇ Download Volunteer List</GhostBtn>
              <GhostBtn color={B_INDIGO} onClick={() => triggerToast("Preparing ZIP of all certificates…")}>🏅 Bulk Download Certs</GhostBtn>
              <GhostBtn color={B_INDIGO} onClick={() => triggerToast("Downloading open PE projects list…")}>📋 Open PE Projects List</GhostBtn>
            </div>
          </div>
        </div>
      </div>

      {/* V — SPOC Management (Corporate only) */}
      {!isRegionalSPOC && (
        <div id="spoc-mgt" style={spocCard}>
          <SectionHeading eyebrow="SPOC Corner · V" title="SPOC Management" spocMode />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SPOC_DIRECTORY.filter((s: any) => s.company === "TCS").map((s: any, i: number) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "1px solid #e8e8f0", borderRadius: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.status === "Active" ? P_SPOC : "#f0f0f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: s.status === "Active" ? B_INDIGO : "#aaa", flexShrink: 0 }}>
                  {s.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#6b6b7a" }}>{s.role} · {s.geography}</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
            <div style={{ marginTop: 6 }}><GhostBtn color={B_INDIGO} onClick={() => triggerToast("Opening add Regional SPOC form…")}>+ Add Regional SPOC</GhostBtn></div>
          </div>
        </div>
      )}

      {/* VI — Pending Validation (own anchor) */}
      <div id="spoc-validation" style={spocCard}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#8882cc", marginBottom: 5 }}>SPOC Corner · {isRegionalSPOC ? "V" : "VI"}</div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 21, fontWeight: 900, color: ACCENT_NAVY, margin: 0, letterSpacing: -0.3 }}>Pending Validation</h2>
          </div>
          {pendingCount > 0 && <span style={{ background: B_RED, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 100 }}>{pendingCount} pending</span>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {approvals.map(a => (
            <div key={a.id} style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY, flex: 1 }}>{a.name}</div>
                <StatusBadge status={a.status} />
              </div>
              <div style={{ fontSize: 11.5, color: "#6b6b7a", marginBottom: a.status === "Pending" ? 8 : 0 }}>{a.type} · {a.registeredDate}</div>
              {(a as any).rejectionReason && <div style={{ fontSize: 11, color: B_RED, marginBottom: 4 }}>Reason: {(a as any).rejectionReason}</div>}
              {a.status === "Pending" && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleApprove(a.id)} style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: B_TEAL, border: "none", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Approve</button>
                  <button onClick={() => { setRejectTarget(a); setModal("rejectReason"); }} style={{ fontSize: 12, fontWeight: 600, color: B_RED, background: P_RED, border: `1px solid ${B_RED}33`, borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Reject</button>
                </div>
              )}
            </div>
          ))}
          {pendingCount === 0 && <div style={{ textAlign: "center", padding: "24px 0", color: "#aaaabc", fontSize: 13 }}>No pending registrations.</div>}
        </div>
      </div>

      {/* VII — Annual Reporting */}
      <div id="spoc-annual" style={spocCard}>
        <SectionHeading eyebrow={`SPOC Corner · ${isRegionalSPOC ? "VI" : "VII"}`} title="Annual Reporting" spocMode />
        <div style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}22`, borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 32 }}>📊</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>FY 2026 Annual Report</div>
            <div style={{ fontSize: 13, color: "#6b6b7a", lineHeight: 1.6 }}>View and download the full company volunteering report including PE outcomes, TVW participation, and impact metrics.</div>
          </div>
          <GhostBtn color={B_INDIGO} onClick={() => triggerToast("Annual reporting portal link coming soon.")}>Open Portal →</GhostBtn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "Download FY 2026 Report", fn: () => triggerToast("FY 2026 report available at edition end.") },
            { label: "Download FY 2025 Report", fn: () => triggerToast("Downloading FY 2025 annual report…") },
            { label: "Download FY 2024 Report", fn: () => triggerToast("Downloading FY 2024 annual report…") },
          ].map(r => (
            <button key={r.label} onClick={r.fn}
              style={{ background: "transparent", border: "1px solid #e8e8f0", borderRadius: 9, padding: "11px 14px", fontSize: 12.5, fontWeight: 600, color: B_INDIGO, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: 8 }}>
              ⬇ {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard (Corporate only) */}
      {!isRegionalSPOC && (
        <div style={spocCard}>
          <SectionHeading eyebrow="SPOC Corner · Leaderboard" title="Company Rankings" spocMode />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {COMPANY_LEADERBOARD.slice(0, 5).map(co => {
              const isUs = co.name === "TCS";
              return (
                <div key={co.rank} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: isUs ? P_SPOC : "#fafafa", borderRadius: 10, border: isUs ? "1.5px solid #c8c6f0" : "1px solid #f0f0f8" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: co.rank <= 3 ? B_INDIGO : "#e8e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: co.rank <= 3 ? "#fff" : "#aaa", flexShrink: 0 }}>{co.rank}</div>
                  <div style={{ flex: 1, fontSize: 13.5, fontWeight: isUs ? 800 : 500, color: ACCENT_NAVY }}>{co.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isUs ? B_INDIGO : ACCENT_NAVY }}>{co.matched.toLocaleString()}</div>
                  {isUs && <span style={{ background: B_INDIGO, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>YOU</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIII — Resource Library */}
      <div id="spoc-resources" style={spocCard}>
        <SectionHeading eyebrow={`SPOC Corner · ${isRegionalSPOC ? "VII" : "VIII"}`} title="Resource Library" spocMode />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
          {[
            { icon: "📚", title: "E-Module", desc: `${spoc.orientationProgress} of ${spoc.totalOrientationModules} modules complete.`, cta: "Continue", fn: () => setShowOrientationModal(true) },
            { icon: "🖼",  title: "Media Library", desc: "TVW + PE assets, campaign materials. View-only.", cta: "Browse", fn: () => triggerToast("Opening media library…") },
            { icon: "📋", title: "Open PE Projects", desc: "Real-time list with apply links to share.", cta: "Download", fn: () => triggerToast("Downloading open PE projects list…") },
          ].map(r => (
            <div key={r.title} style={{ background: "#fafafa", border: "1px solid #e8e8f0", borderRadius: 12, padding: "16px" }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>{r.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 6 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: "#6b6b7a", lineHeight: 1.5, marginBottom: 12 }}>{r.desc}</div>
              <GhostBtn color={B_INDIGO} onClick={r.fn}>{r.cta} →</GhostBtn>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Videos",       desc: "TVW and PE edition highlights",         icon: "🎬", fn: () => triggerToast("Opening video library…") },
            { label: "Stories",      desc: "Volunteer experiences & narratives",     icon: "📖", fn: () => triggerToast("Opening stories…") },
            { label: "Campaign Kit", desc: "Mailers, banners, LinkedIn post drafts", icon: "📦", fn: () => triggerToast("Campaign kit downloading…") },
          ].map(r => (
            <div key={r.label} onClick={r.fn}
              style={{ background: P_SPOC, border: "1px solid #c8c6f0", borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "transform 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "")}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{r.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 3 }}>{r.label}</div>
              <div style={{ fontSize: 11.5, color: "#6b6b7a", lineHeight: 1.4 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Volunteer Sections ────────────────────────────────────────────────────────
  const volunteerSectionsJSX = (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Snapshot */}
      <div id="snapshot" ref={snapRef} style={card}>
        <SectionHeading eyebrow="My Space · I" title="Engagement Snapshot" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 22 }}>
          {([
            { value: volData.hoursVolunteered, label: "Hours Volunteered", pastel: P_TEAL,   accent: B_TEAL,   delay: 0   },
            { value: 4,                         label: "Projects Applied",   pastel: P_INDIGO, accent: B_INDIGO, delay: 100 },
            { value: 2,                         label: "Completed",          pastel: P_BLUE,   accent: B_BLUE,   delay: 200 },
            { value: 0,                         label: "Dropped",            pastel: P_RED,    accent: B_RED,    delay: 300 },
            { value: 5,                         label: "Referred",           pastel: P_YELLOW, accent: B_YELLOW, delay: 400 },
            { value: volData.badges.length,     label: "Badges Earned",      pastel: P_SPOC,   accent: B_INDIGO, delay: 500 },
          ] as any[]).map((t, i) => <VolStatTile key={i} {...t} started={snapStarted} />)}
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 8 }}>Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {volData.skills.map((s: string) => <span key={s} style={{ background: P_INDIGO, color: B_INDIGO, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>{s}</span>)}
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 8 }}>Interests</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {volData.interests.map((s: string) => <span key={s} style={{ background: P_TEAL, color: B_TEAL, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>{s}</span>)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 10 }}>Badges</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {volData.badges.map((b: any) => (
              <div key={b.id} title={`${b.name} — ${b.date}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: B_INDIGO, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{b.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: ACCENT_NAVY, textAlign: "center", maxWidth: 60, lineHeight: 1.2 }}>{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activities */}
      <div id="activities" style={card}>
        <SectionHeading eyebrow="My Space · II" title="My Activities" />
        <Slicers options={actTabs} active={actTab} onChange={setActTab} accent={B_BLUE} />

        {actTab === "view" && (
          IS_TVW_SEASON ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 13, color: "#6b6b7a", marginBottom: 4 }}>TVW Edition 23 · Active</div>
              {tvwEvents.filter(e => e.status !== "Completed").slice(0, 2).map((ev, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px", background: P_BLUE, borderRadius: 12, border: `1px solid ${B_BLUE}18` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY }}>{ev.title}</div>
                    <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 3 }}>{ev.date} · {ev.mode}</div>
                  </div>
                  <StatusBadge status={ev.status} />
                  <button onClick={() => setTvwRegModal(ev)}
                    style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: B_BLUE, border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Register
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "#fafafa", border: "1px solid #e8e8f0", borderRadius: 12, padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📅</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 6 }}>TVW is not currently active</div>
              <div style={{ fontSize: 13, color: "#6b6b7a" }}>TVW runs in March and August. Check back then to browse and register for events.</div>
            </div>
          )
        )}

        {actTab === "diy" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { title: "Mentor a First-Gen Student", desc: "1 hr/week for 4 weeks. Set goals, share experience.", accent: B_INDIGO, pastel: P_INDIGO },
              { title: "Teach Digital Skills",       desc: "A 2-hour workshop at a local school or NGO.",        accent: B_BLUE,   pastel: P_BLUE   },
            ].map((d, i) => (
              <div key={i} style={{ padding: "14px", background: d.pastel, borderRadius: 12 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>{d.title}</div>
                <div style={{ fontSize: 12, color: "#6b6b7a", lineHeight: 1.5, marginBottom: 10 }}>{d.desc}</div>
                <GhostBtn color={d.accent} onClick={() => triggerToast("Opening activity guide…")}>Get started</GhostBtn>
              </div>
            ))}
          </div>
        )}

        {actTab === "add" && IS_PE_SEASON && (
          volData.activeApplication ? (
            <div>
              <div style={{ background: P_TEAL, borderRadius: 12, padding: "16px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: ACCENT_NAVY }}>{volData.activeApplication.title}</div>
                    <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 4 }}>{volData.activeApplication.ngo} · {volData.activeApplication.status}</div>
                  </div>
                  <StatusBadge status={volData.activeApplication.status} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                 { label: "Post Project Update", icon: "📝", fn: () => { setUpdateText(""); setUpdateSubmitted(false); setModal("projectUpdate"); } },
                 { label: "Access E-Module",     icon: "📖", fn: () => setShowOrientationModal(true) },
                 { label: "Submit Feedback",     icon: "⭐", fn: () => { setFbCompleted(""); setFbMonths(""); setFbHoursWeek(""); setFbSupportRatings([0,0,0]); setFbAttrRatings([0,0,0,0,0]); setFbAddress(""); setFbNps(0); setFbSuggestions(""); setFbDropoutReason(""); setFbSubmitted(false); setFbSupportHov([0,0,0]); setFbAttrHov([0,0,0,0,0]); setModal("feedback"); } },
                 { label: "Download Certificate",icon: "🏅", fn: () => triggerToast("Certificate unlocks after both parties submit feedback.") },
                ].map(a => (
                  <div key={a.label} style={{ background: "#fafafa", border: "1px solid #e8e8f0", borderRadius: 12, padding: "14px" }}>
                    <div style={{ fontSize: 16, marginBottom: 6 }}>{a.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY, marginBottom: 8 }}>{a.label}</div>
                    <GhostBtn color={B_BLUE} onClick={a.fn}>{a.label.split(" ")[0]} →</GhostBtn>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#6b6b7a", padding: "12px 0" }}>Browse open ProEngage projects and apply based on your skills and interests.</div>
          )
        )}

        {actTab === "add" && !IS_PE_SEASON && (
          <div style={{ background: "#fafafa", borderRadius: 12, padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 6 }}>ProEngage Edition 12 opens soon</div>
            <div style={{ fontSize: 13, color: "#6b6b7a", marginBottom: 14 }}>Update your skills now so AI recommendations are ready when applications open.</div>
            <GhostBtn color={B_INDIGO} onClick={() => navigate("/profile")}>Update Preferences</GhostBtn>
          </div>
        )}
      </div>

      {/* History */}
      <div id="history" style={card}>
        <SectionHeading eyebrow="My Space · III" title="My History" />
        <Slicers options={[{ id: "applications", label: "My Applications" }, { id: "projects", label: "My Projects" }, { id: "certificates", label: "My Certificates" }]} active={histTab} onChange={setHistTab} accent={B_BLUE} />
        {histTab === "applications" && (
          <div style={{ border: "1px solid #e8e8f0", borderRadius: 10, overflow: "hidden" }}>
            {volData.history.map((a: any, i: number) => (
              <div key={i} onClick={() => { setDrawerApp(a); setModal("applicationDetail"); }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderBottom: i < volData.history.length - 1 ? "1px solid #f0f0f8" : "none", cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8f8fc")}
                onMouseLeave={e => (e.currentTarget.style.background = "")}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{a.project}</div>
                  <div style={{ fontSize: 11, color: "#6b6b7a", marginTop: 2 }}>{a.ngo} · {a.year} · {a.hours}h</div>
                </div>
                <StatusBadge status="Completed" />
                <span style={{ fontSize: 11, color: B_BLUE, fontWeight: 600 }}>View →</span>
              </div>
            ))}
          </div>
        )}
        {histTab === "projects" && <div style={{ padding: "16px 0", fontSize: 13, color: "#6b6b7a" }}>Completed ProEngage projects with outcomes appear here.</div>}
        {histTab === "certificates" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {VOLUNTEER_CERTIFICATES.filter(c => c.status === "Generated").map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", border: "1px solid #e8e8f0", borderRadius: 10 }}>
                <div style={{ fontSize: 20 }}>🏅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{c.project}</div>
                  <div style={{ fontSize: 11, color: "#6b6b7a" }}>{c.ngo} · {c.date}</div>
                </div>
                <GhostBtn color={B_TEAL} onClick={() => triggerToast(`Downloading certificate: ${c.project}`)}>Download</GhostBtn>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resources */}
      <div id="resources" style={card}>
        <SectionHeading eyebrow="My Space · IV" title="Resources" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Photos",   desc: "Galleries from TVW and ProEngage",      photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80", accent: B_INDIGO, pastel: P_INDIGO },
            { label: "E-Module", desc: "Orientation, readiness kit, dos & don'ts", photo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80", accent: B_BLUE,   pastel: P_BLUE   },
            { label: "Stories",  desc: "Volunteer experiences and narratives",    photo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", accent: B_TEAL,   pastel: P_TEAL   },
          ].map(r => (
            <div key={r.label} style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, overflow: "hidden", cursor: "pointer" }} onClick={() => triggerToast(`Opening ${r.label}…`)}>
              <div style={{ height: 80, background: `url(${r.photo}) center/cover`, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: `${r.accent}88` }} />
              </div>
              <div style={{ background: r.pastel, padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: ACCENT_NAVY, marginBottom: 3 }}>{r.label}</div>
                <div style={{ fontSize: 11, color: "#6b6b7a", lineHeight: 1.4 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#f8f9ff", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>

        {/* Banner */}
        <div style={{ background: ACCENT_NAVY, borderRadius: "0 0 18px 18px", padding: "24px 32px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: B_INDIGO, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0, border: "3px solid rgba(255,255,255,0.15)" }}>
            {spoc.firstName[0]}{spoc.lastName[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 19, fontWeight: 900, color: "#fff" }}>{spoc.firstName} {spoc.lastName}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>{spoc.designation} · {spoc.company}{isRegionalSPOC ? ` · ${(spoc as any).geography}` : ""}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ background: P_SPOC, color: B_INDIGO, fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>{spoc.tier}</span>
            <span style={{ background: P_TEAL,  color: B_TEAL,   fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>Verified</span>
          </div>
        </div>

        {/* Toggle */}
        <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 12, padding: "12px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 13, color: spocMode ? "#aaaabc" : ACCENT_NAVY, fontWeight: spocMode ? 400 : 600, transition: "all 0.2s" }}>Volunteer View</span>
          <div onClick={() => setSpocMode(m => !m)}
            style={{ position: "relative", width: 44, height: 24, borderRadius: 12, background: spocMode ? B_INDIGO : "#d0d0e0", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 3, left: spocMode ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
          </div>
          <span style={{ fontSize: 13, color: spocMode ? B_INDIGO : "#aaaabc", fontWeight: spocMode ? 700 : 400, transition: "all 0.2s" }}>SPOC Corner</span>
          <span style={{ fontSize: 11.5, color: "#aaaabc", marginLeft: "auto" }}>Toggle to access SPOC management tools</span>
        </div>

        {/* Main layout */}
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
            {spocMode ? (
              <>
                {spocSectionsJSX}
                <div style={{ borderTop: "2px dashed #c8c6f0", paddingTop: 24, position: "relative" }}>
                  <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "#f8f9ff", padding: "0 14px", fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Your Volunteer Profile
                  </div>
                  {volunteerSectionsJSX}
                </div>
              </>
            ) : (
              <>{volunteerSectionsJSX}</>
            )}
          </div>
          {rightRailJSX}
        </div>
      </div>

      {/* Nudge Contact Modal */}
      {nudgeContact && (
        <Modal onClose={() => setNudgeContact(null)} title={`Contact — ${nudgeContact.name}`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: P_RED, border: `1px solid ${B_RED}22`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#7f1d1d", lineHeight: 1.6 }}>
              <strong>At-risk volunteer</strong> — {nudgeContact.reason}
            </div>
            {[
              ["Name",    nudgeContact.name],
              ["Project", nudgeContact.project],
              ["Email",   nudgeContact.contact ?? nudgeContact.email ?? "contact@tcs.com"],
              ["Phone",   "+91 98765 43210"],
              ["Status",  nudgeContact.nudged ? "Nudged by system" : "Awaiting nudge"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 16, paddingBottom: 10, borderBottom: "1px solid #f0f0f8" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px", width: 80, flexShrink: 0 }}>{k}</div>
                <div style={{ fontSize: 13, color: ACCENT_NAVY, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <PrimaryBtn onClick={() => { triggerToast(`Email drafted to ${nudgeContact.name}.`); setNudgeContact(null); }}>📧 Email Volunteer</PrimaryBtn>
              <GhostBtn onClick={() => setNudgeContact(null)} color="#888">Close</GhostBtn>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Event Modal */}
      {modal === "createEvent" && (
        <Modal onClose={() => setModal(null)} title="Post New TVW Event">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><FieldLabel>Event Title *</FieldLabel><TextInput value={newEvent.title} onChange={v => setNE("title", v)} placeholder="e.g. Digital Literacy for Seniors" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><FieldLabel>Date *</FieldLabel><TextInput type="date" value={newEvent.date} onChange={v => setNE("date", v)} /></div>
              <div><FieldLabel>Time</FieldLabel><TextInput type="time" value={newEvent.time} onChange={v => setNE("time", v)} /></div>
            </div>
            <div><FieldLabel>Venue / Meeting Link</FieldLabel><TextInput value={newEvent.venue} onChange={v => setNE("venue", v)} placeholder="Address or video link" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><FieldLabel>Mode</FieldLabel><SelectInput value={newEvent.mode} onChange={v => setNE("mode", v)} options={["In-Person", "Virtual", "Hybrid"]} /></div>
              <div><FieldLabel>Capacity</FieldLabel><TextInput value={newEvent.capacity} onChange={v => setNE("capacity", v)} placeholder="e.g. 50" /></div>
            </div>
            <div><FieldLabel>Volunteering Hours</FieldLabel><TextInput value={newEvent.hours} onChange={v => setNE("hours", v)} placeholder="e.g. 4" /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="openToAll" checked={newEvent.openToAll} onChange={e => setNE("openToAll", e.target.checked)} style={{ accentColor: B_INDIGO, width: 16, height: 16 }} />
              <label htmlFor="openToAll" style={{ fontSize: 13, color: ACCENT_NAVY, cursor: "pointer" }}>Open to all Tata companies</label>
            </div>
            <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
              <PrimaryBtn onClick={handleCreateEvent}>Post Event</PrimaryBtn>
              <GhostBtn onClick={() => setModal(null)} color="#888">Cancel</GhostBtn>
            </div>
          </div>
        </Modal>
      )}

      {/* Vibe Modal */}
      {modal === "vibeSubmit" && selectedEvent && (
        <Modal onClose={() => setModal(null)} title={`Submit Vibe — ${selectedEvent.title}`}>
          <div style={{ fontSize: 12, color: "#6b6b7a", marginBottom: 16, background: P_YELLOW, padding: "10px 14px", borderRadius: 9 }}>
            Submissions go to Admin review. Top stories are selected and published. You'll see a preview before it goes live.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><FieldLabel>Caption / Story *</FieldLabel><Textarea value={vibeCaption} onChange={setVibeCaption} placeholder="What made this event special? What impact did it have?" /></div>
            <div><FieldLabel>Location Tag</FieldLabel><TextInput value={vibeLocation} onChange={setVibeLocation} placeholder="e.g. Juhu Beach, Mumbai" /></div>
            <div><FieldLabel>Impact Note</FieldLabel><TextInput value={vibeImpact} onChange={setVibeImpact} placeholder="e.g. 200 kg waste collected, 50 seniors trained" /></div>
            <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
              <PrimaryBtn onClick={handleVibeSubmit}>Submit for Review</PrimaryBtn>
              <GhostBtn onClick={() => setModal(null)} color="#888">Cancel</GhostBtn>
            </div>
          </div>
        </Modal>
      )}

      {/* Volunteer Profile Modal */}
      {modal === "volunteerProfile" && selectedVol && (
        <Modal onClose={() => setModal(null)} title={`${selectedVol.name} — Volunteer Profile`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: P_INDIGO, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: B_INDIGO, flexShrink: 0 }}>
                {selectedVol.name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: ACCENT_NAVY }}>{selectedVol.name}</div>
                <div style={{ fontSize: 12, color: "#6b6b7a" }}>{selectedVol.email} · {selectedVol.company}</div>
              </div>
              <div style={{ marginLeft: "auto" }}><StatusBadge status={selectedVol.status} /></div>
            </div>
            {[
              { label: "Project",      value: selectedVol.project },
              { label: "NGO",          value: selectedVol.ngo },
              { label: "Match Score",  value: `${selectedVol.match}%` },
              { label: "Skills",       value: selectedVol.skills?.join(", ") },
              { label: "Experience",   value: selectedVol.experience },
              { label: "Last Updated", value: selectedVol.lastUpdated },
              { label: "Contact",      value: selectedVol.contact },
            ].filter(r => r.value).map(row => (
              <div key={row.label} style={{ display: "flex", gap: 16, paddingBottom: 10, borderBottom: "1px solid #f0f0f8" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px", width: 110, flexShrink: 0 }}>{row.label}</div>
                <div style={{ fontSize: 13, color: ACCENT_NAVY, fontWeight: 500 }}>{row.value}</div>
              </div>
            ))}
            {atRiskNames.has(selectedVol.name) && (
              <div style={{ background: P_RED, border: `1px solid ${B_RED}22`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: B_RED, marginBottom: 4 }}>⚠ At-risk volunteer</div>
                <div style={{ fontSize: 12, color: "#7f1d1d" }}>{AT_RISK_VOLUNTEERS.find(r => r.name === selectedVol.name)?.reason}</div>
                <div style={{ fontSize: 11, color: "#aaaabc", marginTop: 4 }}>Nudge will be sent automatically by Admin or AI system.</div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Reject Reason Modal */}
      {modal === "rejectReason" && rejectTarget && (
        <Modal onClose={() => { setModal(null); setRejectTarget(null); setRejectReason(""); }} title={`Reject — ${rejectTarget.name}`}>
          <div style={{ fontSize: 13, color: "#6b6b7a", marginBottom: 16 }}>A rejection email with your reason will be sent to <strong>{rejectTarget.email}</strong>.</div>
          <FieldLabel>Reason for rejection *</FieldLabel>
          <Textarea value={rejectReason} onChange={setRejectReason} placeholder="e.g. Document submitted was unclear. Please reapply with a valid government-issued ID." rows={4} />
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <PrimaryBtn onClick={handleReject} color={B_RED}>Confirm Rejection</PrimaryBtn>
            <GhostBtn onClick={() => { setModal(null); setRejectTarget(null); setRejectReason(""); }} color="#888">Cancel</GhostBtn>
          </div>
        </Modal>
      )}

      {/* Project Update Modal */}
      {modal === "projectUpdate" && (
        <Modal onClose={() => setModal(null)} title="Post a Project Update">
          {updateSubmitted ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: P_TEAL, border: `2px solid ${B_TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke={B_TEAL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Update posted</div>
              <div style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>Your update has been shared with TSG and your NGO partner at {volData.activeApplication?.ngo}.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6, margin: 0 }}>Share a brief progress note with TSG and your NGO partner. This helps track the health of your project.</p>
              <div>
                <FieldLabel>Update</FieldLabel>
                <Textarea value={updateText} onChange={setUpdateText} placeholder="What progress have you made this week? Any blockers or next steps?" rows={6} />
              </div>
              <div>
                <FieldLabel>Attachment (optional)</FieldLabel>
                <div style={{ border: "1.5px dashed #dddde8", borderRadius: 10, padding: "16px", textAlign: "center", fontSize: 13, color: "#aaaabc", cursor: "pointer" }}>Drop a file here or click to browse</div>
              </div>
              <button disabled={!updateText.trim()} onClick={() => { setUpdateSubmitted(true); triggerToast("Project update posted successfully."); }}
                style={{ width: "100%", background: updateText.trim() ? B_INDIGO : "#e0e0e8", color: updateText.trim() ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: updateText.trim() ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}>
                Post Update
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* Feedback Modal */}
      {modal === "feedback" && (() => {
        const fbCanSubmit = fbCompleted === "yes"
          ? fbMonths && fbHoursWeek && fbSupportRatings.every(r => r > 0) && fbAttrRatings.every(r => r > 0) && fbNps > 0
          : fbCompleted === "no" && fbDropoutReason !== "";
        const fbLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 };
        const fbInp: React.CSSProperties = { width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "10px 14px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", boxSizing: "border-box" as const };
        const fbSel: React.CSSProperties = { ...fbInp, appearance: "none" as const, cursor: "pointer" };
        const supportItems = ["Easily accessible", "Resolved queries", "Liaising with NGO partners"];
        const attrItems = [
          "Enhanced critical thinking, problem-solving, and adaptability through navigating project challenges",
          "Developed strong communication, interpersonal, and networking skills while collaborating with diverse stakeholders",
          "Gained deep understanding of NGO sector values and behaviours, applying gained knowledge to daily work",
          "Motivated and inspired others through effective leadership and management of ambiguity",
          "Cultivated empathy and confidence, fostering innovation and professional growth",
        ];
        const dropoutReasons = [
          "Change in project scope by NGO / NGO Unresponsive",
          "Personal and professional transitions, including relocation and increased workload, hindered project engagement",
          "I didn't feel motivated to do the project / I lost interest",
        ];
        const FbStarRow = ({ count = 5, value, hover, onHov, onSet }: { count?: number; value: number; hover: number; onHov: (v: number) => void; onSet: (v: number) => void }) => (
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: count }, (_, i) => i + 1).map(i => (
              <span key={i} onMouseEnter={() => onHov(i)} onMouseLeave={() => onHov(0)} onClick={() => onSet(i)}
                style={{ fontSize: count === 10 ? 22 : 26, cursor: "pointer", color: i <= (hover || value) ? B_YELLOW : "#e0e0e8", transition: "color 0.1s", lineHeight: 1 }}>★</span>
            ))}
          </div>
        );

        return (
          <Modal onClose={() => setModal(null)} title="ProEngage Volunteer Feedback">
            {fbSubmitted ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: P_TEAL, border: `2px solid ${B_TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke={B_TEAL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Feedback submitted</div>
                <div style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>Thank you. Once the NGO also submits feedback, your certificate will be generated within 24 hours.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <div style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}22`, borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: B_INDIGO, lineHeight: 1.6 }}>
                  We request you to fill in this feedback form to help us understand about your ProEngage volunteering journey and experience. All fields marked * are mandatory.
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>Overall Experience</div>
                  <label style={{ ...fbLabel, marginBottom: 12 }}>1. Were you able to successfully complete the project? *</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[["yes", "Yes"], ["no", "No"]].map(([val, lbl]) => (
                      <label key={val} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13.5, color: fbCompleted === val ? B_INDIGO : ACCENT_NAVY, fontWeight: fbCompleted === val ? 600 : 400 }}>
                        <div onClick={() => setFbCompleted(val as "yes" | "no")} style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${fbCompleted === val ? B_INDIGO : "#dddde8"}`, background: fbCompleted === val ? B_INDIGO : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}>
                          {fbCompleted === val && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                        </div>
                        {lbl}
                      </label>
                    ))}
                  </div>
                </div>

                {fbCompleted === "yes" && (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 16, paddingTop: 4, borderTop: "1px solid #e8e8f0" }}>ProEngage Experience</div>
                    <p style={{ fontSize: 12.5, color: "#8888a0", marginBottom: 20, marginTop: 0 }}>(We would like to know more about your journey.)</p>
                    <div style={{ marginBottom: 18 }}>
                      <label style={fbLabel}>2. How many months, in total, have you dedicated to completing this project? *</label>
                      <select value={fbMonths} onChange={e => setFbMonths(e.target.value)} style={fbSel}>
                        <option value="">Select</option>
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <label style={fbLabel}>3. How many hours per week have you dedicated to completing this project? *</label>
                      <select value={fbHoursWeek} onChange={e => setFbHoursWeek(e.target.value)} style={fbSel}>
                        <option value="">Select</option>
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={fbLabel}>4. How would you rate the support received from the ProEngage team? *</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {supportItems.map((item, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 12.5, color: "#555", lineHeight: 1.4, flex: 1 }}>{String.fromCharCode(65 + i)}. {item}</span>
                            <FbStarRow value={fbSupportRatings[i]} hover={fbSupportHov[i]} onHov={v => { const a = [...fbSupportHov]; a[i] = v; setFbSupportHov(a); }} onSet={v => { const a = [...fbSupportRatings]; a[i] = v; setFbSupportRatings(a); }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={fbLabel}>5. Which of the following attributes did ProEngage help you improve? *</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {attrItems.map((item, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                            <span style={{ fontSize: 12.5, color: "#555", lineHeight: 1.4, flex: 1 }}>{String.fromCharCode(65 + i)}. {item}</span>
                            <FbStarRow value={fbAttrRatings[i]} hover={fbAttrHov[i]} onHov={v => { const a = [...fbAttrHov]; a[i] = v; setFbAttrHov(a); }} onSet={v => { const a = [...fbAttrRatings]; a[i] = v; setFbAttrRatings(a); }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <label style={fbLabel}>6. Please provide your current residential or office address *</label>
                      <div style={{ background: P_YELLOW, border: `1px solid ${B_YELLOW}33`, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#78350f", lineHeight: 1.5, marginBottom: 10 }}>
                        Tata Engage Team will send the token to this address. If you live abroad, please provide your India address or Indian office address.
                      </div>
                      <input type="text" value={fbAddress} onChange={e => setFbAddress(e.target.value)} placeholder="Flat / Floor, House No., Building, Company, Apartment" style={{ ...fbInp, marginBottom: 8 }} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <label style={fbLabel}>7. How likely are you to recommend us to a friend or colleague? *</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11.5, color: "#8888a0", whiteSpace: "nowrap" }}>Unlikely</span>
                        <FbStarRow count={10} value={fbNps} hover={fbNpsHov} onHov={setFbNpsHov} onSet={setFbNps} />
                        <span style={{ fontSize: 11.5, color: "#8888a0", whiteSpace: "nowrap" }}>Likely</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: 22 }}>
                      <label style={fbLabel}>8. Do you have any suggestions for the Tata Engage Team regarding the way ProEngage is conducted?</label>
                      <textarea value={fbSuggestions} onChange={e => setFbSuggestions(e.target.value)} rows={3} placeholder="Suggestions if any" style={{ ...fbInp, resize: "none" as const }} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
                    </div>
                  </>
                )}

                {fbCompleted === "no" && (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 700, color: B_RED, marginBottom: 12, paddingTop: 4, borderTop: "1px solid #e8e8f0" }}>No Completion</div>
                    <p style={{ fontSize: 12.5, color: "#8888a0", marginBottom: 16, marginTop: 0 }}>(Let us know why you were unable to complete this project.)</p>
                    <div style={{ marginBottom: 22 }}>
                      <label style={fbLabel}>2. Reason of no completion *</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {dropoutReasons.map((r, i) => (
                          <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, color: fbDropoutReason === r ? B_INDIGO : ACCENT_NAVY, fontWeight: fbDropoutReason === r ? 600 : 400, lineHeight: 1.5 }}>
                            <div onClick={() => setFbDropoutReason(r)} style={{ width: 18, height: 18, minWidth: 18, borderRadius: "50%", border: `2px solid ${fbDropoutReason === r ? B_INDIGO : "#dddde8"}`, background: fbDropoutReason === r ? B_INDIGO : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer", marginTop: 2 }}>
                              {fbDropoutReason === r && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                            </div>
                            {r}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <button disabled={!fbCanSubmit} onClick={() => { setFbSubmitted(true); triggerToast("Feedback submitted successfully."); }}
                  style={{ width: "100%", background: fbCanSubmit ? B_INDIGO : "#e0e0e8", color: fbCanSubmit ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: fbCanSubmit ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", marginTop: 8, transition: "background 0.2s" }}>
                  Submit Feedback
                </button>
              </div>
            )}
          </Modal>
        );
      })()}

      {/* Application Detail Modal */}
      {modal === "applicationDetail" && drawerApp && (
        <Modal onClose={() => { setModal(null); setDrawerApp(null); }} title={`${drawerApp.project} — Application`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <StatusBadge status="Completed" />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 20 }}>Application Timeline</div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 11, top: 0, bottom: 0, width: 2, background: "#e8e8f0" }} />
                {[
                  { label: "Applied", date: drawerApp.date || drawerApp.year, done: true },
                  { label: "Under Review", date: "", done: true },
                  { label: "Matched", date: "", done: true },
                  { label: "Project Complete", date: drawerApp.date || drawerApp.year, done: true },
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 18, marginBottom: 24, position: "relative" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: step.done ? B_INDIGO : "#fff", border: `2.5px solid ${step.done ? B_INDIGO : "#dddde8"}`, flexShrink: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {step.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                    <div style={{ paddingTop: 2 }}>
                      <div style={{ fontSize: 13.5, fontWeight: step.done ? 600 : 400, color: step.done ? ACCENT_NAVY : "#aaaabc" }}>{step.label}</div>
                      {step.date && <div style={{ fontSize: 12, color: "#aaaabc", marginTop: 2 }}>{step.date}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 12 }}>Details</div>
              <div style={{ background: "#f8f8fc", borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Project", drawerApp.project],
                  ["NGO", drawerApp.ngo],
                  ["Year", drawerApp.year],
                  ["Hours", `${drawerApp.hours}h`],
                  ["Status", "Completed"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span style={{ fontSize: 12.5, color: "#8888a0" }}>{k}</span>
                    <span style={{ fontSize: 12.5, color: ACCENT_NAVY, fontWeight: 600, textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Log Volunteering Hours Modal */}
      <DrawerShell open={hoursModal} onClose={() => setHoursModal(false)} title="Log Volunteering Hours" accentTag="TVW 22">
        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div><FieldLabel>Select Event</FieldLabel>
            <SelectInput value={hoursEvent} onChange={setHoursEvent} options={tvwEvents.map(e => e.title)} />
          </div>
          <div><FieldLabel>Hours Contributed (1–12)</FieldLabel>
            <TextInput type="number" value={hoursCount} onChange={setHoursCount} placeholder="e.g. 4" />
          </div>
          <div><FieldLabel>Date of Activity</FieldLabel>
            <TextInput type="date" value={hoursDate} onChange={setHoursDate} />
          </div>
          <div><FieldLabel>Brief Description (optional)</FieldLabel>
            <Textarea value={hoursDesc} onChange={setHoursDesc} placeholder="e.g. 50 children taught basic computer skills" rows={3} />
          </div>
          <button onClick={() => { triggerToast("Volunteering hours logged successfully."); setHoursModal(false); }}
            style={{ width: "100%", background: B_INDIGO, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Submit Hours</button>
          <button onClick={() => setHoursModal(false)}
            style={{ width: "100%", background: "transparent", color: "#8888a0", border: "1px solid #e0e0e8", borderRadius: 10, padding: "11px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
        </div>
      </DrawerShell>

      {/* Share Volunteering Story Modal */}
      <DrawerShell open={storyModal} onClose={() => setStoryModal(false)} title="Share a Volunteering Story" accentTag="TVW Vibe">
        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: P_YELLOW, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>
            Stories go to Admin moderation before publishing.
          </div>
          <div><FieldLabel>Volunteer Name</FieldLabel>
            <TextInput value={storyVolName} onChange={setStoryVolName} placeholder="Full name" />
          </div>
          <div><FieldLabel>Event or Project Name</FieldLabel>
            <TextInput value={storyProject} onChange={setStoryProject} placeholder="Event or project name" />
          </div>
          <div><FieldLabel>The Story</FieldLabel>
            <Textarea value={storyText} onChange={setStoryText} placeholder="What happened? What was the impact?" rows={4} />
          </div>
          <div style={{ border: "1.5px dashed #dddde8", borderRadius: 10, padding: "20px", textAlign: "center", fontSize: 13, color: "#aaaabc", cursor: "pointer" }}>
            Attach a photo (optional)
          </div>
          <button onClick={() => { triggerToast("Story submitted for Admin review."); setStoryModal(false); }}
            style={{ width: "100%", background: B_INDIGO, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Submit Story</button>
          <button onClick={() => setStoryModal(false)}
            style={{ width: "100%", background: "transparent", color: "#8888a0", border: "1px solid #e0e0e8", borderRadius: 10, padding: "11px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
        </div>
      </DrawerShell>

      {/* PE Volunteers to Nudge Drawer */}
      <DrawerShell open={nudgeDrawer} onClose={() => setNudgeDrawer(false)} title="Volunteers to Nudge" accentTag="ProEngage">
        <div style={{ padding: "28px" }}>
          <div style={{ background: P_INDIGO, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: B_INDIGO, lineHeight: 1.6, marginBottom: 20 }}>
            Nudges are sent by Admin/AI. You can contact volunteers directly using the details below.
          </div>
          {AT_RISK_VOLUNTEERS.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", fontSize: 13, color: "#aaaabc" }}>No at-risk volunteers right now.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {AT_RISK_VOLUNTEERS.map((v, i) => (
                <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < AT_RISK_VOLUNTEERS.length - 1 ? "1px solid #f0f0f8" : "none" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <RiskDot severity={v.severity} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{v.name}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#6b6b7a", marginTop: 2 }}>{v.project} · {v.reason}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: v.nudged ? P_TEAL : P_YELLOW, color: v.nudged ? B_TEAL : "#9a6500", flexShrink: 0 }}>
                    {v.nudged ? "✓ Nudged" : "Pending nudge"}
                  </span>
                  <button onClick={() => { setNudgeContact(v); setNudgeDrawer(false); }}
                    style={{ fontSize: 11, fontWeight: 600, color: B_INDIGO, background: P_SPOC, border: "1px solid #c8c6f0", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>
                    Contact →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerShell>

      {/* TVW Registration Modal — volunteer section */}
      <DrawerShell open={!!tvwRegModal} onClose={() => setTvwRegModal(null)} title="Confirm Registration" subtitle={tvwRegModal?.title ?? ""} accentTag="TVW 22">
        {tvwRegModal && (
          <div style={{ padding: "28px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}><span style={{ color: "#8888a0" }}>Event</span><span style={{ fontWeight: 600, color: ACCENT_NAVY }}>{tvwRegModal.title}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}><span style={{ color: "#8888a0" }}>Date</span><span style={{ fontWeight: 600, color: ACCENT_NAVY }}>{tvwRegModal.date}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}><span style={{ color: "#8888a0" }}>Mode</span><span style={{ fontWeight: 600, color: ACCENT_NAVY }}>{tvwRegModal.mode}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}><span style={{ color: "#8888a0" }}>Venue</span><span style={{ fontWeight: 600, color: ACCENT_NAVY }}>{tvwRegModal.venue ?? tvwRegModal.company}</span></div>
            </div>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "14px 16px", fontSize: 13, color: "#166534", lineHeight: 1.65, marginBottom: 28 }}>
              You'll receive a confirmation email within 24 hours. Your spot is reserved until 48 hours before the event.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { triggerToast("Registered! Confirmation email sent to rohan.desai@tcs.com"); setTvwRegModal(null); }} style={{ flex: 1, background: B_INDIGO, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Confirm Registration</button>
              <button onClick={() => setTvwRegModal(null)} style={{ flex: 1, background: "transparent", color: "#8888a0", border: "1px solid #e0e0e8", borderRadius: 10, padding: "11px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
            </div>
          </div>
        )}
      </DrawerShell>
    </div>
  );
}
