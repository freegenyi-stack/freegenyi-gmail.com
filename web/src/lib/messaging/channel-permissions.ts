import { getRoomMeta } from "./channel-catalog";

/** Rôles autorisés à publier dans chaque type de salon (clé catalogue). */
const POST_RULES: Record<string, string[]> = {
  annonces: ["ecole"],
  "ecole-parents": ["parent", "coparent", "ecole"],
  "parents-communaute": ["parent", "coparent"],
  enseignants: ["enseignant", "ecole"],
  personnel: ["ecole"],
  externe: ["ecole", "ong"],
  direction: ["enseignant", "ecole"],
  docs: ["enseignant", "ecole"],
  classe: ["parent", "coparent", "enseignant", "ecole"],
  "equipe-ong": ["ong"],
  "projets-ong": ["ong"],
};

export function canUserPostInChannel(role: string | null, roomSlug: string): boolean {
  const meta = getRoomMeta(roomSlug, "c");
  const allowed = POST_RULES[meta.key];
  if (!allowed) return true;
  return allowed.includes(role || "parent");
}

export function isAnnouncementsChannel(roomSlug: string): boolean {
  return getRoomMeta(roomSlug, "c").key === "annonces";
}

export function allowBroadcastInChannel(role: string | null, roomSlug: string): boolean {
  return role === "ecole" && isAnnouncementsChannel(roomSlug);
}
