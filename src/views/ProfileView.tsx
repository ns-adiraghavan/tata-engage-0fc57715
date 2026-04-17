import { useState, useEffect } from "react";
import badgeVeteran    from "@/assets/badges/veteran.svg";
import badgeAmbassador from "@/assets/badges/ambassador.svg";
import badgeNorthStar  from "@/assets/badges/northstar.svg";
import badgeLead       from "@/assets/badges/lead.svg";
import badgeChampion   from "@/assets/badges/champion.png";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";

// ─── Brand tokens ──────────────────────────────────────────────────────────────
// ── Banner: teal-blue primary + complementary green accent ──────
const BANNER        = "#0B7285";   // teal-blue primary — banner, subheaders
const BANNER_DARK   = "#065666";   // darker teal for gradient
const BANNER_DEEP   = "#044a56";   // deepest teal
const B_GREEN       = "#2E7D32";   // complementary green accent
const P_GREEN       = "#E8F5E9";   // green pastel
const B_CYAN        = "#0891b2";   // mid cyan for highlights
const P_CYAN        = "#E0F7FA";   // cyan pastel

// ── Active-state / pill accent colours ──────────────────────────
const ACCENT_ACTIVE = "#0B7285";   // teal-blue for tab active, section headings
const PILL_BG       = "#E0F7FA";   // cyan-light for pills/chips
const PILL_FG       = "#0B7285";   // teal text on pills

// ── Standard brand tokens ────────────────────────────────────────
const B_INDIGO      = "#333399";
const B_RED         = "#E8401C";
const B_BLUE        = "#1E6BB8";
const B_ORANGE      = "#C14D00";
const ACCENT_NAVY   = "#0D1B3E";
const P_INDIGO      = "#EEF0FF";
const P_RED         = "#FFF0EE";
const P_ORANGE      = "#FFF0E6";

// ── KPI palette — green, blue, yellow/amber, magenta-pink ────────
const C_GREEN_KPI   = "#2E7D32";   const CP_GREEN   = "#E8F5E9";
const C_MIDBLUE     = "#1565C0";   const CP_MIDBLUE = "#E3F2FD";
const C_AMBER       = "#A16207";   const CP_AMBER   = "#FEF9C3";
const C_PINK        = "#C2185B";   const CP_PINK    = "#FCE4EC";
// Cert tile uses teal-blue theme
const C_TEAL_CERT   = "#0B7285";   const CP_TEAL_CERT = "#E0F7FA";

// ─── Dropdown data ─────────────────────────────────────────────────────────────
const TITLES         = ["Mr","Ms","Mrs","Dr","Prof"];
const GENDERS        = ["Male","Female","Non-binary","Prefer not to say"];
const COMPANIES      = ["Tata Consultancy Services","Tata Steel","Tata Motors","Titan","Tata Power","IHCL (Taj Hotels)","Tata Chemicals","Tata Consumer Products","Tata Communications","Trent","Other Tata Company"];
const DESIGNATIONS   = ["Manager","Senior Manager","Director","Vice President","Senior Vice President","Associate","Senior Associate","Analyst","Senior Analyst","Consultant","Senior Consultant","Project Manager","Senior Project Manager","Others"];
const FUNCTIONS      = ["Technology","Finance","HR & People","Marketing","Operations","Legal","Strategy","Research & Development","Product Management","Others"];
const EDU_QUALS      = ["MBA","B.Tech / B.E.","CA","LLB","MBBS","M.Tech","BA / B.Com / B.Sc","Ph.D","Others"];
const COUNTRIES      = ["India","United States","United Kingdom","Singapore","Australia","Canada","UAE","Others"];
const CITIES_INDIA   = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Pune","Kolkata","Ahmedabad","Jamshedpur","Noida","Gurgaon","Other City"];
const SKILLS_LIST    = ["Accounting and Finance","Administration","Coaching and Training","Content Writing / Documentation","Fundraising","IT Enabled Services","Legal","Management and Strategy","Marketing and Communications","Operations and Logistics","Project Management","Research","Strategic Planning","Translation","Others"];
const INTERESTS_LIST = ["Adult Literacy","Advocacy","Animals","Architecture and Heritage","Children","Community Development","Disability Support","Disaster Response","Education","Environment and Sustainability","Health Safety and Wellness","Persons with Disabilities","Women Empowerment","Youth","Others"];
const LANGUAGES_LIST = ["English","Hindi","Marathi","Tamil","Telugu","Kannada","Bengali","Gujarati","Malayalam","Punjabi","Odia","Urdu","Others"];
const GEOGRAPHIES    = ["Global","North India","South India","West India","East India","UK & Europe","Americas","APAC"];
const NGO_AREAS      = ["Education","Health","Environment","Livelihoods","Technology","Finance","Gender Equality","Disability","Children","Others"];

// ─── Shared field components ───────────────────────────────────────────────────
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ fontSize: 10.5, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 7 }}>
      {children}{required && <span style={{ color: B_RED, marginLeft: 3 }}>*</span>}
    </div>
  );
}

function ReadOnly({ value }: { value: string }) {
  return <div style={{ fontSize: 14, fontWeight: 600, color: ACCENT_NAVY, padding: "10px 0", borderBottom: "1px solid #f0f0f8" }}>{value || "—"}</div>;
}

function TextInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 9, padding: "10px 13px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", boxSizing: "border-box" }}
      onFocus={e => (e.target.style.borderColor = ACCENT_ACTIVE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 9, padding: "10px 13px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", appearance: "none", background: "#fff", cursor: "pointer", boxSizing: "border-box" }}
      onFocus={e => (e.target.style.borderColor = ACCENT_ACTIVE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!on)}
      style={{ position: "relative", width: 40, height: 22, borderRadius: 11, background: on ? ACCENT_ACTIVE : "#d0d0e0", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
    </div>
  );
}

