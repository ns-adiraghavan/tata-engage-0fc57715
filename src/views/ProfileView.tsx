import { useState } from "react";
import { PRIYA_SHARMA, MOCK_FAMILY_MEMBERS } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const B_INDIGO    = "#333399";
const B_YELLOW    = "#F5A623";
const B_TEAL      = "#00A896";
const B_RED       = "#E8401C";
const B_BLUE      = "#1E6BB8";
const ACCENT_NAVY = "#0D1B3E";
const P_INDIGO    = "#EEF0FF";
const P_TEAL      = "#E6F8F5";
const P_BLUE      = "#EBF4FF";

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

// ─── Mini shared components ────────────────────────────────────────────────────
const sectionLabel: React.CSSProperties = { fontSize:10.5, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:"#aaaabc", marginBottom:14, paddingBottom:10, borderBottom:"1px solid #e8e8f0", display:"block" };

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ fontSize:10.5, fontWeight:700, color:"#aaaabc", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:7 }}>
      {children}{required && <span style={{ color:B_RED, marginLeft:3 }}>*</span>}
    </div>
  );
}

function ReadOnly({ value }: { value: string }) {
  return <div style={{ fontSize:14, fontWeight:600, color:ACCENT_NAVY, padding:"10px 0", borderBottom:"1px solid #f0f0f8" }}>{value || "—"}</div>;
}

function TextInput({ value, onChange, placeholder, type="text" }: { value:string; onChange:(v:string)=>void; placeholder?:string; type?:string }) {
  return (
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ width:"100%", border:"1.5px solid #e0e0e8", borderRadius:9, padding:"10px 13px", fontSize:13.5, fontFamily:"'Noto Sans', sans-serif", color:ACCENT_NAVY, outline:"none", boxSizing:"border-box" }}
      onFocus={e=>(e.target.style.borderColor=B_INDIGO)} onBlur={e=>(e.target.style.borderColor="#e0e0e8")}/>
  );
}

function SelectInput({ value, onChange, options }: { value:string; onChange:(v:string)=>void; options:string[] }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{ width:"100%", border:"1.5px solid #e0e0e8", borderRadius:9, padding:"10px 13px", fontSize:13.5, fontFamily:"'Noto Sans', sans-serif", color:ACCENT_NAVY, outline:"none", appearance:"none", background:"#fff", cursor:"pointer", boxSizing:"border-box" }}
      onFocus={e=>(e.target.style.borderColor=B_INDIGO)} onBlur={e=>(e.target.style.borderColor="#e0e0e8")}>
      {options.map(o=><option key={o}>{o}</option>)}
    </select>
  );
}

function MultiSelectList({ selected, onChange, options, maxH=160 }: { selected:string[]; onChange:(v:string[])=>void; options:string[]; maxH?:number }) {
  const toggle = (val:string) => onChange(selected.includes(val)?selected.filter(x=>x!==val):[...selected,val]);
  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10, minHeight:32 }}>
        {selected.map(s=>(
          <span key={s} style={{ background:P_INDIGO, color:B_INDIGO, fontSize:12.5, fontWeight:600, padding:"4px 12px", borderRadius:100, display:"flex", alignItems:"center", gap:6 }}>
            {s}<span onClick={()=>toggle(s)} style={{ cursor:"pointer", opacity:0.6, fontSize:13, lineHeight:1 }}>×</span>
          </span>
        ))}
        {selected.length===0&&<span style={{ fontSize:13, color:"#aaaabc" }}>None selected</span>}
      </div>
      <div style={{ border:"1.5px solid #e0e0e8", borderRadius:9, maxHeight:maxH, overflowY:"auto" }}>
        {options.map(o=>(
          <div key={o} onClick={()=>toggle(o)}
            style={{ padding:"9px 14px", fontSize:13, cursor:"pointer", color:ACCENT_NAVY, display:"flex", alignItems:"center", gap:10, background:selected.includes(o)?P_INDIGO:"transparent", transition:"background 0.1s" }}>
            <div style={{ width:15, height:15, borderRadius:4, border:`2px solid ${selected.includes(o)?B_INDIGO:"#dddde8"}`, background:selected.includes(o)?B_INDIGO:"#fff", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {selected.includes(o)&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            {o}
          </div>
        ))}
      </div>
      <div style={{ fontSize:11, color:"#aaaabc", marginTop:5 }}>Press to select / deselect. Multiple selections allowed.</div>
    </div>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, marginTop:30 }}>
      <div style={{ width:3, height:18, borderRadius:2, background:B_INDIGO }} />
      <div style={{ fontSize:14, fontWeight:700, color:ACCENT_NAVY }}>{label}</div>
    </div>
  );
}

