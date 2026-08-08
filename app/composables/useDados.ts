export type Estado = "exige" | "correndo" | "travado";
export type Moeda = "USD" | "EUR" | "BRL";
export type Origem = "perfil" | "ia" | "branco";

export interface Vaga {
  id: string;
  nota: number;
  titulo: string;
  empresa: string;
  local: string;
  moeda: Moeda;
  faixa: string;
  fonte: string;
  publicada: string;
  nova: boolean;
  descricao: string;
  bateram: string[];
  faltaram: string[];
  porQue: string;
}

export interface CampoAssistido {
  id: string;
  pergunta: string;
  origem: Origem;
  valor: string;
  obrigatorio: boolean;
  opcoes?: string[];
  nota?: string;
}

export interface PassoAssistido {
  titulo: string;
  campos: CampoAssistido[];
}

export interface ItemFila {
  id: string;
  empresa: string;
  cargo: string;
  quando: string;
  motivo: string;
  print: string;
}

export interface Etapa {
  id: string;
  empresa: string;
  descricao: string;
  quando: string;
  prazo?: string;
  dependeDeVoce: boolean;
  acao?: string;
}

export interface Fonte {
  id: string;
  nome: string;
  tipo: string;
  ativa: boolean;
  pausada?: string;
  semCredencial?: string;
  usadoHoje: number;
  tetoDiario: number;
  intervaloMin: number;
  palavras: string[];
  locais: string[];
  paginas: number;
  janela: string;
  credencial?: string;
  vagasHoje: number;
  enviadasHoje: number;
}

const vagas: Vaga[] = [
  {
    id: "brightflow-sr-fullstack",
    nota: 88,
    titulo: "Senior Full Stack Engineer",
    empresa: "Brightflow",
    local: "remoto",
    moeda: "USD",
    faixa: "5.000–7.000",
    fonte: "greenhouse",
    publicada: "há 2 dias",
    nova: true,
    descricao:
      "We're looking for a senior engineer to own our customer-facing platform end to end. You'll work across a TypeScript stack with Node on the backend and a modern component framework on the front, shipping to production continuously. You'll partner directly with product and design, and you'll be accountable for the outcome of what you ship — not just the code.",
    bateram: ["typescript 5a", "node 5a", "vue 4a", "postgres", "agentes IA"],
    faltaram: ["react (pede)", "aws certificado"],
    porQue: "Remoto global + faixa dentro da sua pretensão USD elevaram a nota. React é a única lacuna dura.",
  },
  {
    id: "datora-backend-node",
    nota: 84,
    titulo: "Backend Engineer (Node)",
    empresa: "Datora",
    local: "Lisboa/remoto",
    moeda: "EUR",
    faixa: "4.000–4.800",
    fonte: "landing.jobs",
    publicada: "há 1 dia",
    nova: true,
    descricao:
      "Procuramos um engenheiro backend para a nossa plataforma de dados. Stack em Node.js e TypeScript, PostgreSQL, filas e microsserviços. Equipa distribuída entre Lisboa e remoto.",
    bateram: ["node 5a", "typescript 5a", "postgres", "filas/sqs", "nestjs"],
    faltaram: ["kafka"],
    porQue: "Português como idioma de trabalho e faixa em euro. Menor barreira de idioma de toda a lista.",
  },
  {
    id: "kestrel-platform",
    nota: 73,
    titulo: "Software Engineer, Platform",
    empresa: "Kestrel Labs",
    local: "remoto EUA",
    moeda: "USD",
    faixa: "6.000–8.000",
    fonte: "lever",
    publicada: "há 3 dias",
    nova: false,
    descricao:
      "Platform team focused on developer experience, CI/CD and observability. You'll own the tooling that the whole engineering org depends on.",
    bateram: ["kubernetes", "gitlab ci", "observabilidade", "docker"],
    faltaram: ["go", "terraform", "fuso EUA"],
    porQue: "Observabilidade e CI/CD batem forte. Go e o fuso horário dos EUA puxam a nota para baixo.",
  },
  {
    id: "vetta-fullstack-pl",
    nota: 58,
    titulo: "Fullstack Developer Pleno",
    empresa: "Vetta Digital",
    local: "São Paulo",
    moeda: "BRL",
    faixa: "8.000–10.000",
    fonte: "gupy",
    publicada: "há 5 dias",
    nova: false,
    descricao: "Desenvolvimento de aplicações web para clientes corporativos. Stack em Node.js e React.",
    bateram: ["node 5a", "typescript 5a"],
    faltaram: ["react", "senioridade abaixo do seu nível", "presencial"],
    porQue: "Nível pleno e faixa abaixo da sua pretensão. Fica na lista como referência de mercado.",
  },
];

