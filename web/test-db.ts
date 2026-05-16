import { db } from "./src/db";
import { users } from "./src/db/schema";
import bcrypt from "bcryptjs";

async function testCreate() {
  console.log("🚀 Tentative de création d'un utilisateur TEST...");
  try {
    const hashedPassword = await bcrypt.hash("password123", 12);
    
    await db.insert(users).values({
      email: "test@freegeny.com",
      passwordHash: hashedPassword,
      fullName: "Test User",
      role: "parent",
    });

    console.log("✅ UTILISATEUR CRÉÉ AVEC SUCCÈS ! Allez voir dans DBeaver.");
  } catch (error) {
    console.error("❌ ÉCHEC de la création :", error);
  }
}

testCreate();
