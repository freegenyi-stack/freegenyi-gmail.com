"use client";

import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Event = {
  day: string;
  month: string;
  title: string;
  location: string;
  href: string;
  cta: string;
};

export default function EventsSection({
  events,
  isRTL,
}: {
  events: Event[];
  isRTL?: boolean;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {events.map((event, i) => (
        <motion.article
          key={event.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          whileHover={{ y: -4 }}
          className="group flex overflow-hidden rounded-3xl bg-white shadow-[0_16px_48px_-20px_rgba(15,23,42,0.1)] ring-1 ring-slate-100"
        >
          <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-gradient-to-b from-orange-500 to-amber-500 py-6 text-white md:w-28">
            <span className="text-3xl font-bold leading-none">{event.day}</span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-wider">{event.month}</span>
          </div>
          <div className={cn("flex flex-1 flex-col justify-center p-6", isRTL && "text-right")}>
            <h3 className={cn("text-lg font-bold text-slate-900 md:text-xl", isRTL && "font-ui-ar")}>
              {event.title}
            </h3>
            <p className={cn("mt-2 flex items-center gap-1.5 text-sm text-slate-500", isRTL && "flex-row-reverse justify-end")}>
              <MapPin className="h-4 w-4 shrink-0 text-orange-400" />
              {event.location}
            </p>
            <Link
              href={event.href}
              className={cn(
                "mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700",
                isRTL && "flex-row-reverse justify-end"
              )}
            >
              <Calendar className="h-4 w-4" />
              {event.cta}
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
