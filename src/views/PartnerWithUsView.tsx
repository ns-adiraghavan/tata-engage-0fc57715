import Footer from "@/components/layout/Footer";

const BENEFITS = [
  "Access to 1,20,000+ skilled Tata Group volunteers",
  "End-to-end project management support on the platform",
  "Skill-based matching for specialised consulting needs",
  "Visibility across 30+ Tata companies",
];

export default function PartnerWithUsView() {
  return (
    <div style={{ paddingTop: 80, paddingBottom: 80, background: "#F8F9FB", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0D1B3E", marginBottom: 8 }}>Partner With Us</h1>
        <p style={{ fontSize: 16, color: "#64748B", marginBottom: 40 }}>Join 850+ NGOs leveraging the Tata volunteer network to amplify social impact.</p>

        <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B3E", marginBottom: 12 }}>Why Partner?</h2>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            {BENEFITS.map((b, i) => (
              <li key={i} style={{ fontSize: 15, color: "#475569", lineHeight: 2 }}>{b}</li>
            ))}
          </ul>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B3E", marginBottom: 12 }}>How to Get Started</h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7 }}>Register as an NGO on Tata Engage, complete your organisation profile, and submit a project brief. Our team reviews applications within 5 working days.</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0D1B3E", marginBottom: 12 }}>Contact</h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7 }}>For partnership enquiries, reach out to <strong>partnerships@tataengage.com</strong> or call <strong>+91 22 6665 8282</strong>.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
