import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { SOCIAL_POSTS } from "@/data/homeSharedData";
import SubPageDotRail from "@/components/shared/SubPageDotRail";
import Footer from "@/components/layout/Footer";

const B_INDIGO = "#333399";
const B_YELLOW = "#E8A817";
const B_TEAL = "#0D9488";
const B_BLUE = "#1E6BB8";
const ACCENT_NAVY = "#0D1B3E";

const TABS = ["Photos", "Videos", "Impact Stories", "Social Media", "Events"] as const;

const SECTIONS = [
  { id: "media-hero", label: "Overview" },
  { id: "media-content", label: "Content" },
];

const DIAG_TEXTURE = {
  position: "absolute" as const, inset: 0,
  backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 22px)",
  backgroundSize: "22px 22px",
  pointerEvents: "none" as const,
};

const cardHover = {
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; },
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; },
};

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80", caption: "Blood Donation — TCS" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80", caption: "Tree Plantation — Tata Steel" },
  { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80", caption: "Community Event — Titan" },
  { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80", caption: "Education Session — TCS" },
  { src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&q=80", caption: "Health Camp — Tata Power" },
  { src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&q=80", caption: "Awareness Drive — Voltas" },
  { src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&q=80", caption: "Workshop — Tata Motors" },
  { src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80", caption: "Team Volunteering — IHCL" },
  { src: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=400&q=80", caption: "Clean-up Drive — Tata Chemicals" },
  { src: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&q=80", caption: "Mentoring Session — Tata Elxsi" },
  { src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&q=80", caption: "Art Workshop — Titan" },
  { src: "https://images.unsplash.com/photo-1560252829-804f1aedf1be?w=400&q=80", caption: "Distribution Drive — Tata Consumer" },
];

const VIDEOS = [
  { title: "TVW25 Launch Film", duration: "3:45" },
  { title: "ProEngage Volunteer Stories", duration: "5:12" },
  { title: "VolCon 2024 Highlights", duration: "8:30" },
  { title: "Impact: Education Projects", duration: "4:18" },
  { title: "One Tata Response — DR2024", duration: "6:02" },
  { title: "GCSO Message TVW25", duration: "2:55" },
];

const STORIES = [
  { title: "How a TCS Engineer Helped 200 Students Learn to Code", category: "Education", excerpt: "A six-month ProEngage project transformed digital literacy at a rural school in Maharashtra." },
  { title: "Tree Plantation Drive: 10,000 Trees in 4 Days", category: "Environment", excerpt: "Tata Steel volunteers set a new record during TVW24 across Jamshedpur and Kalinganagar." },
  { title: "Bridging the Skill Gap: Tata Steel's ProEngage Journey", category: "Skills", excerpt: "How skilled volunteers helped an NGO build a full HR and finance operating system." },
  { title: "Blood Donation Camp: 500 Units in One Morning", category: "Health", excerpt: "TCS Hyderabad organised the largest single-site blood donation in TVW history." },
  { title: "Teaching Financial Literacy to Rural Women", category: "Finance", excerpt: "Tata Capital volunteers delivered a 12-week programme reaching 800 women in Gujarat." },
  { title: "From Mumbai to Jamshedpur: One Volunteer's Story", category: "Community", excerpt: "A personal account of cross-company volunteering and the bonds it creates." },
];

const UPCOMING_EVENTS = [
  { title: "VolCon 2026", date: "Sep 2026", location: "Mumbai", status: "Upcoming" },
  { title: "TVW26", date: "Mar 2026", location: "Pan-India", status: "Upcoming" },
  { title: "ProEngage 26 Orientation", date: "Jun 2026", location: "Virtual", status: "Upcoming" },
];

const PAST_EVENTS = [
  { title: "VolCon 2024", date: "Sep 2024", location: "Mumbai" },
  { title: "TVW25", date: "Mar 2025", location: "Pan-India" },
  { title: "TVW24", date: "Sep 2024", location: "Pan-India" },
  { title: "ProEngage 25", date: "Dec 2024", location: "Virtual" },
];

export default function MediaView() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Photos");
  const { triggerToast } = useAppContext();

  return (
    <div style={{ paddingTop: 0, paddingBottom: 0, background: "#fff", minHeight: "100vh" }}>

      {/* 2px accent line */}
      <div style={{ height: 2, background: B_BLUE, width: "100%" }} />

      {/* Dot rail */}
      <SubPageDotRail sections={SECTIONS} accentColor={B_BLUE} />

      {/* 1 — Hero */}
      <div id="media-hero" style={{ background: ACCENT_NAVY, padding: "100px 24px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={DIAG_TEXTURE} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 36, color: "#fff", margin: 0 }}>Media &amp; Resources</h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", marginTop: 10 }}>Stories, photos, videos and moments from across the Tata Engage community</p>
        </div>
      </div>

      {/* 2 — Tabs */}
      <div id="media-content" style={{ display: "flex", justifyContent: "center", gap: 8, padding: "20px 24px", flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              background: activeTab === t ? B_INDIGO : "#f5f5fa",
              color: activeTab === t ? "#fff" : "#6b6b7a",
              border: "none", borderRadius: 100, padding: "8px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "8px 24px 64px" }}>

        {/* 3 — Photos */}
        {activeTab === "Photos" && (
          <div>
            <p style={{ fontSize: 15, color: "#64748B", marginBottom: 20, textAlign: "center" }}>TVW22, VolCon 2024, and ProEngage project documentation</p>
            <div style={{ columns: 4, columnGap: 16 }}>
              {PHOTOS.map((p, i) => (
                <div
                  key={i}
                  onClick={() => triggerToast("Opening full image...")}
                  style={{ breakInside: "avoid", marginBottom: 16, borderRadius: 10, overflow: "hidden", cursor: "pointer", position: "relative", transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <img src={p.src} alt={p.caption} referrerPolicy="no-referrer" style={{ width: "100%", display: "block" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.5)", padding: "8px 12px" }}>
                    <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{p.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4 — Videos */}
        {activeTab === "Videos" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {VIDEOS.map((v, i) => (
              <div
                key={i}
                onClick={() => triggerToast("Opening video player...")}
                style={{ background: ACCENT_NAVY, borderRadius: 12, overflow: "hidden", cursor: "pointer", position: "relative", transition: "transform 0.2s, box-shadow 0.2s" }}
                {...cardHover}
              >
                <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 24, color: "#fff", marginLeft: 4 }}>▶</span>
                  </div>
                </div>
                <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4 }}>{v.duration}</span>
                <div style={{ padding: "12px 16px", background: "#fff" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY }}>{v.title}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5 — Impact Stories */}
        {activeTab === "Impact Stories" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {STORIES.map((s, i) => (
              <div
                key={i}
                onClick={() => triggerToast("Opening story...")}
                style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
                {...cardHover}
              >
                <div style={{ height: 140, background: "#e2e8f0" }} />
                <div style={{ padding: 20 }}>
                  <span style={{ display: "inline-block", background: B_TEAL, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, marginBottom: 10 }}>{s.category}</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8, lineHeight: 1.4 }}>{s.title}</div>
                  <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, marginBottom: 12 }}>{s.excerpt}</p>
                  <span style={{ fontSize: 13, fontWeight: 600, color: B_INDIGO }}>Read more →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 6 — Social Media */}
        {activeTab === "Social Media" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {SOCIAL_POSTS.map((post, i) => {
              const IconComp = post.Icon;
              return (
                <div key={i} style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: 20, transition: "transform 0.2s, box-shadow 0.2s" }} {...cardHover}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: post.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconComp size={16} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY }}>{post.handle}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{post.platform} · {post.time}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, marginBottom: 10 }}>{post.text}</p>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>♡ {post.likes}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* 7 — Events */}
        {activeTab === "Events" && (
          <div>
            <h2 style={{ color: B_INDIGO, fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Upcoming</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 36 }}>
              {UPCOMING_EVENTS.map((e, i) => (
                <div key={i} style={{ border: "1px solid #e8e8f0", borderRadius: 14, padding: 20, transition: "transform 0.2s, box-shadow 0.2s" }} {...cardHover}>
                  <span style={{ display: "inline-block", background: B_YELLOW, color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 4, marginBottom: 12 }}>{e.date}</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>{e.title}</div>
                  <div style={{ fontSize: 13, color: "#64748B" }}>{e.location}</div>
                  <span style={{ display: "inline-block", marginTop: 10, fontSize: 11, fontWeight: 600, color: B_INDIGO, background: "#eef0ff", padding: "3px 10px", borderRadius: 4 }}>{e.status}</span>
                </div>
              ))}
            </div>
            <h2 style={{ color: B_INDIGO, fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Past</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {PAST_EVENTS.map((e, i) => (
                <div key={i} style={{ border: "1px solid #e8e8f0", borderRadius: 14, padding: 20, transition: "transform 0.2s, box-shadow 0.2s" }} {...cardHover}>
                  <span style={{ display: "inline-block", background: "#e2e8f0", color: "#475569", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 4, marginBottom: 12 }}>{e.date}</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>{e.title}</div>
                  <div style={{ fontSize: 13, color: "#64748B" }}>{e.location}</div>
                  <span style={{ display: "inline-block", marginTop: 10, fontSize: 11, fontWeight: 600, color: "#64748B", background: "#f5f5fa", padding: "3px 10px", borderRadius: 4 }}>Past</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
