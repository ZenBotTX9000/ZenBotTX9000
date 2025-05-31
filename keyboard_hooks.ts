import { useEffect } from 'react'

interface KeyboardShortcuts {
  onToggleCommandPalette: () => void
  onToggleSidebar: () => void
  onNewConversation?: () => void
  onClearConversations?: () => void
  onExportConversation?: () => void
  onFocusInput?: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, metaKey, ctrlKey, shiftKey, altKey } = event
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? metaKey : ctrlKey

      // Prevent shortcuts when typing in inputs
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        // Only allow command palette shortcut in inputs
        if (modifier && key === 'k') {
          event.preventDefault()
          shortcuts.onToggleCommandPalette()
        }
        return
      }

      // Command + K or Ctrl + K - Toggle command palette
      if (modifier && key === 'k') {
        event.preventDefault()
        shortcuts.onToggleCommandPalette()
      }

      // Command + B or Ctrl + B - Toggle sidebar
      if (modifier && key === 'b') {
        event.preventDefault()
        shortcuts.onToggleSidebar()
      }

      // Command + N or Ctrl + N - New conversation
      if (modifier && key === 'n' && shortcuts.onNewConversation) {
        event.preventDefault()
        shortcuts.onNewConversation()
      }

      // Command + Shift + Delete - Clear conversations
      if (modifier && shiftKey && key === 'Backspace' && shortcuts.onClearConversations) {
        event.preventDefault()
        shortcuts.onClearConversations()
      }

      // Command + E or Ctrl + E - Export conversation
      if (modifier && key === 'e' && shortcuts.onExportConversation) {
        event.preventDefault()
        shortcuts.onExportConversation()
      }

      // Command + I or Ctrl + I - Focus input
      if (modifier && key === 'i' && shortcuts.onFocusInput) {
        event.preventDefault()
        shortcuts.onFocusInput()
      }

      // Escape - General escape key handling
      if (key === 'Escape') {
        // This will be handled by individual components
      }

      // Arrow keys for navigation (when not in input)
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        // This will be handled by command palette and other navigational components
      }

      // Enter for quick actions
      if (key === 'Enter' && !modifier && !shiftKey) {
        // This will be handled by individual components
      }

      // Tab for accessibility
      if (key === 'Tab') {
        // Let browser handle tab navigation
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export const KEYBOARD_SHORTCUTS = [
  {
    key: '⌘K',
    action: 'Open command palette',
    category: 'Navigation',
  },
  {
    key: '⌘B',
    action: 'Toggle sidebar',
    category: 'Navigation',
  },
  {
    key: '⌘N',
    action: 'New conversation',
    category: 'Conversation',
  },
  {
    key: '⌘I',
    action: 'Focus input',
    category: 'Navigation',
  },
  {
    key: '⌘E',
    action: 'Export conversation',
    category: 'Conversation',
  },
  {
    key: '⌘⇧⌫',
    action: 'Clear conversations',
    category: 'Conversation',
  },
  {
    key: 'Esc',
    action: 'Close modals/panels',
    category: 'Navigation',
  },
  {
    key: '↑↓',
    action: 'Navigate options',
    category: 'Navigation',
  },
  {
    key: 'Enter',
    action: 'Send message/Select',
    category: 'Action',
  },
  {
    key: '⇧Enter',
    action: 'New line in message',
    category: 'Input',
  },
]