import React, { useState, useEffect, useRef } from "react";
import {
  X, ChevronRight, User, Users, Mail, Search, MapPin, Clock,
  Check, Sparkles, MessageSquare, Star, Plus, Edit2, Trash2,
  AlertTriangle, Download, CheckCircle2, FileText, Archive,
  Building2, BarChart3, Shield, BookOpen, HelpCircle, Inbox,
  ChevronDown, Upload, ArrowUpRight
} from "lucide-react";
import type { View } from "@/types";
import { MOCK_APPLICANTS, ANJALI_MEHTA } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";

// ─── Brand tokens ───────────────────────────────────────────────────────────
const B_ORANGE    = "#C14D00";
const B_INDIGO    = "#333399";
const B_TEAL      = "#00A896";
const B_RED       = "#E8401C";
const B_BLUE      = "#1E6BB8";
const ACCENT_NAVY = "#0D1B3E";
const P_ORANGE    = "#FFF0E6";
const P_TEAL      = "#E6F8F5";
const P_INDIGO    = "#EEF0FF";
const P_RED       = "#FFF0EE";
const P_BLUE      = "#EBF4FF";
const P_YELLOW    = "#FEF6E4";

// ─── DrawerShell (centred modal — matches Volunteer Dashboard pattern) ───────
function DrawerShell({
  open, onClose, title, width = 540, children,
}: {
  open: boolean; onClose: () => void; title: string; width?: number; children: React.ReactNode;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(13,27,62,0.45)", backdropFilter: "blur(2px)",
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: 16, width, maxWidth: "95vw",
        maxHeight: "88vh", overflowY: "auto",
        boxShadow: "0 24px 64px rgba(13,27,62,0.18)",
        animation: "drawerIn 0.2s ease",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f8", position: "sticky", top: 0, background: "#fff", zIndex: 1,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 4 }}><X size={18} /></button>
        </div>
        <div style={{ padding: "20px 24px 24px" }}>{children}</div>
      </div>
      <style>{`@keyframes drawerIn { from { opacity:0; transform:scale(0.97) } to { opacity:1; transform:scale(1) } }`}</style>
    </div>
  );
}

// ─── Field helpers ───────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10.5, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{children}</div>;
}
function FInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange?: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} placeholder={placeholder} onChange={e => onChange?.(e.target.value)}
      style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'Noto Sans', sans-serif", color: ACCENT_NAVY, outline: "none", boxSizing: "border-box" }}
      onFocus={e => (e.target.style.borderColor = B_ORANGE)}
      onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
  );
}
function FSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'Noto Sans', sans-serif", color: ACCENT_NAVY, outline: "none", background: "#fff", appearance: "none", cursor: "pointer", boxSizing: "border-box" }}
      onFocus={e => (e.target.style.borderColor = B_ORANGE)}
      onBlur={e => (e.target.style.borderColor = "#e0e0e8")}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function Badge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    Approved:    ["#E6F8F5", "#0F6E56"],
    Active:      ["#E6F8F5", "#0F6E56"],
    Live:        ["#E6F8F5", "#0F6E56"],
    Matched:     ["#E6F8F5", "#0F6E56"],
    Submitted:   ["#E6F8F5", "#0F6E56"],
    Draft:       ["#f0f0f4", "#888"],
    Closed:      ["#f0f0f4", "#888"],
    Completed:   ["#f0f0f4", "#888"],
    "Under Review": ["#FEF6E4", "#9a6500"],
    Pending:     ["#FEF6E4", "#9a6500"],
    "Not initiated": ["#FFF0EE", "#c0392b"],
    Rejected:    ["#FFF0EE", "#c0392b"],
    Fulfilled:   ["#f0f0f4", "#888"],
  };
  const [bg, color] = map[status] ?? ["#f0f0f4", "#666"];
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 100, whiteSpace: "nowrap" }}>{status}</span>
  );
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

// ─── Section anchor heading ───────────────────────────────────────────────────
function SecHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 4 }}>{eyebrow}</div>
      <div style={{ fontSize: 20, fontWeight: 900, color: ACCENT_NAVY }}>{title}</div>
    </div>
  );
}

