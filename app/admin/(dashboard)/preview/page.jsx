import PreviewFrame from "./PreviewFrame";

export const metadata = { title: "Canlı Önizleme" };

export default function PreviewPage() {
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
        Canlı Önizleme
      </h2>
      <p style={{ color: "var(--color-ink-soft)", fontSize: "0.9rem", marginBottom: 20 }}>
        Müşterilerin QR kodu okuttuklarında göreceği sayfanın birebir aynısı.
      </p>
      <PreviewFrame />
    </div>
  );
}
