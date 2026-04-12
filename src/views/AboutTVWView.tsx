import Footer from "@/components/layout/Footer";

const HIGHLIGHTS = [
  { title: "What is TVW?", text: "Tata Volunteering Week is the Tata Group's flagship annual volunteering event, bringing together employees from across companies for a week of community service." },
  { title: "When", text: "Held every year in the last week of September, TVW unites lakhs of volunteers in simultaneous activities across 200+ cities." },
  { title: "Activities", text: "From environmental drives and education workshops to health camps and skill-sharing sessions — TVW covers a wide range of community impact areas." },
  { title: "Impact", text: "Since inception, TVW has mobilised over 10 lakh volunteer hours and touched millions of lives across India and beyond." },
];

export default function AboutTVWView() {
  return (
    <div style={{ paddingTop: 80, paddingBottom: 80, background: "#F8F9FB", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0D1B3E", marginBottom: 8 }}>About Tata Volunteering Week</h1>
        <p style={{ fontSize: 16, color: "#64748B", marginBottom: 40 }}>The Tata Group's flagship annual volunteering programme.</p>

        {HIGHLIGHTS.map((h, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B3E", marginBottom: 12 }}>{h.title}</h2>
            <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7 }}>{h.text}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
