# لباسِ فردا — Libaas-e-Farda

> *Dress the woman you're becoming.*

A custom-built, production-grade ecommerce platform for Pakistan's premier modest fashion brand.
Built with Next.js 14, Tailwind CSS v3, Zustand, and Framer Motion.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14 (App Router)             |
| Styling    | Tailwind CSS v3                     |
| State      | Zustand (cart + wishlist)           |
| Animations | Framer Motion + CSS animations      |
| Fonts      | Cormorant Garamond + DM Sans + Noto Nastaliq Urdu |
| Hosting    | Vercel (recommended)                |

---

## Pages

| Route            | Description                          |
|------------------|--------------------------------------|
| `/`              | Homepage (hero, products, story)     |
| `/shop`          | Collection with filters & sorting    |
| `/shop/[slug]`   | Product detail page                  |
| `/checkout`      | 2-step checkout (details + payment)  |
| `/orders`        | Order tracking                       |
| `/wishlist`      | Saved products                       |
| `/about`         | Brand story                          |
| `/size-guide`    | Size measurements table              |

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

---

## Next Steps to Connect Backend

1. Replace `/src/data/products.js` with API calls to your Express/MongoDB backend
2. Add `.env.local` with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
   ```
3. Wire checkout to your Order model (POST /api/orders)
4. Integrate JazzCash / Easypaisa payment APIs
5. Add courier API (TCS / Leopards) for tracking

---

## Brand Colors

| Token          | Hex       | Usage                    |
|----------------|-----------|--------------------------|
| Terracotta 500 | #C4622D   | Primary CTA, accents     |
| Ivory 100      | #F5F0E8   | Background               |
| Sage 300       | #8FAF8A   | Success states           |
| Charcoal       | #2D2D2D   | Text, dark surfaces      |

---

Built by SR Innovations for Libaas-e-Farda © 2026
