const brand = require('./brand.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Inject all brand config values as NEXT_PUBLIC_ env vars
  // This means brand.config.js is the single source of truth
  env: {
    NEXT_PUBLIC_BRAND_NAME:      brand.name,
    NEXT_PUBLIC_BRAND_TAGLINE:   brand.tagline,
    NEXT_PUBLIC_BRAND_SHORT:     brand.shortName,
    NEXT_PUBLIC_BRAND_URDU:      brand.urduName,
    NEXT_PUBLIC_LOGO_IMAGE:      brand.logoImage  || '',
    NEXT_PUBLIC_LOGO_WIDTH:      String(brand.logoWidth  || 140),
    NEXT_PUBLIC_LOGO_HEIGHT:     String(brand.logoHeight || 40),
    NEXT_PUBLIC_WHATSAPP:        brand.whatsapp,
    NEXT_PUBLIC_EMAIL:           brand.email,
    NEXT_PUBLIC_INSTAGRAM:       brand.instagram,
    NEXT_PUBLIC_CURRENCY:        brand.currency,
    NEXT_PUBLIC_ORDER_PREFIX:    brand.orderPrefix,
    NEXT_PUBLIC_COLOR_PRIMARY:   brand.colors.primary,
    NEXT_PUBLIC_COLOR_BG:        brand.colors.background,
    NEXT_PUBLIC_COLOR_DARK:      brand.colors.dark,
    NEXT_PUBLIC_SEO_TITLE:       brand.seo.title,
    NEXT_PUBLIC_SEO_DESCRIPTION: brand.seo.description,
    NEXT_PUBLIC_ADMIN_EMAIL:     brand.adminEmail,
    NEXT_PUBLIC_GOOGLE_FONTS:    brand.googleFontsUrl,
  },
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'via.placeholder.com'],
  },
};

module.exports = nextConfig;