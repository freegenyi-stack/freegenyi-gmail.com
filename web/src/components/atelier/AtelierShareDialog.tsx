"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Copy,
  Globe,
  Mail,
  MessageCircle,
  Send,
  Share2,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuthoringKind } from "@/lib/authoring/types";
import {
  listAtelierShareTargetsAction,
  publishAtelierToMurAction,
  shareAtelierResourceMessageAction,
} from "@/lib/actions/authoring";
import { atelierResourceEditPath } from "@/lib/authoring/visual-config";
import { toast } from "sonner";

type ShareTarget = {
  id: number;
  fullName: string | null;
  role: string;
  label: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  resourceId: number;
  resourceKind: AuthoringKind;
  resourceTitle: string;
  locale: string;
  ownerRole?: "enseignant" | "parent";
  showMur?: boolean;
};

function openShareWindow(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=520");
}

export default function AtelierShareDialog({
  open,
  onClose,
  resourceId,
  resourceKind,
  resourceTitle,
  locale,
  ownerRole = "enseignant",
  showMur = ownerRole === "enseignant",
}: Props) {
  const t = useTranslations("TeacherSpace.atelier");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [targets, setTargets] = useState<ShareTarget[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loadingTargets, setLoadingTargets] = useState(false);

  const base = ownerRole === "parent" ? "/dashboard/parent/atelier" : "/dashboard/enseignant/atelier";
  const resourcePath = atelierResourceEditPath(resourceKind, resourceId, base);
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/${locale}${resourcePath}` : `/${locale}${resourcePath}`;

  const shareText = `${resourceTitle} — FreeGeny Mon Atelier`;

  useEffect(() => {
    if (!open) return;
    setLoadingTargets(true);
    listAtelierShareTargetsAction()
      .then((res) => {
        if ("success" in res && res.targets) setTargets(res.targets);
      })
      .finally(() => setLoadingTargets(false));
  }, [open]);

  if (!open) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t("linkCopied"));
    } catch {
      toast.error(t("copyLinkError"));
    }
  };

  const shareWhatsApp = () => {
    openShareWindow(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`);
  };

  const shareGmail = () => {
    const subject = encodeURIComponent(shareText);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    openShareWindow(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`);
  };

  const shareEmail = () => {
    const subject = encodeURIComponent(shareText);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareFacebook = () => {
    openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  };

  const shareTwitter = () => {
    openShareWindow(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    );
  };

  const shareLinkedIn = () => {
    openShareWindow(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    );
  };

  const shareTelegram = () => {
    openShareWindow(
      `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    );
  };

  const shareMessage = () => {
    const targetUserId = parseInt(selectedId, 10);
    if (Number.isNaN(targetUserId)) {
      toast.error(t("shareSelectTarget"));
      return;
    }
    const fd = new FormData();
    fd.set("resourceId", String(resourceId));
    fd.set("locale", locale);
    fd.set("targetUserId", String(targetUserId));

    startTransition(async () => {
      const res = await shareAtelierResourceMessageAction(fd);
      if ("error" in res) toast.error(t("shareError"));
      else {
        toast.success(t("shareSuccess"));
        onClose();
      }
    });
  };

  const publishMur = () => {
    startTransition(async () => {
      const res = await publishAtelierToMurAction(resourceId, locale);
      if ("error" in res) {
        if (res.error === "verification") toast.error(res.detail || t("murVerificationError"));
        else toast.error(("detail" in res && res.detail) || t("murError"));
        return;
      }
      toast.success(t("murSuccess"));
      router.refresh();
      onClose();
    });
  };

  const socialButtons = [
    { id: "copy", icon: Copy, label: t("copyLink"), onClick: copyLink },
    { id: "whatsapp", icon: MessageCircle, label: t("shareWhatsApp"), onClick: shareWhatsApp },
    { id: "gmail", icon: Mail, label: t("shareGmail"), onClick: shareGmail },
    { id: "email", icon: Send, label: t("shareEmail"), onClick: shareEmail },
    { id: "facebook", icon: Share2, label: t("shareFacebook"), onClick: shareFacebook },
    { id: "twitter", icon: Globe, label: t("shareTwitter"), onClick: shareTwitter },
    { id: "linkedin", icon: Globe, label: t("shareLinkedIn"), onClick: shareLinkedIn },
    { id: "telegram", icon: Send, label: t("shareTelegram"), onClick: shareTelegram },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">{t("shareTitle")}</h3>
            <p className="mt-1 truncate text-sm text-slate-500">{resourceTitle}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {socialButtons.map((btn) => (
            <Button
              key={btn.id}
              type="button"
              variant="outline"
              disabled={pending}
              className="h-auto justify-start rounded-xl py-2.5 text-xs font-bold"
              onClick={btn.onClick}
            >
              <btn.icon className="mr-2 h-4 w-4 shrink-0" /> {btn.label}
            </Button>
          ))}
          {showMur && (
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              className="col-span-2 h-auto justify-start rounded-xl border-violet-200 bg-violet-50 py-2.5 text-xs font-black text-violet-900 hover:bg-violet-100"
              onClick={publishMur}
            >
              <Share2 className="mr-2 h-4 w-4" /> {t("shareMur")}
            </Button>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-slate-600">
            <Users className="h-3.5 w-3.5" /> {t("shareMessageTitle")}
          </p>
          {loadingTargets ? (
            <p className="text-sm text-slate-500">{t("shareLoading")}</p>
          ) : targets.length === 0 ? (
            <p className="text-sm text-slate-500">{t("shareNoTargets")}</p>
          ) : (
            <>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
              >
                <option value="">{t("shareSelectTarget")}</option>
                {targets.map((target) => (
                  <option key={target.id} value={target.id}>
                    {target.label} ({target.role})
                  </option>
                ))}
              </select>
              <Button
                type="button"
                disabled={pending || !selectedId}
                onClick={shareMessage}
                className="w-full rounded-xl bg-violet-600 hover:bg-violet-500"
              >
                {t("shareSendMessage")}
              </Button>
            </>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
            {t("cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
}
