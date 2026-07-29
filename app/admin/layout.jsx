import { Inter } from "next/font/google";
import "@/app/(site)/globals.css";
import "./admin.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Yönetim Paneli | Vesta House Bademli",
    template: "%s | Vesta Yönetim Paneli",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="admin-body">{children}</body>
    </html>
  );
}
