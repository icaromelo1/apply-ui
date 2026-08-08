export type TipoAviso = "resposta" | "travou" | "notaAlta";

export interface Aviso {
  id: string;
  tipo: TipoAviso;
  titulo: string;
  detalhe: string;
  quando: string;
  para: string;
  lido: boolean;
}

// Estado compartilhado entre o sino da tela Hoje e a tela de Avisos.
const avisos = ref<Aviso[]>([
  {
    id: "kestrel-resposta",
    tipo: "resposta",
    titulo: "Kestrel Labs respondeu",
    detalhe: "convite para entrevista",
    quando: "agora",
    para: "/etapas",
    lido: false,
  },
  {
    id: "omie-travou",
    tipo: "travou",
    titulo: "Omie travou esperando você",
    detalhe: "botão de envio não encontrado no passo final",
    quando: "há 3h",
    para: "/acao",
    lido: false,
  },
  {
    id: "brightflow-nota",
    tipo: "notaAlta",
    titulo: "Vaga nova com nota 88",
    detalhe: "Brightflow · Senior Full Stack Engineer",
    quando: "hoje",
    para: "/vagas/brightflow-sr-fullstack",
    lido: false,
  },
  {
    id: "gaudium-resposta",
    tipo: "resposta",
    titulo: "Gaudium respondeu",
    detalhe: "aprovação para a próxima etapa",
    quando: "há 2 dias",
    para: "/etapas",
    lido: true,
  },
]);

export function useAvisos() {
  const naoLidos = computed(() => avisos.value.filter((a) => !a.lido));

  function marcarLido(id: string) {
    const a = avisos.value.find((x) => x.id === id);
    if (a) a.lido = true;
  }

  function marcarTodosLidos() {
    for (const a of avisos.value) a.lido = true;
  }

  return { avisos, naoLidos, marcarLido, marcarTodosLidos };
}
