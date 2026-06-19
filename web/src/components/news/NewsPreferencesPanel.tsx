"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import InterestPicker from "@/components/onboarding/InterestPicker";
import { TEACHER_NEWS_TOPICS } from "@/lib/teacher/news-constants";
import { MAX_NOTIFICATION_INTERESTS } from "@/lib/onboarding/interest-topics";
import { updateNewsPreferencesAction } from "@/lib/actions/news_preferences";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  locale: string;
  compact?: boolean;
  role?: "enseignant" | "parent";
};

export default function NewsPreferencesPanel({ locale, compact, role = "enseignant" }: Props) {
  const t = useTranslations("News");
  const isAr = locale.endsWith("-ar") || locale === "ar";
  const isParent = role === "parent";
  const [interests, setInterests] = useState<string[]>([]);
  const [enabledTopics, setEnabledTopics] = useState<string[]>([]);
  const [pushBreaking, setPushBreaking] = useState(true);
  const [pushDigest, setPushDigest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/news/preferences");
      const data = await res.json();
      if (res.ok) {
        setInterests(data.interests ?? []);
        setEnabledTopics(data.preferences?.enabledTopics ?? []);
        setPushBreaking(data.preferences?.pushBreaking !== false);
        setPushDigest(data.preferences?.pushDigest === true);
      }
      setLoading(false);
    })();
  }, []);

  const toggleTopic = (id: string) => {
    setEnabledTopics((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const save = async () => {
    if (interests.length !== MAX_NOTIFICATION_INTERESTS) {
      toast.error(t("interestsRequired", { count: MAX_NOTIFICATION_INTERESTS }));
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.set("notification_interests", JSON.stringify(interests));
    enabledTopics.forEach((tpc) => fd.append("enabled_topics", tpc));
    if (pushBreaking) fd.set("push_breaking", "on");
    if (pushDigest) fd.set("push_digest", "on");

    const result = await updateNewsPreferencesAction(fd);
    setSaving(false);
    if ("success" in result && result.success) toast.success(t("prefsSaved"));
    else toast.error("error" in result ? result.error : t("prefsError"));
  };

  if (loading) {
    return <p className="text-sm text-slate-400 animate-pulse">{t("prefsLoading")}</p>;
  }

  return (
    <div className={cn("space-y-5", compact ? "" : "rounded-2xl border border-slate-200 bg-white p-5")}>
      {!compact && (
        <>
          <h3 className="text-base font-black text-slate-900">{t("prefsTitle")}</h3>
          <p className="text-sm text-slate-500">{t("prefsDesc")}</p>
        </>
      )}

      <div>
        <p className="mb-2 text-xs font-black uppercase text-slate-500">{t("prefsInterests")}</p>
        <InterestPicker value={interests} onChange={setInterests} compact={compact} />
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase text-slate-500">{t("prefsTopics")}</p>
        <div className="flex flex-wrap gap-2">
          {TEACHER_NEWS_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => toggleTopic(topic.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold border transition",
                enabledTopics.includes(topic.id)
                  ? isParent
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-slate-600 border-slate-200"
              )}
            >
              {isAr ? topic.labelAr : topic.labelFr}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-slate-400">{t("prefsTopicsHint")}</p>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <input type="checkbox" checked={pushBreaking} onChange={(e) => setPushBreaking(e.target.checked)} />
          {t("prefsPushBreaking")}
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <input type="checkbox" checked={pushDigest} onChange={(e) => setPushDigest(e.target.checked)} />
          {t("prefsPushDigest")}
        </label>
      </div>

      <Button
        type="button"
        onClick={() => void save()}
        disabled={saving}
        className={cn(
          "rounded-xl font-bold",
          isParent ? "bg-orange-500 hover:bg-orange-400" : "bg-teal-600 hover:bg-teal-500"
        )}
      >
        {saving ? t("prefsSaving") : t("prefsSave")}
      </Button>
    </div>
  );
}
