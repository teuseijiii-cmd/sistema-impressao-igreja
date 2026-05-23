import axios from 'axios';

interface ClassifiedDocument {
  category: string;
  subCategory: string;
  date: string;
  team: string;
  event: string;
  confidence: number;
}

export class DocumentClassificationService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY || '';
  }

  async classifyDocument(filename: string, content: string): Promise<ClassifiedDocument> {
    // Usando regras de padrão de nome (rápido e sem custo)
    const ruleBased = this.classifyByPattern(filename);
    if (ruleBased.confidence > 0.8) return ruleBased;

    // Se a confiança é baixa, chama IA (Claude)
    try {
      const aiResult = await this.classifyWithAI(filename, content);
      return aiResult;
    } catch (error) {
      console.error('Erro ao classificar com IA, usando fallback:', error);
      return ruleBased;
    }
  }

  private classifyByPattern(filename: string): ClassifiedDocument {
    const lowerName = filename.toLowerCase();
    let category = 'Outros';
    let subCategory = '';
    let date = '';
    let team = '';
    let event = '';
    let confidence = 0.5;

    // Mapeamento de palavras-chave para categorias
    const patterns = [
      { keywords: ['escala', 'planilha'], category: 'Escalas', subCategory: 'Escala de Serviço', confidence: 0.9 },
      { keywords: ['tarefa', 'checklist'], category: 'Tarefas', subCategory: 'Checklist', confidence: 0.9 },
      { keywords: ['louvor', 'cântico', 'hinário'], category: 'Louvor', subCategory: 'Repertório', confidence: 0.9 },
      { keywords: ['aviso', 'comunicado', 'edital'], category: 'Avisos', subCategory: 'Comunicado Geral', confidence: 0.9 },
      { keywords: ['mídia', 'projeção', 'datashow'], category: 'Mídia', subCategory: 'Projeção', confidence: 0.9 },
      { keywords: ['cronograma', 'agenda', 'calendário'], category: 'Cronograma', subCategory: 'Agenda', confidence: 0.9 },
      { keywords: ['relatório', 'prestação'], category: 'Relatórios', subCategory: 'Relatório', confidence: 0.8 },
    ];

    for (const pattern of patterns) {
      if (pattern.keywords.some(k => lowerName.includes(k))) {
        category = pattern.category;
        subCategory = pattern.subCategory;
        confidence = pattern.confidence;
        break;
      }
    }

    // Extrair data (formato DDMMYYYY ou DD/MM/YYYY)
    const dateMatch = filename.match(/(\d{2})[\/\-]?(\d{2})[\/\-]?(\d{4})/);
    if (dateMatch) {
      date = `${dateMatch[2]}/${dateMatch[1]}/${dateMatch[3]}`; // DD/MM/YYYY
    }

    // Extrair equipe
    const teamKeywords = ['mídia', 'louvor', 'diaconia', 'secretaria', 'comunicação', 'infraestrutura'];
    for (const t of teamKeywords) {
      if (lowerName.includes(t)) {
        team = t.charAt(0).toUpperCase() + t.slice(1);
        break;
      }
    }

    // Extrair evento
    const eventKeywords = ['domingo', 'sábado', 'quarta', 'culto', 'célula', 'jovens', 'adultos'];
    for (const e of eventKeywords) {
      if (lowerName.includes(e)) {
        event = e.charAt(0).toUpperCase() + e.slice(1);
        break;
      }
    }

    return { category, subCategory, date, team, event, confidence };
  }

  private async classifyWithAI(filename: string, content: string): Promise<ClassifiedDocument> {
    // Implementar chamada à API Claude
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-haiku',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: `Classifique o documento com nome "${filename}" e conteúdo:\n${content.substring(0, 1000)}\n\nCategorias possíveis: Escalas, Tarefas, Louvor, Avisos, Mídia, Cronograma, Relatórios.\nForneça: categoria, subcategoria, data, equipe, evento.`
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      }
    );

    const result = response.data.content[0].text;
    // Parsear resposta (simplificado)
    return {
      category: 'Outros',
      subCategory: '',
      date: '',
      team: '',
      event: '',
      confidence: 0.6
    };
  }
}

export const documentClassificationService = new DocumentClassificationService();
