// Everything the site says outside the projects, the background and the skills. Components own how
// it looks; this file owns what it is. Every text has a French and an English version.
//
// Facts come from cv_latex (CLAUDE.md rules 1 and 2, CV-GUIDELINES.md §0 and §2, profil/) and, for the
// AI engineer / Forward Deployed Engineer direction, from fde-freelance/00-LIRE-EN-PREMIER.md.
// English wording follows cv_latex/templates/cv-en.tex. Rules for visible copy (scripts/check-content.mjs
// enforces the mechanical ones):
//   - no seniority words (expert, senior, confirmé, lead as a title, plusieurs années, experienced…);
//   - Lyon as home; Call To Action is a past job, its end has no stated reason; no phone number;
//   - "en production" only for the SoftDPAC Remote Installer;
//   - the freelance activity is being prepared and does not exist yet: no offer, no price;
//   - no em or en dashes; plain words for a non-technical reader first.
// Self-contained on purpose (no imports): Node scripts import this file directly.

export type Lang = 'fr' | 'en';
export type T = { fr: string; en: string };

export const site = {
  name: 'Camil Benameur',
  origin: 'https://camilbenameur.com',
  title: { fr: 'Camil Benameur, ingénieur IA à Lyon', en: 'Camil Benameur, AI engineer in Lyon' },
  description: {
    fr: 'Ingénieur IA à Lyon, diplômé en 2025. J’ai conçu et livré en production un installateur de logiciels industriels chez Schneider Electric.',
    en: 'AI engineer in Lyon, France, graduated in 2025. I designed an installer for industrial software at Schneider Electric and shipped it to production.',
  },
  jobTitle: { fr: 'Ingénieur IA', en: 'AI engineer' },
  links: {
    linkedin: 'https://www.linkedin.com/in/camil-benameur-14a762194/',
    github: 'https://github.com/camilbenameur',
    blog: { fr: 'https://blog.camilbenameur.com/fr/', en: 'https://blog.camilbenameur.com/' },
    goLlmStream: 'https://github.com/camilbenameur/go-llm-stream',
  },
  // FormSubmit alias (a random string, not the address): public by design, it is in the page anyway.
  // Messages go to Camil's inbox. FormSubmit activates per domain: a new hostname needs activation.
  form: {
    ajax: 'https://formsubmit.co/ajax/a2c7757fb99f8962d7547dc71c911fe6',
    post: 'https://formsubmit.co/a2c7757fb99f8962d7547dc71c911fe6',
  },
};

// Routes per language. `alt` is the same page in the other language (hreflang, language switch).
export const routes = {
  home: { fr: '/', en: '/en/' },
  legal: { fr: '/mentions/', en: '/en/legal/' },
  thanks: { fr: '/merci/', en: '/en/thanks/' },
  project: { fr: '/projets/', en: '/en/projects/' },
};

export const ui = {
  skip: { fr: 'Aller au contenu', en: 'Skip to content' },
  navLabel: { fr: 'Navigation principale', en: 'Main navigation' },
  menu: { fr: 'Menu', en: 'Menu' },
  close: { fr: 'Fermer', en: 'Close' },
  langSwitch: { fr: 'English', en: 'Français' },
  langSwitchShort: { fr: 'EN', en: 'FR' },
  langSwitchLabel: { fr: 'English version', en: 'version française' },
  terminal: { fr: 'Terminal', en: 'Terminal' },
  terminalHint: { fr: 'Ouvrir le terminal (touche /)', en: 'Open the terminal (/ key)' },
  newTab: { fr: '(nouvel onglet)', en: '(new tab)' },
  back: { fr: 'Retour à l’accueil', en: 'Back to the home page' },
  status: {
    pro: { fr: 'En entreprise', en: 'At work' },
    public: { fr: 'Public', en: 'Public' },
    prive: { fr: 'Privé, sur demande', en: 'Private, on request' },
    prevu: { fr: 'Prévu', en: 'Planned' },
  },
  flag: {
    pro: { fr: 'entreprise', en: 'work' },
    public: { fr: 'public', en: 'public' },
    prive: { fr: 'privé', en: 'private' },
    prevu: { fr: 'prévu', en: 'planned' },
  },
};

