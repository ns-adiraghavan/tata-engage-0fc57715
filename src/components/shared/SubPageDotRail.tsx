import { useState, useEffect } from "react";

interface Section {
  id: string;
  label: string;
}

interface SubPageDotRailProps {
  sections: Section[];
  accentColor: string;
}

const SubPageDotRail = ({ sections, accentColor }: SubPageDotRailProps) => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach((s, idx) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(idx); },
        { threshold: 0.2 }
      );
      o.observe(el);
      observers.push(o);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
      {sections.map((s, i) => {
        const active = activeSection === i;
        return (
          <button
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-end"
          >
            {active && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full mr-2 whitespace-nowrap bg-white border border-slate-200 text-slate-700 shadow-sm">
                {s.label}
              </span>
            )}
            <span
              className="rounded-full transition-all duration-300"
              style={{
                width: active ? 10 : 7,
                height: active ? 10 : 7,
                backgroundColor: "#0D1B3E",
                border: "1px solid rgba(13,27,62,0.15)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
};

export default SubPageDotRail;
