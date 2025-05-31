import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

export function formatDate(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return date.toLocaleDateString()
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

export function getConversationTitle(firstMessage: string): string {
  const cleaned = firstMessage.replace(/[^\w\s]/gi, '').trim()
  const words = cleaned.split(/\s+/).slice(0, 6)
  return words.join(' ') || 'New Conversation'
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'absolute'
    textArea.style.left = '-999999px'
    document.body.prepend(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
    } catch (error) {
      console.error('Failed to copy text:', error)
    } finally {
      textArea.remove()
    }
    
    return Promise.resolve()
  }
}

export function downloadFile(content: string, filename: string, contentType = 'text/plain') {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = (e) => reject(e)
    reader.readAsText(file)
  })
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) return tokens.toString()
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`
  return `${(tokens / 1000000).toFixed(1)}M`
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function extractCodeBlocks(text: string): Array<{ language: string; code: string }> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const matches = []
  let match
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    matches.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    })
  }
  
  return matches
}

export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
}

export function getRandomColor(): string {
  const colors = [
    '#e8d5c4', '#f5e6d3', '#64748b', '#94a3b8', '#cbd5e1',
    '#475569', '#334155', '#1e293b', '#c1a297', '#a78079'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function generateGradient(color1: string, color2: string): string {
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function isMobile(): boolean {
  return window.innerWidth < 768
}

export function isTablet(): boolean {
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export function isDesktop(): boolean {
  return window.innerWidth >= 1024
}

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (isMobile()) return 'mobile'
  if (isTablet()) return 'tablet'
  return 'desktop'
}

export function vibrate(pattern: number | number[] = 100): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

export function playSound(frequency = 800, duration = 100, type: OscillatorType = 'sine'): void {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration / 1000)
  } catch (error) {
    console.warn('Audio not supported:', error)
  }
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}