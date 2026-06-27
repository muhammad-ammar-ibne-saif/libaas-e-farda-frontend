/**
 * Client-side brand config reader.
 * Reads from brand.config.js at project root via next.config.js env injection.
 * Use this everywhere instead of hardcoded brand values.
 */

export const brand = {
  name:        process.env.NEXT_PUBLIC_BRAND_NAME        || 'Libaas-e-Farda',
  tagline:     process.env.NEXT_PUBLIC_BRAND_TAGLINE     || "Dress the woman you're becoming.",
  shortName:   process.env.NEXT_PUBLIC_BRAND_SHORT       || 'LEF',
  urduName:    process.env.NEXT_PUBLIC_BRAND_URDU        || 'لباسِ فردا',
  logoImage:   process.env.NEXT_PUBLIC_LOGO_IMAGE        || null,
  logoWidth:   Number(process.env.NEXT_PUBLIC_LOGO_WIDTH)  || 140,
  logoHeight:  Number(process.env.NEXT_PUBLIC_LOGO_HEIGHT) || 40,
  whatsapp:    process.env.NEXT_PUBLIC_WHATSAPP          || '923001234567',
  email:       process.env.NEXT_PUBLIC_EMAIL             || 'hello@libaas-e-farda.com',
  instagram:   process.env.NEXT_PUBLIC_INSTAGRAM         || 'libaasefarda',
  currency:    process.env.NEXT_PUBLIC_CURRENCY          || 'Rs.',
  orderPrefix: process.env.NEXT_PUBLIC_ORDER_PREFIX      || 'LEF',
  colors: {
    primary:       process.env.NEXT_PUBLIC_COLOR_PRIMARY    || '#C4622D',
    background:    process.env.NEXT_PUBLIC_COLOR_BG         || '#F5F0E8',
    dark:          process.env.NEXT_PUBLIC_COLOR_DARK       || '#2D2D2D',
  },
};

export default brand;