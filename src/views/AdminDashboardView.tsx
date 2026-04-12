import { motion } from "framer-motion";
import { Menu, User, Users, Briefcase, Heart, ShieldCheck, ArrowLeft, Mail, Search, Bell, Calendar, LayoutGrid, FileText, History, ShieldAlert } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { EmailCertificatesPanel } from "@/views/admin/EmailCertificatesPanel";
import { CMSContentPanel } from "@/views/admin/CMSContentPanel";
import { DisasterResponsePanel } from "@/views/admin/DisasterResponsePanel";
import { MediaLibraryPanel } from "@/views/admin/MediaLibraryPanel";
import { ModerationPanel } from "@/views/admin/ModerationPanel";
import { ProjectOversightPanel } from "@/views/admin/ProjectOversightPanel";
import { EditionManagementPanel } from "@/views/admin/EditionManagementPanel";
import { NGOApprovalsPanel } from "@/views/admin/NGOApprovalsPanel";
import { UserManagementPanel } from "@/views/admin/UserManagementPanel";
import { AuditLogPanel } from "@/views/admin/AuditLogPanel";
import { AdminCommandCentre } from "@/views/admin/AdminCommandCentre";

const AdminDashboardView = () => {
  const { handleLogout } = useAuth();
  const { isDRActive, setIsDRActive, drResponses, drDeploymentLog, setDrDeploymentLog, isDRClosed, setIsDRClosed, adminActiveTab, setAdminActiveTab, addAuditLog, triggerToast } = useAppContext();
  const sidebarItems = [
    { id: "Dashboard", icon: LayoutGrid },
    { id: "User Management", icon: Users },
    { id: "NGO Approvals", icon: Heart },
    { id: "Edition Management", icon: Calendar },
    { id: "Project Oversight", icon: Briefcase },
    { id: "Email & Certificates", icon: Mail },
    { id: "CMS Content", icon: FileText },
    { id: "Disaster Response", icon: ShieldAlert },
    { id: "Media Library", icon: LayoutGrid },
    { id: "Moderation", icon: ShieldCheck },
    { id: "Audit Log", icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed inset-y-0 left-0 z-50">
        {/* Logo / brand */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: "#0D1B3E" }}>T</div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-none">TataEngage</p>
              <p className="text-xs font-semibold uppercase tracking-widest mt-0.5" style={{ color: "#333399" }}>Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto px-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2 px-2">Main Menu</p>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setAdminActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer mb-0.5 ${
                adminActiveTab === item.id
                  ? ""
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent"
              }`}
              style={adminActiveTab === item.id ? { backgroundColor: "#EEF0FF", color: "#333399", borderLeft: "3px solid #333399" } : undefined}
            >
              <item.icon size={16} className="flex-shrink-0" />
              <span className="truncate text-left">{item.id}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: "#333399" }}>VN</div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">Vikram Nair</p>
              <p className="text-xs text-slate-400">TSG Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-100">
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* DR Emergency Banner */}
        {isDRActive && (
          <div style={{ backgroundColor: "#E8401C", padding: "10px 40px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#fff", display: "inline-block", animation: "te-ping 1s ease-in-out infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "1px", textTransform: "uppercase" as const }}>
              Disaster Response Active — volunteer alerts have been sent
            </span>
            <button onClick={() => setAdminActiveTab("Disaster Response")} style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", background: "none", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "4px 12px", cursor: "pointer" }}>
              Go to DR Panel →
            </button>
          </div>
        )}

        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-8">
            <h2 className="font-black text-slate-900 uppercase tracking-[0.15em] text-sm">{adminActiveTab}</h2>
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 w-80 group focus-within:border-[#333399]/30 transition-all">
              <Search size={16} className="text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search projects, users, or logs..." 
                className="bg-transparent border-none focus:ring-0 text-xs w-full ml-2 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                <Bell size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                <div className="absolute top-1 right-1 w-5 h-5 text-white text-xs font-semibold rounded-full flex items-center justify-center border-2 border-white shadow-lg" style={{ backgroundColor: "#E8401C" }}>12</div>
              </div>
              <div className="relative cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                <Mail size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: "#F5A623" }} />
              </div>
            </div>
            <div className="h-10 w-px bg-slate-100" />
            <div className="flex flex-col items-end">
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
              <div className="text-xs font-mono text-slate-400 uppercase">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>
        </header>

        <div className="p-10 flex-1 max-w-[1600px] mx-auto w-full">
          {adminActiveTab === "Dashboard" && <AdminCommandCentre />}
          {adminActiveTab === "User Management" && <UserManagementPanel />}
          {adminActiveTab === "NGO Approvals" && <NGOApprovalsPanel addAuditLog={addAuditLog} triggerToast={triggerToast} />}
          {adminActiveTab === "Edition Management" && <EditionManagementPanel addAuditLog={addAuditLog} triggerToast={triggerToast} />}
          {adminActiveTab === "Project Oversight" && <ProjectOversightPanel addAuditLog={addAuditLog} triggerToast={triggerToast} />}
          {adminActiveTab === "Email & Certificates" && <EmailCertificatesPanel addAuditLog={addAuditLog} triggerToast={triggerToast} />}
          {adminActiveTab === "CMS Content" && <CMSContentPanel addAuditLog={addAuditLog} triggerToast={triggerToast} />}
          {adminActiveTab === "Disaster Response" && (
            <DisasterResponsePanel 
              addAuditLog={addAuditLog} 
              triggerToast={triggerToast} 
              drResponses={drResponses}
              setIsDRActive={setIsDRActive}
              isDRActive={isDRActive}
              drDeploymentLog={drDeploymentLog}
              setDrDeploymentLog={setDrDeploymentLog}
              isDRClosed={isDRClosed}
              setIsDRClosed={setIsDRClosed}
            />
          )}
          {adminActiveTab === "Media Library" && <MediaLibraryPanel triggerToast={triggerToast} />}
          {adminActiveTab === "Moderation" && <ModerationPanel addAuditLog={addAuditLog} triggerToast={triggerToast} />}
          {adminActiveTab === "Audit Log" && <AuditLogPanel />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardView;