const passosAssistida: PassoAssistido[] = [
  {
    titulo: "Dados pessoais",
    campos: [
      { id: "nome", pergunta: "Full name", origem: "perfil", valor: "Icaro David Melo de Freitas", obrigatorio: true },
      { id: "email", pergunta: "Email", origem: "perfil", valor: "icarodmelof@gmail.com", obrigatorio: true },
      { id: "fone", pergunta: "Phone", origem: "perfil", valor: "+55 85 99839-7705", obrigatorio: true },
      { id: "local", pergunta: "Location", origem: "perfil", valor: "Fortaleza, Brazil", obrigatorio: true },
      { id: "linkedin", pergunta: "LinkedIn", origem: "perfil", valor: "linkedin.com/in/icaromelo/", obrigatorio: false },
      { id: "github", pergunta: "GitHub", origem: "perfil", valor: "github.com/icaroMelo1", obrigatorio: false },
    ],
  },
  {
    titulo: "Experiência",
    campos: [
      { id: "anos", pergunta: "Total years of professional experience", origem: "perfil", valor: "5", obrigatorio: true },
      { id: "cargo", pergunta: "Current title", origem: "perfil", valor: "Senior Full Stack Developer", obrigatorio: true },
      { id: "empresa", pergunta: "Current company", origem: "perfil", valor: "Cast Group", obrigatorio: false },
      { id: "stack", pergunta: "Primary stack", origem: "perfil", valor: "TypeScript, Node.js, NestJS, Vue/Nuxt, PostgreSQL", obrigatorio: true },
    ],
  },
  {
    titulo: "Questionário",
    campos: [
      { id: "ts", pergunta: "Years of experience with TypeScript?", origem: "perfil", valor: "5 years", obrigatorio: true },
      {
        id: "porque",
        pergunta: "Why do you want to work at Brightflow?",
        origem: "ia",
        valor:
          "I've spent the last two years building production AI agent systems, and Brightflow's platform team is solving exactly the kind of end-to-end ownership problem I enjoy most. I've run multi-agent orchestration in production, including the observability and failure handling that makes it survivable — and I'd like to bring that to a product with real users on both sides.",
        obrigatorio: true,
      },
      {
        id: "visa",
        pergunta: "Do you require visa sponsorship?",
        origem: "branco",
        valor: "",
        obrigatorio: true,
        opcoes: ["Yes", "No"],
        nota: "Obrigatório — o perfil não sabe responder. Vai para Lacunas do perfil.",
      },
    ],
  },
  {
    titulo: "Currículo",
    campos: [{ id: "cv", pergunta: "Resume", origem: "perfil", valor: "CV · Inglês — ênfase IA/agentes", obrigatorio: true }],
  },
  {
    titulo: "Carta de apresentação",
    campos: [
      {
        id: "carta",
        pergunta: "Cover letter",
        origem: "ia",
        valor:
          "Dear Brightflow team — I build and operate AI agent systems in production, and I read your platform role as a chance to do that where the outcome is measured, not assumed. Over the last year I designed a seven-agent orchestration system with two-level memory, and I run an autonomous application pipeline of my own that has survived real failure modes: silent partial writes, stale selectors, and integrity drift between what a system reports and what actually happened.",
        obrigatorio: false,
      },
    ],
  },
];

const fila: ItemFila[] = [
  {
    id: "omie",
    empresa: "Omie",
    cargo: "Sr Backend",
    quando: "há 3h",
    motivo: "Botão de envio não encontrado no passo final",
    print: "/prints/omie.png",
  },
  {
    id: "localiza",
    empresa: "Localiza&Co",
    cargo: "Fullstack",
    quando: "ontem",
    motivo: "Captcha na etapa 2 — precisa de você",
    print: "/prints/localiza.png",
  },
  {
    id: "starian",
    empresa: "Starian",
    cargo: "Node Sr",
    quando: "ontem",
    motivo: "Pergunta nova sem resposta no perfil",
    print: "/prints/starian.png",
  },
];

const etapas: Etapa[] = [
  {
    id: "kestrel",
    empresa: "Kestrel Labs",
    descricao: "Teste técnico · HackerRank · 90min",
    quando: "recebido ontem",
    prazo: "vence amanhã",
    dependeDeVoce: true,
    acao: "Abrir teste",
  },
  {
    id: "agile",
    empresa: "AgileEngine",
    descricao: "Responder e-mail: disponibilidade para entrevista",
    quando: "há 2 dias",
    prazo: "sem prazo",
    dependeDeVoce: true,
    acao: "Responder",
  },
  {
    id: "gaudium",
    empresa: "Gaudium",
    descricao: "pré-entrevista feita · aguardando empresa",
    quando: "há 2 dias",
    dependeDeVoce: false,
  },
  {
    id: "brightflow",
    empresa: "Brightflow",
    descricao: "enviada · monitorando e-mail",
    quando: "hoje",
    dependeDeVoce: false,
  },
];

