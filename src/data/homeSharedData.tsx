import { Twitter, Instagram, Linkedin, type LucideIcon } from "lucide-react";
import drPhoto from "@/assets/dr_photo.jpg";

// ── Brand tokens ──────────────────────────────────────────────────────────────
export const B_INDIGO = "#333399";
export const B_YELLOW = "#F5A623";
export const B_RED    = "#E8401C";
export const B_TEAL   = "#00A896";
export const B_BLUE   = "#1E6BB8";
export const B_TICKER = "#3E7EB0";
export const ACCENT_NAVY = "#0D1B3E";

// ── Pastel surface palette ────────────────────────────────────────────────────
export const P_INDIGO = "#EEF0FF";
export const P_YELLOW = "#FEF6E4";
export const P_RED    = "#FFF0EE";
export const P_TEAL   = "#E6F8F5";

// ── Helpers ───────────────────────────────────────────────────────────────────
export const secBg = (i: number) => i % 2 === 0 ? "bg-white" : "bg-[#F0F4FA]";

export const SectionDivider = () => null;

// ── Programme data ────────────────────────────────────────────────────────────
export const FLAGSHIP_PROGRAMMES = [
  {
    id: "TVW", label: "Bi-annual · Global",
    title: "Tata Volunteering Week",
    desc: "A bi-annual celebration of collective action across every Tata company, worldwide.",
    stat1: "12 Editions", stat2: "50K+ Volunteers",
    photo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=900",
    tint: "rgba(51,51,153,0.68)",
    pastelBg: P_INDIGO, accentText: B_INDIGO,
    ctaType: "story" as const,
    bg: B_INDIGO, accent: B_YELLOW,
  },
  {
    id: "ProEngage", label: "Skill-based",
    title: "ProEngage",
    desc: "Match your professional expertise to NGO projects that need it most.",
    stat1: "1,200+ Projects", stat2: "85 NGO Partners",
    photo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=900",
    tint: "rgba(59,30,142,0.68)",
    pastelBg: "#F5F3FF", accentText: "#5b21b6",
    ctaType: "video" as const,
    bg: "#3B1E8E", accent: "#C4B5FD",
  },
  {
    id: "Disaster Response", label: "Rapid Action",
    title: "Disaster Response",
    desc: "Volunteers deployed within 48 hours when communities need urgent support.",
    stat1: "24 Responses", stat2: "8 States",
    photo: drPhoto,
    tint: "rgba(127,29,29,0.68)",
    pastelBg: P_RED, accentText: B_RED,
    ctaType: "story" as const,
    bg: "#7f1d1d", accent: "#FCA5A5",
  },
];

export const COMPANY_PROGRAMMES = [
  { name: "TCS",         desc: "Green Earth — 1,000 trees planted",           dot: B_INDIGO },
  { name: "Titan",       desc: "Skill India workshops for rural women",         dot: B_YELLOW },
  { name: "Tata Steel",  desc: "Community health camps — 20K beneficiaries",   dot: "#475569" },
  { name: "Tata Motors", desc: "Road safety awareness across 12 cities",        dot: B_RED    },
  { name: "Tata Power",  desc: "Solar literacy programme in Jharkhand",         dot: B_TEAL   },
  { name: "Taj Hotels",  desc: "Culinary skills for underprivileged youth",     dot: B_BLUE   },
];

export const JOURNEY_MILESTONES = [
  { year: "2015", title: "Tata Engage Launches", desc: "Platform goes live, uniting Tata Group volunteers for the first time.", colour: B_INDIGO },
  { year: "2018", title: "First Tata VolCon", desc: "Inaugural volunteer conference brings together changemakers across the Group.", colour: B_YELLOW },
  { year: "2019", title: "IAVE Global Award", desc: "Recognised as Best Global Volunteer Program by the International Association for Volunteer Effort.", colour: B_BLUE },
  { year: "2020", title: "1.5 Million Hours", desc: "Volunteers collectively cross 1.5 million hours of impact.", colour: B_RED },
  { year: "2025", title: "10.87 Million Hours", desc: "Highest ever annual volunteering hours clocked across the Tata Group.", colour: B_TICKER },
];

export const FUN_FACTS = [
  "Tata volunteers have collectively logged over 2.5 million hours of service since 2007.",
  "1 in 4 ProEngage projects directly benefits children's education in rural India.",
  "85% of volunteers say their professional skills grew through ProEngage.",
  "Tata companies have planted 1.2 million trees through volunteering drives.",
  "NGOs report 3× faster project delivery when paired with skilled Tata volunteers.",
];

export const HERO_STATS = [
  { num: "50,000+", label: "Active Volunteers", sub: "Across 100+ Tata companies", colour: "#1A4731", pastel: "#1A4731" },
  { num: "85",      label: "NGO Partners",       sub: "Across 15 states in India",  colour: "#003580", pastel: "#003580" },
  { num: "2.5M+",   label: "Volunteer Hours",    sub: "Logged since 2007",           colour: "#C8850A", pastel: "#C8850A" },
];

export interface SocialPost {
  handle: string; platform: string; text: string;
  likes: string; time: string;
  Icon: LucideIcon;
  iconBg: string;
}

export const SOCIAL_POSTS: SocialPost[] = [
  { handle: "@TataEngage",  platform: "Twitter",   text: "Proud to announce 50,000 volunteers on the platform! Thank you for making a difference. #TataEngage", likes: "1.2K", time: "2h ago",  Icon: Twitter,   iconBg: "#0EA5E9" },
  { handle: "@tata_engage", platform: "Instagram", text: "TVW 2026 is almost here! Tag a colleague you'd love to volunteer with. #TVW2026 #TataVolunteers",      likes: "3.4K", time: "1d ago",  Icon: Instagram, iconBg: "#EC4899" },
  { handle: "Tata Engage",  platform: "LinkedIn",  text: "ProEngage Edition 2026 is now open — 400+ skill-based projects waiting for the right volunteers.",      likes: "892",  time: "3d ago",  Icon: Linkedin,  iconBg: "#1D4ED8" },
];

export const TICKER_ITEMS = [
  "🟢  ProEngage 2026 is OPEN — 400+ projects live",
  "📅  TVW 2026 registration opens in 14 days",
  "🏅  1,240 volunteers matched this edition — a record",
  "🌿  TCS: 1,000 trees planted across 8 campuses",
  "🚨  Disaster Response deployed to Assam floods",
  "🎓  Finance Mentorship projects now accepting applications",
  "🤝  85 NGO partners and counting across 15 states",
];

export const EOEO = {
  tag: "Each One Empowers One",
  tagColour: B_INDIGO,
  tagPastel: P_INDIGO,
  headline: "Become a TCS Literacy Champion",
  steps: [
    { num: "01", label: "Identify your beneficiary" },
    { num: "02", label: "Enroll them in the system" },
    { num: "03", label: "Teach at your own pace" },
    { num: "04", label: "Get rewarded + certificate" },
  ],
  cta: "Sign Up Now",
  ctaUrl: "https://tcsempowers.tcsapps.com/apac2/alp/",
};
