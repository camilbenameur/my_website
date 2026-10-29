// Blog posts, newest first. Hand-maintained: this page must not depend on the blog at build time.
// `title` must equal the post's <title> prefix on blog.camilbenameur.com, in each language, and
// `corrected` mirrors its correction note (date of the `correction` block in personal_blog).
// scripts/check-release-gate.mjs checks both against the live blog: deploy the blog first.
// Self-contained on purpose (no imports): the release gate imports this file directly.

type T = { fr: string; en: string };

export type Post = {
  slug: string;
  date: { iso: string; label: T };
  title: T;
  line: T;
  corrected?: { iso: string; label: T };
};

export const blogOrigin = 'https://blog.camilbenameur.com';
export const postUrl = (slug: string, lang: 'fr' | 'en') => `${blogOrigin}/${lang === 'fr' ? 'fr/' : ''}blog/${slug}/`;

export const posts: Post[] = [
  {
    slug: 'offline-installer-retrospective',
    date: { iso: '2026-10-14', label: { fr: '14 oct. 2026', en: '14 Oct 2026' } },
    title: {
      fr: 'Comment fonctionne un installateur hors ligne, et ce que j’ai surdimensionné en chemin',
      en: 'How an Offline Installer Works, and What I Over-Built Along the Way',
    },
    line: {
      fr: 'Du déploiement par SSH au relais de paquets hors ligne, et ce que je changerais aujourd’hui.',
      en: 'From SSH deployment to the offline package relay, and what I would change today.',
    },
  },
  {
    slug: 'from-backlog-to-offline-installer',
    date: { iso: '2026-02-05', label: { fr: '5 févr. 2026', en: '5 Feb 2026' } },
    title: {
      fr: 'Du backlog au MVP : construire un installateur industriel hors ligne en Go',
      en: 'From Backlog to MVP: Building an Offline Industrial Installer in Go',
    },
    line: {
      fr: 'Installer Docker sans Internet à partir de paquets .deb, avec la version 27.5.1 par défaut.',
      en: 'Installing Docker offline from .deb packages, with version 27.5.1 as the default.',
    },
    corrected: { iso: '2026-10-14', label: { fr: '14 oct. 2026', en: '14 Oct 2026' } },
  },
  {
    slug: 'on-streaming-optimization',
    date: { iso: '2026-01-27', label: { fr: '27 janv. 2026', en: '27 Jan 2026' } },
    title: {
      fr: 'Streaming de JSON de LLM en Go : un scanner reprenable et un Healer',
      en: 'Streaming LLM JSON in Go: a Resumable Scanner and a Healer',
    },
    line: {
      fr: 'Lire la réponse d’un modèle pendant qu’elle arrive, et réparer une réponse coupée.',
      en: 'Reading a model’s answer while it arrives, and repairing an answer that was cut off.',
    },
    corrected: { iso: '2026-09-29', label: { fr: '29 sept. 2026', en: '29 Sep 2026' } },
  },
];
