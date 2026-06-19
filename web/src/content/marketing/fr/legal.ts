import type { MarketingPageContent } from "../types";

/** Contenus juridiques FR — version complète (non résumé). */
export const legalPagesFr: Record<
  "privacy" | "terms" | "legal" | "dataProtection" | "cookies" | "childSafety",
  MarketingPageContent
> = {
  privacy: {
    hero: {
      title: "Politique de confidentialité.",
      subtitle:
        "Document de référence décrivant comment FreeGeny collecte, utilise, protège et conserve vos données personnelles et celles de vos enfants.",
      gradient: "from-slate-50 to-white",
    },
    lastUpdated: "15 juin 2026",
    wide: true,
    sections: [
      {
        title: "1. Objet et champ d'application",
        paragraphs: [
          "La présente Politique de Confidentialité (« Politique ») informe tout visiteur, utilisateur inscrit (parent, enseignant, représentant d'établissement) ou utilisateur du mode exploration libre sur la manière dont FreeGeny (« nous », « la Plateforme ») traite les données à caractère personnel.",
          "Elle s'applique à l'ensemble des services accessibles via le site freegeny.com et ses sous-domaines, aux applications web associées, aux espaces parent, enseignant, enfant (lobby), à la messagerie intégrée, à Mon Atelier, à Geny, à Ma Bibliothèque et à toute fonctionnalité présente ou à venir décrite sur la Plateforme.",
          "En utilisant FreeGeny, vous reconnaissez avoir lu cette Politique. Si vous n'acceptez pas ces principes, vous devez cesser d'utiliser le service. L'inscription d'un enfant mineur suppose que le parent ou titulaire de l'autorité parentale a accepté cette Politique au nom de l'enfant.",
        ],
      },
      {
        title: "2. Responsable du traitement et contacts",
        paragraphs: [
          "Le responsable du traitement est FreeGeny, joignable à l'adresse contact@freegeny.com pour toute question relative à la protection des données.",
          "Pour exercer vos droits ou signaler un incident : support@freegeny.com (objet « Données personnelles »). Nous nous engageons à accuser réception des demandes fondées dans un délai de trente (30) jours calendaires, sauf complexité justifiée.",
          "FreeGeny ne vend pas vos données personnelles à des courtiers de données. Certains traitements sont réalisés par des sous-traitants techniques (hébergement cloud, envoi d'e-mails transactionnels, push notifications) strictement encadrés par contrat.",
        ],
      },
      {
        title: "3. Données que nous collectons",
        paragraphs: [
          "Nous appliquons le principe de minimisation : seules les données nécessaires à la fourniture du service éducatif, à la sécurité des mineurs et à la facturation interne (le cas échéant) sont collectées.",
        ],
        bullets: [
          "Données d'identification du compte adulte : nom, prénom, adresse e-mail, mot de passe (stocké sous forme hashée), rôle (parent, enseignant, etc.), photo de profil optionnelle, métadonnées de profil (école, matières, niveaux).",
          "Données d'identification de l'enfant : prénom ou nom affiché, date de naissance ou année, genre le cas échéant, niveau scolaire, établissement scolaire sélectionné, code PIN d'accès au lobby (hashé), profil d'apprentissage et réponses au questionnaire « besoins enfant ».",
          "Données d'usage pédagogique : résultats d'exercices Geny, faiblesses identifiées, fiches PDF générées, progression de lecture (bibliothèque), ressources créées ou consultées dans Mon Atelier, statuts de missions assignées.",
          "Données de messagerie : contenu des messages, pièces jointes autorisées, identifiants de conversation, horodatages, statuts de lecture — hébergés sur notre infrastructure PostgreSQL (messagerie maison).",
          "Données techniques : adresse IP abrégée ou pseudonymisée, identifiant de session, cookies (voir page Politique cookies), logs de sécurité, type de navigateur, préférences de langue et de région (ex. DZ-fr, DZ-ar).",
          "Mode exploration libre : identifiant de session temporaire (cookie), ressources créées taguées par session — non rattachées à un compte tant que l'utilisateur ne s'inscrit pas.",
        ],
      },
      {
        title: "4. Finalités et bases légales",
        paragraphs: [
          "Chaque traitement repose sur une finalité déterminée et une base légale appropriée au regard du RGPD (pour les résidents UE) et de la législation algérienne en vigueur en matière de protection des personnes physiques.",
        ],
        bullets: [
          "Exécution du contrat / fourniture du service : création de compte, accès au lobby enfant, assignation d'exercices, messagerie école–famille, export d'historique.",
          "Intérêt légitime : sécurisation de la plateforme, lutte contre la fraude, amélioration UX, statistiques agrégées non identifiantes.",
          "Consentement : notifications push, cookies non essentiels, certaines options de profil facultatives.",
          "Obligation légale : conservation de logs en cas de réquisition judiciaire conforme au droit applicable.",
          "Mission d'intérêt public / éducation : dans le cadre du déploiement avec établissements partenaires, sous convention distincte le cas échéant.",
        ],
      },
      {
        title: "5. Publicité et modèle économique",
        paragraphs: [
          "FreeGeny est financé en partie par la publicité display et des partenariats éducatifs. L'accès aux fonctionnalités cœur (inscription, atelier, Geny, bibliothèque, messagerie de base) reste gratuit pour les familles dans les zones déployées.",
          "Les publicités sont sélectionnées pour limiter l'exposition des mineurs à des contenus inappropriés. Nous n'autorisons pas les annonceurs à recevoir directement le nom, l'e-mail ou l'identifiant permanent d'un enfant.",
          "Des mesures d'audience agrégées (pages vues, taux de conversion inscription) peuvent être utilisées pour optimiser le service et justifier les campagnes auprès de partenaires — toujours sous forme statistique lorsque c'est possible.",
          "Lorsque des préférences publicitaires sont disponibles dans votre espace « Réglages », vous pouvez les ajuster. Le refus de certaines catégories n'empêche pas l'utilisation gratuite du service.",
        ],
      },
      {
        title: "6. Destinataires et sous-traitants",
        paragraphs: [
          "Vos données sont accessibles en interne aux équipes FreeGeny strictement habilitées (support, sécurité, produit) dans le cadre de leurs fonctions.",
          "Peuvent également y accéder, dans la limite de leurs rôles : l'enseignant lié à la classe de l'enfant, l'autre parent de l'alliance familiale, les administrateurs d'établissement lorsque la fonctionnalité école est activée.",
          "Nos sous-traitants techniques (hébergeur, CDN, service e-mail, push web) traitent les données uniquement sur instruction documentée de FreeGeny et ne peuvent les utiliser à leurs propres fins.",
        ],
      },
      {
        title: "7. Transferts hors du pays de résidence",
        paragraphs: [
          "Les serveurs peuvent être situés dans l'Union européenne ou dans des pays reconnus comme offrant un niveau de protection adéquat, ou encadrés par des clauses contractuelles types approuvées.",
          "Pour les utilisateurs en Algérie, nous nous efforçons de limiter les transferts et de documenter les garanties contractuelles auprès de nos hébergeurs.",
        ],
      },
      {
        title: "8. Durées de conservation",
        paragraphs: [
          "Compte actif : conservation des données de profil et d'activité tant que le compte n'est pas supprimé.",
          "Après demande de suppression ou inactivité prolongée (24 mois sans connexion) : suppression ou anonymisation sous 30 jours, sauf obligation légale de conservation (logs sécurité : jusqu'à 12 mois).",
          "Messagerie : conservée tant que la conversation existe ; suppression possible par l'utilisateur selon les fonctions disponibles.",
          "Exploration libre : ressources taguées session — purge automatique des sessions expirées (7 jours sans activité) pour les comptes système d'exploration.",
          "Factures et données comptables le cas échéant : durée légale de conservation fiscale.",
        ],
      },
      {
        title: "9. Sécurité",
        paragraphs: [
          "Nous mettons en œuvre des mesures techniques et organisationnelles : HTTPS/TLS, hachage des mots de passe (bcrypt), contrôle d'accès par rôle, journalisation des accès sensibles, sauvegardes chiffrées.",
          "Aucune mesure n'étant infaillible, nous vous invitons à choisir un mot de passe robuste, à ne pas le partager et à signaler immédiatement toute suspicion de compromission à support@freegeny.com.",
        ],
      },
      {
        title: "10. Vos droits",
        paragraphs: [
          "Selon votre juridiction, vous disposez notamment des droits d'accès, de rectification, d'effacement, de limitation, d'opposition, de portabilité et de retrait du consentement pour les traitements qui en dépendent.",
          "Les parents exercent ces droits pour les données des enfants rattachés à leur famille. Les enseignants exercent leurs droits sur leurs propres données de compte.",
          "Pour formuler une demande : support@freegeny.com avec une copie d'un justificatif d'identité si nécessaire. En cas de désaccord persistant, vous pouvez saisir l'autorité de protection des données compétente dans votre pays.",
        ],
      },
      {
        title: "11. Mineurs",
        paragraphs: [
          "FreeGeny est conçu pour impliquer un adulte responsable. L'enfant accède au lobby via un compte créé et supervisé par un parent. Voir aussi notre page « Protection des mineurs ».",
          "Nous ne collectons pas sciemment de données auprès d'enfants sans consentement parental vérifiable dans les juridictions où cela est requis.",
        ],
      },
      {
        title: "12. Modifications",
        paragraphs: [
          "Nous pouvons mettre à jour cette Politique pour refléter l'évolution du service ou du cadre légal. La date « Dernière mise à jour » en tête de document sera révisée. En cas de changement substantiel, une notification in-app ou par e-mail pourra être envoyée.",
          "La poursuite de l'utilisation après entrée en vigueur vaut acceptation des nouvelles dispositions, sauf opposition manifeste ou suppression du compte.",
        ],
      },
    ],
    cta: { label: "Contacter le support données", href: "/contact" },
  },

  terms: {
    hero: {
      title: "Conditions générales d'utilisation.",
      subtitle:
        "Contrat entre FreeGeny et tout utilisateur du site, des espaces connectés et du mode exploration libre.",
      gradient: "from-slate-50 to-white",
    },
    lastUpdated: "15 juin 2026",
    wide: true,
    sections: [
      {
        title: "1. Définitions",
        paragraphs: [
          "« Plateforme » : l'ensemble des services FreeGeny accessibles en ligne. « Utilisateur » : toute personne naviguant ou disposant d'un compte. « Parent » : titulaire ou co-parent d'une famille. « Enseignant » : professionnel disposant d'un compte pédagogique. « Enfant » : profil mineur rattaché à une famille. « Contenu utilisateur » : ressources créées dans Mon Atelier, messages, avis.",
        ],
      },
      {
        title: "2. Acceptation",
        paragraphs: [
          "L'accès à la Plateforme implique l'acceptation sans réserve des présentes CGU et de la Politique de confidentialité. Si vous êtes un mineur, seul votre représentant légal peut accepter ces conditions pour votre compte.",
          "FreeGeny se réserve le droit de refuser l'ouverture d'un compte ou de suspendre un compte en cas de violation des CGU, sans indemnité, après notification lorsque c'est possible.",
        ],
      },
      {
        title: "3. Description du service",
        paragraphs: [
          "FreeGeny fournit des outils numériques éducatifs : génération d'exercices Geny, création de ressources (Mon Atelier), bibliothèque numérique, messagerie maison, suivi parental, mur pédagogique enseignant, exploration libre sans compte.",
          "Le service est fourni « en l'état ». Nous améliorons continuellement les fonctionnalités ; certaines peuvent évoluer, être renommées ou retirées avec un préavis raisonnable lorsque l'impact est majeur.",
        ],
      },
      {
        title: "4. Compte et sécurité",
        paragraphs: [
          "Vous vous engagez à fournir des informations exactes lors de l'inscription et à les maintenir à jour. Vous êtes responsable de la confidentialité de vos identifiants et de toute activité réalisée sous votre compte.",
          "La vérification d'identité parent peut être demandée pour débloquer certaines fonctions (assignation, messagerie élargie). Le refus de vérification peut limiter l'accès sans résiliation automatique du compte de base.",
        ],
      },
      {
        title: "5. Usage acceptable",
        bullets: [
          "Utiliser la Plateforme uniquement à des fins éducatives, familiales ou professionnelles scolaires licites.",
          "Respecter la dignité des autres utilisateurs, en particulier des mineurs.",
          "Ne pas publier de contenus violents, haineux, sexuellement explicites, diffamatoires ou contraires à la loi algérienne ou locale.",
          "Ne pas tenter de contourner les mesures de sécurité, d'extraire massivement des données (scraping) ou de surcharger l'infrastructure.",
          "Ne pas usurper l'identité d'un enseignant, d'un établissement ou d'un autre parent.",
        ],
      },
      {
        title: "6. Contenu utilisateur et licence",
        paragraphs: [
          "Vous conservez la propriété intellectuelle des ressources que vous créez. En les publiant ou en les assignant via FreeGeny, vous nous accordez une licence non exclusive, mondiale et gratuite d'hébergement, d'affichage et de transmission aux seuls destinataires prévus (enfant, classe, co-parent).",
          "Vous garantissez disposer des droits nécessaires sur les contenus importés (images, textes). FreeGeny peut retirer tout contenu signalé comme illicite ou incompatible avec la protection des mineurs.",
        ],
      },
      {
        title: "7. Propriété FreeGeny",
        paragraphs: [
          "La marque FreeGeny, l'interface, les banques d'exercices Geny, les modèles d'atelier, les textes officiels et le code source sont protégés. Toute reproduction non autorisée est interdite.",
          "Les contenus de la bibliothèque officielle sont soumis à leurs propres licences ; l'utilisateur s'engage à ne pas les redistribuer hors du cadre prévu.",
        ],
      },
      {
        title: "8. Publicité et services tiers",
        paragraphs: [
          "La Plateforme peut afficher des publicités ou des liens vers des partenaires. FreeGeny n'est pas responsable du contenu des sites tiers accessibles via des liens externes.",
          "Les liens vers des ressources externes dans la messagerie ou le mur relèvent de la responsabilité de l'auteur du message.",
        ],
      },
      {
        title: "9. Protection des mineurs",
        paragraphs: [
          "Les parents contrôlent le profil enfant, le temps d'écran et les assignations. FreeGeny met des garde-fous techniques mais ne se substitue pas à la supervision parentale directe.",
          "Tout comportement préoccupant doit être signalé via support@freegeny.com ou les outils de signalement in-app lorsqu'ils sont disponibles.",
        ],
      },
      {
        title: "10. Limitation de responsabilité",
        paragraphs: [
          "FreeGeny ne garantit pas un résultat scolaire particulier. Les outils complètent le travail de l'école et de la famille.",
          "Dans les limites autorisées par la loi, la responsabilité totale de FreeGeny est limitée au montant éventuellement payé par l'utilisateur sur les douze derniers mois (souvent nul compte tenu du caractère gratuit du service).",
          "FreeGeny n'est pas responsable des interruptions dues à la maintenance, à la force majeure ou à des défaillances de réseaux tiers.",
        ],
      },
      {
        title: "11. Résiliation",
        paragraphs: [
          "Vous pouvez supprimer votre compte depuis les réglages ou en contactant le support. La suppression entraîne l'effacement des données personnelles conformément à la Politique de confidentialité.",
          "FreeGeny peut suspendre ou résilier un compte en cas de violation grave ou répétée des CGU.",
        ],
      },
      {
        title: "12. Droit applicable et litiges",
        paragraphs: [
          "Pour les utilisateurs domiciliés en Algérie, les présentes CGU sont régies par le droit algérien. Les tribunaux algériens compétents seront seuls compétents, sous réserve des dispositions impératives de protection des consommateurs le cas échéant.",
          "Nous encourageons le règlement amiable préalable via support@freegeny.com.",
        ],
      },
    ],
    cta: { label: "Créer un compte", href: "/auth/register" },
  },

  legal: {
    hero: {
      badge: "Informations légales",
      title: "Mentions légales.",
      subtitle: "Informations réglementaires obligatoires sur l'éditeur, l'hébergeur et les contacts officiels.",
      gradient: "from-slate-50 to-white",
    },
    lastUpdated: "15 juin 2026",
    wide: true,
    sections: [
      {
        title: "Éditeur du site",
        paragraphs: [
          "Dénomination : FreeGeny — plateforme éducative numérique.",
          "Siège social : Algérie (adresse détaillée disponible sur demande auprès de contact@freegeny.com pour les autorités et partenaires institutionnels).",
          "E-mail général : contact@freegeny.com",
          "Support utilisateurs : support@freegeny.com",
          "Presse : press@freegeny.com",
        ],
      },
      {
        title: "Directeur de la publication",
        paragraphs: [
          "Le directeur de la publication est le représentant légal de FreeGeny, responsable du contenu éditorial publié sous la marque FreeGeny sur la Plateforme officielle.",
        ],
      },
      {
        title: "Hébergement",
        paragraphs: [
          "L'infrastructure est fournie par un hébergeur cloud professionnel (certification ISO 27001 ou équivalent). Localisation des datacenters : Union européenne et/ou région MENA selon déploiement — précisions disponibles sur demande des autorités.",
          "Nom de l'hébergeur et adresse exacte : communiqués dans le cadre des obligations légales locales sur demande écrite à contact@freegeny.com.",
        ],
      },
      {
        title: "Propriété intellectuelle",
        paragraphs: [
          "L'ensemble du site (structure, graphismes, logos, textes, bases de données, logiciels) est protégé par le droit d'auteur et le droit des marques. Toute reproduction non autorisée constitue une contrefaçon.",
          "Les marques citées appartiennent à leurs propriétaires respectifs. FreeGeny n'est pas affilié aux ministères de l'Éducation nationaux sauf convention écrite explicite.",
        ],
      },
      {
        title: "Signalement de contenus illicites",
        paragraphs: [
          "Conformément aux usages en vigueur, tout utilisateur peut signaler un contenu contraire à la loi à support@freegeny.com en précisant l'URL, la nature du contenu et vos coordonnées.",
          "FreeGeny s'engage à examiner les signalements fondés dans les meilleurs délais et à retirer tout contenu manifestement illicite.",
        ],
      },
      {
        title: "Crédits",
        paragraphs: [
          "Conception et développement : équipe FreeGeny.",
          "Icônes et composants UI : bibliothèques open source sous licences compatibles (Lucide, shadcn/ui, etc.).",
          "Polices : Google Fonts et polices locales arabes (Cairo, Amiri, Reem Kufi) sous licences respectives.",
        ],
      },
    ],
  },

  dataProtection: {
    hero: {
      badge: "Sécurité & conformité",
      title: "Protection des données.",
      subtitle:
        "Mesures techniques, organisationnelles et pédagogiques pour la sécurité des familles et des établissements.",
      gradient: "from-slate-50 to-white",
    },
    lastUpdated: "15 juin 2026",
    wide: true,
    sections: [
      {
        title: "Engagement FreeGeny",
        paragraphs: [
          "La protection des données n'est pas un add-on marketing : c'est une condition de confiance entre parents, enseignants et enfants. FreeGeny a abandonné les solutions de messagerie tierces non maîtrisées au profit d'une stack maison auditable.",
          "Nous documentons nos flux de données, limitons les accès internes et formons les équipes support au secret professionnel.",
        ],
      },
      {
        title: "Architecture de sécurité",
        bullets: [
          "Chiffrement TLS 1.2+ pour tout trafic web.",
          "Mots de passe hashés avec bcrypt — jamais stockés en clair.",
          "Base PostgreSQL avec sauvegardes automatiques chiffrées.",
          "Messagerie maison (conversations, messages) — pas de Rocket.Chat en production.",
          "Notifications push Web : abonnement explicite, révocable.",
          "Uploads (photos mur, profils) : scan antivirus et quotas.",
        ],
      },
      {
        title: "Minimisation et pseudonymisation",
        paragraphs: [
          "Les tableaux de bord enseignants n'affichent que les données nécessaires au suivi pédagogique. Les exports parent sont limités à la propre famille.",
          "Les logs techniques sont pseudonymisés lorsque possible ; les adresses IP complètes ne sont conservées que le temps de l'investigation sécurité.",
        ],
      },
      {
        title: "Gestion des incidents",
        paragraphs: [
          "En cas de violation de données susceptible d'affecter vos droits, FreeGeny notifiera les autorités compétentes et les utilisateurs concernés dans les délais légaux, avec des recommandations d'action (changement de mot de passe, etc.).",
          "Procédure interne : confinement, analyse, correction, communication, post-mortem documenté.",
        ],
      },
      {
        title: "Sous-traitants et audits",
        paragraphs: [
          "Chaque sous-traitant signe un accord de traitement (DPA) listant les finalités, durées et mesures de sécurité. Liste disponible sur demande à support@freegeny.com.",
          "Des audits internes réguliers vérifient les permissions, les dépendances logicielles et la conformité aux mises à jour de sécurité.",
        ],
      },
      {
        title: "Vos garanties pratiques",
        paragraphs: [
          "Export de l'historique parent (PDF/CSV) pour transparence.",
          "Suppression de compte et droit à l'effacement.",
          "Paramétrage du temps d'écran enfant.",
          "Mode exploration libre sans création de dossier permanent enfant.",
        ],
      },
    ],
    cta: { label: "Protection des mineurs", href: "/child-safety" },
  },

  cookies: {
    hero: {
      badge: "Cookies & traceurs",
      title: "Politique cookies.",
      subtitle: "Liste des cookies et traceurs utilisés sur freegeny.com et finalités associées.",
      gradient: "from-slate-50 to-white",
    },
    lastUpdated: "15 juin 2026",
    wide: true,
    sections: [
      {
        title: "Qu'est-ce qu'un cookie ?",
        paragraphs: [
          "Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite d'un site. Il permet de mémoriser des préférences, de maintenir une session connectée ou de mesurer l'audience.",
          "FreeGeny utilise aussi le stockage local du navigateur (localStorage) pour certaines préférences UI et la progression de lecture en mode exploration.",
        ],
      },
      {
        title: "Cookies strictement nécessaires",
        paragraphs: ["Ils ne nécessitent pas de consentement préalable car indispensables au service :"],
        bullets: [
          "Session NextAuth / connexion utilisateur.",
          "Cookie NEXT_COUNTRY et préférences de locale (DZ-fr, DZ-ar).",
          "fg_explore_sid / fg_explore_role — session exploration libre.",
          "Cookies de sécurité CSRF et équilibrage de charge.",
        ],
      },
      {
        title: "Cookies de mesure d'audience",
        paragraphs: [
          "Nous pouvons utiliser des outils de statistiques agrégées (pages vues, parcours d'inscription) pour améliorer le produit. Les IP sont tronquées ou pseudonymisées.",
          "Vous pouvez refuser ces cookies via le bandeau de consentement lorsqu'il est affiché, ou via les paramètres de votre navigateur.",
        ],
      },
      {
        title: "Cookies publicitaires",
        paragraphs: [
          "Des partenaires publicitaires peuvent déposer des cookies pour limiter la répétition d'annonces et mesurer l'efficacité des campagnes, dans le respect des règles applicables aux mineurs.",
          "FreeGeny configure ces partenaires pour ne pas transmettre d'identifiants directs d'enfants. Les préférences publicitaires du compte parent priment lorsqu'elles existent.",
        ],
      },
      {
        title: "Durée de vie",
        paragraphs: [
          "Cookies de session : supprimés à la fermeture du navigateur.",
          "Cookies persistants : de 7 jours (exploration) à 12 mois maximum (préférences, mesure), selon le type.",
        ],
      },
      {
        title: "Gestion de vos choix",
        paragraphs: [
          "Via votre navigateur : vous pouvez supprimer ou bloquer les cookies — attention, cela peut déconnecter votre compte ou réinitialiser la session exploration.",
          "Via FreeGeny : section Réglages > Confidentialité (selon disponibilité régionale).",
          "Questions : support@freegeny.com avec l'objet « Cookies ».",
        ],
      },
    ],
    cta: { label: "Politique de confidentialité", href: "/privacy" },
  },

  childSafety: {
    hero: {
      badge: "Protection des mineurs",
      title: "Sécurité et protection de l'enfance en ligne.",
      subtitle:
        "Cadre FreeGeny pour un usage sain, supervisé et respectueux des mineurs sur la Plateforme.",
      gradient: "from-amber-50 to-white",
    },
    lastUpdated: "15 juin 2026",
    wide: true,
    sections: [
      {
        title: "Principe directeur",
        paragraphs: [
          "FreeGeny est conçu pour que l'enfant apprenne dans un environnement encadré par un adulte de confiance. Le lobby enfant n'est pas un réseau social ouvert : c'est un espace d'activités, de missions et de lecture assignées.",
          "Nous interdisons par les CGU tout contenu ou comportement mettant en danger un mineur physiquement ou psychologiquement.",
        ],
      },
      {
        title: "Contrôles parentaux intégrés",
        bullets: [
          "Création du profil enfant par le parent uniquement.",
          "Code PIN d'accès au lobby — modifiable par la famille.",
          "Temps d'écran : limite quotidienne locale + synchronisation cloud.",
          "Questionnaire « besoins enfant » pour adapter le ton pédagogique (sans diagnostic médical).",
          "Historique consultable et exportable par le parent.",
          "Vérification d'identité parent pour certaines actions sensibles.",
        ],
      },
      {
        title: "Messagerie et interactions",
        paragraphs: [
          "La messagerie relie des adultes identifiés (parents, enseignants de l'école liée) et ne propose pas de contact libre entre inconnus et enfants.",
          "Les messages peuvent faire l'objet de signalement. FreeGeny se réserve le droit de suspendre un compte en cas d'usage prédateur ou de grooming.",
          "Nous coopérons avec les autorités compétentes sur réquisition judiciaire conforme au droit.",
        ],
      },
      {
        title: "Contenus pédagogiques",
        paragraphs: [
          "Les ressources Geny proviennent de banques validées — pas de génération libre non contrôlée par LLM en production actuelle.",
          "La bibliothèque officielle est modérée avant publication. Les ressources créées par les utilisateurs restent visibles dans leur périmètre (famille, classe) sauf publication explicite sur le mur enseignant.",
        ],
      },
      {
        title: "Publicité et mineurs",
        paragraphs: [
          "Nous limitons les formats publicitaires inappropriés pour les jeunes audiences et interdisons le ciblage comportemental invasif basé sur le profil enfant.",
          "Les parents peuvent signaler une annonce problématique à support@freegeny.com.",
        ],
      },
      {
        title: "Signalement et aide",
        paragraphs: [
          "Urgence danger immédiat pour un enfant : contactez d'abord les services d'urgence locaux (Algérie : numéros de police et protection de l'enfance).",
          "Signalement plateforme : support@freegeny.com — traitement prioritaire sous 48 h ouvrées.",
          "Nous recommandons un dialogue ouvert entre parents et enfants sur l'usage des écrans et la vie en ligne.",
        ],
      },
    ],
    cta: { label: "Contacter le support", href: "/contact" },
  },
};
