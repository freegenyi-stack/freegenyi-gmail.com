"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Role } from "@prisma/client";

export default function LoginRedirect() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role) {
            const role = session.user.role;
            // Default to 'en' or detect current locale? 
            // The router.push should handle locale if using next-intl router, 
            // but here we are using standard next/navigation with absolute paths usually including locale.
            // We'll rely on relative paths if currently under a locale, or construct it.
            // Assuming this component is used inside a localized path, relative navigation works.
            // But to be safe, we might want to map role to path.

            let path = "/dashboard/parent";
            switch (role) {
                case Role.PARENT:
                    path = "/dashboard/parent";
                    break;
                case Role.TEACHER:
                    path = "/dashboard/teacher";
                    break;
                case Role.NGO:
                    path = "/dashboard/ngo";
                    break;
                case Role.ORGANIZATION:
                    path = "/dashboard/organization";
                    break;
                default:
                    path = "/dashboard/parent";
            }

            router.push(path);
        } else if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [session, status, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Redirection vers votre espace...</p>
        </div>
    );
}
