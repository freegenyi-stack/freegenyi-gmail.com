"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import {
  User,
  Bell,
  Phone,
  BarChart3,
  Eye,
  Save,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TeacherPageHeader } from "./TeacherShell";
import TeacherAvatarPicker from "./TeacherAvatarPicker";
import TeacherPublicProfileCard from "./TeacherPublicProfileCard";
import InterestPicker from "@/components/onboarding/InterestPicker";
import { updateTeacherProfileAction } from "@/lib/actions/teacher_profile";
import type { TeacherProfileFormState, TeacherPublicProfile, TeacherAvailabilitySlot } from "@/lib/teacher/profile.types";
import type { UserReadingStats } from "@/lib/library/user-library.server";
import { PEDAGOGY_LEVELS, PEDAGOGY_SUBJECTS_AR, PEDAGOGY_SUBJECTS_FR } from "@/lib/pedagogy/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TABS = ["identity", "preferences", "contact", "activity", "preview"] as const;
const DAYS: TeacherAvailabilitySlot["day"][] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

type Props = {
  initial: TeacherProfileFormState;
  publicPreview: TeacherPublicProfile;
  verificationApproved?: boolean;
  readingStats?: UserReadingStats | null;
};

export default function TeacherProfileClient({
  initial,
  publicPreview,
  verificationApproved = true,
  readingStats,
}: Props) {
  const t = useTranslations("TeacherProfile");
  const tv = useTranslations("TeacherSpace.verification");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const subjects = isRTL ? PEDAGOGY_SUBJECTS_AR : PEDAGOGY_SUBJECTS_FR;

  const [tab, setTab] = useState<(typeof TABS)[number]>("identity");
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [fullName, setFullName] = useState(initial.fullName);
  const [phone, setPhone] = useState(initial.phone);
  const [bio, setBio] = useState(initial.bio);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(initial.subjects);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initial.levels);
  const [avatarMode, setAvatarMode] = useState(initial.avatarMode);
  const [avatarId, setAvatarId] = useState(initial.avatarConfig?.id || "sage-teal");
  const [interests, setInterests] = useState(initial.notificationInterests);
  const [pushMur, setPushMur] = useState(initial.pushPrefs.mur);
  const [pushMessages, setPushMessages] = useState(initial.pushPrefs.messages);
  const [pushDigest, setPushDigest] = useState(initial.pushPrefs.digest);
  const [pushNews, setPushNews] = useState(initial.pushPrefs.news);
  const [contactEnabled, setContactEnabled] = useState(initial.contactEnabled);
  const [contactAllowParents, setContactAllowParents] = useState(initial.contactAllowParents);
  const [contactAllowTeachers, setContactAllowTeachers] = useState(initial.contactAllowTeachers);
  const [contactNote, setContactNote] = useState(initial.contactNote);
  const [channels, setChannels] = useState(initial.contactChannels);
  const [availEnabled, setAvailEnabled] = useState(initial.availability.enabled);
  const [acceptsTutoring, setAcceptsTutoring] = useState(initial.availability.acceptsTutoring);
  const [slots, setSlots] = useState<TeacherAvailabilitySlot[]>(initial.availability.slots);

  const toggleSubject = (s: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };
  const toggleLevel = (l: string) => {
    setSelectedLevels((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );
  };

  const addSlot = () => {
    setSlots((prev) => [...prev, { day: "mon", from: "14:00", to: "17:00" }]);
  };

  const handleSave = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.set("full_name", fullName);
    fd.set("phone", phone);
    fd.set("bio", bio);
    selectedSubjects.forEach((s) => fd.append("subjects", s));
    selectedLevels.forEach((l) => fd.append("levels", l));
    fd.set("avatar_mode", avatarMode);
    fd.set("avatar_id", avatarId);
    if (photoFile) fd.set("photo", photoFile);
    interests.forEach((i) => fd.append("notification_interests", i));
    if (contactEnabled) fd.set("contact_enabled", "on");
    if (contactAllowParents) fd.set("contact_allow_parents", "on");
    if (contactAllowTeachers) fd.set("contact_allow_teachers", "on");
    fd.set("contact_note", contactNote);
    fd.set("contact_phone", channels.phone?.value || phone);
    if (channels.phone?.visible) fd.set("visible_phone", "on");
    fd.set("contact_whatsapp", channels.whatsapp?.value || "");
    if (channels.whatsapp?.visible) fd.set("visible_whatsapp", "on");
    fd.set("contact_facebook", channels.facebook?.value || "");
    if (channels.facebook?.visible) fd.set("visible_facebook", "on");
    fd.set("contact_linkedin", channels.linkedin?.value || "");
    if (channels.linkedin?.visible) fd.set("visible_linkedin", "on");
    fd.set("contact_email_pro", channels.emailPro?.value || "");
    if (channels.emailPro?.visible) fd.set("visible_email_pro", "on");
    if (pushMur) fd.set("push_mur", "on");
    if (pushMessages) fd.set("push_messages", "on");
    if (pushDigest) fd.set("push_digest", "on");
    if (pushNews) fd.set("push_news", "on");
    if (availEnabled) fd.set("availability_enabled", "on");
    if (acceptsTutoring) fd.set("accepts_tutoring", "on");
    fd.set("availability_slots", JSON.stringify(slots));

    const res = await updateTeacherProfileAction(fd);
    if ("error" in res) {
      toast.error(res.error);
    } else {
      toast.success(t("saved"));
    }
    setSaving(false);
  };

  const previewProfile: TeacherPublicProfile = {
    ...publicPreview,
    fullName,
    bio,
    subjects: selectedSubjects,
    levels: selectedLevels,
    contactEnabled,
    contactNote,
    contactChannels: contactEnabled ? channels : {},
    availability: { enabled: availEnabled, acceptsTutoring, slots },
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <TeacherPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} />

      <div className="mb-6 flex gap-1 overflow-x-auto pb-1">
        {TABS.map((id) => {
          const icons = { identity: User, preferences: Bell, contact: Phone, activity: BarChart3, preview: Eye };
          const Icon = icons[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wide",
                tab === id ? "bg-teal-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-600"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t(`tabs.${id}`)}
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
        {tab === "identity" && (
          <div className="space-y-6">
            <TeacherAvatarPicker
              avatarMode={avatarMode}
              avatarId={avatarId}
              image={initial.image}
              fullName={fullName}
              onModeChange={setAvatarMode}
              onAvatarChange={setAvatarId}
              onPhotoSelected={setPhotoFile}
            />
            <Field label={t("fullName")}>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl font-bold" />
            </Field>
            <Field label={t("phone")}>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl font-bold" dir="ltr" />
            </Field>
            <Field label={t("school")}>
              <Input value={initial.schoolName} readOnly className="rounded-xl bg-slate-50 font-bold text-slate-500" />
            </Field>
            <Field label={t("bio")}>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                placeholder={t("bioPlaceholder")}
              />
            </Field>
            <Field label={t("subjects")}>
              <div className="flex flex-wrap gap-2">
                {subjects.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSubject(s)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-bold border-2 transition",
                      selectedSubjects.includes(s) ? "border-teal-500 bg-teal-50 text-teal-800" : "border-slate-100"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={t("levels")}>
              <div className="flex flex-wrap gap-2">
                {PEDAGOGY_LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => toggleLevel(l)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-black border-2 transition",
                      selectedLevels.includes(l) ? "border-teal-500 bg-teal-600 text-white" : "border-slate-100"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {tab === "preferences" && (
          <div className="space-y-6">
            <InterestPicker value={interests} onChange={setInterests} />
            <div className="space-y-3">
              <p className="text-sm font-black text-slate-900">{t("pushTitle")}</p>
              <Toggle checked={pushMur} onChange={setPushMur} label={t("pushMur")} />
              <Toggle checked={pushMessages} onChange={setPushMessages} label={t("pushMessages")} />
              <Toggle checked={pushDigest} onChange={setPushDigest} label={t("pushDigest")} />
              <Toggle checked={pushNews} onChange={setPushNews} label={t("pushNews")} />
            </div>
          </div>
        )}

        {tab === "contact" && (
          <div className="space-y-6">
            {!verificationApproved && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                {tv("limitedContact")}
              </div>
            )}
            <div className="rounded-2xl border-2 border-teal-100 bg-teal-50/50 p-4">
              <Toggle
                checked={contactEnabled && verificationApproved}
                onChange={setContactEnabled}
                label={t("contactMaster")}
                disabled={!verificationApproved}
              />
              <p className="mt-2 text-xs text-teal-800">{t("contactMasterHint")}</p>
            </div>
            {contactEnabled && (
              <>
                <Toggle checked={contactAllowParents} onChange={setContactAllowParents} label={t("contactAllowParents")} />
                <Toggle checked={contactAllowTeachers} onChange={setContactAllowTeachers} label={t("contactAllowTeachers")} />
                <Field label={t("contactNote")}>
                  <Input value={contactNote} onChange={(e) => setContactNote(e.target.value)} placeholder={t("contactNotePlaceholder")} className="rounded-xl" />
                </Field>
                <p className="text-xs font-bold text-slate-500">{t("contactMessagingOnly")}</p>
                {(["phone", "whatsapp", "facebook", "linkedin", "emailPro"] as const).map((key) => (
                  <ChannelField
                    key={key}
                    label={t(`channel.${key}`)}
                    value={channels[key]?.value || ""}
                    visible={channels[key]?.visible || false}
                    onValue={(v) => setChannels((c) => ({ ...c, [key]: { ...c[key], value: v } }))}
                    onVisible={(v) => setChannels((c) => ({ ...c, [key]: { ...c[key], value: c[key]?.value || "", visible: v } }))}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {tab === "activity" && (
          <div className="space-y-6">
            {readingStats && (
              <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-orange-50 p-5">
                <p className="mb-3 text-xs font-black uppercase text-violet-700">{t("librarySection")}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <MiniStat label={t("libraryBooksFinished")} value={readingStats.booksFinished} />
                  <MiniStat label={t("libraryBooksReading")} value={readingStats.booksReading} />
                  <MiniStat label={t("libraryPagesMonth")} value={readingStats.pagesThisMonth} />
                  <MiniStat label={t("libraryPagesToday")} value={readingStats.pagesToday} />
                </div>
                <Link
                  href="/dashboard/enseignant/bibliotheque"
                  className="mt-4 block text-center text-sm font-black text-violet-700 hover:underline"
                >
                  {t("openLibrary")} →
                </Link>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              <MiniStat label={t("statPosts")} value={publicPreview.stats.publications} />
              <MiniStat label={t("statViews")} value={publicPreview.stats.views} />
              <MiniStat label={t("statLikes")} value={publicPreview.stats.likes} />
            </div>
            <Link href="/dashboard/enseignant/mur" className="block text-center text-sm font-black text-teal-600 hover:underline">
              {t("seeWall")} →
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100 text-center">
                <p className="text-[10px] font-black uppercase text-amber-800">{t("rankPosts")}</p>
                <p className="text-xl font-black text-amber-900">
                  #{publicPreview.stats.rankPosts}
                  <span className="text-xs font-bold text-amber-700"> / {publicPreview.stats.totalTeachers}</span>
                </p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-4 border border-rose-100 text-center">
                <p className="text-[10px] font-black uppercase text-rose-800">{t("rankLikes")}</p>
                <p className="text-xl font-black text-rose-900">
                  #{publicPreview.stats.rankLikes}
                  <span className="text-xs font-bold text-rose-700"> / {publicPreview.stats.totalTeachers}</span>
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
              <Toggle checked={availEnabled} onChange={setAvailEnabled} label={t("availabilityEnabled")} />
              <Toggle checked={acceptsTutoring} onChange={setAcceptsTutoring} label={t("acceptsTutoringToggle")} />
              {availEnabled && (
                <>
                  {slots.map((slot, i) => (
                    <div key={i} className="flex flex-wrap gap-2 items-center">
                      <select
                        value={slot.day}
                        onChange={(e) => {
                          const next = [...slots];
                          next[i] = { ...slot, day: e.target.value as TeacherAvailabilitySlot["day"] };
                          setSlots(next);
                        }}
                        className="rounded-xl border px-2 py-2 text-xs font-bold"
                      >
                        {DAYS.map((d) => (
                          <option key={d} value={d}>{t(`days.${d}`)}</option>
                        ))}
                      </select>
                      <Input type="time" value={slot.from} onChange={(e) => {
                        const next = [...slots]; next[i] = { ...slot, from: e.target.value }; setSlots(next);
                      }} className="w-28 rounded-xl" />
                      <span>–</span>
                      <Input type="time" value={slot.to} onChange={(e) => {
                        const next = [...slots]; next[i] = { ...slot, to: e.target.value }; setSlots(next);
                      }} className="w-28 rounded-xl" />
                      <button type="button" onClick={() => setSlots(slots.filter((_, j) => j !== i))} className="text-red-500 text-xs font-bold">×</button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addSlot} className="rounded-xl text-xs font-black uppercase">
                    + {t("addSlot")}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {tab === "preview" && (
          <>
            {!verificationApproved && (
              <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                {tv("limitedPublic")}
              </div>
            )}
            <TeacherPublicProfileCard profile={{ ...previewProfile, isOwnProfile: true }} showActions={false} />
          </>
        )}

        {tab !== "preview" && (
          <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <Button
              type="button"
              disabled={saving}
              onClick={() => void handleSave()}
              className="rounded-2xl bg-teal-600 px-8 py-6 font-black uppercase hover:bg-teal-500"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? t("saving") : t("save")}
            </Button>
            <Link href="/dashboard/settings">
              <Button type="button" variant="outline" className="rounded-2xl py-6 font-black uppercase">
                <Shield className="mr-2 h-4 w-4" />
                {t("securityLink")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-black uppercase text-slate-500">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label className={cn("flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3", disabled ? "opacity-60" : "cursor-pointer")}>
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative h-7 w-12 rounded-full transition",
          checked ? "bg-teal-600" : "bg-slate-200"
        )}
      >
        <span className={cn("absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition", checked ? "left-5" : "left-0.5")} />
      </button>
    </label>
  );
}

function ChannelField({
  label,
  value,
  visible,
  onValue,
  onVisible,
}: {
  label: string;
  value: string;
  visible: boolean;
  onValue: (v: string) => void;
  onVisible: (v: boolean) => void;
}) {
  const t = useTranslations("TeacherProfile");
  return (
    <div className="rounded-xl border border-slate-100 p-3 space-y-2">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <Input value={value} onChange={(e) => onValue(e.target.value)} className="rounded-xl text-sm" dir="ltr" />
      <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
        <input type="checkbox" checked={visible} onChange={(e) => onVisible(e.target.checked)} />
        {t("showOnCard")}
      </label>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-teal-50 p-4 text-center border border-teal-100">
      <p className="text-2xl font-black text-teal-900">{value}</p>
      <p className="text-[9px] font-black uppercase text-teal-700">{label}</p>
    </div>
  );
}
