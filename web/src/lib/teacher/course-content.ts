export type CourseEpisode = {
  episode: number;
  titleFr: string;
  titleAr: string;
  embedUrl: string | null;
};

export type ParsedCourseContent = {
  episodes: CourseEpisode[];
};

function toEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.includes("/embed/")) return trimmed;
  try {
    const u = new URL(trimmed);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      let id = u.searchParams.get("v");
      if (!id && u.hostname.includes("youtu.be")) id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    if (u.hostname.includes("player.vimeo.com")) return trimmed;
  } catch {
    return trimmed.startsWith("http") ? trimmed : null;
  }
  return trimmed.startsWith("http") ? trimmed : null;
}

/** Parse external_url : URL simple, JSON épisodes, ou null → placeholders. */
export function parseCourseContent(input: {
  externalUrl: string | null;
  kind: string;
  totalEpisodes: number;
  titleFr: string;
  titleAr: string;
}): ParsedCourseContent {
  const total = Math.max(1, input.totalEpisodes);

  if (input.externalUrl?.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(input.externalUrl) as {
        episodes?: Array<{ url?: string; titleFr?: string; titleAr?: string }>;
      };
      if (Array.isArray(parsed.episodes) && parsed.episodes.length > 0) {
        return {
          episodes: parsed.episodes.map((ep, i) => ({
            episode: i + 1,
            titleFr: ep.titleFr ?? `${input.titleFr} — ${i + 1}`,
            titleAr: ep.titleAr ?? `${input.titleAr} — ${i + 1}`,
            embedUrl: ep.url ? toEmbedUrl(ep.url) : null,
          })),
        };
      }
    } catch {
      /* fall through */
    }
  }

  if (input.externalUrl?.trim()) {
    const embed = toEmbedUrl(input.externalUrl);
    if (input.kind === "series" && total > 1) {
      return {
        episodes: Array.from({ length: total }, (_, i) => ({
          episode: i + 1,
          titleFr: `${input.titleFr} — Épisode ${i + 1}`,
          titleAr: `${input.titleAr} — الحلقة ${i + 1}`,
          embedUrl: i === 0 ? embed : null,
        })),
      };
    }
    return {
      episodes: [
        {
          episode: 1,
          titleFr: input.titleFr,
          titleAr: input.titleAr,
          embedUrl: embed,
        },
      ],
    };
  }

  return {
    episodes: Array.from({ length: total }, (_, i) => ({
      episode: i + 1,
      titleFr: `${input.titleFr} — Épisode ${i + 1}`,
      titleAr: `${input.titleAr} — الحلقة ${i + 1}`,
      embedUrl: null,
    })),
  };
}
