import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'

interface SpeechRecognitionHook {
  isRecording: boolean
  transcript: string
  interimTranscript: string
  startRecording: () => void
  stopRecording: () => void
  resetTranscript: () => void
  error: string | null
  isSupported: boolean
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      setIsSupported(false)
      setError('Seu navegador não suporta reconhecimento de fala.')
      return
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'pt-BR'

    recognitionRef.current.onstart = () => {
      setIsRecording(true)
      setError(null)
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error)
      if (event.error === 'not-allowed') {
        setError('Permissão de microfone negada.')
        setIsRecording(false)
      } else if (event.error === 'network') {
        setError(
          'Erro de rede. Verifique sua conexão para o reconhecimento de fala.',
        )
      } else {
        setError(`Erro no reconhecimento: ${event.error}`)
      }
    }

    recognitionRef.current.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = ''
      let currentInterim = ''

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' '
        } else {
          currentInterim += event.results[i][0].transcript
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript)
      }
      setInterimTranscript(currentInterim)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      try {
        recognitionRef.current.start()
      } catch (e) {
        console.error('Failed to start recording', e)
        toast.error('Não foi possível iniciar a gravação. Tente novamente.')
      }
    }
  }, [isRecording])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
    }
  }, [isRecording])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }, [])

  return {
    isRecording,
    transcript: transcript + interimTranscript,
    interimTranscript,
    startRecording,
    stopRecording,
    resetTranscript,
    error,
    isSupported,
  }
}
