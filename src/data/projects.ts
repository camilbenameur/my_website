// The projects, one entry each. Adding a project = adding an entry here; the home list, the project
// page (when `page` is set), the sitemap and the terminal's `realisations` command read this list.
//
// Statuses (the same as fde-site's proof registry):
//   pro     done at work, attested in cv_latex CV-GUIDELINES.md §2 (exact status words only)
//   public  code or text anyone can read: `href` is required
//   prive   exists, shown on request: never a link to a private repository
//   prevu   planned, not built: no date until Camil commits to one, never shown as done
// When a planned project ships: change its status to `public`, add `href`, and move it out of `planned`.
//
// Sources: cv_latex CV-GUIDELINES.md §2 (postes 1 à 3) and templates/cv-en.tex; go-llm-stream README;
// fde-site src/data/site.ts (`proofs`, synced); fde-freelance specs (planned projects).
// Never: lightning (abandoned), knowledge_map (former employer's property), Claude Code by name,
// "en production" for anything but the SoftDPAC Remote Installer.

export type Status = 'pro' | 'public' | 'prive' | 'prevu';
type T = { fr: string; en: string };

export type Project = {
  slug: string;
  name: T;
  status: Status;
  where: T;
  line: T;              // one sentence for the list
  href?: string;        // a public link (required for `public`)
  page?: {
    lead: T;
    blocks: { h: T; items: T[] }[];
    stack: string[];
    limit: T;
    links?: { label: T; href: string }[];
  };
};

