import Icons from "./components/Icons";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Hero from "./components/Hero";
import NowSection from "./components/NowSection";
import ProjectsSection from "./components/ProjectsSection";
import WritingSection from "./components/WritingSection";
import ExperienceSection from "./components/ExperienceSection";
import StackSection from "./components/StackSection";
import ContactSection from "./components/ContactSection";

function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Icons />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Hero />
        <div className="frame">
          <NowSection />
          <ProjectsSection />
          <WritingSection />
          <ExperienceSection />
          <StackSection />
          <ContactSection />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export default App;
