"use server";

import prisma from "@/lib/prisma";

export async function submitSchoolRequest(formData: FormData) {
    try {
        const role = formData.get("role") as string;
        const schoolName = formData.get("schoolName") as string;
        const contactName = formData.get("contactName") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const requestType = formData.get("requestType") as string;

        if (!role || !schoolName || !contactName || !email || !requestType) {
            return { error: "Veuillez remplir tous les champs obligatoires." };
        }

        const request = await prisma.schoolRequest.create({
            data: {
                role,
                schoolName,
                contactName,
                email,
                phone: phone || null,
                requestType,
            },
        });

        return { success: true, id: request.id };
    } catch (error: any) {
        console.error("School request error:", error);
        return { error: "Une erreur est survenue lors de l'envoi. Veuillez réessayer." };
    }
}