export const projects: Project[] = [
  {
    slug: 'softdpac-remote-installer',
    name: { fr: 'SoftDPAC Remote Installer', en: 'SoftDPAC Remote Installer' },
    status: 'pro',
    where: { fr: 'Schneider Electric · avril 2025 à mars 2026', en: 'Schneider Electric · April 2025 to March 2026' },
    line: {
      fr: 'Application Go et React qui installe des logiciels d’automatisation industrielle sur des PC coupés du réseau, par SSH. Livrée en production.',
      en: 'A Go and React application that installs industrial automation software on air-gapped industrial PCs over SSH. Shipped to production.',
    },
    page: {
      lead: {
        fr: 'Je l’ai conçu à partir de zéro pendant mon stage, puis j’en ai été responsable en CDD jusqu’à sa livraison en production : douze mois sur le même produit.',
        en: 'I designed it from scratch during my internship, then owned it on a fixed-term contract until it shipped to production: twelve months on the same product.',
      },
      blocks: [
        {
          h: { fr: 'Le problème', en: 'The problem' },
          items: [
            {
              fr: 'Les logiciels d’automatisation industrielle doivent s’installer sur des PC industriels isolés du réseau (air-gapped), avec des exigences strictes de cybersécurité.',
              en: 'Industrial automation software has to be installed on industrial PCs cut off from the network (air-gapped), under strict cybersecurity requirements.',
            },
          ],
        },
        {
          h: { fr: 'En stage, d’avril à septembre 2025', en: 'Internship, April to September 2025' },
          items: [
            { fr: 'Conception de l’application à partir de zéro, en Go et React.', en: 'Designed and built the application from scratch, in Go and React.' },
            { fr: 'Déploiement par SSH, scan d’adresses IP et authentification par clés.', en: 'Deployment over SSH, IP scanning and key-based authentication.' },
            { fr: 'Un environnement de test complet en conteneurs (Docker, Podman), avec des scénarios de bout en bout Cypress.', en: 'A complete containerized test environment (Docker, Podman), with end-to-end Cypress scenarios.' },
            { fr: 'Une équipe Agile SAFe : revues de code et programmation en binôme.', en: 'An Agile SAFe team: code reviews and pair programming.' },
          ],
        },
        {
          h: { fr: 'En CDD, d’octobre 2025 à mars 2026', en: 'Fixed-term contract, October 2025 to March 2026' },
          items: [
            { fr: 'Responsable du produit de bout en bout, jusqu’à sa livraison en production.', en: 'End-to-end ownership of the product, until it shipped to production.' },
            { fr: 'Suivi de l’installation en direct (SSE), avec nouvelle tentative quand le verrou apt est pris et solutions de repli pour installer les paquets.', en: 'Live installation progress (SSE), with retry when the apt lock is taken and fallbacks when installing packages.' },
            { fr: 'Scripts de build Python en conteneurs, qui produisent un installateur Windows (NSIS, généré avec Tauri 2.0).', en: 'Containerized Python build scripts that package a Windows installer (NSIS, generated with Tauri 2.0).' },
            { fr: 'Tests unitaires et d’intégration.', en: 'Unit and integration tests.' },
          ],
        },
        {
          h: { fr: 'Ce que ça change', en: 'What it changed' },
          items: [
            {
              fr: 'Selon mon estimation, qui n’est pas une mesure, installer un PC prenait environ une à deux heures à la main, et environ quinze minutes avec l’outil.',
              en: 'By my estimate, which is not a measurement, installing one PC took about one to two hours by hand, and about fifteen minutes with the tool.',
            },
          ],
        },
      ],
      stack: ['Go', 'React', 'Tauri 2.0', 'SSH', 'SSE', 'Python', 'Docker', 'Podman', 'Cypress', 'NSIS'],
      limit: {
        fr: 'Code propriétaire de Schneider Electric : les articles décrivent l’architecture, sans le code.',
        en: 'Schneider Electric’s proprietary code: the posts describe the architecture, not the code.',
      },
      links: [
        { label: { fr: 'Comment fonctionne l’installateur (article)', en: 'How the installer works (post)' }, href: 'https://blog.camilbenameur.com/{lang}blog/offline-installer-retrospective/' },
        { label: { fr: 'Du backlog au MVP (article)', en: 'From backlog to MVP (post)' }, href: 'https://blog.camilbenameur.com/{lang}blog/from-backlog-to-offline-installer/' },
      ],
    },
  },
  {
    slug: 'outils-ia-schneider-electric',
    name: { fr: 'Outils d’IA internes', en: 'Internal AI tools' },
    status: 'pro',
    where: { fr: 'Schneider Electric · octobre 2025 à mars 2026', en: 'Schneider Electric · October 2025 to March 2026' },
    line: {
      fr: 'Un serveur MCP sur mesure, un agent RAG sur la documentation Confluence et une revue de code assistée par IA.',
      en: 'A custom MCP server, a RAG agent over Confluence documentation and an AI code-review pipeline.',
    },
    page: {
      lead: {
        fr: 'En CDD chez Schneider Electric, j’ai développé trois outils d’IA internes et animé des sessions de bonnes pratiques. Le serveur MCP et l’agent RAG n’ont été ni mis en production ni adoptés.',
        en: 'On my fixed-term contract at Schneider Electric, I built three internal AI tools and led best-practice sessions. The MCP server and the RAG agent were neither put into production nor adopted.',
      },
      blocks: [
        {
          h: { fr: 'Ce que j’ai développé', en: 'What I built' },
          items: [
            {
              fr: 'Un serveur MCP sur mesure pour EAE, un logiciel d’automatisation industrielle. MCP (Model Context Protocol) est le protocole qui relie un assistant IA à des outils et à des données.',
              en: 'A custom MCP server for EAE, an industrial automation software. MCP (Model Context Protocol) is the protocol that connects an AI assistant to tools and data.',
            },
            {
              fr: 'Un agent LLM qui retrouve le contexte utile dans la documentation Confluence (RAG).',
              en: 'An LLM agent that retrieves the relevant context from Confluence documentation (RAG).',
            },
            {
              fr: 'Une chaîne de revue de code assistée par IA, avec des consignes préparées (préprompts).',
              en: 'An AI code-review pipeline, with prepared instructions (preprompting).',
            },
          ],
        },
        {
          h: { fr: 'Transmettre', en: 'Sharing it' },
          items: [
            {
              fr: '« Copilot Champion » : des sessions mensuelles de bonnes pratiques sur le développement assisté par IA.',
              en: '“Copilot Champion”: monthly best-practice sessions on AI-assisted development.',
            },
          ],
        },
      ],
      stack: ['MCP', 'RAG', 'LLM', 'Confluence'],
      limit: {
        fr: 'Systèmes internes de Schneider Electric : je ne peux pas les montrer.',
        en: 'Schneider Electric’s internal systems: I cannot show them.',
      },
    },
  },
  {
    slug: 'outils-internes-call-to-action',
    name: { fr: 'Outils internes et déploiement', en: 'Internal tools and deployment' },
    status: 'pro',
    where: { fr: 'Call To Action · août à octobre 2026', en: 'Call To Action · August to October 2026' },
    line: {
      fr: 'Écriture encadrée dans une base SQL Server (testée en bac à sable), applications passées en conteneurs, déploiement automatisé (CI/CD).',
      en: 'Guarded writes to a SQL Server database (tested in a sandbox), applications moved to containers, automated deployment (CI/CD).',
    },
    page: {
      lead: {
        fr: 'J’ai été Data & AI Engineer en CDI chez Call To Action (Bonum Group), à Nice, de mi-août au 16 octobre 2026, sur des outils internes, des données et le déploiement de ces outils.',
        en: 'I was a Data & AI Engineer on a permanent contract at Call To Action (Bonum Group), in Nice, from mid-August to 16 October 2026, working on internal tools, data and the deployment of those tools.',
      },
      blocks: [
        {
          h: { fr: 'Écriture encadrée sous SQL Server', en: 'Guarded writes on SQL Server' },
          items: [
            {
              fr: 'Un outil Python, testé en bac à sable (environnement d’essai), qui modifie la base par lots courts, avec un plan relu avant exécution et un retour arrière possible. Il a 15 garde-fous testés automatiquement, avec une intégration continue GitHub Actions sur SQL Server 2019 et 2022.',
              en: 'A Python tool, tested in a sandbox (a trial environment), that changes the database in short batches, with a plan reviewed before it runs and a possible rollback. It has 15 safeguards tested automatically, with GitHub Actions continuous integration on SQL Server 2019 and 2022.',
            },
          ],
        },
        {
          h: { fr: 'Applications en conteneurs', en: 'Applications in containers' },
          items: [
            {
              fr: 'Callytics : le backend FastAPI et le frontend Next.js passés sous Docker, à côté de l’instance en service ; CI/CD GitHub Actions (lint, build, secrets) ; scripts de déploiement et de retour arrière sur le serveur.',
              en: 'Callytics: the FastAPI backend and Next.js frontend moved to Docker, alongside the running instance; GitHub Actions CI/CD (linting, build, secrets); deployment and rollback scripts on the server.',
            },
            {
              fr: 'StatsLive, repris en binôme avec un collègue : refactoring, CI/CD GitHub Actions rétablie (lint, tests, build, secrets ; 6 jobs), contrôle de session central sur les routes d’API, image Docker et déploiement automatisé sur le serveur.',
              en: 'StatsLive, taken over with a colleague: refactoring, GitHub Actions CI/CD back to green (linting, tests, build, secrets; 6 jobs), central session check on the API routes, Docker image and automated deployment to the server.',
            },
          ],
        },
        {
          h: { fr: 'Outils de l’équipe informatique', en: 'Tools for the IT team' },
          items: [
            {
              fr: 'Redmine 6.1 auto-hébergé : outils de ticketing comparés, puis kit de déploiement en conteneurs (Docker Compose, PostgreSQL, thème sur mesure), sauvegarde restaurée, recette de 10 contrôles. Déployé et recetté, pas encore ouvert à toute l’équipe. Projet mené à plusieurs ; le kit est le mien.',
              en: 'Self-hosted Redmine 6.1: ticketing tools compared, then a container deployment kit (Docker Compose, PostgreSQL, custom theme), a restored backup, a 10-point acceptance run. Deployed and accepted, not yet open to the whole team. A team project; the kit is mine.',
            },
            {
              fr: 'Un prototype de supervision (Next.js, React, TypeScript, en conteneur Docker) : une maquette fonctionnelle avec 48 indicateurs codés.',
              en: 'A monitoring prototype (Next.js, React, TypeScript, in a Docker container): a working mock-up with 48 indicators coded.',
            },
            {
              fr: 'Un assistant IA local (Open WebUI, Ollama, RAG sur la base de connaissances), installé sur le réseau local et destiné à l’équipe informatique. Je n’ai pas de relevé de son usage.',
              en: 'A local AI assistant (Open WebUI, Ollama, RAG over the knowledge base), installed on the local network for the IT team. I have no record of its use.',
            },
            {
              fr: 'Une base de connaissances du système d’information pour les agents de code : environ 120 fichiers Markdown, avec des scanners Python en lecture seule.',
              en: 'A knowledge base of the information system for coding agents: about 120 Markdown files, with read-only Python scanners.',
            },
          ],
        },
      ],
      stack: ['Python', 'SQL Server', 'PostgreSQL', 'FastAPI', 'Next.js', 'TypeScript', 'Docker', 'Docker Compose', 'GitHub Actions', 'Redmine', 'Ollama', 'Open WebUI'],
      limit: {
        fr: 'Ces outils internes, je ne peux pas les montrer.',
        en: 'I cannot show these internal tools.',
      },
    },
  },
  {
    slug: 'go-llm-stream',
    name: { fr: 'go-llm-stream', en: 'go-llm-stream' },
    status: 'public',
    where: { fr: 'GitHub · licence MIT · v1.3.0', en: 'GitHub · MIT licence · v1.3.0' },
    line: {
      fr: 'Bibliothèque Go qui lit le JSON d’un LLM pendant qu’il s’écrit, et le répare quand la réponse est coupée.',
      en: 'A Go library that parses an LLM’s JSON while it is still streaming, and repairs it when the answer is cut off.',
    },
    href: 'https://github.com/camilbenameur/go-llm-stream',
    page: {
      lead: {
        fr: 'Une bibliothèque open source en Go, pour lire le JSON qu’un modèle de langage envoie morceau par morceau.',
        en: 'An open-source Go library, for reading the JSON a language model sends piece by piece.',
      },
      blocks: [
        {
          h: { fr: 'Ce qu’elle fait', en: 'What it does' },
          items: [
            { fr: 'Chaque champ est utilisable dès qu’il est complet, sans attendre la fin de la réponse.', en: 'Each field can be used as soon as it is complete, without waiting for the end of the answer.' },
            { fr: 'Quand la réponse est coupée ou entourée de balises Markdown, elle la répare : chaînes, listes et objets ouverts sont refermés.', en: 'When the answer is cut off or wrapped in markdown fences, it repairs it: open strings, arrays and objects are closed.' },
            { fr: 'L’état de lecture peut être sauvegardé, puis repris après une reconnexion.', en: 'The parser state can be saved, then resumed after a reconnect.' },
            { fr: 'Elle lit les flux au format d’OpenAI comme d’Anthropic.', en: 'It reads OpenAI-shaped and Anthropic-shaped streams.' },
          ],
        },
        {
          h: { fr: 'Fiabilité', en: 'Reliability' },
          items: [
            { fr: 'Le scanner et la réparation sont testés par fuzzing et recoupés avec encoding/json.Valid.', en: 'The scanner and the repair step are fuzz-tested and cross-checked against encoding/json.Valid.' },
          ],
        },
        {
          h: { fr: 'Ce qu’elle ne fait pas', en: 'What it does not do' },
          items: [
            {
              fr: 'Dans mon banc d’essai de juin 2026, le Decoder de la bibliothèque standard était 2 à 3 fois plus rapide qu’elle par opération, sur des entrées découpées.',
              en: 'In my June 2026 benchmark, the standard library’s Decoder was 2 to 3 times faster than go-llm-stream per operation, on chunked input.',
            },
          ],
        },
      ],
      stack: ['Go', 'fuzzing', 'MIT'],
      limit: {
        fr: 'Les mesures et leur méthode sont publiées dans le dépôt, y compris celles qui ne sont pas à son avantage.',
        en: 'The benchmarks and their method are published in the repository, including the ones that do not favour it.',
      },
      links: [
        { label: { fr: 'Code source sur GitHub', en: 'Source code on GitHub' }, href: 'https://github.com/camilbenameur/go-llm-stream' },
        { label: { fr: 'Le scanner reprenable et le Healer (article)', en: 'The resumable scanner and the healer (post)' }, href: 'https://blog.camilbenameur.com/{lang}blog/on-streaming-optimization/' },
      ],
    },
  },
  {
    slug: 'chaine-de-donnees-publiques',
    name: { fr: 'Chaîne de données publiques', en: 'Public data pipeline' },
    status: 'prive',
    where: { fr: 'Projet personnel · oct. 2026', en: 'Personal project · Oct. 2026' },
    line: {
      fr: 'Croise le registre des entreprises (API Sirene) et une base de lieux (Overture Maps), puis audite des sites en respectant robots.txt. 1 191 tests.',
      en: 'Joins the French business register (Sirene API) with a places dataset (Overture Maps), then audits websites while respecting robots.txt. 1,191 tests.',
    },
  },
];