export const nav = [
  { id: 'realisations', en: 'work', label: { fr: 'Réalisations', en: 'Work' } },
  { id: 'parcours', en: 'background', label: { fr: 'Parcours', en: 'Background' } },
  { id: 'competences', en: 'skills', label: { fr: 'Compétences', en: 'Skills' } },
  { id: 'ecrits', en: 'writing', label: { fr: 'Écrits', en: 'Writing' } },
  { id: 'contact', en: 'contact', label: { fr: 'Contact', en: 'Contact' } },
];

export const hero = {
  command: 'whoami',
  title: { fr: ['Camil Benameur,', 'ingénieur IA.'], en: ['Camil Benameur,', 'AI engineer.'] },
  lead: {
    fr: 'Chez Schneider Electric, en stage puis en CDD (12 mois), j’ai conçu et livré en production un installateur de logiciels industriels, et j’y ai développé des outils d’IA internes. Je cherche un poste d’ingénieur IA ou de Forward Deployed Engineer, pour créer des outils d’IA avec les équipes qui s’en servent.',
    en: 'At Schneider Electric, on an internship then a fixed-term contract (12 months), I designed an installer for industrial software and shipped it to production, and I built internal AI tools there. I am looking for an AI engineer or Forward Deployed Engineer role, building AI tools with the teams who use them.',
  },
  // The phrase of the lead that the stream underlines when its field completes.
  mark: { fr: 'livré en production', en: 'shipped it to production' },
  primary: { fr: 'Voir mes réalisations', en: 'See my work' },
  secondary: { fr: 'Me contacter', en: 'Contact me' },
  status: { fr: 'Lyon · diplômé en 2025 · disponible immédiatement', en: 'Lyon, France · graduated in 2025 · available now' },
};

// The hero's terminal: the profile arrives as a stream, like an LLM answer, and is cut before the
// end; the browser closes the open string and brackets (the principle of go-llm-stream's healer).
// It is a replay in the visitor's browser, not a model call: the window says so.
export const stream = {
  tab: 'profil.json',
  tabEn: 'profile.json',
  label: { fr: 'démo', en: 'demo' },
  command: { fr: 'cat profil.json | stream --heal', en: 'cat profile.json | stream --heal' },
  // Keys and values of the JSON, in order. `cut` is where the stream stops: a planned project, so the
  // truncation never suggests a skill that is not there yet.
  fr: {
    nom: 'Camil Benameur',
    role: 'ingénieur IA',
    ville: 'Lyon',
    cherche: ['ingénieur IA', 'Forward Deployed Engineer'],
    experience: [
      { chez: 'Schneider Electric', mois: 12, produit: 'SoftDPAC Remote Installer', statut: 'livré en production' },
      { chez: 'Call To Action', de: '2026-08', a: '2026-10' },
    ],
    ia: ['serveur MCP', 'agent RAG', 'revue de code assistée'],
    prochain: ['agent LangGraph', 'banc d’évaluation'],
  },
  en: {
    name: 'Camil Benameur',
    role: 'AI engineer',
    city: 'Lyon',
    looking_for: ['AI engineer', 'Forward Deployed Engineer'],
    experience: [
      { at: 'Schneider Electric', months: 12, product: 'SoftDPAC Remote Installer', status: 'shipped to production' },
      { at: 'Call To Action', from: '2026-08', to: '2026-10' },
    ],
    ai: ['MCP server', 'RAG agent', 'AI-assisted code review'],
    next: ['LangGraph agent', 'evaluation bench'],
  },
  cutAt: { fr: 'banc d’év', en: 'evaluation b' },
  foot: {
    fr: 'Démo rejouée dans votre navigateur, avec ses propres durées. Le texte est coupé exprès en plein mot, puis ses guillemets et crochets sont refermés, comme le fait ma bibliothèque go-llm-stream.',
    en: 'Demo replayed in your browser, with its own timings. The text is cut off mid-word on purpose, then its quotes and brackets are closed, as my go-llm-stream library does.',
  },
  replay: { fr: 'relancer', en: 'replay' },
  // WCAG 2.2.2: the stream keeps moving at rest and the cursors blink; this stops both.
  pause: { fr: 'pause', en: 'pause' },
  resume: { fr: 'reprendre', en: 'resume' },
  chunks: { fr: 'morceaux', en: 'chunks' },
  healed: { fr: 'JSON refermé', en: 'JSON closed' },
};

