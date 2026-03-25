export interface KBDocument {
  id: string;
  title: string;
  category: "HR Policies" | "IT Support" | "Engineering Docs" | "Onboarding";
  content: string;
  version: string;
}

export const knowledgeBase: KBDocument[] = [
  {
    id: "HR-001",
    title: "Política de Solicitação de Férias",
    category: "HR Policies",
    content:
      "Para solicitar férias, acesse o **PeoplePortal** e navegue até 'Ausências' → 'Solicitar Licença'. Selecione as datas desejadas e o tipo de licença (Férias, Médica, Pessoal). Seu gestor direto será notificado automaticamente. Solicitações devem ser enviadas com pelo menos **10 dias úteis** de antecedência para ausências planejadas. Licenças emergenciais podem ser enviadas no mesmo dia com aprovação do gestor. O saldo anual é de 20 dias para funcionários com menos de 3 anos de empresa e 25 dias para aqueles com 3+ anos.",
    version: "v2.4",
  },
  {
    id: "HR-002",
    title: "Diretrizes de Trabalho Remoto",
    category: "HR Policies",
    content:
      "Funcionários podem trabalhar remotamente até **3 dias por semana** com aprovação do gestor. Um Acordo de Trabalho Remoto deve ser registrado no PeoplePortal antes de iniciar o regime híbrido. Auxílio de até R$2.500/ano está disponível para equipar o escritório doméstico. O horário de colaboração obrigatório é das **10h às 15h** no fuso horário local. A VPN deve estar ativa para todas as sessões remotas que acessem sistemas internos.",
    version: "v1.8",
  },
  {
    id: "IT-001",
    title: "Abrindo um Chamado de Suporte",
    category: "IT Support",
    content:
      "Para abrir um chamado de suporte, acesse **suporte.interno.corp** ou envie um e-mail para **helpdesk@corp.com**. Selecione a categoria apropriada: Hardware, Software, Rede ou Acesso. Níveis de prioridade: **P1** (sistema fora do ar, resposta < 1h), **P2** (serviço degradado, < 4h), **P3** (solicitação geral, < 24h), **P4** (melhoria, < 1 semana). Inclua seu número de matrícula, número de série do dispositivo (encontrado em Preferências do Sistema → Sobre) e uma descrição detalhada do problema.",
    version: "v3.1",
  },
  {
    id: "IT-002",
    title: "Acesso aos Sistemas Internos",
    category: "IT Support",
    content:
      "Todos os sistemas internos requerem autenticação SSO via **Okta**. Configuração inicial: acesse **sso.corp.com/setup**, insira seu e-mail corporativo e siga os passos de cadastro MFA. Métodos MFA suportados: aplicativo autenticador (recomendado), chave de hardware, SMS (apenas backup). Acesso VPN é obrigatório fora da rede — baixe o **CorpVPN** pelo Portal de Autoatendimento. Política de senhas: mínimo de 12 caracteres, incluindo maiúsculas, minúsculas, número e caractere especial. Senhas expiram a cada 90 dias.",
    version: "v2.0",
  },
  {
    id: "ENG-001",
    title: "Fluxo de Desenvolvimento e Deploy",
    category: "Engineering Docs",
    content:
      "Nosso pipeline de deploy segue o modelo de branches **GitFlow**. Branches de feature são criadas a partir de `develop` usando a convenção `feature/JIRA-XXX-descricao`. Todos os PRs exigem **2 aprovações** e devem passar nos checks de CI (testes unitários, linting, scan de segurança). Deploys para staging acontecem automaticamente ao fazer merge em `develop`. Releases de produção são feitas a partir de `main` em **cadência quinzenal** (terças-feiras). Hotfixes seguem branches `hotfix/` e podem ser deployados fora do ciclo com aprovação do VP de Engenharia. Use os comandos `make deploy-staging` e `make deploy-prod`.",
    version: "v4.2",
  },
  {
    id: "ENG-002",
    title: "Padrões de Code Review",
    category: "Engineering Docs",
    content:
      "Todas as alterações de código devem passar por revisão antes do merge. As revisões devem focar em: **corretude**, **legibilidade**, **performance** e **segurança**. Revisores devem responder em até **4 horas úteis**. Use comentários convencionais: `nit:` para sugestões de estilo, `question:` para esclarecimentos, `issue:` para bloqueios. A cobertura de testes deve permanecer acima de **80%** em todos os serviços. Atualizações de documentação são obrigatórias para qualquer alteração de API.",
    version: "v2.1",
  },
  {
    id: "ONB-001",
    title: "Checklist de Integração de Novos Funcionários",
    category: "Onboarding",
    content:
      "Bem-vindo(a) à equipe! Complete estes passos na sua primeira semana: **Dia 1:** Retire crachá e notebook com o TI (Sala 102). Configure SSO Okta e e-mail. Conclua o treinamento obrigatório de segurança no **LearnHub**. **Dias 2-3:** Conheça seu buddy de integração. Revise a wiki da equipe no **Confluence**. Configure o ambiente de desenvolvimento seguindo o README do repositório `dev-setup`. **Dias 4-5:** Acompanhe um colega de equipe. Envie seu primeiro PR (mesmo uma correção pequena de documentação conta!). Agende 1:1 com seu gestor e skip-level.",
    version: "v3.0",
  },
  {
    id: "ONB-002",
    title: "Guia de Cadastro de Benefícios",
    category: "Onboarding",
    content:
      "O cadastro de benefícios deve ser concluído em até **30 dias** a partir da data de admissão via **PeoplePortal → Benefícios**. Planos disponíveis: Médico (3 opções: Básico, Padrão, Premium), Odontológico, Oftalmológico, Seguro de Vida (1x salário incluso, opcional até 5x). Previdência privada com **contrapartida de 4% da empresa** — inscrição automática em 3% salvo opt-out. Opções de vale-alimentação e vale-refeição estão disponíveis conforme o plano escolhido. A adesão aberta ocorre anualmente em **novembro**.",
    version: "v1.5",
  },
];

