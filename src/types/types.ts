export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  isStreaming?: boolean
  metadata?: {
    model?: string
    tokensUsed?: number
    processingTime?: number
  }
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  model: string
  systemPrompt?: string
  settings?: ConversationSettings
}

export interface ConversationSettings {
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
}

export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  maxTokens: number
  pricing: {
    input: number
    output: number
  }
  isFree: boolean
  capabilities: string[]
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto'
  soundEnabled: boolean
  animationsEnabled: boolean
  compactMode: boolean
  fontSize: 'small' | 'medium' | 'large'
  language: string
  autoSave: boolean
}

export interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
  error: string | null
  preferences: UserPreferences
}

export interface APIResponse {
  choices: Array<{
    message: {
      content