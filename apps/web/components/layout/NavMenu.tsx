"use client"

import * as React from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { rtlLocales } from "@/lib/i18n/config"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export function NavMenu() {
    const t = useTranslations("navigation")
    const locale = useLocale()
    const isRtl = rtlLocales.includes(locale as any)

    return (
        <NavigationMenu dir={isRtl ? "rtl" : "ltr"} className="hidden lg:flex">
            <NavigationMenuList className={cn(isRtl && "space-x-reverse")}>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/about" className={navigationMenuTriggerStyle()}>
                            {t("menu.about")}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/app" className={navigationMenuTriggerStyle()}>
                            {t("menu.app")}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/mission" className={navigationMenuTriggerStyle()}>
                            {t("menu.mission")}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/#parents" className={navigationMenuTriggerStyle()}>
                            {t("menu.parents.main")}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/#schools" className={navigationMenuTriggerStyle()}>
                            {t("menu.schools.main")}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/#ongs" className={navigationMenuTriggerStyle()}>
                            {t("menu.ongs.main")}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/#pricing" className={navigationMenuTriggerStyle()}>
                            {t("menu.pricing.main")}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