const fontes: Fonte[] = [
  {
    id: "remoteok",
    nome: "RemoteOK",
    tipo: "api pública",
    ativa: true,
    usadoHoje: 4,
    tetoDiario: 10,
    intervaloMin: 20,
    palavras: ["typescript", "node"],
    locais: ["remoto global"],
    paginas: 3,
    janela: "72h",
    vagasHoje: 31,
    enviadasHoje: 4,
  },
  {
    id: "greenhouse",
    nome: "Greenhouse",
    tipo: "board por empresa",
    ativa: true,
    usadoHoje: 7,
    tetoDiario: 8,
    intervaloMin: 45,
    palavras: ["full stack", "backend"],
    locais: ["remoto", "EUA"],
    paginas: 4,
    janela: "7d",
    vagasHoje: 18,
    enviadasHoje: 2,
  },
  {
    id: "remotive",
    nome: "Remotive",
    tipo: "api pública",
    ativa: true,
    usadoHoje: 0,
    tetoDiario: 10,
    intervaloMin: 20,
    palavras: ["node", "vue"],
    locais: ["remoto global"],
    paginas: 3,
    janela: "72h",
    vagasHoje: 14,
    enviadasHoje: 0,
  },
  {
    id: "landingjobs",
    nome: "Landing.jobs",
    tipo: "api",
    ativa: true,
    usadoHoje: 1,
    tetoDiario: 6,
    intervaloMin: 30,
    palavras: ["node", "typescript"],
    locais: ["Portugal", "Espanha", "remoto UE"],
    paginas: 2,
    janela: "7d",
    vagasHoje: 9,
    enviadasHoje: 1,
  },
  {
    id: "ashby",
    nome: "Ashby",
    tipo: "ingest direto",
    credencial: "token de API",
    ativa: false,
    pausada: "Pausada automaticamente: sinal de spam em 24 jul (18 envios/dia). Reativar exige novo teto ≤ 5/dia.",
    usadoHoje: 0,
    tetoDiario: 5,
    intervaloMin: 60,
    palavras: ["backend"],
    locais: ["remoto", "EUA"],
    paginas: 3,
    janela: "7d",
    vagasHoje: 0,
    enviadasHoje: 0,
  },
  {
    id: "linkedin",
    nome: "LinkedIn",
    tipo: "scraping",
    credencial: "cookie de sessão",
    ativa: false,
    semCredencial: "credencial expirada — toque para renovar",
    usadoHoje: 0,
    tetoDiario: 6,
    intervaloMin: 40,
    palavras: ["senior backend node"],
    locais: ["Brasil", "remoto"],
    paginas: 4,
    janela: "7d",
    vagasHoje: 0,
    enviadasHoje: 0,
  },
];

const funil = {
  encontradas: 412,
  pontuadas: 291,
  naFila: 48,
  enviadas: 37,
  resposta: 9,
  entrevista: 3,
};

const lacunas = [
  { pergunta: "visa sponsorship?", vezes: 3 },
  { pergunta: "notice period in weeks?", vezes: 2 },
  { pergunta: "GitHub with recent activity?", vezes: 1 },
  { pergunta: "willing to relocate to the US?", vezes: 1 },
];

const skills = [
  { nome: "TypeScript", anos: 5, nivel: "expert" },
  { nome: "Node.js / NestJS", anos: 5, nivel: "expert" },
  { nome: "Vue / Nuxt", anos: 4, nivel: "avançado" },
  { nome: "PostgreSQL", anos: 5, nivel: "avançado" },
  { nome: "Agentes IA", anos: 2, nivel: "produção" },
  { nome: "Kubernetes", anos: 2, nivel: "intermediário" },
];

const pretensao = [
  { regime: "Contractor · EUA", moeda: "USD" as Moeda, faixa: "5.000–7.000/mês" },
  { regime: "CLT-equiv · Europa", moeda: "EUR" as Moeda, faixa: "45–60k/ano" },
  { regime: "PJ · Brasil", moeda: "BRL" as Moeda, faixa: "12–15k/mês" },
];

const curriculos = [
  {
    id: "en",
    idioma: "EN",
    titulo: "CV · Inglês",
    atualizado: "há 2 dias",
    usos: 14,
    enfases: ["IA/agentes", "backend", "full stack"],
    enfaseAtiva: "IA/agentes",
  },
  {
    id: "pt",
    idioma: "PT",
    titulo: "CV · Português",
    atualizado: "há 12 dias",
    usos: 61,
    enfases: ["full stack", "backend"],
    enfaseAtiva: "full stack",
  },
];

export function useDados() {
  const contadorAcao = computed(() => fila.length + 2 + etapas.filter((e) => e.dependeDeVoce && e.prazo !== "sem prazo").length);

  return {
    vagas,
    passosAssistida,
    fila,
    etapas,
    fontes,
    funil,
    lacunas,
    skills,
    pretensao,
    curriculos,
    contadorAcao,
    vagaPorId: (id: string) => vagas.find((v) => v.id === id),
    fontePorId: (id: string) => fontes.find((f) => f.id === id),
  };
}
