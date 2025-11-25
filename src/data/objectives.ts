
export interface Objective {
  id: string;
  title: string;
  description: string;
  icon: string;
  conversationType: 'proactive' | 'reactive';
}

export const objectives: Objective[] = [
  {
    id: 'leads',
    title: 'Aquecimento de Leads',
    description: 'Pré-venda, qualificação, envio de informações automáticas, redução do "chão frio".',
    icon: 'message-dots',
    conversationType: 'proactive'
  },
  {
    id: 'cobranca',
    title: 'Cobrança',
    description: 'Lembretes de pagamento, negociações, renegociação automática.',
    icon: 'moneybag-plus',
    conversationType: 'proactive'
  },
  {
    id: 'vendas',
    title: 'Vendas Diretas',
    description: 'Abordagem de clientes antigos, lançamento de produtos, upsell/cross-sell.',
    icon: 'message-dollar',
    conversationType: 'proactive'
  },
  {
    id: 'reativacao',
    title: 'Reativação de Clientes',
    description: 'Retomar contato com clientes sumidos, ofertas especiais para reengajar.',
    icon: 'user-plus',
    conversationType: 'proactive'
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    description: 'Guiar o novo cliente pelos primeiros passos, ativação e engajamento pós-venda.',
    icon: 'flag',
    conversationType: 'proactive'
  },
  {
    id: 'pesquisa',
    title: 'Pesquisa/NPS',
    description: 'Escala coleta de feedback real para decisões estratégicas.',
    icon: 'list-search',
    conversationType: 'proactive'
  },
  {
    id: 'suporte',
    title: 'Atendimento e Suporte',
    description: 'Escala operação, garante disponibilidade, reduz SLA.',
    icon: 'headset',
    conversationType: 'reactive'
  },
  {
    id: 'agendamentos',
    title: 'Agendamentos',
    description: 'Automatiza agendamentos e reservas para melhorar experiência do cliente.',
    icon: 'calendar',
    conversationType: 'reactive'
  },
  {
    id: 'assistente',
    title: 'Assistente de compra',
    description: 'Ajuda o cliente a encontrar a oportunidade de compra.',
    icon: 'shopping-cart',
    conversationType: 'reactive'
  }
];
