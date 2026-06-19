/* FreeGeny — Service Worker Web Push + cache bibliothèque offline */

const LIBRARY_CACHE = "freegeny-library-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (
    event.request.method === "GET" &&
    (url.pathname.startsWith("/api/library/") || url.pathname.includes("/readium/"))
  ) {
    event.respondWith(
      caches.open(LIBRARY_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        const network = fetch(event.request)
          .then((res) => {
            if (res.ok) void cache.put(event.request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});

self.addEventListener("push", (event) => {
  let data = {
    title: "FreeGeny",
    body: "",
    url: "/",
    icon: "/assets/img/logo.png",
  };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch {
    /* ignore malformed payload */
  }

  const options = {
    body: data.body || "",
    icon: data.icon || "/assets/img/logo.png",
    badge: "/assets/img/logo.png",
    tag: "freegeny-notification",
    renotify: true,
    data: { url: data.url || "/" },
    vibrate: [120, 60, 120],
  };

  event.waitUntil(self.registration.showNotification(data.title || "FreeGeny", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of allClients) {
        if ("focus" in client) {
          await client.focus();
          if ("navigate" in client && typeof client.navigate === "function") {
            await client.navigate(targetUrl);
          }
          return;
        }
      }
      await clients.openWindow(targetUrl);
    })()
  );
});
