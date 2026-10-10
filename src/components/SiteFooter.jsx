// Status-bar footer, identical on both sites (same markup as the blog's SiteFooter.astro).
// The Contact failure message points to these three links, so they must stay.
// keys.js owns .keys[hidden], .keys__hint[hidden] and the aria-pressed / aria-keyshortcuts
// attributes; theme.js owns the aria-pressed of the theme buttons.
export default function SiteFooter() {
  return (
    <footer className="status">
      <div className="status__in">
        <span>© 2026 Camil Benameur</span>
        <nav className="status__links" aria-label="Elsewhere">
          <a href="https://github.com/camilbenameur" data-key-link="g">
            GitHub
          </a>
          <span aria-hidden="true">·</span>
          <a href="https://www.linkedin.com/in/camil-benameur-14a762194/">LinkedIn</a>
          <span aria-hidden="true">·</span>
          <a href="https://blog.camilbenameur.com/" data-key-link="b">
            Blog
          </a>
        </nav>
        <div className="status__right">
          <span className="keys" role="group" aria-label="Keyboard shortcuts" hidden>
            keys:{" "}
            <span className="keys__hint">
              <kbd>g</kbd>GitHub · <kbd>b</kbd>Blog · <kbd>c</kbd>Contact
            </span>
            <span className="keys__set">
              <button type="button" data-keys-set="on" aria-pressed="true">
                on
              </button>
              <button type="button" data-keys-set="off" aria-pressed="false">
                off
              </button>
            </span>
          </span>
          <span className="theme" role="group" aria-label="Theme">
            theme:{" "}
            <button type="button" data-set-theme="dark" aria-pressed="true">
              dark
            </button>
            <button type="button" data-set-theme="light" aria-pressed="false">
              light
            </button>
            <button type="button" data-set-theme="system" aria-pressed="false">
              system
            </button>
          </span>
        </div>
      </div>
    </footer>
  );
}