// ─── Add Coordinator modal content ──────────────────────────────────────────
function AddCoordinatorForm({ onSave, onClose }: { onSave: (c: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", designation: "", email: "", phone: "", mobile: "", country: "India", city: "Mumbai" });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div><Label>First Name</Label><FInput value={form.firstName} onChange={v => set("firstName", v)} /></div>
        <div><Label>Last Name</Label><FInput value={form.lastName} onChange={v => set("lastName", v)} /></div>
        <div><Label>Designation</Label><FInput value={form.designation} onChange={v => set("designation", v)} /></div>
        <div><Label>Email</Label><FInput type="email" value={form.email} onChange={v => set("email", v)} /></div>
        <div><Label>Phone</Label><FInput value={form.phone} onChange={v => set("phone", v)} /></div>
        <div><Label>Mobile</Label><FInput value={form.mobile} onChange={v => set("mobile", v)} /></div>
        <div><Label>Country</Label><FSelect value={form.country} onChange={v => set("country", v)} options={["India","United States","United Kingdom","Singapore","UAE","Others"]} /></div>
        <div><Label>City</Label><FInput value={form.city} onChange={v => set("city", v)} /></div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f8f8fc", border: "1px solid #e0e0e8", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Cancel</button>
        <button onClick={() => onSave({ ...form, name: `${form.firstName} ${form.lastName}`, id: Date.now(), role: "Coordinator" })}
          style={{ flex: 1, padding: "10px", background: B_ORANGE, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Add Coordinator</button>
      </div>
    </div>
  );
}

// ─── Applicant profile modal ──────────────────────────────────────────────────
function ApplicantModal({ applicant, onAccept, onReject, onClose }: { applicant: any; onAccept: () => void; onReject: () => void; onClose: () => void }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: P_INDIGO, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: B_INDIGO, flexShrink: 0 }}>
          {applicant.name.split(" ").map((n: string) => n[0]).join("")}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY }}>{applicant.name}</div>
          <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 2 }}>{applicant.city} · {applicant.availability}</div>
          <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
            <span style={{ background: P_TEAL, color: B_TEAL, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 100 }}>{applicant.matchPercentage}% Match</span>
            {applicant.isReturning && <span style={{ background: P_YELLOW, color: "#9a6500", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 100 }}>Returning</span>}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <Label>Experience Summary</Label>
        <div style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 9, padding: "12px 14px", fontSize: 13, color: "#444", lineHeight: 1.6 }}>{applicant.experience}</div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <Label>Skills</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {applicant.skills.map((s: string) => <span key={s} style={{ background: P_INDIGO, color: B_INDIGO, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 100 }}>{s}</span>)}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <Label>Languages</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {applicant.languages.map((l: string) => <span key={l} style={{ background: "#f0f0f4", color: "#555", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 100 }}>{l}</span>)}
        </div>
      </div>
      {applicant.status === "Pending" && (
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onReject} style={{ flex: 1, padding: "11px", background: P_RED, border: `1px solid ${B_RED}30`, borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: B_RED, cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Reject</button>
          <button onClick={onAccept} style={{ flex: 1, padding: "11px", background: ACCENT_NAVY, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Accept Volunteer</button>
        </div>
      )}
    </div>
  );
}

// ─── Feedback Form modal ──────────────────────────────────────────────────────
function FeedbackForm({ project, onClose, onSubmit }: { project: any; onClose: () => void; onSubmit: () => void }) {
  const [completionStatus, setCompletionStatus] = useState("Completed");
  const [costSaving, setCostSaving] = useState("");
  const [ratingAccessible, setRatingAccessible] = useState(0);
  const [ratingResolved, setRatingResolved] = useState(0);
  const [testimonial, setTestimonial] = useState("");

  const StarRow = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div style={{ fontSize: 13, color: "#555", flex: 1 }}>{label}</div>
      <div style={{ display: "flex", gap: 3 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} onClick={() => onChange(i)} style={{ fontSize: 18, cursor: "pointer", color: i <= value ? B_ORANGE : "#ddd" }}>★</span>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ background: P_ORANGE, border: `1px solid ${B_ORANGE}30`, borderRadius: 10, padding: "12px 14px", marginBottom: 18, fontSize: 12.5, color: "#7c3000", lineHeight: 1.5 }}>
        Feedback is mandatory for certificate generation. Once both volunteer and NGO submit, TSG Admin triggers certificates.
      </div>

      <div style={{ marginBottom: 14 }}>
        <Label>Q1 — Completion status</Label>
        <div style={{ display: "flex", gap: 10 }}>
          {["Completed", "Not Completed"].map(opt => (
            <label key={opt} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, cursor: "pointer", color: ACCENT_NAVY, fontFamily: "'Noto Sans', sans-serif" }}>
              <input type="radio" name="completion" checked={completionStatus === opt} onChange={() => setCompletionStatus(opt)} style={{ accentColor: B_ORANGE }} />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {completionStatus === "Completed" && (
        <>
          <div style={{ marginBottom: 14 }}>
            <Label>Q2 — Estimated cost saving (INR)</Label>
            <FInput value={costSaving} onChange={setCostSaving} placeholder="e.g. 50000" type="number" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <Label>Q3 — Rate PE team support</Label>
            <div style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 9, padding: "12px 14px" }}>
              <StarRow value={ratingAccessible} onChange={setRatingAccessible} label="Team was accessible and responsive" />
              <StarRow value={ratingResolved} onChange={setRatingResolved} label="Queries were resolved effectively" />
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <Label>Q4 — Testimonial (optional)</Label>
            <textarea value={testimonial} onChange={e => setTestimonial(e.target.value)} placeholder="Share your experience with this volunteer's contribution…" rows={4}
              style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, fontFamily: "'Noto Sans', sans-serif", color: ACCENT_NAVY, outline: "none", resize: "none", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = B_ORANGE)}
              onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
          </div>
        </>
      )}

      <div style={{ marginBottom: 10, fontSize: 11.5, color: "#888" }}>
        For large NGOs with many projects, bulk upload via Excel template is also available.
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f8f8fc", border: "1px solid #e0e0e8", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Cancel</button>
        <button onClick={onSubmit} style={{ flex: 1, padding: "10px", background: B_ORANGE, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Submit Feedback</button>
      </div>
    </div>
  );
}

