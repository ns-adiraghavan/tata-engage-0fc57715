import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Calendar, MapPin, Filter, CalendarDays, List, Check, Download, FileText, Camera, BookOpen, ArrowRight } from "lucide-react";

import { TVW_EVENTS } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { B_YELLOW, B_RED, B_TEAL, ACCENT_NAVY } from "@/data/homeSharedData";
import { TickerBar } from "@/components/shared/HomeSections";

const COBALT = "#0047AB";



const VIBE_STORIES = [
  { location: "Mumbai", caption: "Teaching digital literacy to senior citizens at a local community centre.", status: "Published" },
  { location: "Pune", caption: "Tree plantation drive across 3 campuses — 500 saplings in one morning.", status: "Published" },
  { location: "Chennai", caption: "Blood donation camp organised with Rotary Club partnership.", status: "Under Review" },
];

const RESOURCES = [
  { title: "Campaign Kit", desc: "Posters, banners and social media templates for TVW 2025.", icon: FileText, photo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80" },
  { title: "Volunteer Handbook", desc: "Guidelines, FAQs and best practices for first-time volunteers.", icon: BookOpen, photo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80" },
  { title: "Photo Submission Guide", desc: "How to capture, tag and submit your volunteering photos.", icon: Camera, photo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80" },
];

const DIAG_TEXTURE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: "repeating-linear-gradient(45deg, rgba(245,166,35,0.06) 0px, rgba(245,166,35,0.06) 1px, transparent 1px, transparent 22px)",
  backgroundSize: "22px 22px",
  pointerEvents: "none",
};

const TVWHubView = () => {
  const { registeredEvents, triggerToast } = useAppContext();
  
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [filters, setFilters] = useState({ location: "All", theme: "All", mode: "All" });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = TVW_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = filters.location === "All" || event.location.includes(filters.location);
    const matchesTheme = filters.theme === "All" || event.theme === filters.theme;
    const matchesMode = filters.mode === "All" || event.mode === filters.mode;
    return matchesSearch && matchesLocation && matchesTheme && matchesMode;
  });

  return (
    <div style={{ paddingTop: 80, paddingBottom: 48 }} className="min-h-screen bg-white">
      {/* 2px accent line */}
      <div style={{ background: B_YELLOW, height: 2, width: "100%" }} />

      {/* ═══ HERO ═══ */}
      <section id="tvw-hero" className="relative overflow-hidden" style={{ minHeight: 420, backgroundColor: ACCENT_NAVY, padding: 64 }}>
        <div style={DIAG_TEXTURE} />

        <div className="relative z-10 flex flex-col justify-between h-full" style={{ minHeight: 292 }}>
          {/* Top */}
          <div>
            <p style={{ fontSize: 11, letterSpacing: "2px", color: "rgba(255,255,255,0.45)" }} className="uppercase font-semibold mb-4">
              Tata Volunteering Week · Edition 2025
            </p>
            <h1 style={{ fontSize: 48, fontWeight: 900 }} className="text-white tracking-tight mb-3">
              Make Every Hour Count
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontWeight: 300 }} className="text-lg max-w-xl">
              One week. Every Tata company. Thousands of acts of service.
            </p>
          </div>

          {/* Key dates pills */}
          <div className="flex flex-wrap gap-3 mt-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ background: "rgba(255,255,255,0.10)" }}>
              <CalendarDays size={14} className="text-white/60" />
              22 Sep — 4 Oct 2025
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ background: "rgba(255,255,255,0.10)" }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Now
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ background: "rgba(255,255,255,0.10)" }}>
              <Users size={14} className="text-white/60" />
              47 Events Registered
            </div>
          </div>

          {/* Bottom-right CTA */}
          <div className="flex justify-end mt-8">
            <button
              onClick={() => {
                const el = document.getElementById("tvw-events");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-xl hover:brightness-105 transition-all cursor-pointer shadow-lg"
              style={{ backgroundColor: B_YELLOW, color: "#111" }}
            >
              Browse Events <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ EVENTS ═══ */}
      <section id="tvw-events" className="px-6 md:px-16 py-16 max-w-7xl mx-auto" style={{ paddingTop: 48 }}>
        <h2 className="text-3xl font-black tracking-tight mb-8" style={{ color: ACCENT_NAVY }}>Events</h2>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-zinc-100 shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all"
              style={viewMode === "list" ? { backgroundColor: COBALT, color: "#fff" } : { color: "#64748b" }}
            >
              <List size={18} /> List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all"
              style={viewMode === "calendar" ? { backgroundColor: COBALT, color: "#fff" } : { color: "#64748b" }}
            >
              <CalendarDays size={18} /> Calendar
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="px-4 py-3 bg-white border border-zinc-100 rounded-2xl text-sm focus:outline-none"
              >
                <option>All Locations</option>
                <option>Mumbai</option>
                <option>Pune</option>
                <option>Chennai</option>
                <option>Virtual</option>
              </select>
              <button className="p-3 bg-white border border-zinc-100 rounded-2xl text-slate-400 hover:text-zinc-900 transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => {
              const isRegistered = registeredEvents.includes(event.id);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-zinc-100 shadow-sm flex overflow-hidden group"
                  style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; }}
                >
                  <div className="w-[3px] rounded-l-full flex-shrink-0" style={{ backgroundColor: COBALT }} />
                  <div className="flex-1 p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${event.mode === "Virtual" ? "bg-[#00b4d8]/10 text-[#00b4d8]" : "bg-[#7c3aed]/10 text-[#7c3aed]"}`}>
                          {event.mode}
                        </div>
                        {isRegistered && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white" style={{ backgroundColor: B_TEAL }}>
                            <Check size={12} /> Registered
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-400 uppercase">{event.company}</div>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-[#0047AB] transition-colors">{event.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6">{event.description}</p>
                    <div className="space-y-2 mb-6 text-sm text-slate-600">
                      <div className="flex items-center gap-3"><Calendar size={16} className="text-slate-400" /> {event.date}</div>
                      <div className="flex items-center gap-3"><MapPin size={16} className="text-slate-400" /> {event.location}</div>
                      <div className="flex items-center gap-3">
                        <Users size={16} className="text-slate-400" />
                        {event.capacity === "Full" ? (
                          <span className="font-bold text-white text-xs px-2.5 py-0.5 rounded-full" style={{ backgroundColor: B_RED }}>Full</span>
                        ) : (
                          <span className="font-bold text-green-600">Open for Registration</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => triggerToast("Please contact your SPOC to register for this event.")}
                      className="w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm text-white hover:opacity-90 shadow-lg shadow-black/10 cursor-pointer"
                      style={{ backgroundColor: COBALT }}
                    >
                      Contact SPOC
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm">
            <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="bg-slate-50 p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{day}</div>
              ))}
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const hasEvent = filteredEvents.find(e => e.date.includes(`June ${day}`));
                return (
                  <div key={i} className="bg-white min-h-[120px] p-3 hover:bg-slate-50 transition-colors group relative">
                    <span className="text-sm font-bold text-slate-300 group-hover:text-zinc-900 transition-colors">{day}</span>
                    {hasEvent && (
                      <div
                        onClick={() => triggerToast("Please contact your SPOC to register for this event.")}
                        className="mt-2 p-2 rounded-lg cursor-pointer transition-all"
                        style={{ backgroundColor: `${COBALT}0d`, border: `1px solid ${COBALT}1a` }}
                      >
                        <div className="text-xs font-bold line-clamp-2 leading-tight" style={{ color: COBALT }}>{hasEvent.title}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{hasEvent.mode}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ═══ VIBE ═══ */}
      <section id="tvw-vibe" className="relative overflow-hidden py-16 px-6 md:px-16" style={{ backgroundColor: ACCENT_NAVY }}>
        <div style={DIAG_TEXTURE} />
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-3">TVW Vibe · Live Stories</h2>
            <p className="text-white/60 mb-8">Share your volunteering moments with the Tata Engage community.</p>
            <button
              onClick={() => triggerToast("Story submission form opening...")}
              className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest border border-white/20 cursor-pointer transition-colors hover:bg-white/10"
              style={{ color: B_YELLOW }}
            >
              Submit Your Story
            </button>
          </div>
          <div className="space-y-4">
            {VIBE_STORIES.map((s, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ backgroundColor: `${COBALT}44`, color: "#a5b4fc" }}>
                    {s.location}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${s.status === "Published" ? "text-green-400 bg-green-400/10" : "text-amber-400 bg-amber-400/10"}`}>
                    {s.status}
                  </span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{s.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RESOURCES ═══ */}
      <section id="tvw-collateral" className="px-6 md:px-16 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black tracking-tight mb-8" style={{ color: ACCENT_NAVY }}>Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RESOURCES.map((r, i) => (
            <div
              key={i}
              onClick={() => triggerToast(`Downloading ${r.title}...`)}
              className="rounded-2xl overflow-hidden border border-zinc-100 shadow-sm cursor-pointer group"
              style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)"; }}
            >
              <div className="h-40 overflow-hidden">
                <img src={r.photo} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <r.icon size={16} style={{ color: COBALT }} />
                  <h3 className="font-bold text-zinc-900">{r.title}</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">{r.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: COBALT }}>
                  <Download size={14} /> Download
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TICKER ═══ */}
      <TickerBar fixed />

    </div>
  );
};

export default TVWHubView;
