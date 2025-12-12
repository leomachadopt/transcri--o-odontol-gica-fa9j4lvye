const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Função auxiliar para fazer requisições
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token')
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      // Tentar obter mensagem de erro do servidor
      let errorMessage = `Erro HTTP: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch {
        // Se não conseguir parsear JSON, usar mensagem padrão baseada no status
        if (response.status === 0 || response.status >= 500) {
          errorMessage = 'Servidor não disponível. Verifique se o backend está rodando.'
        } else if (response.status === 404) {
          errorMessage = 'Endpoint não encontrado. Verifique a URL da API.'
        } else if (response.status === 401 || response.status === 403) {
          errorMessage = 'Não autorizado. Faça login novamente.'
        } else if (response.status === 409) {
          errorMessage = 'Este email já está cadastrado.'
        }
      }
      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error) {
    // Capturar erros de rede (CORS, conexão, etc)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${API_URL.replace('/api', '')}`
      )
    }
    // Re-lançar outros erros
    throw error
  }
}

// API de Autenticação
export const authAPI = {
  async register(name: string, email: string, password: string) {
    const data = await request<{ user: { id: string; name: string; email: string }; token: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }
    )
    return data
  },

  async login(email: string, password: string) {
    const data = await request<{ user: { id: string; name: string; email: string }; token: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    )
    return data
  },

  async getMe() {
    const data = await request<{ user: { id: string; name: string; email: string } }>(
      '/auth/me'
    )
    return data
  },
}

// API de Transcrições
export const transcriptionAPI = {
  async getAll() {
    const data = await request<{ transcriptions: Array<{ id: string; userId: string; text: string; timestamp: number }> }>(
      '/transcriptions'
    )
    return data.transcriptions
  },

  async getById(id: string) {
    const data = await request<{ id: string; userId: string; text: string; timestamp: number }>(
      `/transcriptions/${id}`
    )
    return data
  },

  async create(text: string, timestamp: number) {
    const data = await request<{ id: string; userId: string; text: string; timestamp: number }>(
      '/transcriptions',
      {
        method: 'POST',
        body: JSON.stringify({ text, timestamp }),
      }
    )
    return data
  },

  async update(id: string, text: string) {
    const data = await request<{ id: string; userId: string; text: string; timestamp: number }>(
      `/transcriptions/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ text }),
      }
    )
    return data
  },

  async delete(id: string) {
    await request(`/transcriptions/${id}`, {
      method: 'DELETE',
    })
  },
}

