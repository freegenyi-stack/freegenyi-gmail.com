/** Rôles auteur — enseignant aujourd'hui, parent demain (même moteur). */
export type AuthoringOwnerRole = "enseignant" | "parent";

export type AuthoringKind = "document" | "activity" | "h5p" | "visual" | "mindmap";

export type AuthoringStatus = "draft" | "published" | "archived";

export type AuthoringResourceType =
  | "lesson"
  | "exam"
  | "control"
  | "activity"
  | "revision"
  | "planning"
  | "parent_sheet"
  | "other";

export type AuthoringResourceRow = {
  id: number;
  ownerUserId: number;
  ownerRole: AuthoringOwnerRole;
  kind: AuthoringKind;
  title: string;
  resourceType: AuthoringResourceType;
  subject: string | null;
  schoolLevel: string | null;
  schoolYear: string | null;
  folderId: number | null;
  status: AuthoringStatus;
  contentJson: string;
  h5pContentId: string | null;
  h5pLibrary: string | null;
  templateId: string | null;
  tags: string | null;
  legacyDocumentId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export function isActivityKind(kind: string): boolean {
  return kind === "activity" || kind === "h5p";
}

export type AuthoringResourceDto = {
  id: number;
  kind: AuthoringKind;
  title: string;
  resourceType: AuthoringResourceType;
  subject: string | null;
  schoolLevel: string | null;
  schoolYear: string | null;
  folderId: number | null;
  status: AuthoringStatus;
  tags: string | null;
  h5pContentId: string | null;
  h5pLibrary: string | null;
  templateId: string | null;
  updatedAt: string;
};

export type SchoolHeaderInfo = {
  schoolName: string;
  teacherName: string;
  subjects: string[];
  levels: string[];
  schoolYear: string;
  logoUrl?: string | null;
};
