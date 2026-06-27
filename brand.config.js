const brand = {
  // ── Identity ────────────────────────────────────────────────
  name:        'Libaas-e-Farda',          // Full brand name
  tagline:     'Dress the woman you\'re becoming.',
  shortName:   'LEF',                      // Used in order numbers e.g. LEF-000001
  urduName:    'لباسِ فردا',               // Shown in navbar/footer (leave empty to hide)

  // ── Logo ────────────────────────────────────────────────────
  // Set logoImage to a URL or path like '/logo.png' to show an image logo.
  // If null or empty, falls back to showing urduName (if set) or name as text.
  logoImage:   null,                       // e.g. '/logo.png' or 'https://...'
  logoWidth:   140,                        // px — controls image width
  logoHeight:  40,                         // px — controls image height

  // ── Colours ─────────────────────────────────────────────────
  colors: {
    primary:        '#C4622D',             // Main accent — buttons, links, badges
    primaryHover:   '#b54e22',             // Hover state of primary
    background:     '#F5F0E8',             // Main page background
    backgroundAlt:  '#ede4d4',             // Cards, dropdowns, alt sections
    dark:           '#2D2D2D',             // Footer, dark sections, headings
    secondary:      '#8FAF8A',             // Sage green — secondary accents
    textPrimary:    '#2D2D2D',             // Body text
    textSecondary:  '#6b6b6b',             // Muted text
    textLight:      '#9a9a9a',             // Placeholder, labels
    navBg:          '#F5F0E8',             // Navbar background
    footerBg:       '#2D2D2D',             // Footer background
    footerText:     '#F5F0E8',             // Footer text colour
    btnBg:          '#2D2D2D',             // Button background (main CTA)
    btnText:        '#F5F0E8',             // Button text
    btnHover:       '#C4622D',             // Button hover background
  },

  // ── Typography ───────────────────────────────────────────────
  fonts: {
    display:  "'Cormorant Garamond', Georgia, serif",    // Headings, hero
    body:     "'DM Sans', sans-serif",                    // Body text, UI
    mono:     "'JetBrains Mono', monospace",              // Code, order numbers
  },
  // Google Fonts URL — update if you change fonts above
  googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap',

  // ── Contact & Social ─────────────────────────────────────────
  whatsapp:   '923180617788',              // No + sign, with country code
  email:      'hello@libaas-e-farda.com',
  instagram:  'libaasefarda',
  facebook:   '',
  tiktok:     '',

  // ── SEO ──────────────────────────────────────────────────────
  seo: {
    title:       'Libaas-e-Farda — Modest Fashion for the Ambitious Pakistani Woman',
    description: "Dress the woman you're becoming. Modest workwear, co-ord sets, and everyday pieces.",
    keywords:    'modest fashion, Pakistani women, kurta, co-ord sets',
    ogImage:     '',
  },

  // ── Admin ─────────────────────────────────────────────────────
  adminEmail:  'admin@libaas-e-farda.com',

  // ── Order Number Prefix ───────────────────────────────────────
  orderPrefix: 'LEF',                      

  // ── Currency ─────────────────────────────────────────────────
  currency:    'Rs.',
  currencyCode:'PKR',
};

module.exports = brand;