"use client";

import React, { useState, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import MarketingHero from "@/components/MarketingHero";
import { submitContactFormAction } from "@/lib/actions/contact";
import { toast } from "sonner";
import { Mail, Clock, ShieldCheck, HelpCircle } from "lucide-react";

const copy = {
  fr: {
    title: "Contact & support.",
    subtitle:
      "Une question sur Geny, Mon Atelier, la messagerie ou votre compte ? Notre équipe vous répond en français et en arabe.",
    introTitle: "Comment nous joindre",
    intro:
      "FreeGeny est une plateforme éducative pensée pour les familles et les enseignants en Algérie. Avant d'écrire, consultez la FAQ — de nombreuses réponses (inscription, Geny, exploration libre, temps d'écran, suppression de compte) y sont déjà détaillées.",
    responseTitle: "Délai de réponse",
    response:
      "Nous accusons réception de chaque message et visons une réponse sous 48 heures ouvrées maximum. Les signalements relatifs à la protection des mineurs ou à la sécurité d'un compte sont traités en priorité.",
    channelsTitle: "Canaux directs",
    support: "Support utilisateurs",
    supportDesc: "Compte, Geny, atelier, bibliothèque, messagerie, bugs.",
    data: "Données personnelles",
    dataDesc: "Exercice de vos droits, cookies, export ou suppression.",
    press: "Presse & partenariats",
    pressDesc: "Interviews, dossier presse, conventions établissements.",
    general: "Contact général",
    generalDesc: "Toute autre demande institutionnelle ou commerciale.",
    formTitle: "Formulaire de contact",
    name: "Votre nom",
    email: "Votre e-mail",
    subject: "Sujet (optionnel)",
    message: "Décrivez votre demande avec le plus de détails possible (compte, enfant, navigateur, capture d'écran si bug).",
    submit: "Envoyer le message",
    sending: "Envoi…",
    success: "Message envoyé — nous vous répondrons sous 48 h ouvrées maximum.",
    error: "Erreur lors de l'envoi.",
    helpLinks: "Ressources utiles",
    faq: "FAQ complète",
    privacy: "Politique de confidentialité",
    childSafety: "Protection des mineurs",
  },
  ar: {
    title: "اتصل بنا والدعم.",
    subtitle:
      "سؤال حول Geny أو ورشتي أو المراسلة أو حسابك؟ فريقنا يرد بالفرنسية والعربية.",
    introTitle: "كيف تتواصل معنا",
    intro:
      "FreeGeny منصة تربوية موجهة للعائلات والأساتذة في الجزائر. قبل الكتابة، راجع الأسئلة الشائعة — العديد من الإجابات (التسجيل، Geny، الاستكشاف الحر، وقت الشاشة، حذف الحساب) مفصّلة هناك.",
    responseTitle: "مدة الرد",
    response:
      "نؤكد استلام كل رسالة ونهدف إلى الرد خلال 48 ساعة عمل كحد أقصى. بلاغات حماية القاصرين أو أمان الحساب تُعالَج بأولوية.",
    channelsTitle: "قنوات مباشرة",
    support: "دعم المستخدمين",
    supportDesc: "الحساب، Geny، الورشة، المكتبة، المراسلة، الأعطال.",
    data: "البيانات الشخصية",
    dataDesc: "ممارسة حقوقك، ملفات تعريف الارتباط، التصدير أو الحذف.",
    press: "الصحافة والشراكات",
    pressDesc: "مقابلات، ملف صحفي، اتفاقيات المؤسسات.",
    general: "اتصال عام",
    generalDesc: "أي طلب مؤسسي أو تجاري آخر.",
    formTitle: "نموذج الاتصال",
    name: "اسمك",
    email: "بريدك الإلكتروني",
    subject: "الموضوع (اختياري)",
    message: "صف طلبك بأكبر قدر من التفاصيل (الحساب، الطفل، المتصفح، لقطة شاشة إن كان عطلاً).",
    submit: "إرسال الرسالة",
    sending: "جاري الإرسال…",
    success: "تم إرسال رسالتك — سنرد خلال 48 ساعة عمل كحد أقصى.",
    error: "خطأ أثناء الإرسال.",
    helpLinks: "موارد مفيدة",
    faq: "الأسئلة الشائعة",
    privacy: "سياسة الخصوصية",
    childSafety: "حماية القاصرين",
  },
};

const EMAILS = {
  support: "support@freegeny.com",
  data: "support@freegeny.com",
  press: "press@freegeny.com",
  general: "contact@freegeny.com",
} as const;

export default function ContactPage() {
  const locale = useLocale();
  const isAr = locale.endsWith("-ar") || locale === "ar";
  const t = isAr ? copy.ar : copy.fr;
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const res = await submitContactFormAction(fd);
      if ("error" in res && res.error) {
        toast.error(res.error);
        return;
      }
      setSent(true);
      toast.success(t.success);
      form.reset();
    });
  };

  return (
    <main className="min-h-screen bg-white" dir={isAr ? "rtl" : "ltr"}>
      <MarketingHero title={t.title} subtitle={t.subtitle} gradient="from-slate-50 to-white" />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-16 lg:grid-cols-5">
          <div className="space-y-10 lg:col-span-2">
            <div>
              <h2 className="mb-4 font-reem text-xl font-black text-slate-900">{t.introTitle}</h2>
              <p className="text-base leading-relaxed text-slate-600">{t.intro}</p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
              <div className="mb-3 flex items-center gap-2 text-teal-700">
                <Clock className="h-4 w-4" />
                <h3 className="text-sm font-black uppercase tracking-wide">{t.responseTitle}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{t.response}</p>
            </div>

            <div>
              <h3 className="mb-6 text-sm font-black uppercase tracking-wide text-slate-900">
                {t.channelsTitle}
              </h3>
              <ul className="space-y-5">
                {[
                  { label: t.support, desc: t.supportDesc, email: EMAILS.support },
                  { label: t.data, desc: t.dataDesc, email: EMAILS.data, subject: "Données personnelles" },
                  { label: t.press, desc: t.pressDesc, email: EMAILS.press },
                  { label: t.general, desc: t.generalDesc, email: EMAILS.general },
                ].map(({ label, desc, email, subject }) => (
                  <li key={email + label} className="border-b border-slate-100 pb-5 last:border-0">
                    <p className="font-bold text-slate-900">{label}</p>
                    <p className="mt-1 text-sm text-slate-500">{desc}</p>
                    <a
                      href={`mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2 text-slate-900">
                <HelpCircle className="h-4 w-4" />
                <h3 className="text-sm font-black uppercase tracking-wide">{t.helpLinks}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/faq" className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:border-orange-300 hover:text-orange-600">
                  {t.faq}
                </Link>
                <Link href="/privacy" className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:border-orange-300 hover:text-orange-600">
                  {t.privacy}
                </Link>
                <Link href="/child-safety" className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:border-orange-300 hover:text-orange-600">
                  <ShieldCheck className="h-3 w-3" />
                  {t.childSafety}
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-8 font-reem text-2xl font-black text-slate-900">{t.formTitle}</h2>
            {sent && (
              <p className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                {t.success}
              </p>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input
                name="name"
                type="text"
                required
                placeholder={t.name}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 px-6 font-bold outline-none focus:border-orange-500"
              />
              <input
                name="email"
                type="email"
                required
                placeholder={t.email}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 px-6 font-bold outline-none focus:border-orange-500"
              />
              <input
                name="subject"
                type="text"
                placeholder={t.subject}
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 px-6 font-bold outline-none focus:border-orange-500"
              />
              <textarea
                name="message"
                rows={8}
                required
                minLength={10}
                placeholder={t.message}
                className="w-full resize-none rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 px-6 font-bold outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-xl bg-slate-900 py-4 font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-orange-600 disabled:opacity-50"
              >
                {pending ? t.sending : t.submit}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
