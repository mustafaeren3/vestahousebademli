import Link from "next/link";

// Single source of truth for "does this section have a CTA to show at all",
// shared by every home_sections-driven component so a caller can decide
// whether to render a wrapping element (e.g. <Reveal>) around the button at
// all, instead of always mounting an empty animated wrapper.
export function sectionCtaVisible(section) {
  // cta_active is undefined (not false) for any row read before migration
  // 0010 adds the column -- treat "not set" as active so this never hides
  // an existing CTA before the migration has been applied.
  const active = section?.cta_active !== false;
  return Boolean(active && section?.cta_label && section?.cta_href);
}

// Shared CTA renderer for every home_sections-driven button (Hero, FeatureSplit,
// ClosingCta, HomeGallery, BlogTeaser). Centralizes the internal/external,
// new-tab, active/inactive and aria-label handling that used to be a bare
// `next/link` with no branching in each component -- so external URLs (e.g.
// a Google Maps or WhatsApp link typed into cta_href) now get a real `<a>`
// tag with `target`/`rel`, and an admin can hide a CTA by toggling cta_active
// without clearing its label/href.
export default function SectionCta({
  href,
  label,
  ariaLabel,
  isExternal = false,
  targetBlank = false,
  active = true,
  className,
  style,
}) {
  if (!active || !label || !href) return null;

  const linkProps = {
    className,
    style,
    "aria-label": ariaLabel || undefined,
    target: targetBlank ? "_blank" : undefined,
    rel: targetBlank ? "noreferrer noopener" : undefined,
  };

  if (isExternal) {
    return (
      <a href={href} {...linkProps}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} {...linkProps}>
      {label}
    </Link>
  );
}
