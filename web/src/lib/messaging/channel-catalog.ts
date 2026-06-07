/**
 * Taxonomie officielle des espaces de messagerie FreeGeny (messagerie intégrée).
 * Chaque salon suit le préfixe `fg-` + clé stable par école (`school-{id}`).
 */

export type FgRole = "parent" | "enseignant" | "ecole" | "ong";

export type ChannelSection =
  | "announcements"
  | "school"
  | "class"
  | "community"
  | "staff"
  | "external"
  | "documents"
  | "direct";

export type ChannelVisibility = "public" | "private";

export type ChannelTemplate = {
  /** Identifiant logique (déduplication UI) */
  key: string;
  /** Segment après fg- — {schoolSlug} et {level} sont remplacés */
  namePattern: string;
  topicFr: string;
  topicAr: string;
  section: ChannelSection;
  visibility: ChannelVisibility;
  /** Rôles FreeGeny provisionnés automatiquement */
  roles: FgRole[];
  /** L'admin école est aussi ajouté (direction peut lire/écrire dans les salons enseignants) */
  schoolAdminAlsoJoins?: boolean;
};

export type ProvisionContext = {
  schoolSlug: string;
  classLevels: string[];
};

export function buildSchoolSlug(meta: Record<string, unknown>, userId: number): string {
  const schoolId = meta.teacherSchoolId || meta.schoolId;
  if (schoolId) return `school-${schoolId}`;

  const schoolName = String(meta.teacherSchoolName || meta.schoolName || "").trim();
  if (schoolName) {
    const slug = schoolName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    if (slug) return slug;
  }
  return `user-${userId}`;
}

function slugifyLevel(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "classe"
  );
}

export function resolveChannelName(pattern: string, ctx: ProvisionContext, level?: string): string {
  const base = pattern.replace("{schoolSlug}", ctx.schoolSlug);
  if (level) return `fg-${base.replace("{level}", slugifyLevel(level))}`;
  return `fg-${base}`;
}

/** Modèles communs à toutes les écoles */
const SCHOOL_SCOPED: ChannelTemplate[] = [
  {
    key: "annonces",
    namePattern: "annonces-{schoolSlug}",
    topicFr: "Annonces officielles de l'établissement",
    topicAr: "إعلانات رسمية للمؤسسة",
    section: "announcements",
    visibility: "public",
    roles: ["parent", "enseignant", "ecole"],
  },
  {
    key: "ecole-parents",
    namePattern: "ecole-parents-{schoolSlug}",
    topicFr: "Communication officielle école ↔ parents",
    topicAr: "التواصل الرسمي بين المدرسة وأولياء الأمور",
    section: "school",
    visibility: "private",
    roles: ["parent", "ecole"],
  },
  {
    key: "parents-communaute",
    namePattern: "parents-communaute-{schoolSlug}",
    topicFr: "Communauté des parents de l'établissement",
    topicAr: "مجتمع أولياء أمور المؤسسة",
    section: "community",
    visibility: "private",
    roles: ["parent"],
  },
  {
    key: "enseignants",
    namePattern: "enseignants-{schoolSlug}",
    topicFr: "Équipe enseignante · فريق الأساتذة",
    topicAr: "فريق الأساتذة",
    section: "staff",
    visibility: "private",
    roles: ["enseignant", "ecole"],
    schoolAdminAlsoJoins: true,
  },
  {
    key: "personnel",
    namePattern: "personnel-{schoolSlug}",
    topicFr: "Personnel et employés de l'établissement",
    topicAr: "طاقم الموظفين في المؤسسة",
    section: "staff",
    visibility: "private",
    roles: ["ecole"],
  },
  {
    key: "externe",
    namePattern: "externe-{schoolSlug}",
    topicFr: "Partenaires externes (ONG, fournisseurs, institutions)",
    topicAr: "شركاء خارجيون (منظمات، موردون، مؤسسات)",
    section: "external",
    visibility: "private",
    roles: ["ecole", "ong"],
  },
  {
    key: "direction",
    namePattern: "direction-{schoolSlug}",
    topicFr: "Direction · الإدارة",
    topicAr: "الإدارة",
    section: "school",
    visibility: "private",
    roles: ["ecole", "enseignant"],
  },
  {
    key: "docs",
    namePattern: "docs-{schoolSlug}",
    topicFr: "Documents partagés",
    topicAr: "وثائق مشتركة",
    section: "documents",
    visibility: "private",
    roles: ["enseignant", "ecole"],
  },
];

const CLASS_TEMPLATE: ChannelTemplate = {
  key: "classe",
  namePattern: "classe-{level}-{schoolSlug}",
  topicFr: "Ma classe",
  topicAr: "صفّي",
  section: "class",
  visibility: "private",
  roles: ["parent", "enseignant", "ecole"],
};

const ONG_TEMPLATES: ChannelTemplate[] = [
  {
    key: "equipe-ong",
    namePattern: "equipe-ong-{schoolSlug}",
    topicFr: "Équipe ONG",
    topicAr: "فريق المنظمة",
    section: "staff",
    visibility: "private",
    roles: ["ong"],
  },
  {
    key: "projets-ong",
    namePattern: "projets-ong-{schoolSlug}",
    topicFr: "Projets terrain",
    topicAr: "مشاريع ميدانية",
    section: "community",
    visibility: "private",
    roles: ["ong"],
  },
];

