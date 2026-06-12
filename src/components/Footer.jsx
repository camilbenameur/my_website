import { SiGithub, SiLinkedin } from "react-icons/si";
import { HiArrowUp } from "react-icons/hi";
import { profile, socials } from "../data/content";

const socialIcons = {
  github: SiGithub,
  linkedin: SiLinkedin,
};

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
        <p className="font-mono text-xs text-faint">
          © {currentYear} {profile.name} — {profile.location}
        </p>

        <p className="font-mono text-xs text-faint">
          React · Vite · Tailwind · Framer Motion
        </p>

        <div className="flex items-center gap-3">
          {socials.map((social) => {
            const Icon = socialIcons[social.id];
            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} profile`}
                className="flex h-11 w-11 items-center justify-center border border-line text-slate-300 transition-colors hover:border-accent hover:text-accent"
              >
                <Icon size={18} />
              </a>
            );
          })}
          <a
            href="#hero"
            aria-label="Back to top"
            className="flex h-11 w-11 items-center justify-center border border-accent/60 text-accent transition-colors hover:bg-accent hover:text-ink"
          >
            <HiArrowUp size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
