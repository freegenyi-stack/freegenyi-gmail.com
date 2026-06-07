import { NextRequest } from "next/server";

// Keep track of request counts per IP in memory
interface RateLimitData {
  count: number;
  resetTime: number;
}

const ipCache = new Map<string, RateLimitData>();

// Cleanup interval to avoid memory leaks
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 1000 * 60 * 10; // 10 minutes

function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [ip, data] of ipCache.entries()) {
    if (now > data.resetTime) {
      ipCache.delete(ip);
    }
  }
}

/**
 * Highly secure, server-side anti-scraping and rate-limiting system
 * designed to protect the school database from automated crawlers.
 */
export function verifyRequestSecurity(req: NextRequest, limitPerMin = 60): {
  allowed: boolean;
  errorResponse?: { error: string; status: number };
} {
  // Dev local : pas de blocage (tests UI wilaya/commune/écoles)
  if (process.env.NODE_ENV === "development") {
    return { allowed: true };
  }

  const now = Date.now();
  cleanupExpired();

  // 1. IP extraction
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  // 2. User-Agent Validation (Blocks headless scrapers, curl, python, etc.)
  const userAgent = req.headers.get("user-agent") || "";
  const lowercaseUA = userAgent.toLowerCase();
  
  const blockedSignatures = [
    "python", "curl", "wget", "go-http", "postman", "insomnia", 
    "node-fetch", "axios", "scrapy", "headless", "selenium", 
    "puppeteer", "playwright", "java/", "libwww-perl", "php/"
  ];

  if (!userAgent || blockedSignatures.some(sig => lowercaseUA.includes(sig))) {
    console.warn(`[Anti-Scrape] Blocked signature for IP ${ip}: User-Agent "${userAgent}"`);
    return {
      allowed: false,
      errorResponse: { error: "Accès non autorisé.", status: 403 }
    };
  }

  // 3. Referer/Origin Validation (Ensures request comes from our own frontend app)
  const referer = req.headers.get("referer") || "";
  const host = req.headers.get("host") || "";
  const origin = req.headers.get("origin") || "";

  // In production, we enforce that the referer starts with our host
  // In development, we permit localhost or 127.0.0.1
  const isDev = process.env.NODE_ENV === "development" || host.includes("localhost") || host.includes("127.0.0.1");
  
  if (!isDev) {
    if (!referer && !origin) {
      console.warn(`[Anti-Scrape] Blocked request for IP ${ip}: Missing referer and origin headers.`);
      return {
        allowed: false,
        errorResponse: { error: "Requête non autorisée.", status: 403 }
      };
    }

    const hostWithoutPort = host.split(":")[0];
    const allowedReferer = referer.includes(hostWithoutPort) || (origin && origin.includes(hostWithoutPort));
    
    if (!allowedReferer) {
      console.warn(`[Anti-Scrape] Blocked request for IP ${ip}: Cross-origin / Unauthorized Referer: "${referer}" (Host: "${host}")`);
      return {
        allowed: false,
        errorResponse: { error: "Requête hors domaine interdite.", status: 403 }
      };
    }
  }

  // 4. Rate Limiting Sliding Window (Max X requests per minute)
  const cached = ipCache.get(ip);
  if (!cached || now > cached.resetTime) {
    // Initialize or reset window
    ipCache.set(ip, {
      count: 1,
      resetTime: now + 1000 * 60 // 1 minute window
    });
  } else {
    // Increment count
    cached.count += 1;
    if (cached.count > limitPerMin) {
      console.warn(`[Anti-Scrape] Rate Limit Exceeded for IP ${ip}: ${cached.count}/${limitPerMin} requests.`);
      return {
        allowed: false,
        errorResponse: { 
          error: "Trop de requêtes. Veuillez patienter avant de réessayer.", 
          status: 429 
        }
      };
    }
  }

  return { allowed: true };
}
