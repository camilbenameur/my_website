// Background, newest first, as commits. Dates are the months of cv_latex CV-GUIDELINES.md §2 and
// profil/faits.toml: never widened. The gap between March and August 2026 is the absence of a commit;
// it is not explained and not hidden. The end of the Call To Action role has no stated reason.
// `branch: 'sri'` puts the internship and the fixed-term contract on one branch: the same product.

type T = { fr: string; en: string };

export type Commit = {
  hash: string;              // decorative, stable: the first 7 hex chars of a sha1 of the entry
  when: T;
  iso: string;               // start month, for <time>
  role: T;
  org: T;
  text: T;
  branch?: 'sri';
  tag?: T;
};

export const head = {
  fr: 'disponible immédiatement',
  en: 'available now',
};

export const commits: Commit[] = [
  {
    hash: 'c7a1f04',
    when: { fr: 'août à oct. 2026', en: 'Aug. to Oct. 2026' },
    iso: '2026-08',
    role: { fr: 'Data & AI Engineer, CDI', en: 'Data & AI Engineer, permanent role' },
    org: { fr: 'Call To Action (Bonum Group), Nice', en: 'Call To Action (Bonum Group), Nice' },
    text: {
      fr: 'Outils internes, données et déploiement automatisé. CDI terminé le 16 octobre 2026.',
      en: 'Internal tools, data and automated deployment. The role ended on 16 October 2026.',
    },
  },
  {
    hash: '5e2b9d1',
    when: { fr: 'oct. 2025 à mars 2026', en: 'Oct. 2025 to Mar. 2026' },
    iso: '2025-10',
    role: { fr: 'Software Engineer, CDD', en: 'Software Engineer, fixed-term contract' },
    org: { fr: 'Schneider Electric, Carros', en: 'Schneider Electric, Carros' },
    text: {
      fr: 'Responsable du SoftDPAC Remote Installer jusqu’à sa livraison en production. Outils d’IA internes et rôle de Copilot Champion.',
      en: 'Owned the SoftDPAC Remote Installer until it shipped to production. Internal AI tools and the Copilot Champion role.',
    },
    branch: 'sri',
    tag: { fr: 'livré en production', en: 'shipped to production' },
  },
  {
    hash: '9d04c3a',
    when: { fr: 'avr. à sept. 2025', en: 'Apr. to Sep. 2025' },
    iso: '2025-04',
    role: { fr: 'Software Engineer, stage', en: 'Software Engineer Intern' },
    org: { fr: 'Schneider Electric, Carros', en: 'Schneider Electric, Carros' },
    text: {
      fr: 'Conception du même installateur à partir de zéro, en Go et React, avec des exigences strictes de cybersécurité.',
      en: 'Designed the same installer from scratch, in Go and React, under strict cybersecurity requirements.',
    },
    branch: 'sri',
  },
  {
    hash: '3f8e6b2',
    when: { fr: '2020 à 2025', en: '2020 to 2025' },
    iso: '2020-09',
    role: { fr: 'Diplôme d’ingénieur et Master 2', en: 'Engineering degree and MSc' },
    org: { fr: 'Polytech Dijon et université de Bourgogne', en: 'Polytech Dijon and Université de Bourgogne' },
    text: {
      fr: 'Ingénieur en IA et développement logiciel (Polytech Dijon, 2025). Master 2 Bases de données et IA (université de Bourgogne, 2025).',
      en: 'Engineering degree in AI and software development (Polytech Dijon, 2025). MSc in Databases and AI (Université de Bourgogne, 2025).',
    },
  },
  {
    hash: 'a61d0e7',
    when: { fr: 'avr. à juin 2024', en: 'Apr. to Jun. 2024' },
    iso: '2024-04',
    role: { fr: 'Stage de laboratoire, vision par ordinateur', en: 'Lab intern, computer vision' },
    org: { fr: 'Universiti Teknologi PETRONAS, Malaisie', en: 'Universiti Teknologi PETRONAS, Malaysia' },
    text: {
      fr: 'Vision stéréo embarquée pour la capture 3D et la mesure de distance, calibration de caméras, détection d’objets en temps réel (YOLOv8).',
      en: 'Embedded stereovision for 3D capture and distance measurement, stereo camera calibration, real-time object detection (YOLOv8).',
    },
  },
];

export const extras = {
  languages: {
    label: { fr: 'Langues', en: 'Languages' },
    text: {
      fr: 'Français (langue maternelle), anglais (C1, TOEIC 910/990), espagnol (notions).',
      en: 'French (native), English (C1, TOEIC 910/990), Spanish (elementary).',
    },
  },
  certs: {
    label: { fr: 'Certifications', en: 'Certifications' },
    text: {
      fr: 'Advanced Golang Concepts, Software Design and Architecture Specialization.',
      en: 'Advanced Golang Concepts, Software Design and Architecture Specialization.',
    },
  },
};
