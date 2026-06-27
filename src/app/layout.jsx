import "./globals.css";
import ClientLayout from "../components/layout/ClientLayout";
import StoreHydration from "../components/ui/StoreHydration";
import ThemeProvider from "../components/ui/ThemeProvider";

export const metadata = {
  title: process.env.NEXT_PUBLIC_SEO_TITLE || "Libaas-e-Farda — Modest Fashion",
  description:
    process.env.NEXT_PUBLIC_SEO_DESCRIPTION ||
    "Dress the woman you're becoming.",
};

export default function RootLayout({ children }) {
  const googleFontsUrl =
    process.env.NEXT_PUBLIC_GOOGLE_FONTS ||
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={googleFontsUrl} rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <StoreHydration />
        <ThemeProvider />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
