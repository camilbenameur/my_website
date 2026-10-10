import { Fragment } from "react";
import SectionBar from "./SectionBar";
import Ext from "./Ext";
import { projects } from "../data/content";

// `go get github.com/camilbenameur/go-llm-stream`: a line break is allowed after each slash,
// the last segment never breaks.
function InstallLine({ command }) {
  const parts = command.split("/");
  const last = parts.pop();
  return (
    <code>
      <span className="d" aria-hidden="true">
        ${" "}
      </span>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part + "/"}
          <wbr />
        </Fragment>
      ))}
      <span className="nw">{last}</span>
    </code>
  );
}

function Card({ project: p }) {
  const titleId = "h-" + p.id;
  const hasHead = Boolean(p.mine || p.meta);
  const heading = (
    <h3 className="h3" id={titleId}>
      {p.name}
    </h3>
  );
  return (
    <article
      className={`win card${p.link ? " card--link" : ""} card--${p.span}`}
      id={p.id}
      aria-labelledby={titleId}
    >
      <div className="win__bar" aria-hidden="true">
        <span className="dots">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span className="win__title">{p.id}/</span>
      </div>
      <div className="card__body">
        {hasHead ? (
          <div className="card__head">
            {heading}
            {p.mine && <p className="mine">{p.mine}</p>}
            {p.meta && (
              <div className="meta">
                {p.meta.map((m) => (
                  <span className="tag" key={m}>
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          heading
        )}
        <p>{p.text}</p>
        {p.note && (
          <p className="note">
            <span className="note__sl" aria-hidden="true">
              {"//"}
            </span>
            <span>{p.note}</span>
          </p>
        )}
        {p.also && <p>{p.also}</p>}
        {p.install && (
          <div className="install">
            <InstallLine command={p.install} />
            {/* ui.js flips the label and announces "Copied" through its own hidden status region:
                a live region inside a button is not read (button children are presentational). */}
            <button className="copy" type="button" aria-label="Copy install command" data-copy={p.install}>
              <span className="copy__label">copy</span>
            </button>
          </div>
        )}
        {p.link && (
          <div className="card__links">
            <a className="link" href={p.link.href}>
              {p.link.label}
              <Ext />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  return (
    <section className="sec" id="projects" aria-labelledby="h-projects">
      <SectionBar path="~/projects" />
      <h2 className="h2" id="h-projects">
        Projects
      </h2>
      <div className="grid">
        {projects.map((p) => (
          <Card project={p} key={p.id} />
        ))}
      </div>
    </section>
  );
}
