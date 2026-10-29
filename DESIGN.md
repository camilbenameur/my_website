# DESIGN : camilbenameur.com, « Le flux »

Portfolio de Camil Benameur, ingénieur IA, orientation Forward Deployed Engineer. Refonte d'octobre 2026 : le SPA Vite et React devient un site Astro statique, dont tout le texte est dans le HTML. Le contenu est dans `src/data/`, les règles d'écriture en tête de `src/data/site.ts`.

## Brief

- **Sujet.** Camil, ingénieur logiciel diplômé en 2025, à Lyon. Douze mois chez Schneider Electric sur un même produit, du stage au CDD, puis environ deux mois de CDI chez Call To Action, terminé le 16/10/2026.
- **Public.**
  - D'abord, des recruteurs pour des postes d'ingénieur IA ou de Forward Deployed Engineer, dont des recruteurs RH non techniques.
  - Ensuite, les équipes techniques qui le recevront en entretien.
- **Rôle du site.** Faire comprendre en cinq secondes qui il est, ce qu'il a livré et ce qu'il cherche, puis faire écrire.
- **Ce que le site n'est pas.** Un site de vente : pas d'offre, pas de prix. L'activité indépendante tient en une phrase : « en préparation, pas encore créée ».
- **Sources de vérité.**
  - `cv_latex` (`CLAUDE.md` règles 1 et 2, `CV-GUIDELINES.md` §0 et §2, `profil/`) ;
  - le README de go-llm-stream ;
  - le blog ;
  - pour les projets prévus, les specs de `fde-freelance`.

## Concept

```
Idée :        Le site se lit comme le terminal d'un ingénieur IA. Au premier écran, mon profil arrive
              en flux comme la réponse d'un LLM, lu champ par champ, coupé, puis réparé.
Métaphore :   Le terminal et la sortie en flux d'un modèle de langage.
Signature :   Le JSON du profil qui arrive par morceaux : chaque champ complet s'allume d'une coche,
              la réponse est coupée sur un projet prévu, puis réparée. C'est exactement ce que fait
              go-llm-stream, la bibliothèque publique de Camil.
Émotion :     Le calme d'un terminal qui répond, avec un clin d'œil de bidouilleur.
Verbe :       Taper, puis exécuter.
Capture :     Le titre en clair à gauche, le terminal du flux réparé à droite.
```

Pourquoi ce concept : Camil a rejeté la trame Jacquard le 29/10/2026, parce qu'on ne la comprend pas au premier abord. Il veut un thème tiré de ce qui le passionne (le développement, l'IA, la bidouille), pas de Lyon. Le flux s'appuie sur un fait vérifiable, sa bibliothèque go-llm-stream, et ne peut pas servir à quelqu'un d'autre tel quel.

Le concept se retrouve jusqu'au bout du site :
- chaque section est une commande et sa sortie (`ls -l realisations/`, `git log --parcours`, `cat competences.toml`, `cat ROADMAP.md`, `ls -t blog/`, `./contact.sh`) ;
- un mini-terminal s'ouvre avec la touche `/` ;
- la page 404 répond `bash: cd: … No such file or directory` ;
- le pied de page se ferme sur `exit`.

## Système

- **Couleurs** (`src/styles/tokens.css`, contrastes sur le fond en commentaire). Sombre uniquement.
  - Fond `#0B0D11`, encre `#E7E9EE`.
  - Codes ANSI à rôle fixe :
    - vert `#7BE0A4` : invite, réussite, action principale ;
    - bleu `#8AB4FF` : chemins, liens, réalisations en entreprise ;
    - jaune `#E5C07B` : privé ;
    - magenta `#E8A0D0` : réparation ;
    - rouge `#FF8A8A` : erreurs et coupure ;
    - gris : prévu.
- **Polices.** Geist (texte et titres) et JetBrains Mono (le terminal), auto-hébergées, latin, préchargées. Ce sont les polices du blog, qui reste ainsi de la même famille. Les glyphes absents du sous-ensemble latin (flèches, coches) sont dessinés en SVG.
- **Grille.** 12 colonnes, une gouttière fluide, un pas vertical de 8 px. Chaque section a sa propre famille de mise en page :
  - premier écran en 6 / 6 ;
  - liste d'index en pleine largeur ;
  - en-tête collant et journal git ;
  - un fichier TOML en deux colonnes inégales ;
  - une fenêtre ROADMAP décalée ;
  - une liste éditoriale ;
  - un formulaire en fenêtre.
- **Formes.** Fenêtres à 12 px de rayon, boutons à 8 px, pastilles à 6 px.
- **Mouvement** (règles du skill `top-notch` §4).
  - Les entrées décélèrent, sur `cubic-bezier(0.22, 1, 0.36, 1)`.
  - Les retours de survol durent de 160 à 240 ms.
  - Une seule horloge, le ticker GSAP. Lenis gère le défilement, avec `anchors: false` et un seul gestionnaire de liens d'ancre (`src/engine/anchors.ts`, repris de fde-site).
