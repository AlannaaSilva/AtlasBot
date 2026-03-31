export interface Document {
  title: string;
  category: string;
  content: string;
}

export const documents: Document[] = [
  // ─── RH ───────────────────────────────────────────
  {
    title: "Política de Férias",
    category: "rh",
    content: `Política de Férias — Techsfera Soluções S.A.
Todo colaborador tem direito a 30 dias corridos de férias após 12 meses de trabalho (período aquisitivo). O colaborador deve solicitar as férias com no mínimo 30 dias de antecedência pelo sistema interno RH Connect. As férias podem ser parceladas em até 3 períodos, sendo que nenhum período pode ser inferior a 5 dias corridos. O primeiro período não pode ser inferior a 14 dias. O pagamento das férias deve ser realizado até 2 dias antes do início do período. O abono pecuniário (venda de 10 dias de férias) pode ser solicitado até 15 dias antes do início das férias. Férias coletivas podem ser decretadas pela empresa com aviso prévio de 15 dias. Colaboradores em período de experiência não têm direito a férias. Em caso de doenças durante as férias devidamente comprovadas por atestado médico, o período poderá ser suspenso mediante análise do RH.`
  },
  {
    title: "Benefícios e Plano de Saúde",
    category: "rh",
    content: `Benefícios Corporativos — Techsfera Soluções S.A.
A empresa oferece os seguintes benefícios: Plano de saúde Unimed (coparticipação de 20% para consultas e 10% para exames), plano odontológico OdontoPrev sem coparticipação, vale-refeição de R$ 45,00 por dia útil trabalhado via cartão Sodexo, vale-transporte com desconto de 6% sobre o salário bruto, seguro de vida em grupo, gympass categoria básica subsidiado 50% pela empresa, e auxílio creche de R$ 400,00 mensais para filhos de até 5 anos. A inclusão de dependentes no plano de saúde deve ser solicitada ao RH em até 30 dias após o nascimento ou casamento. A segunda via do cartão Sodexo deve ser solicitada pelo RH Connect com prazo de entrega de 5 dias úteis.`
  },
  {
    title: "Controle de Ponto e Jornada de Trabalho",
    category: "rh",
    content: `Controle de Ponto — Techsfera Soluções S.A.
A jornada padrão é de 8 horas diárias e 44 horas semanais, com intervalo de 1 hora para almoço. O registro de ponto é realizado pelo sistema PointMe disponível no celular corporativo ou totem da recepção. Atrasos superiores a 10 minutos devem ser justificados no sistema em até 24 horas. O banco de horas permite acúmulo de até 40 horas positivas e limite de 10 horas negativas. Horas extras acima do banco devem ser aprovadas previamente pelo gestor via RH Connect. Colaboradores em regime home office devem registrar ponto normalmente. Feriados não trabalhados são automaticamente lançados no sistema. O espelho de ponto fica disponível para consulta no último dia útil de cada mês. Ausências não justificadas em até 48 horas resultam em desconto proporcional na folha.`
  },

  // ─── TI ───────────────────────────────────────────
  {
    title: "Suporte de TI e Abertura de Chamados",
    category: "ti",
    content: `Suporte de TI — Techsfera Soluções S.A.
O suporte técnico é prestado pela equipe de TI de segunda a sexta, das 8h às 18h. Chamados devem ser abertos pelo portal Help Desk em helpdesk.techsfera.intranet ou pelo ramal 2100. Os níveis de prioridade são: Crítico (sistema de produção inoperante — SLA 2 horas), Alto (impacto em múltiplos usuários — SLA 4 horas), Médio (impacto individual sem bloqueio total — SLA 8 horas), Baixo (dúvidas e solicitações gerais — SLA 2 dias úteis). Equipamentos com defeito devem ser entregues no almoxarifado de TI no 3º andar com o número do chamado impresso. A troca de equipamentos é realizada em até 1 dia útil para notebooks e 3 dias úteis para periféricos. Softwares não homologados não podem ser instalados sem aprovação prévia do TI.`
  },
  {
    title: "Política de Senhas e Acesso a Sistemas",
    category: "ti",
    content: `Política de Senhas — Techsfera Soluções S.A.
Senhas corporativas devem ter no mínimo 12 caracteres, contendo letras maiúsculas, minúsculas, números e caracteres especiais. A troca de senha é obrigatória a cada 90 dias. Não é permitido reutilizar as últimas 10 senhas. O compartilhamento de credenciais é proibido e sujeito a sanções disciplinares. Em caso de esquecimento, a redefinição pode ser feita pelo portal de autoatendimento SSO em sso.techsfera.intranet ou pelo TI via ramal 2100. Após 5 tentativas incorretas, a conta é bloqueada automaticamente por 30 minutos. Acessos a sistemas críticos requerem autenticação de dois fatores (2FA) obrigatório. Colaboradores desligados têm seus acessos revogados imediatamente após a homologação do desligamento pelo RH.`
  },
  {
    title: "Equipamentos Corporativos",
    category: "ti",
    content: `Política de Equipamentos — Techsfera Soluções S.A.
Cada colaborador recebe um notebook corporativo no primeiro dia de trabalho, mediante assinatura do Termo de Responsabilidade de Equipamento (TRE). O equipamento é de uso exclusivamente profissional. Danos causados por mau uso são de responsabilidade do colaborador, podendo ser descontados em folha conforme avaliação técnica. Em caso de perda ou roubo, o colaborador deve registrar boletim de ocorrência e comunicar o TI em até 24 horas. Colaboradores em home office recebem adicionalmente um monitor externo e headset. A devolução dos equipamentos no desligamento é condição para liberação da rescisão. Upgrades de equipamento podem ser solicitados após 3 anos de uso mediante justificativa aprovada pelo gestor e TI.`
  },

  // ─── ONBOARDING ───────────────────────────────────
  {
    title: "Programa de Integração de Novos Colaboradores",
    category: "onboarding",
    content: `Onboarding — Techsfera Soluções S.A.
O programa de integração tem duração de 30 dias e é dividido em quatro semanas. Semana 1: apresentação da empresa, cultura organizacional, tour nas instalações, entrega de equipamentos e credenciais, e reunião com o RH para assinatura de documentos. Semana 2: treinamentos obrigatórios na plataforma EAD Techsfera Learn (política de segurança, LGPD, código de ética e conduta). Semana 3: integração com a equipe, apresentação aos principais stakeholders, e início das atividades acompanhado pelo buddy designado. Semana 4: reunião de alinhamento com o gestor direto, definição de metas do período de experiência e avaliação do onboarding. O período de experiência tem duração de 90 dias, podendo ser renovado por mais 90 dias. A avaliação de desempenho do período de experiência ocorre nos dias 85-90.`
  },
  {
    title: "Buddy Program",
    category: "onboarding",
    content: `Buddy Program — Techsfera Soluções S.A.
O Buddy Program designa um colaborador experiente para apoiar cada novo colaborador durante os primeiros 90 dias. O buddy é responsável por apresentar a cultura informal da empresa, tirar dúvidas do dia a dia, apresentar os colegas da área e das áreas parceiras, e facilitar a adaptação ao ambiente de trabalho. A participação como buddy é voluntária e reconhecida no programa de reconhecimento corporativo com pontos extras. O buddy e o novo colaborador devem realizar pelo menos dois encontros formais por semana durante o primeiro mês. Qualquer dificuldade de adaptação identificada deve ser comunicada ao RH. O buddy não é responsável pelo desempenho técnico do novo colaborador, que é responsabilidade exclusiva do gestor direto.`
  },

  // ─── PROCESSOS INTERNOS ───────────────────────────
  {
    title: "Política de Reembolso de Despesas",
    category: "processos",
    content: `Reembolso de Despesas — Techsfera Soluções S.A.
Despesas relacionadas ao trabalho podem ser reembolsadas mediante aprovação prévia do gestor. O prazo para solicitação de reembolso é de até 30 dias após a realização da despesa. A solicitação deve ser feita pelo sistema Concur com anexo dos comprovantes originais. Despesas sem comprovante não serão reembolsadas. Os limites por categoria são: refeições em viagem R$ 80,00 por refeição, hospedagem R$ 350,00 por diária em capitais e R$ 250,00 em outras cidades, transporte por aplicativo R$ 60,00 por corrida. Despesas acima dos limites requerem justificativa e aprovação do gestor e do financeiro. O prazo de processamento é de 5 dias úteis após aprovação. Reembolsos são creditados na conta cadastrada no RH junto ao salário do mês seguinte.`
  },
  {
    title: "Processo de Compras e Aquisições",
    category: "processos",
    content: `Processo de Compras — Techsfera Soluções S.A.
Toda aquisição de bens ou serviços deve seguir o fluxo de compras corporativo. Solicitações de até R$ 500,00 podem ser aprovadas pelo gestor direto. De R$ 500,01 a R$ 5.000,00 requerem aprovação do gestor e do coordenador financeiro. Acima de R$ 5.000,00 requerem aprovação do gestor, financeiro e diretoria. A solicitação deve ser aberta no sistema SAP Compras com três cotações de fornecedores distintos. Fornecedores novos devem ser cadastrados no sistema com CNPJ, dados bancários e documentação fiscal. O prazo médio de processamento é de 7 dias úteis para compras aprovadas. Compras emergenciais podem ser autorizadas verbalmente pelo gestor e formalizadas em até 24 horas. Cartão corporativo está disponível apenas para diretores e gerentes com limite pré-aprovado.`
  },
  {
    title: "Política de Viagens Corporativas",
    category: "processos",
    content: `Viagens Corporativas — Techsfera Soluções S.A.
Viagens a trabalho devem ser solicitadas com no mínimo 5 dias úteis de antecedência pelo sistema Travel corporativo. Passagens aéreas são adquiridas pela agência parceira Viatur. Classe econômica é o padrão para voos de até 4 horas. Para voos acima de 4 horas, classe executiva pode ser aprovada pela diretoria. Hospedagem em hotéis parceiros deve ser priorizada. O adiantamento de viagem pode ser solicitado em até 70% das despesas previstas. A prestação de contas deve ser realizada em até 5 dias úteis após o retorno. Viagens internacionais requerem aprovação da diretoria e seguro viagem obrigatório contratado pela empresa. Acompanhantes não são cobertos pela política de viagens.`
  },

  // ─── SEGURANÇA DA INFORMAÇÃO ──────────────────────
  {
    title: "Política de Segurança da Informação",
    category: "seguranca",
    content: `Segurança da Informação — Techsfera Soluções S.A.
A classificação dos dados da empresa segue quatro níveis: Público (pode ser divulgado livremente), Interno (uso restrito a colaboradores), Confidencial (acesso restrito a times específicos), e Secreto (acesso restrito à diretoria). Dados confidenciais e secretos não podem ser armazenados em dispositivos pessoais ou serviços de nuvem não homologados. O uso de pen drives é proibido sem autorização prévia do TI. E-mails com anexos acima de 25MB devem utilizar o repositório SharePoint corporativo. Incidentes de segurança devem ser reportados imediatamente ao TI pelo ramal 2100 ou security@techsfera.com. A violação desta política sujeita o colaborador a medidas disciplinares, incluindo desligamento por justa causa. Auditorias de segurança são realizadas trimestralmente.`
  },
  {
    title: "Uso Aceitável de Recursos de TI",
    category: "seguranca",
    content: `Uso Aceitável de Recursos de TI — Techsfera Soluções S.A.
Os recursos de TI da empresa (computadores, internet, e-mail corporativo, sistemas internos) devem ser utilizados prioritariamente para fins profissionais. O uso pessoal moderado é tolerado desde que não comprometa a produtividade. São expressamente proibidos: acesso a conteúdo impróprio ou ilegal, download de softwares não licenciados, uso de ferramentas de compartilhamento de arquivos P2P, mineração de criptomoedas, e acesso a sistemas de terceiros sem autorização. O tráfego de rede corporativa é monitorado. O e-mail corporativo não deve ser utilizado para cadastros em serviços pessoais. Redes sociais podem ser acessadas durante o expediente com moderação. O uso de VPN pessoal na rede corporativa é proibido.`
  },

  // ─── LGPD ─────────────────────────────────────────
  {
    title: "Política de Privacidade e LGPD",
    category: "lgpd",
    content: `Política de Privacidade e LGPD — Techsfera Soluções S.A.
A Techsfera Soluções S.A. está comprometida com a Lei Geral de Proteção de Dados (Lei 13.709/2018). Os dados pessoais dos colaboradores são coletados exclusivamente para fins de gestão de recursos humanos, folha de pagamento, benefícios e obrigações legais. O encarregado de dados (DPO) é o Dr. Renato Carvalho, acessível pelo e-mail dpo@techsfera.com. Os dados são armazenados em servidores localizados no Brasil. O prazo de retenção de dados de colaboradores desligados é de 5 anos, conforme obrigações trabalhistas. Solicitações de acesso, correção, exclusão ou portabilidade de dados pessoais devem ser encaminhadas ao DPO com prazo de resposta de 15 dias. O compartilhamento de dados com terceiros ocorre apenas mediante contrato de processamento de dados e base legal adequada.`
  },
  {
    title: "Tratamento de Dados de Clientes e Parceiros",
    category: "lgpd",
    content: `Tratamento de Dados — Techsfera Soluções S.A.
Colaboradores que acessam dados de clientes e parceiros devem seguir rigorosamente esta política. Dados pessoais de clientes só podem ser acessados mediante necessidade comprovada para execução do trabalho. É proibido exportar ou copiar bases de dados de clientes para dispositivos pessoais. O envio de dados de clientes por e-mail deve ser feito com criptografia. Qualquer suspeita de vazamento de dados deve ser reportada imediatamente ao DPO. A empresa deve ser notificada de incidentes que possam causar risco aos titulares em até 72 horas, conforme exigência da ANPD. Treinamentos obrigatórios de LGPD devem ser concluídos anualmente na plataforma Techsfera Learn. A não conformidade com esta política pode resultar em sanções administrativas e desligamento.`
  },

  // ─── TREINAMENTO E ÉTICA ──────────────────────────
  {
    title: "Código de Ética e Conduta",
    category: "etica",
    content: `Código de Ética e Conduta — Techsfera Soluções S.A.
A Techsfera pauta sua atuação nos valores de integridade, respeito, inovação e responsabilidade. São condutas esperadas de todos os colaboradores: tratar colegas, clientes e parceiros com respeito e dignidade, manter confidencialidade sobre informações estratégicas, reportar irregularidades pelo canal de denúncias ético (0800-123-4567 ou etica@techsfera.com, com opção de anonimato), evitar conflitos de interesse e declarar ao RH qualquer relação que possa configurá-los, e não aceitar presentes ou vantagens de fornecedores acima de R$ 100,00. Assédio moral ou sexual é tolerância zero e sujeito a desligamento imediato. O canal de denúncias é gerido por empresa independente e garante anonimato. Investigações são conduzidas de forma imparcial pelo Comitê de Ética.`
  },
  {
    title: "Trilhas de Treinamento por Setor",
    category: "treinamento",
    content: `Trilhas de Treinamento — Techsfera Soluções S.A.
Cada setor possui uma trilha de treinamento obrigatória disponível na plataforma Techsfera Learn. Engenharia de Software: Git avançado, Clean Code, arquitetura de microsserviços, segurança em APIs e metodologias ágeis. Comercial: técnicas de vendas consultivas, CRM Salesforce, negociação e apresentação executiva. Financeiro: Excel avançado, SAP Finance, compliance fiscal e análise de demonstrativos. RH: legislação trabalhista atualizada, mediação de conflitos, recrutamento por competências e People Analytics. TI/Infraestrutura: ITIL Foundation, cloud AWS, cibersegurança e gestão de projetos. Os treinamentos obrigatórios devem ser concluídos em até 60 dias após a admissão. A plataforma emite certificados ao final de cada módulo. Treinamentos externos podem ser solicitados ao RH com até 30 dias de antecedência.`
  },
  {
    title: "Programa de Desenvolvimento e Carreira",
    category: "treinamento",
    content: `Desenvolvimento e Carreira — Techsfera Soluções S.A.
A Techsfera oferece um programa estruturado de desenvolvimento profissional. O Plano de Desenvolvimento Individual (PDI) é elaborado anualmente em conjunto com o gestor e o RH. A avaliação de desempenho ocorre semestralmente nos meses de junho e dezembro, utilizando a metodologia 9-Box. Promoções são analisadas após 18 meses na mesma função, com base no desempenho, potencial e disponibilidade de vagas. O programa de bolsas de estudo oferece subsídio de até 70% para graduação e 50% para pós-graduação em cursos relacionados à área de atuação. Certificações técnicas têm reembolso integral aprovado pelo gestor. O programa de mentoria interna conecta colaboradores sênior a colaboradores em desenvolvimento, com encontros mensais de 1 hora.`
  },
  {
    title: "Informações Gerais da Empresa",
    category: "empresa",
    content: `Informações Corporativas — Techsfera Soluções S.A.
A Techsfera Soluções S.A. foi fundada em 2010 e atua no desenvolvimento de soluções de software para o mercado financeiro e de saúde. A sede está localizada em São Paulo, SP, com escritórios em Brasília, Rio de Janeiro e Recife. O quadro atual é de aproximadamente 850 colaboradores. A empresa é certificada ISO 27001 (segurança da informação) e CMMI nível 3 (qualidade de processos de software). O CNPJ é 12.345.678/0001-99. O horário de funcionamento da sede é de segunda a sexta, das 8h às 19h. A recepção atende pelo ramal 0 ou pelo e-mail recepcao@techsfera.com. O refeitório funciona das 11h30 às 14h no 2º andar. O estacionamento para colaboradores está disponível no subsolo, mediante cadastro na portaria com o número da placa.`
  },
];
