import Footer from "@/components/layout/Footer";

const PRESS = [
  { date: "12 Mar 2025", title: "Tata Engage crosses 1 lakh active volunteers", source: "Tata Review" },
  { date: "28 Sep 2024", title: "TVW 2024: Record participation across 30 companies", source: "Economic Times" },
  { date: "15 Jun 2024", title: "ProEngage Season 8 launches with 320 NGO projects", source: "Business Standard" },
  { date: "02 Jan 2024", title: "Tata Engage wins Best CSR Platform at NASSCOM Awards", source: "NASSCOM" },
];

export default function MediaView() {
  return (
    <div style={{ paddingTop: 80, paddingBottom: 80, background: "#F8F9FB", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0D1B3E", marginBottom: 8 }}>Media & Press</h1>
        <p style={{ fontSize: 16, color: "#64748B", marginBottom: 40 }}>Latest news, press releases, and coverage about Tata Engage.</p>

        {PRESS.map((p, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>{p.date} · {p.source}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#0D1B3E" }}>{p.title}</div>
            </div>
            <span style={{ fontSize: 13, color: "#1E6ED4", fontWeight: 600, cursor: "pointer" }}>Read →</span>
          </div>
        ))}

        <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginTop: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B3E", marginBottom: 12 }}>Media Enquiries</h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7 }}>For press and media enquiries, contact <strong>media@tataengage.com</strong>.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
