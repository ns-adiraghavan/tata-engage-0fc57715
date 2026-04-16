import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Monitor, FileText, Megaphone, GraduationCap, TrendingUp,
  Scale, Heart, Users, Package, Search, Plus, ArrowLeft,
  Bookmark, BookmarkCheck, Sparkles, Clock, MapPin, ChevronRight, X
} from "lucide-react";
import { PROENGAGE_PROJECTS } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";

const B_INDIGO    = "#333399";
const B_YELLOW    = "#F5A623";
const B_TEAL      = "#00A896";
const B_RED       = "#E8401C";
const B_BLUE      = "#1E6BB8";
const ACCENT_NAVY = "#0D1B3E";
const P_INDIGO    = "#EEF0FF";
const P_YELLOW    = "#FEF6E4";
const P_TEAL      = "#E6F8F5";
const P_BLUE      = "#EBF4FF";
const P_RED       = "#FFF0EE";

const CATEGORIES = [
  { name: "IT Enabled Services",             icon: Monitor,       color: B_INDIGO, pastel: P_INDIGO },
  { name: "Content Writing / Documentation", icon: FileText,      color: B_BLUE,   pastel: P_BLUE   },
  { name: "Marketing & Communications",      icon: Megaphone,     color: B_RED,    pastel: P_RED    },
  { name: "Coaching & Training",             icon: GraduationCap, color: "#65A30D", pastel: "#F7FEE7" },
  { name: "Research",                        icon: Search,        color: B_BLUE,   pastel: P_BLUE   },
  { name: "Accounting & Finance",            icon: TrendingUp,    color: B_INDIGO, pastel: P_INDIGO },
  { name: "Fundraising",                     icon: Heart,         color: B_RED,    pastel: P_RED    },
  { name: "Management & Strategy",           icon: Package,       color: B_INDIGO, pastel: P_INDIGO },
  { name: "Legal",                           icon: Scale,         color: B_BLUE,   pastel: P_BLUE   },
  { name: "HR & People",                     icon: Users,         color: "#65A30D", pastel: "#F7FEE7" },
  { name: "Others",                          icon: Plus,          color: "#888",   pastel: "#f5f5f5"},
];

const AREA_TO_CAT: Record<string, string> = {
  Finance: "Accounting & Finance", IT: "IT Enabled Services",
  Education: "Coaching & Training", Legal: "Legal",
  Healthcare: "Coaching & Training", Environment: "Management & Strategy",
  HR: "HR & People", Operations: "Management & Strategy",
  Marketing: "Marketing & Communications", Culture: "Others",
  "Disaster Response": "Others",
};
const getCategory = (area: string) => AREA_TO_CAT[area] || "Others";

const SKILL_OPTIONS = [
  "Accounting and Finance","Administration","Coaching and Training",
  "Content Writing / Documentation","Fundraising","IT Enabled Services",
  "Legal","Management and Strategy","Marketing and Communications",
  "Operations and Logistics","Research","Translation",
];

const VOLUNTEER_LANGS = ["English", "Hindi", "Marathi"];
const VOLUNTEER_EXP   = "12";

function DrawerShell({ open, onClose, title, subtitle, accentTag, children }: {
  open: boolean; onClose: () => void; title: string; subtitle?: string; accentTag?: string; children: React.ReactNode;
}) {
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(13,27,62,0.45)", zIndex:200, opacity:open?1:0, pointerEvents:open?"auto":"none", transition:"opacity 0.22s", backdropFilter:"blur(2px)" }} />
      <div style={{ position:"fixed", top:"50%", left:"50%", transform:open?"translate(-50%,-50%) scale(1)":"translate(-50%,-48%) scale(0.97)", transition:"transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s", opacity:open?1:0, pointerEvents:open?"auto":"none", width:580, maxWidth:"calc(100vw - 40px)", maxHeight:"calc(100vh - 60px)", background:"#fff", borderRadius:16, zIndex:201, boxShadow:"0 24px 64px rgba(13,27,62,0.22)", display:"flex", flexDirection:"column", fontFamily:"'DM Sans', sans-serif", overflowY:"auto" }}>
        <div style={{ background:ACCENT_NAVY, padding:"24px 28px", borderRadius:"16px 16px 0 0", flexShrink:0 }}>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:7, color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, padding:"5px 12px", cursor:"pointer", marginBottom:16 }}>← Close</button>
          {accentTag && <div style={{ display:"inline-block", background:`${B_YELLOW}22`, border:`1px solid ${B_YELLOW}44`, borderRadius:100, padding:"3px 10px", fontSize:10.5, fontWeight:700, color:B_YELLOW, letterSpacing:"0.6px", textTransform:"uppercase", marginBottom:10 }}>{accentTag}</div>}
          <div style={{ fontSize:17, fontWeight:700, color:"#fff", lineHeight:1.3 }}>{title}</div>
          {subtitle && <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.45)", marginTop:5 }}>{subtitle}</div>}
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>{children}</div>
      </div>
    </>
  );
}

