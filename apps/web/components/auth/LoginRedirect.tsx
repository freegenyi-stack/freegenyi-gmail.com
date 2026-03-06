"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

export default function LoginRedirect() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && user?.roles?.[0]) {
            const role = user.roles[0];

            let path = "/parent"; // Using simplified paths, assuming locale is handled or unnecessary here
            if (role === 'TEACHER') path = "/teacher";
            if (role === 'NGO') path = "/ngo";
            if (role === 'ORGANIZATION') path = "/admin";

            router.push(path);
        } else if (!isAuthenticated) {
            router.push("/auth/signin");
        }
    }, [user, isAuthenticated, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Redirection vers votre espace...</p>
        </div>
    );
}