export interface RetrievedDocument {
  document: KBDocument;
  relevance: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

const STOP_WORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "her",
  "was", "one", "our", "out", "has", "have", "from", "this", "that", "with",
  "they", "been", "said", "each", "which", "their", "will", "other", "about",
  "how", "what", "where", "when", "who", "does", "into", "than", "its",
]);

export function retrieveDocuments(
  query: string,
  topK: number = 3
): RetrievedDocument[] {
  const queryTokens = tokenize(query).filter((t) => !STOP_WORDS.has(t));

  const scored = knowledgeBase.map((doc) => {
    const contentTokens = tokenize(doc.content + " " + doc.title + " " + doc.category);
    let score = 0;

    for (const qt of queryTokens) {
      for (const ct of contentTokens) {
        if (ct === qt) score += 3;
        else if (ct.includes(qt) || qt.includes(ct)) score += 1;
      }
      // Title match bonus
      if (doc.title.toLowerCase().includes(qt)) score += 5;
      if (doc.category.toLowerCase().includes(qt)) score += 4;
    }

    return { document: doc, relevance: score };
  });

  return scored
    .filter((s) => s.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, topK);
}

export function generateResponse(
  query: string,
  sources: RetrievedDocument[]
): string {
  if (sources.length === 0) {
    return "Não encontrei documentos relevantes na base de conhecimento para sua pergunta. Tente reformular sua questão ou entre em contato diretamente com seu departamento.";
  }

  const primary = sources[0].document;

  // Build a contextual response that references the source
  const response = `De acordo com o documento **${primary.title} (${primary.version})**, ${primary.content}`;

  if (sources.length > 1) {
    return (
      response +
      `\n\nPara informações complementares, consulte também o documento **${sources[1].document.title}**.`
    );
  }

  return response;
}

export type Category = KBDocument["category"];

export const categories: Category[] = [
  "HR Policies",
  "IT Support",
  "Engineering Docs",
  "Onboarding",
];
