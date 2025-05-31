'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Conversation, Message, UserPreferences, ChatState } from '@/types'
import { generateId } from '@/lib/utils'

interface ChatStore extends ChatState {
  // Actions
  createConversation: (title?: string, systemPrompt?: string) => string
  deleteConversation: (id: string) => void
  updateConversation: (id: string, updates: Partial<Conversation>) => void
  setCurrentConversation: (id: string) => void
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  clearConversations: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  exportConversation: (id: string) => void
  importConversations: (conversations: Conversation[]) => void
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  soundEnabled: true,
  animationsEnabled: true,
  compactMode: false,
  fontSize: 'medium',
  language: 'en',
  autoSave: true,
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isLoading: false,
      error: null,
      preferences: defaultPreferences,

      createConversation: (title = 'New Conversation', systemPrompt) => {
        const id = generateId()
        const newConversation: Conversation = {
          id,
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          systemPrompt,
          settings: {
            temperature: 0.7,
            maxTokens: 2048,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0,
          },
        }

        set(state => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }))

        return id
      },

      deleteConversation: (id) => {
        set(state => ({
          conversations: state.conversations.filter(conv => conv.id !== id),
          currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
        }))
      },

      updateConversation: (id, updates) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === id
              ? { ...conv, ...updates, updatedAt: new Date() }
              : conv
          ),
        }))
      },

      setCurrentConversation: (id) => {
        set({ currentConversationId: id })
      },

      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        }

        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  updatedAt: new Date(),
                }
              : conv
          ),
        }))
      },

      updateMessage: (conversationId, messageId, updates) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map(msg =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                  ),
                  updatedAt: new Date(),
                }
              : conv
          ),
        }))
      },

      deleteMessage: (conversationId, messageId) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.filter(msg => msg.id !== messageId),
                  updatedAt: new Date(),
                }
              : conv
          ),
        }))
      },

      clearConversations: () => {
        set({
          conversations: [],
          currentConversationId: null,
        })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      setError: (error) => {
        set({ error })
      },

      updatePreferences: (preferences) => {
        set(state => ({
          preferences: { ...state.preferences, ...preferences },
        }))
      },

      exportConversation: (id) => {
        const conversation = get().conversations.find(conv => conv.id === id)
        if (!conversation) return

        const dataStr = JSON.stringify(conversation, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `${conversation.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      },

      importConversations: (conversations) => {
        set(state => ({
          conversations: [...conversations, ...state.conversations],
        }))
      },
    }),
    {
      name: 'zenbot-chat-store',
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        preferences: state.preferences,
      }),
    }
  )
)