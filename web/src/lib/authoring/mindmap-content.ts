export type MindmapEditorMode = "excalidraw" | "markmap";

export type MindmapContentV2 = {
  schemaVersion: 2;
  mode: MindmapEditorMode;
  excalidraw?: {
    elements: unknown[];
    appState?: Record<string, unknown>;
    files?: Record<string, unknown>;
  };
  markdown?: string;
};

type LegacyMindElixirNode = {
  topic?: string;
  children?: LegacyMindElixirNode[];
};

function mindElixirToMarkdown(node: LegacyMindElixirNode, level = 1): string {
  const topic = node.topic?.trim() || "";
  if (!topic) return "";
  const hashes = "#".repeat(Math.min(level, 6));
  let md = `${hashes} ${topic}\n`;
  for (const child of node.children ?? []) {
    if (child.children?.length) {
      md += mindElixirToMarkdown(child, level + 1);
    } else if (child.topic?.trim()) {
      md += `- ${child.topic.trim()}\n`;
    }
  }
  return md;
}

function migrateLegacyMindElixir(raw: Record<string, unknown>): MindmapContentV2 {
  const nodeData = raw.nodeData as LegacyMindElixirNode | undefined;
  const markdown = nodeData?.topic
    ? mindElixirToMarkdown(nodeData)
    : "# Sujet\n\n## Idée 1\n- \n\n## Idée 2\n- \n";
  return { schemaVersion: 2, mode: "markmap", markdown };
}

export function parseMindmapContent(raw: string, fallbackTitle = "Sujet"): MindmapContentV2 {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (parsed.schemaVersion === 2 && (parsed.mode === "excalidraw" || parsed.mode === "markmap")) {
      return parsed as MindmapContentV2;
    }
    if (parsed.nodeData) {
      return migrateLegacyMindElixir(parsed);
    }
  } catch {
    /* ignore */
  }
  return buildEmptyMindmapContent("markmap", fallbackTitle);
}

export function buildEmptyMindmapContent(
  mode: MindmapEditorMode,
  title: string,
  opts?: { isAr?: boolean }
): MindmapContentV2 {
  const root = title.trim() || (opts?.isAr ? "الموضوع" : "Sujet");
  if (mode === "excalidraw") {
    return {
      schemaVersion: 2,
      mode: "excalidraw",
      excalidraw: {
        elements: [],
        appState: {
          viewBackgroundColor: "#ffffff",
          gridSize: null,
        },
        files: {},
      },
    };
  }
  return {
    schemaVersion: 2,
    mode: "markmap",
    markdown: `# ${root}\n\n## ${opts?.isAr ? "فكرة 1" : "Idée 1"}\n- \n\n## ${opts?.isAr ? "فكرة 2" : "Idée 2"}\n- \n`,
  };
}

export function serializeMindmapContent(content: MindmapContentV2): string {
  return JSON.stringify(content);
}
