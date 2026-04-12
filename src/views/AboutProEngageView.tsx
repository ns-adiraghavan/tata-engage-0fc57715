import Footer from "@/components/layout/Footer";

const SECTIONS = [
  { title: "What is ProEngage?", text: "ProEngage is Tata Engage's skill-based volunteering programme that matches professionals with NGO projects requiring specialised expertise — from finance and legal to technology and marketing." },
  { title: "How It Works", steps: ["NGOs submit project briefs with skill requirements", "Employees browse and apply based on their expertise", "A matching algorithm pairs volunteers with the best-fit projects", "Volunteers contribute 20–40 hours over 2–3 months"] },
  { title: "Who Can Participate?", text: "Any Tata Group employee can apply. Projects span domains like strategy consulting, digital transformation, HR policy design, financial planning, and more." },
  { title: "Impact So Far", text: "ProEngage has delivered over 1,200 skill-based projects, saving NGOs an estimated ₹85 crore in consulting costs while giving employees meaningful, resume-worthy experience." },
];

export default function AboutProEngageView() {
  return (
    <div style={{ paddingTop: 80, paddingBottom: 80, background: "#F8F9FB", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0D1B3E", marginBottom: 8 }}>About ProEngage</h1>
        <p style={{ fontSize: 16, color: "#64748B", marginBottom: 40 }}>Skill-based volunteering that creates professional-grade impact for NGOs.</p>

        {SECTIONS.map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B3E", marginBottom: 12 }}>{s.title}</h2>
            {s.text && <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7 }}>{s.text}</p>}
            {s.steps && (
              <ol style={{ paddingLeft: 20, margin: 0 }}>
                {s.steps.map((st, j) => (
                  <li key={j} style={{ fontSize: 15, color: "#475569", lineHeight: 2 }}>{st}</li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
