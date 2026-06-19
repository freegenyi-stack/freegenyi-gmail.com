import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getH5pServerUrl } from "@/lib/authoring/h5p-config";

/** Proxy authentifié vers le serveur H5P self-hosté (Lumi). */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyH5p(req, await params);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyH5p(req, await params);
}

async function proxyH5p(req: NextRequest, params: { path: string[] }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = getH5pServerUrl();
  if (!base) {
    return NextResponse.json({ error: "H5P_SERVER_URL not configured" }, { status: 503 });
  }

  const subPath = params.path?.join("/") ?? "";
  const target = `${base}/${subPath}${req.nextUrl.search}`;

  const headers = new Headers();
  const apiKey = process.env.H5P_API_KEY;
  if (apiKey) headers.set("Authorization", `Bearer ${apiKey}`);
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer();

  const res = await fetch(target, { method: req.method, headers, body, cache: "no-store" });
  const resHeaders = new Headers();
  const ct = res.headers.get("content-type");
  if (ct) resHeaders.set("Content-Type", ct);

  return new NextResponse(await res.arrayBuffer(), { status: res.status, headers: resHeaders });
}
