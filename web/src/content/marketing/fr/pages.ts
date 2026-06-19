import type { MarketingPageContent } from "../types";

export const companyPagesFr: Record<
  "about" | "approach" | "mission" | "science" | "faq" | "press" | "blog" | "parents",
  MarketingPageContent
> = {
  about: {
    hero: {
      badge: "Notre histoire",
      title: "Révéler le génie de chaque enfant.",
      subtitle:
        "FreeGeny construit le pont numérique entre la maison, la classe et l'enfant — avec des outils concrets, bilingues et accessibles.",
      gradient: "from-blue-50 to-white",
    },
    sections: [
      {
        title: "Pourquoi FreeGeny existe",
        paragraphs: [
          "Dans de nombreuses familles algériennes — et au-delà — l'excellence scolaire dépend trop du hasard : matériel pédagogique limité, communication fragmentée avec l'école, temps d'écran mal canalisé, parents qui veulent aider mais manquent d'outils structurés.",
          "FreeGeny est né pour combler cet écart : une seule plateforme où le parent voit les lacunes de son enfant, génère des exercices ciblés (Geny), crée des fiches (Mon Atelier), lit des ouvrages numériques (Ma Bibliothèque), échange avec l'enseignant (messagerie maison) et encadre le temps d'écran — sans installer cinq applications différentes.",
          "Notre déploiement initial cible l'Algérie en français et en arabe, avec une feuille de route d'extension progressive vers d'autres pays du Maghreb et francophonie.",
        ],
      },
      {
        title: "Ce que nous ne sommes pas",
        paragraphs: [
          "FreeGeny n'est pas un réseau social pour enfants. Ce n'est pas un chatbot qui fait les devoirs à la place de l'élève. Ce n'est pas une école en ligne qui remplace l'institution scolaire officielle.",
          "Nous sommes un amplificateur : nous renforçons le triptyque parent – enseignant – enfant avec des preuves, des ressources et des canaux de dialogue.",
        ],
      },
      {
        title: "Notre modèle économique transparent",
        paragraphs: [
          "L'accès aux fonctionnalités essentielles reste gratuit pour les familles. FreeGeny est financé par la publicité display responsable, des partenariats éducatifs (éditeurs, ONG, collectivités) et, à terme, des services premium optionnels pour les établissements.",
          "Cette transparence est volontaire : les parents méritent de comprendre comment un service gratuit se sustente, et quelles garanties existent pour les données de leurs enfants (voir Politique de confidentialité).",
        ],
      },
      {
        title: "L'équipe et la vision",
        paragraphs: [
          "FreeGeny réunit des compétences produit, pédagogie, ingénierie logicielle et design. Nous co-construisons avec des parents et des enseignants sur le terrain algérien.",
          "Notre vision à dix ans : qu'aucun enfant ne soit laissé sans accompagnement personnalisé faute d'outil numérique adapté à sa langue, son niveau et son contexte familial.",
        ],
      },
    ],
    cta: { label: "Découvrir l'approche", href: "/approach" },
  },

  approach: {
    hero: {
      badge: "La méthode",
      title: "Apprendre par l'exploration encadrée.",
      subtitle: "Personnalisation, engagement actif et alliance parentale — les trois piliers FreeGeny.",
      gradient: "from-emerald-50 to-white",
    },
    cards: [
      {
        icon: "🎯",
        title: "Ciblage des lacunes",
        description:
          "Geny identifie les faiblesses (maths, français, arabe…) et produit des fiches PDF cohérentes, assignables au lobby enfant avec suivi parent.",
      },
      {
        icon: "🛠️",
        title: "Création accessible",
        description:
          "Mon Atelier : documents TipTap, visuels, cartes mentales, QCM interactifs — parents et enseignants produisent sans compétence technique.",
      },
      {
        icon: "🤝",
        title: "Alliance parentale",
        description:
          "Co-parents, invitations, historique exportable, messagerie maison : l'adulte reste au centre, l'enfant progresse en confiance.",
      },
    ],
    sections: [
      {
        title: "Du diagnostic à l'action",
        paragraphs: [
          "La boucle FreeGeny : observer (historique, besoins enfant, résultats Geny) → produire (fiches, activités, lectures) → assigner (lobby, classe) → mesurer (progression bibliothèque, temps d'écran, retours enseignant) → ajuster.",
          "Chaque étape est visible dans le cockpit parent ou l'espace enseignant — pas de boîte noire.",
        ],
      },
      {
        title: "Exploration libre",
        paragraphs: [
          "Avant même de s'inscrire, tout visiteur peut tester Mon Atelier et la bibliothèque via le mode exploration libre. C'est notre preuve de valeur : le produit se juge en l'utilisant, pas en lisant une promesse marketing.",
        ],
      },
      {
        title: "Bilinguisme natif",
        paragraphs: [
          "Interface DZ-fr / DZ-ar, contenus bibliothèque dans les deux langues, exercices Geny adaptés au programme algérien. Nous refusons l'approche « traduction après coup » : l'arabe et le français sont des citoyens de première classe dans l'UX.",
        ],
      },
    ],
    cta: { label: "Essayer sans compte", href: "/dashboard/explore" },
  },

  mission: {
    hero: {
      badge: "Notre mission",
      title: "Démocratiser l'excellence scolaire.",
      subtitle: "Outils de niveau professionnel pour chaque famille — quelle que soit la wilaya.",
      gradient: "from-amber-50 to-white",
    },
    sections: [
      {
        title: "Mission",
        paragraphs: [
          "Offrir à chaque enfant algérien — puis à chaque enfant dans nos zones d'extension — un accompagnement numérique personnalisé, sûr, bilingue et gratuit dans ses fonctions essentielles, en renforçant le lien école–famille plutôt qu'en le contournant.",
        ],
      },
      {
        title: "Objectifs mesurables",
        bullets: [
          "Réduire le temps perdu par les parents à chercher des fiches dispersées sur internet.",
          "Augmenter la visibilité des lacunes avant les périodes d'examens.",
          "Faciliter le dialogue enseignant–parent sans exposer les numéros personnels.",
          "Canaliser le temps d'écran vers des activités à forte valeur pédagogique.",
          "Publier une bibliothèque numérique fr/ar de qualité, accessible offline partiellement.",
        ],
      },
      {
        title: "Impact sociétal",
        paragraphs: [
          "Nous croyons que la fracture numérique éducative se comble par des produits simples, pas par des discours. FreeGeny investit dans l'UX mobile, les connexions lentes et les familles multilingues.",
          "Les partenariats ONG et écoles publiques sont intégrés à notre feuille de route dès que les fonctionnalités « établissement » sont ouvertes dans votre région.",
        ],
      },
    ],
    cta: { label: "Rejoindre FreeGeny", href: "/auth/register" },
  },

  science: {
    hero: {
      badge: "Recherche & pédagogie",
      title: "La science au service de l'apprentissage.",
      subtitle: "Répétition espacée, feedback immédiat, charge cognitive maîtrisée — sans jargon vide.",
      gradient: "from-indigo-50 to-white",
    },
    sections: [
      {
        title: "Fondements cognitifs",
        paragraphs: [
          "FreeGeny s'inspire de travaux en sciences cognitives : la récupération active (testing effect) renforce la mémorisation mieux que la relecture passive ; le feedback immédiat corrige les erreurs avant qu'elles ne se cristallisent ; la segmentation en micro-tâches respecte l'attention des 6–12 ans.",
          "Geny structure les exercices en séries courtes avec montée en difficulté progressive — pas de surcharge qui décourage l'enfant.",
        ],
      },
      {
        title: "Geny : banques, pas boîte noire",
        paragraphs: [
          "Aujourd'hui, Geny pioche dans des banques d'exercices taguées (matière, niveau AP, type de faiblesse). La génération PDF multi-fiches (2 à 5) est déterministe et auditable — les parents voient ce que l'enfant reçoit.",
          "Une couche IA conversationnelle pourra venir ultérieurement, sous contrôle éditorial strict. La confiance des familles prime sur la hype technologique.",
        ],
      },
      {
        title: "Mesure et amélioration",
        paragraphs: [
          "Nous analysons des métriques agrégées (taux de complétion, temps par activité, abandons) pour améliorer les parcours — jamais pour vendre des profils individuels.",
          "Les enseignants partenaires peuvent remonter des signaux qualitatifs via support et groupes pilotes.",
        ],
      },
      {
        title: "Lecture et numérique",
        paragraphs: [
          "La bibliothèque Readium/PDF intègre reprise de lecture, favoris et progression — car la lecture longue reste irremplaçable pour le vocabulaire et la culture générale, y compris à l'ère du scroll infini.",
        ],
      },
    ],
  },

  faq: {
    hero: {
      title: "Foire aux questions.",
      subtitle: "Réponses détaillées sur l'inscription, Geny, la sécurité, la publicité et l'Algérie.",
      gradient: "from-slate-50 to-white",
    },
    sections: [],
    faq: [
      {
        question: "FreeGeny est-il gratuit ? Comment est-il financé ?",
        answer:
          "Oui, les fonctions essentielles (compte parent, enfant, Mon Atelier, Geny, bibliothèque, messagerie de base) sont gratuites en Algérie. FreeGeny est financé par la publicité display et des partenariats éducatifs. Nous ne vendons pas vos données personnelles. Consultez la Politique de confidentialité pour le détail.",
      },
      {
        question: "Qu'est-ce que le mode exploration libre ?",
        answer:
          "C'est un accès sans inscription à Mon Atelier et à la bibliothèque publique. Une session temporaire (cookie 7 jours) isole vos créations. Rien n'est rattaché à un compte enfant. Inscrivez-vous pour sauvegarder, assigner des missions et synchroniser entre appareils.",
      },
      {
        question: "Comment fonctionne Geny concrètement ?",
        answer:
          "Geny agrège les signaux de faiblesse (résultats d'activités, profil enfant) et compose 2 à 5 fiches d'exercices depuis des banques validées. Vous prévisualisez le PDF, l'assignez au lobby enfant ; une notification push alerte l'enfant. L'historique parent enregistre l'action.",
      },
      {
        question: "Geny utilise-t-il ChatGPT ou une IA générative ?",
        answer:
          "Non en production actuelle. Geny s'appuie sur des banques structurées. Toute évolution IA future passera par validation éditoriale et transparence vis-à-vis des parents.",
      },
      {
        question: "Mes données et celles de mon enfant sont-elles vendues ?",
        answer:
          "Non. Des annonceurs peuvent financer la plateforme via des emplacements publicitaires, sans accès direct à l'identité de votre enfant. Voir Politique de confidentialité et Protection des mineurs.",
      },
      {
        question: "Quelles langues et pays sont supportés ?",
        answer:
          "Priorité Algérie : interface DZ-fr et DZ-ar. D'autres locales existent pour l'internationalisation technique, mais le contenu pédagogique certifié cible d'abord le programme algérien. Le RegionGate peut limiter certaines ressources hors Algérie.",
      },
      {
        question: "Comment lier l'école de mon enfant ?",
        answer:
          "Lors de l'onboarding ou depuis le profil enfant, sélectionnez l'établissement (wilaya → commune → école). La sync rafraîchit les salons de messagerie et le mur pédagogique lorsque l'école est active sur FreeGeny.",
      },
      {
        question: "Comment fonctionne la messagerie ?",
        answer:
          "Messagerie maison hébergée par FreeGeny (PostgreSQL, SSE temps réel, push). Plus de Rocket.Chat. Conversations directes et groupes selon votre rôle. Signalez tout abus à support@freegeny.com.",
      },
      {
        question: "Puis-je limiter le temps d'écran ?",
        answer:
          "Oui : paramètres parent + sync cloud. Le lobby enfant respecte la limite configurée (hybrid localStorage + API).",
      },
      {
        question: "Comment exporter l'historique ?",
        answer:
          "Depuis l'espace parent > Historique, export PDF ou CSV des actions (Geny, connexions, activités). Utile pour suivre l'évolution sur plusieurs mois.",
      },
      {
        question: "Je suis enseignant : que m'apporte FreeGeny ?",
        answer:
          "Mon Atelier complet, bibliothèque classe, mur pédagogique, assignations, suivi des élèves de l'école liée. Page dédiée /teachers et inscription rôle enseignant.",
      },
      {
        question: "Comment supprimer mon compte ?",
        answer:
          "Réglages > Compte > Suppression, ou e-mail à support@freegeny.com. Effacement sous 30 jours conformément à la Politique de confidentialité.",
      },
      {
        question: "Comment contacter le support ?",
        answer: "Formulaire /contact ou support@freegeny.com. Presse : press@freegeny.com.",
      },
    ],
    cta: { label: "Nous contacter", href: "/contact" },
  },

  press: {
    hero: {
      badge: "Presse",
      title: "Espace presse FreeGeny.",
      subtitle: "Éléments de langage, faits marquants et contacts médias.",
      gradient: "from-slate-50 to-white",
    },
    sections: [
      {
        title: "Communiqué de base",
        paragraphs: [
          "FreeGeny est une plateforme éducative algérienne connectant parents, enseignants et enfants. Services clés : Geny (exercices ciblés PDF), Mon Atelier (création de ressources), Ma Bibliothèque (EPUB/PDF bilingue), messagerie maison, cockpit parental (temps d'écran, historique, besoins enfant).",
          "Lancement progressif en Algérie · Langues : français et arabe · Modèle : freemium financé par publicité responsable et partenariats.",
        ],
      },
      {
        title: "Chiffres clés (indicatifs)",
        bullets: [
          "Couverture visée : 48 wilayas — déploiement école par école.",
          "Contenus : banques Geny multi-matières, catalogue bibliothèque fr/ar.",
          "Tech : Next.js 15, PostgreSQL, messagerie SSE, push web.",
        ],
      },
      {
        title: "Identité visuelle",
        paragraphs: [
          "Logo FreeGeny, baseline « free the genius on your child », palette orange / slate. Kit logo SVG sur demande à press@freegeny.com.",
        ],
      },
      {
        title: "Contact presse",
        paragraphs: [
          "Interviews, tribunes, partenariats médias : press@freegeny.com",
          "Délai de réponse visé : 48 h ouvrées.",
        ],
      },
    ],
    footerNote: "Dossier presse PDF disponible sur demande.",
  },

  blog: {
    hero: {
      badge: "Blog",
      title: "Le blog FreeGeny.",
      subtitle: "Pédagogie pratique, parentalité numérique et actualités de la plateforme.",
      gradient: "from-slate-50 to-white",
    },
    sections: [],
    articles: [
      {
        id: "geny-faiblesses",
        title: "Geny : transformer une faiblesse en plan de révision concret",
        date: "5 juin 2026",
        category: "Pédagogie",
        excerpt:
          "Comment FreeGeny identifie les lacunes de votre enfant et génère des fiches PDF actionnables — sans devoir parcourir dix sites de fiches gratuites.",
        paragraphs: [
          "Trop de parents passent leurs soirées à chercher « fiche fractions 4AP PDF » sur des moteurs de recherche, sans savoir si le niveau correspond vraiment à leur enfant. Geny centralise cette logique : vous partez des faiblesses observées (résultats d'activités, profil enfant) et la plateforme compose un lot cohérent de 2 à 5 fiches.",
          "Chaque fiche provient de banques taguées par matière, niveau et compétence. Vous prévisualisez le PDF avant envoi. Vous assignez au lobby enfant ; une notification push l'invite à ouvrir sa mission. Vous retrouvez l'événement dans l'historique parent, exportable en CSV pour suivre l'évolution sur le trimestre.",
          "Ce n'est pas magique : Geny ne remplace pas l'explication humaine du parent ou de l'enseignant. Il structure le temps de révision pour qu'il ne soit plus dispersé.",
          "Prochaine étape côté produit : affiner les recommandations multi-matières dans un même PDF hebdomadaire. Restez connectés via ce blog.",
        ],
      },
      {
        id: "atelier-parent",
        title: "Mon Atelier : créer une fiche pro en 15 minutes",
        date: "28 mai 2026",
        category: "Tutoriel",
        excerpt:
          "Documents, QCM, visuels — le guide pas à pas pour les parents qui veulent produire leurs propres supports.",
        paragraphs: [
          "Mon Atelier n'est pas réservé aux enseignants. Un parent peut créer un document TipTap (consignes claires, images), un QCM de révision ou un visuel type affiche de chambre avec les tables de multiplication.",
          "Commencez par un titre explicite (« Révision tables 6 et 7 — 3AP »). Choisissez le template. Remplissez le contenu — les modèles guident la mise en page. Enregistrez : la ressource apparaît dans votre hub. Assignez-la à un enfant ou exportez en PDF pour imprimer.",
          "En mode exploration libre, vous testez tout cela sans compte ; l'inscription permet de conserver et réutiliser vos créations d'une année sur l'autre.",
          "Astuce : combinez une fiche Geny automatique et une fiche perso Mon Atelier dans la même session de révision du mercredi.",
        ],
      },
      {
        id: "messagerie-ecole",
        title: "Messagerie maison : pourquoi FreeGeny a quitté les outils tiers",
        date: "15 mai 2026",
        category: "Produit",
        excerpt:
          "Contrôle des données, latence réduite en Algérie, modération enfant — les raisons du choix PostgreSQL + SSE.",
        paragraphs: [
          "Historiquement, de nombreuses edtech bricolent Rocket.Chat ou WhatsApp pour relier parents et enseignants. Résultat : numéros personnels exposés, modération faible, données hors UE/Algérie difficiles à auditer.",
          "FreeGeny a investi dans une messagerie intégrée : conversations stockées dans notre PostgreSQL, temps réel via SSE, notifications push maison. Les rôles (parent, enseignant) déterminent qui peut écrire à qui. Pas de contact libre enfant–inconnu.",
          "La sync école (choix de l'établissement) régénère les graphes de salons lorsque l'enfant change d'école — fini les groupes fantômes.",
          "Pour les familles : un seul endroit pour les messages scolaires et les alertes Geny, sans mélanger avec les discussions WhatsApp du quotidien.",
        ],
      },
      {
        id: "exploration-libre",
        title: "Exploration libre : tester FreeGeny avant de s'inscrire",
        date: "1 mai 2026",
        category: "Guide",
        excerpt:
          "Atelier + bibliothèque sans compte — ce qui est sauvegardé, ce qui ne l'est pas, et quand créer un compte.",
        paragraphs: [
          "Nous avons lancé /dashboard/explore pour réduire la friction : choisissez Parent ou Enseignant, une session cookie isole vos créations Atelier pendant 7 jours.",
          "Vous parcourez le catalogue bibliothèque publié, ouvrez un livre EPUB, créez un document ou un QCM. Rien n'est lié à un profil enfant car il n'y en a pas encore.",
          "Dès que vous voulez assigner une mission à votre enfant, synchroniser le temps d'écran ou joindre l'école : créez un compte parent gratuit. Vos ressources exploration ne migrent pas automatiquement — refaites-les ou recréez en 5 minutes, c'est le compromis assumé de l'anonymat.",
          "Pour les enseignants curieux, le même mode permet de tester l'Atelier avant validation hiérarchique dans l'établissement.",
        ],
      },
    ],
    cta: { label: "S'inscrire gratuitement", href: "/auth/register" },
  },

  parents: {
    hero: {
      badge: "Pour les parents",
      title: "Le cockpit parental complet.",
      subtitle:
        "Geny, Mon Atelier, bibliothèque, messagerie, temps d'écran, besoins enfant et alliance familiale — en un seul endroit.",
      gradient: "from-orange-50 to-white",
    },
    sections: [
      {
        title: "Vue d'ensemble",
        paragraphs: [
          "Le dashboard parent FreeGeny n'est pas une vitrine statistique vide : c'est l'outil opérationnel du quotidien. Vous voyez quels enfants sont actifs, quelles missions sont en attente, quels exercices Geny ont été générés cette semaine, et vous accédez en un clic à Mon Atelier unifié (onglets Geny & PDF, Missions, Créer).",
          "L'Alliance parentale permet d'inviter un co-parent, de partager la visibilité sans partager un mot de passe, et de recevoir des notifications push sur les événements importants (alliance, assignations, rappels).",
        ],
      },
      {
        title: "Geny & fiches PDF",
        paragraphs: [
          "Sélectionnez l'enfant, analysez ses faiblesses remontées, générez un lot de fiches PDF multi-matières, assignez au lobby. L'enfant reçoit une push ; vous suivez la complétion dans Historique. Export CSV/PDF pour les réunions parents-professeurs.",
        ],
      },
      {
        title: "Mon Atelier",
        paragraphs: [
          "Créez documents, activités QCM, visuels Polotno, cartes mentales. Organisez en dossiers (compte connecté). Les missions enseignant apparaissent dans l'onglet Missions avec surbrillance assignment.",
        ],
      },
      {
        title: "Ma Bibliothèque",
        paragraphs: [
          "Catalogue fr/ar : lecture EPUB avec reprise, PDF lecteur intégré. Assignations enseignant visibles. Progression enfant et lecture parent séparées.",
        ],
      },
      {
        title: "Messagerie & école",
        paragraphs: [
          "Messagerie maison synchronisée avec l'établissement choisi. Changement d'école = refresh des salons. Pas de numéro WhatsApp enseignant obligatoire.",
        ],
      },
      {
        title: "Besoins enfant & temps d'écran",
        paragraphs: [
          "Questionnaire 8 questions (santé/apprentissage) sur /dashboard/parent/besoins. Temps d'écran hybrid local + cloud. Bannière vérification identité parent pour débloquer les fonctions sensibles.",
        ],
      },
    ],
    cta: { label: "Créer un compte gratuit", href: "/auth/register" },
  },
};