export function channelsForRole(
  role: FgRole,
  ctx: ProvisionContext
): Array<{ name: string; topic: string; visibility: ChannelVisibility; section: ChannelSection; key: string }> {
  const out: Array<{ name: string; topic: string; visibility: ChannelVisibility; section: ChannelSection; key: string }> = [];

  if (role === "ong") {
    const uid = ctx.schoolSlug.startsWith("user-") ? ctx.schoolSlug.slice(5) : ctx.schoolSlug;
    for (const tpl of ONG_TEMPLATES) {
      const name = `fg-${tpl.key}-ong-${uid}`;
      out.push({
        name,
        topic: `${tpl.topicFr} · ${tpl.topicAr}`,
        visibility: tpl.visibility,
        section: tpl.section,
        key: tpl.key,
      });
    }
    return out;
  }

  const templates =
    role === "ecole" ? SCHOOL_SCOPED : SCHOOL_SCOPED.filter((t) => t.roles.includes(role));

  for (const tpl of templates) {
    const name = resolveChannelName(tpl.namePattern, ctx);
    if (!out.some((c) => c.key === tpl.key)) {
      out.push({
        name,
        topic: `${tpl.topicFr} · ${tpl.topicAr}`,
        visibility: tpl.visibility,
        section: tpl.section,
        key: tpl.key,
      });
    }
  }

  const levels =
    role === "enseignant" && ctx.classLevels.length
      ? ctx.classLevels
      : role === "parent" && ctx.classLevels.length
        ? ctx.classLevels
        : role === "ecole"
          ? ctx.classLevels.length
            ? ctx.classLevels
            : []
          : ctx.classLevels;

  const classLevels = levels.length ? levels : role === "enseignant" ? ["classe"] : role === "parent" ? [] : [];

  for (const level of classLevels) {
    const name = resolveChannelName(CLASS_TEMPLATE.namePattern, ctx, level);
    out.push({
      name,
      topic: `${CLASS_TEMPLATE.topicFr} ${level} · ${CLASS_TEMPLATE.topicAr}`,
      visibility: CLASS_TEMPLATE.visibility,
      section: CLASS_TEMPLATE.section,
      key: `${CLASS_TEMPLATE.key}-${slugifyLevel(level)}`,
    });
  }

  return out;
}

/** Rétro-compatibilité noms historiques → clé UI */
const LEGACY_PREFIXES: Array<{ match: RegExp; key: string; section: ChannelSection }> = [
  { match: /^fg-annonces-/, key: "annonces", section: "announcements" },
  { match: /^fg-parents-communaute-/, key: "parents-communaute", section: "community" },
  { match: /^fg-ecole-parents-/, key: "ecole-parents", section: "school" },
  { match: /^fg-collegues-/, key: "enseignants", section: "staff" },
  { match: /^fg-enseignants-/, key: "enseignants", section: "staff" },
  { match: /^fg-parents-/, key: "ecole-parents", section: "school" },
  { match: /^fg-staff-/, key: "personnel", section: "staff" },
  { match: /^fg-classe-/, key: "classe", section: "class" },
  { match: /^fg-docs-/, key: "docs", section: "documents" },
  { match: /^fg-direction-/, key: "direction", section: "school" },
  { match: /^fg-externe-/, key: "externe", section: "external" },
  { match: /^fg-personnel-/, key: "personnel", section: "staff" },
  { match: /^fg-equipe-ong-/, key: "equipe-ong", section: "staff" },
  { match: /^fg-projets-ong-/, key: "projets-ong", section: "community" },
];

export function getRoomMeta(roomName: string, roomType: "c" | "p" | "d" = "c"): { key: string; section: ChannelSection; labelKey: string } {
  if (roomType === "d") {
    return { key: "dm", section: "direct", labelKey: "roomDirect" };
  }
  for (const leg of LEGACY_PREFIXES) {
    if (leg.match.test(roomName)) {
      return { key: leg.key, section: leg.section, labelKey: roomLabelKey(leg.key) };
    }
  }
  return { key: roomName, section: "community", labelKey: "channelDefault" };
}

function roomLabelKey(key: string): string {
  const map: Record<string, string> = {
    annonces: "roomAnnouncements",
    "ecole-parents": "roomSchoolParents",
    "parents-communaute": "roomParentsCommunity",
    enseignants: "roomTeachers",
    collegues: "roomColleagues",
    personnel: "roomStaff",
    externe: "roomExternal",
    direction: "roomDirection",
    docs: "roomDocs",
    classe: "roomClass",
    parents: "roomParents",
    staff: "roomStaff",
    "equipe-ong": "roomTeam",
    "projets-ong": "roomProjects",
    dm: "roomDirect",
  };
  return map[key] || "channelDefault";
}

export const SECTION_ORDER: ChannelSection[] = [
  "announcements",
  "school",
  "class",
  "community",
  "staff",
  "external",
  "documents",
  "direct",
];
