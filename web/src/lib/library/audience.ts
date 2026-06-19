export type LibraryAudience = "teachers" | "parents" | "family";

export const LIBRARY_AUDIENCES: LibraryAudience[] = ["teachers", "parents", "family"];

export function audiencesForContext(ctx: "teacher" | "parent" | "child"): LibraryAudience[] {
  switch (ctx) {
    case "teacher":
      return ["teachers"];
    case "parent":
      return ["parents", "family"];
    case "child":
      return ["family"];
  }
}

export function canAudienceAccessBook(
  audience: LibraryAudience,
  ctx: "teacher" | "parent" | "child"
): boolean {
  return audiencesForContext(ctx).includes(audience);
}

export function parseAudience(raw: string | null | undefined): LibraryAudience {
  if (raw === "teachers" || raw === "parents" || raw === "family") return raw;
  return "family";
}
