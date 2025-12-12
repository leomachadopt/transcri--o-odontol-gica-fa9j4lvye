import { create } from 'zustand'
import { transcriptionAPI } from '@/lib/api'

export interface Transcription {
  id: string
  userId: string
  text: string
  timestamp: number
}

interface TranscriptionState {
  transcriptions: Transcription[]
  isLoading: boolean
  error: string | null
  fetchTranscriptions: () => Promise<void>
  addTranscription: (transcription: Omit<Transcription, 'id'>) => Promise<boolean>
  deleteTranscription: (id: string) => Promise<boolean>
  getUserTranscriptions: (userId: string) => Transcription[]
  clearError: () => void
}

export const useTranscriptionStore = create<TranscriptionState>()((set, get) => ({
  transcriptions: [],
  isLoading: false,
  error: null,
  fetchTranscriptions: async () => {
    set({ isLoading: true, error: null })
    try {
      const transcriptions = await transcriptionAPI.getAll()
      set({ transcriptions, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar transcrições'
      set({ error: errorMessage, isLoading: false })
    }
  },
  addTranscription: async (transcription) => {
    set({ error: null })
    try {
      const newTranscription = await transcriptionAPI.create(
        transcription.text,
        transcription.timestamp
      )
      set((state) => ({
        transcriptions: [newTranscription, ...state.transcriptions],
      }))
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar transcrição'
      set({ error: errorMessage })
      return false
    }
  },
  deleteTranscription: async (id) => {
    set({ error: null })
    try {
      await transcriptionAPI.delete(id)
      set((state) => ({
        transcriptions: state.transcriptions.filter((t) => t.id !== id),
      }))
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir transcrição'
      set({ error: errorMessage })
      return false
    }
  },
  getUserTranscriptions: (userId) => {
    return get()
      .transcriptions.filter((t) => t.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
  },
  clearError: () => {
    set({ error: null })
  },
}))
