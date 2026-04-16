import { useState, useEffect, useRef } from "react";
import { ACCENT_NAVY } from "@/data/homeSharedData";

interface Section {
  id: string;
  label: string;
}

interface SubPageDotRailProps {
  sections: Section[];
  /** Kept for backwards compatibility — the rail now uses ACCENT_NAVY for unified site styling. */
  accentColor?: string;
}

const SubPageDotRail = ({ sections }: SubPageDotRailProps) => {
  const [activeSection, setActiveSection] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const labelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach((s, idx) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setActiveSection(idx);
            setShowLabel(true);
            if (labelTimer.current) clearTimeout(labelTimer.current);
            labelTimer.current = setTimeout(() => setShowLabel(false), 1800);
          }
        },
        { threshold: 0.2 }
      );
      o.observe(el);
      observers.push(o);
    });
    return () => {
      observers.forEach((o) => o.disconnect());
      if (labelTimer.current) clearTimeout(labelTimer.current);
    };
  }, [sections]);

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end"
      style={{ gap: 0 }}
    >
      {sections.map((s, i) => {
        const active = activeSection === i;
        const isLast = i === sections.length - 1;
        return (
          <div key={s.id} className="flex flex-col items-end">
            <button
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center justify-end"
              style={{ marginBottom: 0 }}
            >
              {active && showLabel && (
                <span
                  className="whitespace-nowrap shadow-sm transition-all duration-300 mr-2"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.3px",
                    padding: "3px 9px",
                    borderRadius: 4,
                    backgroundColor: "rgba(13,27,62,0.92)",
                    border: `1px solid ${ACCENT_NAVY}`,
                    color: "#ffffff",
                  }}
                >
                  {s.label}
                </span>
              )}
              {/* Node dot — square, navy */}
              <span
                className="transition-all duration-300"
                style={{
                  width: active ? 9 : 6,
                  height: active ? 9 : 6,
                  borderRadius: 2,
                  backgroundColor: ACCENT_NAVY,
                  border: `1px solid rgba(13,27,62,0.25)`,
                  display: "block",
                  flexShrink: 0,
                }}
              />
            </button>

            {/* Dotted connector between nodes */}
            {!isLast && (
              <div
                style={{
                  width: 1,
                  height: 28,
                  marginLeft: "auto",
                  marginRight: active ? "4px" : "2.5px",
                  backgroundImage: `repeating-linear-gradient(to bottom, ${ACCENT_NAVY}50 0px, ${ACCENT_NAVY}50 3px, transparent 3px, transparent 7px)`,
                  transition: "all 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SubPageDotRail;