// Planned projects: from the fde-freelance specs (02, 03, 04, 05, 09), the same five as fde-site's
// `prevu` proofs. Not built. A spec is not a project.
export const planned: { text: T }[] = [
  { text: { fr: 'Un agent LangGraph avec validation humaine, testé par de vrais utilisateurs, et sa version sans framework pour comparer.', en: 'A LangGraph agent with human approval, tested by real users, and a framework-free version to compare.' } },
  { text: { fr: 'Un banc d’évaluation public : 100 cas étiquetés à la main, un correcteur automatique comparé à une personne, des marges d’erreur.', en: 'A public evaluation bench: 100 hand-labelled cases, an automatic grader compared with a person, error margins.' } },
  { text: { fr: 'Le journal des traitements de l’agent, avec son coût par réponse acceptée.', en: 'The agent’s trace log, with its cost per accepted answer.' } },
  { text: { fr: 'La même série de tests passée sur Anthropic, OpenAI, Gemini et un modèle local.', en: 'The same test set run on Anthropic, OpenAI, Gemini and a local model.' } },
  { text: { fr: 'Un déploiement sur Google Cloud Run décrit en code (Terraform), avec identité fédérée, budget et arrêt d’urgence.', en: 'A Google Cloud Run deployment described as code (Terraform), with federated identity, a budget and a kill switch.' } },
];
