import { ArrowRight, Globe2 } from "lucide-react";

export default function NgoBanner() {
    return (
        <section className="bg-gradient-premium py-12 px-6 overflow-hidden relative">
            {/* Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />

            <div className="mx-auto max-w-5xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-card/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                        <Globe2 className="h-3.5 w-3.5" />
                        <span>Solidarité</span>
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-white font-bold mb-3 leading-tight">
                        Vous êtes une ONG ? Bénéficiez d{"'"}un accès gratuit et illimité.
                    </h2>
                    <p className="text-white/80 text-base md:text-lg max-w-2xl">
                        Notre engagement est de soutenir les associations éducatives. Obtenez un accès complet à la plateforme sans aucun frais pour aider ceux qui en ont le plus besoin.
                    </p>
                </div>

                <div className="shrink-0 mt-4 md:mt-0">
                    <a
                        href="/ngos"
                        className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-primary shadow-xl transition-all hover:scale-105 hover:shadow-2xl hover:bg-muted"
                    >
                        🤝 Faire une demande d{"'"}accès
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>
            </div>
        </section>
    )
}
