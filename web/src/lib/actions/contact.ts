"use server";

import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function submitContactFormAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim() || null;
  const message = (formData.get("message") as string)?.trim();

  if (!name || name.length < 2) return { error: "Nom requis." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "E-mail invalide." };
  if (!message || message.length < 10) return { error: "Message trop court (10 caractères min.)." };

  await db.insert(contactSubmissions).values({
    name,
    email,
    subject,
    message,
    status: "pending",
    updatedAt: new Date(),
  });

  revalidatePath("/dashboard/admin/contacts");
  return { success: true };
}
