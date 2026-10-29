// Skills in three tables, never mixed (cv_latex CV-GUIDELINES.md §3, rule 2: what was not practised
// never sits with what was). Sources:
//   atWork   CV-GUIDELINES.md §2, « Compétences réellement pratiquées » and the technos of each role
//   public   public repositories and sites anyone can check
//   notYet   the gaps the fde-freelance synthesis lists and the sales site admits (« pas encore
//            d’expérience professionnelle sur AWS, Google Cloud ni Azure », « API d’Anthropic oui,
//            OpenAI et Google pas encore »). Shown as not practised, with the planned project when there is one.
// No language is attributed to the MCP server or the RAG agent (§2, poste 2).

type T = { fr: string; en: string };
type Row = { key: T; values: string[] | T };

export const skills: { id: string; title: T; note?: T; rows: Row[] }[] = [
  {
    id: 'en_entreprise',
    title: { fr: 'Pratiqué en entreprise', en: 'Used at work' },
    rows: [
      { key: { fr: 'ia_appliquee', en: 'applied_ai' }, values: { fr: 'serveur MCP sur mesure, agent RAG, revue de code assistée par IA, assistant local (Ollama, Open WebUI), vision par ordinateur (YOLOv8, en stage de laboratoire)', en: 'custom MCP server, RAG agent, AI-assisted code review, local assistant (Ollama, Open WebUI), computer vision (YOLOv8, during a lab internship)' } },
      { key: { fr: 'langages', en: 'languages' }, values: ['Go', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'Bash', 'PowerShell'] },
      { key: { fr: 'web_api', en: 'web_api' }, values: ['React', 'Next.js', 'FastAPI', 'REST', 'SSE', 'Tauri 2.0'] },
      { key: { fr: 'tests', en: 'tests' }, values: { fr: 'tests unitaires et d’intégration, Cypress de bout en bout', en: 'unit and integration tests, end-to-end Cypress' } },
      { key: { fr: 'ci_cd', en: 'ci_cd' }, values: ['GitHub Actions', 'Docker', 'Docker Compose', 'Podman'] },
      { key: { fr: 'securite', en: 'security' }, values: { fr: 'SSH par clés, PC isolés du réseau, écriture en base avec plan relu et retour arrière, secrets GitHub', en: 'key-based SSH, air-gapped PCs, database writes with a reviewed plan and rollback, GitHub secrets' } },
      { key: { fr: 'donnees', en: 'data' }, values: { fr: 'SQL Server, PostgreSQL, MariaDB, modélisation de bases (Master 2 Bases de données et IA)', en: 'SQL Server, PostgreSQL, MariaDB, database design (MSc in Databases and AI)' } },
      { key: { fr: 'systemes', en: 'systems' }, values: ['Linux (Debian, Ubuntu)', 'Windows'] },
      { key: { fr: 'architecture', en: 'architecture' }, values: { fr: 'architecture hexagonale', en: 'hexagonal architecture' } },
    ],
  },
  {
    id: 'projets_publics',
    title: { fr: 'Visible dans mes projets publics', en: 'Visible in my public projects' },
    rows: [
      { key: { fr: 'llm', en: 'llm' }, values: { fr: 'lecture de flux JSON de LLM, au format des événements d’OpenAI et d’Anthropic (go-llm-stream)', en: 'parsing streamed LLM JSON, in the event formats of OpenAI and Anthropic (go-llm-stream)' } },
      { key: { fr: 'qualite', en: 'quality' }, values: { fr: 'fuzzing, mesures publiées avec leurs limites', en: 'fuzzing, benchmarks published with their limits' } },
      { key: { fr: 'web', en: 'web' }, values: { fr: 'Astro, ce site et mon blog, mis en ligne sur Cloudflare', en: 'Astro, this site and my blog, deployed on Cloudflare' } },
    ],
  },
  {
    id: 'pas_encore',
    title: { fr: 'Pas encore pratiqué', en: 'Not used yet' },
    note: {
      fr: 'Pas encore d’expérience professionnelle sur AWS, Google Cloud ni Azure. J’ai utilisé l’API d’Anthropic sur des projets personnels, pas encore celles d’OpenAI et de Google. Les projets en préparation visent à en combler une partie.',
      en: 'No professional experience yet with AWS, Google Cloud or Azure. I have used Anthropic’s API on personal projects, not yet OpenAI’s or Google’s. The projects coming next aim to fill some of these gaps.',
    },
    rows: [
      { key: { fr: 'agents', en: 'agents' }, values: ['LangGraph'] },
      { key: { fr: 'api_llm', en: 'llm_apis' }, values: ['OpenAI', 'Gemini'] },
      { key: { fr: 'evaluation', en: 'evaluation' }, values: { fr: 'jeux de tests d’un agent, correcteur automatique comparé à une personne', en: 'agent test sets, automatic grader compared with a person' } },
      { key: { fr: 'tracage', en: 'tracing' }, values: { fr: 'OpenTelemetry, Langfuse, coût par réponse', en: 'OpenTelemetry, Langfuse, cost per answer' } },
      { key: { fr: 'cloud', en: 'cloud' }, values: ['AWS', 'Google Cloud', 'Azure', 'Terraform', 'Kubernetes'] },
    ],
  },
];
