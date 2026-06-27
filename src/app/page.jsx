"use client";
import { useEffect } from "react";
import { useSettingsStore } from "../store/settingsStore";
import Hero from "../components/home/Hero";
import TrustSection from "../components/home/TrustSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BrandStory from "../components/home/BrandStory";
import InstagramStrip from "../components/home/InstagramStrip";

const SECTION_MAP = {
  hero: Hero,
  trust: TrustSection,
  products: FeaturedProducts,
  brandstory: BrandStory,
  testimonials: TrustSection, // testimonials are rendered inside TrustSection
  instagram: InstagramStrip,
};

export default function HomePage() {
  const { settings, fetch } = useSettingsStore();
  useEffect(() => {
    fetch();
  }, []);

  // If settings loaded and homeSections defined, respect order + visibility
  const sections = settings?.homeSections;

  if (!sections || sections.length === 0) {
    // Default order before settings load
    return (
      <>
        <Hero />
        <TrustSection />
        <FeaturedProducts />
        <BrandStory />
        <InstagramStrip />
      </>
    );
  }

  // Deduplicate — TrustSection renders both trust badges AND testimonials
  const rendered = new Set();
  return (
    <>
      {[...sections]
        .sort((a, b) => a.order - b.order)
        .filter((s) => s.isVisible !== false)
        .map((section) => {
          // testimonials are inside TrustSection — skip separate render
          if (section.key === "testimonials") return null;
          const Component = SECTION_MAP[section.key];
          if (!Component || rendered.has(section.key)) return null;
          rendered.add(section.key);
          return <Component key={section.key} />;
        })}
    </>
  );
}
