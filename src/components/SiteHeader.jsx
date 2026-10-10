import Ext from "./Ext";

// Floating pill nav. Below 640px it collapses to cb_ and Menu. ui.js owns the menu's `hidden`,
// aria-expanded and the current-section dot (aria-current); do not drive them from React state.
const sections = ["Projects", "Writing", "Experience", "Stack", "Contact"];

export default function SiteHeader() {
  return (
    <header className="pillbar">
      <nav className="pill" aria-label="Primary">
        <a className="mark" href="#top" aria-label="Camil Benameur, top of page">
          cb<span>_</span>
        </a>
        <ul className="pill__links">
          {sections.map((s) => (
            <li key={s}>
              <a href={"#" + s.toLowerCase()}>{s}</a>
            </li>
          ))}
        </ul>
        <div className="pill__end">
          <a className="pill__blog" href="https://blog.camilbenameur.com/">
            Blog
            <Ext />
          </a>
          <button className="icon-btn" type="button" data-theme-flip aria-label="Switch between dark and light theme">
            <svg className="i-moon" aria-hidden="true">
              <use href="#i-moon" />
            </svg>
            <svg className="i-sun" aria-hidden="true">
              <use href="#i-sun" />
            </svg>
          </button>
        </div>
        <button className="pill__menu" type="button" aria-expanded="false" aria-controls="menu">
          Menu
        </button>
      </nav>
      <div className="win menu" id="menu" hidden>
        <div className="win__bar" aria-hidden="true">
          <span className="dots">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span className="win__title">~/menu</span>
        </div>
        <ul>
          {sections.map((s) => (
            <li key={s}>
              <a href={"#" + s.toLowerCase()}>{s}</a>
            </li>
          ))}
          <li>
            <a href="https://blog.camilbenameur.com/">
              Blog
              <Ext />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