// ─── Tab nav ──────────────────────────────────────────────────────────────────
type NavTab = "personal"|"professional"|"volunteering"|"notification";
const NAV_TABS: {id:NavTab; label:string}[] = [
  { id:"personal",      label:"Personal Information" },
  { id:"professional",  label:"Professional Details"  },
  { id:"volunteering",  label:"Volunteering Preferences"},
  { id:"notification",  label:"Notification Settings" },
];

// ─── Data state ────────────────────────────────────────────────────────────────
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
};

function initProfile(): ProfileState {
  return {
    title: "Ms",
    firstName: PRIYA_SHARMA.firstName,
    lastName:  PRIYA_SHARMA.lastName,
    gender:    "Female",
    birthDate: "1990-06-15",
    officialEmail: true,
    email:     PRIYA_SHARMA.email,
    company:   PRIYA_SHARMA.company,
    designation: PRIYA_SHARMA.designation.split(" ").slice(-1)[0]==="Manager"?"Senior Project Manager":"Others",
    designationDetail: PRIYA_SHARMA.designation,
    function_: "Product Management",
    functionDetail: "",
    eduQual: "MBA",
    eduQualDetail: "Indian Institute of Management, Ahmedabad",
    country: PRIYA_SHARMA.country,
    city:    PRIYA_SHARMA.city,
    cityDetail: "",
    phoneCountryCode: "91", phoneArea: "022", phoneNum: "00000000",
    mobileCountryCode: "91", mobileNum: "9876543210",
    skills:    [...PRIYA_SHARMA.skills],
    interests: [...PRIYA_SHARMA.interests],
    languages: [...PRIYA_SHARMA.languages],
    preferredMode: PRIYA_SHARMA.preferredMode,
    disasterResponseInterest: PRIYA_SHARMA.disasterResponseInterest,
    linkedinUrl: PRIYA_SHARMA.linkedinUrl ?? "",
    notifyProEngage: PRIYA_SHARMA.notifyProEngage,
    notifyTVW:       PRIYA_SHARMA.notifyTVW,
    notifyEmail:     true,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProfileView() {
  const { triggerToast } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("personal");
  const [profile, setProfile] = useState<ProfileState>(initProfile);
  const [saved, setSaved]     = useState<ProfileState>(initProfile);

  const set = (field: keyof ProfileState, val: any) => setProfile(p=>({...p,[field]:val}));

  const handleSave = () => {
    setSaved({...profile});
    setIsEditing(false);
    triggerToast("Profile saved successfully.");
  };

  const handleCancel = () => {
    setProfile({...saved});
    setIsEditing(false);
  };

  const gridRow: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 };
  const col: React.CSSProperties     = { display:"flex", flexDirection:"column" };

  return (
    <div style={{ background:"#f8f9ff", minHeight:"100vh", fontFamily:"'Noto Sans', sans-serif", paddingTop:80, paddingBottom:80 }}>
      <div style={{ maxWidth:1080, margin:"0 auto", padding:"0 40px" }}>

        {/* ── Hero banner (similar to live site) ────────────────────── */}
        <div style={{ background:ACCENT_NAVY, borderRadius:"0 0 20px 20px", padding:"32px 40px", marginBottom:32, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:B_INDIGO, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:700, color:"#fff", flexShrink:0, border:"3px solid rgba(255,255,255,0.15)" }}>
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <div>
              <div style={{ fontSize:22, fontWeight:900, color:"#fff" }}>{profile.firstName} {profile.lastName}</div>
              <div style={{ fontSize:13.5, color:"rgba(255,255,255,0.5)", marginTop:4 }}>{profile.designationDetail || profile.designation} · {profile.company}</div>
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <span style={{ background:P_INDIGO, color:B_INDIGO, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:100 }}>Tata Employee</span>
                <span style={{ background:P_TEAL, color:B_TEAL, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:100 }}>Verified</span>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {isEditing ? (
              <>
                <button onClick={handleCancel} style={{ background:"rgba(255,255,255,0.08)", border:"1.5px solid rgba(255,255,255,0.15)", borderRadius:9, padding:"9px 20px", fontSize:13.5, fontWeight:600, color:"rgba(255,255,255,0.7)", cursor:"pointer" }}>Cancel</button>
                <button onClick={handleSave}   style={{ background:B_INDIGO, border:"none", borderRadius:9, padding:"9px 24px", fontSize:13.5, fontWeight:700, color:"#fff", cursor:"pointer" }}>Save Changes</button>
              </>
            ) : (
              <>
                <button onClick={()=>{}} style={{ background:"rgba(255,255,255,0.08)", border:"1.5px solid rgba(255,255,255,0.15)", borderRadius:9, padding:"9px 18px", fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.6)", cursor:"pointer" }}>Delete Account</button>
                <button onClick={()=>setIsEditing(true)} style={{ background:B_INDIGO, border:"none", borderRadius:9, padding:"9px 24px", fontSize:13.5, fontWeight:700, color:"#fff", cursor:"pointer" }}>Edit Profile</button>
              </>
            )}
          </div>
        </div>

        <div style={{ display:"flex", gap:28, alignItems:"flex-start" }}>

          {/* ── Left nav ────────────────────────────────────────────── */}
          <div style={{ width:200, flexShrink:0, position:"sticky", top:108, alignSelf:"flex-start" }}>
            <div style={{ background:"#fff", border:"1px solid #e8e8f0", borderRadius:12, overflow:"hidden" }}>
              {NAV_TABS.map((t,i)=>{
                const on = activeTab===t.id;
                return(
                  <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"13px 16px", borderBottom:i<NAV_TABS.length-1?"1px solid #f0f0f8":"none", background:on?P_INDIGO:"transparent", border:"none", cursor:"pointer", textAlign:"left", transition:"background 0.15s", fontFamily:"'Noto Sans', sans-serif" }}>
                    <div style={{ width:3, height:16, borderRadius:2, background:on?B_INDIGO:"#e8e8f0", flexShrink:0, transition:"background 0.15s" }}/>
                    <span style={{ fontSize:13, fontWeight:on?700:400, color:on?B_INDIGO:"#6b6b7a" }}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Form area ────────────────────────────────────────────── */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ background:"#fff", border:"1px solid #e8e8f0", borderRadius:14, padding:"28px 32px" }}>

              {/* ── PERSONAL INFORMATION ────────────────────────────── */}
              {activeTab==="personal"&&(
                <>
                  <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:"#aaaabc", marginBottom:20, paddingBottom:12, borderBottom:"1px solid #f0f0f8" }}>Personal Information</div>
                  <div style={{ background:P_BLUE, border:`1px solid ${B_BLUE}22`, borderRadius:9, padding:"10px 14px", marginBottom:20, fontSize:13, color:"#1d4ed8" }}>
                    * Name and email are locked to your SSO account. Contact <strong>tataengage@tata.com</strong> to update locked fields.
                  </div>

                  <div style={{ marginBottom:16 }}>
                    <FieldLabel>Title *</FieldLabel>
                    {isEditing
                      ? <SelectInput value={profile.title} onChange={v=>set("title",v)} options={TITLES}/>
                      : <ReadOnly value={profile.title}/>}
                  </div>

                  <div style={gridRow}>
                    <div style={col}>
                      <FieldLabel required>First Name</FieldLabel>
                      <ReadOnly value={profile.firstName}/>
                    </div>
                    <div style={col}>
                      <FieldLabel required>Last Name</FieldLabel>
                      <ReadOnly value={profile.lastName}/>
                    </div>
                  </div>

                  <div style={gridRow}>
                    <div style={col}>
                      <FieldLabel required>Gender</FieldLabel>
                      {isEditing
                        ? <SelectInput value={profile.gender} onChange={v=>set("gender",v)} options={GENDERS}/>
                        : <ReadOnly value={profile.gender}/>}
                    </div>
                    <div style={col}>
                      <FieldLabel required>Birth Date</FieldLabel>
                      {isEditing
                        ? <TextInput type="date" value={profile.birthDate} onChange={v=>set("birthDate",v)}/>
                        : <ReadOnly value={new Date(profile.birthDate).toLocaleDateString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric"})}/>}
                    </div>
                  </div>

                  <div style={{ marginBottom:16 }}>
                    <FieldLabel required>Do you have an Official Tata Email ID?</FieldLabel>
                    <div style={{ display:"flex", gap:24, marginTop:4 }}>
                      {[["true","Yes"],["false","No"]].map(([val,lbl])=>(
                        <label key={val} style={{ display:"flex", alignItems:"center", gap:8, cursor:isEditing?"pointer":"default", fontSize:13.5, color:String(profile.officialEmail)===val?B_INDIGO:ACCENT_NAVY, fontWeight:String(profile.officialEmail)===val?600:400 }}>
                          <div onClick={()=>isEditing&&set("officialEmail",val==="true")} style={{ width:17,height:17,borderRadius:"50%",border:`2px solid ${String(profile.officialEmail)===val?B_INDIGO:"#dddde8"}`,background:String(profile.officialEmail)===val?B_INDIGO:"#fff",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:isEditing?"pointer":"default" }}>
                            {String(profile.officialEmail)===val&&<div style={{ width:6,height:6,borderRadius:"50%",background:"#fff" }}/>}
                          </div>{lbl}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom:16 }}>
                    <FieldLabel required>Email ID</FieldLabel>
                    <ReadOnly value={profile.email}/>
                  </div>

                  {/* Country / City */}
                  <div style={gridRow}>
                    <div style={col}>
                      <FieldLabel required>Country</FieldLabel>
                      {isEditing
                        ? <SelectInput value={profile.country} onChange={v=>set("country",v)} options={COUNTRIES}/>
                        : <ReadOnly value={profile.country}/>}
                    </div>
                    <div style={col}>
                      <FieldLabel required>City / Location</FieldLabel>
                      {isEditing?(
                        <>
                          <SelectInput value={profile.city} onChange={v=>set("city",v)} options={CITIES_INDIA}/>
                          {profile.city==="Other City"&&<div style={{ marginTop:8 }}><TextInput value={profile.cityDetail} onChange={v=>set("cityDetail",v)} placeholder="Specify city"/></div>}
                        </>
                      ):<ReadOnly value={profile.city}/>}
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{ marginBottom:16 }}>
                    <FieldLabel>Phone</FieldLabel>
                    <div style={{ display:"grid", gridTemplateColumns:"80px 100px 1fr", gap:8 }}>
                      {isEditing?(
                        <>
                          <TextInput value={profile.phoneCountryCode} onChange={v=>set("phoneCountryCode",v)} placeholder="91"/>
                          <TextInput value={profile.phoneArea} onChange={v=>set("phoneArea",v)} placeholder="022"/>
                          <TextInput value={profile.phoneNum} onChange={v=>set("phoneNum",v)} placeholder="Number"/>
                        </>
                      ):<ReadOnly value={`+${profile.phoneCountryCode} (${profile.phoneArea}) ${profile.phoneNum}`}/>}
                    </div>
                  </div>

                  {/* Mobile */}
                  <div style={{ marginBottom:20 }}>
                    <FieldLabel required>Mobile</FieldLabel>
                    <div style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:8 }}>
                      {isEditing?(
                        <>
                          <TextInput value={profile.mobileCountryCode} onChange={v=>set("mobileCountryCode",v)} placeholder="91"/>
                          <TextInput value={profile.mobileNum} onChange={v=>set("mobileNum",v)} placeholder="Mobile number"/>
                        </>
                      ):<ReadOnly value={`+${profile.mobileCountryCode} ${profile.mobileNum}`}/>}
                    </div>
                  </div>

                  {/* Photo */}
                  <div style={{ marginBottom:8 }}>
                    <FieldLabel>Photograph <span style={{ fontWeight:400, color:"#aaaabc" }}>(Max. size 5 MB)</span></FieldLabel>
                    <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                      <div style={{ width:80, height:90, background:"#f0f0f8", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, color:"#dddde8", border:"1.5px dashed #dddde8" }}>👤</div>
                      {isEditing&&(
                        <div style={{ border:"1.5px dashed #dddde8", borderRadius:9, padding:"16px 24px", textAlign:"center", cursor:"pointer", fontSize:13, color:"#aaaabc" }}>Choose File · No file chosen</div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ── PROFESSIONAL DETAILS ─────────────────────────────── */}
              {activeTab==="professional"&&(
                <>
                  <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:"#aaaabc", marginBottom:20, paddingBottom:12, borderBottom:"1px solid #f0f0f8" }}>Professional Details</div>

                  <div style={{ marginBottom:16 }}>
                    <FieldLabel required>Company</FieldLabel>
                    {isEditing
                      ? <SelectInput value={profile.company} onChange={v=>set("company",v)} options={COMPANIES}/>
                      : <ReadOnly value={profile.company}/>}
                  </div>

                  <div style={{ marginBottom:16 }}>
                    <FieldLabel required>Designation</FieldLabel>
                    {isEditing?(
                      <>
                        <SelectInput value={profile.designation} onChange={v=>set("designation",v)} options={DESIGNATIONS}/>
                        {profile.designation==="Others"&&<div style={{ marginTop:8 }}><TextInput value={profile.designationDetail} onChange={v=>set("designationDetail",v)} placeholder="Specify designation"/></div>}
                      </>
                    ):<ReadOnly value={profile.designationDetail||profile.designation}/>}
                  </div>

                  <div style={{ marginBottom:16 }}>
                    <FieldLabel required>Function</FieldLabel>
                    {isEditing?(
                      <>
                        <SelectInput value={profile.function_} onChange={v=>set("function_",v)} options={FUNCTIONS}/>
                        {profile.function_==="Others"&&<div style={{ marginTop:8 }}><TextInput value={profile.functionDetail} onChange={v=>set("functionDetail",v)} placeholder="Specify function"/></div>}
                      </>
                    ):<ReadOnly value={profile.functionDetail||profile.function_}/>}
                  </div>

                  <div style={{ marginBottom:16 }}>
                    <FieldLabel required>Education Qualification</FieldLabel>
                    {isEditing?(
                      <>
                        <SelectInput value={profile.eduQual} onChange={v=>set("eduQual",v)} options={EDU_QUALS}/>
                        <div style={{ marginTop:8 }}><TextInput value={profile.eduQualDetail} onChange={v=>set("eduQualDetail",v)} placeholder="Institution / additional detail"/></div>
                      </>
                    ):<ReadOnly value={profile.eduQualDetail?`${profile.eduQual} — ${profile.eduQualDetail}`:profile.eduQual}/>}
                  </div>

                  <div style={{ marginBottom:16 }}>
                    <FieldLabel>LinkedIn Profile URL</FieldLabel>
                    {isEditing
                      ? <TextInput type="url" value={profile.linkedinUrl} onChange={v=>set("linkedinUrl",v)} placeholder="https://linkedin.com/in/..."/>
                      : <ReadOnly value={profile.linkedinUrl}/>}
                  </div>
                </>
              )}

              {/* ── VOLUNTEERING PREFERENCES ─────────────────────────── */}
              {activeTab==="volunteering"&&(
                <>
                  <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:"#aaaabc", marginBottom:20, paddingBottom:12, borderBottom:"1px solid #f0f0f8" }}>Volunteering Preferences</div>

                  <div style={{ marginBottom:20 }}>
                    <FieldLabel>Choose skills you possess that will help you in volunteering</FieldLabel>
                    <div style={{ fontSize:12, color:"#aaaabc", marginBottom:10 }}>Press to select / deselect multiple skills</div>
                    {isEditing
                      ? <MultiSelectList selected={profile.skills} onChange={v=>set("skills",v)} options={SKILLS_LIST}/>
                      : <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>{profile.skills.map(s=><span key={s} style={{ background:P_INDIGO, color:B_INDIGO, fontSize:12.5, fontWeight:600, padding:"4px 12px", borderRadius:100 }}>{s}</span>)}</div>}
                  </div>

                  <div style={{ marginBottom:20 }}>
                    <FieldLabel>Choose areas of interest in which you would like to volunteer</FieldLabel>
                    <div style={{ fontSize:12, color:"#aaaabc", marginBottom:10 }}>Press to select / deselect multiple areas of interest</div>
                    {isEditing
                      ? <MultiSelectList selected={profile.interests} onChange={v=>set("interests",v)} options={INTERESTS_LIST}/>
                      : <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>{profile.interests.map(s=><span key={s} style={{ background:P_TEAL, color:B_TEAL, fontSize:12.5, fontWeight:600, padding:"4px 12px", borderRadius:100 }}>{s}</span>)}</div>}
                  </div>

                  <div style={{ marginBottom:20 }}>
                    <FieldLabel>Languages</FieldLabel>
                    {isEditing
                      ? <MultiSelectList selected={profile.languages} onChange={v=>set("languages",v)} options={LANGUAGES_LIST} maxH={130}/>
                      : <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>{profile.languages.map(s=><span key={s} style={{ background:"#f0f0f8", color:"#555", fontSize:12.5, fontWeight:600, padding:"4px 12px", borderRadius:100 }}>{s}</span>)}</div>}
                  </div>

                  <div style={{ marginBottom:20 }}>
                    <FieldLabel>Preferred Volunteering Mode</FieldLabel>
                    <div style={{ display:"flex", gap:24, marginTop:4, flexWrap:"wrap" }}>
                      {["Remote","In-Person","Either"].map(mode=>(
                        <label key={mode} style={{ display:"flex", alignItems:"center", gap:8, cursor:isEditing?"pointer":"default", fontSize:13.5, color:profile.preferredMode===mode?B_INDIGO:ACCENT_NAVY, fontWeight:profile.preferredMode===mode?600:400 }}>
                          <div onClick={()=>isEditing&&set("preferredMode",mode)} style={{ width:17,height:17,borderRadius:"50%",border:`2px solid ${profile.preferredMode===mode?B_INDIGO:"#dddde8"}`,background:profile.preferredMode===mode?B_INDIGO:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:isEditing?"pointer":"default" }}>
                            {profile.preferredMode===mode&&<div style={{ width:6,height:6,borderRadius:"50%",background:"#fff" }}/>}
                          </div>{mode}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom:20 }}>
                    <FieldLabel>Interested in Volunteering for Disaster Response?</FieldLabel>
                    <div style={{ display:"flex", gap:24, marginTop:4 }}>
                      {[["true","Yes"],["false","No"]].map(([val,lbl])=>(
                        <label key={val} style={{ display:"flex", alignItems:"center", gap:8, cursor:isEditing?"pointer":"default", fontSize:13.5, color:String(profile.disasterResponseInterest)===val?B_INDIGO:ACCENT_NAVY, fontWeight:String(profile.disasterResponseInterest)===val?600:400 }}>
                          <div onClick={()=>isEditing&&set("disasterResponseInterest",val==="true")} style={{ width:17,height:17,borderRadius:"50%",border:`2px solid ${String(profile.disasterResponseInterest)===val?B_INDIGO:"#dddde8"}`,background:String(profile.disasterResponseInterest)===val?B_INDIGO:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:isEditing?"pointer":"default" }}>
                            {String(profile.disasterResponseInterest)===val&&<div style={{ width:6,height:6,borderRadius:"50%",background:"#fff" }}/>}
                          </div>{lbl}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── NOTIFICATION SETTINGS ────────────────────────────── */}
              {activeTab==="notification"&&(
                <>
                  <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:"#aaaabc", marginBottom:20, paddingBottom:12, borderBottom:"1px solid #f0f0f8" }}>Notification Settings</div>
                  <p style={{ fontSize:13.5, color:"#6b6b7a", lineHeight:1.65, marginBottom:24 }}>
                    Manage the communications you receive from TataEngage. You can change these at any time.
                  </p>
                  {[
                    { key:"notifyProEngage" as const, label:"Receive communication from Tata Engage regarding ProEngage projects", desc:"Receive matching updates, shortlisting notifications and reminders." },
                    { key:"notifyTVW"       as const, label:"Receive communication from Tata Engage regarding TVW events",         desc:"Get notified about new events, registrations and reminders." },
                    { key:"notifyEmail"     as const, label:"Receive general newsletters and platform updates from Tata Engage",    desc:"Monthly digest, platform changes and community highlights." },
                  ].map(item=>(
                    <div key={item.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, padding:"18px 0", borderBottom:"1px solid #f0f0f8" }}>
                      <div>
                        <div style={{ fontSize:13.5, fontWeight:600, color:ACCENT_NAVY, marginBottom:3 }}>{item.label}</div>
                        <div style={{ fontSize:12.5, color:"#8888a0" }}>{item.desc}</div>
                      </div>
                      <div onClick={()=>isEditing&&set(item.key,!profile[item.key])} style={{ width:44,height:24,borderRadius:100,background:profile[item.key]?B_INDIGO:"#dddde8",position:"relative",cursor:isEditing?"pointer":"default",flexShrink:0,transition:"background 0.2s" }}>
                        <div style={{ position:"absolute",top:3,left:profile[item.key]?22:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Save / cancel bottom buttons (only on edit) */}
              {isEditing&&(
                <div style={{ display:"flex", gap:12, marginTop:28, paddingTop:20, borderTop:"1px solid #e8e8f0" }}>
                  <button onClick={handleSave}   style={{ flex:2, background:B_INDIGO, color:"#fff", border:"none", borderRadius:9, padding:"12px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Noto Sans', sans-serif" }}>Save Changes</button>
                  <button onClick={handleCancel} style={{ flex:1, background:"#fff", border:"1.5px solid #dddde8", borderRadius:9, padding:"12px", fontSize:13.5, fontWeight:600, color:"#6b6b7a", cursor:"pointer", fontFamily:"'Noto Sans', sans-serif" }}>Cancel</button>
                </div>
              )}
            </div>

            {/* ── Engagement Stats sidebar card ─────────────────────── */}
            <div style={{ background:ACCENT_NAVY, borderRadius:14, padding:"24px 28px", marginTop:20, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-20, right:-20, width:120, height:120, borderRadius:"50%", background:`${B_INDIGO}33` }}/>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"1.8px", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:20 }}>Engagement Stats</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, position:"relative", zIndex:1 }}>
                {[["347 hrs","Volunteering Hours"],["4","Projects Completed"],["7","Badges Earned"]].map(([v,l])=>(
                  <div key={l}>
                    <div style={{ fontSize:26, fontWeight:900, color:"#fff", letterSpacing:-1 }}>{v}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.6px", lineHeight:1.3, marginTop:4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SPOC card ─────────────────────────────────────────── */}
            <div style={{ background:"#fff", border:"1px solid #e8e8f0", borderRadius:14, padding:"20px 24px", marginTop:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:3, height:18, borderRadius:2, background:B_INDIGO }}/>
                <div style={{ fontSize:14, fontWeight:700, color:ACCENT_NAVY }}>Your SPOC</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                <div style={{ width:48, height:48, borderRadius:"50%", background:P_INDIGO, color:B_INDIGO, fontWeight:700, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>RD</div>
                <div>
                  <div style={{ fontSize:14.5, fontWeight:700, color:ACCENT_NAVY }}>Rohan Desai</div>
                  <div style={{ fontSize:12.5, color:"#8888a0", marginTop:2 }}>Corporate SPOC · Tata Consultancy Services</div>
                  <div style={{ fontSize:12, color:"#aaaabc", marginTop:2 }}>Covers your region and company volunteering</div>
                </div>
              </div>
              <button onClick={()=>triggerToast("Message sent to Rohan Desai. He'll respond within 24 hours.")} style={{ fontSize:13, color:B_INDIGO, fontWeight:600, border:`1.5px solid ${B_INDIGO}33`, borderRadius:8, padding:"7px 18px", cursor:"pointer", background:"transparent", fontFamily:"'Noto Sans', sans-serif" }}>Contact SPOC</button>
            </div>

            {/* ── Family Members ────────────────────────────────────── */}
            <div style={{ background:"#fff", border:"1px solid #e8e8f0", borderRadius:14, padding:"20px 24px", marginTop:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:3, height:18, borderRadius:2, background:B_INDIGO }}/>
                <div style={{ fontSize:14, fontWeight:700, color:ACCENT_NAVY }}>Family Members registered under you</div>
              </div>
              {MOCK_FAMILY_MEMBERS.map((m,i)=>(
                <div key={m.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:i<MOCK_FAMILY_MEMBERS.length-1?"1px solid #f0f0f8":"none" }}>
                  <div>
                    <div style={{ fontSize:13.5, fontWeight:600, color:ACCENT_NAVY }}>{m.name}</div>
                    <div style={{ fontSize:12.5, color:"#8888a0" }}>{m.relationship} · {m.email}</div>
                  </div>
                  <span style={{ fontSize:11.5, fontWeight:600, padding:"3px 10px", borderRadius:100, background:m.status==="Active"?"#f0fdf4":"#fffbeb", color:m.status==="Active"?"#166534":"#92400e" }}>{m.status}</span>
                </div>
              ))}
              <button onClick={()=>triggerToast("Invite link copied. Share it with your family member to register.")} style={{ marginTop:14, fontSize:13.5, color:B_INDIGO, fontWeight:600, cursor:"pointer", background:"none", border:"none", padding:0 }}>
                + Invite a family member
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
