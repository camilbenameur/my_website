import Ext from "./Ext";
import { profile, projects } from "../data/content";

// One terminal window and two empty ghost windows behind it. The prompt, the `whoami` and
// `ls projects/` commands and the window title are interface chrome, not content: they are
// aria-hidden, and the projects listing is the same four targets as the Projects section.
// Chrome strings that are not site copy (they need Camil's yes): the command `whoami` and the
// window title `camil -- bash`.
function Prompt({ children }) {
  return (
    <p className="prompt" aria-hidden="true">
      <span className="u">camil@lyon</span>
      <span className="p">:~</span>
      <span className="d">$</span> {children}
    </p>
  );
}

function Dots() {
  return (
    <span className="dots">
      <i></i>
      <i></i>
      <i></i>
    </span>
  );
}

export default function Hero() {
  return (
    <section className="stage" id="top" aria-label="Introduction">
      <div className="frame">
        <div className="rig">
          <div className="win ghost ghost--2" aria-hidden="true">
            <div className="win__bar">
              <Dots />
            </div>
          </div>
          <div className="win ghost ghost--1" aria-hidden="true">
            <div className="win__bar">
              <Dots />
            </div>
          </div>

          <div className="win win--hero">
            <div className="win__bar win__bar--tall" aria-hidden="true">
              <Dots />
              <span className="win__title">camil -- bash</span>
            </div>

            <div className="term">
              <Prompt>
                <span className="cmd">whoami</span>
              </Prompt>
              <h1 className="display">{profile.name}</h1>
              <p className="lead">{profile.line}</p>
              <p className="ctx">{profile.context}</p>

              <Prompt>
                <span className="cmd">ls projects/</span>
              </Prompt>
              <ul className="ls" aria-label="Projects">
                {projects.map((p) => (
                  <li key={p.id}>
                    <a href={"#" + p.id}>{p.id}/</a>
                  </li>
                ))}
              </ul>
              <Prompt>
                <span className="cursor"></span>
              </Prompt>
            </div>

            <div className="toolbar">
              <a className="btn btn--primary" href="#contact">
                Contact
              </a>
              {profile.links.map((l) => (
                <a className="btn btn--ghost" href={l.href} key={l.href}>
                  {l.label}
                  <Ext />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
