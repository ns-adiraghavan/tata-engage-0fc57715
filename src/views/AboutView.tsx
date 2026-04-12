import Footer from "@/components/layout/Footer";

const SECTIONS = [
  { title: "Our Mission", text: "Tata Engage connects employees, NGOs, and communities to create lasting social impact through structured volunteering programmes across the Tata Group." },
  { title: "What We Do", text: "We facilitate skill-based volunteering, disaster response coordination, and community development projects — empowering every Tata employee to contribute meaningfully." },
  { title: "Our Reach", stats: [{ label: "Volunteers", value: "1,20,000+" }, { label: "NGO Partners", value: "850+" }, { label: "Projects Completed", value: "4,500+" }, { label: "Cities", value: "200+" }] },
  { title: "Our Values", text: "Integrity, collaboration, and purpose drive everything we do. We believe volunteering transforms not just communities — but the volunteers themselves." },
];

export default function AboutView() {
  return (
    <div style={{ paddingTop: 80, paddingBottom: 80, background: "#F8F9FB", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0D1B3E", marginBottom: 8 }}>About Tata Engage</h1>
        <p style={{ fontSize: 16, color: "#64748B", marginBottom: 40 }}>Building a culture of purpose-driven volunteering across the Tata Group.</p>

        {SECTIONS.map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B3E", marginBottom: 12 }}>{s.title}</h2>
            {s.text && <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7 }}>{s.text}</p>}
            {s.stats && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 8 }}>
                {s.stats.map((st, j) => (
                  <div key={j} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#1E6ED4" }}>{st.value}</div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>{st.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
