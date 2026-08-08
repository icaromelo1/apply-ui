/* eslint-disable no-undef */
/**
 * Trecho importado pelo service worker gerado (workbox.importScripts).
 *
 * Cuida do push e do toque no aviso. Fica separado porque a estratégia
 * generateSW não permite editar o arquivo gerado.
 */

self.addEventListener("push", (evento) => {
  if (!evento.data) return;

  let carga;
  try {
    carga = evento.data.json();
  } catch {
    carga = { titulo: "Apply", corpo: evento.data.text(), para: "/" };
  }

  evento.waitUntil(
    self.registration.showNotification(carga.titulo ?? "Apply", {
      body: carga.corpo ?? "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      // A tag agrupa avisos do mesmo item em vez de empilhar repetidos.
      tag: carga.id ?? undefined,
      renotify: Boolean(carga.id),
      data: { para: carga.para ?? "/" },
    }),
  );
});

self.addEventListener("notificationclick", (evento) => {
  evento.notification.close();
  const destino = evento.notification.data?.para ?? "/";

  evento.waitUntil(
    (async () => {
      const abas = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

      // Se o app já está aberto, navega nele em vez de abrir outra janela —
      // em standalone no iPhone só existe uma.
      for (const aba of abas) {
        if ("focus" in aba) {
          await aba.focus();
          if ("navigate" in aba) await aba.navigate(destino);
          return;
        }
      }

      await self.clients.openWindow(destino);
    })(),
  );
});
