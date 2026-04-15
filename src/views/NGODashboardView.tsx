import React, { useState, useEffect, useRef } from "react";
import {
  X, ChevronRight, User, Users, Mail, Search, MapPin, Clock,
  Check, Sparkles, MessageSquare, Plus, Edit2, Trash2,
  AlertTriangle, Download, CheckCircle2, FileText, Archive,
  BarChart3, Shield, BookOpen, HelpCircle, Inbox, Copy,
  ArrowRight, Star, ChevronDown, ChevronUp, ExternalLink,
  Bell, Share2, UserPlus, Award, Briefcase, TrendingUp,
} from "lucide-react";
import { MOCK_APPLICANTS, ANJALI_MEHTA } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";

// ─── Brand tokens ────────────────────────────────────────────────────────────
const B_ORANGE    = "#C14D00";
const B_INDIGO    = "#333399";
const B_TEAL      = "#00A896";
const B_RED       = "#E8401C";
const B_BLUE      = "#1E6BB8";
const B_YELLOW    = "#F5A623";
const ACCENT_NAVY = "#0D1B3E";
const P_ORANGE    = "#FFF0E6";
const P_TEAL      = "#E6F8F5";
const P_INDIGO    = "#EEF0FF";
const P_RED       = "#FFF0EE";
const P_BLUE      = "#EBF4FF";
const P_YELLOW    = "#FEF6E4";

const NOTIFICATIONS: Record<string, boolean> = {
  applications: true,
  activities: false,
  feedback: true,
};

const notifDot: React.CSSProperties = { position: "absolute", top: -3, right: -6, width: 6, height: 6, borderRadius: "50%", background: "#E8401C", border: "2px solid white" };

// ─── DrawerShell — centred modal (matches Volunteer/SPOC dashboards) ──────────
function DrawerShell({
  open, onClose, title, subtitle, accentTag, width = 560, children,
}: {
  open: boolean; onClose: () => void; title: string;
  subtitle?: string; accentTag?: string; width?: number; children: React.ReactNode;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(13,27,62,0.45)", zIndex: 200, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.22s", backdropFilter: "blur(2px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: open ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -48%) scale(0.97)", transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", width, maxWidth: "calc(100vw - 40px)", maxHeight: "calc(100vh - 80px)", background: "#fff", borderRadius: 16, zIndex: 201, boxShadow: "0 24px 64px rgba(13,27,62,0.22)", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", overflowY: "auto" }}>
        <div style={{ background: ACCENT_NAVY, padding: "24px 28px", borderRadius: "16px 16px 0 0", flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 7, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500, padding: "5px 12px", cursor: "pointer", marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>← Close</button>
          {accentTag && <div style={{ display: "inline-block", background: `${B_ORANGE}22`, border: `1px solid ${B_ORANGE}44`, borderRadius: 100, padding: "3px 10px", fontSize: 10.5, fontWeight: 700, color: B_ORANGE, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 10 }}>{accentTag}</div>}
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", marginTop: 5 }}>{subtitle}</div>}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>{children}</div>
      </div>
    </>
  );
}

// ─── Field helpers ────────────────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return <div style={{ fontSize: 10.5, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{children}{required && <span style={{ color: B_RED, marginLeft: 3 }}>*</span>}</div>;
}
function FInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange?: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} placeholder={placeholder} onChange={e => onChange?.(e.target.value)} style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = B_ORANGE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />;
}
function FSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", background: "#fff", appearance: "none", cursor: "pointer", boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = B_ORANGE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")}>{options.map(o => <option key={o}>{o}</option>)}</select>;
}

