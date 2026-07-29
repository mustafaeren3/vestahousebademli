import PasswordForm from "./PasswordForm";

export const metadata = { title: "Ayarlar" };

export default function SettingsPage() {
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
        Şifre Değiştir
      </h2>
      <PasswordForm />
    </div>
  );
}
