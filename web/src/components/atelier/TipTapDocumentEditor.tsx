"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SchoolHeaderInfo } from "@/lib/authoring/types";

type Props = {
  initialJson: string;
  onChange?: (json: string) => void;
  header?: SchoolHeaderInfo | null;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
};

function ToolbarButton({
  active,
  onClick,
  children,
  title,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-lg p-2 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700",
        active && "bg-violet-100 text-violet-800"
      )}
    >
      {children}
    </button>
  );
}

function parseInitial(raw: string) {
  try {
    return JSON.parse(raw) as object;
  } catch {
    return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: raw || "" }] }] };
  }
}

export default function TipTapDocumentEditor({
  initialJson,
  onChange,
  header,
  placeholder = "Rédigez votre contenu…",
  className,
  readOnly = false,
}: Props) {
  const t = useTranslations("TeacherSpace.atelier");
  const lastApplied = useRef(initialJson);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !readOnly,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: parseInitial(initialJson),
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[320px] px-4 py-3 focus:outline-none text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange?.(JSON.stringify(ed.getJSON()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    if (initialJson && initialJson !== current && initialJson !== lastApplied.current) {
      lastApplied.current = initialJson;
      editor.commands.setContent(parseInitial(initialJson));
    }
  }, [initialJson, editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt(t("editorLinkPrompt"));
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor, t]);

  const addImage = useCallback(() => {
    if (!editor || readOnly) return;
    imageInputRef.current?.click();
  }, [editor, readOnly]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      setUploadingImage(true);
      try {
        const fd = new FormData();
        fd.set("file", file);
        const res = await fetch("/api/authoring/media", { method: "POST", body: fd });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) throw new Error(data.error ?? "upload_failed");
        editor.chain().focus().setImage({ src: data.url }).run();
      } finally {
        setUploadingImage(false);
      }
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
      {header && (
        <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-teal-50 px-4 py-3 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-violet-700">{header.schoolName}</p>
          <p className="text-sm font-bold text-slate-800">{header.teacherName}</p>
          <p className="text-[11px] text-slate-500">
            {header.subjects.join(" · ")} — {header.levels.join(" · ")}
          </p>
          <p className="text-[10px] font-bold text-slate-400">{t("editorSchoolYear")} {header.schoolYear}</p>
        </div>
      )}

      {!readOnly && (
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-100 bg-slate-50/80 px-2 py-1.5">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title={t("editorUndo")}>
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title={t("editorRedo")}>
          <Redo className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title={t("editorBold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title={t("editorItalic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title={t("editorUnderline")}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title={t("editorHeading")}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title={t("editorBulletList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title={t("editorOrderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title={t("editorAlignLeft")}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title={t("editorAlignCenter")}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title={t("editorAlignRight")}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <ToolbarButton onClick={addLink} title={t("editorLink")}>
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title={t("editorImage")} disabled={uploadingImage}>
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void uploadImage(f);
            e.target.value = "";
          }}
        />
      </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
