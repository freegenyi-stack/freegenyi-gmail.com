import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import * as Ably from "ably";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Since this is a test environment and we might not have ABLY_API_KEY,
    // we'll try to use the key or mock it if missing.
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Ably not configured" }, { status: 500 });
    }

    const client = new Ably.Rest({ key: apiKey });
    const clientId = session.user.email.replace(/[^a-zA-Z0-9]/g, "_");
    
    // Create token request
    const tokenRequestData = await client.auth.createTokenRequest({ clientId });
    
    return NextResponse.json(tokenRequestData);
  } catch (error) {
    console.error("Ably auth error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
