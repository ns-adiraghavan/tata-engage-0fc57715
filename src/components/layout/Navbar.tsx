import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell, ChevronDown, User, LogOut, Share2, LayoutDashboard, Search } from "lucide-react";
import tataLogo from "@/assets/Tata-removebg-preview.png";
import tataEngageLogo from "@/assets/tata-engage-logo.png";
import type { View } from "@/types";
import { NOTIFICATIONS_VOLUNTEER, NOTIFICATIONS_NGO, NOTIFICATIONS_SPOC, NOTIFICATIONS_ADMIN } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";

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
  const location = useLocation();
  const { triggerToast } = useAppContext();
  const getRoleNotifications = () => {
    if (!user) return NOTIFICATIONS_VOLUNTEER;
    if (user.role === "ngo") return NOTIFICATIONS_NGO;
    if (user.role === "corporate_spoc" || user.role === "regional_spoc") return NOTIFICATIONS_SPOC;
    if (user.role === "platform_admin") return NOTIFICATIONS_ADMIN;
    return NOTIFICATIONS_VOLUNTEER;
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
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
  const isHeroOverlayRoute = ["/", "/hub", "/ngo/hub", "/spoc/hub", "/dashboard", "/profile"].includes(location.pathname);
  const isTransparent = isHeroOverlayRoute && !scrolled;

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className={`h-16 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${isTransparent ? "bg-black/20 backdrop-blur-sm border-b border-transparent" : "bg-white border-b border-zinc-100 shadow-sm"}`}>

        {/* ── LEFT: TataEngage logo ── */}
        <div className="flex-shrink-0">
          <img
            src={tataEngageLogo}
            alt="TataEngage"
            className="h-9 object-contain cursor-pointer"
            onClick={() => isLoggedIn ? onNavigate(hubView()) : onNavigate("home")}
          />
        </div>

        {/* ── CENTRE: public nav links ── */}
        <div className="hidden md:flex items-center gap-10 lg:gap-[60px]">
            <span
              onClick={() => onNavigate("home")}
              className={`text-sm font-medium transition-colors duration-300 cursor-pointer ${isTransparent ? "text-white/90 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}`}
            >
              Home
            </span>

            {[
              {
                label: "About",
                items: [
                  {
                    label: "TE Vision",
                    action: () => {
                      onNavigate("about");
                      setTimeout(() => document.getElementById("about-vision")?.scrollIntoView({ behavior: "smooth" }), 120);
                    }
                  },
                  {
                    label: "Our Journey",
                    action: () => onNavigate("journey"),
                  },
                  {
                    label: "Impact & Reach",
                    action: () => {
                      onNavigate("about");
                      setTimeout(() => document.getElementById("about-impact")?.scrollIntoView({ behavior: "smooth" }), 120);
                    }
                  },
                  {
                    label: "Team",
                    action: () => {
                      onNavigate("about");
                      setTimeout(() => document.getElementById("about-team")?.scrollIntoView({ behavior: "smooth" }), 120);
                    }
                  },
                ],
              },
              {
                label: "Programmes",
                items: [
                  { label: "ProEngage",              action: () => onNavigate("about-proengage") },
                  { label: "TVW (Tata Volunteering Week)", action: () => onNavigate("about-tvw") },
                  { label: "Disaster Response",      action: () => onNavigate("disaster-response") },
                  { label: "CVP",                    action: () => triggerToast("CVP information coming soon") },
                  { label: "DIY",                    action: () => triggerToast("DIY kit available in the Resource Library after login") },
                ],
              },
              {
                label: "Media & Resources",
                items: [
                  { label: "Photos",         action: () => onNavigate("media") },
                  { label: "Videos",         action: () => onNavigate("media") },
                  { label: "Impact Stories", action: () => onNavigate("media") },
                  { label: "Social Media",   action: () => onNavigate("media") },
                  { label: "Events",         action: () => onNavigate("media") },
                ],
              },
              {
                label: "Partner With Us",
                items: [
                  { label: "Register as NGO",           action: () => onNavigate("register-role") },
                  { label: "Register as Volunteer",      action: () => onNavigate("register-role") },
                  { label: "How & Where to Volunteer",   action: () => onNavigate("partner") },
                  { label: "Refer an NGO",               action: () => onNavigate("partner") },
                ],
              },
            ].map((nav) => (
              <div key={nav.label} className="relative group">
                <span className={`text-sm font-medium transition-colors duration-300 cursor-pointer flex items-center gap-1 ${isTransparent ? "text-white/90 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}`}>
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

            <Search size={18} className={`cursor-pointer transition-colors duration-300 ${isTransparent ? "text-white/80 hover:text-white" : "text-zinc-400 hover:text-zinc-700"}`} />
          </div>

        {/* ── RIGHT ── */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Bell */}
              <div className="relative" ref={notifRef}>
                <button onClick={() => setNotifOpen((o) => !o)}
                  className={`p-2 rounded-full cursor-pointer relative transition-colors duration-300 ${isTransparent ? "hover:bg-white/10" : "hover:bg-zinc-100"}`}>
                  <Bell size={20} className={`transition-colors duration-300 ${isTransparent ? "text-white/90" : "text-zinc-700"}`} />
                  {unreadCount > 0 && (
                    <span className={`absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 ${isTransparent ? "border-transparent" : "border-white"}`} />
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
                  <div className="w-9 h-9 rounded-full bg-[#3E7EB0] text-white flex items-center justify-center text-sm font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <ChevronDown size={14} className={`transition-colors duration-300 ${isTransparent ? "text-white/60 group-hover:text-white" : "text-zinc-400 group-hover:text-zinc-600"}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden z-[80]">
                    <div className="px-4 py-3 border-b border-zinc-100">
                      <div className="font-semibold text-sm text-zinc-900">{user?.firstName} {user?.lastName}</div>
                      <p className="text-xs text-zinc-500 mt-0.5">{roleLabel()}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { icon: User,            label: "Profile",          action: () => { onNavigate("profile");   setDropdownOpen(false); } },
                        { icon: LayoutDashboard, label: "My Hub",           action: () => { onNavigate(hubView());  setDropdownOpen(false); } },
                        { icon: Share2,          label: "Refer a Colleague",action: () => { setDropdownOpen(false); } },
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

              {/* Tata logo — right side when logged in */}
              <img src={tataLogo} alt="Tata" className={`h-8 w-8 object-contain hidden md:block transition-all duration-300 ${isTransparent ? "brightness-0 invert" : ""}`} />
            </>
          ) : (
            /* ── Public right: Log In + Register + Tata logo ── */
            <div className="flex items-center gap-4">
              <span onClick={() => onNavigate("login")}
                className={`text-sm font-medium transition-colors duration-300 cursor-pointer ${isTransparent ? "text-white/90 hover:text-white" : "text-zinc-600 hover:text-zinc-900"}`}>
                Log In
              </span>
              <button onClick={() => onNavigate("register-role")}
                className="py-2 px-5 text-sm font-semibold rounded-lg cursor-pointer transition-all hover:brightness-95"
                style={{ background: "#FCB514", color: "#0D1B3E" }}>
                Register
              </button>
              {/* Tata logo — right end */}
              <img src={tataLogo} alt="Tata" className={`h-8 w-8 object-contain hidden md:block transition-all duration-300 ${isTransparent ? "brightness-0 invert" : ""}`} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