// One command per section, then a plain title. The command is decoration; the title is the heading.
export const sections = {
  work: {
    command: { fr: 'ls -l realisations/', en: 'ls -l work/' },
    title: { fr: 'Réalisations', en: 'Work' },
    intro: {
      fr: 'Chaque réalisation porte son statut : en entreprise, publique ou privée. Les projets prévus sont plus bas, à part.',
      en: 'Each item shows its status: done at work, public or private. Planned projects are listed separately, further down.',
    },
  },
  background: {
    command: { fr: 'git log --parcours', en: 'git log --background' },
    title: { fr: 'Parcours', en: 'Background' },
    intro: {
      fr: 'Diplômé en 2025. Douze mois chez Schneider Electric sur un même produit, du stage au CDD (avril 2025 à mars 2026), puis environ deux mois chez Call To Action (août à octobre 2026).',
      en: 'Graduated in 2025. Twelve months at Schneider Electric on one product, from internship to fixed-term contract (April 2025 to March 2026), then about two months at Call To Action (August to October 2026).',
    },
  },
  skills: {
    command: { fr: 'cat competences.toml', en: 'cat skills.toml' },
    title: { fr: 'Compétences', en: 'Skills' },
    intro: {
      fr: 'Trois tables : ce que j’ai pratiqué en entreprise, ce que montrent mes projets publics, et ce que je n’ai pas encore pratiqué.',
      en: 'Three tables: what I used at work, what my public projects show, and what I have not used yet.',
    },
  },
  planned: {
    command: { fr: 'cat ROADMAP.md', en: 'cat ROADMAP.md' },
    title: { fr: 'En préparation', en: 'Coming next' },
    intro: {
      fr: 'Les projets que je prévois de construire ensuite, en public. Aucun n’existe encore : une case sera cochée, avec un lien, quand le projet sera en ligne.',
      en: 'The projects I plan to build next, in public. None of them exists yet: a box gets ticked, with a link, when the project is online.',
    },
  },
  writing: {
    command: { fr: 'ls -t blog/', en: 'ls -t blog/' },
    title: { fr: 'Écrits', en: 'Writing' },
    intro: {
      fr: 'J’écris sur ce que j’ai construit, et je signale en tête d’article ce que j’ai corrigé.',
      en: 'I write about what I built, and I flag at the top of a post what I corrected.',
    },
    all: { fr: 'Tous les articles', en: 'All posts' },
    corrected: { fr: 'corrigé le', en: 'corrected on' },
  },
  contact: {
    command: { fr: './contact.sh', en: './contact.sh' },
    title: { fr: 'Contact', en: 'Contact' },
    intro: {
      fr: 'Un poste, une question ou une remarque sur un projet : écrivez-moi, je réponds par écrit.',
      en: 'A role, a question or a comment on a project: write to me, I answer in writing.',
    },
    freelance: {
      fr: 'Je prépare aussi une activité d’ingénieur IA indépendant. Elle n’existe pas encore.',
      en: 'I am also preparing a freelance AI engineering activity. It does not exist yet.',
    },
  },
};

