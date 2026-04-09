import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, User, LogOut, Share2, LayoutDashboard, Search } from "lucide-react";
import tataLogo from "@/assets/tata-logo.png";
import tataEngageLogo from "@/assets/tata-engage-logo.png";
import type { View } from "@/types";
import { NOTIFICATIONS_VOLUNTEER, NOTIFICATIONS_NGO, NOTIFICATIONS_SPOC, NOTIFICATIONS_ADMIN } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";

// ── Brand tokens (local — not imported so Navbar stays self-contained) ────────
const B_INDIGO = "#333399";
const B_YELLOW = "#F5A623";

// ── Ticker data ───────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "🟢  ProEngage 2026 is OPEN — 400+ projects live",
  "📅  TVW 2026 registration opens in 14 days",
  "🏅  1,240 volunteers matched this edition — a record",
  "🌿  TCS: 1,000 trees planted across 8 campuses",
  "🚨  Disaster Response deployed to Assam floods",
  "🎓  Finance Mentorship projects now accepting applications",
  "🤝  85 NGO partners and counting across 15 states",
];
const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];

const Navbar = ({
  onNavigate,
  isLoggedIn,
  onLogout,
  user,
}: {
  onNavigate: (view: View) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  user: any;
}) => {
  const { triggerToast } = useAppContext();

  // ── Scroll transparency ───────────────────────────────────────────────────
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Notifications ─────────────────────────────────────────────────────────
  const getRoleNotifications = () => {
    if (!user) return NOTIFICATIONS_VOLUNTEER;
    if (user.role === "ngo") return NOTIFICATIONS_NGO;
    if (user.role === "corporate_spoc" || user.role === "regional_spoc") return NOTIFICATIONS_SPOC;
    if (user.role === "platform_admin") return NOTIFICATIONS_ADMIN;
    return NOTIFICATIONS_VOLUNTEER;
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [notifications, setNotifications] = useState(getRoleNotifications());

  useEffect(() => { setNotifications(getRoleNotifications()); }, [user]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (notifRef.current    && !notifRef.current.contains(e.target as Node))    setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const roleLabel = () => {
    if (!user) return "";
    if (user.role === "ngo") return `NGO · ${user.organization}`;
    if (user.role === "corporate_spoc") return `Corporate SPOC · ${user.company}`;
    if (user.role === "platform_admin") return "TSG Admin";
    return `Tata Employee · ${user.company}`;
  };

  const hubView = (): View =>
    user?.role === "ngo"
      ? "ngo-hub"
      : user?.role === "corporate_spoc"
      ? "spoc-hub"
      : "volunteer-hub";

  const unreadCount = notifications.filter((n) => !n.read).length;

  const dotColor = (type: string) => {
    if (type === "match" || type === "approval") return "bg-green-500";
    if (type === "certificate") return "bg-blue-500";
    if (type === "verification" || type === "grievance") return "bg-red-500";
    if (type === "leaderboard") return "bg-violet-500";
    return "bg-amber-500";
  };

  const iconChip = (type: string) => {
    if (type === "match" || type === "approval") return "✓";
    if (type === "certificate") return "↓";
    if (type === "feedback") return "★";
    if (type === "verification") return "!";
    if (type === "leaderboard") return "↑";
    if (type === "grievance") return "⚠";
    return "•";
  };

  const notifRoleLabel = () => {
    if (!user) return "Volunteer";
    if (user.role === "ngo") return "NGO";
    if (user.role === "corporate_spoc" || user.role === "regional_spoc") return "SPOC";
    if (user.role === "platform_admin") return "Admin";
    return "Volunteer";
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setNotifOpen(false);
  };

  // ── Derived: when transparent, tint text for readability on white bg ──────
  // We keep text colours constant — transparency effect alone is the signal.
  const navBg    = scrolled ? "bg-white border-b border-zinc-100 shadow-sm" : "bg-transparent border-b border-transparent";
  const logoFilter = scrolled ? "" : "brightness-0"; // keep logos visible on white hero; on dark hub heroes Navbar sits over dark so keep normal
  // Text colours: always dark — works on white HomeView hero. Hub hubs have dark images; rely on existing contrast.

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">

      {/* ── Main bar ────────────────────────────────────────────────────────── */}
      <div className={`h-16 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${navBg}`}>

        {/* LEFT: TataEngage logo */}
        <div className="flex-shrink-0">
          <img
            src={tataEngageLogo}
            alt="TataEngage"
            className="h-9 object-contain cursor-pointer"
            onClick={() => isLoggedIn ? onNavigate(hubView()) : onNavigate("home")}
          />
        </div>

        {/* CENTRE: public nav links */}
        {!isLoggedIn && (
          <div className="hidden md:flex items-center gap-8">
            <span
              onClick={() => onNavigate("home")}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Home
            </span>

            {[
              {
                label: "About",
                items: [
                  { label: "TE Vision",      action: () => triggerToast("Coming soon") },
                  { label: "Our Journey",    action: () => triggerToast("Coming soon") },
                  { label: "Impact & Reach", action: () => triggerToast("Coming soon") },
                  { label: "Team",           action: () => triggerToast("Coming soon") },
                  { label: "Contact Us",     action: () => triggerToast("Coming soon") },
                ],
              },
              {
                label: "Programmes",
                items: [
                  { label: "ProEngage",                    action: () => triggerToast("Coming soon") },
                  { label: "TVW (Tata Volunteering Week)", action: () => triggerToast("Coming soon") },
                  { label: "Disaster Response",            action: () => triggerToast("Coming soon") },
                  { label: "CVP",                          action: () => triggerToast("Coming soon") },
                  { label: "DIY",                          action: () => triggerToast("Coming soon") },
                ],
              },
              {
                label: "Media & Resources",
                items: [
                  { label: "Photos",         action: () => triggerToast("Coming soon") },
                  { label: "Videos",         action: () => triggerToast("Coming soon") },
                  { label: "Impact Stories", action: () => triggerToast("Coming soon") },
                  { label: "Social Media",   action: () => triggerToast("Coming soon") },
                  { label: "Events",         action: () => triggerToast("Coming soon") },
                ],
              },
              {
                label: "Partner With Us",
                items: [
                  { label: "Register as NGO",          action: () => onNavigate("register-role") },
                  { label: "Register as Volunteer",    action: () => onNavigate("register-role") },
                  { label: "How & Where to Volunteer", action: () => triggerToast("Coming soon") },
                  { label: "Refer an NGO",             action: () => triggerToast("Coming soon") },
                ],
              },
            ].map((nav) => (
              <div key={nav.label} className="relative group">
                <span className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer flex items-center gap-1">
                  {nav.label} <ChevronDown size={12} />
                </span>
                <div className="absolute top-full left-0 mt-2 bg-white border border-zinc-100 rounded-xl shadow-sm py-2 w-52 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  {nav.items.map((item) => (
                    <span key={item.label} onClick={item.action}
                      className="block px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 cursor-pointer transition-colors">
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <Search size={18} className="text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors" />
          </div>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Bell */}
              <div className="relative" ref={notifRef}>
                <button onClick={() => setNotifOpen((o) => !o)}
                  className="p-2 hover:bg-zinc-100 rounded-full cursor-pointer relative">
                  <Bell size={20} className="text-zinc-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-2xl shadow-sm z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                      <div>
                        <span className="font-semibold text-sm text-zinc-900">Notifications</span>
                        <p className="text-xs text-slate-400">{notifRoleLabel()}</p>
                      </div>
                      <button onClick={handleMarkAllRead}
                        className="text-xs text-blue-600 font-medium hover:underline cursor-pointer">
                        Mark all as read
                      </button>
                    </div>
                    {unreadCount === 0 && notifications.every((n) => n.read) ? (
                      <div className="py-8 text-center">
                        <p className="text-xs text-slate-400">You're all caught up</p>
                      </div>
                    ) : (
                      <div className="max-h-[420px] overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id}
                            className={`flex items-start gap-3 px-5 py-4 border-b border-zinc-50 last:border-b-0 ${n.read ? "bg-white" : "bg-slate-50"}`}>
                            <span className={`mt-0.5 w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold ${dotColor(n.type)}`}>
                              {iconChip(n.type)}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-zinc-900">{n.title}</p>
                              <p className="text-sm text-slate-500 line-clamp-2">{n.body}</p>
                              <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-9 h-9 rounded-full bg-[#003580] text-white flex items-center justify-center text-sm font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <ChevronDown size={14} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden z-[80]">
                    <div className="px-4 py-3 border-b border-zinc-100">
                      <div className="font-semibold text-sm text-zinc-900">{user?.firstName} {user?.lastName}</div>
                      <p className="text-xs text-zinc-500 mt-0.5">{roleLabel()}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { icon: User,            label: "Profile",           action: () => { onNavigate("profile");  setDropdownOpen(false); } },
                        { icon: LayoutDashboard, label: "My Hub",            action: () => { onNavigate(hubView()); setDropdownOpen(false); } },
                        { icon: Share2,          label: "Refer a Colleague", action: () => { setDropdownOpen(false); } },
                      ].map(({ icon: Icon, label, action }) => (
                        <button key={label} onClick={action}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
                          <Icon size={16} /> {label}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-zinc-100 py-1">
                      <button onClick={() => { onLogout(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tata logo */}
              <img src={tataLogo} alt="Tata" className="h-8 w-8 object-contain hidden md:block" />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span onClick={() => onNavigate("login")}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer">
                Log In
              </span>
              <button onClick={() => onNavigate("register-role")}
                className="btn-black py-2 px-5 text-sm cursor-pointer">
                Register
              </button>
              <img src={tataLogo} alt="Tata" className="h-8 w-8 object-contain hidden md:block" />
            </div>
          )}
        </div>
      </div>

      {/* ── Persistent ticker bar — always visible, below main nav ───────────── */}
      <div className="overflow-hidden py-2" style={{ backgroundColor: B_INDIGO }}>
        <div className="flex items-center gap-4">
          <div className="shrink-0 pl-6 md:pl-12">
            <span className="text-xs font-black px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{ backgroundColor: B_YELLOW, color: "#111" }}>
              LIVE
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-16 animate-marquee whitespace-nowrap">
              {tickerDouble.map((item, i) => (
                <span key={i} className="text-white/75 text-xs font-medium shrink-0 hover:text-white cursor-pointer transition-colors">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 38s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>
    </nav>
  );
};

export default Navbar;
