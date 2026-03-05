"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/lib/i18n/navigation"
import { Globe, Check } from "lucide-react"
import { languageMetadata, Locale, locales } from "@/lib/i18n/config"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LanguageSelector() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    // Map locales to the format expected by the selector
    const languages = locales.map(code => ({
        code: code as string,
        name: languageMetadata[code as Locale].name,
        nativeName: languageMetadata[code as Locale].nativeName,
        flag: languageMetadata[code as Locale].flag,
        dir: ["ar", "fa", "ur", "dari"].includes(code) ? "rtl" : "ltr"
    }))

    const currentLanguage = languages.find((l) => l.code === locale) || languages[0]

    const toggleLanguage = (code: string) => {
        // Change locale in URL which will trigger a reload with new messages
        router.push(pathname, { locale: code })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 px-2 md:px-3">
                    <span className="text-lg leading-none">{currentLanguage.flag}</span>
                    <span className="hidden sm:inline-block font-medium">{currentLanguage.nativeName}</span>
                    <Globe className="h-4 w-4 opacity-50 flex-shrink-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] max-h-[400px] overflow-y-auto overflow-x-hidden">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => toggleLanguage(lang.code)}
                        className={cn(
                            "flex items-center justify-between py-2 cursor-pointer",
                            locale === lang.code && "bg-accent"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl leading-none">{lang.flag}</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{lang.nativeName}</span>
                                <span className="text-xs text-muted-foreground">{lang.name}</span>
                            </div>
                        </div>
                        {locale === lang.code && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
