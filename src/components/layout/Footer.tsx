import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import tataEngageLogoNoBg from "@/assets/tata-engage-logo-nobg.png";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const Footer = () => {
  const { triggerToast } = useAppContext();
  const navigate = useAppNavigate();
  return (
  <footer className="bg-zinc-950 text-white pt-16 pb-8 px-6 md:px-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
      <div>
        <div className="mb-6">
          <img 
            src={tataEngageLogoNoBg} 
            alt="TATA engage" 
            className="h-14 md:h-16 object-contain brightness-0 invert"
          />
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Tata Engage is the group-wide volunteering programme that encourages Tata employees, 
          their families, and retirees to volunteer their time and skills for the benefit of society.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-6">Quick Links</h4>
        <ul className="space-y-3 text-slate-400 text-sm">
          <li><span onClick={() => { navigate("about"); setTimeout(() => document.getElementById("about-vision")?.scrollIntoView({ behavior: "smooth" }), 120); }} className="hover:text-white transition-colors cursor-pointer">TE Vision</span></li>
          <li><span onClick={() => navigate("journey")} className="hover:text-white transition-colors cursor-pointer">Our Journey</span></li>
          <li><span onClick={() => navigate("partner")} className="hover:text-white transition-colors cursor-pointer">Partner With Us</span></li>
          <li><span onClick={() => navigate("media")} className="hover:text-white transition-colors cursor-pointer">Media & Impact Stories</span></li>
          <li><span onClick={() => navigate("login")} className="hover:text-white transition-colors cursor-pointer">Login</span></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6">Programmes</h4>
        <ul className="space-y-3 text-slate-400 text-sm">
          <li><span onClick={() => navigate("about-tvw")} className="hover:text-white transition-colors cursor-pointer">TVW (Tata Volunteering Week)</span></li>
          <li><span onClick={() => navigate("about-proengage")} className="hover:text-white transition-colors cursor-pointer">ProEngage</span></li>
          <li><span onClick={() => navigate("disaster-response")} className="hover:text-white transition-colors cursor-pointer">Disaster Response</span></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6">Connect With Us</h4>
        <div className="flex gap-4 mb-6">
          <Facebook size={20} className="text-slate-400 hover:text-white cursor-pointer" />
          <Twitter size={20} className="text-slate-400 hover:text-white cursor-pointer" />
          <Instagram size={20} className="text-slate-400 hover:text-white cursor-pointer" />
          <Linkedin size={20} className="text-slate-400 hover:text-white cursor-pointer" />
          <Youtube size={20} className="text-slate-400 hover:text-white cursor-pointer" />
        </div>
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Newsletter</p>
          <input type="text" placeholder="Your name" className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white placeholder-zinc-500 mb-2 outline-none focus:border-zinc-500" />
          <input type="email" placeholder="Your email" className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white placeholder-zinc-500 mb-3 outline-none focus:border-zinc-500" />
          <button onClick={() => triggerToast("Subscribed! Welcome to Tata Engage updates.")} className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold text-sm py-2 rounded-md transition-colors">Subscribe</button>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
      <p>© 2026 Tata Sons Private Limited. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-white">Privacy Policy</a>
        <a href="#" className="hover:text-white">Terms of Use</a>
        <a href="#" className="hover:text-white">Cookie Policy</a>
        <span onClick={() => navigate("admin-login")} className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors cursor-pointer">Admin</span>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