export const form = {
  name: { fr: 'Nom', en: 'Name' },
  email: { fr: 'E-mail', en: 'Email' },
  message: { fr: 'Message', en: 'Message' },
  send: { fr: 'Envoyer', en: 'Send' },
  sending: { fr: 'Envoi…', en: 'Sending…' },
  sent: { fr: 'Message envoyé. Merci, je vous réponds par écrit.', en: 'Message sent. Thank you, I will answer in writing.' },
  failed: {
    fr: 'Le message n’est pas parti. Réessayez, ou écrivez-moi sur LinkedIn.',
    en: 'The message was not sent. Try again, or write to me on LinkedIn.',
  },
  errors: {
    name: { fr: 'Indiquez votre nom.', en: 'Enter your name.' },
    email: { fr: 'Indiquez une adresse e-mail valide.', en: 'Enter a valid email address.' },
    message: { fr: 'Écrivez votre message.', en: 'Write your message.' },
  },
  subject: { fr: 'Message depuis camilbenameur.com', en: 'Message from camilbenameur.com' },
  privacy: {
    fr: 'FormSubmit (formsubmit.co) me transmet votre message par e-mail. Je m’en sers seulement pour vous répondre, et je le garde 12 mois au plus après notre dernier échange. Vous pouvez demander à le consulter, le corriger ou le supprimer en m’écrivant par ce formulaire.',
    en: 'FormSubmit (formsubmit.co) forwards your message to me by email. I use it only to answer you, and I keep it for 12 months at most after our last exchange. You can ask to see, correct or delete it by writing to me through this form.',
  },
  privacyLink: { fr: 'Confidentialité', en: 'Privacy' },
};

export const footer = {
  links: { fr: 'Liens', en: 'Links' },
  legal: { fr: 'Mentions légales et confidentialité', en: 'Legal notice and privacy' },
  colophon: {
    fr: 'Site statique fait avec Astro et GSAP. Aucun cookie, aucune mesure d’audience.',
    en: 'Static site built with Astro and GSAP. No cookies, no analytics.',
  },
  keys: { fr: 'Raccourcis', en: 'Shortcuts' },
  keysOn: { fr: 'activés', en: 'on' },
  keysOff: { fr: 'désactivés', en: 'off' },
  keysHint: { fr: '/ terminal · g GitHub · b blog · c contact', en: '/ terminal · g GitHub · b blog · c contact' },
  keysToggleOn: { fr: 'Activer les raccourcis clavier', en: 'Turn keyboard shortcuts on' },
  keysToggleOff: { fr: 'Désactiver les raccourcis clavier', en: 'Turn keyboard shortcuts off' },
};

export const legal = {
  title: { fr: 'Mentions légales et confidentialité', en: 'Legal notice and privacy' },
  description: {
    fr: 'Éditeur, hébergeur et traitement des messages envoyés par le formulaire de camilbenameur.com.',
    en: 'Publisher, host and handling of the messages sent through the camilbenameur.com form.',
  },
  blocks: [
    {
      h: { fr: 'Éditeur', en: 'Publisher' },
      p: {
        fr: 'Camil Benameur, particulier, à Lyon. Ce site personnel ne vend rien. Pour me joindre, utilisez le formulaire de la page d’accueil.',
        en: 'Camil Benameur, a private individual based in Lyon, France. This personal site sells nothing. To reach me, use the form on the home page.',
      },
    },
    {
      h: { fr: 'Hébergeur', en: 'Host' },
      p: {
        fr: 'Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis.',
        en: 'Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, United States.',
      },
    },
    {
      h: { fr: 'Messages du formulaire', en: 'Messages sent through the form' },
      p: {
        fr: 'Le formulaire recueille votre nom, votre adresse e-mail et votre message. Le service FormSubmit (formsubmit.co) me les transmet par e-mail. Je m’en sers seulement pour vous répondre : la base légale est mon intérêt légitime à répondre à ceux qui m’écrivent. Je les garde 12 mois au plus après notre dernier échange, puis je les supprime de ma messagerie. En dehors de FormSubmit, qui sert de relais, et de mon fournisseur de messagerie, qui les conserve, personne d’autre que moi n’y a accès.',
        en: 'The form collects your name, your email address and your message. The FormSubmit service (formsubmit.co) forwards them to me by email. I use them only to answer you: the legal basis is my legitimate interest in replying to people who write to me. I keep them for 12 months at most after our last exchange, then delete them from my mailbox. Apart from FormSubmit, which relays them, and my email provider, which stores them, nobody but me has access to them.',
      },
    },
    {
      h: { fr: 'Vos droits', en: 'Your rights' },
      p: {
        fr: 'Vous pouvez demander à consulter, corriger ou supprimer vos données, ou vous opposer à leur usage, en m’écrivant par le formulaire. Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr).',
        en: 'You can ask to see, correct or delete your data, or object to its use, by writing to me through the form. You can also complain to the French data protection authority, the CNIL (cnil.fr).',
      },
    },
    {
      h: { fr: 'Cookies et stockage', en: 'Cookies and storage' },
      p: {
        fr: 'Aucun cookie et aucune mesure d’audience. Si vous désactivez les raccourcis clavier, ce choix est gardé dans votre navigateur (stockage local), et nulle part ailleurs.',
        en: 'No cookies and no analytics. If you turn the keyboard shortcuts off, that choice is kept in your browser (local storage), and nowhere else.',
      },
    },
  ],
};

