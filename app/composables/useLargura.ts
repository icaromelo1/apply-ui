/**
 * Detecta a largura de desktop (o mesmo ponto de corte do CSS: 900px).
 *
 * Começa em `false` para o servidor e a primeira pintura renderizarem o layout
 * de celular — mobile first também na hidratação.
 */
export function useLargura() {
  const desktop = ref(false);
  let mq: MediaQueryList | null = null;

  function aplicar(e: MediaQueryList | MediaQueryListEvent) {
    desktop.value = e.matches;
  }

  onMounted(() => {
    mq = window.matchMedia("(min-width: 900px)");
    aplicar(mq);
    mq.addEventListener("change", aplicar);
  });

  onBeforeUnmount(() => mq?.removeEventListener("change", aplicar));

  return { desktop };
}