- **Survols, un traitement par rôle.**
  - Lignes de liste : vidéo inverse, et un `›` arrive.
  - Navigation : un soulignement tapé en six pas.
  - Boutons : le remplissage déborde de gauche à droite, et la touche glisse d'un cran.
  - Articles : le titre se souligne, la date glisse.
  - Liens dans le texte : le soulignement s'épaissit.
  - Liens qui mènent ailleurs (« Tous les articles », articles liés, fil d'Ariane) : la flèche avance d'un cran, ou recule pour le retour.
- **Sorties de commande** (`src/motion/sections.ts`, `[data-print]`). Quand une commande de section est tapée, sa sortie s'imprime dans le langage du héros, avec un geste par section, déclenché une fois par un IntersectionObserver. Seuls `transform`, `opacity` et `clip-path` bougent, et rien n'est caché sans JavaScript ni sous mouvement réduit.
  - `ls -l` : le nom est tapé, l'étiquette de statut s'allume en trois pas, les colonnes suivent.
  - `git log` : le hash est tapé d'abord, le point se pose, la branche SRI se dessine, puis le texte ; `HEAD` arrive après le premier commit.
  - `cat competences.toml` : le TOML se remplit clé par clé (clé tapée, puis valeurs) ; le vide laissé à gauche est rempli par les `~` de vim.
  - `cat ROADMAP.md` : les cases `- [ ]` s'impriment l'une après l'autre, un curseur attend sur la ligne suivante (cinq clignotements, puis fixe).
  - `ls -t blog/` : le filet de la ligne se trace, la date est tapée, le titre suit.
  - `./contact.sh` : les invites du formulaire montent l'une après l'autre.
- **Repos.** Le dernier champ du flux essaie sans cesse de finir : sa valeur coupée s'efface, hésite, se retape lentement, puis le JSON est refermé, avec 1,4 s de pause entre deux essais. La boucle s'arrête hors écran, sur un onglet caché et avec le bouton « pause » (WCAG 2.2.2). Le curseur clignote, et le bouton « relancer » rejoue tout le flux. Les pages intérieures (projets, mentions, 404) restent immobiles au repos, par choix : ce sont des pages de lecture, et leurs survols et la transition portent le mouvement.

## Décisions (skill `top-notch` §2)

| Sujet | Décision |
|---|---|
| Thème | Sombre uniquement, thème complet vérifié AA, `color-scheme: dark`. La bascule clair/sombre de l'ancien site est retirée. |
| Langues | FR par défaut (`/`), EN sous `/en/`, avec `hreflang` et une URL par langue. |
| Mesure d'audience | Aucune. Aucun cookie. |
| Impression | `@media print` masque l'en-tête, le pied, le flux et les animations. |
| Hors ligne | Pas de service worker. |
| Élément partagé | Oui : le nom d'un projet passe de sa ligne à la page projet (FLIP dans `src/motion/setup.ts`). |
| Loader | Non. L'arrivée, c'est le flux du premier écran (1,2 s au plus, première peinture immédiate). Un écran d'attente retarderait la lecture d'un recruteur. |
| Pages légales | Mentions légales et confidentialité (`/mentions/`), liées dans le pied de chaque page. Pas de SIRET : l'entreprise n'existe pas. |
| Formulaire | FormSubmit : en AJAX avec JavaScript, en POST classique sans, avec un champ piège et la mention RGPD sous le formulaire. |
| Raccourcis | `/`, g, b, c. Ils peuvent être désactivés (bouton en pied de page, ou `raccourcis off`), comme le demande le critère WCAG 2.1.4. |

## Test de banalité

Le risque, c'est le thème « terminal de développeur » vu cent fois. Les corrections :
- la signature est un vrai objet de données, tiré du profil, qui fait ce que fait la bibliothèque de Camil ;
- chaque statut (entreprise, public, privé, prévu) a sa couleur et sa forme dans tout le site, et rien de prévu n'est présenté comme fait ;
- le trou d'avril à août 2026 reste visible dans le journal git : c'est l'absence de commit entre deux dates ;
- le titre et le chapô sont en clair : le terminal accompagne le texte, il ne le remplace pas.

## Ajouter un projet

Une entrée dans `src/data/projects.ts`. Quand une spec devient un projet en ligne, retire-la de `planned`, ajoute-la à `projects` avec le statut `public` et son lien `href`, et ajoute `page` si elle mérite sa page. `npm run build` vérifie les règles mécaniques (`scripts/check-content.mjs`).