// ─── Add Project form ─────────────────────────────────────────────────────────
function AddProjectForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [form, setForm] = useState({
    hostOrg: "", areaOfWork: "", deliveryType: "Hybrid", background: "", deliverables: "",
    expectedLearning: "", volunteerProfile: "", location: "Mumbai", duration: "3 months",
    volunteersRequired: "5", undertaking: false,
  });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: 4 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ gridColumn: "1/-1" }}><Label>Host Organisation</Label><FInput value={form.hostOrg} onChange={v => set("hostOrg", v)} placeholder="e.g. Pratham Foundation" /></div>
        <div><Label>Area of Work</Label><FSelect value={form.areaOfWork} onChange={v => set("areaOfWork", v)} options={["Education","Health","Environment","Livelihoods","Technology","Finance","Others"]} /></div>
        <div><Label>Type of Delivery</Label><FSelect value={form.deliveryType} onChange={v => set("deliveryType", v)} options={["Remote","In-Person","Hybrid"]} /></div>
        <div style={{ gridColumn: "1/-1" }}><Label>Project Background</Label><textarea value={form.background} onChange={e => set("background", e.target.value)} placeholder="Describe the project context and need…" rows={3} style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'Noto Sans', sans-serif", color: ACCENT_NAVY, outline: "none", resize: "none", boxSizing: "border-box" }} /></div>
        <div style={{ gridColumn: "1/-1" }}><Label>Deliverables *</Label><textarea value={form.deliverables} onChange={e => set("deliverables", e.target.value)} placeholder="What will volunteers produce or accomplish?" rows={2} style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'Noto Sans', sans-serif", color: ACCENT_NAVY, outline: "none", resize: "none", boxSizing: "border-box" }} /></div>
        <div style={{ gridColumn: "1/-1" }}><Label>Expected Learning for Volunteer *</Label><textarea value={form.expectedLearning} onChange={e => set("expectedLearning", e.target.value)} placeholder="What will volunteers gain?" rows={2} style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'Noto Sans', sans-serif", color: ACCENT_NAVY, outline: "none", resize: "none", boxSizing: "border-box" }} /></div>
        <div style={{ gridColumn: "1/-1" }}><Label>Ideal Volunteer Profile</Label><FInput value={form.volunteerProfile} onChange={v => set("volunteerProfile", v)} placeholder="e.g. Finance professional, 3+ years experience" /></div>
        <div><Label>Location</Label><FInput value={form.location} onChange={v => set("location", v)} /></div>
        <div><Label>Duration</Label><FInput value={form.duration} onChange={v => set("duration", v)} placeholder="e.g. 3 months" /></div>
        <div><Label>Volunteers Required</Label><FInput value={form.volunteersRequired} onChange={v => set("volunteersRequired", v)} type="number" /></div>
      </div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 18, fontSize: 13, color: "#555", cursor: "pointer" }}>
        <input type="checkbox" checked={form.undertaking} onChange={e => set("undertaking", e.target.checked)} style={{ accentColor: B_ORANGE, marginTop: 2 }} />
        I confirm that the information provided is accurate and that we agree to the Tata ProEngage programme undertaking.
      </label>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f8f8fc", border: "1px solid #e0e0e8", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Cancel</button>
        <button onClick={onSubmit} style={{ flex: 1, padding: "10px", background: B_ORANGE, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Submit for Review</button>
      </div>
    </div>
  );
}

