import type { PedagogyPostType } from "./constants";

export type PedagogyShareDto = {
  id: number;
  postType: PedagogyPostType;
  title: string;
  description: string | null;
  educationLevel: string;
  subject: string | null;
  viewCount: number;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
  author: {
    id: number;
    fullName: string;
    image: string | null;
    subject: string | null;
    avatarConfig?: { id: string; style?: string } | null;
    avatarMode?: "photo" | "catalog";
  };
  attachments: {
    id: number;
    fileUrl: string;
    fileName: string;
    mimeType: string | null;
  }[];
  /** Ressource Mon Atelier liée (exercice / leçon publiée depuis l'atelier) */
  authoringResourceId?: number | null;
  authoringResourceKind?: "document" | "activity" | "h5p" | null;
};
