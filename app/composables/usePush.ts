/**
 * Notificações push.
 *
 * No iPhone só funcionam com o app adicionado à tela inicial — Safari em aba
 * não expõe a API. Por isso a tela distingue "indisponível" de "negado": são
 * situações diferentes e pedem instruções diferentes.
 */
export type EstadoPush = "indisponivel" | "precisa-instalar" | "padrao" | "concedida" | "negada";

export interface PreferenciasAviso {
  resposta: boolean;
  travou: boolean;
  notaAlta: boolean;
  resumo: boolean;
  limiar: number;
  silencioNoturno: boolean;
}

const CHAVE_PREFS = "apply-ui:avisos";

const PADRAO: PreferenciasAviso = {
  resposta: true,
  travou: true,
  notaAlta: true,
  resumo: false,
  limiar: 85,
  silencioNoturno: true,
};

export function ehStandalone(): boolean {
  if (import.meta.server) return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS antigo expõe só esta flag proprietária.
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function ehIOS(): boolean {
  if (import.meta.server) return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function usePush() {
  const estado = ref<EstadoPush>("indisponivel");
  const inscrito = ref(false);
  const prefs = reactive<PreferenciasAviso>({ ...PADRAO });

  function avaliar() {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      // No iPhone a API só aparece depois de instalar — a diferença importa.
      estado.value = ehIOS() && !ehStandalone() ? "precisa-instalar" : "indisponivel";
      return;
    }
    estado.value = { default: "padrao", granted: "concedida", denied: "negada" }[
      Notification.permission
    ] as EstadoPush;
  }

  async function pedirPermissao() {
    if (!("Notification" in window)) return;
    const r = await Notification.requestPermission();
    avaliar();
    if (r === "granted") await inscrever();
  }

  async function inscrever() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const existente = await reg.pushManager.getSubscription();
      inscrito.value = Boolean(existente);
      // A inscrição real precisa da chave VAPID da apply-api; sem ela, para aqui.
    } catch {
      inscrito.value = false;
    }
  }

  function salvarPrefs() {
    try {
      localStorage.setItem(CHAVE_PREFS, JSON.stringify(prefs));
    } catch {
      // Sem persistência as preferências valem só nesta sessão.
    }
  }

  onMounted(() => {
    avaliar();
    try {
      const bruto = localStorage.getItem(CHAVE_PREFS);
      if (bruto) Object.assign(prefs, JSON.parse(bruto));
    } catch {
      Object.assign(prefs, PADRAO);
    }
    if (estado.value === "concedida") inscrever();
  });

  watch(prefs, salvarPrefs, { deep: true });

  return { estado, inscrito, prefs, pedirPermissao, ehStandalone };
}