// ─── Health Update modal ──────────────────────────────────────────────────────
function HealthUpdateForm({ projects, onClose, onSubmit }: { projects: any[]; onClose: () => void; onSubmit: () => void }) {
  const [projectId, setProjectId] = useState("");
  const [month, setMonth] = useState("April 2026");
  const [status, setStatus] = useState("Healthy");
  const [notes, setNotes] = useState("");
  return (
    <div>
      <div style={{ marginBottom: 12 }}><Label>Project</Label>
        <FSelect value={projectId} onChange={setProjectId} options={["Select project…", ...projects.filter(p => p.status === "Active").map(p => p.title)]} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div><Label>Month</Label><FSelect value={month} onChange={setMonth} options={["April 2026","March 2026","February 2026","January 2026"]} /></div>
        <div><Label>Status</Label><FSelect value={status} onChange={setStatus} options={["Healthy","At Risk","Drop Out","Paused","Extended"]} /></div>
      </div>
      <div style={{ marginBottom: 18 }}><Label>Notes (optional)</Label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any context for this update…" rows={3}
          style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'Noto Sans', sans-serif", color: ACCENT_NAVY, outline: "none", resize: "none", boxSizing: "border-box" }} /></div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f8f8fc", border: "1px solid #e0e0e8", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Cancel</button>
        <button onClick={onSubmit} style={{ flex: 1, padding: "10px", background: B_ORANGE, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Submit Update</button>
      </div>
    </div>
  );
}

// ─── Manage Team modal ────────────────────────────────────────────────────────
function ManageTeamModal({ coordinators, onAdd, onDelete, onClose }: { coordinators: any[]; onAdd: (c: any) => void; onDelete: (id: number) => void; onClose: () => void }) {
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        {coordinators.map((c, i) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f0f8" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: P_ORANGE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: B_ORANGE, flexShrink: 0 }}>
              {c.name.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{c.name}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{c.role} · {c.email}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 4 }}><Edit2 size={14} /></button>
              <button onClick={() => onDelete(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: B_RED, padding: 4 }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {!showForm ? (
        <button onClick={() => setShowForm(true)} style={{ width: "100%", padding: "10px", background: P_ORANGE, border: `1.5px dashed ${B_ORANGE}60`, borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: B_ORANGE, cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>
          + Add Co-ordinator
        </button>
      ) : (
        <div style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "14px 16px", marginTop: 4 }}>
          <AddCoordinatorForm onSave={c => { onAdd(c); setShowForm(false); }} onClose={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const NGODashboardView = () => {
  const { setActiveProject, ngoData, triggerToast, setClonedProject } = useAppContext();
  const navigate = useAppNavigate();

  // Section refs for right rail scroll tracking
  const snapshotRef  = useRef<HTMLDivElement>(null);
  const activitiesRef = useRef<HTMLDivElement>(null);
  const historyRef   = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("snapshot");

  // Applicant state
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [appTab, setAppTab] = useState<"shortlist" | "all">("shortlist");

  // Coordinator state
  const [coordinators, setCoordinators] = useState(ngoData.coordinators ?? ANJALI_MEHTA.coordinators);

  // History tab state
  const [historyTab, setHistoryTab] = useState<"projects" | "volunteers" | "feedback" | "timelines">("projects");

  // Modals
  type ModalKey = null | "addProject" | "viewProjects" | "reviewApplications" | "feedback" | "healthUpdate" | "manageTeam" | "selectedApplicant" | "grievance";
  const [modal, setModal] = useState<ModalKey>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [feedbackProject, setFeedbackProject] = useState<any>(null);
  const [grievanceForm, setGrievanceForm] = useState({ projectId: "", category: "", description: "" });
  const [submittedGrievances, setSubmittedGrievances] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);

  // Scroll tracking for right rail
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) setActiveSection(e.target.id);
      }
    }, { threshold: 0.3 });
    [snapshotRef, activitiesRef, historyRef, resourcesRef].forEach(r => r.current && observer.observe(r.current));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Applicant helpers
  const shortlisted = [...applicants].filter(a => a.status === "Pending").sort((a, b) => b.matchPercentage - a.matchPercentage);
  const filtered = applicants.filter(a => {
    const q = searchQuery.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.skills.some((s: string) => s.toLowerCase().includes(q));
  });

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

  const projects = ngoData.projects ?? ANJALI_MEHTA.projects;

  // ─── Stat numbers ─────────────────────────────────────────────────────────
  const activeProjects    = projects.filter((p: any) => p.status === "Active").length;
  const totalVolunteers   = projects.filter((p: any) => ["Active","Closed"].includes(p.status)).reduce((s: number, p: any) => s + (p.volunteers ?? 0), 0);
  const completedVols     = projects.filter((p: any) => p.status === "Closed").reduce((s: number, p: any) => s + (p.volunteers ?? 0), 0);
  const pendingApps       = ngoData.pendingApplications ?? 8;

  // ─── Action cards ─────────────────────────────────────────────────────────
  const actions = [
    { icon: Plus,            label: "Add project",             sub: "Create and submit a new PE project", key: "addProject" as ModalKey },
    { icon: FileText,        label: "View / Edit my projects", sub: "Draft → Under Review → Live / Returned", key: "viewProjects" as ModalKey },
    { icon: Inbox,           label: "Review applications",     sub: `${pendingApps} pending · AI shortlist at top`, key: "reviewApplications" as ModalKey },
    { icon: MessageSquare,   label: "Submit feedback",         sub: "Per-project, per-volunteer. Mandatory for certs.", key: "feedback" as ModalKey },
    { icon: BarChart3,       label: "Project health update",   sub: "Active / Paused / Extended / Close early", key: "healthUpdate" as ModalKey },
    { icon: Users,           label: "Manage team / co-ordinators", sub: "Self-service — no Admin needed", key: "manageTeam" as ModalKey },
  ];

  // ─── Styles ───────────────────────────────────────────────────────────────
  const card: React.CSSProperties = { background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "20px 22px", marginBottom: 20 };
  const railLink = (active: boolean): React.CSSProperties => ({
    display: "block", fontSize: 12, fontWeight: active ? 700 : 500,
    color: active ? B_ORANGE : "#6b6b7a", padding: "5px 0",
    borderBottom: "1px solid #f0f0f8", cursor: "pointer",
    textDecoration: "none",
  });
  const tabStyle = (active: boolean): React.CSSProperties => ({
    fontSize: 12.5, fontWeight: active ? 700 : 500,
    color: active ? B_ORANGE : "#6b6b7a",
    background: active ? P_ORANGE : "transparent",
    border: active ? `1px solid ${B_ORANGE}40` : "1px solid transparent",
    borderRadius: 7, padding: "5px 13px", cursor: "pointer",
    fontFamily: "'Noto Sans', sans-serif",
  });

  return (
    <div style={{ background: "#f8f9ff", minHeight: "100vh", fontFamily: "'Noto Sans', sans-serif", paddingTop: 80, paddingBottom: 80 }}>

      {/* ── Profile identity banner ── */}
      <div style={{ background: ACCENT_NAVY, padding: "20px 48px 18px", display: "flex", alignItems: "center", gap: 16, marginBottom: 0 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: B_ORANGE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0, border: "2px solid rgba(255,255,255,0.2)" }}>
          AM
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{ngoData.organization ?? "Pratham Foundation"}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
            {ngoData.tier ?? "Lead Partner"} · Education · Mumbai, India
          </div>
        </div>
        <span style={{ background: P_ORANGE, color: B_ORANGE, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, border: `1px solid ${B_ORANGE}40` }}>
          {ngoData.tier ?? "Lead Partner"}
        </span>
      </div>

      {/* ── Main layout ── */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 48px 0", display: "grid", gridTemplateColumns: "1fr 148px", gap: 24, alignItems: "start" }}>

        {/* ── LEFT: main scroll ── */}
        <div>

          {/* ─── I. Impact Snapshot ─── */}
          <div id="snapshot" ref={snapshotRef} style={card}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 4 }}>I · Impact Snapshot</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
              <StatTile num={activeProjects}  label="# Projects (current)"  bg="#FFF4EC" color="#B45309" />
              <StatTile num={totalVolunteers}  label="# Volunteers engaged"  bg={P_TEAL}  color={B_TEAL} />
              <StatTile num={completedVols}    label="# Vol. completed"      bg={P_TEAL}  color={B_TEAL} />
              <StatTile num={pendingApps}      label="# Pending reviews"     bg="#EEEDFE" color="#3C3489"  />
            </div>

            {/* Feedback reminders */}
            {projects
              .filter((p: any) => {
                if (p.status !== "Active" || !p.endDate) return false;
                const days = (new Date(p.endDate).getTime() - Date.now()) / 86400000;
                return days <= 3 && days >= -1;
              })
              .map((p: any) => {
                const days = Math.ceil((new Date(p.endDate).getTime() - Date.now()) / 86400000);
                return (
                  <div key={p.id} style={{ background: P_YELLOW, border: "1px solid #f5d48a", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <Clock size={18} color="#9a6500" />
                    <div style={{ flex: 1, fontSize: 13, color: "#7c5500", lineHeight: 1.5 }}>
                      <strong>Feedback due {days <= 0 ? "today" : `in ${days} day${days !== 1 ? "s" : ""}`}</strong> — "{p.title}" · Complete to trigger certificates.
                    </div>
                    <button onClick={() => { setActiveProject(p); setFeedbackProject(p); setModal("feedback"); }}
                      style={{ background: "#9a6500", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif", whiteSpace: "nowrap" }}>
                      Complete Feedback
                    </button>
                  </div>
                );
              })}

            {/* M&E health tiles */}
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
                      const bg = h.status === "Healthy" ? "#E6F8F5" : h.status === "At Risk" ? P_RED : h.status === "Drop Out" ? P_ORANGE : "#f0f0f4";
                      const color = h.status === "Healthy" ? "#0F6E56" : h.status === "At Risk" ? B_RED : h.status === "Drop Out" ? B_ORANGE : "#888";
                      return (
                        <div key={i} style={{ background: bg, borderRadius: 7, padding: "6px 10px", minWidth: 80 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#888", marginBottom: 2 }}>{h.month}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color }}>{h.status === "Pending" ? "Awaiting" : h.status}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── II. Activities & Actions ─── */}
          <div id="activities" ref={activitiesRef} style={card}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 4 }}>II · Activities &amp; Actions</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: ACCENT_NAVY, marginBottom: 16 }}>What do you need to do?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {actions.map(({ icon: Icon, label, sub, key }) => (
                <button key={label} onClick={() => setModal(key)}
                  style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "14px 14px", textAlign: "left", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif", transition: "border-color 0.15s", display: "flex", flexDirection: "column", gap: 6 }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = B_ORANGE)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8f0")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon size={15} color={B_ORANGE} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#888", lineHeight: 1.4 }}>{sub}</div>
                  <div style={{ fontSize: 11.5, color: B_ORANGE, fontWeight: 600 }}>Open →</div>
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#aaaabc", marginTop: 10, fontStyle: "italic" }}>All actions open centred modal overlays — same pattern as Volunteer My Space.</div>
          </div>

          {/* ─── III. History ─── */}
          <div id="history" ref={historyRef} style={card}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 4 }}>III · History</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: ACCENT_NAVY, marginBottom: 14 }}>Records by Edition</div>

            {/* Tab row */}
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {(["projects","volunteers","feedback","timelines"] as const).map(t => (
                <button key={t} onClick={() => setHistoryTab(t)} style={tabStyle(historyTab === t)}>
                  {t === "projects" ? "My Projects" : t === "volunteers" ? "My Volunteers" : t === "feedback" ? "My Feedback" : "Timelines"}
                </button>
              ))}
            </div>

            {/* Filter row */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
              <select style={{ fontSize: 11.5, padding: "4px 9px", border: "1px solid #e0e0e8", borderRadius: 6, background: "#f8f9ff", color: "#555", fontFamily: "'Noto Sans', sans-serif", outline: "none" }}>
                <option>Edition 23</option><option>Edition 22</option><option>Edition 21</option>
              </select>
              <select style={{ fontSize: 11.5, padding: "4px 9px", border: "1px solid #e0e0e8", borderRadius: 6, background: "#f8f9ff", color: "#555", fontFamily: "'Noto Sans', sans-serif", outline: "none" }}>
                <option>2025–26</option><option>2024–25</option><option>2023–24</option>
              </select>
              <button onClick={() => triggerToast("Generating export…")} style={{ marginLeft: "auto", fontSize: 12, color: B_ORANGE, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Export →</button>
            </div>

            {/* Table header */}
            {historyTab === "projects" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", gap: 8, padding: "7px 8px", background: "#f8f9ff", borderRadius: "7px 7px 0 0", borderBottom: "1px solid #e8e8f0", marginBottom: 0 }}>
                  {["Project name","Submitted","Status","Feedback"].map(h => (
                    <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.7px" }}>{h}</div>
                  ))}
                </div>
                {[
                  { title: "Website Development", submitted: "30-May-25", status: "Approved", feedback: "Pending" },
                  { title: "Mentor Support: Cls 4–9", submitted: "30-May-25", status: "Approved", feedback: "Submitted" },
                  { title: "Web Development & Updation", submitted: "14-Jul-23", status: "Approved", feedback: "Not initiated" },
                  ...projects.map((p: any) => ({ title: p.title, submitted: "01-Apr-26", status: p.status === "Active" ? "Approved" : p.status, feedback: p.status === "Closed" ? "Submitted" : "Pending" })),
                ].map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", gap: 8, padding: "10px 8px", borderBottom: "1px solid #f0f0f8", alignItems: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{row.title}</div>
                    <div style={{ fontSize: 12, color: "#777" }}>{row.submitted}</div>
                    <Badge status={row.status} />
                    <Badge status={row.feedback} />
                  </div>
                ))}
              </>
            )}

            {historyTab === "volunteers" && (
              <div style={{ padding: "8px 0", color: "#777", fontSize: 13 }}>
                {[
                  { name: "Priya Sharma", project: "Financial Literacy for Rural Women", status: "Active", hours: "12h" },
                  { name: "Amit Verma", project: "Digital Skills for Youth", status: "Matched", hours: "—" },
                  { name: "Sneha Rathore", project: "Community Health Awareness", status: "Completed", hours: "40h" },
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
              <div style={{ color: "#777", fontSize: 13, paddingTop: 8 }}>
                {[
                  { project: "Community Health Awareness", vol: "Sneha Rathore", submitted: "15-Mar-26", rating: 5 },
                  { project: "Financial Literacy for Rural Women", vol: "Priya Sharma", submitted: "Pending", rating: null },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderBottom: "1px solid #f0f0f8" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{f.project}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>Volunteer: {f.vol}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#888" }}>{f.submitted}</div>
                    <Badge status={f.rating ? "Submitted" : "Pending"} />
                  </div>
                ))}
              </div>
            )}

            {historyTab === "timelines" && (
              <div style={{ paddingTop: 8 }}>
                {[
                  { edition: "Edition 23 (ProEngage 2025–26)", open: "01 Dec 2025", close: "31 Mar 2026", status: "Active" },
                  { edition: "Edition 22 (ProEngage 2024–25)", open: "01 Dec 2024", close: "31 Mar 2025", status: "Closed" },
                  { edition: "Edition 21 (ProEngage 2023–24)", open: "01 Dec 2023", close: "31 Mar 2024", status: "Closed" },
                ].map((t, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", gap: 8, padding: "10px 8px", borderBottom: "1px solid #f0f0f8", alignItems: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{t.edition}</div>
                    <div style={{ fontSize: 12, color: "#777" }}>{t.open}</div>
                    <div style={{ fontSize: 12, color: "#777" }}>{t.close}</div>
                    <Badge status={t.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── IV. Resources ─── */}
          <div id="resources" ref={resourcesRef} style={card}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 4 }}>IV · Resources</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: ACCENT_NAVY, marginBottom: 14 }}>Resources &amp; Support</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: BookOpen, label: "E-Module / Orientation", sub: "Mandatory onboarding. Progress tracked by Admin.", action: () => triggerToast("Opening orientation module…") },
                { icon: FileText, label: "NGO Project Guide", sub: "Templates, guidelines, undertaking text.", action: () => triggerToast("Downloading project guide…") },
                { icon: Archive,  label: "Media Library", sub: "NGO-scoped photos + assets. View-only.", action: () => triggerToast("Opening media library…") },
                { icon: HelpCircle, label: "Help & Support", sub: "Opens support modal. Chatbot always available.", action: () => triggerToast("Opening support…") },
              ].map(({ icon: Icon, label, sub, action }) => (
                <div key={label} onClick={action}
                  style={{ background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "14px 14px", cursor: "pointer", transition: "border-color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = B_ORANGE)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e8f0")}>
                  <Icon size={16} color={B_ORANGE} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginTop: 6 }}>{label}</div>
                  <div style={{ fontSize: 11.5, color: "#888", marginTop: 3, lineHeight: 1.4 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT RAIL (148px sticky) ── */}
        <div style={{ position: "sticky", top: 108, display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Section nav */}
          <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 8 }}>Sections</div>
            {[
              { id: "snapshot",   label: "↑ Snapshot", ref: snapshotRef },
              { id: "activities", label: "Activities",  ref: activitiesRef },
              { id: "history",    label: "History",     ref: historyRef },
              { id: "resources",  label: "Resources",   ref: resourcesRef },
            ].map(({ id, label, ref }) => (
              <div key={id} onClick={() => scrollTo(ref)} style={railLink(activeSection === id)}>{label}</div>
            ))}
          </div>

          {/* Quick links */}
          <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 8 }}>Quick Links</div>
            {[
              { label: "Edit Profile",        action: () => navigate("profile") },
              { label: "Add Co-ordinator",    action: () => setModal("manageTeam") },
              { label: "View Timelines",       action: () => { scrollTo(historyRef); setHistoryTab("timelines"); } },
              { label: "Raise Grievance",      action: () => setModal("grievance") },
            ].map(({ label, action }) => (
              <div key={label} onClick={action} style={{ fontSize: 11, color: B_ORANGE, fontWeight: 600, padding: "5px 0", borderBottom: "1px solid #f0f0f8", cursor: "pointer" }}>{label}</div>
            ))}
          </div>

          {/* Edition status card */}
          <div style={{ background: P_ORANGE, border: `1px solid ${B_ORANGE}40`, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: B_ORANGE, marginBottom: 6 }}>PE Edition 23</div>
            <div style={{ fontSize: 11, color: B_ORANGE, fontWeight: 600 }}>Applications open</div>
            <div style={{ fontSize: 11, color: "#7c3000", marginTop: 3 }}>Closes 29 Jan 2026</div>
          </div>

        </div>
      </div>

      {/* ═══ MODALS ═══ */}

      {/* Add Project */}
      <DrawerShell open={modal === "addProject"} onClose={() => setModal(null)} title="Add New Project" width={600}>
        <AddProjectForm onClose={() => setModal(null)} onSubmit={() => { setModal(null); triggerToast("Project submitted for TSG Admin review."); }} />
      </DrawerShell>

      {/* View / Edit Projects */}
      <DrawerShell open={modal === "viewProjects"} onClose={() => setModal(null)} title="My Projects" width={580}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            {["All","Active","Under Review","Draft","Closed"].map(f => (
              <span key={f} style={{ fontSize: 12, padding: "4px 11px", border: "1px solid #e0e0e8", borderRadius: 6, color: "#555", cursor: "pointer", fontWeight: 500 }}>{f}</span>
            ))}
          </div>
          {projects.map((p: any) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid #f0f0f8" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{p.title}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>Vol: {p.volunteers ?? 0} matched · {p.applications ?? 0} applications</div>
              </div>
              <Badge status={p.status} />
              <button onClick={() => triggerToast("Opening editor…")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa" }}><Edit2 size={14} /></button>
            </div>
          ))}
          <button onClick={() => triggerToast("Downloading project export…")} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: B_ORANGE, background: "none", border: "none", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>
            <Download size={13} /> Export Project Details (Excel)
          </button>
        </div>
      </DrawerShell>

      {/* Review Applications */}
      <DrawerShell open={modal === "reviewApplications"} onClose={() => setModal(null)} title="Review Applications" width={560}>
        <div>
          <div style={{ display: "flex", gap: 6, padding: "4px", background: "#f0f0f4", borderRadius: 9, marginBottom: 14 }}>
            {(["shortlist","all"] as const).map(t => (
              <button key={t} onClick={() => setAppTab(t)} style={{ flex: 1, padding: "7px 0", borderRadius: 7, border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans', sans-serif", background: appTab === t ? "#fff" : "transparent", color: appTab === t ? B_INDIGO : "#777", boxShadow: appTab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                {t === "shortlist" ? "🤖 AI Shortlist" : `All (${applicants.length})`}
              </button>
            ))}
          </div>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
            <input placeholder="Search name or skill…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: "100%", paddingLeft: 32, padding: "8px 12px 8px 32px", border: "1px solid #e0e0e8", borderRadius: 8, fontSize: 13, fontFamily: "'Noto Sans', sans-serif", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
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
            <button onClick={() => { shortlisted.filter(a => a.status === "Pending").forEach(a => handleAccept(a.id)); triggerToast(`Bulk accepted ${shortlisted.length} volunteers.`); }}
              style={{ width: "100%", marginTop: 12, padding: "10px", background: B_INDIGO, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>
              Bulk Accept Top {shortlisted.filter(a => a.status === "Pending").length}
            </button>
          )}
        </div>
      </DrawerShell>

      {/* Applicant detail */}
      <DrawerShell open={modal === "selectedApplicant"} onClose={() => setModal("reviewApplications")} title="Volunteer Profile" width={520}>
        {selectedApplicant && (
          <ApplicantModal applicant={selectedApplicant} onAccept={() => handleAccept(selectedApplicant.id)} onReject={() => handleReject(selectedApplicant.id)} onClose={() => setModal("reviewApplications")} />
        )}
      </DrawerShell>

      {/* Submit Feedback */}
      <DrawerShell open={modal === "feedback"} onClose={() => setModal(null)} title="Submit Volunteer Feedback" width={560}>
        {modal === "feedback" && (
          <div>
            {/* Project selector */}
            {!feedbackProject && (
              <div style={{ marginBottom: 14 }}>
                <Label>Select Project</Label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {projects.filter((p: any) => ["Active","Closed"].includes(p.status)).map((p: any) => (
                    <button key={p.id} onClick={() => setFeedbackProject(p)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f8f9ff", border: "1px solid #e8e8f0", borderRadius: 10, cursor: "pointer", fontFamily: "'Noto Sans', sans-serif", textAlign: "left" }}>
                      <MessageSquare size={16} color={B_ORANGE} />
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{p.title}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>{p.volunteers ?? 0} volunteers · {p.status}</div>
                      </div>
                      <ChevronRight size={14} color="#aaa" style={{ marginLeft: "auto" }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {feedbackProject && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "8px 12px", background: P_ORANGE, borderRadius: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: B_ORANGE, flex: 1 }}>{feedbackProject.title}</div>
                  <button onClick={() => setFeedbackProject(null)} style={{ fontSize: 11, color: B_ORANGE, background: "none", border: "none", cursor: "pointer" }}>← Change</button>
                </div>
                <FeedbackForm project={feedbackProject} onClose={() => { setModal(null); setFeedbackProject(null); }} onSubmit={() => { setModal(null); setFeedbackProject(null); triggerToast("Feedback submitted. TSG Admin notified."); }} />
              </>
            )}
          </div>
        )}
      </DrawerShell>

      {/* Health Update */}
      <DrawerShell open={modal === "healthUpdate"} onClose={() => setModal(null)} title="Project Health Update" width={480}>
        <HealthUpdateForm projects={projects} onClose={() => setModal(null)} onSubmit={() => { setModal(null); triggerToast("Health update submitted. TSG Admin notified."); }} />
      </DrawerShell>

      {/* Manage Team */}
      <DrawerShell open={modal === "manageTeam"} onClose={() => setModal(null)} title="Manage Team / Co-ordinators" width={520}>
        <ManageTeamModal
          coordinators={coordinators}
          onAdd={c => { setCoordinators(prev => [...prev, c]); triggerToast("Co-ordinator added successfully."); }}
          onDelete={id => { setCoordinators(prev => prev.filter(c => c.id !== id)); triggerToast("Co-ordinator removed."); }}
          onClose={() => setModal(null)} />
      </DrawerShell>

      {/* Grievance */}
      <DrawerShell open={modal === "grievance"} onClose={() => setModal(null)} title="Raise a Grievance" width={500}>
        <div>
          <div style={{ marginBottom: 12 }}>
            <Label>Project</Label>
            <FSelect value={grievanceForm.projectId} onChange={v => setGrievanceForm(f => ({ ...f, projectId: v }))} options={["Select a project…", ...projects.filter((p: any) => p.status === "Active").map((p: any) => p.title)]} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>Category</Label>
            <FSelect value={grievanceForm.category} onChange={v => setGrievanceForm(f => ({ ...f, category: v }))} options={["Select category…","Volunteer conduct","Communication breakdown","Project scope disagreement","Scheduling conflict","Platform / technical issue","Other"]} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <Label>Description</Label>
            <textarea value={grievanceForm.description} onChange={e => setGrievanceForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the issue clearly. TSG Admin will acknowledge within 2 working days." rows={4}
              style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, fontFamily: "'Noto Sans', sans-serif", color: ACCENT_NAVY, outline: "none", resize: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 10, fontSize: 11.5, color: "#888", fontStyle: "italic" }}>Only 1 open grievance per active project at a time. Auto-acknowledgement sent on submission.</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setModal(null)} style={{ flex: 1, padding: "10px", background: "#f8f8fc", border: "1px solid #e0e0e8", borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Cancel</button>
            <button onClick={() => {
              if (!grievanceForm.category || !grievanceForm.description || !grievanceForm.projectId) { triggerToast("Please fill all fields."); return; }
              setSubmittedGrievances(prev => [...prev, { ...grievanceForm, id: Date.now(), status: "Open", date: new Date().toLocaleDateString() }]);
              setGrievanceForm({ projectId: "", category: "", description: "" });
              setModal(null);
              triggerToast("Grievance submitted. TSG Admin notified. Auto-acknowledgement sent.");
            }} style={{ flex: 1, padding: "10px", background: B_RED, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Submit Grievance</button>
          </div>
        </div>
      </DrawerShell>

    </div>
  );
};

export default NGODashboardView;
