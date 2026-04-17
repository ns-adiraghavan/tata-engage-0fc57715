import imgPhotos  from "@/assets/tatabball.jpg";
import imgVideos  from "@/assets/tata_power.JPG";
import imgStories from "@/assets/trent.jpg";
import imgEvents  from "@/assets/IHCL.jpg";
import imgEModule from "@/assets/Tata_international.jpeg";
import badgeVeteran    from "@/assets/badges/veteran.svg";
import badgeAmbassador from "@/assets/badges/ambassador.svg";
import badgeNorthStar  from "@/assets/badges/northstar.svg";
import badgeLead       from "@/assets/badges/lead.svg";
import badgeChampion   from "@/assets/badges/lead.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// (badge icons replaced with image assets)
import { IS_PE_SEASON } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const B_YELLOW    = "#F5A623";
const B_TEAL      = "#00A896";
const B_TEAL_DARK = "#00756B";   // darker teal — testimonial bg
const B_RED       = "#E8401C";
const B_BLUE      = "#1E6BB8";   // cobalt blue — primary interactive (replaces indigo)
const ACCENT_NAVY = "#0D1B3E";

// P_BLUE is the cobalt pastel — used wherever P_BLUE was
const P_YELLOW    = "#FEF6E4";
const P_RED       = "#FFF0EE";
const P_TEAL      = "#E6F8F5";
const P_TEAL_DARK = "#E8F5D4";   // lime green pastel — testimonial bg
const B_LIME_DARK = "#3D6B1E";   // dark green — testimonial text
const P_BLUE      = "#EBF4FF";   // cobalt pastel — replaces P_BLUE everywhere

// ─── KPI colours — bold solid backgrounds matching HomeSections tiles ─────────
const KPI_PROENGAGE  = "#1A6B3C";   // ProEngage green
const KPI_TVW        = "#3E7EB0";   // TVW blue
const KPI_CVP        = "#F5A623";   // CVP yellow (B_YELLOW)
const KPI_PINK       = "#F2778A";   // Salmon pink (home screen)
const KPI_NUMBERS    = "#A8C94A";   // In the numbers (lime green)
const KPI_TEAL       = "#00A896";   // Disaster Response teal
const IS_NEW_VOLUNTEER = false;

const NOTIFICATIONS: Record<string, boolean> = {
  viewOpportunities: true,
  diyActivities: false,
  proEngageProject: true,
};

const notifDot: React.CSSProperties = { position: "absolute", top: -3, right: -6, width: 8, height: 8, borderRadius: "50%", background: "#E8401C", boxShadow: "0 0 0 2px white" };

const VOLUNTEER = {
  firstName: "Shrirang",
  lastName: "Dhavale",
  company: "Tata Services",
  designation: "General Manager",
  city: "Mumbai",
  gender: "Male",
  birthDate: "1974-09-29",
  email: "sdhavale@tata.com",
  phone: "+91 96195 51533",
  function: "Other",
  educationQualification: "Master's Degree (MA, MSc, MCom, MBA, MCA, M.Des, MTech, ME, MPharm, LLM, MArch, MD, etc.)",
  totalWorkExperience: "25",
  languages: ["English", "Hindi", "Marathi"],
  skills: ["Coaching", "Training"],
  interests: ["Education"],
  preferredMode: "Either" as "Remote" | "In-Person" | "Either",
  disasterResponseInterest: false,
  notifyProEngage: true,
  notifyTVW: true,
  linkedinUrl: "",
  stats: {
    hoursVolunteered: IS_NEW_VOLUNTEER ? 0 : 120,
   projectsApplied:  IS_NEW_VOLUNTEER ? 0 : 14,
   projectsCompleted:IS_NEW_VOLUNTEER ? 0 : 8,
   projectsDropped:  IS_NEW_VOLUNTEER ? 0 : 1,
   referrals:        IS_NEW_VOLUNTEER ? 0 : 2,
   badgesEarned:     IS_NEW_VOLUNTEER ? 0 : 5,
  },
  activeApplication: IS_NEW_VOLUNTEER ? null : {
    title: "Conduct Mock Interviews",
    ngo: "Friends of Children",
    status: "Matched" as const,
    matchDate: "10 Dec 2025",
    edition: "ProEngage 2025 | 02",
    skillArea: "Coaching and Training",
    startDate: "01 Dec 2025",
    mode: "In-Person",
    duration: "2 months",
    hoursPerWeek: "2",
  },
};

const TESTIMONIAL = {
  quote: "We had a great experience while working with Shrirang. He was very professional. His expertise was very useful for the project. We would love to associate more with him again.",
  author: "Manoj Kumar Sharma",
  role: "Project Lead, Friends of Children",
  project: "Mock Interviews - Students",
  edition: "ProEngage 2025 | 01",
  avatarBg: "#1A4731",
  avatarInitials: "MK",
};

const TVW_OPPORTUNITIES = [
  { id: "t1", title: "Tree Plantation Drive — Aarey Forest",         company: "Tata Motors",              date: "18 Apr 2026", mode: "In-person · Mumbai",  duration: "Half day", spotsLeft: 12, theme: "Environment",  accentColor: "#65A30D", pastel: "#F7FEE7" },
  { id: "t2", title: "Digital Literacy Workshop for Senior Citizens", company: "Tata Consultancy Services", date: "25 Apr 2026", mode: "Online · Pan-India",  duration: "3 hours",  spotsLeft: 45, theme: "Education",    accentColor: B_BLUE,   pastel: P_BLUE   },
  { id: "t3", title: "Healthcare Camp — Blood Donation Drive",        company: "Tata Steel",               date: "4 Oct 2025",  mode: "In-person · Pune",    duration: "Half day", spotsLeft: 8,  theme: "Health",      accentColor: B_RED,    pastel: P_RED    },
];

const DIY_ACTIVITIES = [
  {
    id: "d1",
    title: "Create Awareness on Social Entitlements",
    desc: "TCS' 'Each One Empowers One' initiative. Help citizens understand key entitlements and empower semi-literate individuals with legal and social literacy — enhancing their dignity and confidence.",
    theme: "Citizen Empowerment",
    org: "TCS Empowers",
    effort: "Low",
    accentColor: B_TEAL,
    pastel: P_TEAL,
  },
  {
    id: "d2",
    title: "Donate Blood, Save Lives",
    desc: "By choosing to donate blood you're not just giving blood — you're giving hope and a chance at life to someone in need. Sign up at your nearest Tata blood drive.",
    theme: "Health",
    org: "SDG Goal 3",
    effort: "Low",
    accentColor: "#65A30D",
    pastel: "#F7FEE7",
  },
];

const PE_OPPORTUNITIES = [
  { id: "p1", title: "Build a Fundraising Dashboard for Child Rights NGO",  ngo: "Butterflies India",     skillArea: "Finance / Data",   duration: "3 months", mode: "Online",          closes: "15 Jul 2025", applicants: 14, match: 94, accentColor: B_BLUE,   pastel: P_BLUE   },
  { id: "p2", title: "Marketing Strategy for Women's Skilling Programme",   ngo: "Stree Mukti Sanghatna", skillArea: "Marketing",        duration: "4 months", mode: "Hybrid · Mumbai", closes: "20 Jul 2025", applicants: 9,  match: 89, accentColor: "#65A30D", pastel: "#F7FEE7" },
  { id: "p3", title: "Product Roadmap for Disability Employment Platform",  ngo: "Samarthanam Trust",     skillArea: "Product Strategy", duration: "6 months", mode: "Online",          closes: "30 Jul 2025", applicants: 6,  match: 97, accentColor: B_TEAL, pastel: P_TEAL },
];

