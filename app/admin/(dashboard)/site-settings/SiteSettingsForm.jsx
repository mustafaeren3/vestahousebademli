"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateSiteSettings, uploadSiteImage } from "@/lib/settings/actions";
import ImageUploader from "@/components/admin/ImageUploader";

export default function SiteSettingsForm({ initialSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const fields = Object.fromEntries(formData.entries());

    try {
      await updateSiteSettings(fields);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError("Ayarlar kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setPending(false);
    }
  }

  async function handleLogoUpload(file) {
    const formData = new FormData();
    formData.set("image", file);
    await uploadSiteImage("logo", formData);
    router.refresh();
  }

  async function handleFaviconUpload(file) {
    const formData = new FormData();
    formData.set("image", file);
    await uploadSiteImage("favicon", formData);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      {error && (
        <div className="admin-error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}
      {success && (
        <div className="admin-success" style={{ marginBottom: 16 }}>
          Ayarlar kaydedildi.
        </div>
      )}

      <h3 style={{ fontSize: "1rem", marginBottom: 12 }}>Logo &amp; Favicon</h3>
      <div className="admin-field">
        <label>Logo (Footer&apos;da görünür)</label>
        <ImageUploader imageUrl={settings.logo_path} onUpload={handleLogoUpload} />
      </div>
      <div className="admin-field">
        <label>Favicon &amp; Menü Simgesi</label>
        <ImageUploader imageUrl={settings.favicon_path} onUpload={handleFaviconUpload} />
      </div>

      <h3 style={{ fontSize: "1rem", marginTop: 28, marginBottom: 12 }}>Genel</h3>
      <div className="admin-field">
        <label htmlFor="name">Site Adı</label>
        <input id="name" name="name" type="text" defaultValue={settings.name} required />
      </div>
      <div className="admin-field">
        <label htmlFor="tagline">Slogan</label>
        <input id="tagline" name="tagline" type="text" defaultValue={settings.tagline} />
      </div>

      <h3 style={{ fontSize: "1rem", marginTop: 28, marginBottom: 12 }}>İletişim</h3>
      <div className="admin-field">
        <label htmlFor="phone">Telefon</label>
        <input id="phone" name="phone" type="text" defaultValue={settings.phone} />
      </div>
      <div className="admin-field">
        <label htmlFor="whatsapp">WhatsApp Bağlantısı</label>
        <input id="whatsapp" name="whatsapp" type="text" defaultValue={settings.whatsapp} />
      </div>
      <div className="admin-field">
        <label htmlFor="email">E-posta</label>
        <input id="email" name="email" type="email" defaultValue={settings.email} />
      </div>
      <div className="admin-field">
        <label htmlFor="address_line1">Adres</label>
        <input
          id="address_line1"
          name="address_line1"
          type="text"
          defaultValue={settings.address_line1}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="address_district">İlçe / İl</label>
        <input
          id="address_district"
          name="address_district"
          type="text"
          defaultValue={settings.address_district}
        />
      </div>

      <h3 style={{ fontSize: "1rem", marginTop: 28, marginBottom: 12 }}>Sosyal &amp; Harita</h3>
      <div className="admin-field">
        <label htmlFor="instagram">Instagram Bağlantısı</label>
        <input id="instagram" name="instagram" type="text" defaultValue={settings.instagram} />
      </div>
      <div className="admin-field">
        <label htmlFor="facebook">Facebook Bağlantısı</label>
        <input id="facebook" name="facebook" type="text" defaultValue={settings.facebook} />
      </div>
      <div className="admin-field">
        <label htmlFor="google_maps_url">Google Haritalar Bağlantısı</label>
        <input
          id="google_maps_url"
          name="google_maps_url"
          type="text"
          defaultValue={settings.google_maps_url}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="google_business_url">Google İşletme Profili Bağlantısı</label>
        <input
          id="google_business_url"
          name="google_business_url"
          type="text"
          defaultValue={settings.google_business_url}
        />
      </div>

      <h3 style={{ fontSize: "1rem", marginTop: 28, marginBottom: 12 }}>Alt Bilgi (Footer)</h3>
      <div className="admin-field">
        <label htmlFor="copyright_text">Telif Metni</label>
        <input
          id="copyright_text"
          name="copyright_text"
          type="text"
          defaultValue={settings.copyright_text}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="footer_text">Footer Metni</label>
        <input id="footer_text" name="footer_text" type="text" defaultValue={settings.footer_text} />
      </div>

      <button type="submit" className="admin-btn admin-btn--primary" disabled={pending}>
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}
