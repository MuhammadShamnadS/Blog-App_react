
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "Notification", body: event.data?.text() };
  }

  const title = data.title || "New Notification";
  const options = {
    body: data.body || "You have a new notification",
    icon: data.icon || "/blog.jpeg",
    data: data.data || { url: "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  let targetUrl = event.notification.data?.url || "/";
  const origin = self.location.origin;

  // If backend sent absolute URL matching origin, convert to relative
  if (targetUrl.startsWith(origin)) {
    targetUrl = targetUrl.replace(origin, "");
    if (!targetUrl.startsWith("/")) targetUrl = "/" + targetUrl;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab if any
      if (clientList.length > 0) {
        const client = clientList[0];
        client.focus();
        client.postMessage({ action: "navigate", url: targetUrl });
      } else {
        // Open SPA root if no tab exists
        clients.openWindow("/").then((newClient) => {
          if (newClient) newClient.postMessage({ action: "navigate", url: targetUrl });
        });
      }
    })
  );
});

// Optional: handle notification close events
self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed", event.notification);
});