const HISTORY_APPLICATIONS = [
  // PE 2025 | 02 (active)
  { id: "a0",  project: "Conduct Mock Interviews",                                  edition: "ProEngage 2025 | 02", year: "2025", status: "Selected",                    date: "Dec 2025",    type: "ProEngage", ngo: "Friends of Children",                            skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "Dec 2025", done: true }, { label: "Under Review", date: "Dec 2025", done: true }, { label: "Selected", date: "10 Dec 2025", done: true }, { label: "Project Complete", date: "Ongoing", done: false }] },
  // PE 2025 | 01
  { id: "a1",  project: "Mock Interviews - Students",                               edition: "ProEngage 2025 | 01", year: "2025", status: "Completed",                  date: "2025",        type: "ProEngage", ngo: "Friends of Children",                            skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2025", done: true }, { label: "Under Review", date: "2025", done: true }, { label: "Selected", date: "2025", done: true }, { label: "Project Complete", date: "2025", done: true }] },
  { id: "a2",  project: "Mock Interviews",                                          edition: "ProEngage 2025 | 01", year: "2025", status: "Selected",                    date: "2025",        type: "ProEngage", ngo: "Tata STRIVE",                                    skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2025", done: true }, { label: "Under Review", date: "2025", done: true }, { label: "Selected", date: "2025", done: true }, { label: "Project Complete", date: "Ongoing", done: false }] },
  // PE 2024 | 02
  { id: "a3",  project: "Mock Interviews",                                          edition: "ProEngage 2024 | 02", year: "2024", status: "Completed",                  date: "2024",        type: "ProEngage", ngo: "Tata STRIVE",                                    skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2024", done: true }, { label: "Under Review", date: "2024", done: true }, { label: "Selected", date: "2024", done: true }, { label: "Project Complete", date: "2024", done: true }] },
  // PE 2024 | 01
  { id: "a4",  project: "Interviewing Candidates",                                  edition: "ProEngage 2024 | 01", year: "2024", status: "Dropped Out",                 date: "2024",        type: "ProEngage", ngo: "Buddy4Study India Foundation",                    skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2024", done: true }, { label: "Under Review", date: "2024", done: true }, { label: "Selected", date: "2024", done: true }, { label: "Dropped Out", date: "2024", done: true }] },
  // PE 2023 | 02
  { id: "a5",  project: "Vernacular: Digital Learning",                             edition: "ProEngage 2023 | 02", year: "2023", status: "Selected",                    date: "2023",        type: "ProEngage", ngo: "Chezuba",                                        skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2023", done: true }, { label: "Under Review", date: "2023", done: true }, { label: "Selected", date: "2023", done: true }, { label: "Project Complete", date: "Ongoing", done: false }] },
  { id: "a6",  project: "Annual report writing",                                    edition: "ProEngage 2023 | 02", year: "2023", status: "Project requirement fulfilled", date: "2023",        type: "ProEngage", ngo: "Little Angel Foundation",                         skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2023", done: true }, { label: "Under Review", date: "2023", done: true }, { label: "Selected", date: "2023", done: true }, { label: "Requirement Fulfilled", date: "2023", done: true }] },
  // PE 2023 | 01
  { id: "a7",  project: "Developing a Sexual Harassment Policy",                   edition: "ProEngage 2023 | 01", year: "2023", status: "Selected",                    date: "2023",        type: "ProEngage", ngo: "Chezuba",                                        skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2023", done: true }, { label: "Under Review", date: "2023", done: true }, { label: "Selected", date: "2023", done: true }, { label: "Project Complete", date: "Ongoing", done: false }] },
  // PE 2022 | 02
  { id: "a8",  project: "Translation of booklet from English, Marathi",            edition: "ProEngage 2022 | 02", year: "2022", status: "Selected",                    date: "2022",        type: "ProEngage", ngo: "Ekansh Trust",                                   skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2022", done: true }, { label: "Under Review", date: "2022", done: true }, { label: "Selected", date: "2022", done: true }, { label: "Project Complete", date: "Ongoing", done: false }] },
  { id: "a9",  project: "Translations",                                             edition: "ProEngage 2022 | 02", year: "2022", status: "Project requirement fulfilled", date: "2022",        type: "ProEngage", ngo: "The Vishwas And Anuradha Memorial (TVAM) Foundation", skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2022", done: true }, { label: "Under Review", date: "2022", done: true }, { label: "Selected", date: "2022", done: true }, { label: "Requirement Fulfilled", date: "2022", done: true }] },
  // PE 2022 | 01
  { id: "a10", project: "Audio Book Recording",                                     edition: "ProEngage 2022 | 01", year: "2022", status: "Selected",                    date: "2022",        type: "ProEngage", ngo: "GiftAbled",                                      skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2022", done: true }, { label: "Under Review", date: "2022", done: true }, { label: "Selected", date: "2022", done: true }, { label: "Project Complete", date: "Ongoing", done: false }] },
  { id: "a11", project: "Mock interview",                                           edition: "ProEngage 2022 | 01", year: "2022", status: "Volunteer Selected by Other NGO", date: "2022",        type: "ProEngage", ngo: "Bright Future",                                  skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2022", done: true }, { label: "Under Review", date: "2022", done: true }, { label: "Volunteer Selected by Other NGO", date: "2022", done: true }] },
  // PE 2021 | 02
  { id: "a12", project: "Audio Book Recording",                                     edition: "ProEngage 2021 | 02", year: "2021", status: "Selected",                    date: "2021",        type: "ProEngage", ngo: "GiftAbled",                                      skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2021", done: true }, { label: "Under Review", date: "2021", done: true }, { label: "Selected", date: "2021", done: true }, { label: "Project Complete", date: "Ongoing", done: false }] },
  // PE 2020 | 01
  { id: "a13", project: "Write an annual report",                                   edition: "ProEngage 2020 | 01", year: "2020", status: "Selected",                    date: "2020",        type: "ProEngage", ngo: "Chezuba",                                        skillArea: "Coaching and Training", timeline: [{ label: "Applied", date: "2020", done: true }, { label: "Under Review", date: "2020", done: true }, { label: "Selected", date: "2020", done: true }, { label: "Project Complete", date: "Ongoing", done: false }] },
];

const HISTORY_PROJECTS = [
  { id: "p0",  title: "Conduct Mock Interviews",                      ngo: "Friends of Children",  edition: "ProEngage 2025 | 02", year: "2025", hours: 16,  outcome: "Project in progress. Mock interview sessions underway with student cohort.",                          skills: ["Coaching", "Training"], cert: false, projectStatus: "Matched"   },
  { id: "p1",  title: "Mock Interviews - Students",                   ngo: "Friends of Children",  edition: "ProEngage 2025 | 01", year: "2025", hours: 16,  outcome: "Completed 16 hours of mock interview coaching for students. Certificate received.",                  skills: ["Coaching", "Training"], cert: true,  projectStatus: "Completed" },
  { id: "p3",  title: "Mock Interviews",                              ngo: "Tata STRIVE",          edition: "ProEngage 2024 | 02", year: "2024", hours: 8,   outcome: "Completed 4 actual hours of mock interview coaching. Certificate received.",                         skills: ["Coaching", "Training"], cert: true,  projectStatus: "Completed" },
  { id: "p7",  title: "Developing a Sexual Harassment Policy",        ngo: "Chezuba",              edition: "ProEngage 2023 | 01", year: "2023", hours: 24,  outcome: "Policy framework drafted and submitted to the organisation.",                                         skills: ["Coaching", "Training"], cert: false, projectStatus: "Completed" },
  { id: "p8",  title: "Translation of booklet from English, Marathi", ngo: "Ekansh Trust",        edition: "ProEngage 2022 | 02", year: "2022", hours: 12,  outcome: "Translated educational booklet from English to Marathi for field distribution.",                      skills: ["Coaching", "Training"], cert: false, projectStatus: "Completed" },
  { id: "p10", title: "Audio Book Recording",                         ngo: "GiftAbled",            edition: "ProEngage 2022 | 01", year: "2022", hours: 12,  outcome: "Audio book recorded and delivered to GiftAbled for their accessibility library.",                     skills: ["Coaching", "Training"], cert: false, projectStatus: "Completed" },
  { id: "p11", title: "Audio Book Recording",                         ngo: "GiftAbled",            edition: "ProEngage 2021 | 02", year: "2021", hours: 8,   outcome: "Audio book recording sessions completed for GiftAbled.",                                              skills: ["Coaching", "Training"], cert: false, projectStatus: "Completed" },
  { id: "p12", title: "Write an annual report",                       ngo: "Chezuba",              edition: "ProEngage 2020 | 01", year: "2020", hours: 24,  outcome: "Annual report drafted and submitted to Chezuba.",                                                     skills: ["Coaching", "Training"], cert: false, projectStatus: "Completed" },
];

const HISTORY_FEEDBACK = [
  { id: "f1", projectId: "p1", title: "Mock Interviews - Students", ngo: "Friends of Children", edition: "ProEngage 2025 | 01", year: "2025",
    completed: true, months: 2, hoursWeek: 2, nps: 10,
    supportRatings: [4, 4, 4], attrRatings: [2, 4, 3, 4, 4],
    suggestions: "" },
  { id: "f2", projectId: "p3", title: "Mock Interviews", ngo: "Tata STRIVE", edition: "ProEngage 2024 | 02", year: "2024",
    completed: true, months: 1, hoursWeek: 1, nps: 10,
    supportRatings: [4, 4, 4], attrRatings: [2, 3, 2, 2, 4],
    suggestions: "" },
];

const BADGES = [
  { id: "b1", name: "ProEngage Veteran",     image: badgeVeteran,    desc: "Successfully completed 5+ PE projects logging over 100 hours",         earned: "2026", color: "#8E2548" },
  { id: "b2", name: "ProEngage Ambassador",  image: badgeAmbassador, desc: "Successfully shared a testimonial on LinkedIn",                         earned: "2025", color: "#1E6BB8" },
  { id: "b3", name: "ProEngage North Star",  image: badgeNorthStar,  desc: "Successfully signed up at least 3 family members who completed PE project", earned: "2026", color: "#0D1B3E" },
  { id: "b4", name: "ProEngage 23 Champion", image: badgeChampion,   desc: "Successfully completed 23rd Edition of PE",                              earned: "2026", color: "#E8551C" },
  { id: "b5", name: "ProEngage Pioneer",     image: badgeLead,       desc: "Successfully completed the very first PE project",                      earned: "2020", color: "#E91E80" },
];

const RESOURCES = [
  { id: "photos",  label: "Photos",   desc: "Gallery from TVW22, VolCon 2024 and ProEngage projects", count: "247 items",   accentColor: B_BLUE,     pastel: P_BLUE,     photo: imgPhotos  },
  { id: "videos",  label: "Videos",   desc: "Volunteer stories, impact films and event highlights",    count: "38 videos",   accentColor: B_TEAL,     pastel: P_TEAL,     photo: imgVideos  },
  { id: "stories", label: "Stories",  desc: "Volunteer experiences and community impact narratives",   count: "94 stories",  accentColor: "#65A30D",  pastel: "#F7FEE7",  photo: imgStories },
  { id: "events",  label: "Events",   desc: "VolCon, Volympics and upcoming community gatherings",     count: "12 upcoming", accentColor: "#1A6B3C",  pastel: "#E6F5EE",  photo: imgEvents  },
  { id: "emodule", label: "E-Module", desc: "ProEngage orientation, NGO readiness kit and dos & don'ts", count: "5 modules", accentColor: "#C8850A",  pastel: "#FEF6E4",  photo: imgEModule },
];

const STAT_TOOLTIPS: Record<string, string> = {
  "Hours Volunteered":  "Total hours logged across all TVW events and ProEngage projects.",
  "Projects Applied":   "ProEngage applications submitted. You can apply to multiple projects per edition.",
  "Projects Completed": "Projects where both you and the NGO have submitted feedback. Unlocks your certificate.",
  "DROPPED OUT":        "Projects that ended early. These remain on your record — it's part of honest volunteering.",
  "No of Referrals":    "Colleagues or family members who joined TataEngage via your referral link.",
  "Badges Earned":      "Awarded for key milestones — completing a project, 100 hours, TVW participation and more.",
};


// Activity tab config by season state
const hasActive = !!VOLUNTEER.activeApplication;

function getActivitySlicers() {
  if (IS_PE_SEASON && hasActive) {
    return [
      { id: "opportunities", label: "View Opportunities" },
      { id: "diy",           label: "DIY Activities"     },
      { id: "proengage",     label: "My ProEngage Project"},
    ];
  }
  if (IS_PE_SEASON && !hasActive) {
    return [
      { id: "opportunities", label: "View Opportunities" },
      { id: "diy",           label: "DIY Activities"     },
      { id: "apply",         label: "Apply for a Project"},
    ];
  }
  return [
    { id: "opportunities", label: "View Opportunities"      },
    { id: "diy",           label: "DIY Activities"          },
    { id: "early",         label: "Apply Early for ProEngage"},
  ];
}

const HISTORY_SLICERS = [
  { id: "projects",     label: "My Projects"     },
  { id: "applications", label: "My Applications" },
  { id: "experience",   label: "My Experience"   },
  { id: "certificates", label: "My Certificates" },
  { id: "feedback",     label: "My Feedback"     },
];

const SECTIONS = [
  { id: "snapshot",   label: "Snapshot"   },
  { id: "activities", label: "Activities" },
  { id: "history",    label: "History"    },
  { id: "resources",  label: "Resources"  },
];

// ─── Shared style helpers ─────────────────────────────────────────────────────
const card: React.CSSProperties = { background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "20px 22px" };

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start || target === 0) { setValue(0); return; }
    let t0: number | null = null;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return value;
}

// ─── Stat tile ────────────────────────────────────────────────────────────────
function StatTile({ value, suffix = "", label, pastel, accentColor, delay, started }: {
  value: number; suffix?: string; label: string; pastel: string; accentColor: string; delay: number; started: boolean;
}) {
  const [go, setGo] = useState(false);
  const [showTip, setShowTip] = useState(false);
  useEffect(() => {
    if (started) { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); }
  }, [started, delay]);
  const n = useCountUp(value, 1100, go);
  const isZero = value === 0;
  return (
    <div
      style={{
        background: isZero ? "#fafafa" : accentColor,
        borderRadius: 18, padding: "22px 14px 18px", textAlign: "center",
        border: "none",
        boxShadow: isZero ? "none" : `0 4px 20px ${accentColor}33`,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "default", position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => { if (!isZero) { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${accentColor}44`; } setShowTip(true); }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = isZero ? "none" : `0 4px 20px ${accentColor}33`; setShowTip(false); }}
    >
      {/* Top accent line */}
      {!isZero && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.4, background: "rgba(255,255,255,0.35)" }} />}
      {isZero && <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 32, height: 32, borderRadius: "50%", border: `2px dashed ${accentColor}44`, animation: "pulse-ring 2s ease-in-out infinite" }} />}
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isZero ? 32 : 38, fontWeight: 900, lineHeight: 1, letterSpacing: "-2px", color: isZero ? "#ccccdd" : "#ffffff", position: "relative", zIndex: 1 }}>
        {n}{suffix}
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: isZero ? "#bbbbcc" : "rgba(255,255,255,0.85)", marginTop: 10, textTransform: "uppercase", letterSpacing: "1px", lineHeight: 1.3 }}>{label}</div>
      {showTip && (
        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: ACCENT_NAVY, color: "rgba(255,255,255,0.88)", fontSize: 12, lineHeight: 1.5, padding: "10px 14px", borderRadius: 9, width: 200, zIndex: 50, pointerEvents: "none", boxShadow: "0 4px 20px rgba(13,27,62,0.2)", textAlign: "left", fontWeight: 400 }}>
          {STAT_TOOLTIPS[label]}
          <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, background: ACCENT_NAVY, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        </div>
      )}
    </div>
  );
}

// ─── Pill slicers ─────────────────────────────────────────────────────────────
function Slicers({ options, active, onChange, accentColor = B_BLUE, notifications }: { options: { id: string; label: string }[]; active: string; onChange: (id: string) => void; accentColor?: string; notifications?: Record<string, boolean> }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{ position: "relative", display: "inline-flex", padding: "6px 16px", borderRadius: 100, border: `1.5px solid ${active === o.id ? accentColor : "#dddde8"}`, background: active === o.id ? accentColor : "transparent", color: active === o.id ? "#fff" : "#666", fontSize: 13, fontWeight: active === o.id ? 600 : 400, cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
          {o.label}
          {notifications?.[o.id] && <span style={notifDot} />}
        </button>
      ))}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string, string]> = {
    "Matched":                         ["#F0FDF4", "#16A34A", "Selected"],
    "Selected":                        ["#F0FDF4", "#16A34A", "Selected"],
    "Completed":                       [P_BLUE,    B_BLUE,    "Completed"],
    "Project requirement fulfilled":   ["#EFF6FF", "#2563EB", "Requirement fulfilled"],
    "Fulfilled":                       ["#EFF6FF", "#2563EB", "Requirement fulfilled"],
    "Dropped":                         [P_RED,     B_RED,     "Dropped Out"],
    "Dropped Out":                     [P_RED,     B_RED,     "Dropped Out"],
    "DROP OUT":                        [P_RED,     B_RED,     "Dropped Out"],
    "Not Selected":                    ["#FFF7ED", "#C2410C", "Not Selected"],
    "Rejected":                        [P_RED,     B_RED,     "Rejected"],
    "Volunteer Selected by Other NGO": ["#FFF7ED", "#92400E", "Other NGO"],
    "Selected by Other NGO":           ["#FFF7ED", "#92400E", "Other NGO"],
    "Applied":                         [P_TEAL,    B_TEAL,    "Applied"],
    "Pending":                         [P_TEAL,    B_TEAL,    "Pending"],
    "Under Review":                    ["#F5F3FF", "#6D28D9",  "Under Review"],
  };
  const [bg, color, label] = map[status] ?? ["#f0f0f0", "#555", status];
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>{label}</span>;
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 5 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 21, fontWeight: 900, color: ACCENT_NAVY, margin: 0, letterSpacing: -0.3 }}>{title}</h2>
    </div>
  );
}


// ─── Feedback card (collapsible) ─────────────────────────────────────────────
type FeedbackEntry = typeof HISTORY_FEEDBACK[0];
function FeedbackCard({ f, supportLabels, attrLabels }: { f: FeedbackEntry; supportLabels: string[]; attrLabels: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, overflow: "hidden" }}>
      {/* Collapsed header — always visible */}
      <div onClick={() => setOpen(x => !x)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", cursor: "pointer", userSelect: "none" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: P_BLUE, border: `1px solid ${B_BLUE}22`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: B_BLUE }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>{f.title}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ background: P_BLUE, color: B_BLUE, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{f.ngo}</span>
            <span style={{ background: P_BLUE, color: B_BLUE, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{f.edition}</span>
            <span style={{ background: "#F7FEE7", color: "#65A30D", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 100 }}>Submitted</span>
          </div>
        </div>
        <span style={{ fontSize: 18, color: "#dddde8", transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>›</span>
      </div>
      {/* Expanded detail */}
      {open && (
        <div style={{ padding: "0 18px 18px" }}>
          <div style={{ borderTop: "1px solid #e8e8f0", paddingTop: 14 }}>
            {/* Quick stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { label: "Completion", value: f.completed ? "Yes" : "No" },
                { label: "Duration",   value: `${f.months} month${f.months > 1 ? "s" : ""}` },
                { label: "Hrs / week", value: `${f.hoursWeek} hr${f.hoursWeek > 1 ? "s" : ""}` },
              ].map(stat => (
                <div key={stat.label} style={{ background: "#f5f5fa", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#aaaabc", marginBottom: 3 }}>{stat.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY }}>{stat.value}</div>
                </div>
              ))}
            </div>
            {/* Support ratings */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#aaaabc", marginBottom: 8 }}>ProEngage Support (out of 5)</div>
              {supportLabels.map((lbl, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 12, color: "#6b6b7a", flex: 1, lineHeight: 1.3 }}>{lbl}</div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(s => <div key={s} style={{ width: 12, height: 12, borderRadius: "50%", background: s <= f.supportRatings[i] ? B_BLUE : "#e0e0e8" }} />)}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: B_BLUE, width: 16, textAlign: "right" }}>{f.supportRatings[i]}</div>
                </div>
              ))}
            </div>
            {/* Attribute ratings */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#aaaabc", marginBottom: 8 }}>Attributes Improved (out of 5)</div>
              {attrLabels.map((lbl, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 12, color: "#6b6b7a", flex: 1, lineHeight: 1.3 }}>{lbl}</div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(s => <div key={s} style={{ width: 12, height: 12, borderRadius: "50%", background: s <= f.attrRatings[i] ? KPI_PROENGAGE : "#e0e0e8" }} />)}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: KPI_PROENGAGE, width: 16, textAlign: "right" }}>{f.attrRatings[i]}</div>
                </div>
              ))}
            </div>
            {/* NPS */}
            <div style={{ background: P_BLUE, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: B_BLUE, fontWeight: 600 }}>Likelihood to recommend</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: B_BLUE }}>{f.nps} / 10</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Resource card ────────────────────────────────────────────────────────────
function ResourceCard({ r, onClick }: { r: typeof RESOURCES[0]; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, overflow: "hidden", cursor: "pointer", transform: hov ? "translateY(-3px)" : "translateY(0)", boxShadow: hov ? `0 8px 24px ${r.accentColor}18` : "none", transition: "transform 0.18s, box-shadow 0.18s" }}
    >
      <div style={{ height: 150, background: `url(${r.photo}) center/cover no-repeat` }} />
      <div style={{ background: r.accentColor, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 14.5, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.3 }}>{r.label}</div>
      </div>
    </div>
  );
}

// ─── DrawerShell — centred modal ──────────────────────────────────────────────
type AppRecord = typeof HISTORY_APPLICATIONS[0];

function DrawerShell({ open, onClose, title, subtitle, accentTag, accentColor, children }: { open: boolean; onClose: () => void; title: string; subtitle?: string; accentTag?: string; accentColor?: string; children: React.ReactNode; }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(13,27,62,0.45)", zIndex: 200, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.22s", backdropFilter: "blur(2px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: open ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -48%) scale(0.97)", transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", width: 560, maxWidth: "calc(100vw - 40px)", maxHeight: "calc(100vh - 80px)", background: "#fff", borderRadius: 16, zIndex: 201, boxShadow: "0 24px 64px rgba(13,27,62,0.22)", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", overflowY: "auto" }}>
        <div style={{ background: accentColor || "linear-gradient(135deg, #065666 0%, #0B7285 100%)", padding: "24px 28px", borderRadius: "16px 16px 0 0", flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 7, color: "rgba(255,255,255,0.95)", fontSize: 13, fontWeight: 500, padding: "5px 12px", cursor: "pointer", marginBottom: 16 }}>← Close</button>
          {accentTag && <div style={{ display: "inline-block", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 100, padding: "3px 10px", fontSize: 10.5, fontWeight: 700, color: "#fff", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 10 }}>{accentTag}</div>}
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", marginTop: 5 }}>{subtitle}</div>}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      </div>
    </>
  );
}

// ─── Application detail drawer ────────────────────────────────────────────────
function ApplicationDrawer({ app, onClose }: { app: AppRecord | null; onClose: () => void }) {
  return (
    <DrawerShell open={!!app} onClose={onClose} title={app?.project ?? ""} subtitle={app ? `${app.ngo} · ${app.skillArea}` : ""} accentTag={app ? `${app.type} · ${app.edition}` : ""}>
      {app && (
        <>
          <div style={{ padding: "24px 28px 0" }}>
            <StatusBadge status={app.status} />
          </div>
          <div style={{ padding: "20px 28px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 20 }}>Application Timeline</div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 11, top: 0, bottom: 0, width: 2, background: "#e8e8f0" }} />
              {app.timeline.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 18, marginBottom: 24, position: "relative" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: step.done ? B_BLUE : "#fff", border: `2.5px solid ${step.done ? B_BLUE : "#dddde8"}`, flexShrink: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {step.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <div style={{ paddingTop: 2 }}>
                    <div style={{ fontSize: 13.5, fontWeight: step.done ? 600 : 400, color: step.done ? ACCENT_NAVY : "#aaaabc" }}>{step.label}</div>
                    <div style={{ fontSize: 12, color: "#aaaabc", marginTop: 2 }}>{step.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "0 28px 32px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 12 }}>Details</div>
            <div style={{ background: "#f8f8fc", borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[["NGO", app.ngo], ["Programme", `${app.type} · ${app.edition}`], ["Skill Area", app.skillArea], ["Date Applied", app.date], ["Status", app.status]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontSize: 12.5, color: "#8888a0" }}>{k}</span>
                  <span style={{ fontSize: 12.5, color: ACCENT_NAVY, fontWeight: 600, textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </DrawerShell>
  );
}

// ─── Project update drawer ────────────────────────────────────────────────────
function ProjectUpdateDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reset = () => { onClose(); setSubmitted(false); setText(""); };
  return (
    <DrawerShell open={open} onClose={reset} title="Post Your Monthly Update" subtitle={`${VOLUNTEER.activeApplication?.ngo} · ${VOLUNTEER.activeApplication?.edition}`} accentTag="Monthly Update" accentColor={KPI_PROENGAGE}>
      {submitted ? (
        <div style={{ padding: "40px 28px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F7FEE7", border: "2px solid #84CC16", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Update posted</div>
          <div style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>Your update has been shared with TSG and your NGO partner at {VOLUNTEER.activeApplication?.ngo}.</div>
        </div>
      ) : (
        <div style={{ padding: "24px 28px" }}>
          <p style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6, marginBottom: 22 }}>Share a brief progress note with TSG and your NGO partner. This helps track the health of your project.</p>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Update</label>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What progress have you made this week? Any blockers or next steps?" rows={6} style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "12px 14px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Attachment (optional)</label>
            <div style={{ border: "1.5px dashed #dddde8", borderRadius: 10, padding: "16px", textAlign: "center", fontSize: 13, color: "#aaaabc", cursor: "pointer" }}>Drop a file here or click to browse</div>
          </div>
          <button disabled={!text.trim()} onClick={() => setSubmitted(true)} style={{ width: "100%", background: text.trim() ? B_BLUE : "#e0e0e8", color: text.trim() ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: text.trim() ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}>Post Update</button>
        </div>
      )}
    </DrawerShell>
  );
}

// ─── Feedback drawer — matching live site structure ───────────────────────────
function FeedbackDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [completed, setCompleted] = useState<"" | "yes" | "no">("");
  const [months, setMonths] = useState("");
  const [hoursWeek, setHoursWeek] = useState("");
  const [supportRatings, setSupportRatings] = useState([0, 0, 0]);
  const [attrRatings, setAttrRatings] = useState([0, 0, 0, 0, 0]);
  const [address, setAddress] = useState("");
  const [nps, setNps] = useState(0);
  const [npsHov, setNpsHov] = useState(0);
  const [suggestions, setSuggestions] = useState("");
  const [dropoutReason, setDropoutReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const reset = () => { onClose(); setSubmitted(false); setCompleted(""); setMonths(""); setHoursWeek(""); setSupportRatings([0,0,0]); setAttrRatings([0,0,0,0,0]); setAddress(""); setNps(0); setSuggestions(""); setDropoutReason(""); };

  const canSubmit = completed === "yes"
    ? months && hoursWeek && supportRatings.every(r => r > 0) && attrRatings.every(r => r > 0) && nps > 0
    : completed === "no" && dropoutReason !== "";

  const label: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 };
  const inp: React.CSSProperties = { width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "10px 14px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", boxSizing: "border-box" };
  const sel: React.CSSProperties = { ...inp, appearance: "none", cursor: "pointer" };

  function StarRow({ count = 5, value, hover, onHov, onSet }: { count?: number; value: number; hover: number; onHov: (v: number) => void; onSet: (v: number) => void }) {
    return (
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: count }, (_, i) => i + 1).map(i => (
          <span key={i} onMouseEnter={() => onHov(i)} onMouseLeave={() => onHov(0)} onClick={() => onSet(i)}
            style={{ fontSize: count === 10 ? 22 : 26, cursor: "pointer", color: i <= (hover || value) ? "#0B7285" : "#e0e0e8", transition: "color 0.1s", lineHeight: 1 }}>★</span>
        ))}
      </div>
    );
  }

  const [supportHov, setSupportHov] = useState([0, 0, 0]);
  const [attrHov, setAttrHov] = useState([0, 0, 0, 0, 0]);

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

  return (
    <DrawerShell open={open} onClose={reset} title="ProEngage Volunteer Feedback" subtitle={`${VOLUNTEER.activeApplication?.ngo} · ${VOLUNTEER.activeApplication?.edition}`} accentTag="Project Feedback" accentColor={KPI_CVP}>
      {submitted ? (
        <div style={{ padding: "40px 28px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F7FEE7", border: "2px solid #84CC16", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Feedback submitted</div>
          <div style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>Thank you. Once the NGO also submits feedback, your certificate will be generated within 24 hours.</div>
        </div>
      ) : (
        <div style={{ padding: "24px 28px" }}>
          {/* Instructions */}
          <div style={{ background: P_BLUE, border: `1px solid ${B_BLUE}22`, borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: B_BLUE, lineHeight: 1.6 }}>
            We request you to fill in this feedback form to help us understand about your ProEngage volunteering journey and experience. All fields marked * are mandatory.
          </div>

          {/* Q1 — Overall Experience */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>Overall Experience</div>
            <label style={{ ...label, marginBottom: 12 }}>1. Were you able to successfully complete the project? *</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["yes", "Yes"], ["no", "No"]].map(([val, lbl]) => (
                <label key={val} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13.5, color: completed === val ? B_BLUE : ACCENT_NAVY, fontWeight: completed === val ? 600 : 400 }}>
                  <div onClick={() => setCompleted(val as "yes" | "no")} style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${completed === val ? B_BLUE : "#dddde8"}`, background: completed === val ? B_BLUE : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}>
                    {completed === val && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  {lbl}
                </label>
              ))}
            </div>
          </div>

          {/* YES path */}
          {completed === "yes" && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 16, paddingTop: 4, borderTop: "1px solid #e8e8f0" }}>ProEngage Experience</div>
              <p style={{ fontSize: 12.5, color: "#8888a0", marginBottom: 20 }}>(We would like to know more about your journey.)</p>

              {/* Q2 */}
              <div style={{ marginBottom: 18 }}>
                <label style={label}>2. How many months, in total, have you dedicated to completing this project? *</label>
                <select value={months} onChange={e => setMonths(e.target.value)} style={sel}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              {/* Q3 */}
              <div style={{ marginBottom: 18 }}>
                <label style={label}>3. How many hours per week have you dedicated to completing this project? *</label>
                <select value={hoursWeek} onChange={e => setHoursWeek(e.target.value)} style={sel}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              {/* Q4 */}
              <div style={{ marginBottom: 20 }}>
                <label style={label}>4. How would you rate the support received from the ProEngage team? *</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {supportItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 12.5, color: "#555", lineHeight: 1.4, flex: 1 }}>{String.fromCharCode(65 + i)}. {item}</span>
                      <StarRow value={supportRatings[i]} hover={supportHov[i]} onHov={v => { const a = [...supportHov]; a[i] = v; setSupportHov(a); }} onSet={v => { const a = [...supportRatings]; a[i] = v; setSupportRatings(a); }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Q5 */}
              <div style={{ marginBottom: 20 }}>
                <label style={label}>5. Which of the following attributes did ProEngage help you improve? *</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {attrItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <span style={{ fontSize: 12.5, color: "#555", lineHeight: 1.4, flex: 1 }}>{String.fromCharCode(65 + i)}. {item}</span>
                      <StarRow value={attrRatings[i]} hover={attrHov[i]} onHov={v => { const a = [...attrHov]; a[i] = v; setAttrHov(a); }} onSet={v => { const a = [...attrRatings]; a[i] = v; setAttrRatings(a); }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Q6 */}
              <div style={{ marginBottom: 18 }}>
                <label style={label}>6. Please provide your current residential or office address *</label>
                <div style={{ background: "#EBF4FF", border: "1px solid #1E6BB822", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#1E3A5F", lineHeight: 1.5, marginBottom: 10 }}>
                  Tata Engage Team will send the token to this address. If you live abroad, please provide your India address or Indian office address.
                </div>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Flat / Floor, House No., Building, Company, Apartment" style={{ ...inp, marginBottom: 8 }} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
                <div style={{ fontSize: 11.5, color: "#8888a0", marginBottom: 4 }}>* Please update your mobile no. through 'Edit Profile' for any project related queries, write to tataengage@tata.com</div>
              </div>

              {/* Q7 — NPS */}
              <div style={{ marginBottom: 18 }}>
                <label style={label}>7. How likely are you to recommend us to a friend or colleague? *</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11.5, color: "#8888a0", whiteSpace: "nowrap" }}>Unlikely</span>
                  <StarRow count={10} value={nps} hover={npsHov} onHov={setNpsHov} onSet={setNps} />
                  <span style={{ fontSize: 11.5, color: "#8888a0", whiteSpace: "nowrap" }}>Likely</span>
                </div>
              </div>

              {/* Q8 */}
              <div style={{ marginBottom: 22 }}>
                <label style={label}>8. Do you have any suggestions for the Tata Engage Team regarding the way ProEngage is conducted?</label>
                <textarea value={suggestions} onChange={e => setSuggestions(e.target.value)} rows={3} placeholder="Suggestions if any" style={{ ...inp, resize: "none" }} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
              </div>
            </>
          )}

          {/* NO path */}
          {completed === "no" && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: B_RED, marginBottom: 12, paddingTop: 4, borderTop: "1px solid #e8e8f0" }}>No Completion</div>
              <p style={{ fontSize: 12.5, color: "#8888a0", marginBottom: 16 }}>(Let us know why you were unable to complete this project.)</p>
              <div style={{ marginBottom: 22 }}>
                <label style={label}>2. Reason of no completion *</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {dropoutReasons.map((r, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, color: dropoutReason === r ? B_BLUE : ACCENT_NAVY, fontWeight: dropoutReason === r ? 600 : 400, lineHeight: 1.5 }}>
                      <div onClick={() => setDropoutReason(r)} style={{ width: 18, height: 18, minWidth: 18, borderRadius: "50%", border: `2px solid ${dropoutReason === r ? B_BLUE : "#dddde8"}`, background: dropoutReason === r ? B_BLUE : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer", marginTop: 2 }}>
                        {dropoutReason === r && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                      {r}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <button disabled={!canSubmit} onClick={() => setSubmitted(true)} style={{ width: "100%", background: canSubmit ? B_BLUE : "#e0e0e8", color: canSubmit ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", marginTop: 8, transition: "background 0.2s" }}>Submit Feedback</button>
        </div>
      )}
    </DrawerShell>
  );
}

// ─── Grievance drawer ─────────────────────────────────────────────────────────
function GrievanceDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [category, setCategory] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reset = () => { onClose(); setSubmitted(false); setCategory(""); setText(""); };
  const categories = ["Communication issues with NGO", "Project scope changed unexpectedly", "Scheduling conflict", "Platform issue", "Other"];
  const canSubmit = category && text.trim().length > 10;
  return (
    <DrawerShell open={open} onClose={reset} title="Raise a Grievance" subtitle="Your concern will be reviewed by the TSG Admin team" accentTag="Grievance" accentColor={B_RED}>
      {submitted ? (
        <div style={{ padding: "40px 28px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: P_YELLOW, border: `2px solid ${B_YELLOW}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke={B_YELLOW} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Grievance submitted</div>
          <div style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>You'll receive an acknowledgement email shortly. The TSG Admin team will review and respond within 3 working days.</div>
        </div>
      ) : (
        <div style={{ padding: "24px 28px" }}>
          <p style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6, marginBottom: 24 }}>Grievances are reviewed in confidence by the TSG Admin team. You can raise only one open grievance per project at a time.</p>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 10 }}>Category *</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {categories.map(c => (
                <label key={c} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13.5, color: category === c ? B_BLUE : ACCENT_NAVY, fontWeight: category === c ? 600 : 400 }}>
                  <div onClick={() => setCategory(c)} style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${category === c ? B_BLUE : "#dddde8"}`, background: category === c ? B_BLUE : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}>
                    {category === c && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  {c}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Describe the issue *</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={5} placeholder="Provide as much detail as possible so the team can investigate effectively." style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "12px 14px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Supporting file (optional)</label>
            <div style={{ border: "1.5px dashed #dddde8", borderRadius: 10, padding: "14px", textAlign: "center", fontSize: 13, color: "#aaaabc", cursor: "pointer" }}>Drop a file here or click to browse</div>
          </div>
          <button disabled={!canSubmit} onClick={() => setSubmitted(true)} style={{ width: "100%", background: canSubmit ? B_BLUE : "#e0e0e8", color: canSubmit ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}>Submit Grievance</button>
        </div>
      )}
    </DrawerShell>
  );
}

// ─── Apply for Project drawer — matching live site form ───────────────────────
type PEProject = typeof PE_OPPORTUNITIES[0];

function ApplyDrawer({ project, onClose }: { project: PEProject | null; onClose: () => void }) {
  const [designation, setDesignation] = useState("Others");
  const [designationDetail, setDesignationDetail] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [attributes, setAttributes] = useState("");
  const [eduQual, setEduQual] = useState("MBA");
  const [workExp, setWorkExp] = useState("12");
  const [similarTask, setSimilarTask] = useState<"" | "yes" | "no">("");
  const [whyBestFit, setWhyBestFit] = useState("");
  const [threeSteps, setThreeSteps] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reset = () => { onClose(); setSubmitted(false); setAgreed(false); setWhyBestFit(""); setThreeSteps(""); setSimilarTask(""); setSkills([]); setAttributes(""); };

  const SKILL_OPTIONS = ["Accounting and Finance", "Administration", "Coaching and Training", "Content Writing / Documentation", "Fundraising", "IT Enabled Services", "Legal", "Management and Strategy", "Marketing and Communications", "Operations and Logistics", "Research", "Translation"];

  const canSubmit = whyBestFit.trim() && threeSteps.trim() && similarTask && agreed;

  const label: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 };
  const inp: React.CSSProperties = { width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "10px 14px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", boxSizing: "border-box" };
  const sel: React.CSSProperties = { ...inp, appearance: "none", cursor: "pointer", background: "#fff" };

  const undertakingPoints = [
    "I am voluntarily applying for a project of my choice under ProEngage",
    "I understand that these projects, and my contribution through them, are of great value to society",
    "I know that the Tata group has a reputation of doing good and this is an opportunity for me to do good with something I am good at",
    "I am able and willing to commit time over the next several months and complete the project to the best of my ability",
    "I intend to visit the NGO at least once a month (only for on-site projects)",
    "To the best of my knowledge, I am not going to get transferred, change my job or do not have any planned significant events (like long personal leave / holiday etc.) over the project duration",
    "I understand that following these best practices will help me remain true to the Tata values while undertaking the project — acting responsibly towards the communities, being responsible for my own safety, strictly observing the Tata Code of Conduct",
  ];

  const open = !!project;

  return (
    <DrawerShell open={open} onClose={reset} title={project?.title ?? ""} subtitle={project ? `${project.ngo} · ${project.skillArea}` : ""} accentTag="ProEngage Application">
      {project && (
        submitted ? (
          <div style={{ padding: "40px 28px", textAlign: "center" }}>
            {/* Confirmation matching live site modal */}
            <div style={{ background: "#FEFCE8", border: "1px solid #FDE68A", borderRadius: 12, padding: "20px", marginBottom: 20, textAlign: "left" }}>
              <div style={{ fontSize: 13, color: "#064e3b", lineHeight: 1.7 }}>
                <p style={{ marginBottom: 6 }}>Project will start from <strong>{project.closes.replace("15 ", "15-")}</strong></p>
                <p style={{ marginBottom: 6 }}>You will be required to put in <strong>{project.duration.split(" ")[0]} hours</strong> every weekend, for a duration of <strong>{project.duration}</strong></p>
                <p>This being an <strong>{project.mode.includes("Hybrid") ? "HYBRID" : "ONLINE"}</strong> project, you will be required to work on the project remotely and deliver it to the partner organisation: <strong>{project.ngo}</strong></p>
              </div>
            </div>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F7FEE7", border: "2px solid #84CC16", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Application submitted!</div>
            <div style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>Your application has been sent to {project.ngo}. You'll receive an email confirmation shortly.</div>
          </div>
        ) : (
          <div style={{ padding: "24px 28px" }}>
            {/* Project meta summary */}
            <div style={{ background: P_BLUE, border: `1px solid ${B_BLUE}22`, borderRadius: 10, padding: "12px 16px", marginBottom: 24 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
                {[["Mode", project.mode], ["Duration", project.duration], ["Closes", project.closes], ["Applicants", `${project.applicants} applied`]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px" }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-filled candidate requirements */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 12 }}>Candidate Requirements (from your profile)</div>
              <div style={{ background: "#f8f8fc", borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {[["Skill Category", project.skillArea], ["Work Experience", "12 years"], ["Languages", "English, Hindi, Marathi"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span style={{ fontSize: 12.5, color: "#8888a0" }}>{k}</span>
                    <span style={{ fontSize: 12.5, color: ACCENT_NAVY, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: B_BLUE, marginTop: 8 }}>* Please update your location and mobile no. through 'Edit Profile'. For any project related queries, write to <span style={{ textDecoration: "underline" }}>tataengage@tata.com</span></div>
            </div>

            {/* Section: Application Details */}
            <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 16, paddingTop: 4, borderTop: "1px solid #e8e8f0" }}>Application Details <span style={{ fontSize: 11, color: B_RED, fontWeight: 400 }}>* all fields are mandatory</span></div>

            {/* Current Designation */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Current Designation and Role *</label>
              <select value={designation} onChange={e => setDesignation(e.target.value)} style={{ ...sel, marginBottom: 8 }}>
                {["Senior Product Manager", "Product Manager", "Software Engineer", "Business Analyst", "Finance Manager", "HR Manager", "Others"].map(d => <option key={d}>{d}</option>)}
              </select>
              <input type="text" value={designationDetail} onChange={e => setDesignationDetail(e.target.value)} placeholder="Specify if 'Others'" style={inp} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
            </div>

            {/* Project-specific skills */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Project-specific skills / experience possessed *</label>
              <div style={{ border: "1.5px solid #e0e0e8", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderBottom: "1px solid #e8e8f0" }}>
                  {skills.map(s => (
                    <span key={s} style={{ background: P_BLUE, color: B_BLUE, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 100, display: "flex", alignItems: "center", gap: 5 }}>
                      {s} <span onClick={() => setSkills(skills.filter(x => x !== s))} style={{ cursor: "pointer", opacity: 0.6 }}>×</span>
                    </span>
                  ))}
                  {skills.length === 0 && <span style={{ fontSize: 13, color: "#aaaabc" }}>Select skills...</span>}
                </div>
                <div style={{ maxHeight: 140, overflowY: "auto" }}>
                  {SKILL_OPTIONS.filter(o => !skills.includes(o)).map(o => (
                    <div key={o} onClick={() => setSkills([...skills, o])} style={{ padding: "8px 14px", fontSize: 13, color: ACCENT_NAVY, cursor: "pointer", transition: "background 0.1s" }} onMouseEnter={e => (e.currentTarget.style.background = P_BLUE)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>{o}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Attributes relevant to project</label>
              <textarea value={attributes} onChange={e => setAttributes(e.target.value)} rows={2} placeholder="Describe relevant attributes" style={{ ...inp, resize: "none" }} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
            </div>

            {/* Education */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Educational Qualifications *</label>
              <select value={eduQual} onChange={e => setEduQual(e.target.value)} style={{ ...sel, marginBottom: 8 }}>
                {["MBA", "B.Tech / B.E.", "CA", "LLB", "MBBS", "M.Tech", "BA / B.Com / B.Sc", "Others"].map(q => <option key={q}>{q}</option>)}
              </select>
              <input type="text" placeholder="Specify institution or additional detail" style={inp} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
            </div>

            {/* Work experience */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Total Years of Work Experience *</label>
              <input type="number" value={workExp} onChange={e => setWorkExp(e.target.value)} min="0" max="50" style={inp} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
            </div>

            {/* Similar task */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Have you done a similar task before? *</label>
              <div style={{ display: "flex", gap: 24 }}>
                {[["yes", "Yes"], ["no", "No"]].map(([val, lbl]) => (
                  <label key={val} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5, color: similarTask === val ? B_BLUE : ACCENT_NAVY, fontWeight: similarTask === val ? 600 : 400 }}>
                    <div onClick={() => setSimilarTask(val as "yes" | "no")} style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${similarTask === val ? B_BLUE : "#dddde8"}`, background: similarTask === val ? B_BLUE : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}>
                      {similarTask === val && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                    {lbl}
                  </label>
                ))}
              </div>
            </div>

            {/* Why best fit */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Why are you the best fit for this project? *</label>
              <textarea value={whyBestFit} onChange={e => setWhyBestFit(e.target.value)} rows={4} placeholder="Describe your motivation and relevant experience" style={{ ...inp, resize: "none" }} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
            </div>

            {/* 3 steps */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Describe in 3 steps how you will ensure you complete this project *</label>
              <textarea value={threeSteps} onChange={e => setThreeSteps(e.target.value)} rows={4} placeholder="Step 1: ... Step 2: ... Step 3: ..." style={{ ...inp, resize: "none" }} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
            </div>

            {/* Manager Details */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Manager Details <span style={{ fontWeight: 400, color: "#8888a0", fontSize: 12 }}>(Optional)</span></div>
              <p style={{ fontSize: 12.5, color: "#8888a0", lineHeight: 1.55, marginBottom: 12 }}>If you are selected for this project would you like us to inform your manager? If yes, please share your immediate supervisor/managers details:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={{ ...label, marginBottom: 6 }}>Full Name</label>
                  <input type="text" value={managerName} onChange={e => setManagerName(e.target.value)} placeholder="Manager's full name" style={inp} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
                </div>
                <div>
                  <label style={{ ...label, marginBottom: 6 }}>Official Email ID</label>
                  <input type="email" value={managerEmail} onChange={e => setManagerEmail(e.target.value)} placeholder="manager@tata.com" style={inp} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
                </div>
              </div>
            </div>

            {/* Volunteer Undertaking */}
            <div style={{ marginBottom: 22, background: "#f8f8fc", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>Volunteer Undertaking</div>
              <div style={{ fontSize: 11.5, color: "#8888a0", marginBottom: 12 }}>(Please read before applying.)</div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                {undertakingPoints.map((pt, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 12.5, color: "#555", lineHeight: 1.5 }}>
                    <span style={{ color: B_BLUE, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>•</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 16, cursor: "pointer" }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3, accentColor: B_BLUE, width: 15, height: 15, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: B_BLUE, fontWeight: 600, lineHeight: 1.5 }}>I agree to the above mentioned terms of submitting an application under ProEngage</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={reset} style={{ flex: 1, background: "#fff", border: "1.5px solid #dddde8", borderRadius: 10, padding: "12px", fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Save for Later</button>
              <button disabled={!canSubmit} onClick={() => setSubmitted(true)} style={{ flex: 2, background: canSubmit ? B_BLUE : "#e0e0e8", color: canSubmit ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}>Submit Application</button>
            </div>
          </div>
        )
      )}
    </DrawerShell>
  );
}

// ─── Referral drawer ──────────────────────────────────────────────────────────
function ReferralDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const refLink = "https://tataengage.com/join?ref=PS7842";
  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <DrawerShell open={open} onClose={onClose} title="Refer a Colleague or Family Member" subtitle="Share your unique referral link below" accentTag="Referral" accentColor={B_TEAL}>
      <div style={{ padding: "28px 28px" }}>
        <p style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6, marginBottom: 22 }}>When someone joins TataEngage using your referral link, your Referred count goes up and you're one step closer to earning the Connector badge.</p>
        <div style={{ background: P_BLUE, border: `1px solid ${B_BLUE}22`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: B_BLUE, wordBreak: "break-all" }}>{refLink}</span>
          <button onClick={copy} style={{ background: copied ? "#65A30D" : B_BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" }}>{copied ? "Copied!" : "Copy Link"}</button>
        </div>
        <div style={{ fontSize: 12, color: "#aaaabc" }}>Link expires in 30 days. You have referred 3 people so far.</div>
      </div>
    </DrawerShell>
  );
}

// ─── Share story drawer ───────────────────────────────────────────────────────
function ShareDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const captions: Record<string, string> = {
    linkedin: `Proud to be volunteering through @TataEngage on the ${VOLUNTEER.activeApplication?.title ?? "ProEngage"} project with ${VOLUNTEER.activeApplication?.ngo ?? "an incredible NGO"}. Giving back with skills you love is the most rewarding thing. #TataEngage #BeTheChange`,
    twitter: `Volunteering through @TataEngage on ${VOLUNTEER.activeApplication?.title ?? "ProEngage"}. Skills + purpose = impact. #TataEngage`,
    whatsapp: `Hey! I'm volunteering through Tata Engage on "${VOLUNTEER.activeApplication?.title}". It's an amazing platform if you want to give back using your professional skills. Check it out: https://tataengage.com`,
  };
  const [active, setActive] = useState("linkedin");
  return (
    <DrawerShell open={open} onClose={onClose} title="Share Your Story" subtitle="Let your network know about your volunteering journey" accentTag="Social Share" accentColor={B_BLUE}>
      <div style={{ padding: "28px 28px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[["linkedin", "LinkedIn"], ["twitter", "Twitter"], ["whatsapp", "WhatsApp"]].map(([id, lbl]) => (
            <button key={id} onClick={() => setActive(id)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${active === id ? B_BLUE : "#dddde8"}`, background: active === id ? P_BLUE : "#fff", color: active === id ? B_BLUE : "#6b6b7a", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>{lbl}</button>
          ))}
        </div>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Pre-written caption (you can edit)</label>
        <textarea defaultValue={captions[active]} rows={5} style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "12px 14px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box", marginBottom: 16 }} onFocus={e => (e.target.style.borderColor = B_BLUE)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
        <div style={{ fontSize: 12, color: "#aaaabc", marginBottom: 20 }}>The platform never auto-posts on your behalf. You'll be taken to the platform to paste and post.</div>
        <button style={{ width: "100%", background: B_BLUE, color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Open {["linkedin","twitter","whatsapp"].includes(active) ? active.charAt(0).toUpperCase() + active.slice(1) : ""}</button>
      </div>
    </DrawerShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function DashboardView() {
  const navigate = useNavigate();
  const { setShowOrientationModal, triggerToast: ctxToast } = useAppContext();

  // Section tracking
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [activeSection, setActiveSection] = useState("snapshot");
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Section tracker observer
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.2 });
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Count-up trigger
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsStarted(true); }, { threshold: 0.3 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  // Activity state
  const activitySlicers = getActivitySlicers();
  const defaultActivity = activitySlicers[0].id;
  const [activeActivity, setActiveActivity] = useState(defaultActivity);

  // History state
  const [activeHistory, setActiveHistory] = useState("projects");
  const [editionFilter, setEditionFilter] = useState("ProEngage 2025 | 02");
  const [yearFilter, setYearFilter] = useState("");
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [appsExpanded, setAppsExpanded]         = useState(false);
  const [certsExpanded, setCertsExpanded]       = useState(false);
  const [feedbackExpanded, setFeedbackExpanded] = useState(false);

  const PE_ONLY_EDITIONS = [
    "ProEngage 2025 | 02","ProEngage 2025 | 01","ProEngage 2024 | 02","ProEngage 2024 | 01",
    "ProEngage 2023 | 02","ProEngage 2023 | 01","ProEngage 2022 | 02","ProEngage 2022 | 01",
    "ProEngage 2021 | 02","ProEngage 2020 | 01",
  ];

  // Filter helpers — all keyed to same editionFilter
  const filteredApplications = HISTORY_APPLICATIONS.filter(a => {
    if (a.type === "TVW") return false;
    if (editionFilter && a.edition !== editionFilter) return false;
    if (yearFilter && a.year !== yearFilter) return false;
    return true;
  });

  const filteredProjects = HISTORY_PROJECTS.filter(p => {
    if (!["Matched", "Completed"].includes(p.projectStatus)) return false;
    if (editionFilter && p.edition !== editionFilter) return false;
    if (yearFilter && p.year !== yearFilter) return false;
    return true;
  });

  const filteredCerts = filteredProjects.filter(p => p.cert);
  const filteredFeedback = HISTORY_FEEDBACK.filter(f => {
    if (editionFilter && f.edition !== editionFilter) return false;
    if (yearFilter && f.year !== yearFilter) return false;
    return true;
  });

  const COLLAPSE = 3;
  const COLLAPSE_CERTS = 2;

  // Drawer states
  const [drawerApp, setDrawerApp]         = useState<AppRecord | null>(null);
  const [updateOpen, setUpdateOpen]       = useState(false);
  const [feedbackOpen, setFeedbackOpen]   = useState(false);
  const [grievanceOpen, setGrievanceOpen] = useState(false);
  const [applyProject, setApplyProject]   = useState<PEProject | null>(null);
  const [referralOpen, setReferralOpen]   = useState(false);
  const [shareOpen, setShareOpen]         = useState(false);

  return (
    <>
      <div style={{ background: "#f8f9ff", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingBottom: 80 }}>

        {/* Greeting bar */}
        <div style={{ background: "linear-gradient(135deg, #065666 0%, #0B7285 60%, #0891b2 100%)", padding: "92px 40px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>{VOLUNTEER.firstName}, this is your volunteering space.</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 6, fontWeight: 300 }}>Your story, Your impact.</div>
          </div>
          {hasActive ? (
            <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 12, padding: "14px 20px", maxWidth: 360 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 5 }}>Active · {VOLUNTEER.activeApplication!.edition}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{VOLUNTEER.activeApplication!.title}</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{VOLUNTEER.activeApplication!.ngo} · Matched {VOLUNTEER.activeApplication!.matchDate}</div>
            </div>
          ) : IS_PE_SEASON ? (
            <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 12, padding: "14px 20px", maxWidth: 360 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 5 }}>ProEngage Edition 11 · Open now</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>Applications close 15 July. Browse projects matched to your skills below.</div>
            </div>
          ) : (
            <div style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "14px 20px", maxWidth: 360 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 5 }}>Next ProEngage Edition</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>Opens January 2026. Explore TVW events and DIY activities below.</div>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto", padding: "40px 40px 100px", gap: 44 }}>

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ═══ 1. SNAPSHOT ════════════════════════════════════════════ */}
            <div style={{ background: "#f0f1f8", borderRadius: 16, padding: "24px 22px", marginBottom: 52 }}>
            <section id="snapshot" style={{ scrollMarginTop: 108 }}>
              <SectionHeading eyebrow="Your impact, at a glance" title="Engagement Snapshot" />

              {IS_NEW_VOLUNTEER && (
                <div style={{ background: P_BLUE, border: `1px solid ${B_BLUE}22`, borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 13.5, color: B_BLUE, lineHeight: 1.6 }}>
                  You're just getting started. Hover over any number below to see how you can earn it.
                </div>
              )}

              {/* Stat tiles */}
              <div ref={statsRef} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                <StatTile value={VOLUNTEER.stats.hoursVolunteered} label="Hours Volunteered"  pastel={KPI_PROENGAGE} accentColor={KPI_PROENGAGE} delay={0}   started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.projectsApplied}                label="Projects Applied"   pastel={KPI_TVW}      accentColor={KPI_TVW}      delay={100} started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.projectsCompleted}              label="Projects Completed" pastel={KPI_CVP}      accentColor={KPI_CVP}      delay={200} started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.projectsDropped}                label="DROPPED OUT"        pastel={KPI_PINK}     accentColor={KPI_PINK}     delay={300} started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.referrals}                      label="No of Referrals"    pastel={KPI_NUMBERS}  accentColor={KPI_NUMBERS}  delay={400} started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.badgesEarned}                   label="Badges Earned"      pastel={KPI_TEAL}     accentColor={KPI_TEAL}     delay={500} started={statsStarted} />
              </div>

              {/* Skills & Interests */}
              <div style={{ ...card, marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 12 }}>Skills You Bring</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {VOLUNTEER.skills.slice(0, 4).map(s => <span key={s} style={{ background: "#EBF4FF", color: "#1E6BB8", fontSize: 12.5, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>{s}</span>)}
                </div>
              </div>

              {/* Badges */}
              {!IS_NEW_VOLUNTEER && (
                <div style={{ ...card, marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 14 }}>Badges Earned</div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    {BADGES.map(b => (
                      <div key={b.id} title={`${b.name} — ${b.desc}${b.earned ? ` (${b.earned})` : ""}`}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "default", transition: "transform 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        <img src={b.image} alt={b.name} style={{ width: 56, height: 56, objectFit: "contain", display: "block" }} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#6b6b7a", textAlign: "center", lineHeight: 1.2, maxWidth: 64 }}>{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {IS_NEW_VOLUNTEER && (
                <div style={{ ...card, borderStyle: "dashed", marginBottom: 10 }}>
                  <div style={{ fontSize: 13, color: "#aaaabc", textAlign: "center", padding: "8px 0" }}>Badges appear here as you complete projects, participate in TVW, and hit volunteering milestones.</div>
                </div>
              )}

              {/* Testimonial — embedded in Snapshot */}
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 12 }}>Testimonial from the field</div>
                {IS_NEW_VOLUNTEER ? (
                  <div style={{ ...card, borderStyle: "dashed", textAlign: "center", padding: "32px 28px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Your testimonial will appear here</div>
                    <div style={{ fontSize: 13, color: "#8888a0", lineHeight: 1.65, maxWidth: 380, margin: "0 auto" }}>Once you complete a ProEngage project, your NGO partner can write a testimonial about your work.</div>
                  </div>
                ) : (
                  <div style={{ background: P_TEAL_DARK, borderRadius: 14, padding: "28px 32px", position: "relative", overflow: "hidden", border: `1px solid ${B_LIME_DARK}33` }}>
                    <div style={{ position: "absolute", top: -20, left: 20, fontFamily: "Georgia, serif", fontSize: 160, color: `${B_LIME_DARK}0d`, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>"</div>
                    <div style={{ display: "inline-block", background: `${B_LIME_DARK}18`, border: `1px solid ${B_LIME_DARK}44`, borderRadius: 100, padding: "3px 10px", fontSize: 10.5, fontWeight: 700, color: B_LIME_DARK, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 16 }}>{TESTIMONIAL.edition}</div>
                    <blockquote style={{ fontSize: 15, lineHeight: 1.72, color: B_LIME_DARK, fontStyle: "italic", fontWeight: 300, margin: "0 0 22px", position: "relative", zIndex: 1 }}>"{TESTIMONIAL.quote}"</blockquote>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: TESTIMONIAL.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{TESTIMONIAL.avatarInitials}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: ACCENT_NAVY, fontSize: 13.5 }}>{TESTIMONIAL.author}</div>
                        <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 2 }}>{TESTIMONIAL.role}</div>
                      </div>
                      <div style={{ marginLeft: "auto", textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#6b6b7a", lineHeight: 1.4 }}>{TESTIMONIAL.project}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
            </div>

            {/* ═══ 2. ACTIVITIES ══════════════════════════════════════════ */}
            <div style={{ background: "#f0f1f8", borderRadius: 16, padding: "24px 22px", marginBottom: 52 }}>
            <section id="activities" style={{ scrollMarginTop: 108 }}>
              <SectionHeading
                eyebrow={IS_PE_SEASON ? "ProEngage Edition 23 · Open" : "Non-ProEngage season · Next edition opens Jan 2026"}
                title="My Activities"
              />
              <Slicers options={activitySlicers} active={activeActivity} onChange={setActiveActivity} accentColor={B_TEAL} notifications={{ opportunities: NOTIFICATIONS.viewOpportunities, diy: NOTIFICATIONS.diyActivities, proengage: NOTIFICATIONS.proEngageProject, apply: NOTIFICATIONS.proEngageProject, early: NOTIFICATIONS.proEngageProject }} />

              {/* ── View Opportunities tab ─────────────────────────────── */}
              {activeActivity === "opportunities" && (
                <div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {TVW_OPPORTUNITIES.slice(0, 2).map(ev => (
                      <div key={ev.id}
                        style={{ ...card, display: "flex", gap: 16, alignItems: "center", cursor: "pointer", transition: "box-shadow 0.18s, transform 0.18s", padding: "18px 20px" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(13,27,62,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                      >
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: ev.pastel, border: `1px solid ${ev.accentColor}22`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: ev.accentColor }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: ACCENT_NAVY, marginBottom: 8 }}>{ev.title}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {[ev.company, ev.date, ev.mode, ev.duration].map((detail, i) => (
                              <span key={i} style={{ background: ev.pastel, color: ev.accentColor, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100, display: "inline-block" }}>{detail}</span>
                            ))}
                            <span style={{ background: ev.pastel, color: ev.accentColor, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{ev.theme}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                    <button onClick={(e) => { e.stopPropagation(); ctxToast("Your SPOC has been notified — Rohan Desai will reach out within 24 hours."); }} style={{ background: ev.accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Contact SPOC</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate("/tvw")} style={{ marginTop: 14, background: "none", border: "none", fontSize: 13.5, color: "#0B7285", fontWeight: 600, cursor: "pointer", padding: 0 }}>
                    View all opportunities →
                  </button>
                </div>
              )}

              {activeActivity === "diy" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    {DIY_ACTIVITIES.map(a => (
                      <div key={a.id}
                        style={{ ...card, padding: "20px", cursor: "pointer", transition: "transform 0.18s, box-shadow 0.18s", display: "flex", flexDirection: "column", gap: 0 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${a.accentColor}18`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                      >
                        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 10, background: a.pastel, border: `1px solid ${a.accentColor}22`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.accentColor }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 7 }}>
                              <span style={{ background: a.pastel, color: a.accentColor, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 100 }}>{a.theme}</span>
                              <span style={{ background: a.pastel, color: a.accentColor, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{a.org}</span>
                            </div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 6, lineHeight: 1.3 }}>{a.title}</div>
                            <div style={{ fontSize: 12.5, color: "#555", lineHeight: 1.55 }}>{a.desc}</div>
                          </div>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); ctxToast("Please contact your SPOC to sign up for this activity."); }}
                          style={{ width: "100%", background: a.accentColor, color: "#fff", border: "none", borderRadius: 10, padding: "10px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "opacity 0.18s" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                        >
                          Contact SPOC
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── My ProEngage Project tab (PE season, active match) ── */}
              {activeActivity === "proengage" && IS_PE_SEASON && hasActive && (
                <div>
                  {/* Matched project header — Opportunities style: icon left, title top, pills below */}
                  <div style={{ ...card, marginBottom: 16, display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 22px" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: P_TEAL, border: `1px solid ${B_TEAL}22`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: B_TEAL }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      {/* Title first */}
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: ACCENT_NAVY, marginBottom: 10 }}>{VOLUNTEER.activeApplication!.title}</div>
                      {/* Pills row */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        <span style={{ background: P_TEAL, color: B_TEAL, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.4px" }}>Matched</span>
                        <span style={{ background: P_TEAL, color: B_TEAL, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{VOLUNTEER.activeApplication!.edition}</span>
                        <span style={{ background: P_BLUE, color: B_BLUE, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{VOLUNTEER.activeApplication!.mode}</span>
                        <span style={{ background: P_BLUE, color: B_BLUE, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{VOLUNTEER.activeApplication!.duration}</span>
                        <span style={{ background: "#f5f5fa", color: "#8888a0", fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{VOLUNTEER.activeApplication!.ngo} · Matched {VOLUNTEER.activeApplication!.matchDate}</span>
                      </div>
                    </div>
                  </div>
                  {/* 4 action tiles — white bg, coloured dot icon square */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Post Your Monthly Update", tags: ["Progress Report", "NGO Partner & TSG"],       color: KPI_PROENGAGE, pastel: "#E6F4EE", action: () => setUpdateOpen(true),           disabled: false },
                      { label: "Access E-Module",          tags: ["Orientations", "Roles & Responsibilities"],   color: KPI_TVW,       pastel: "#E8F3FB", action: () => setShowOrientationModal(true),  disabled: false },
                      { label: "Submit Feedback",          tags: ["Experience Rating", "Share Learnings"],        color: KPI_CVP,       pastel: P_YELLOW,  action: () => setFeedbackOpen(true),          disabled: false },
                      { label: "Download Certificate",     tags: [] as string[],                                  color: "#bbb",        pastel: "#f8f8fc", action: () => {},                             disabled: true  },
                    ].map(a => (
                      <button key={a.label} disabled={a.disabled} onClick={a.action}
                        style={{ background: "#ffffff", border: `1px solid ${a.color}22`, borderRadius: 14, padding: "18px 18px 16px", textAlign: "left", cursor: a.disabled ? "not-allowed" : "pointer", opacity: a.disabled ? 0.55 : 1, transition: "transform 0.18s, box-shadow 0.18s", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 12px ${a.color}11` }}
                        onMouseEnter={e => { if (!a.disabled) { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${a.color}22`; }}}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 12px ${a.color}11`; }}
                      >
                        <div style={{ width: 40, height: 40, borderRadius: 9, background: a.disabled ? "#f0f0f5" : a.pastel, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.disabled ? "#ccc" : a.color }} />
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: a.disabled ? "#aaa" : ACCENT_NAVY, marginBottom: 8 }}>{a.label}</div>
                        {a.tags.length > 0 ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {a.tags.map(t => (
                              <span key={t} style={{ background: a.color, color: "#ffffff", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100 }}>{t}</span>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize: 11.5, color: "#ccc", fontStyle: "italic" }}>Awaiting feedback submission</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Apply for a Project (PE season, no match) ─────────── */}
              {activeActivity === "apply" && IS_PE_SEASON && !hasActive && (
                <div>
                  <div style={{ background: P_BLUE, border: `1px solid ${B_BLUE}22`, borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: B_BLUE, marginBottom: 4 }}>Applications close 15 July 2025</div>
                    <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>ProEngage Edition 11 is open. The AI has matched these projects to your skills and interests. Apply to up to 3 projects — the first NGO that selects you gets to work with you.</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {PE_OPPORTUNITIES.map(p => (
                      <div key={p.id} style={{ ...card, padding: "20px", border: `1px solid ${p.accentColor}22` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              <span style={{ background: p.pastel, color: p.accentColor, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>{p.match}% match</span>
                              <span style={{ fontSize: 11.5, color: "#aaaabc" }}>{p.skillArea}</span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 14.5, color: ACCENT_NAVY, marginBottom: 3 }}>{p.title}</div>
                            <div style={{ fontSize: 12.5, color: "#8888a0" }}>{p.ngo} · {p.mode} · {p.duration}</div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 11.5, color: "#aaaabc", marginBottom: 8 }}>Closes {p.closes}</div>
                            <div style={{ fontSize: 11.5, color: "#aaaabc", marginBottom: 10 }}>{p.applicants} applicants</div>
                            <button onClick={() => setApplyProject(p)} style={{ background: p.accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Apply</button>
                          </div>
                        </div>
                        <button style={{ background: "none", border: "none", fontSize: 12.5, color: "#8888a0", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Save for later</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate("/proengage")} style={{ marginTop: 14, background: "none", border: "none", fontSize: 13.5, color: B_BLUE, fontWeight: 600, cursor: "pointer", padding: 0 }}>Browse all ProEngage projects →</button>
                </div>
              )}

              {/* ── Apply Early (non-PE season) ─────────────────────────── */}
              {activeActivity === "early" && !IS_PE_SEASON && (
                <div style={{ ...card, textAlign: "center", padding: "36px 32px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>ProEngage applications open in January 2026</div>
                  <div style={{ fontSize: 13.5, color: "#8888a0", lineHeight: 1.65, maxWidth: 380, margin: "0 auto 20px" }}>The next edition isn't open yet, but you can register your interest early and be first to know when projects are listed.</div>
                  <button style={{ background: B_BLUE, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Register Early Interest</button>
                </div>
              )}

              {/* Refer + Share — always below active tab */}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={() => setReferralOpen(true)} style={{ flex: 1, background: P_TEAL, border: `1.5px solid ${B_TEAL}33`, borderRadius: 10, padding: "13px 16px", fontSize: 13.5, fontWeight: 600, color: B_TEAL, cursor: "pointer", transition: "border-color 0.18s, transform 0.18s", fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = B_TEAL; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${B_TEAL}33`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                  Refer a Colleague or Family Member
                </button>
                <button onClick={() => setShareOpen(true)} style={{ flex: 1, background: P_BLUE, border: `1.5px solid ${B_BLUE}22`, borderRadius: 10, padding: "13px 16px", fontSize: 13.5, fontWeight: 600, color: B_BLUE, cursor: "pointer", transition: "border-color 0.18s, transform 0.18s", fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = B_BLUE; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${B_BLUE}22`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                  Share Your Story
                </button>
              </div>
            </section>
            </div>

            {/* ═══ 3. HISTORY ═════════════════════════════════════════════ */}
            <div style={{ background: "#f0f1f8", borderRadius: 16, padding: "24px 22px", marginBottom: 52 }}>
            <section id="history" style={{ scrollMarginTop: 108 }}>
              <SectionHeading eyebrow="Your volunteering trail" title="My History" />

              {IS_NEW_VOLUNTEER ? (
                <div style={{ ...card, borderStyle: "dashed", textAlign: "center", padding: "40px 32px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>No history yet</div>
                  <div style={{ fontSize: 13.5, color: "#8888a0", lineHeight: 1.65, maxWidth: 360, margin: "0 auto" }}>Your applications, completed projects, certificates, and feedback will all appear here as you volunteer.</div>
                </div>
              ) : (
                <>
                  <Slicers options={HISTORY_SLICERS} active={activeHistory} onChange={id => { setActiveHistory(id); setEditionFilter("ProEngage 2025 | 02"); setYearFilter(""); setProjectsExpanded(false); setAppsExpanded(false); setCertsExpanded(false); setFeedbackExpanded(false); }} accentColor={"#1E6BB8"} />

                  {["applications", "projects", "certificates", "feedback"].includes(activeHistory) && (
                    <div style={{ marginBottom: 16 }}>
                      <select value={editionFilter} onChange={e => { setEditionFilter(e.target.value); setProjectsExpanded(false); setAppsExpanded(false); setCertsExpanded(false); setFeedbackExpanded(false); }} style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #dddde8", background: "#fff", fontSize: 13, color: ACCENT_NAVY, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none" }}>
                        <option value="ProEngage 2025 | 02">ProEngage 2025 | 02 (Latest)</option>
                        <option value="">All Editions</option>
                        {PE_ONLY_EDITIONS.filter(e => e !== "ProEngage 2025 | 02").map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Applications */}
                  {activeHistory === "applications" && (() => {
                    const shown = appsExpanded ? filteredApplications : filteredApplications.slice(0, COLLAPSE);
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {shown.map(a => (
                          <div key={a.id} onClick={() => setDrawerApp(a)}
                            style={{ ...card, display: "flex", gap: 14, alignItems: "center", cursor: "pointer", transition: "box-shadow 0.15s, transform 0.15s", padding: "13px 18px" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(13,27,62,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateX(2px)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateX(0)"; }}
                          >
                            <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap", background: P_BLUE, color: B_BLUE }}>{a.edition}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.project}</div>
                              <div style={{ fontSize: 12, color: "#aaaabc", marginTop: 2 }}>{a.ngo} · {a.date}</div>
                            </div>
                            <StatusBadge status={a.status} />
                            <span style={{ fontSize: 18, color: "#dddde8", marginLeft: 4 }}>›</span>
                          </div>
                        ))}
                        {filteredApplications.length === 0 && (
                          <div style={{ ...card, textAlign: "center", padding: "28px", color: "#aaaabc", fontSize: 13.5 }}>No applications for this edition.</div>
                        )}
                        {filteredApplications.length > COLLAPSE && (
                          <button onClick={() => setAppsExpanded(x => !x)} style={{ background: "none", border: "none", fontSize: 13, color: B_BLUE, fontWeight: 600, cursor: "pointer", padding: "6px 0", textAlign: "left" }}>
                            {appsExpanded ? "Show less ↑" : `Show all ${filteredApplications.length} applications ↓`}
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Projects */}
                  {activeHistory === "projects" && (() => {
                    const shown = projectsExpanded ? filteredProjects : filteredProjects.slice(0, COLLAPSE);
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {shown.map(p => {
                          const isActive   = p.projectStatus === "Matched";
                          const isDropped  = p.projectStatus === "Dropped";
                          const accentColor = isActive ? B_TEAL : isDropped ? B_RED : B_BLUE;
                          const pastel      = isActive ? P_TEAL : isDropped ? P_RED : P_BLUE;
                          const statusLabel = isActive ? "Active" : isDropped ? "Dropped" : "Completed";
                          const statusBg    = isActive ? "#E6F8F5" : isDropped ? P_RED : "#F7FEE7";
                          const statusColor = isActive ? B_TEAL_DARK : isDropped ? B_RED : "#65A30D";
                          return (
                            <div key={p.id}
                              style={{ ...card, display: "flex", gap: 16, alignItems: "flex-start", padding: "18px 20px", transition: "box-shadow 0.18s, transform 0.18s" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(13,27,62,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                            >
                              {/* Icon square */}
                              <div style={{ width: 44, height: 44, borderRadius: 10, background: pastel, border: `1px solid ${accentColor}22`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor }} />
                              </div>
                              {/* Content */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Title row */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                  <div style={{ fontWeight: 700, fontSize: 14, color: ACCENT_NAVY, flex: 1 }}>{p.title}</div>
                                  <span style={{ background: statusBg, color: statusColor, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap", flexShrink: 0 }}>{statusLabel}</span>
                                </div>
                                {/* Pills row */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                                  <span style={{ background: pastel, color: accentColor, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{p.ngo}</span>
                                  <span style={{ background: pastel, color: accentColor, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{p.edition}</span>
                                  <span style={{ background: pastel, color: accentColor, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{p.hours} hrs</span>
                                  {p.skills.map(s => (
                                    <span key={s} style={{ background: pastel, color: accentColor, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{s}</span>
                                  ))}
                                </div>
                                {/* Outcome */}
                                <div style={{ background: isActive ? P_TEAL : isDropped ? "#FFF0EE" : "#F7FEE7", borderRadius: 8, padding: "9px 12px", fontSize: 12.5, color: isActive ? B_TEAL_DARK : isDropped ? B_RED : "#365314", borderLeft: `3px solid ${accentColor}`, lineHeight: 1.55 }}>{p.outcome}</div>
                              </div>
                              {/* Certificate button */}
                              {p.cert && (
                                <div style={{ flexShrink: 0 }}>
                                  <button style={{ background: B_BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "6px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Download Certificate</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {filteredProjects.length === 0 && (
                          <div style={{ ...card, textAlign: "center", padding: "28px", color: "#aaaabc", fontSize: 13.5 }}>No selected projects for this edition.</div>
                        )}
                        {filteredProjects.length > COLLAPSE && (
                          <button onClick={() => setProjectsExpanded(x => !x)} style={{ background: "none", border: "none", fontSize: 13, color: B_BLUE, fontWeight: 600, cursor: "pointer", padding: "6px 0", textAlign: "left" }}>
                            {projectsExpanded ? "Show less ↑" : `Show all ${filteredProjects.length} projects ↓`}
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* My Experience (testimonials) */}
                  {activeHistory === "experience" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ background: "#F7FEE7", borderRadius: 14, padding: "28px 32px", position: "relative", overflow: "hidden", border: "1px solid #d9f99d" }}>
                        <div style={{ position: "absolute", top: -20, left: 20, fontFamily: "Georgia, serif", fontSize: 140, color: "rgba(22,101,52,0.06)", lineHeight: 1, pointerEvents: "none" }}>"</div>
                        <div style={{ display: "inline-block", background: "#ecfccb", border: "1px solid #d9f99d", borderRadius: 100, padding: "3px 10px", fontSize: 10.5, fontWeight: 700, color: "#365314", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.5px" }}>ProEngage Edition 11 · Pending approval</div>
                        <blockquote style={{ fontSize: 16, lineHeight: 1.7, color: "#365314", fontStyle: "italic", fontWeight: 300, margin: "0 0 18px", position: "relative", zIndex: 1 }}>"{TESTIMONIAL.quote}"</blockquote>
                        <div style={{ fontSize: 13, color: "#365314", opacity: 0.7 }}>— {TESTIMONIAL.author}, {TESTIMONIAL.role}</div>
                      </div>
                      <div style={{ ...card, fontSize: 13.5, color: "#8888a0", lineHeight: 1.6 }}>Testimonials are written reflections by your NGO partners on your project contribution. They appear here once approved by the TSG Admin team.</div>
                    </div>
                  )}

                  {/* Certificates */}
                  {activeHistory === "certificates" && (() => {
                    const shown = certsExpanded ? filteredCerts : filteredCerts.slice(0, COLLAPSE_CERTS);
                    return (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          {shown.map(p => (
                            <div key={p.id} style={{ background: "#fff", border: `1px solid ${B_TEAL}33`, borderRadius: 14, padding: "22px 20px" }}>
                              <div style={{ fontSize: 10.5, fontWeight: 700, color: B_TEAL, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 6 }}>Certificate of Completion</div>
                              <div style={{ fontSize: 14.5, fontWeight: 700, color: B_BLUE, marginBottom: 3 }}>{p.title}</div>
                              <div style={{ fontSize: 12.5, color: "#8888a0", marginBottom: 14 }}>{p.ngo} · {p.edition}</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                                <span style={{ background: "#fff", color: B_TEAL, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100, border: `1px solid ${B_TEAL}33` }}>{p.edition}</span>
                                <span style={{ background: "#fff", color: B_TEAL, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100, border: `1px solid ${B_TEAL}33` }}>{p.hours} hrs</span>
                              </div>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button style={{ flex: 1, background: B_BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "8px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Download PDF</button>
                                <button style={{ background: B_TEAL, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Share</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {filteredCerts.length === 0 && (
                          <div style={{ ...card, textAlign: "center", padding: "28px", color: "#aaaabc", fontSize: 13.5 }}>No certificates for this edition.</div>
                        )}
                        {filteredCerts.length > COLLAPSE_CERTS && (
                          <button onClick={() => setCertsExpanded(x => !x)} style={{ background: "none", border: "none", fontSize: 13, color: B_BLUE, fontWeight: 600, cursor: "pointer", padding: "10px 0", textAlign: "left" }}>
                            {certsExpanded ? "Show less ↑" : `Show all ${filteredCerts.length} certificates ↓`}
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Feedback */}
                  {activeHistory === "feedback" && (() => {
                    const supportLabels = ["Easily accessible", "Resolved queries", "Liaising with NGO Partners"];
                    const attrLabels    = ["Critical thinking & adaptability", "Communication & networking", "Understanding NGO sector", "Leadership & ambiguity management", "Empathy & innovation"];
                    const shown = feedbackExpanded ? filteredFeedback : filteredFeedback.slice(0, COLLAPSE);
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {shown.map(f => (
                          <FeedbackCard key={f.id} f={f} supportLabels={supportLabels} attrLabels={attrLabels} />
                        ))}
                        {hasActive && (
                          <div style={{ background: P_BLUE, border: `1px solid ${B_BLUE}22`, borderRadius: 12, padding: "16px 18px" }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY, marginBottom: 4 }}>{VOLUNTEER.activeApplication!.title}</div>
                            <div style={{ fontSize: 13, color: B_BLUE, lineHeight: 1.5 }}>Feedback can be submitted once your project is marked complete by the NGO.</div>
                          </div>
                        )}
                        {filteredFeedback.length === 0 && !hasActive && (
                          <div style={{ ...card, textAlign: "center", padding: "28px", color: "#aaaabc", fontSize: 13.5 }}>No feedback for this edition.</div>
                        )}
                        {filteredFeedback.length > COLLAPSE && (
                          <button onClick={() => setFeedbackExpanded(x => !x)} style={{ background: "none", border: "none", fontSize: 13, color: B_BLUE, fontWeight: 600, cursor: "pointer", padding: "6px 0", textAlign: "left" }}>
                            {feedbackExpanded ? "Show less ↑" : `Show all ${filteredFeedback.length} feedback entries ↓`}
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
            </section>
            </div>

            {/* ═══ 4. RESOURCES ═══════════════════════════════════════════ */}
            <div style={{ background: "#f0f1f8", borderRadius: 16, padding: "24px 22px", marginBottom: 52 }}>
            <section id="resources" style={{ scrollMarginTop: 108 }}>
              <SectionHeading eyebrow="Learning and inspiration" title="Resource Library" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {RESOURCES.map(r => <ResourceCard key={r.id} r={r} onClick={() => {
                  if (r.id === "emodule") { setShowOrientationModal(true); }
                  else { navigate("/media"); }
                }} />)}
              </div>
            </section>
            </div>

          </div>

          {/* Right rail */}
          <div style={{ width: 148, flexShrink: 0, position: "sticky", top: 108, alignSelf: "flex-start" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#c0c0cc", marginBottom: 12 }}>On this page</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {SECTIONS.map(s => {
                const on = activeSection === s.id;
                const hasNotif = s.id === "activities" && (NOTIFICATIONS.viewOpportunities || NOTIFICATIONS.diyActivities || NOTIFICATIONS.proEngageProject);
                return (
                  <button key={s.id} onClick={() => scrollTo(s.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none", background: on ? "#EBF4FF" : "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.18s", fontFamily: "'DM Sans', sans-serif" }}>
                    <div style={{ width: 2, height: 12, borderRadius: 2, background: on ? "#0891b2" : "#dddde8", flexShrink: 0, transition: "background 0.18s" }} />
                    <span style={{ position: "relative", display: "inline-flex", fontSize: 12.5, fontWeight: on ? 700 : 400, color: on ? "#0B7285" : "#aaaabc", transition: "color 0.18s" }}>{s.label}{hasNotif && <span style={notifDot} />}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 28 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#c0c0cc", marginBottom: 12 }}>Quick Links</div>
              {[{ label: "Edit Profile", action: () => navigate("/profile") }, { label: "Raise a Grievance", action: () => setGrievanceOpen(true) }].map(a => (
                <button key={a.label} onClick={a.action} style={{ display: "block", width: "100%", background: "none", border: "none", padding: "7px 10px", borderRadius: 8, fontSize: 12.5, color: "#8888a0", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s, color 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f0f0f8"; (e.currentTarget as HTMLElement).style.color = ACCENT_NAVY; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "#8888a0"; }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* All modals */}
      <ApplicationDrawer   app={drawerApp}     onClose={() => setDrawerApp(null)}      />
      <ProjectUpdateDrawer open={updateOpen}   onClose={() => setUpdateOpen(false)}    />
      <FeedbackDrawer      open={feedbackOpen} onClose={() => setFeedbackOpen(false)}  />
      <GrievanceDrawer     open={grievanceOpen} onClose={() => setGrievanceOpen(false)} />
      <ApplyDrawer         project={applyProject} onClose={() => setApplyProject(null)} />
      <ReferralDrawer      open={referralOpen}  onClose={() => setReferralOpen(false)}  />
      <ShareDrawer         open={shareOpen}     onClose={() => setShareOpen(false)}     />
    </>
  );
}
