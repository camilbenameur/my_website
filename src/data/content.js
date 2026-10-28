// Single source of truth for everything the site says.
// Components own how it looks; this file owns what it is.
// The wording below is the approved site copy, byte for byte. Do not add a claim that is not already in it.
// Camil's decision: the Call To Action role reads "Data & AI Engineer". It ended on 16 October 2026:
// never write it as current. Camil lives in Lyon (cv_latex/profil/referentiel.md is the source of truth).
// Page title, description and Open Graph tags live in index.html.

export const profile = {
  name: "Camil Benameur",
  line: "I'm a software engineer. I've built an offline installer for industrial PCs and a Go library for streamed LLM JSON.",
  context: "Lyon · graduated 2025",
  links: [
    { label: "GitHub", href: "https://github.com/camilbenameur" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/camil-benameur-14a762194/" },
    { label: "Blog", href: "https://blog.camilbenameur.com/" },
  ],
};

export const now = {
  // Update the caption whenever the text changes.
  caption: "October 2026",
  text: "I'm based in Lyon and available now. From August to October 2026, I worked at Call To Action (Bonum Group) in Nice on data operations and internal tools, including a guarded write tool for SQL Server, tested in CI against SQL Server 2019 and 2022, and the move of an internal app to Docker with GitHub Actions CI/CD.",
};

// Order is the order on the page and in the hero's `ls projects/` listing.
// `id` is the anchor, the window title (`<id>/`) and the listing entry.
// `span` is the card width in the 12-column grid (5, 6 or 7, from 1024px up).
// A card with a `link` lifts on hover; the others do not.
export const projects = [
  {
    id: "go-llm-stream",
    span: 7,
    name: "go-llm-stream",
    meta: ["Go", "MIT", "v1.3.0", "open source"],
    text: "A Go library that parses JSON while an LLM is still streaming it, and repairs it when the output is cut off or wrapped in markdown fences. Fields can be read as soon as they complete, and the parser's state can be saved and restored. The scanner and the repair step are fuzz-tested.",
    note: "It isn't faster than encoding/json's Decoder: in my June 2026 benchmark, the Decoder was 2 to 3 times faster per operation on chunked input. I'd use go-llm-stream for repair, early fields and resume.",
    install: "go get github.com/camilbenameur/go-llm-stream",
    link: { label: "Source", href: "https://github.com/camilbenameur/go-llm-stream" },
  },
  {
    id: "softdpac-remote-installer",
    span: 5,
    name: "SoftDPAC Remote Installer",
    mine: "I designed and built the first version from scratch as an intern at Schneider Electric, then owned it as an engineer until March 2026.",
    meta: ["Go", "React", "Tauri 2.0", "Cypress"],
    text: "A Go and React app for installing industrial automation software on air-gapped industrial PCs over SSH, with IP scanning and key-based authentication under strict cybersecurity requirements. It showed install progress live (SSE) and had a reactive fallback and retry for apt lock conflicts and dependency resolution. Containerized Python scripts packaged the app's own Windows installer (NSIS).",
    link: {
      label: "Write-up",
      href: "https://blog.camilbenameur.com/blog/from-backlog-to-offline-installer/",
    },
  },
  {
    id: "ai-tools-at-schneider-electric",
    span: 6,
    name: "AI tools at Schneider Electric",
    text: "I developed three AI tools as an engineer at Schneider Electric: a custom MCP (Model Context Protocol) server, a RAG agent over Confluence documentation and an AI code-review pipeline.",
    note: "They're internal systems.",
    also: "I was also a Copilot Champion (monthly AI best-practice sessions).",
  },
  {
    id: "embedded-stereovision",
    span: 6,
    name: "Embedded stereovision",
    meta: ["Lab internship", "Malaysia", "2024"],
    text: "I worked on an embedded stereovision system for 3D capture and distance measurement: stereo camera calibration and depth extraction, plus real-time image processing and object detection (YOLOv8).",
  },
];

// Hand-maintained: the CSP forbids fetching the blog feed from this page.
// Titles must equal the `title` of the posts' frontmatter in personal_blog
// (src/content/blog/*.md); `corrected` mirrors their `correction` block (2026-09-29).
// Newest first, like the blog archive.
//
// HARD GATE, release order: `corrected`, the retitled streaming post and the "Write-up" link are only
// true once the personal_blog build carrying the 2026-09-29 corrections is live. Both URLs answer 200
// before that, so a link check cannot catch it. Deploy the blog first, then check on the live site that
// /blog/on-streaming-optimization/ has the <title> "Streaming LLM JSON in Go: a Resumable Scanner and a
// Healer" and that both posts show the correction note. Only then deploy this site.
// `scripts/check-release-gate.mjs` makes that check: it runs before every CI build (`prebuild`) and
// fails the build while the live posts do not match this list. `npm run check:release` runs it by hand.
export const writing = [
  {
    date: { iso: "2026-02-05", label: "Feb 2026" },
    title: "From Backlog to MVP: Building an Offline Industrial Installer in Go",
    line: "The hardest part: installing a pinned Docker version offline, across Linux distributions. Also covers the hexagonal architecture in Go.",
    corrected: { iso: "2026-09", label: "Sep 2026" },
    href: "https://blog.camilbenameur.com/blog/from-backlog-to-offline-installer/",
  },
  {
    date: { iso: "2026-01-27", label: "Jan 2026" },
    title: "Streaming LLM JSON in Go: a Resumable Scanner and a Healer",
    line: "How the scanner resumes mid-stream and the healer repairs truncated output.",
    corrected: { iso: "2026-09", label: "Sep 2026" },
    href: "https://blog.camilbenameur.com/blog/on-streaming-optimization/",
  },
];

export const writingIndex = { label: "All posts", href: "https://blog.camilbenameur.com/" };

// One line per role, newest first. `to: null` means "present". Do not widen the dates.
export const experience = [
  {
    role: "Data & AI Engineer",
    org: "Call To Action (Bonum Group)",
    from: { iso: "2026-08", label: "Aug" },
    to: { iso: "2026-10", label: "Oct 2026" },
  },
  {
    role: "Software Engineer",
    org: "Schneider Electric",
    from: { iso: "2025-10", label: "Oct 2025" },
    to: { iso: "2026-03", label: "Mar 2026" },
  },
  {
    role: "Software Engineer Intern",
    org: "Schneider Electric",
    from: { iso: "2025-04", label: "Apr" },
    to: { iso: "2025-09", label: "Sep 2025" },
  },
  {
    role: "Lab Intern, Computer Vision",
    org: "Universiti Teknologi PETRONAS",
    from: { iso: "2024-04", label: "Apr" },
    to: { iso: "2024-06", label: "Jun 2024" },
  },
];

// Seven groups, 24 chips. Flat chips: no levels, no order meaning. A `note` sits under its group.
export const stack = [
  {
    label: "Languages",
    items: ["Go", "Python", "JavaScript", "Bash"],
    note: "Java and C/C++: academic basics.",
  },
  {
    label: "AI",
    items: ["LLM agents", "RAG", "MCP server development", "Computer vision (CNN, YOLOv8)"],
  },
  {
    label: "Web & APIs",
    items: ["React", "Tailwind CSS", "REST", "SSE", "WebSockets"],
  },
  {
    label: "Architecture",
    items: ["Hexagonal architecture", "Tauri 2.0"],
  },
  {
    label: "Systems",
    items: ["Linux (Debian, Ubuntu)", "Docker", "Podman", "Git", "GitHub Actions"],
  },
  {
    label: "Testing",
    items: ["Cypress", "Unit & integration tests"],
  },
  {
    label: "Data",
    items: ["SQL", "Database design"],
    note: "Master's in Databases & AI.",
  },
];

export const contact = {
  sentence: "Questions or feedback: send me a message.",
};