function ProjectDetailPanel({ project, onClose, onApply }: { project: any; onClose: () => void; onApply: () => void }) {
  if (!project) return null;
  const cat = CATEGORIES.find(c => c.name === getCategory(project.area)) || CATEGORIES[CATEGORIES.length-1];
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(13,27,62,0.3)", zIndex:150, backdropFilter:"blur(1px)" }} />
      <div style={{ position:"fixed", top:0, right:0, bottom:0, width:520, maxWidth:"95vw", background:"#fff", zIndex:151, boxShadow:"-8px 0 40px rgba(13,27,62,0.15)", overflowY:"auto", fontFamily:"'DM Sans', sans-serif" }}>
        <div style={{ background:ACCENT_NAVY, padding:"28px 28px 24px", position:"sticky", top:0, zIndex:1 }}>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:7, color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, padding:"5px 12px", cursor:"pointer", marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>
            <ArrowLeft size={13}/> Back
          </button>
          <div style={{ display:"flex", gap:10, marginBottom:10, flexWrap:"wrap" }}>
            <span style={{ background:`${cat.color}22`, color:cat.color, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:100, textTransform:"uppercase" }}>{project.area}</span>
            <span style={{ background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:100 }}>{project.mode}</span>
            {project.matched && <span style={{ background:`${B_YELLOW}22`, border:`1px solid ${B_YELLOW}44`, color:B_YELLOW, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:100, display:"flex", alignItems:"center", gap:4 }}><Sparkles size={10}/> AI Recommended</span>}
          </div>
          <h2 style={{ fontSize:18, fontWeight:700, color:"#fff", margin:"0 0 6px", lineHeight:1.3 }}>{project.title}</h2>
          <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.45)" }}>{project.ngo}</div>
        </div>
        <div style={{ padding:"24px 28px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
            {[["Host Organisation",project.ngo],["Area of Work",project.area],["Type of Delivery",project.mode],["Commitment",project.commitment||"Flexible"]].map(([l,v])=>(
              <div key={l} style={{ background:"#f8f8fc", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#aaaabc", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:13.5, fontWeight:600, color:ACCENT_NAVY }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#aaaabc", marginBottom:10 }}>Project Background</div>
            <p style={{ fontSize:13.5, color:"#444", lineHeight:1.7 }}>{project.description}</p>
          </div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#aaaabc", marginBottom:10 }}>Expected Learning for the Volunteer</div>
            <ul style={{ margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:7 }}>
              {["Experience co-creating solutions alongside NGO team/s and community","Apply and strengthen your technical expertise in a different context","Gain project management experience","Strengthen your sense of social responsibility and broaden your perspective on community impact","Build appreciation for different organisational cultures and ways of working"].map(pt=>(
                <li key={pt} style={{ display:"flex", gap:10, fontSize:13, color:"#555", lineHeight:1.5 }}><span style={{ color:"#65A30D", flexShrink:0 }}>•</span>{pt}</li>
              ))}
            </ul>
          </div>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#aaaabc", marginBottom:10 }}>Skills Required</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {project.skills.map((s: string)=><span key={s} style={{ background:P_INDIGO, color:B_INDIGO, fontSize:12.5, fontWeight:600, padding:"4px 12px", borderRadius:100 }}>{s}</span>)}
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onApply} style={{ flex:1, background:B_INDIGO, color:"#fff", border:"none", borderRadius:10, padding:"14px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>Apply Now</button>
            <button style={{ background:P_INDIGO, color:B_INDIGO, border:`1px solid ${B_INDIGO}22`, borderRadius:10, padding:"14px 18px", fontSize:13.5, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}><Bookmark size={16}/> Save</button>
          </div>
        </div>
      </div>
    </>
  );
}

function ProjectCard({ project, onSelect, onApply, saved, onToggleSave, aiRec=false }: { project:any; onSelect:()=>void; onApply:()=>void; saved:boolean; onToggleSave:()=>void; aiRec?:boolean }) {
  const [hov,setHov]=useState(false);
  const cat=CATEGORIES.find(c=>c.name===getCategory(project.area))||CATEGORIES[CATEGORIES.length-1];
  const Icon=cat.icon;
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{ background:"#fff", border:aiRec?`2px solid ${B_YELLOW}`:"1px solid #e8e8f0", borderRadius:14, overflow:"hidden", display:"flex", flexDirection:"column", transform:hov?"translateY(-3px)":"translateY(0)", boxShadow:hov?"0 8px 28px rgba(13,27,62,0.1)":"none", transition:"transform 0.18s, box-shadow 0.18s", cursor:"pointer" }}>
      {aiRec && <div style={{ background:B_YELLOW, padding:"5px 14px", display:"flex", alignItems:"center", gap:6, justifyContent:"center" }}><Sparkles size={12} color="#fff"/><span style={{ fontSize:10.5, fontWeight:700, color:"#fff", textTransform:"uppercase", letterSpacing:"0.8px" }}>AI Recommended</span></div>}
      <div onClick={onSelect} style={{ background:cat.pastel, height:76, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:8, background:"#fff", border:`1px solid ${cat.color}22`, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon size={18} color={cat.color}/></div>
          <div>
            <div style={{ fontSize:9.5, fontWeight:700, color:"#aaaabc", textTransform:"uppercase", letterSpacing:"0.8px" }}>Mode</div>
            <div style={{ fontSize:12, fontWeight:600, color:ACCENT_NAVY }}>{project.mode}</div>
          </div>
        </div>
        <button onClick={e=>{e.stopPropagation();onToggleSave();}} style={{ background:"none", border:"none", cursor:"pointer", padding:4, color:saved?B_YELLOW:"#ccc", transition:"color 0.15s" }}>
          {saved?<BookmarkCheck size={17}/>:<Bookmark size={17}/>}
        </button>
      </div>
      <div onClick={onSelect} style={{ flex:1, padding:"14px 16px 12px", display:"flex", flexDirection:"column", gap:6 }}>
        <div style={{ fontSize:10, fontWeight:700, color:cat.color, textTransform:"uppercase", letterSpacing:"0.6px" }}>{project.ngo}</div>
        <h3 style={{ fontSize:13.5, fontWeight:700, color:ACCENT_NAVY, margin:0, lineHeight:1.3 }}>{project.title}</h3>
        <p style={{ fontSize:12, color:"#6b6b7a", lineHeight:1.5, margin:0, display:"-webkit-box" as any, WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any, overflow:"hidden" }}>{project.description}</p>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:3, fontSize:11.5, color:"#8888a0" }}><Clock size={11}/>{project.commitment||"Flexible"}</div>
          <div style={{ display:"flex", alignItems:"center", gap:3, fontSize:11.5, color:"#8888a0" }}><MapPin size={11}/>{project.mode.includes("Remote")?"Remote":project.mode.includes("Hybrid")?"Hybrid":"On-site"}</div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
          {project.skills.slice(0,2).map((s:string)=><span key={s} style={{ background:P_INDIGO, color:B_INDIGO, fontSize:10.5, fontWeight:600, padding:"2px 8px", borderRadius:100 }}>{s}</span>)}
        </div>
      </div>
      <div style={{ padding:"10px 14px", borderTop:"1px solid #f0f0f8", display:"flex", gap:8 }}>
        <button onClick={e=>{e.stopPropagation();onToggleSave();}} style={{ flex:1, background:"none", border:"1.5px solid #dddde8", borderRadius:8, padding:"7px", fontSize:12, fontWeight:600, color:"#6b6b7a", cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>{saved?"Saved ✓":"Save for Later"}</button>
        <button onClick={e=>{e.stopPropagation();onApply();}} style={{ flex:2, background:cat.color, color:"#fff", border:"none", borderRadius:8, padding:"7px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>View & Apply<ChevronRight size={13}/></button>
      </div>
    </div>
  );
}

function ApplyModal({ project, onClose }: { project:any; onClose:()=>void }) {
  const [designation,setDesignation]=useState("Senior Product Manager");
  const [skills,setSkills]=useState<string[]>([]);
  const [attributes,setAttributes]=useState("");
  const [eduQual,setEduQual]=useState("MBA");
  const [workExp,setWorkExp]=useState(VOLUNTEER_EXP);
  const [similarTask,setSimilarTask]=useState<""| "yes"|"no">("");
  const [whyBestFit,setWhyBestFit]=useState("");
  const [threeSteps,setThreeSteps]=useState("");
  const [managerName,setManagerName]=useState("");
  const [managerEmail,setManagerEmail]=useState("");
  const [agreed,setAgreed]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const { triggerToast } = useAppContext();

  const canSubmit = whyBestFit.trim()&&threeSteps.trim()&&similarTask&&agreed;
  const reset = ()=>{onClose();setSubmitted(false);setWhyBestFit("");setThreeSteps("");setAgreed(false);setSimilarTask("");};
  const lbl: React.CSSProperties = {fontSize:11,fontWeight:700,color:"#aaaabc",textTransform:"uppercase",letterSpacing:"1px",display:"block",marginBottom:8};
  const inp: React.CSSProperties = {width:"100%",border:"1.5px solid #e0e0e8",borderRadius:10,padding:"10px 14px",fontSize:13.5,fontFamily:"'DM Sans', sans-serif",color:ACCENT_NAVY,outline:"none",boxSizing:"border-box"};
  const sel: React.CSSProperties = {...inp,appearance:"none",cursor:"pointer",background:"#fff"};

  const undertaking=[
    "I am voluntarily applying for a project of my choice under ProEngage",
    "I understand that these projects, and my contribution through them, are of great value to society",
    "I know that the Tata group has a reputation of doing good and this is an opportunity for me to do good with something I am good at",
    "I am able and willing to commit time over the project duration and complete it to the best of my ability",
    "I intend to visit the NGO at least once a month (only for on-site projects)",
    "To the best of my knowledge I do not have any planned significant events over the project duration",
    "I understand that following Tata best practices will help me remain true to Tata values while undertaking the project",
  ];

  if(!project)return null;

  return (
    <DrawerShell open={!!project} onClose={reset} title={project.title} subtitle={`${project.ngo} · ${project.area}`} accentTag="ProEngage Application">
      {submitted?(
        <div style={{ padding:"40px 28px", textAlign:"center" }}>
          <div style={{ background:"#FEFCE8", border:"1px solid #FDE68A", borderRadius:12, padding:"18px", marginBottom:20, textAlign:"left" }}>
            <div style={{ fontSize:13.5, color:"#064e3b", lineHeight:1.7 }}>
              <p style={{ marginBottom:6 }}>This being an <strong>{project.mode.toLowerCase().includes("remote")?"ONLINE":"ON-SITE"}</strong> project, you will be required to work {project.mode.toLowerCase().includes("remote")?"remotely":"in person"} and deliver it to: <strong>{project.ngo}</strong></p>
              <p>Commitment: <strong>{project.commitment||"Flexible"}</strong></p>
            </div>
          </div>
          <div style={{ width:56,height:56,borderRadius:"50%",background:"#F7FEE7",border:"2px solid #84CC16",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize:16, fontWeight:700, color:ACCENT_NAVY, marginBottom:8 }}>Application submitted!</div>
          <div style={{ fontSize:13.5, color:"#6b6b7a", lineHeight:1.6 }}>Your application has been sent to {project.ngo}. You'll receive an email confirmation shortly.</div>
        </div>
      ):(
        <div style={{ padding:"24px 28px" }}>
          <div style={{ background:P_INDIGO, border:`1px solid ${B_INDIGO}22`, borderRadius:10, padding:"12px 16px", marginBottom:22, display:"flex", flexWrap:"wrap", gap:"8px 24px" }}>
            {[["Mode",project.mode],["Commitment",project.commitment||"Flexible"]].map(([k,v])=>(
              <div key={k}><div style={{ fontSize:10, fontWeight:700, color:"#aaaabc", textTransform:"uppercase", letterSpacing:"0.8px" }}>{k}</div><div style={{ fontSize:13, fontWeight:600, color:ACCENT_NAVY }}>{v}</div></div>
            ))}
          </div>
          <div style={{ marginBottom:22 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#aaaabc", marginBottom:10 }}>Candidate Requirements (from your profile)</div>
            <div style={{ background:"#f8f8fc", borderRadius:10, padding:"12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
              {[["Skill Area",project.area],["Work Experience",`${VOLUNTEER_EXP} years`],["Languages",VOLUNTEER_LANGS.join(", ")]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", gap:12 }}><span style={{ fontSize:12.5, color:"#8888a0" }}>{k}</span><span style={{ fontSize:12.5, color:ACCENT_NAVY, fontWeight:600 }}>{v}</span></div>
              ))}
            </div>
            <div style={{ fontSize:11.5, color:B_INDIGO, marginTop:8 }}>* Please update your location and mobile no. through 'Edit Profile'. For project queries: <span style={{ textDecoration:"underline" }}>tataengage@tata.com</span></div>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:ACCENT_NAVY, marginBottom:16, paddingTop:4, borderTop:"1px solid #e8e8f0" }}>Application Details <span style={{ fontSize:11, color:B_RED, fontWeight:400 }}>* all fields are mandatory</span></div>
          
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Current Designation and Role *</label>
            <select value={designation} onChange={e=>setDesignation(e.target.value)} style={{...sel,marginBottom:8}}>
              {["Senior Product Manager","Product Manager","Software Engineer","Business Analyst","Finance Manager","HR Manager","Others"].map(d=><option key={d}>{d}</option>)}
            </select>
            <input type="text" placeholder="Specify if 'Others'" style={inp} onFocus={e=>(e.target.style.borderColor=B_INDIGO)} onBlur={e=>(e.target.style.borderColor="#e0e0e8")}/>
          </div>
          
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Project-specific skills / experience possessed *</label>
            <div style={{ border:"1.5px solid #e0e0e8", borderRadius:10, overflow:"hidden" }}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:"10px 12px", minHeight:44, borderBottom:skills.length?"1px solid #e8e8f0":"none" }}>
                {skills.map(s=><span key={s} style={{ background:P_INDIGO, color:B_INDIGO, fontSize:12, fontWeight:600, padding:"3px 10px", borderRadius:100, display:"flex", alignItems:"center", gap:4 }}>{s}<span onClick={()=>setSkills(skills.filter(x=>x!==s))} style={{ cursor:"pointer", opacity:0.6 }}><X size={10}/></span></span>)}
                {skills.length===0&&<span style={{ fontSize:13, color:"#aaaabc" }}>Select skills...</span>}
              </div>
              <div style={{ maxHeight:120, overflowY:"auto" }}>
                {SKILL_OPTIONS.filter(o=>!skills.includes(o)).map(o=>(
                  <div key={o} onClick={()=>setSkills([...skills,o])} style={{ padding:"7px 14px", fontSize:13, color:ACCENT_NAVY, cursor:"pointer" }} onMouseEnter={e=>(e.currentTarget.style.background=P_INDIGO)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>{o}</div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Attributes relevant to project</label>
            <textarea value={attributes} onChange={e=>setAttributes(e.target.value)} rows={2} placeholder="Describe relevant attributes" style={{...inp,resize:"none"}} onFocus={e=>(e.target.style.borderColor=B_INDIGO)} onBlur={e=>(e.target.style.borderColor="#e0e0e8")}/>
          </div>
          
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Educational Qualifications *</label>
            <select value={eduQual} onChange={e=>setEduQual(e.target.value)} style={{...sel,marginBottom:8}}>
              {["MBA","B.Tech / B.E.","CA","LLB","MBBS","M.Tech","BA / B.Com / B.Sc","Others"].map(q=><option key={q}>{q}</option>)}
            </select>
            <input type="text" placeholder="Specify institution or additional detail" style={inp} onFocus={e=>(e.target.style.borderColor=B_INDIGO)} onBlur={e=>(e.target.style.borderColor="#e0e0e8")}/>
          </div>
          
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Total Years of Work Experience *</label>
            <input type="number" value={workExp} onChange={e=>setWorkExp(e.target.value)} min="0" max="50" style={inp} onFocus={e=>(e.target.style.borderColor=B_INDIGO)} onBlur={e=>(e.target.style.borderColor="#e0e0e8")}/>
          </div>
          
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Have you done a similar task before? *</label>
            <div style={{ display:"flex", gap:24 }}>
              {[["yes","Yes"],["no","No"]].map(([val,lbl_])=>(
                <label key={val} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13.5, color:similarTask===val?B_INDIGO:ACCENT_NAVY, fontWeight:similarTask===val?600:400 }}>
                  <div onClick={()=>setSimilarTask(val as "yes"|"no")} style={{ width:18,height:18,borderRadius:"50%",border:`2px solid ${similarTask===val?B_INDIGO:"#dddde8"}`,background:similarTask===val?B_INDIGO:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                    {similarTask===val&&<div style={{ width:7,height:7,borderRadius:"50%",background:"#fff" }}/>}
                  </div>{lbl_}
                </label>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Why are you the best fit for this project? *</label>
            <textarea value={whyBestFit} onChange={e=>setWhyBestFit(e.target.value)} rows={4} placeholder="Describe your motivation and how your skills can help" style={{...inp,resize:"none"}} onFocus={e=>(e.target.style.borderColor=B_INDIGO)} onBlur={e=>(e.target.style.borderColor="#e0e0e8")}/>
          </div>
          
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Describe in 3 steps how you will ensure you complete this project *</label>
            <textarea value={threeSteps} onChange={e=>setThreeSteps(e.target.value)} rows={4} placeholder={"Step 1: ...\nStep 2: ...\nStep 3: ..."} style={{...inp,resize:"none"}} onFocus={e=>(e.target.style.borderColor=B_INDIGO)} onBlur={e=>(e.target.style.borderColor="#e0e0e8")}/>
          </div>
          
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:700, color:ACCENT_NAVY, marginBottom:6 }}>Manager Details <span style={{ fontWeight:400, color:"#8888a0", fontSize:12 }}>(Optional)</span></div>
            <p style={{ fontSize:12.5, color:"#8888a0", lineHeight:1.55, marginBottom:10 }}>If selected, would you like us to inform your manager? Please share their details:</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <input type="text" value={managerName} onChange={e=>setManagerName(e.target.value)} placeholder="Manager's full name" style={inp} onFocus={e=>(e.target.style.borderColor=B_INDIGO)} onBlur={e=>(e.target.style.borderColor="#e0e0e8")}/>
              <input type="email" value={managerEmail} onChange={e=>setManagerEmail(e.target.value)} placeholder="manager@tata.com" style={inp} onFocus={e=>(e.target.style.borderColor=B_INDIGO)} onBlur={e=>(e.target.style.borderColor="#e0e0e8")}/>
            </div>
          </div>
          
          <div style={{ marginBottom:20, background:"#f8f8fc", borderRadius:12, padding:"16px 18px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:ACCENT_NAVY, marginBottom:4 }}>Volunteer Undertaking <span style={{ fontWeight:400, fontSize:11.5, color:"#8888a0" }}>(Please read before applying.)</span></div>
            <ul style={{ margin:"10px 0 0", padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:6 }}>
              {undertaking.map((pt,i)=><li key={i} style={{ display:"flex", gap:10, fontSize:12.5, color:"#555", lineHeight:1.5 }}><span style={{ color:B_INDIGO, fontWeight:700, flexShrink:0 }}>•</span>{pt}</li>)}
            </ul>
            <label style={{ display:"flex", alignItems:"flex-start", gap:10, marginTop:14, cursor:"pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ marginTop:3, accentColor:B_INDIGO, width:15, height:15, flexShrink:0 }}/>
              <span style={{ fontSize:13, color:B_INDIGO, fontWeight:600, lineHeight:1.5 }}>I agree to the above mentioned terms of submitting an application under ProEngage</span>
            </label>
          </div>
          
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={reset} style={{ flex:1, background:"#fff", border:"1.5px solid #dddde8", borderRadius:10, padding:"12px", fontSize:13.5, fontWeight:600, color:"#6b6b7a", cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>Save for Later</button>
            <button disabled={!canSubmit} onClick={()=>{setSubmitted(true);triggerToast(`Application for ${project.title} submitted!`);}} style={{ flex:2, background:canSubmit?B_INDIGO:"#e0e0e8", color:canSubmit?"#fff":"#aaa", border:"none", borderRadius:10, padding:"12px", fontSize:14, fontWeight:700, cursor:canSubmit?"pointer":"not-allowed", fontFamily:"'DM Sans', sans-serif" }}>Submit Application</button>
          </div>
        </div>
      )}
    </DrawerShell>
  );
}

export default function ProEngageView() {
  const navigate = useNavigate();
  const { appliedProjects, setAppliedProjects, likedProjects, setLikedProjects } = useAppContext();

  const [selectedCategory, setSelectedCategory] = useState<string|null>(null);
  const [searchQuery,       setSearchQuery]       = useState("");
  const [activeFilter,      setActiveFilter]      = useState<"all"|"recommended"|"saved">("all");
  const [detailProject,     setDetailProject]     = useState<any>(null);
  const [applyProject,      setApplyProject]      = useState<any>(null);

  const toggleSave = (id:number)=>setLikedProjects(likedProjects.includes(id)?likedProjects.filter(x=>x!==id):[...likedProjects,id]);

  const aiRecommended = PROENGAGE_PROJECTS.filter(p=>p.matched);
  const filteredProjects = PROENGAGE_PROJECTS.filter(p=>{
    if(selectedCategory&&getCategory(p.area)!==selectedCategory)return false;
    if(activeFilter==="recommended"&&!p.matched)return false;
    if(activeFilter==="saved"&&!likedProjects.includes(p.id))return false;
    if(searchQuery&&!`${p.title} ${p.ngo} ${p.area} ${p.skills.join(" ")}`.toLowerCase().includes(searchQuery.toLowerCase()))return false;
    return true;
  });

  const catCounts=CATEGORIES.reduce<Record<string,number>>((acc,cat)=>{
    acc[cat.name]=PROENGAGE_PROJECTS.filter(p=>getCategory(p.area)===cat.name).length;
    return acc;
  },{});

  const showAISection = aiRecommended.length>0&&!selectedCategory&&activeFilter==="all"&&!searchQuery;

  return (
    <div style={{ background:"#f8f9ff", minHeight:"100vh", fontFamily:"'DM Sans', sans-serif", paddingTop:80, paddingBottom:80 }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px" }}>

        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <button onClick={()=>navigate("/hub")} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", fontSize:13.5, fontWeight:600, color:B_INDIGO, cursor:"pointer", padding:0, marginBottom:14 }}>
            <ArrowLeft size={15}/> Back to Hub
          </button>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"#aaaabc", marginBottom:6 }}>ProEngage 2025 | Edition 11</div>
              <h1 style={{ fontSize:28, fontWeight:900, color:ACCENT_NAVY, margin:0, letterSpacing:-0.5 }}>Browse Projects</h1>
            </div>
            <button onClick={()=>navigate("/dashboard")} style={{ background:P_INDIGO, color:B_INDIGO, border:`1px solid ${B_INDIGO}22`, borderRadius:10, padding:"10px 18px", fontSize:13.5, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}>
              <Bookmark size={15}/> My Applications
            </button>
          </div>
        </div>

        {/* AI Recommended */}
        {showAISection&&(
          <div style={{ marginBottom:40 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:P_YELLOW, display:"flex", alignItems:"center", justifyContent:"center" }}><Sparkles size={16} color={B_YELLOW}/></div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#aaaabc" }}>AI Matched for You</div>
                <div style={{ fontSize:16, fontWeight:900, color:ACCENT_NAVY }}>Recommended Projects</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
              {aiRecommended.slice(0,3).map(p=>(
                <ProjectCard key={p.id} project={p} onSelect={()=>setDetailProject(p)} onApply={()=>setApplyProject(p)} saved={likedProjects.includes(p.id)} onToggleSave={()=>toggleSave(p.id)} aiRec/>
              ))}
            </div>
          </div>
        )}

        {/* Search + filter */}
        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
          <div style={{ flex:1, position:"relative", minWidth:220 }}>
            <Search size={16} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#aaaabc" }}/>
            <input type="text" placeholder="Search by skill, NGO or project name..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              style={{ width:"100%", paddingLeft:40, paddingRight:14, paddingTop:11, paddingBottom:11, border:"1.5px solid #e0e0e8", borderRadius:10, fontSize:13.5, fontFamily:"'DM Sans', sans-serif", color:ACCENT_NAVY, outline:"none", background:"#fff", boxSizing:"border-box" }}
              onFocus={e=>(e.target.style.borderColor=B_INDIGO)} onBlur={e=>(e.target.style.borderColor="#e0e0e8")}/>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {[["all","All Projects"],["recommended","AI Recommended"],["saved","Saved"]].map(([id,lbl_])=>(
              <button key={id} onClick={()=>setActiveFilter(id as any)} style={{ padding:"10px 16px", borderRadius:10, border:`1.5px solid ${activeFilter===id?B_INDIGO:"#e0e0e8"}`, background:activeFilter===id?B_INDIGO:"#fff", color:activeFilter===id?"#fff":"#666", fontSize:13, fontWeight:activeFilter===id?700:400, cursor:"pointer", whiteSpace:"nowrap" }}>{lbl_}</button>
            ))}
          </div>
        </div>

        {/* Category grid */}
        {!selectedCategory&&!searchQuery&&activeFilter==="all"&&(
          <div style={{ marginBottom:36 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#aaaabc", marginBottom:14 }}>Browse by Category</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:10 }}>
              {CATEGORIES.map(cat=>{
                const Icon=cat.icon; const count=catCounts[cat.name]||0;
                return(
                  <button key={cat.name} onClick={()=>setSelectedCategory(cat.name)}
                    style={{ background:"#fff", border:"1px solid #e8e8f0", borderRadius:12, padding:"14px 10px", cursor:"pointer", textAlign:"center", transition:"all 0.18s", fontFamily:"'DM Sans', sans-serif" }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=cat.pastel;(e.currentTarget as HTMLElement).style.borderColor=`${cat.color}33`;(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#fff";(e.currentTarget as HTMLElement).style.borderColor="#e8e8f0";(e.currentTarget as HTMLElement).style.transform="translateY(0)";}}>
                    <div style={{ width:34,height:34,borderRadius:8,background:cat.pastel,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px" }}><Icon size={17} color={cat.color}/></div>
                    <div style={{ fontSize:11, fontWeight:700, color:ACCENT_NAVY, lineHeight:1.3, marginBottom:3 }}>{cat.name}</div>
                    <div style={{ fontSize:10, fontWeight:600, color:"#aaaabc" }}>{count} projects</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Category header */}
        {selectedCategory&&(
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={()=>setSelectedCategory(null)} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", fontSize:13.5, fontWeight:600, color:B_INDIGO, cursor:"pointer", padding:0 }}><ArrowLeft size={15}/> Back to categories</button>
            <div style={{ width:1, height:18, background:"#e0e0e8" }}/>
            <div style={{ fontSize:14, fontWeight:700, color:ACCENT_NAVY }}>{selectedCategory}</div>
            <button onClick={()=>setSelectedCategory(null)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"#aaaabc" }}><X size={18}/></button>
          </div>
        )}

        {/* Active filter chip */}
        {(selectedCategory||searchQuery||activeFilter!=="all")&&(
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            <span style={{ fontSize:12.5, color:"#8888a0" }}>Showing:</span>
            {selectedCategory&&<span style={{ background:P_INDIGO, color:B_INDIGO, fontSize:12, fontWeight:700, padding:"3px 12px", borderRadius:100, display:"flex", alignItems:"center", gap:6 }}>{selectedCategory}<X size={12} style={{ cursor:"pointer" }} onClick={()=>setSelectedCategory(null)}/></span>}
            {searchQuery&&<span style={{ background:P_BLUE, color:B_BLUE, fontSize:12, fontWeight:700, padding:"3px 12px", borderRadius:100 }}>"{searchQuery}"</span>}
            <span style={{ fontSize:12.5, color:"#aaaabc" }}>{filteredProjects.length} result{filteredProjects.length!==1?"s":""}</span>
          </div>
        )}

        {/* Project grid */}
        {filteredProjects.length>0?(
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
            {filteredProjects.map(p=>(
              <ProjectCard key={p.id} project={p} onSelect={()=>setDetailProject(p)} onApply={()=>setApplyProject(p)} saved={likedProjects.includes(p.id)} onToggleSave={()=>toggleSave(p.id)}/>
            ))}
          </div>
        ):(
          <div style={{ textAlign:"center", padding:"60px 40px", background:"#fff", borderRadius:14, border:"1px dashed #dddde8" }}>
            <div style={{ fontSize:15, fontWeight:700, color:ACCENT_NAVY, marginBottom:8 }}>No projects found</div>
            <div style={{ fontSize:13.5, color:"#8888a0" }}>Try adjusting your filters or search query.</div>
          </div>
        )}
      </div>

      {detailProject&&<ProjectDetailPanel project={detailProject} onClose={()=>setDetailProject(null)} onApply={()=>{setApplyProject(detailProject);setDetailProject(null);}}/>}
      {applyProject&&<ApplyModal project={applyProject} onClose={()=>setApplyProject(null)}/>}
    </div>
  );
}
