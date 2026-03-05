"use client"

import * as React from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { Menu } from "lucide-react"
import { Logo } from "@/components/icons/Logo"
import { NavMenu } from "./NavMenu"
import { LanguageSelector } from "./LanguageSelector"
import { Button } from "@/components/ui/button"
import { UserMenu } from "./UserMenu"
import { useAuthStore } from "@/store/useAuthStore"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function AppBar() {
    const t = useTranslations("navigation")
    const { isAuthenticated } = useAuthStore()
    const locale = useLocale()
    const bgClass = "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"

    return (
        <header className={`sticky top-0 z-50 w-full border-b ${bgClass}`}>
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                    <Logo />
                    <NavMenu />
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                        <LanguageSelector />
                        {!isAuthenticated ? (
                            <Button variant="ghost" asChild>
                                <Link href={`/${locale}/auth/signin`}>{t("menu.login")}</Link>
                            </Button>
                        ) : (
                            <UserMenu />
                        )}
                    </div>

                    <Button variant="premium" className="hidden md:flex">
                        {t("menu.freeTrial")}
                    </Button>

                    {/* Mobile Menu */}
                    <div className="lg:hidden flex items-center gap-2">
                        <LanguageSelector />
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetHeader>
                                    <SheetTitle className="text-left">
                                        <Logo />
                                    </SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col gap-4 mt-8">
                                    <Link href={`/${locale}/about`} className="text-lg font-medium">{t("menu.about")}</Link>
                                    <Link href={`/${locale}/mission`} className="text-lg font-medium">{t("menu.mission")}</Link>
                                    <Link href={`/${locale}/app`} className="text-lg font-medium">{t("menu.app")}</Link>

                                    <Link href={`/${locale}/#parents`} className="text-lg font-medium">{t("menu.parents.main")}</Link>
                                    <Link href={`/${locale}/#schools`} className="text-lg font-medium">{t("menu.schools.main")}</Link>
                                    <Link href={`/${locale}/#ongs`} className="text-lg font-medium">{t("menu.ongs.main")}</Link>
                                    <Link href={`/${locale}/#pricing`} className="text-lg font-medium">{t("menu.pricing.main")}</Link>

                                    <div className="mt-4 flex flex-col gap-2">
                                        <Button variant="premium" className="w-full">{t("menu.freeTrial")}</Button>
                                        {!isAuthenticated ? (
                                            <Button variant="outline" className="w-full" asChild>
                                                <Link href={`/${locale}/auth/signin`}>{t("menu.login")}</Link>
                                            </Button>
                                        ) : (
                                            <div className="flex justify-center py-2">
                                                <UserMenu />
                                            </div>
                                        )}
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
