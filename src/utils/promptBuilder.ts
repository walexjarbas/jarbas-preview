import { SYSTEM_PROMPTS, ObjectiveKey } from '@/constants/systemPrompts';
import { JarbasState } from '@/hooks/useJarbasState';

export interface PromptConfig {
  systemPrompt: string;
  userContext: string;
}

export const buildSystemPrompt = (jarbasState: JarbasState): PromptConfig => {
  const { selectedObjective, conversationType, personalizationFields, guidelines, requestEvaluation } = jarbasState;
  
  // Get base prompt for selected objective
  const basePrompt = SYSTEM_PROMPTS[selectedObjective as ObjectiveKey]?.prompt || SYSTEM_PROMPTS.assistente.prompt;
  
  // Build personalization context
  const personalizationContext = personalizationFields
    .filter(field => field.selectedField && field.value)
    .map(field => `${field.selectedField}: ${field.value}`)
    .join('\n');

  // Build guidelines context
  const guidelinesContext = guidelines.length > 0 
    ? guidelines.map(g => `- ${g.title}: ${g.description}`).join('\n')
    : '';

  // Build conversation type context
  const conversationContext = conversationType === 'proactive' 
    ? 'Você deve iniciar conversas de forma proativa e engajar o cliente.'
    : 'Você deve responder de forma reativa às solicitações do cliente.';

  // Build evaluation context
  const evaluationContext = requestEvaluation
    ? 'IMPORTANTE: Ao final da conversa, solicite uma avaliação da experiência do cliente.'
    : '';

  // Combine all contexts
  const systemPrompt = `
${basePrompt}

TIPO DE CONVERSA: ${conversationContext}

${personalizationContext ? `INFORMAÇÕES DO CLIENTE:
${personalizationContext}` : ''}

${guidelinesContext ? `DIRETRIZES ESPECÍFICAS:
${guidelinesContext}` : ''}

${evaluationContext}

INSTRUÇÕES GERAIS:
- Sempre responda em português brasileiro
- Use as informações do cliente para personalizar as respostas
- Siga o tom e estilo definidos no prompt específico acima

REGRAS DE FORMATO:
- SEMPRE envie UMA mensagem curta por vez (máximo 2-3 frases)
- NUNCA envie todas as informações de uma vez
- Espere a resposta do cliente antes de avançar para o próximo passo
- Use o nome do cliente quando apropriado
`.trim();

  const userContext = personalizationContext ? `Informações do cliente: ${personalizationContext}` : '';

  return {
    systemPrompt,
    userContext
  };
};