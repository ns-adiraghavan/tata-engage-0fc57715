import SubPageDotRail from "./SubPageDotRail";
import { ACCENT_NAVY } from "@/data/homeSharedData";

interface Section {
  id: string;
  label: string;
}

interface PageShellProps {
  accentColor: string;
  sections: Section[];
  pageTitle: string;
  pageEyebrow: string;
  pageDesc?: string;
  children: React.ReactNode;
}

const PageShell = ({ accentColor, sections, pageTitle, pageEyebrow, pageDesc, children }: PageShellProps) => {
  return (
    <div className="relative font-sans">
      {/* Dot rail */}
      <SubPageDotRail sections={sections} accentColor={accentColor} />

      {/* Accent line */}
      <div className="h-0.5 w-full" style={{ backgroundColor: accentColor }} />

      {/* Hero strip */}
      <section className="bg-white pt-24 pb-10 px-6 md:px-16">
        <p
          className="uppercase font-bold tracking-[1.8px]"
          style={{ fontSize: 10, color: "#999" }}
        >
          {pageEyebrow}
        </p>
        <h1
          className="text-4xl md:text-5xl font-black tracking-tight mt-2"
          style={{ color: ACCENT_NAVY }}
        >
          {pageTitle}
        </h1>
        <div className="mt-3" style={{ width: 48, height: 3, borderRadius: 2, background: accentColor }} />
        {pageDesc && (
          <p className="text-base text-slate-500 font-light max-w-2xl mt-3">
            {pageDesc}
          </p>
        )}
      </section>

      {/* Page content */}
      <div className="pt-0 pb-20">
        {children}
      </div>
    </div>
  );
};

export default PageShell;
