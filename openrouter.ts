import { APIResponse, StreamingResponse, Message } from '@/types'

const OPENROUTER_API_KEY = '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'
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export const AVAILABLE_MODELS = [
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B Instruct',
    provider: 'Meta',
    description: 'Fast and efficient instruction-following model',
    maxTokens: 131072,
    pricing: { input: 0, output: 0 },
    isFree: true,
    capabilities: ['chat', 'instruct'],
  },
  {
    id: 'meta-llama/llama-3.2-1b-instruct:free',
    name: 'Llama 3.2 1B Instruct',
    provider: 'Meta',
    description: 'Lightweight instruction-following model',
    maxTokens: 131072,
    pricing: { input: 0, output: 0 },
    isFree: true,
    capabilities: ['chat', 'instruct'],
  },
  {
    id: 'microsoft/phi-3-mini-128k-instruct:free',
    name: 'Phi-3 Mini 128K',
    provider: 'Microsoft',
    description: 'Compact yet powerful instruction model',
    maxTokens: 128000,
    pricing: { input: 0, output: 0 },
    isFree: true,
    capabilities: ['chat', 'instruct'],
  },
  {
    id: 'huggingface/zephyr-7b-beta:free',
    name: 'Zephyr 7B Beta',
    provider: 'Hugging Face',
    description: 'Fine-tuned for helpful conversations',
    maxTokens: 32768,
    pricing: { input: 0, output: 0 },
    isFree: true,
    capabilities: ['chat', 'assistant'],
  },
]

export class OpenRouterAPI {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string = OPENROUTER_API_KEY) {
    this.apiKey = apiKey
    this.baseUrl = OPENROUTER_BASE_URL
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultHeaders = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'ZenBotTX9000',
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error?.message || 
        `API request failed: ${response.status} ${response.statusText}`
      )
    }

    return response
  }

  async createCompletion(
    messages: Message[],
    model: string = 'meta-llama/llama-3.2-3b-instruct:free',
    options: {
      temperature?: number
      maxTokens?: number
      topP?: number
      frequencyPenalty?: number
      presencePenalty?: number
      stream?: boolean
    } = {}
  ): Promise<APIResponse> {
    const {
      temperature = 0.7,
      maxTokens = 2048,
      topP = 1,
      frequencyPenalty = 0,
      presencePenalty = 0,
      stream = false,
    } = options

    const requestBody = {
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      stream,
    }

    const response = await this.makeRequest('/chat/completions', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    })

    return response.json()
  }

  async *createStreamingCompletion(
    messages: Message[],
    model: string = 'meta-llama/llama-3.2-3b-instruct:free',
    options: {
      temperature?: number
      maxTokens?: number
      topP?: number
      frequencyPenalty?: number
      presencePenalty?: number
    } = {}
  ): AsyncGenerator<StreamingResponse, void, unknown> {
    const {
      temperature = 0.7,
      maxTokens = 2048,
      topP = 1,
      frequencyPenalty = 0,
      presencePenalty = 0,
    } = options

    const requestBody = {
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      stream: true,
    }

    const response = await this.makeRequest('/chat/completions', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    })

    if (!response.body) {
      throw new Error('No response body for streaming')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            
            if (data === '[DONE]') {
              return
            }

            try {
              const parsed: StreamingResponse = JSON.parse(data)
              yield parsed
            } catch (error) {
              console.warn('Failed to parse streaming response:', data)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  async getModels() {
    const response = await this.makeRequest('/models')
    return response.json()
  }

  async getUsage() {
    const response = await this.makeRequest('/usage')
    return response.json()
  }
}

export const openRouter = new OpenRouterAPI()

// System prompts for different use cases
export const SYSTEM_PROMPTS = {
  default: `You are ZenBotTX9000, a comprehensive, premium, sophisticated, and fully functional enterprise AI assistant. You provide detailed, expert responses across all domains. Your communication style is professional, knowledgeable, and helpful. You excel at:

- Providing in-depth analysis and insights
- Solving complex problems step-by-step  
- Offering multiple perspectives on issues
- Creating detailed documentation and explanations
- Assisting with technical and business decisions
- Maintaining context throughout long conversations

Always strive to give thorough, well-structured responses that demonstrate expertise while remaining accessible to users of all technical levels.`,

  creative: `You are ZenBotTX9000 in creative mode - an innovative AI assistant specialized in creative thinking, brainstorming, and artistic endeavors. You excel at generating original ideas, creative writing, design concepts, and helping users explore their creative potential. Approach tasks with imagination, originality, and artistic flair.`,

  technical: `You are ZenBotTX9000 in technical mode - an expert systems architect and technical consultant. You provide precise, detailed technical guidance across programming, system design, DevOps, and engineering. Your responses include code examples, best practices, and comprehensive technical analysis.`,

  business: `You are ZenBotTX9000 in business mode - a strategic business consultant with expertise in operations, strategy, finance, and management. You provide actionable business insights, strategic recommendations, and help optimize business processes and decision-making.`,

  research: `You are ZenBotTX9000 in research mode - a thorough research analyst who provides comprehensive, well-sourced information. You excel at gathering, analyzing, and synthesizing information from multiple perspectives to provide complete and nuanced understanding of topics.`,
}