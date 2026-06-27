"use client";
import { useEffect } from "react";
import { useSettingsStore } from "../../store/settingsStore";

const PRESETS = {
  terracotta: {
    primary: "#C4622D",
    primaryHover: "#b54e22",
    background: "#F5F0E8",
    backgroundAlt: "#ede4d4",
    dark: "#2D2D2D",
    secondary: "#8FAF8A",
    btnBg: "#2D2D2D",
    btnText: "#F5F0E8",
    btnHover: "#C4622D",
    navBg: "#F5F0E8",
    footerBg: "#2D2D2D",
    footerText: "#F5F0E8",
  },
  midnight: {
    primary: "#4A6FA5",
    primaryHover: "#3a5a8f",
    background: "#F0F2F5",
    backgroundAlt: "#e2e6ed",
    dark: "#1a1a2e",
    secondary: "#7B9EA6",
    btnBg: "#1a1a2e",
    btnText: "#F0F2F5",
    btnHover: "#4A6FA5",
    navBg: "#F0F2F5",
    footerBg: "#1a1a2e",
    footerText: "#F0F2F5",
  },
  emerald: {
    primary: "#2D6A4F",
    primaryHover: "#1b4332",
    background: "#F4F9F4",
    backgroundAlt: "#e6f2e6",
    dark: "#1b2e1b",
    secondary: "#74C69D",
    btnBg: "#2D6A4F",
    btnText: "#F4F9F4",
    btnHover: "#1b4332",
    navBg: "#F4F9F4",
    footerBg: "#1b2e1b",
    footerText: "#F4F9F4",
  },
  rose: {
    primary: "#B5446E",
    primaryHover: "#9a3560",
    background: "#FDF4F7",
    backgroundAlt: "#f5e0e9",
    dark: "#2D1A21",
    secondary: "#D4A0B5",
    btnBg: "#B5446E",
    btnText: "#FDF4F7",
    btnHover: "#9a3560",
    navBg: "#FDF4F7",
    footerBg: "#2D1A21",
    footerText: "#FDF4F7",
  },
  charcoal: {
    primary: "#E0A458",
    primaryHover: "#c8904a",
    background: "#F5F5F5",
    backgroundAlt: "#ebebeb",
    dark: "#1C1C1C",
    secondary: "#A8A8A8",
    btnBg: "#1C1C1C",
    btnText: "#F5F5F5",
    btnHover: "#E0A458",
    navBg: "#F5F5F5",
    footerBg: "#1C1C1C",
    footerText: "#F5F5F5",
  },
  purple: {
    primary: "#7B2D8B",
    primaryHover: "#6a2478",
    background: "#F8F4FA",
    backgroundAlt: "#eedff5",
    dark: "#1D0D22",
    secondary: "#B088C0",
    btnBg: "#7B2D8B",
    btnText: "#F8F4FA",
    btnHover: "#6a2478",
    navBg: "#F8F4FA",
    footerBg: "#1D0D22",
    footerText: "#F8F4FA",
  },
  gold: {
    primary: "#B8860B",
    primaryHover: "#9a700a",
    background: "#FDFAF0",
    backgroundAlt: "#f5eed0",
    dark: "#2B2200",
    secondary: "#D4B483",
    btnBg: "#2B2200",
    btnText: "#FDFAF0",
    btnHover: "#B8860B",
    navBg: "#FDFAF0",
    footerBg: "#2B2200",
    footerText: "#FDFAF0",
  },
  blush: {
    primary: "#D4738A",
    primaryHover: "#be5e75",
    background: "#FDF6F8",
    backgroundAlt: "#f5e6ea",
    dark: "#2E1520",
    secondary: "#F0B8C4",
    btnBg: "#D4738A",
    btnText: "#FDF6F8",
    btnHover: "#be5e75",
    navBg: "#FDF6F8",
    footerBg: "#2E1520",
    footerText: "#FDF6F8",
  },
};

export default function ThemeProvider() {
  const { settings, fetch } = useSettingsStore();

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    const theme = settings?.theme;
    if (!theme) return;

    const preset = PRESETS[theme.preset || "terracotta"] || PRESETS.terracotta;
    const t = { ...preset, ...theme };

    const vars = {
      "--color-primary": t.primary || preset.primary,
      "--color-primary-hover": t.primaryHover || preset.primaryHover,
      "--color-primary-light": (t.primary || preset.primary) + "20",
      "--color-background": t.background || preset.background,
      "--color-background-alt": t.backgroundAlt || preset.backgroundAlt,
      "--color-secondary": t.secondary || preset.secondary,
      "--color-dark": t.dark || preset.dark,
      "--color-text-primary": t.textPrimary || preset.dark,
      "--color-text-secondary": t.textSecondary || "#6b6b6b",
      "--color-text-light": t.textLight || "#9a9a9a",
      "--color-nav-bg": t.navBg || preset.navBg,
      "--color-footer-bg": t.footerBg || preset.footerBg,
      "--color-footer-text": t.footerText || preset.footerText,
      "--color-btn-bg": t.btnBg || preset.btnBg,
      "--color-btn-text": t.btnText || preset.btnText,
      "--color-btn-hover-bg": t.btnHover || preset.btnHover,
      "--color-scrollbar": t.primary || preset.primary,
      "--border-radius": t.borderRadius || "0px",
      "--button-radius": t.buttonRadius || "0px",
      "--transition": t.transition || "300ms",
      "--font-display": t.fontDisplay || "'Cormorant Garamond', Georgia, serif",
      "--font-body": t.fontBody || "'DM Sans', sans-serif",
    };

    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));

    // Also set bg color on body to prevent flash
    document.body.style.backgroundColor = t.background || preset.background;
  }, [settings?.theme]);

  return null;
}
