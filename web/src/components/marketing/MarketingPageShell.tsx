"use client";

import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import MarketingHero from "@/components/MarketingHero";
import { cn } from "@/lib/utils";
import type { MarketingPageContent } from "@/content/marketing/types";
import { isArabicLocale } from "@/content/marketing";

type Props = {
  page: MarketingPageContent;
};

export default function MarketingPageShell({ page }: Props) {
  const locale = useLocale();
  const isRTL = isArabicLocale(locale);
  const proseWidth = page.wide ? "max-w-4xl" : "max-w-3xl";

  return (
    <main className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <MarketingHero
        badge={page.hero.badge}
        title={page.hero.title}
        subtitle={page.hero.subtitle}
        gradient={page.hero.gradient}
      />

      {page.lastUpdated && (
        <p className="mx-auto mt-6 max-w-4xl px-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
          {isRTL ? "آخر تحديث" : "Dernière mise à jour"} · {page.lastUpdated}
        </p>
      )}

      {page.cards && page.cards.length > 0 && (
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            {page.cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-[2rem] border border-slate-100 bg-slate-50 p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 text-4xl">{card.icon}</div>
                <h3 className="mb-3 text-xl font-black text-slate-900">{card.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-slate-500">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {page.articles && page.articles.length > 0 && (
        <section className="px-6 py-16 md:py-24">
          <div className={cn("mx-auto space-y-16", proseWidth)}>
            {page.articles.map((article) => (
              <article
                key={article.id}
                id={article.id}
                className="scroll-mt-32 border-b border-slate-100 pb-16 last:border-0"
              >
                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-800">
                    {article.category}
                  </span>
                  <time dateTime={article.date}>{article.date}</time>
                </div>
                <h2 className="mb-3 font-reem text-2xl font-black text-slate-900 md:text-3xl">
                  {article.title}
                </h2>
                <p className="mb-6 text-lg font-medium text-slate-500">{article.excerpt}</p>
                <div className="space-y-4 text-base leading-relaxed text-slate-600">
                  {article.paragraphs.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {page.faq && page.faq.length > 0 && (
        <section className="px-6 py-16 md:py-24">
          <div className={cn("mx-auto space-y-5", proseWidth)}>
            {page.faq.map((item) => (
              <div
                key={item.question}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-6 md:p-8"
              >
                <h3 className="mb-3 text-lg font-black text-slate-900 md:text-xl">{item.question}</h3>
                <p className="text-base font-medium leading-relaxed text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {page.sections.length > 0 && (
        <section
          className={cn(
            "px-6 py-16 md:py-24",
            (page.faq?.length || page.articles?.length) ? "border-t border-slate-100" : ""
          )}
        >
          <div
            className={cn(
              "prose prose-slate mx-auto prose-lg prose-headings:font-black prose-p:font-medium prose-p:leading-relaxed prose-p:text-slate-600 prose-li:text-slate-600",
              proseWidth
            )}
          >
            {page.sections.map((section) => (
              <div key={section.title} className="mb-12 last:mb-0">
                <h2>{section.title}</h2>
                {section.paragraphs?.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((b) => (
                      <li key={b.slice(0, 48)}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {(page.cta || page.footerNote) && (
        <section className="border-t border-slate-100 px-6 py-12 text-center">
          {page.footerNote && (
            <p className="mb-6 text-sm font-medium text-slate-500">{page.footerNote}</p>
          )}
          {page.cta && (
            <Link
              href={page.cta.href}
              className="inline-block rounded-xl bg-slate-900 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition hover:bg-orange-600"
            >
              {page.cta.label}
            </Link>
          )}
        </section>
      )}
    </main>
  );
}
