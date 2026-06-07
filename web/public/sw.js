/* FreeGeny — Service Worker Web Push (VAPID) */

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
