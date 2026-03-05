"use server";

import prisma from "@/lib/prisma";

export async function submitNgoRequest(formData: FormData) {
    try {
        const organizationName = formData.get("organizationName") as string;
        const website = formData.get("website") as string;
        const mission = formData.get("mission") as string;
        const intendedUse = formData.get("intendedUse") as string;
        const contactEmail = formData.get("contactEmail") as string;

        if (!organizationName || !website || !mission || !intendedUse || !contactEmail) {
            return { error: "Veuillez remplir tous les champs obligatoires." };
        }

        const request = await prisma.ngoRequest.create({
            data: {
                organizationName,
                website,
                mission,
                intendedUse,
                contactEmail,
            },
        });

        return { success: true, id: request.id };
    } catch (error: any) {
        console.error("NGO request error:", error);
        return { error: "Une erreur est survenue lors de l'envoi. Veuillez réessayer." };
    }
}
