import { lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";

// Below-the-fold sections are code-split so the hero paints first.
const SkillsSection = lazy(() => import("./components/SkillsSection"));
const ProjectsSection = lazy(() => import("./components/ProjectsSection"));
const ContactSection = lazy(() => import("./components/ContactSection"));

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-ink text-body">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
          </Suspense>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