// ─── AI Enhance button + textarea ─────────────────────────────────────────────
// Shows a sparkle button beside the label. On click: fakes an API call, shows
// a shimmer, then replaces the textarea value with an "enhanced" version.
function AITextarea({
  value, onChange, placeholder, rows = 3, minScore, label,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
  minScore?: number; // 0-100, shown as quality bar if provided
  label?: string;
}) {
  const [enhancing, setEnhancing] = useState(false);
  const [enhanced, setEnhanced] = useState(false);

  const enhancements: Record<string, string> = {
    background: "This project addresses a critical gap in financial literacy among women in rural Maharashtra. Pratham Foundation will work with 500 beneficiaries across five villages to deliver structured learning sessions covering savings, credit access, and micro-loan management. Volunteers will be embedded within existing community groups to ensure culturally appropriate delivery.",
    deliverables: "1. A 6-module financial literacy curriculum (PDF + print-ready format) adapted for low-literacy audiences.\n2. A pre- and post-assessment toolkit to measure participant knowledge gain.\n3. A final impact report summarising reach, learner outcomes, and recommendations for scale.",
    expectedLearning: "Volunteers will develop practical skills in needs-based curriculum design, community facilitation, and cross-cultural communication. They will gain firsthand exposure to grassroots development challenges and build empathy-led problem-solving capability directly applicable to corporate strategy and social impact roles.",
    volunteerProfile: "Finance, HR, or Education professionals with 3+ years of experience. Strong written communication skills and comfort with simplified explanations. Prior NGO or community volunteering experience preferred but not required. Openness to remote collaboration with field coordinators.",
  };

  const doEnhance = () => {
    if (!value.trim()) return;
    setEnhancing(true);
    setEnhanced(false);
    setTimeout(() => {
      const key = label?.toLowerCase() ?? "";
      const matched = Object.keys(enhancements).find(k => key.includes(k));
      const improved = matched ? enhancements[matched] : value + "\n\n[Enhanced: This section has been refined for clarity, specificity, and alignment with ProEngage quality standards. Outcome metrics and volunteer expectations have been made more concrete.]";
      onChange(improved);
      setEnhancing(false);
      setEnhanced(true);
      setTimeout(() => setEnhanced(false), 3000);
    }, 1400);
  };

  const score = minScore ?? Math.min(100, Math.max(0, Math.round((value.length / 3))));
  const scoreColor = score >= 70 ? B_TEAL : score >= 40 ? B_YELLOW : B_RED;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        {label && <Label>{label}</Label>}
        <button onClick={doEnhance} disabled={enhancing || !value.trim()}
          style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: enhancing ? "#aaaabc" : enhanced ? B_TEAL : B_INDIGO, background: enhanced ? P_TEAL : P_INDIGO, border: `1px solid ${enhanced ? B_TEAL : B_INDIGO}30`, borderRadius: 7, padding: "4px 10px", cursor: enhancing || !value.trim() ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", whiteSpace: "nowrap" }}>
          {enhancing ? (
            <><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", border: `2px solid ${B_INDIGO}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} /> Enhancing…</>
          ) : enhanced ? (
            <><Check size={12} /> Enhanced</>
          ) : (
            <><Sparkles size={12} /> AI Enhance</>
          )}
        </button>
      </div>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width: "100%", border: `1.5px solid ${enhanced ? B_TEAL : "#e0e0e8"}`, borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", resize: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={e => (e.target.style.borderColor = B_ORANGE)} onBlur={e => (e.target.style.borderColor = enhanced ? B_TEAL : "#e0e0e8")} />
      {value.length > 0 && (
        <div style={{ marginTop: 5, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 4, background: "#e8e8f0", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${score}%`, background: scoreColor, borderRadius: 2, transition: "width 0.3s, background 0.3s" }} />
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: scoreColor, minWidth: 60 }}>
            {score >= 70 ? "Good quality" : score >= 40 ? "Needs more detail" : "Too brief"}
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function Badge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    Approved:    [P_TEAL,    "#0F6E56"],
    Active:      [P_TEAL,    "#0F6E56"],
    Live:        [P_TEAL,    "#0F6E56"],
    Matched:     [P_TEAL,    "#0F6E56"],
    Submitted:   [P_TEAL,    "#0F6E56"],
    Completed:   ["#f0f0f4", "#888"],
    Closed:      ["#f0f0f4", "#888"],
    Draft:       ["#f0f0f4", "#888"],
    "Under Review": [P_YELLOW, "#9a6500"],
    Pending:     [P_YELLOW,  "#9a6500"],
    Rejected:    [P_RED,     "#c0392b"],
    Inactive:    ["#f0f0f4", "#888"],
    Fulfilled:   ["#f0f0f4", "#888"],
    "Not initiated": [P_RED, "#c0392b"],
  };
  const [bg, color] = map[status] ?? ["#f0f0f4", "#666"];
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 100, whiteSpace: "nowrap" }}>{status}</span>;
}

// ─── Stat tile ────────────────────────────────────────────────────────────────
function StatTile({ num, label, bg, color }: { num: string | number; label: string; bg: string; color: string }) {
  return (
    <div style={{ background: bg, borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 24, fontWeight: 700, color, letterSpacing: "-1px" }}>{num}</div>
      <div style={{ fontSize: 11, color: "#6b6b7a", marginTop: 3 }}>{label}</div>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 4 }}>{eyebrow}</div>
      <div style={{ fontSize: 20, fontWeight: 900, color: ACCENT_NAVY }}>{title}</div>
    </div>
  );
}

// ─── Resource photo card (matches Volunteer/SPOC pattern exactly) ─────────────
function ResourceCard({ label, desc, count, photo, accent, pastel, onClick }: { label: string; desc: string; count?: string; photo: string; accent: string; pastel: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
      style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, overflow: "hidden", cursor: "pointer", transform: hov ? "translateY(-3px)" : "translateY(0)", boxShadow: hov ? `0 8px 24px ${accent}18` : "none", transition: "transform 0.18s, box-shadow 0.18s" }}>
      <div style={{ height: 90, background: `url(${photo}) center/cover`, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: `${accent}88` }} />
      </div>
      <div style={{ background: pastel, padding: "12px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: ACCENT_NAVY, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 11, color: "#6b6b7a", lineHeight: 1.4, marginBottom: count ? 6 : 0 }}>{desc}</div>
        {count && <div style={{ fontSize: 10.5, fontWeight: 700, color: accent }}>{count}</div>}
      </div>
    </div>
  );
}

// ─── Clone project modal ──────────────────────────────────────────────────────
function CloneProjectModal({ projects, onSelect, onClose }: { projects: any[]; onSelect: (p: any) => void; onClose: () => void }) {
  return (
    <div>
      <div style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}22`, borderRadius: 10, padding: "12px 14px", marginBottom: 18, fontSize: 12.5, color: B_INDIGO, lineHeight: 1.5 }}>
        Select a past project to use as a template. You'll be able to edit all fields — remember to update the outcome and impact sections for this new edition.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {projects.filter((p: any) => ["Active","Closed","Under Review"].includes(p.status)).map((p: any) => (
          <div key={p.id} onClick={() => onSelect(p)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = B_ORANGE; e.currentTarget.style.background = P_ORANGE; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e8f0"; e.currentTarget.style.background = "#f8f9ff"; }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{p.title}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{p.volunteers ?? 0} volunteers matched</div>
            </div>
            <Badge status={p.status} />
            <Copy size={13} color="#aaa" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Add / Edit Project form ──────────────────────────────────────────────────
function AddProjectForm({ clonedFrom, onClose, onSubmit }: { clonedFrom?: any; onClose: () => void; onSubmit: () => void }) {
  const [form, setForm] = useState({
    hostOrg:          clonedFrom?.hostOrg ?? "Pratham Foundation",
    areaOfWork:       clonedFrom?.areaOfWork ?? "Education",
    deliveryType:     clonedFrom?.deliveryType ?? "Hybrid",
    background:       clonedFrom ? "Update this section with outcomes from the new edition." : "",
    deliverables:     clonedFrom ? "Update deliverables for the new project scope." : "",
    expectedLearning: clonedFrom ? "Describe what volunteers will gain in this edition." : "",
    volunteerProfile: clonedFrom?.volunteerProfile ?? "",
    location:         clonedFrom?.location ?? "Mumbai",
    duration:         clonedFrom?.duration ?? "3 months",
    volunteersRequired: String(clonedFrom?.volunteers ?? 5),
    undertaking: false,
  });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      {clonedFrom && (
        <div style={{ background: P_YELLOW, border: `1px solid ${B_YELLOW}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 12.5, color: "#7c5500", display: "flex", gap: 8 }}>
          <Sparkles size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          Cloned from <strong>"{clonedFrom.title}"</strong>. Fields are pre-filled — update outcomes, deliverables and impact for this edition before submitting.
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: "60vh", overflowY: "auto", paddingRight: 4 }}>
        <div>
          <Label required>Host Organisation</Label>
          <FInput value={form.hostOrg} onChange={v => set("hostOrg", v)} placeholder="e.g. Pratham Foundation" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <Label required>Area of Work</Label>
            <FSelect value={form.areaOfWork} onChange={v => set("areaOfWork", v)} options={["Education","Health","Environment","Livelihoods","Technology","Finance","Gender Equality","Others"]} />
          </div>
          <div>
            <Label required>Type of Delivery</Label>
            <FSelect value={form.deliveryType} onChange={v => set("deliveryType", v)} options={["Remote","In-Person","Hybrid"]} />
          </div>
          <div>
            <Label required>Location</Label>
            <FInput value={form.location} onChange={v => set("location", v)} />
          </div>
          <div>
            <Label required>Duration</Label>
            <FInput value={form.duration} onChange={v => set("duration", v)} placeholder="e.g. 3 months" />
          </div>
          <div>
            <Label required>Volunteers Required</Label>
            <FInput value={form.volunteersRequired} onChange={v => set("volunteersRequired", v)} type="number" />
          </div>
        </div>
        <AITextarea label="Project Background" value={form.background} onChange={v => set("background", v)} placeholder="Describe the project context, community need and what Pratham Foundation is doing to address it…" rows={4} />
        <AITextarea label="Deliverables *" value={form.deliverables} onChange={v => set("deliverables", v)} placeholder="What will volunteers produce or accomplish? Be specific — deliverables directly impact quality score." rows={3} />
        <AITextarea label="Expected Learning for Volunteer *" value={form.expectedLearning} onChange={v => set("expectedLearning", v)} placeholder="What skills or perspectives will volunteers gain? Specific outcomes attract higher-quality applicants." rows={3} />
        <AITextarea label="Ideal Volunteer Profile" value={form.volunteerProfile} onChange={v => set("volunteerProfile", v)} placeholder="e.g. Finance professional, 3+ years experience, comfortable facilitating group sessions" rows={2} />

        {/* Quality score summary */}
        <div style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>🤖 AI Quality Score</div>
          {(() => {
            const total = [form.background, form.deliverables, form.expectedLearning, form.volunteerProfile].reduce((s, v) => s + Math.min(25, Math.round(v.length / 4)), 0);
            const pct = Math.min(100, total);
            const color = pct >= 70 ? B_TEAL : pct >= 40 ? B_YELLOW : B_RED;
            const label = pct >= 70 ? "Good — ready to submit" : pct >= 40 ? "Needs more detail in key sections" : "Too thin — expand deliverables and expected learning";
            return (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ flex: 1, height: 8, background: "#e8e8f0", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.4s" }} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, color, minWidth: 40 }}>{pct}</div>
                </div>
                <div style={{ fontSize: 12, color: "#6b6b7a" }}>{label}. Score is only visible to you — Admin sees a separate completeness check.</div>
              </>
            );
          })()}
        </div>

        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#555", cursor: "pointer" }}>
          <input type="checkbox" checked={form.undertaking} onChange={e => set("undertaking", e.target.checked)} style={{ accentColor: B_ORANGE, marginTop: 2 }} />
          I confirm the information is accurate and agree to the Tata ProEngage programme undertaking.
        </label>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0f0f8" }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f8f8fc", border: "1px solid #e0e0e8", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
        <button onClick={onSubmit} style={{ flex: 1, padding: "10px", background: B_ORANGE, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Submit for Review</button>
      </div>
    </div>
  );
}

// ─── Feedback form ────────────────────────────────────────────────────────────
function FeedbackForm({ project, onClose, onSubmit }: { project: any; onClose: () => void; onSubmit: () => void }) {
  const [status, setStatus] = useState("Completed");
  const [costSaving, setCostSaving] = useState("");
  const [ratings, setRatings] = useState([0, 0]);
  const [testimonial, setTestimonial] = useState("");
  const StarRow = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div style={{ fontSize: 13, color: "#555", flex: 1 }}>{label}</div>
      <div style={{ display: "flex", gap: 3 }}>{[1,2,3,4,5].map(i => <span key={i} onClick={() => onChange(i)} style={{ fontSize: 18, cursor: "pointer", color: i <= value ? B_ORANGE : "#ddd" }}>★</span>)}</div>
    </div>
  );
  return (
    <div>
      <div style={{ background: P_YELLOW, border: `1px solid ${B_YELLOW}44`, borderRadius: 9, padding: "10px 14px", marginBottom: 16, fontSize: 12.5, color: "#7c5500" }}>
        Feedback is mandatory for certificate generation. Both volunteer and NGO must submit before TSG Admin triggers certificates.
      </div>
      <div style={{ marginBottom: 14 }}>
        <Label>Q1 — Completion status</Label>
        <div style={{ display: "flex", gap: 16 }}>
          {["Completed","Not Completed"].map(o => (
            <label key={o} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, cursor: "pointer", color: ACCENT_NAVY, fontFamily: "'DM Sans', sans-serif" }}>
              <input type="radio" checked={status === o} onChange={() => setStatus(o)} style={{ accentColor: B_ORANGE }} />{o}
            </label>
          ))}
        </div>
      </div>
      {status === "Completed" && (
        <>
          <div style={{ marginBottom: 14 }}>
            <Label>Q2 — Estimated cost saving (INR)</Label>
            <FInput value={costSaving} onChange={setCostSaving} type="number" placeholder="e.g. 50000" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <Label>Q3 — Rate PE team support</Label>
            <div style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 9, padding: "12px 14px" }}>
              <StarRow value={ratings[0]} onChange={v => setRatings(r => { const a = [...r]; a[0] = v; return a; })} label="Team was accessible and responsive" />
              <StarRow value={ratings[1]} onChange={v => setRatings(r => { const a = [...r]; a[1] = v; return a; })} label="Queries were resolved effectively" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Label>Q4 — Testimonial (optional)</Label>
            <textarea value={testimonial} onChange={e => setTestimonial(e.target.value)} placeholder="Share your experience with this volunteer…" rows={4}
              style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", resize: "none", boxSizing: "border-box" }} />
            <div style={{ fontSize: 11, color: "#aaaabc", marginTop: 4 }}>Testimonials go to Admin moderation before being published.</div>
          </div>
          <div style={{ fontSize: 11.5, color: "#888", marginBottom: 12 }}>For large NGOs with many projects, bulk upload via Excel template is available — contact TSG Admin.</div>
        </>
      )}
      {status === "Not Completed" && (
        <div style={{ marginBottom: 16 }}>
          <Label>Q2 — Reason for non-completion</Label>
          {["Volunteer withdrew from project","Project scope changed significantly","Scheduling/availability conflict"].map(opt => (
            <label key={opt} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", color: ACCENT_NAVY, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
              <input type="radio" name="reason" style={{ accentColor: B_ORANGE }} />{opt}
            </label>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f8f8fc", border: "1px solid #e0e0e8", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
        <button onClick={onSubmit} style={{ flex: 1, padding: "10px", background: B_ORANGE, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Submit Feedback</button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const NGODashboardView = () => {
  const { setActiveProject, setClonedProject, ngoData, triggerToast, setShowOrientationModal, setShowSupportModal } = useAppContext();
  const navigate = useAppNavigate();

  // Section refs + scroll tracking
  const snapshotRef    = useRef<HTMLDivElement>(null);
  const activitiesRef  = useRef<HTMLDivElement>(null);
  const applicationsRef = useRef<HTMLDivElement>(null);
  const historyRef     = useRef<HTMLDivElement>(null);
  const partnerRef     = useRef<HTMLDivElement>(null);
  const reportsRef     = useRef<HTMLDivElement>(null);
  const resourcesRef   = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("snapshot");

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) { if (e.isIntersecting) setActiveSection(e.target.id); }
    }, { threshold: 0.25 });
    [snapshotRef, activitiesRef, applicationsRef, historyRef, partnerRef, reportsRef, resourcesRef]
      .forEach(r => r.current && obs.observe(r.current));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const projects = ngoData.projects ?? ANJALI_MEHTA.projects;
  const isLeadPartner = (ngoData.tier ?? ANJALI_MEHTA.tier) === "Lead Partner";
  const partnerNGOs = isLeadPartner ? (ngoData.partnerNGOs ?? ANJALI_MEHTA.partnerNGOs ?? []) : [];

  // Applicant state
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [appTab, setAppTab] = useState<"shortlist" | "all">("shortlist");
  const [auditLog, setAuditLog] = useState<any[]>([]);

  // Coordinators
  const [coordinators, setCoordinators] = useState(ngoData.coordinators ?? ANJALI_MEHTA.coordinators);

  // History
  const [historyTab, setHistoryTab] = useState<"projects" | "volunteers" | "feedback">("projects");
  // Drill-down within History → projects
  const [drillEdition, setDrillEdition] = useState<string | null>(null);
  const [drillProject, setDrillProject] = useState<any | null>(null);

  // Modals
  type ModalKey = null | "addProject" | "cloneProject" | "viewProjects" | "reviewApps" | "feedback" | "healthUpdate" | "manageTeam" | "selectedApplicant" | "grievance" | "projectGuide" | "referNGO" | "shareStory";
  const [modal, setModal] = useState<ModalKey>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [feedbackProject, setFeedbackProject] = useState<any>(null);
  const [clonedFrom, setClonedFrom] = useState<any>(null);
  const [grievanceForm, setGrievanceForm] = useState({ projectId: "", category: "", description: "" });
  const [submittedGrievances, setSubmittedGrievances] = useState<any[]>([]);

  // Partner NGO expand
  const [expandedPartner, setExpandedPartner] = useState<number | null>(null);

  // Notification bell
  const [notifOpen, setNotifOpen] = useState(false);

  // Snapshot popouts
  const [snapPopout, setSnapPopout] = useState<null | "skills" | "badges" | "social">(null);

  // Stats
  const activeProjects  = projects.filter((p: any) => p.status === "Active").length;
  const totalVols       = projects.filter((p: any) => ["Active","Closed"].includes(p.status)).reduce((s: number, p: any) => s + (p.volunteers ?? 0), 0);
  const completedVols   = projects.filter((p: any) => p.status === "Closed").reduce((s: number, p: any) => s + (p.volunteers ?? 0), 0);
  const pendingApps     = ngoData.pendingApplications ?? 8;

  // Applicant helpers
  const shortlisted = [...applicants].filter(a => a.status === "Pending").sort((a, b) => b.matchPercentage - a.matchPercentage);
  const filtered    = applicants.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())));

  const handleAccept = (id: number) => {
    const a = applicants.find(x => x.id === id);
    setApplicants(prev => prev.map(x => x.id === id ? { ...x, status: "Matched" } : x));
    setAuditLog(prev => [{ id: Date.now(), action: "Accepted", volunteer: a?.name ?? "", date: new Date().toLocaleString() }, ...prev]);
    triggerToast(`Accepted ${a?.name}. Confirmation email sent.`);
    setModal(null);
  };
  const handleReject = (id: number) => {
    const a = applicants.find(x => x.id === id);
    setApplicants(prev => prev.map(x => x.id === id ? { ...x, status: "Rejected" } : x));
    triggerToast(`${a?.name} rejected. They can apply to other projects.`);
    setModal(null);
  };

  // Styles
  const card: React.CSSProperties = { background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "20px 22px", marginBottom: 20 };
  const railLink = (active: boolean): React.CSSProperties => ({
    display: "block", fontSize: 12, fontWeight: active ? 700 : 500,
    color: active ? B_ORANGE : "#6b6b7a", padding: "7px 0",
    borderBottom: "1px solid #f0f0f8", cursor: "pointer",
    lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  });
  const tabBtn = (active: boolean): React.CSSProperties => ({
    fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? B_ORANGE : "#6b6b7a",
    background: active ? P_ORANGE : "transparent", border: active ? `1px solid ${B_ORANGE}40` : "1px solid transparent",
    borderRadius: 7, padding: "5px 13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  });

  return (
    <div style={{ background: "#f8f9ff", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingTop: 80, paddingBottom: 80 }}>

      {/* Identity banner */}
      <div style={{ background: ACCENT_NAVY, padding: "20px 48px 18px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: B_ORANGE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0, border: "2px solid rgba(255,255,255,0.2)" }}>AM</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{ngoData.organization ?? "Pratham Foundation"}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Lead Partner · Education · Mumbai, India</div>
        </div>
        <span style={{ background: P_ORANGE, color: B_ORANGE, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, border: `1px solid ${B_ORANGE}40` }}>{ngoData.tier ?? "Lead Partner"}</span>
        {/* Notification bell */}
        <button
          onClick={() => setNotifOpen(v => !v)}
          style={{ position: "relative", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Bell size={17} color="rgba(255,255,255,0.85)" />
          <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: B_RED, border: "2px solid #0D1B3E" }} />
        </button>
      </div>

      {/* Notification popout */}
      {notifOpen && (
        <div style={{ position: "fixed", top: 130, right: 48, width: 320, background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, boxShadow: "0 12px 40px rgba(13,27,62,0.15)", zIndex: 300, fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
          <div style={{ background: ACCENT_NAVY, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Notifications</div>
            <button onClick={() => setNotifOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: 2, lineHeight: 1 }}>✕</button>
          </div>
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {[
              { icon: "📋", text: "8 new volunteer applications need review", time: "2h ago", dot: true },
              { icon: "⏰", text: "Feedback due in 1 day — Financial Literacy Project", time: "5h ago", dot: true },
              { icon: "✅", text: "Project 'Digital Skills for Youth' approved by Admin", time: "Yesterday" },
              { icon: "👤", text: "New co-ordinator request from Riya Nair", time: "2 days ago" },
            ].map((n, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f0f0f8", cursor: "pointer", background: n.dot ? "#fdfbff" : "#fff" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8f9ff")}
                onMouseLeave={e => (e.currentTarget.style.background = n.dot ? "#fdfbff" : "#fff")}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, color: ACCENT_NAVY, lineHeight: 1.4, fontWeight: n.dot ? 600 : 400 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: "#aaaabc", marginTop: 3 }}>{n.time}</div>
                </div>
                {n.dot && <span style={{ width: 7, height: 7, borderRadius: "50%", background: B_ORANGE, flexShrink: 0, marginTop: 5 }} />}
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 16px", borderTop: "1px solid #f0f0f8", textAlign: "center" }}>
            <button onClick={() => setNotifOpen(false)} style={{ fontSize: 12, fontWeight: 700, color: B_ORANGE, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>View all</button>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 48px 0", display: "grid", gridTemplateColumns: "1fr 148px", gap: 24, alignItems: "start" }}>

        {/* ── MAIN SCROLL ── */}
        <div>

          {/* ─── I. Impact Snapshot ─── */}
          <div id="snapshot" ref={snapshotRef} style={card}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 4 }}>I · Impact Snapshot</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 10 }}>
              <StatTile num={activeProjects} label="Active projects"     bg="#FFF4EC" color="#B45309" />
              <StatTile num={totalVols}      label="Volunteers engaged"  bg={P_TEAL}  color={B_TEAL}  />
              <StatTile num={completedVols}  label="Completed"           bg={P_TEAL}  color={B_TEAL}  />
              <StatTile num={pendingApps}    label="Pending reviews"     bg="#EEEDFE" color="#3C3489" />
            </div>
            {/* Row 2: Skills, Badges, Social — each clickable for popout */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              {/* Skills Utilised */}
              <div onClick={() => setSnapPopout(snapPopout === "skills" ? null : "skills")}
                style={{ background: P_BLUE, borderRadius: 10, padding: "12px 14px", cursor: "pointer", border: `1.5px solid ${snapPopout === "skills" ? B_BLUE : "transparent"}`, transition: "border-color 0.15s", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Briefcase size={13} color={B_BLUE} />
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6b6b7a", textTransform: "uppercase", letterSpacing: "0.6px" }}>Skills Utilised</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {["Finance","Education","IT","HR"].map(s => (
                    <span key={s} style={{ fontSize: 10.5, fontWeight: 600, background: "#fff", color: B_BLUE, border: `1px solid ${B_BLUE}30`, borderRadius: 100, padding: "2px 7px" }}>{s}</span>
                  ))}
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: "#888", padding: "2px 4px" }}>+3 more</span>
                </div>
                <div style={{ fontSize: 10, color: B_BLUE, fontWeight: 600, marginTop: 6 }}>View all →</div>
              </div>

              {/* Badges Earned */}
              <div onClick={() => setSnapPopout(snapPopout === "badges" ? null : "badges")}
                style={{ background: P_YELLOW, borderRadius: 10, padding: "12px 14px", cursor: "pointer", border: `1.5px solid ${snapPopout === "badges" ? B_YELLOW : "transparent"}`, transition: "border-color 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Award size={13} color="#9a6500" />
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6b6b7a", textTransform: "uppercase", letterSpacing: "0.6px" }}>Badges Earned</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["🏅","🌟","🤝","🌱"].map((b, i) => (
                    <span key={i} style={{ fontSize: 20, lineHeight: 1 }}>{b}</span>
                  ))}
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#9a6500", letterSpacing: "-1px", marginTop: 4 }}>4</div>
                <div style={{ fontSize: 10, color: "#9a6500", fontWeight: 600 }}>View all →</div>
              </div>

              {/* Social Media Contribution */}
              <div onClick={() => setSnapPopout(snapPopout === "social" ? null : "social")}
                style={{ background: "#f0f4ff", borderRadius: 10, padding: "12px 14px", cursor: "pointer", border: `1.5px solid ${snapPopout === "social" ? B_INDIGO : "transparent"}`, transition: "border-color 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <TrendingUp size={13} color={B_INDIGO} />
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6b6b7a", textTransform: "uppercase", letterSpacing: "0.6px" }}>Social Contribution</div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: B_INDIGO, letterSpacing: "-1px" }}>12</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>posts · 3.4k reach</div>
                <div style={{ fontSize: 10, color: B_INDIGO, fontWeight: 600, marginTop: 4 }}>View breakdown →</div>
              </div>
            </div>

            {/* Snapshot popout panels */}
            {snapPopout === "skills" && (
              <div style={{ background: "#f8f9ff", border: `1.5px solid ${B_BLUE}30`, borderRadius: 10, padding: "16px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: ACCENT_NAVY }}>Skills Utilised This Edition</div>
                  <button onClick={() => setSnapPopout(null)} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>✕</button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    { skill: "Finance & Accounting", count: 14 },
                    { skill: "Education & Training", count: 22 },
                    { skill: "IT / Technology", count: 9 },
                    { skill: "Human Resources", count: 7 },
                    { skill: "Communications", count: 11 },
                    { skill: "Project Management", count: 5 },
                    { skill: "Legal & Compliance", count: 3 },
                  ].map(s => (
                    <div key={s.skill} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${B_BLUE}25`, borderRadius: 8, padding: "8px 12px", minWidth: 180 }}>
                      <div style={{ flex: 1, fontSize: 12.5, color: ACCENT_NAVY, fontWeight: 500 }}>{s.skill}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: B_BLUE }}>{s.count} vols</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {snapPopout === "badges" && (
              <div style={{ background: "#fffbee", border: `1.5px solid ${B_YELLOW}40`, borderRadius: 10, padding: "16px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: ACCENT_NAVY }}>Badges Earned by Pratham Foundation</div>
                  <button onClick={() => setSnapPopout(null)} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>✕</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { icon: "🏅", name: "ProEngage Partner", desc: "Completed 5+ matched projects", earned: "Jan 2026" },
                    { icon: "🌟", name: "5-Star NGO", desc: "Consistently high volunteer ratings", earned: "Dec 2025" },
                    { icon: "🤝", name: "Community Champion", desc: "10+ editions of TVW engagement", earned: "Nov 2025" },
                    { icon: "🌱", name: "Impact Pathfinder", desc: "First edition with 100% feedback submitted", earned: "Oct 2025" },
                  ].map(b => (
                    <div key={b.name} style={{ display: "flex", gap: 10, background: "#fff", border: "1px solid #f5d48a", borderRadius: 8, padding: "10px 12px" }}>
                      <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1, marginTop: 2 }}>{b.icon}</span>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: ACCENT_NAVY }}>{b.name}</div>
                        <div style={{ fontSize: 11, color: "#888", lineHeight: 1.4, marginTop: 2 }}>{b.desc}</div>
                        <div style={{ fontSize: 10, color: "#9a6500", fontWeight: 600, marginTop: 4 }}>Earned {b.earned}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {snapPopout === "social" && (
              <div style={{ background: "#f0f4ff", border: `1.5px solid ${B_INDIGO}25`, borderRadius: 10, padding: "16px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: ACCENT_NAVY }}>Social Media Contribution</div>
                  <button onClick={() => setSnapPopout(null)} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>✕</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
                  {[
                    { label: "Total Posts", value: "12", color: B_INDIGO },
                    { label: "Est. Reach", value: "3,400", color: B_INDIGO },
                    { label: "Shares", value: "47", color: B_INDIGO },
                  ].map(s => (
                    <div key={s.label} style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", textAlign: "center", border: `1px solid ${B_INDIGO}20` }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: s.color, letterSpacing: "-0.5px" }}>{s.value}</div>
                      <div style={{ fontSize: 10.5, color: "#6b6b7a", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    { platform: "LinkedIn", posts: 7, reach: "2,100" },
                    { platform: "Twitter / X", posts: 3, reach: "900" },
                    { platform: "Facebook", posts: 2, reach: "400" },
                  ].map(p => (
                    <div key={p.platform} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 7, padding: "8px 12px" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: ACCENT_NAVY, flex: 1 }}>{p.platform}</div>
                      <div style={{ fontSize: 11.5, color: "#555" }}>{p.posts} posts</div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: B_INDIGO }}>{p.reach} reach</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback reminders */}
            {projects
              .filter((p: any) => { if (p.status !== "Active" || !p.endDate) return false; const d = (new Date(p.endDate).getTime() - Date.now()) / 86400000; return d <= 3 && d >= -1; })
              .map((p: any) => {
                const days = Math.ceil((new Date(p.endDate).getTime() - Date.now()) / 86400000);
                return (
                  <div key={p.id} style={{ background: P_YELLOW, border: "1px solid #f5d48a", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <Clock size={16} color="#9a6500" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 13, color: "#7c5500", lineHeight: 1.5 }}>
                      <strong>Feedback due {days <= 0 ? "today" : `in ${days} day${days !== 1 ? "s" : ""}`}</strong> — "{p.title}" · Complete to trigger volunteer certificates.
                    </div>
                    <button onClick={() => { setActiveProject(p); setFeedbackProject(p); setModal("feedback"); }}
                      style={{ background: "#9a6500", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                      Complete Feedback
                    </button>
                  </div>
                );
              })
            }

            {/* M&E health tiles inline */}
            {projects.filter((p: any) => p.status === "Active" && p.healthUpdates).map((p: any) => {
              const hasRisk = p.healthUpdates.some((h: any) => ["At Risk","Drop Out"].includes(h.status));
              return (
                <div key={p.id} style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: ACCENT_NAVY, flex: 1 }}>{p.title}</div>
                    {hasRisk && <span style={{ background: P_RED, color: B_RED, fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 100, display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={10} /> Flagged</span>}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {p.healthUpdates.map((h: any, i: number) => {
                      const bg    = h.status === "Healthy" ? "#E6F8F5" : h.status === "At Risk" ? P_RED : h.status === "Drop Out" ? P_ORANGE : "#f0f0f4";
                      const color = h.status === "Healthy" ? "#0F6E56" : h.status === "At Risk" ? B_RED : h.status === "Drop Out" ? B_ORANGE : "#888";
                      return (
                        <div key={i} style={{ background: bg, borderRadius: 7, padding: "6px 10px", minWidth: 78 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#888", marginBottom: 2 }}>{h.month}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color }}>{h.status === "Pending" ? "Awaiting" : h.status}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 11, color: "#aaaabc", marginTop: 6, fontStyle: "italic" }}>Health updates are submitted by TSG sub-admin after offline check-in calls. Read-only for NGO.</div>
                </div>
              );
            })}
          </div>

          {/* ─── II. Activities & Actions ─── */}
          <div id="activities" ref={activitiesRef} style={card}>
            <SectionHeading eyebrow="II · Activities & Actions" title="What do you need to do?" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              {/* Add project */}
              <button onClick={() => { setClonedFrom(null); setModal("addProject"); }}
                style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "14px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", gap: 6 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = B_ORANGE)} onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8f0")}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Plus size={15} color={B_ORANGE} /><span style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY }}>Add project</span></div>
                <div style={{ fontSize: 11.5, color: "#888", lineHeight: 1.4 }}>Full project form with AI quality scoring</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: B_ORANGE }}>New →</span>
                  <button onClick={e => { e.stopPropagation(); setModal("cloneProject"); }}
                    style={{ fontSize: 11, fontWeight: 600, color: B_INDIGO, background: P_INDIGO, border: `1px solid ${B_INDIGO}30`, borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Clone from previous
                  </button>
                </div>
              </button>

              {/* View/edit projects */}
              <button onClick={() => setModal("viewProjects")}
                style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "14px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", gap: 6 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = B_ORANGE)} onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8f0")}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><FileText size={15} color={B_ORANGE} /><span style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY }}>View / Edit my projects</span></div>
                <div style={{ fontSize: 11.5, color: "#888", lineHeight: 1.4 }}>Draft → Under Review → Live / Returned</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: B_ORANGE }}>Open →</span>
              </button>

              {/* Review applications */}
              <button onClick={() => { scrollTo(applicationsRef); }}
                style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "14px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", gap: 6 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = B_ORANGE)} onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8f0")}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Inbox size={15} color={B_ORANGE} /><span style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY }}>Review applications</span></div>
                <div style={{ fontSize: 11.5, color: "#888", lineHeight: 1.4 }}>{pendingApps} pending · AI shortlist at top</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: B_ORANGE }}>Jump to queue ↓</span>
              </button>

              {/* Submit feedback */}
              <button onClick={() => setModal("feedback")}
                style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "14px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", gap: 6 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = B_ORANGE)} onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8f0")}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><MessageSquare size={15} color={B_ORANGE} /><span style={{ position: "relative", display: "inline-flex", fontSize: 13, fontWeight: 700, color: ACCENT_NAVY }}>Submit feedback{NOTIFICATIONS.feedback && <span style={notifDot} />}</span></div>
                <div style={{ fontSize: 11.5, color: "#888", lineHeight: 1.4 }}>Per-project, per-volunteer. Mandatory for certs.</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: B_ORANGE }}>Open →</span>
              </button>

              {/* Project health update */}
              <button onClick={() => setModal("healthUpdate")}
                style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "14px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", gap: 6 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = B_ORANGE)} onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8f0")}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><BarChart3 size={15} color={B_ORANGE} /><span style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY }}>Project health update</span></div>
                <div style={{ fontSize: 11.5, color: "#888", lineHeight: 1.4 }}>Active / Paused / Extended / Close early</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: B_ORANGE }}>Open →</span>
              </button>

              {/* Manage team */}
              <button onClick={() => setModal("manageTeam")}
                style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "14px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", gap: 6 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = B_ORANGE)} onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8f0")}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Users size={15} color={B_ORANGE} /><span style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY }}>Manage team / co-ordinators</span></div>
                <div style={{ fontSize: 11.5, color: "#888", lineHeight: 1.4 }}>Self-service — no Admin needed</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: B_ORANGE }}>Open →</span>
              </button>

              {/* Refer an NGO */}
              <button onClick={() => setModal("referNGO")}
                style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "14px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", gap: 6 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = B_ORANGE)} onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8f0")}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><UserPlus size={15} color={B_ORANGE} /><span style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY }}>Refer an NGO</span></div>
                <div style={{ fontSize: 11.5, color: "#888", lineHeight: 1.4 }}>Invite another NGO to join ProEngage</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: B_ORANGE }}>Open →</span>
              </button>

              {/* Share story */}
              <button onClick={() => setModal("shareStory")}
                style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "14px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", gap: 6 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = B_ORANGE)} onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8f0")}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Share2 size={15} color={B_ORANGE} /><span style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY }}>Share your story / experience</span></div>
                <div style={{ fontSize: 11.5, color: "#888", lineHeight: 1.4 }}>Post an experience or a project highlight</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: B_ORANGE }}>Open →</span>
              </button>
            </div>
          </div>

          {/* ─── III. Application Queue (inline) ─── */}
          <div id="applications" ref={applicationsRef} style={card}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 4 }}>III · Application Queue</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: ACCENT_NAVY, position: "relative", display: "inline-flex" }}>Review Applications{NOTIFICATIONS.applications && <span style={notifDot} />}</div>
            </div>
            <div style={{ display: "flex", gap: 6, padding: "4px", background: "#f0f0f4", borderRadius: 9, marginBottom: 14, width: "fit-content" }}>
              {(["shortlist","all"] as const).map(t => (
                <button key={t} onClick={() => setAppTab(t)} style={{ ...tabBtn(appTab === t), minWidth: 120 }}>
                  {t === "shortlist" ? "🤖 AI Shortlist" : `All (${applicants.length})`}
                </button>
              ))}
            </div>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
              <input placeholder="Search name or skill…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: "100%", paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: "1px solid #e0e0e8", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 340, overflowY: "auto" }}>
              {(appTab === "shortlist" ? shortlisted : filtered).map((a, i) => (
                <div key={a.id} onClick={() => { setSelectedApplicant(a); setModal("selectedApplicant"); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderBottom: "1px solid #f0f0f8", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f8f9ff")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  {appTab === "shortlist" && (
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#c47c2a" : "#e0e0e8", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                  )}
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: P_INDIGO, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: B_INDIGO, flexShrink: 0 }}>
                    {a.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{a.city} · {a.availability}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: a.matchPercentage >= 90 ? B_TEAL : a.matchPercentage >= 80 ? B_INDIGO : "#888" }}>{a.matchPercentage}%</div>
                    <Badge status={a.status} />
                  </div>
                </div>
              ))}
            </div>
            {appTab === "shortlist" && shortlisted.filter(a => a.status === "Pending").length >= 5 && (
              <button onClick={() => { shortlisted.filter(a => a.status === "Pending").forEach(a => handleAccept(a.id)); }}
                style={{ width: "100%", marginTop: 12, padding: "10px", background: B_INDIGO, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Bulk Accept Top {shortlisted.filter(a => a.status === "Pending").length}
              </button>
            )}
            {auditLog.length > 0 && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f0f8" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Recent Actions</div>
                {auditLog.slice(0, 3).map(log => (
                  <div key={log.id} style={{ display: "flex", gap: 10, fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: log.action === "Accepted" ? B_TEAL : B_RED }}>{log.action}</span>
                    <span style={{ color: "#888" }}>{log.volunteer}</span>
                    <span style={{ color: "#aaaabc", marginLeft: "auto" }}>{log.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── IV. History ─── */}
          <div id="history" ref={historyRef} style={card}>
            <SectionHeading eyebrow="IV · History" title="Records by Edition" />
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {(["projects","volunteers","feedback"] as const).map(t => (
                <button key={t} onClick={() => { setHistoryTab(t); setDrillEdition(null); setDrillProject(null); }} style={tabBtn(historyTab === t)}>
                  {t === "projects" ? "My Projects" : t === "volunteers" ? "My Volunteers" : "My Feedback"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <select style={{ fontSize: 11.5, padding: "4px 9px", border: "1px solid #e0e0e8", borderRadius: 6, background: "#f8f9ff", color: "#555", fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
                <option>Edition 23</option><option>Edition 22</option><option>Edition 21</option>
              </select>
              <select style={{ fontSize: 11.5, padding: "4px 9px", border: "1px solid #e0e0e8", borderRadius: 6, background: "#f8f9ff", color: "#555", fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
                <option>2025–26</option><option>2024–25</option><option>2023–24</option>
              </select>
              <button onClick={() => triggerToast("Generating export…")} style={{ marginLeft: "auto", fontSize: 12, color: B_ORANGE, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
                <Download size={12} /> Export
              </button>
            </div>

            {/* My Projects — 3-level drill */}
            {historyTab === "projects" && (
              <>
                {/* Breadcrumb */}
                {(drillEdition || drillProject) && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 12 }}>
                    <button onClick={() => { setDrillEdition(null); setDrillProject(null); }} style={{ color: "#aaa", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Editions</button>
                    {drillEdition && <><span style={{ color: "#ccc" }}>›</span><button onClick={() => setDrillProject(null)} style={{ color: drillProject ? "#aaa" : ACCENT_NAVY, fontWeight: drillProject ? 400 : 700, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{drillEdition}</button></>}
                    {drillProject && <><span style={{ color: "#ccc" }}>›</span><span style={{ color: ACCENT_NAVY, fontWeight: 700 }}>{drillProject.title}</span></>}
                  </div>
                )}

                {/* Level 1: Editions */}
                {!drillEdition && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { id: "ProEngage · Edition 23 · 2025–26", status: "Active", count: projects.length },
                      { id: "ProEngage · Edition 22 · 2024–25", status: "Closed", count: 3 },
                    ].map(ed => (
                      <div key={ed.id} onClick={() => setDrillEdition(ed.id)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = B_ORANGE)} onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8f0")}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{ed.id}</div>
                          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{ed.count} projects</div>
                        </div>
                        <Badge status={ed.status} />
                        <ChevronRight size={14} color="#aaa" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Level 2: Projects within edition */}
                {drillEdition && !drillProject && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {projects.map((p: any) => (
                      <div key={p.id} onClick={() => setDrillProject(p)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = B_ORANGE)} onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8f0")}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{p.title}</div>
                          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{p.volunteers ?? 0} volunteers · {p.applications ?? 0} applications</div>
                        </div>
                        <Badge status={p.status} />
                        <ChevronRight size={14} color="#aaa" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Level 3: Volunteers within project */}
                {drillProject && (
                  <div>
                    <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "8px 14px", background: "#f8f9ff", borderBottom: "1px solid #e8e8f0" }}>
                        {["Volunteer","Status","Feedback","Hours",""].map(h => (
                          <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.7px" }}>{h}</div>
                        ))}
                      </div>
                      {[
                        { name: "Priya Sharma",  status: "Active",  feedbackDone: false, hours: null },
                        { name: "Amit Verma",    status: "Matched", feedbackDone: false, hours: null },
                        { name: "Sneha Rathore", status: "Active",  feedbackDone: true,  hours: "14h" },
                      ].map((v, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "11px 14px", borderBottom: "1px solid #f0f0f8", alignItems: "center" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{v.name}</div>
                          <Badge status={v.status} />
                          <div>
                            {v.feedbackDone
                              ? <span style={{ fontSize: 11.5, color: B_TEAL, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={12} /> Submitted</span>
                              : <button onClick={() => { setActiveProject(drillProject); navigate("project-feedback"); }} style={{ fontSize: 11.5, fontWeight: 600, color: B_ORANGE, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Give Feedback</button>}
                          </div>
                          <div style={{ fontSize: 12, color: "#777" }}>{v.hours ?? "—"}</div>
                          <button onClick={() => { setActiveProject(drillProject); navigate("active-project-management"); }} style={{ fontSize: 11.5, fontWeight: 600, color: "#aaa", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>View</button>
                        </div>
                      ))}
                    </div>
                    {(drillProject.status === "Closed") && (
                      <div style={{ marginTop: 12, display: "flex", gap: 12, padding: "12px 14px", background: P_YELLOW, border: "1px solid #f5d48a", borderRadius: 10, alignItems: "center" }}>
                        <div style={{ fontSize: 22 }}>🏅</div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#9a6500", textTransform: "uppercase", letterSpacing: "0.8px" }}>Project Completed</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#7c5500", marginTop: 2 }}>Badge awarded · Certificate generation pending TSG Admin approval.</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {historyTab === "volunteers" && (
              <div>
                {[
                  { name: "Priya Sharma",   project: "Financial Literacy for Rural Women", status: "Active",    hours: "12h" },
                  { name: "Amit Verma",     project: "Digital Skills for Youth",            status: "Matched",   hours: "—" },
                  { name: "Sneha Rathore",  project: "Community Health Awareness",           status: "Completed", hours: "40h" },
                ].map((v, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid #f0f0f8" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: P_INDIGO, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: B_INDIGO, flexShrink: 0 }}>
                      {v.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{v.name}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>{v.project}</div>
                    </div>
                    <Badge status={v.status} />
                    <div style={{ fontSize: 12, color: "#777", minWidth: 30 }}>{v.hours}</div>
                  </div>
                ))}
              </div>
            )}

            {historyTab === "feedback" && (
              <div>
                {[
                  { project: "Community Health Awareness",          vol: "Sneha Rathore", submitted: "15-Mar-26", done: true },
                  { project: "Financial Literacy for Rural Women",  vol: "Priya Sharma",  submitted: "Pending",   done: false },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderBottom: "1px solid #f0f0f8" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{f.project}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>Volunteer: {f.vol} · {f.submitted}</div>
                    </div>
                    <Badge status={f.done ? "Submitted" : "Pending"} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── V. Partner NGOs (Lead Partners only — read-only) ─── */}
          {isLeadPartner && partnerNGOs.length > 0 && (
            <div id="partnerngos" ref={partnerRef} style={card}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <SectionHeading eyebrow="V · Network" title="Partner NGOs" />
                <div style={{ fontSize: 11, color: "#aaaabc", marginTop: 4, textAlign: "right", maxWidth: 220, lineHeight: 1.5 }}>
                  As Lead Partner, you can view partner details and project data. Edits are managed by TSG Admin.
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {partnerNGOs.map((partner: any) => {
                  const isOpen = expandedPartner === partner.id;
                  return (
                    <div key={partner.id} style={{ border: "1px solid #e8e8f0", borderRadius: 12, overflow: "hidden" }}>
                      {/* Partner row */}
                      <div onClick={() => setExpandedPartner(isOpen ? null : partner.id)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", cursor: "pointer", background: isOpen ? "#f8f9ff" : "#fff" }}
                        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = "#fafafa"; }}
                        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = "#fff"; }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: P_ORANGE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: B_ORANGE, flexShrink: 0 }}>{partner.name.charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{partner.name}</div>
                          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{partner.city} · {partner.focusArea} · {partner.projects.length} project{partner.projects.length !== 1 ? "s" : ""}</div>
                        </div>
                        <Badge status={partner.status} />
                        {isOpen ? <ChevronUp size={14} color="#aaa" /> : <ChevronDown size={14} color="#aaa" />}
                      </div>

                      {/* Expanded details — read-only */}
                      {isOpen && (
                        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #f0f0f8", background: "#f8f9ff" }}>
                          {/* Stats row */}
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, margin: "14px 0" }}>
                            {[
                              { label: "Volunteers",    val: partner.volunteersTotal },
                              { label: "Projects",       val: partner.projects.length },
                              { label: "Partner since",  val: new Date(partner.joinedDate).getFullYear() },
                            ].map(s => (
                              <div key={s.label} style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 9, padding: "10px 12px", textAlign: "center" }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 4 }}>{s.label}</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: ACCENT_NAVY }}>{s.val}</div>
                              </div>
                            ))}
                          </div>

                          {/* Contact */}
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 6 }}>Contact</div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{partner.contactName}</div>
                            <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{partner.contactEmail}</div>
                          </div>

                          {/* Projects list */}
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 8 }}>Projects</div>
                          {partner.projects.length === 0 ? (
                            <div style={{ fontSize: 12.5, color: "#aaaabc", fontStyle: "italic" }}>No active projects for this partner.</div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {partner.projects.map((proj: any) => (
                                <div key={proj.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#fff", border: "1px solid #e8e8f0", borderRadius: 9 }}>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{proj.title}</div>
                                    <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{proj.volunteers} volunteer{proj.volunteers !== 1 ? "s" : ""}</div>
                                  </div>
                                  <Badge status={proj.status} />
                                </div>
                              ))}
                            </div>
                          )}

                          <div style={{ fontSize: 11, color: "#aaaabc", marginTop: 12, fontStyle: "italic" }}>
                            Partner details are managed by TSG Admin. Contact <span style={{ color: B_ORANGE }}>TSG Admin</span> to update contact information or status.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── VI. Reports ─── */}
          <div id="reports" ref={reportsRef} style={card}>
            <SectionHeading eyebrow={`${isLeadPartner ? "VI" : "V"} · Analytics`} title="Reports" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { title: "Edition Participation Report",  desc: "Applications, matches, completions for Edition 23",       date: "Generated 1 Apr 2026" },
                { title: "Volunteer Engagement Summary",  desc: "Hours logged, feedback rates, certificate status",        date: "Generated 1 Apr 2026" },
                { title: "Project Health Report",         desc: "Monthly M&E status across all active projects",           date: "Generated 20 Mar 2026" },
                { title: "Feedback Completion Tracker",   desc: "Who has and hasn't submitted feedback before deadline",    date: "Generated 5 Apr 2026" },
              ].map((r, i) => (
                <div key={i} style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "14px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#6b6b7a", lineHeight: 1.4, marginBottom: 12 }}>{r.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#aaaabc" }}>{r.date}</span>
                    <button onClick={() => triggerToast(`Generating "${r.title}"… You'll receive an email when ready.`)}
                      style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: B_ORANGE, background: P_ORANGE, border: `1px solid ${B_ORANGE}30`, borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      <Download size={12} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── VII. Resources ─── */}
          <div id="resources" ref={resourcesRef} style={card}>
            <SectionHeading eyebrow={`${isLeadPartner ? "VII" : "VI"} · Learning & Support`} title="Resource Library" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "E-Module / Orientation", desc: "Mandatory onboarding. Progress tracked by Admin.", count: "2 of 5 complete", photo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80", accent: B_BLUE,   pastel: P_BLUE   },
                { label: "NGO Project Guide",       desc: "Templates, guidelines, undertaking text.",          count: "8 documents",    photo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", accent: B_ORANGE, pastel: P_ORANGE },
                { label: "Media Library",           desc: "NGO-scoped photos and assets. View-only.",          count: "64 items",       photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80", accent: B_INDIGO, pastel: P_INDIGO },
                { label: "Feedback Templates",      desc: "Excel bulk upload template for large NGOs.",        count: "Download",       photo: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80", accent: B_TEAL,   pastel: P_TEAL   },
                { label: "Grievance Redressal",     desc: "Raise a concern about a project or volunteer.",     count: submittedGrievances.length > 0 ? `${submittedGrievances.length} open` : "No open cases",  photo: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80", accent: B_RED,    pastel: P_RED    },
                { label: "Help & Support",          desc: "Opens support modal. Chatbot always available.",    count: "24/7",           photo: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80", accent: "#5b21b6", pastel: "#f3f0ff" },
              ].map(r => (
                <ResourceCard key={r.label} {...r} onClick={() => {
                  if (r.label === "Grievance Redressal") { setModal("grievance"); }
                  else if (r.label === "E-Module / Orientation") { setShowOrientationModal(true); }
                  else if (r.label === "NGO Project Guide") { setModal("projectGuide"); }
                  else if (r.label === "Media Library") { navigate("media"); }
                  else if (r.label === "Help & Support") { setShowSupportModal(true); }
                  else { triggerToast(`Opening ${r.label}…`); }
                }} />
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT RAIL ── */}
        <div style={{ position: "sticky", top: 108, display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Section nav */}
          <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 8 }}>Sections</div>
            {[
              { id: "snapshot",    label: "↑ Snapshot",   ref: snapshotRef    },
              { id: "activities",  label: "Activities",   ref: activitiesRef  },
              { id: "applications",label: "App. Queue",   ref: applicationsRef },
              { id: "history",     label: "History",      ref: historyRef     },
              ...(isLeadPartner ? [{ id: "partnerngos", label: "Partner NGOs", ref: partnerRef }] : []),
              { id: "reports",     label: "Reports",      ref: reportsRef     },
              { id: "resources",   label: "Resources",    ref: resourcesRef   },
            ].map(({ id, label, ref }) => {
              const hasNotif = (id === "activities" && NOTIFICATIONS.activities) || (id === "applications" && NOTIFICATIONS.applications);
              return (
                <div key={id} onClick={() => scrollTo(ref)} style={{ ...railLink(activeSection === id), position: "relative" }}>{label}{hasNotif && <span style={notifDot} />}</div>
              );
            })}
          </div>
          {/* Quick links */}
          <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 8 }}>Quick Links</div>
            {[
              { label: "Edit Profile",       action: () => navigate("profile") },
              { label: "Add Co-ordinator",   action: () => setModal("manageTeam") },
              { label: "Clone Previous",     action: () => setModal("cloneProject") },
              { label: "Raise Grievance",    action: () => setModal("grievance") },
            ].map(({ label, action }) => (
              <div key={label} onClick={action} style={{ fontSize: 11, color: B_ORANGE, fontWeight: 600, padding: "5px 0", borderBottom: "1px solid #f0f0f8", cursor: "pointer" }}>{label}</div>
            ))}
          </div>
          {/* Pending Validations */}
          <div style={{ background: "#fff", border: "1.5px solid #fde68a", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#9a6500", marginBottom: 8 }}>Pending Validations</div>
            {[
              { label: "Feedback due", detail: "2 projects", color: B_RED },
              { label: "Co-ord request", detail: "1 pending", color: B_ORANGE },
              { label: "Health update", detail: "Overdue", color: B_RED },
            ].map(({ label, detail, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #fef3c7" }}>
                <div style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>{label}</div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color }}>{detail}</span>
              </div>
            ))}
          </div>
          {/* Edition card */}
          <div style={{ background: P_ORANGE, border: `1px solid ${B_ORANGE}40`, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: B_ORANGE, marginBottom: 6 }}>PE Edition 23</div>
            <div style={{ fontSize: 11, color: B_ORANGE, fontWeight: 600 }}>Applications open</div>
            <div style={{ fontSize: 11, color: "#7c3000", marginTop: 3 }}>Closes 29 Jan 2026</div>
          </div>
        </div>
      </div>

      {/* ═══════ MODALS ═══════ */}

      {/* Clone from previous */}
      <DrawerShell open={modal === "cloneProject"} onClose={() => setModal(null)} title="Clone from Previous Project" accentTag="Template">
        <CloneProjectModal
          projects={projects}
          onSelect={p => { setClonedFrom(p); setClonedProject({ title: p.title, isClone: true, sourceTitle: p.title }); setModal("addProject"); }}
          onClose={() => setModal(null)} />
      </DrawerShell>

      {/* Add project */}
      <DrawerShell open={modal === "addProject"} onClose={() => { setModal(null); setClonedFrom(null); }} title={clonedFrom ? `New Project (from "${clonedFrom.title}")` : "Add New Project"} accentTag={clonedFrom ? "Cloned" : "New"} width={620}>
        <AddProjectForm clonedFrom={clonedFrom} onClose={() => { setModal(null); setClonedFrom(null); }} onSubmit={() => { setModal(null); setClonedFrom(null); triggerToast("Project submitted for TSG Admin review. You'll be notified once approved."); }} />
      </DrawerShell>

      {/* View / edit projects */}
      <DrawerShell open={modal === "viewProjects"} onClose={() => setModal(null)} title="My Projects" subtitle={`${projects.length} projects this edition`}>
        <div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {["All","Active","Under Review","Draft","Closed"].map(f => (
              <span key={f} style={{ fontSize: 12, padding: "4px 11px", border: "1px solid #e0e0e8", borderRadius: 6, color: "#555", cursor: "pointer", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
            ))}
          </div>
          {projects.map((p: any) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid #f0f0f8" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{p.title}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{p.volunteers ?? 0} matched · {p.applications ?? 0} applications</div>
              </div>
              <Badge status={p.status} />
              <button onClick={() => triggerToast("Opening project editor…")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 4 }}><Edit2 size={14} /></button>
            </div>
          ))}
          <button onClick={() => triggerToast("Downloading project export…")} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: B_ORANGE, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            <Download size={13} /> Export Project Details (Excel)
          </button>
        </div>
      </DrawerShell>

      {/* Applicant detail */}
      <DrawerShell open={modal === "selectedApplicant"} onClose={() => setModal(null)} title="Volunteer Profile" accentTag={selectedApplicant ? `${selectedApplicant.matchPercentage}% Match` : ""}>
        {selectedApplicant && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: P_INDIGO, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: B_INDIGO, flexShrink: 0 }}>
                {selectedApplicant.name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY }}>{selectedApplicant.name}</div>
                <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 2 }}>{selectedApplicant.city} · {selectedApplicant.availability}</div>
                {selectedApplicant.isReturning && <span style={{ background: P_YELLOW, color: "#9a6500", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 100, marginTop: 6, display: "inline-block" }}>Returning</span>}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Experience Summary</div>
              <div style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 9, padding: "12px 14px", fontSize: 13, color: "#444", lineHeight: 1.6 }}>{selectedApplicant.experience}</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedApplicant.skills.map((s: string) => <span key={s} style={{ background: P_INDIGO, color: B_INDIGO, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 100 }}>{s}</span>)}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Languages</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedApplicant.languages.map((l: string) => <span key={l} style={{ background: "#f0f0f4", color: "#555", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 100 }}>{l}</span>)}
              </div>
            </div>
            {selectedApplicant.status === "Pending" && (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => handleReject(selectedApplicant.id)} style={{ flex: 1, padding: "11px", background: P_RED, border: `1px solid ${B_RED}30`, borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: B_RED, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Reject</button>
                <button onClick={() => handleAccept(selectedApplicant.id)} style={{ flex: 1, padding: "11px", background: ACCENT_NAVY, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Accept Volunteer</button>
              </div>
            )}
          </div>
        )}
      </DrawerShell>

      {/* Submit feedback */}
      <DrawerShell open={modal === "feedback"} onClose={() => { setModal(null); setFeedbackProject(null); }} title="Submit Volunteer Feedback">
        {!feedbackProject ? (
          <div>
            <div style={{ marginBottom: 14, fontSize: 13, color: "#6b6b7a" }}>Select a project to submit feedback for:</div>
            {projects.filter((p: any) => ["Active","Closed"].includes(p.status)).map((p: any) => (
              <button key={p.id} onClick={() => setFeedbackProject(p)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", width: "100%", marginBottom: 8 }}>
                <MessageSquare size={16} color={B_ORANGE} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{p.volunteers ?? 0} volunteers · {p.status}</div>
                </div>
                <ChevronRight size={14} color="#aaa" />
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "8px 12px", background: P_ORANGE, borderRadius: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: B_ORANGE, flex: 1 }}>{feedbackProject.title}</div>
              <button onClick={() => setFeedbackProject(null)} style={{ fontSize: 11, color: B_ORANGE, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Change</button>
            </div>
            <FeedbackForm project={feedbackProject} onClose={() => { setModal(null); setFeedbackProject(null); }} onSubmit={() => { setModal(null); setFeedbackProject(null); triggerToast("Feedback submitted. TSG Admin notified. Certificate process will begin once volunteer also submits."); }} />
          </div>
        )}
      </DrawerShell>

      {/* Health update */}
      <DrawerShell open={modal === "healthUpdate"} onClose={() => setModal(null)} title="Project Health Update">
        <div>
          <div style={{ marginBottom: 12 }}><Label>Project</Label><FSelect value="" onChange={() => {}} options={["Select project…", ...projects.filter((p: any) => p.status === "Active").map((p: any) => p.title)]} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div><Label>Month</Label><FSelect value="April 2026" onChange={() => {}} options={["April 2026","March 2026","February 2026","January 2026"]} /></div>
            <div><Label>Status</Label><FSelect value="Healthy" onChange={() => {}} options={["Healthy","At Risk","Drop Out","Paused","Extended","Close Early"]} /></div>
          </div>
          <div style={{ marginBottom: 18 }}><Label>Notes (optional)</Label>
            <textarea rows={3} style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", resize: "none", boxSizing: "border-box" }} placeholder="Context for this update…" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setModal(null)} style={{ flex: 1, padding: "10px", background: "#f8f8fc", border: "1px solid #e0e0e8", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
            <button onClick={() => { setModal(null); triggerToast("Health update submitted. TSG Admin notified."); }} style={{ flex: 1, padding: "10px", background: B_ORANGE, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Submit Update</button>
          </div>
        </div>
      </DrawerShell>

      {/* Manage team */}
      <DrawerShell open={modal === "manageTeam"} onClose={() => setModal(null)} title="Manage Team / Co-ordinators">
        <div>
          {coordinators.map((c: any) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f0f8" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: P_ORANGE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: B_ORANGE, flexShrink: 0 }}>
                {c.name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{c.name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{c.role} · {c.email}</div>
              </div>
              <button onClick={() => triggerToast("Opening edit form…")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 4 }}><Edit2 size={14} /></button>
              <button onClick={() => { setCoordinators((prev: any[]) => prev.filter((x: any) => x.id !== c.id)); triggerToast("Co-ordinator removed."); }} style={{ background: "none", border: "none", cursor: "pointer", color: B_RED, padding: 4 }}><Trash2 size={14} /></button>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: "14px", background: "#f8f9ff", border: `1.5px dashed ${B_ORANGE}60`, borderRadius: 10, fontSize: 13, color: B_ORANGE, fontWeight: 600, cursor: "pointer", textAlign: "center" }}
            onClick={() => triggerToast("Opening add co-ordinator form…")}>
            + Add Co-ordinator
          </div>
          <div style={{ fontSize: 11, color: "#aaaabc", marginTop: 10, fontStyle: "italic" }}>
            Co-ordinators can only edit projects assigned to them before Admin approval. For access changes, contact TSG Admin.
          </div>
        </div>
      </DrawerShell>

      {/* Grievance */}
      <DrawerShell open={modal === "grievance"} onClose={() => setModal(null)} title="Raise a Grievance">
        <div>
          <div style={{ marginBottom: 12 }}><Label>Project</Label><FSelect value={grievanceForm.projectId} onChange={v => setGrievanceForm(f => ({ ...f, projectId: v }))} options={["Select a project…", ...projects.filter((p: any) => p.status === "Active").map((p: any) => p.title)]} /></div>
          <div style={{ marginBottom: 12 }}><Label>Category</Label><FSelect value={grievanceForm.category} onChange={v => setGrievanceForm(f => ({ ...f, category: v }))} options={["Select category…","Volunteer conduct","Communication breakdown","Project scope disagreement","Scheduling conflict","Platform / technical issue","Other"]} /></div>
          <div style={{ marginBottom: 18 }}><Label>Description</Label>
            <textarea value={grievanceForm.description} onChange={e => setGrievanceForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the issue clearly. TSG Admin acknowledges within 2 working days." rows={4}
              style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", resize: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ fontSize: 11.5, color: "#aaaabc", marginBottom: 12, fontStyle: "italic" }}>Only 1 open grievance per active project at a time. Auto-acknowledgement sent on submission.</div>
          {submittedGrievances.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Open Grievances</div>
              {submittedGrievances.map(g => (
                <div key={g.id} style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 9, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ background: P_ORANGE, color: B_ORANGE, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>{g.category}</span>
                    <span style={{ fontSize: 11, color: "#aaaabc" }}>{g.date}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "#555", lineHeight: 1.5 }}>{g.description}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setModal(null)} style={{ flex: 1, padding: "10px", background: "#f8f8fc", border: "1px solid #e0e0e8", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
            <button onClick={() => {
              if (!grievanceForm.category || !grievanceForm.description || !grievanceForm.projectId) { triggerToast("Please fill all fields."); return; }
              setSubmittedGrievances(prev => [...prev, { ...grievanceForm, id: Date.now(), status: "Open", date: new Date().toLocaleDateString() }]);
              setGrievanceForm({ projectId: "", category: "", description: "" });
              setModal(null);
              triggerToast("Grievance submitted. TSG Admin notified. Auto-acknowledgement sent to your email.");
            }} style={{ flex: 1, padding: "10px", background: B_RED, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Submit Grievance</button>
          </div>
        </div>
      </DrawerShell>

      {/* NGO Project Guide */}
      <DrawerShell open={modal === "projectGuide"} onClose={() => setModal(null)} title="NGO Project Guide" accentTag="Resources">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            "Project Brief Template",
            "Volunteer Undertaking Form",
            "M&E Reporting Guidelines",
            "Photo & Media Consent Form",
            "Code of Conduct — NGO",
            "ProEngage Edition Calendar",
            "Feedback Submission Guide",
            "TSG Contact Directory",
          ].map((name) => (
            <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#f8f9ff", borderRadius: 9, border: "1px solid #e8e8f0" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>📄 {name}</span>
              <button
                onClick={() => triggerToast(`Downloading ${name}...`)}
                style={{ fontSize: 12, fontWeight: 700, color: B_ORANGE, background: P_ORANGE, border: "none", borderRadius: 7, padding: "5px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </DrawerShell>

      {/* Refer an NGO */}
      <DrawerShell open={modal === "referNGO"} onClose={() => setModal(null)} title="Refer an NGO" accentTag="Refer" subtitle="Help grow the ProEngage partner network">
        <div>
          <div style={{ background: P_ORANGE, border: `1px solid ${B_ORANGE}30`, borderRadius: 10, padding: "12px 14px", marginBottom: 18, fontSize: 12.5, color: "#7c3000", lineHeight: 1.5 }}>
            Know a like-minded NGO that would be a great ProEngage partner? Fill in their details and we'll reach out on your behalf.
          </div>
          <div style={{ marginBottom: 12 }}><Label required>NGO Name</Label><FInput value="" placeholder="e.g. Akanksha Foundation" /></div>
          <div style={{ marginBottom: 12 }}><Label required>Primary Contact Name</Label><FInput value="" placeholder="Contact person's name" /></div>
          <div style={{ marginBottom: 12 }}><Label required>Contact Email</Label><FInput value="" type="email" placeholder="contact@ngo.org" /></div>
          <div style={{ marginBottom: 12 }}><Label>Contact Phone</Label><FInput value="" placeholder="+91 98XXXXXXXX" /></div>
          <div style={{ marginBottom: 12 }}><Label>Focus Area</Label>
            <FSelect value="Select focus area" onChange={() => {}} options={["Select focus area", "Education", "Health", "Environment", "Livelihood", "Disaster Relief", "Women Empowerment", "Other"]} />
          </div>
          <div style={{ marginBottom: 18 }}><Label>Why are you recommending them?</Label>
            <textarea placeholder="What makes this NGO a good fit for ProEngage?" rows={3}
              style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", resize: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setModal(null)} style={{ flex: 1, padding: "10px", background: "#f8f8fc", border: "1px solid #e0e0e8", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
            <button onClick={() => { setModal(null); triggerToast("Referral submitted! TSG Admin will reach out to the NGO within 3 working days."); }}
              style={{ flex: 1, padding: "10px", background: B_ORANGE, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Submit Referral</button>
          </div>
        </div>
      </DrawerShell>

      {/* Share Story / Experience */}
      <DrawerShell open={modal === "shareStory"} onClose={() => setModal(null)} title="Share Your Story" accentTag="Story" subtitle="Post a project highlight or impact experience">
        <div>
          <div style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}25`, borderRadius: 10, padding: "12px 14px", marginBottom: 18, fontSize: 12.5, color: B_INDIGO, lineHeight: 1.5 }}>
            Stories go to TSG Admin for moderation before being published. Approved stories may appear on the TVW Vibe wall and the TataEngage homepage.
          </div>
          <div style={{ marginBottom: 12 }}><Label required>Story Type</Label>
            <FSelect value="Select type" onChange={() => {}} options={["Select type", "Project Highlight", "Impact Story", "Volunteer Spotlight", "Community Change", "Partnership Achievement"]} />
          </div>
          <div style={{ marginBottom: 12 }}><Label required>Headline</Label><FInput value="" placeholder="A short, compelling title for your story" /></div>
          <div style={{ marginBottom: 12 }}><Label required>Your Story</Label>
            <textarea placeholder="Describe the experience, impact, or moment you want to share…" rows={5}
              style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", resize: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 12 }}><Label>Link to a Project (optional)</Label>
            <FSelect value="Select project" onChange={() => {}} options={["Select project", ...(ngoData.projects ?? []).map((p: any) => p.title)]} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <Label>Add Image (optional)</Label>
            <div style={{ border: "1.5px dashed #e0e0e8", borderRadius: 8, padding: "18px", textAlign: "center", cursor: "pointer", color: "#aaa", fontSize: 13 }}
              onClick={() => triggerToast("File upload simulated.")}>
              📎 Click to attach a photo
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setModal(null)} style={{ flex: 1, padding: "10px", background: "#f8f8fc", border: "1px solid #e0e0e8", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
            <button onClick={() => { setModal(null); triggerToast("Story submitted for moderation. TSG Admin will review within 2 working days."); }}
              style={{ flex: 1, padding: "10px", background: B_INDIGO, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Submit Story</button>
          </div>
        </div>
      </DrawerShell>

    </div>
  );
};

export default NGODashboardView;
