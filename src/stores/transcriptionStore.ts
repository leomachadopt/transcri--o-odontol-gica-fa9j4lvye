import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Transcription {
  id: string
  userId: string
  text: string
  timestamp: number
}

interface TranscriptionState {
  transcriptions: Transcription[]
  addTranscription: (transcription: Omit<Transcription, 'id'>) => void
  deleteTranscription: (id: string) => void
  getUserTranscriptions: (userId: string) => Transcription[]
}

export const useTranscriptionStore = create<TranscriptionState>()(
  persist(
    (set, get) => ({
      transcriptions: [],
      addTranscription: (transcription) => {
        const newTranscription = {
          ...transcription,
          id: crypto.randomUUID(),
        }
        set((state) => ({
          transcriptions: [newTranscription, ...state.transcriptions],
        }))
      },
      deleteTranscription: (id) => {
        set((state) => ({
          transcriptions: state.transcriptions.filter((t) => t.id !== id),
        }))
      },
      getUserTranscriptions: (userId) => {
        return get()
          .transcriptions.filter((t) => t.userId === userId)
          .sort((a, b) => b.timestamp - a.timestamp)
      },
    }),
    {
      name: 'dental-transcription-storage',
    },
  ),
)