export const thanks = {
  title: { fr: 'Message envoyé', en: 'Message sent' },
  text: { fr: 'Merci. Je vous réponds par écrit.', en: 'Thank you. I will answer in writing.' },
};

export const notFound = {
  title: { fr: 'Page introuvable', en: 'Page not found' },
  description: { fr: 'Cette adresse ne mène à aucune page du site de Camil Benameur.', en: 'This address leads to no page of Camil Benameur’s site.' },
  text: {
    fr: 'Cette adresse ne mène à aucune page. Voici celles qui existent :',
    en: 'This address leads to no page. Here are the ones that exist:',
  },
};

// The mini terminal (« / »). Answers are short and true; `go` links point at real anchors and pages.
export const shell = {
  title: { fr: 'Terminal', en: 'Terminal' },
  label: { fr: 'Commande', en: 'Command' },
  intro: {
    fr: 'Tapez help pour la liste des commandes, Échap pour fermer.',
    en: 'Type help for the list of commands, Escape to close.',
  },
  unknown: { fr: 'commande introuvable. Tapez help.', en: 'command not found. Type help.' },
  sudo: {
    fr: 'camil n’est pas dans le fichier sudoers. Cet incident sera signalé.',
    en: 'camil is not in the sudoers file. This incident will be reported.',
  },
  cv: {
    fr: 'Mon CV en PDF contient mon numéro de téléphone : je l’envoie sur demande. Tapez contact.',
    en: 'My PDF résumé carries my phone number, so I send it on request. Type contact.',
  },
  keysOff: { fr: 'Raccourcis clavier désactivés.', en: 'Keyboard shortcuts turned off.' },
  keysOn: { fr: 'Raccourcis clavier activés.', en: 'Keyboard shortcuts turned on.' },
  help: {
    fr: [
      ['realisations', 'les projets'],
      ['parcours', 'les postes et la formation'],
      ['competences', 'ce que je sais faire, et ce qui manque'],
      ['ecrits', 'les articles du blog'],
      ['contact', 'le formulaire'],
      ['whoami', 'qui je suis'],
      ['cv', 'mon CV'],
      ['github, linkedin, blog', 'mes liens'],
      ['en', 'this site in English'],
      ['raccourcis off | on', 'désactiver ou activer les raccourcis'],
      ['clear, exit', 'effacer, fermer'],
    ],
    en: [
      ['work', 'the projects'],
      ['background', 'jobs and education'],
      ['skills', 'what I can do, and what is missing'],
      ['writing', 'the blog posts'],
      ['contact', 'the form'],
      ['whoami', 'who I am'],
      ['cv', 'my résumé'],
      ['github, linkedin, blog', 'my links'],
      ['fr', 'ce site en français'],
      ['shortcuts off | on', 'turn the shortcuts off or on'],
      ['clear, exit', 'clear, close'],
    ],
  },
  whoami: {
    fr: 'Camil Benameur, ingénieur IA à Lyon, diplômé en 2025. Disponible immédiatement.',
    en: 'Camil Benameur, AI engineer in Lyon, France, graduated in 2025. Available now.',
  },
};