function MultiSelectList({ selected, onChange, options, maxH = 160 }: { selected: string[]; onChange: (v: string[]) => void; options: string[]; maxH?: number }) {
  const toggle = (val: string) => onChange(selected.includes(val) ? selected.filter(x => x !== val) : [...selected, val]);
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10, minHeight: 32 }}>
        {selected.map(s => (
          <span key={s} style={{ background: PILL_BG, color: PILL_FG, fontSize: 12.5, fontWeight: 600, padding: "4px 12px", borderRadius: 100, display: "flex", alignItems: "center", gap: 6 }}>
            {s}<span onClick={() => toggle(s)} style={{ cursor: "pointer", opacity: 0.6, fontSize: 13, lineHeight: 1 }}>×</span>
          </span>
        ))}
        {selected.length === 0 && <span style={{ fontSize: 13, color: "#aaaabc" }}>None selected</span>}
      </div>
      <div style={{ border: "1.5px solid #e0e0e8", borderRadius: 9, maxHeight: maxH, overflowY: "auto" }}>
        {options.map(o => (
          <div key={o} onClick={() => toggle(o)}
            style={{ padding: "9px 14px", fontSize: 13, cursor: "pointer", color: ACCENT_NAVY, display: "flex", alignItems: "center", gap: 10, background: selected.includes(o) ? P_CYAN : "transparent", transition: "background 0.1s" }}>
            <div style={{ width: 15, height: 15, borderRadius: 4, border: `2px solid ${selected.includes(o) ? ACCENT_ACTIVE : "#dddde8"}`, background: selected.includes(o) ? ACCENT_ACTIVE : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {selected.includes(o) && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            {o}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#aaaabc", marginTop: 5 }}>Press to select / deselect. Multiple selections allowed.</div>
    </div>
  );
}

function SectionHeading({ label, accent }: { label: string; accent?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, marginTop: 30 }}>
      <div style={{ width: 3, height: 18, borderRadius: 2, background: accent ?? ACCENT_ACTIVE }} />
      <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT_ACTIVE }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    Active:   [P_CYAN, ACCENT_ACTIVE],
    Inactive: ["#f0f0f4", "#888"],
    Pending:  ["#FEF6E4", "#9a6500"],
    Approved: [P_CYAN, ACCENT_ACTIVE],
  };
  const [bg, color] = map[status] ?? ["#f0f0f0", "#555"];
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap" }}>{status}</span>;
}

// ─── KPI Stat Tile ─────────────────────────────────────────────────────────────
function KpiTile({ value, label, pastel, accent }: { value: string | number; label: string; pastel: string; accent: string }) {
  return (
    <div style={{ background: pastel, border: `1px solid ${accent}22`, borderRadius: 12, padding: "16px 14px", textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 26, fontWeight: 900, color: accent, letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: accent, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.8, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 3000); };
  return { msg, show };
}

// ─── SPOC mock data ───────────────────────────────────────────────────────────
const SPOC_DIRECTORY = [
  { id: 2, name: "Anjali Gupta",    role: "Regional SPOC", geography: "North India", status: "Active",   email: "anjali.g@tcs.com",    lastActive: "1 hour ago" },
  { id: 3, name: "Vikram Malhotra", role: "Regional SPOC", geography: "West India",  status: "Inactive", email: "v.malhotra@tcs.com",   lastActive: "3 days ago" },
  { id: 4, name: "Karan Johar",     role: "Regional SPOC", geography: "East India",  status: "Active",   email: "karan.j@tcs.com",      lastActive: "1 day ago"  },
];

const FAMILY_MEMBERS = [
  { id: 1, name: "Pooja Desai",  relationship: "Spouse",  email: "pooja.d@gmail.com",  status: "Active",  joinedDate: "Mar 2025" },
  { id: 2, name: "Arjun Desai",  relationship: "Son",     email: "arjun.d@gmail.com",  status: "Pending", joinedDate: "Apr 2026" },
];

// ─── Volunteer profile state & init ──────────────────────────────────────────
type ProfileState = {
  title: string; firstName: string; lastName: string; gender: string;
  birthDate: string; officialEmail: boolean; email: string;
  company: string; designation: string; designationDetail: string;
  function_: string; functionDetail: string; eduQual: string; eduQualDetail: string;
  country: string; city: string; cityDetail: string;
  phoneCountryCode: string; phoneArea: string; phoneNum: string;
  mobileCountryCode: string; mobileNum: string;
  skills: string[]; interests: string[]; languages: string[];
  preferredMode: string; disasterResponseInterest: boolean;
  linkedinUrl: string;
  notifyProEngage: boolean; notifyTVW: boolean; notifyEmail: boolean;
  spocTier: string; spocGeography: string; spocOrientationDone: boolean;
  spocCompanyEmail: string; spocMobileNum: string;
};

function initProfile(role?: string): ProfileState {
  const isSPOC = role === "corporate_spoc" || role === "regional_spoc";
  if (!isSPOC) {
    return {
      title: "Mr", firstName: "Shrirang", lastName: "Dhavale", gender: "Male",
      birthDate: "1974-09-29", officialEmail: true, email: "sdhavale@tata.com",
      company: "Tata Services", designation: "General Manager",
      designationDetail: "",
      function_: "Other", functionDetail: "",
      eduQual: "MBA", eduQualDetail: "Master's Degree",
      country: "India", city: "Mumbai", cityDetail: "",
      phoneCountryCode: "91", phoneArea: "022", phoneNum: "66657267",
      mobileCountryCode: "91", mobileNum: "9619551533",
      skills: ["Coaching", "Training"],
      interests: ["Education"],
      languages: ["English", "Hindi", "Marathi"],
      preferredMode: "Either", disasterResponseInterest: false,
      linkedinUrl: "",
      notifyProEngage: true, notifyTVW: true, notifyEmail: true,
      spocTier: "", spocGeography: "", spocOrientationDone: false,
      spocCompanyEmail: "", spocMobileNum: "",
    };
  }
  return {
    title: "Mr", firstName: "Rohan", lastName: "Desai", gender: "Male",
    birthDate: "1987-03-22", officialEmail: true, email: "rohan.desai@tcs.com",
    company: "Tata Consultancy Services", designation: "Senior Project Manager",
    designationDetail: "Program Manager — Volunteering & CSR",
    function_: "HR & People", functionDetail: "Corporate Social Responsibility",
    eduQual: "MBA", eduQualDetail: "XLRI Jamshedpur, 2010",
    country: "India", city: "Mumbai", cityDetail: "",
    phoneCountryCode: "91", phoneArea: "022", phoneNum: "66660000",
    mobileCountryCode: "91", mobileNum: "9876543210",
    skills: ["Project Management", "Stakeholder Coordination", "Strategy", "Operations"],
    interests: ["Education", "Digital Literacy", "Mentorship"],
    languages: ["English", "Hindi", "Marathi"],
    preferredMode: "Either", disasterResponseInterest: true,
    linkedinUrl: "https://linkedin.com/in/rohandesai",
    notifyProEngage: true, notifyTVW: true, notifyEmail: true,
    spocTier: "Corporate SPOC", spocGeography: "Global",
    spocOrientationDone: false, spocCompanyEmail: "rohan.desai@tcs.com", spocMobileNum: "9876543210",
  };
}

// ─── NGO profile state & init ─────────────────────────────────────────────────
type NGOProfileState = {
  contactName: string; contactTitle: string; designation: string;
  email: string; mobile: string; phone: string;
  orgName: string; orgType: string; tier: string;
  registrationNo: string; panNo: string;
  focusArea: string[]; city: string; state: string; country: string; pincode: string;
  website: string; linkedinUrl: string;
  notifyProEngage: boolean; notifyPlatform: boolean; notifyEmail: boolean;
};

function initNGOProfile(): NGOProfileState {
  return {
    contactName: "Anjali Mehta", contactTitle: "Ms", designation: "Program Director",
    email: "anjali.mehta@pratham.org", mobile: "9821000001", phone: "",
    orgName: "Pratham Foundation", orgType: "NGO", tier: "Lead Partner",
    registrationNo: "NGO-MH-2010-00234", panNo: "AABCP1234L",
    focusArea: ["Education", "Children"],
    city: "Mumbai", state: "Maharashtra", country: "India", pincode: "400001",
    website: "https://pratham.org", linkedinUrl: "",
    notifyProEngage: true, notifyPlatform: true, notifyEmail: true,
  };
}

type VolTab = "personal" | "professional" | "volunteering" | "spoc" | "notification";
type NGOTab = "contact" | "organisation" | "notification";

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function ProfileView() {
  const { user } = useAuth();
  const { ngoData, triggerToast } = useAppContext();
  const { show: toast, msg: toastMsg } = useToast();

  const IS_SPOC = user?.role === "corporate_spoc" || user?.role === "regional_spoc";
  const IS_NGO  = user?.role === "ngo" || (user == null && false);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [isEditing, setIsEditing]  = useState(false);
  const [volTab, setVolTab]  = useState<VolTab>("personal");
  const [profile, setProfile]      = useState<ProfileState>(() => initProfile(user?.role));
  const [saved, setSaved]          = useState<ProfileState>(() => initProfile(user?.role));
  const [spocDir, setSpocDir]      = useState(SPOC_DIRECTORY);

  const [ngoTab, setNgoTab] = useState<NGOTab>("contact");
  const [ngoProfile, setNgoProfile] = useState<NGOProfileState>(initNGOProfile);
  const [ngoSaved, setNgoSaved]     = useState<NGOProfileState>(initNGOProfile);

  const set  = (field: keyof ProfileState, val: any) => setProfile(p => ({ ...p, [field]: val }));
  const setN = (field: keyof NGOProfileState, val: any) => setNgoProfile(p => ({ ...p, [field]: val }));

  const handleSave    = () => { setSaved({ ...profile }); setIsEditing(false); toast("Profile saved successfully."); };
  const handleCancel  = () => { setProfile({ ...saved }); setIsEditing(false); };
  const handleNGOSave = () => { setNgoSaved({ ...ngoProfile }); setIsEditing(false); toast("NGO profile saved successfully."); };
  const handleNGOCancel = () => { setNgoProfile({ ...ngoSaved }); setIsEditing(false); };

  const gridRow: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 };
  const col: React.CSSProperties     = { display: "flex", flexDirection: "column" };

  const VOL_TABS: { id: VolTab; label: string; spocOnly?: boolean }[] = [
    { id: "personal",      label: "Personal Information" },
    { id: "professional",  label: "Professional Details" },
    { id: "volunteering",  label: "Volunteering Preferences" },
    ...(IS_SPOC ? [{ id: "spoc" as VolTab, label: "SPOC Profile", spocOnly: true }] : []),
    { id: "notification",  label: "Notification Settings" },
  ];

  const NGO_TABS: { id: NGOTab; label: string }[] = [
    { id: "contact",      label: "Contact Details" },
    { id: "organisation", label: "Organisation Info" },
    { id: "notification", label: "Notification Settings" },
  ];

  // ─── Tab: Personal ────────────────────────────────────────────────────────
  const PersonalTab = () => (
    <div>
      <SectionHeading label="Name & Identity" />
      <div style={gridRow}>
        <div style={col}><FieldLabel>Title</FieldLabel>{isEditing ? <SelectInput value={profile.title} onChange={v => set("title", v)} options={TITLES} /> : <ReadOnly value={profile.title} />}</div>
        <div style={col}><FieldLabel>Gender</FieldLabel>{isEditing ? <SelectInput value={profile.gender} onChange={v => set("gender", v)} options={GENDERS} /> : <ReadOnly value={profile.gender} />}</div>
      </div>
      <div style={gridRow}>
        <div style={col}><FieldLabel required>First Name</FieldLabel><ReadOnly value={profile.firstName} /><div style={{ fontSize: 11, color: "#aaaabc", marginTop: 4 }}>Locked — contact Admin to update.</div></div>
        <div style={col}><FieldLabel required>Last Name</FieldLabel><ReadOnly value={profile.lastName} /><div style={{ fontSize: 11, color: "#aaaabc", marginTop: 4 }}>Locked — contact Admin to update.</div></div>
      </div>
      <div style={{ ...gridRow, marginBottom: 0 }}>
        <div style={col}><FieldLabel>Date of Birth</FieldLabel>{isEditing ? <TextInput type="date" value={profile.birthDate} onChange={v => set("birthDate", v)} /> : <ReadOnly value={new Date(profile.birthDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })} />}</div>
        <div style={col} />
      </div>
      <SectionHeading label="Contact Details" />
      <div style={gridRow}>
        <div style={col}>
          <FieldLabel required>Email Address</FieldLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><span style={{ fontSize: 12, color: "#6b6b7a" }}>Use official Tata email</span><Toggle on={profile.officialEmail} onChange={v => set("officialEmail", v)} /></div>
          <ReadOnly value={profile.email} /><div style={{ fontSize: 11, color: "#aaaabc", marginTop: 4 }}>Locked — contact Admin to update.</div>
        </div>
        <div style={col}><FieldLabel>LinkedIn URL</FieldLabel>{isEditing ? <TextInput value={profile.linkedinUrl} onChange={v => set("linkedinUrl", v)} placeholder="https://linkedin.com/in/..." /> : <ReadOnly value={profile.linkedinUrl || "Not provided"} />}</div>
      </div>
      <div style={gridRow}>
        <div style={col}>
          <FieldLabel>Phone (Landline)</FieldLabel>
          {isEditing ? (
            <div style={{ display: "flex", gap: 6 }}>
              <input value={profile.phoneCountryCode} onChange={e => set("phoneCountryCode", e.target.value)} placeholder="+91" style={{ width: 54, border: "1.5px solid #e0e0e8", borderRadius: 9, padding: "10px 8px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", textAlign: "center" }} />
              <input value={profile.phoneArea} onChange={e => set("phoneArea", e.target.value)} placeholder="022" style={{ width: 60, border: "1.5px solid #e0e0e8", borderRadius: 9, padding: "10px 8px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", textAlign: "center" }} />
              <input value={profile.phoneNum} onChange={e => set("phoneNum", e.target.value)} placeholder="66660000" style={{ flex: 1, border: "1.5px solid #e0e0e8", borderRadius: 9, padding: "10px 12px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none" }} />
            </div>
          ) : <ReadOnly value={`+${profile.phoneCountryCode} (${profile.phoneArea}) ${profile.phoneNum}`} />}
        </div>
        <div style={col}>
          <FieldLabel>Mobile</FieldLabel>
          {isEditing ? (
            <div style={{ display: "flex", gap: 6 }}>
              <input value={profile.mobileCountryCode} onChange={e => set("mobileCountryCode", e.target.value)} placeholder="+91" style={{ width: 54, border: "1.5px solid #e0e0e8", borderRadius: 9, padding: "10px 8px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", textAlign: "center" }} />
              <input value={profile.mobileNum} onChange={e => set("mobileNum", e.target.value)} placeholder="9876543210" style={{ flex: 1, border: "1.5px solid #e0e0e8", borderRadius: 9, padding: "10px 12px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none" }} />
            </div>
          ) : <ReadOnly value={`+${profile.mobileCountryCode} ${profile.mobileNum}`} />}
        </div>
      </div>
      <SectionHeading label="Location" />
      <div style={gridRow}>
        <div style={col}><FieldLabel required>Country</FieldLabel>{isEditing ? <SelectInput value={profile.country} onChange={v => set("country", v)} options={COUNTRIES} /> : <ReadOnly value={profile.country} />}</div>
        <div style={col}>
          <FieldLabel required>City / Location</FieldLabel>
          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <SelectInput value={profile.city} onChange={v => set("city", v)} options={CITIES_INDIA} />
              {profile.city === "Other City" && <TextInput value={profile.cityDetail} onChange={v => set("cityDetail", v)} placeholder="Enter your city" />}
            </div>
          ) : <ReadOnly value={profile.city} />}
        </div>
      </div>
      <SectionHeading label="Profile Photo" />
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: P_CYAN, border: `2px dashed ${ACCENT_ACTIVE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: ACCENT_ACTIVE, flexShrink: 0 }}>
          {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
        </div>
        {isEditing ? (
          <div><button onClick={() => toast("Photo upload coming soon.")} style={{ fontSize: 13, fontWeight: 600, color: ACCENT_ACTIVE, background: P_CYAN, border: `1px solid ${B_CYAN}`, borderRadius: 9, padding: "8px 16px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Upload Photo</button><div style={{ fontSize: 11, color: "#aaaabc", marginTop: 5 }}>JPG or PNG, max 2MB. Square crop recommended.</div></div>
        ) : <div style={{ fontSize: 13, color: "#6b6b7a" }}>No photo uploaded. Edit profile to add one.</div>}
      </div>
    </div>
  );

  // ─── Tab: Professional ────────────────────────────────────────────────────
  const ProfessionalTab = () => (
    <div>
      <SectionHeading label="Employment Details" />
      <div style={gridRow}>
        <div style={col}><FieldLabel required>Tata Company</FieldLabel>{isEditing ? <SelectInput value={profile.company} onChange={v => set("company", v)} options={COMPANIES} /> : <ReadOnly value={profile.company} />}</div>
        <div style={col} />
      </div>
      <div style={gridRow}>
        <div style={col}>
          <FieldLabel>Designation</FieldLabel>
          {isEditing ? (<div style={{ display: "flex", flexDirection: "column", gap: 6 }}><SelectInput value={profile.designation} onChange={v => set("designation", v)} options={DESIGNATIONS} /><TextInput value={profile.designationDetail} onChange={v => set("designationDetail", v)} placeholder="e.g. Program Manager — Volunteering & CSR" /></div>)
          : <ReadOnly value={`${profile.designation} — ${profile.designationDetail}`} />}
        </div>
        <div style={col}>
          <FieldLabel>Function / Department</FieldLabel>
          {isEditing ? (<div style={{ display: "flex", flexDirection: "column", gap: 6 }}><SelectInput value={profile.function_} onChange={v => set("function_", v)} options={FUNCTIONS} />{profile.function_ === "Others" && <TextInput value={profile.functionDetail} onChange={v => set("functionDetail", v)} placeholder="Describe your function" />}</div>)
          : <ReadOnly value={profile.function_} />}
        </div>
      </div>
      <SectionHeading label="Education" />
      <div style={gridRow}>
        <div style={col}>
          <FieldLabel>Highest Qualification</FieldLabel>
          {isEditing ? (<div style={{ display: "flex", flexDirection: "column", gap: 6 }}><SelectInput value={profile.eduQual} onChange={v => set("eduQual", v)} options={EDU_QUALS} /><TextInput value={profile.eduQualDetail} onChange={v => set("eduQualDetail", v)} placeholder="e.g. XLRI Jamshedpur, 2010" /></div>)
          : <ReadOnly value={`${profile.eduQual} — ${profile.eduQualDetail}`} />}
        </div>
        <div style={col}>
          <FieldLabel>LinkedIn Profile</FieldLabel>
          {isEditing ? <TextInput value={profile.linkedinUrl} onChange={v => set("linkedinUrl", v)} placeholder="https://linkedin.com/in/…" /> : (
            <div style={{ fontSize: 14, fontWeight: 600, color: B_BLUE, padding: "10px 0", borderBottom: "1px solid #f0f0f8" }}>
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: B_BLUE, textDecoration: "none" }}>{profile.linkedinUrl || "Not provided"}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ─── Tab: Volunteering Preferences ───────────────────────────────────────
  const VolunteeringTab = () => (
    <div>
      <SectionHeading label="Skills" />
      <FieldLabel>Select all that apply</FieldLabel>
      {isEditing ? <MultiSelectList selected={profile.skills} onChange={v => set("skills", v)} options={SKILLS_LIST} maxH={180} /> : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {profile.skills.map(s => <span key={s} style={{ background: PILL_BG, color: PILL_FG, fontSize: 12.5, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>{s}</span>)}
        </div>
      )}
      <SectionHeading label="Areas of Interest" />
      <FieldLabel>Causes you care about</FieldLabel>
      {isEditing ? <MultiSelectList selected={profile.interests} onChange={v => set("interests", v)} options={INTERESTS_LIST} maxH={180} /> : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {profile.interests.map(s => <span key={s} style={{ background: P_GREEN, color: B_GREEN, fontSize: 12.5, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>{s}</span>)}
        </div>
      )}
      <SectionHeading label="Languages" />
      {isEditing ? <MultiSelectList selected={profile.languages} onChange={v => set("languages", v)} options={LANGUAGES_LIST} maxH={140} /> : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {profile.languages.map(l => <span key={l} style={{ background: "#EBF4FF", color: B_BLUE, fontSize: 12.5, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>{l}</span>)}
        </div>
      )}
      <SectionHeading label="Mode & Availability" />
      <div style={gridRow}>
        <div style={col}>
          <FieldLabel>Preferred Mode</FieldLabel>
          {isEditing ? (
            <div style={{ display: "flex", gap: 10 }}>
              {["Remote","In-Person","Either"].map(m => (
                <label key={m} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", color: ACCENT_NAVY, fontFamily: "'DM Sans', sans-serif" }}>
                  <input type="radio" name="mode" checked={profile.preferredMode === m} onChange={() => set("preferredMode", m)} style={{ accentColor: ACCENT_ACTIVE }} />{m}
                </label>
              ))}
            </div>
          ) : <ReadOnly value={profile.preferredMode} />}
        </div>
        <div style={col}>
          <FieldLabel>Disaster Response Interest</FieldLabel>
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 4 }}>
              <Toggle on={profile.disasterResponseInterest} onChange={v => set("disasterResponseInterest", v)} />
              <span style={{ fontSize: 13, color: "#6b6b7a" }}>Yes, I'd like to be notified for disaster response calls</span>
            </div>
          ) : <ReadOnly value={profile.disasterResponseInterest ? "Yes — opted in for DR alerts" : "Not opted in"} />}
        </div>
      </div>
    </div>
  );

  // ─── Tab: SPOC Profile ────────────────────────────────────────────────────
  const SPOCTab = () => (
    <div>
      <div style={{ background: P_CYAN, border: `1.5px solid ${B_CYAN}`, borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 24 }}>🧑‍💼</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT_ACTIVE }}>Corporate SPOC — Tata Consultancy Services</div>
          <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 3 }}>This role was assigned by TSG Admin. Contact Admin to change your SPOC tier or geography.</div>
        </div>
      </div>
      <SectionHeading label="SPOC Contact Details" />
      <div style={gridRow}>
        <div style={col}><FieldLabel>Official SPOC Email</FieldLabel><ReadOnly value={profile.spocCompanyEmail} /><div style={{ fontSize: 11, color: "#aaaabc", marginTop: 4 }}>Locked — contact Admin to update.</div></div>
        <div style={col}><FieldLabel>SPOC Mobile</FieldLabel>{isEditing ? <TextInput value={profile.spocMobileNum} onChange={v => set("spocMobileNum", v)} placeholder="9876543210" /> : <ReadOnly value={`+91 ${profile.spocMobileNum}`} />}</div>
      </div>
      <div style={gridRow}>
        <div style={col}><FieldLabel>SPOC Tier</FieldLabel><ReadOnly value={profile.spocTier} /></div>
        <div style={col}><FieldLabel>Geography / Scope</FieldLabel>{isEditing ? <SelectInput value={profile.spocGeography} onChange={v => set("spocGeography", v)} options={GEOGRAPHIES} /> : <ReadOnly value={profile.spocGeography} />}</div>
      </div>
      <SectionHeading label="Orientation Progress" />
      <div style={{ background: "#fafafa", border: "1px solid #e8e8f0", borderRadius: 12, padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY }}>SPOC Orientation Module</div>
          <span style={{ background: "#FEF6E4", color: "#9a6500", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>2 of 5 complete</span>
        </div>
        <div style={{ height: 8, background: "#e8e8f0", borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: "100%", width: "40%", background: ACCENT_ACTIVE, borderRadius: 4 }} />
        </div>
        <div style={{ fontSize: 12, color: "#6b6b7a", marginBottom: 12 }}>Complete all 5 modules to receive your SPOC certification. Admin tracks progress.</div>
        <button onClick={() => toast("Opening orientation module 3…")} style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: ACCENT_ACTIVE, border: "none", borderRadius: 9, padding: "8px 18px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Continue Orientation →</button>
      </div>
      <SectionHeading label="Regional SPOCs Under Me" />
      <div style={{ border: "1px solid #e8e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr", gap: 12, padding: "10px 16px", background: "#f8f8fc", borderBottom: "1px solid #e8e8f0" }}>
          {["Name","Role","Geography","Status",""].map(h => <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</div>)}
        </div>
        {spocDir.map((s, i) => (
          <div key={s.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr", gap: 12, padding: "11px 16px", borderBottom: i < spocDir.length - 1 ? "1px solid #f0f0f8" : "none", alignItems: "center" }}>
            <div><div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{s.name}</div><div style={{ fontSize: 11, color: "#aaaabc" }}>{s.email}</div></div>
            <div style={{ fontSize: 12, color: "#555" }}>{s.role}</div>
            <div style={{ fontSize: 12, color: "#6b6b7a" }}>{s.geography}</div>
            <StatusBadge status={s.status} />
            <button onClick={() => toast(`Deactivating ${s.name}…`)} style={{ fontSize: 11, fontWeight: 600, color: B_RED, background: P_RED, border: `1px solid ${B_RED}22`, borderRadius: 6, padding: "3px 9px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Deactivate</button>
          </div>
        ))}
      </div>
      <button onClick={() => toast("Opening add Regional SPOC form…")} style={{ fontSize: 13, fontWeight: 600, color: ACCENT_ACTIVE, background: P_CYAN, border: `1px solid ${B_CYAN}`, borderRadius: 9, padding: "8px 16px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>+ Add Regional SPOC</button>
      <SectionHeading label="Family Members Linked" />
      <div style={{ border: "1px solid #e8e8f0", borderRadius: 12, overflow: "hidden" }}>
        {FAMILY_MEMBERS.map((f, i) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: i < FAMILY_MEMBERS.length - 1 ? "1px solid #f0f0f8" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: P_CYAN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: ACCENT_ACTIVE, flexShrink: 0 }}>{f.name.split(" ").map(n => n[0]).join("")}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{f.name}</div><div style={{ fontSize: 11, color: "#6b6b7a" }}>{f.relationship} · Joined {f.joinedDate}</div></div>
            <StatusBadge status={f.status} />
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Notification tab ─────────────────────────────────────────────────────
  const NotificationTab = ({ isNGO = false }: { isNGO?: boolean }) => {
    const items = isNGO ? [
      { key: "notifyProEngage", label: "ProEngage notifications", desc: "Application updates, volunteer selections, project status changes and certificate triggers." },
      { key: "notifyPlatform",  label: "Platform notifications",  desc: "TSG Admin messages, edition announcements, and policy updates." },
      { key: "notifyEmail",     label: "Email notifications",     desc: "All platform notifications will also be sent to your registered email address." },
    ] : [
      { key: "notifyProEngage", label: "ProEngage notifications", desc: "Application updates, match confirmations, project milestones and certificate issuance." },
      { key: "notifyTVW",       label: "TVW notifications",       desc: "Event announcements, registration confirmations, TVW Vibe updates and post-event summaries." },
      { key: "notifyEmail",     label: "Email notifications",     desc: "All platform notifications will also be sent to your registered email address." },
      ...(IS_SPOC ? [{ key: "notifySPOC", label: "SPOC notifications", desc: "Pending approvals, at-risk volunteer alerts, leaderboard updates and Admin communications." }] : []),
    ];
    return (
      <div>
        <SectionHeading label="Notification Preferences" />
        {items.map(({ key, label, desc }) => (
          <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "16px 0", borderBottom: "1px solid #f0f0f8" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: ACCENT_NAVY }}>{label}</div>
              <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
            </div>
            <Toggle on={(isNGO ? ngoProfile : profile as any)[key] ?? true} onChange={v => isEditing && (isNGO ? setN(key as keyof NGOProfileState, v) : set(key as keyof ProfileState, v))} />
          </div>
        ))}
        {!isEditing && <div style={{ fontSize: 12, color: "#aaaabc", marginTop: 16 }}>Click "Edit Profile" to change notification settings.</div>}
      </div>
    );
  };

  // ─── NGO tabs ─────────────────────────────────────────────────────────────
  const NGOContactTab = () => (
    <div>
      <SectionHeading label="Primary Contact" accent={B_ORANGE} />
      <div style={gridRow}>
        <div style={col}><FieldLabel>Title</FieldLabel>{isEditing ? <SelectInput value={ngoProfile.contactTitle} onChange={v => setN("contactTitle", v)} options={TITLES} /> : <ReadOnly value={ngoProfile.contactTitle} />}</div>
        <div style={col}><FieldLabel>Designation</FieldLabel>{isEditing ? <TextInput value={ngoProfile.designation} onChange={v => setN("designation", v)} /> : <ReadOnly value={ngoProfile.designation} />}</div>
      </div>
      <div style={gridRow}>
        <div style={col}><FieldLabel required>Contact Name</FieldLabel><ReadOnly value={ngoProfile.contactName} /><div style={{ fontSize: 11, color: "#aaaabc", marginTop: 4 }}>Locked — contact TSG Admin to update.</div></div>
        <div style={col}><FieldLabel required>Email</FieldLabel><ReadOnly value={ngoProfile.email} /><div style={{ fontSize: 11, color: "#aaaabc", marginTop: 4 }}>Locked — contact Admin to update.</div></div>
      </div>
      <div style={gridRow}>
        <div style={col}><FieldLabel>Mobile</FieldLabel>{isEditing ? <TextInput value={ngoProfile.mobile} onChange={v => setN("mobile", v)} placeholder="9821000001" /> : <ReadOnly value={`+91 ${ngoProfile.mobile}`} />}</div>
        <div style={col}><FieldLabel>Phone (Landline)</FieldLabel>{isEditing ? <TextInput value={ngoProfile.phone} onChange={v => setN("phone", v)} placeholder="022-XXXXXXXX" /> : <ReadOnly value={ngoProfile.phone || "Not provided"} />}</div>
      </div>
      <SectionHeading label="Website & Social" accent={B_ORANGE} />
      <div style={gridRow}>
        <div style={col}><FieldLabel>Website</FieldLabel>{isEditing ? <TextInput value={ngoProfile.website} onChange={v => setN("website", v)} placeholder="https://..." /> : <div style={{ fontSize: 14, fontWeight: 600, color: B_BLUE, padding: "10px 0", borderBottom: "1px solid #f0f0f8" }}><a href={ngoProfile.website} target="_blank" rel="noreferrer" style={{ color: B_BLUE, textDecoration: "none" }}>{ngoProfile.website || "Not provided"}</a></div>}</div>
        <div style={col}><FieldLabel>LinkedIn URL</FieldLabel>{isEditing ? <TextInput value={ngoProfile.linkedinUrl} onChange={v => setN("linkedinUrl", v)} placeholder="https://linkedin.com/company/..." /> : <ReadOnly value={ngoProfile.linkedinUrl || "Not provided"} />}</div>
      </div>
    </div>
  );

  const NGOOrgTab = () => (
    <div>
      <SectionHeading label="Organisation Details" accent={B_ORANGE} />
      <div style={gridRow}>
        <div style={col}><FieldLabel required>Organisation Name</FieldLabel><ReadOnly value={ngoProfile.orgName} /><div style={{ fontSize: 11, color: "#aaaabc", marginTop: 4 }}>Locked — contact TSG Admin to update.</div></div>
        <div style={col}><FieldLabel>Partner Tier</FieldLabel><ReadOnly value={ngoProfile.tier} /><div style={{ fontSize: 11, color: "#aaaabc", marginTop: 4 }}>Assigned by TSG Admin.</div></div>
      </div>
      <div style={gridRow}>
        <div style={col}><FieldLabel>Registration Number</FieldLabel><ReadOnly value={ngoProfile.registrationNo} /></div>
        <div style={col}><FieldLabel>PAN Number</FieldLabel><ReadOnly value={ngoProfile.panNo} /></div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <FieldLabel>Focus Areas</FieldLabel>
        {isEditing ? <MultiSelectList selected={ngoProfile.focusArea} onChange={v => setN("focusArea", v)} options={NGO_AREAS} maxH={160} /> : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ngoProfile.focusArea.map(f => <span key={f} style={{ background: P_ORANGE, color: B_ORANGE, fontSize: 12.5, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>{f}</span>)}
          </div>
        )}
      </div>
      <SectionHeading label="Address" accent={B_ORANGE} />
      <div style={gridRow}>
        <div style={col}><FieldLabel required>City</FieldLabel>{isEditing ? <TextInput value={ngoProfile.city} onChange={v => setN("city", v)} /> : <ReadOnly value={ngoProfile.city} />}</div>
        <div style={col}><FieldLabel required>State</FieldLabel>{isEditing ? <TextInput value={ngoProfile.state} onChange={v => setN("state", v)} /> : <ReadOnly value={ngoProfile.state} />}</div>
        <div style={col}><FieldLabel required>Country</FieldLabel>{isEditing ? <SelectInput value={ngoProfile.country} onChange={v => setN("country", v)} options={COUNTRIES} /> : <ReadOnly value={ngoProfile.country} />}</div>
        <div style={col}><FieldLabel>PIN Code</FieldLabel>{isEditing ? <TextInput value={ngoProfile.pincode} onChange={v => setN("pincode", v)} placeholder="400001" /> : <ReadOnly value={ngoProfile.pincode} />}</div>
      </div>
    </div>
  );

  // ─── Stats for banner ──────────────────────────────────────────────────────
  const VOLUNTEER_STATS = [
    { value: 14, label: "Projects Applied",   pastel: CP_AMBER,    accent: C_AMBER    },
    { value: 8,  label: "Projects Completed", pastel: CP_MIDBLUE,  accent: C_MIDBLUE  },
    { value: 120, label: "Hours Volunteered", pastel: CP_GREEN,    accent: C_GREEN_KPI },
    { value: 5,  label: "Badges Earned",      pastel: CP_PINK,     accent: C_PINK     },
  ];

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#f8f9ff", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingBottom: 80 }}>

      {/* ── Full-bleed hero banner — bleeds under navbar ── */}
      <div style={{
        background: `linear-gradient(135deg, ${BANNER_DARK} 0%, ${BANNER} 55%, ${B_CYAN} 100%)`,
        padding: "96px 0 0",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle diagonal texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px)", pointerEvents: "none" }} />
        {/* Radial glow top-right */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle, rgba(8,145,178,0.35) 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 40px 0", position: "relative", zIndex: 1 }}>
          {/* Avatar + name row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20, marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 72, height: 72, borderRadius: IS_NGO ? 16 : "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "#fff", flexShrink: 0, border: "3px solid rgba(255,255,255,0.2)", boxShadow: `0 4px 20px rgba(0,0,0,0.25)` }}>
                {IS_NGO ? (ngoData.organization?.charAt(0) ?? "P") : `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`}
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>
                  {IS_NGO ? (ngoData.organization ?? "Pratham Foundation") : `${profile.firstName} ${profile.lastName}`}
                </div>
                <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
                  {IS_NGO ? `${ngoProfile.designation} · ${ngoProfile.email}` : `${profile.designationDetail || profile.designation} · ${profile.company}`}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  {IS_NGO ? (
                    <>
                      <span style={{ background: "rgba(8,145,178,0.25)", border: "1px solid rgba(8,145,178,0.45)", color: "#7dd3fc", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>{ngoData.tier ?? "Lead Partner"}</span>
                      <span style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>Verified NGO ✓</span>
                    </>
                  ) : (
                    <>
                      <span style={{ background: "rgba(8,145,178,0.25)", border: "1px solid rgba(8,145,178,0.45)", color: "#7dd3fc", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>Tata Employee</span>
                      {IS_SPOC && <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>Corporate SPOC</span>}
                      <span style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>Verified ✓</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Edit / Save buttons */}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingTop: 4 }}>
              {isEditing ? (
                <>
                  <button onClick={IS_NGO ? handleNGOSave : handleSave} style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", background: B_CYAN, border: "none", borderRadius: 10, padding: "10px 22px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Save Changes</button>
                  <button onClick={IS_NGO ? handleNGOCancel : handleCancel} style={{ fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_ACTIVE, background: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit Profile</button>
              )}
            </div>
          </div>

          {/* KPI strip — sits at bottom of banner, partially overlapping into content */}
          {!IS_NGO && (
            <div style={{ display: "flex", gap: 12, background: "rgba(0,0,0,0.18)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px 14px 0 0", padding: "20px 24px", marginTop: 8 }}>
              {VOLUNTEER_STATS.map(s => (
                <div key={s.label} style={{ flex: 1, textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.1)", paddingRight: 16, marginRight: 4 }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#ffffff", letterSpacing: -1 }}>{s.value}{(s as any).suffix}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.6px", marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 40px" }}>

        {/* Standalone KPI tiles (for NGO or if no strip) — coloured tiles */}
        {IS_NGO && (
          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            <KpiTile value={12} label="Projects Posted" pastel={CP_MIDBLUE} accent={C_MIDBLUE} />
            <KpiTile value={8}  label="Active Projects" pastel={CP_GREEN}   accent={C_GREEN_KPI} />
            <KpiTile value={94} label="Volunteers Matched" pastel={CP_AMBER} accent={C_AMBER} />
            <KpiTile value="Lead" label="Partner Tier"   pastel={CP_PINK}   accent={C_PINK} />
          </div>
        )}

        {/* ── Layout: left tabs + right content ── */}
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>

          {/* Tab nav */}
          <div style={{ width: 204, flexShrink: 0 }}>
            {(IS_NGO ? NGO_TABS : VOL_TABS).map((t: any) => {
              const isActive = IS_NGO ? ngoTab === t.id : volTab === t.id;
              const accentBg = IS_NGO ? P_ORANGE : P_CYAN;
              const accentColor = IS_NGO ? B_ORANGE : ACCENT_ACTIVE;
              return (
                <div key={t.id}
                  onClick={() => IS_NGO ? setNgoTab(t.id as NGOTab) : setVolTab(t.id as VolTab)}
                  style={{
                    padding: "11px 16px", borderRadius: 10, cursor: "pointer",
                    fontSize: 13.5, fontWeight: isActive ? 700 : 400,
                    color: isActive ? accentColor : "#6b6b7a",
                    background: isActive ? accentBg : "transparent",
                    borderLeft: isActive ? `3px solid ${accentColor}` : "3px solid transparent",
                    marginBottom: 4, transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                  {(t as any).spocOnly && <span style={{ fontSize: 11 }}>🧑‍💼</span>}
                  {t.label}
                </div>
              );
            })}

            {/* Badges shelf — below nav */}
            {!IS_NGO && (
              <div style={{ marginTop: 28, background: "#fff", border: "1px solid #e8e8f0", borderRadius: 12, padding: "16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Badges</div>
                {[
                  { image: badgeVeteran,    name: "ProEngage Veteran"    },
                  { image: badgeAmbassador, name: "ProEngage Ambassador"  },
                  { image: badgeNorthStar,  name: "ProEngage North Star"  },
                  { image: badgeLead,       name: "ProEngage Pioneer"     },
                  { image: badgeChampion,   name: "ProEngage 23 Champion" },
                ].map(b => (
                  <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <img src={b.image} alt={b.name} style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }} />
                    <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT_NAVY }}>{b.name}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Certificates — forest green tint */}
            {!IS_NGO && (
              <div style={{ marginTop: 12, background: CP_TEAL_CERT, border: `1px solid ${C_TEAL_CERT}22`, borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C_TEAL_CERT, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>My Certificates</div>
                {[
                  { edition: "Mock Interviews - Students · ProEngage 2025 | 01", date: "2025" },
                  { edition: "Mock Interviews · ProEngage 2024 | 02",            date: "2024" },
                ].map(c => (
                  <div key={c.edition} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C_TEAL_CERT }}>{c.edition}</div>
                      <div style={{ fontSize: 10.5, color: "#6b8c6b" }}>{c.date}</div>
                    </div>
                    <button onClick={() => toast(`Downloading ${c.edition} certificate…`)} style={{ fontSize: 10.5, fontWeight: 700, color: C_TEAL_CERT, background: "rgba(26,107,60,0.1)", border: `1px solid ${C_TEAL_CERT}30`, borderRadius: 6, padding: "3px 9px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>PDF</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content panel */}
          <div style={{ flex: 1, background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, padding: "28px 32px", minHeight: 400 }}>
            {IS_NGO ? (
              <>
                {ngoTab === "contact"      && <NGOContactTab />}
                {ngoTab === "organisation" && <NGOOrgTab />}
                {ngoTab === "notification" && <NotificationTab isNGO={true} />}
              </>
            ) : (
              <>
                {volTab === "personal"      && <PersonalTab />}
                {volTab === "professional"  && <ProfessionalTab />}
                {volTab === "volunteering"  && <VolunteeringTab />}
                {volTab === "spoc"          && <SPOCTab />}
                {volTab === "notification"  && <NotificationTab isNGO={false} />}
              </>
            )}

            {/* Save row inside panel */}
            {isEditing && (
              <div style={{ display: "flex", gap: 10, marginTop: 28, paddingTop: 20, borderTop: "1px solid #e8e8f0" }}>
                <button onClick={IS_NGO ? handleNGOSave : handleSave} style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", background: IS_NGO ? B_ORANGE : ACCENT_ACTIVE, border: "none", borderRadius: 10, padding: "10px 22px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Save Changes</button>
                <button onClick={IS_NGO ? handleNGOCancel : handleCancel} style={{ fontSize: 13.5, fontWeight: 700, color: "#6b6b7a", background: "#f8f8fc", border: "1px solid #e0e0e8", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toastMsg && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: ACCENT_NAVY, color: "#fff", fontSize: 13, fontWeight: 500, padding: "12px 24px", borderRadius: 100, zIndex: 9999, boxShadow: "0 8px 32px rgba(13,27,62,0.3)", pointerEvents: "none", whiteSpace: "nowrap" }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}
