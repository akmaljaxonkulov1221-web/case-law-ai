import axios from 'axios'

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error)
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      // Forbidden - show permission error
      console.error('Permission denied')
    } else if (error.response?.status >= 500) {
      // Server error - show generic error
      console.error('Server error occurred')
    }
    
    return Promise.reject(error)
  }
)

// Types for API responses
export interface IRACAnalysis {
  issue: string
  rule: string
  application: string
  conclusion: string
  confidence_score: number
  relevant_laws: Array<{
    id: number
    title: string
    article_number: string
    code_name: string
    relevance: number
  }>
  relevant_cases: Array<{
    id: number
    title: string
    legal_domain: string
    precedent_value: string
    relevance: number
  }>
  reasoning: string
  feedback: string
}

export interface ScenarioGeneration {
  current_node_id: number
  node_title: string
  node_description: string
  scenarios: Array<{
    option_letter: string
    title: string
    description: string
    probability: number
    potential_outcome: string
    reasoning: string
    risk_level: string
    legal_implications: string[]
  }>
  analysis_summary: string
  confidence_score: number
  recommended_path: string
}

export interface WeaknessAnalysis {
  user_id: number
  analysis_period: string
  total_sessions_analyzed: number
  detected_weaknesses: Array<{
    weakness_type: string
    weakness_category: string
    severity_level: string
    confidence: number
    occurrences: number
    examples: string[]
    description: string
    recommended_actions: string[]
  }>
  overall_assessment: string
  improvement_suggestions: string[]
  confidence_score: number
}

export interface UserStats {
  total_cases: number
  active_cases: number
  compliance_rate: number
  risk_score: number
  monthly_analyses: number
  average_processing_time: number
}

export interface DashboardData {
  user: {
    id: number
    name: string
    email: string
    xp_points: number
    level: number
    current_streak: number
    longest_streak: number
    total_cases_solved: number
    success_rate: number
    subscription_plan: string
  }
  stats: UserStats
  recent_achievements: Array<{
    id: number
    title: string
    description: string
    unlocked_at: string
    icon_url: string
  }>
  recent_cases: Array<{
    id: number
    title: string
    legal_domain: string
    difficulty_level: string
    completed_at: string
    score: number
  }>
}

// IRAC Solver API
export const iracAPI = {
  solveCase: async (caseText: string, caseId?: number, legalDomain?: string) => {
    const response = await api.post('/api/v1/irac/solve', {
      case_text: caseText,
      case_id: caseId,
      legal_domain: legalDomain,
    })
    return response.data
  },

  getSession: async (sessionId: number) => {
    const response = await api.get(`/api/v1/irac/session/${sessionId}`)
    return response.data
  },

  updateSession: async (sessionId: number, componentType: string, newText: string) => {
    const response = await api.put(`/api/v1/irac/session/${sessionId}`, {
      component_type: componentType,
      new_text: newText,
    })
    return response.data
  },

  evaluateSession: async (sessionId: number, maxScore: number = 100) => {
    const response = await api.post(`/api/v1/irac/session/${sessionId}/evaluate`, {
      max_score: maxScore,
    })
    return response.data
  },

  getHistory: async (limit: number = 10) => {
    const response = await api.get(`/api/v1/irac/history?limit=${limit}`)
    return response.data
  },

  getLegalDomains: async () => {
    const response = await api.get('/api/v1/irac/domains')
    return response.data
  },
}

// Scenario Generator API
export const scenarioAPI = {
  generateScenarios: async (nodeId: number, context?: any) => {
    const response = await api.post('/api/v1/scenarios/generate', {
      node_id: nodeId,
      context: context,
    })
    return response.data
  },

  saveScenario: async (scenarioData: any) => {
    const response = await api.post('/api/v1/scenarios/save', scenarioData)
    return response.data
  },

  getHistory: async (limit: number = 10) => {
    const response = await api.get(`/api/v1/scenarios/history?limit=${limit}`)
    return response.data
  },

  getNodeInfo: async (nodeId: number) => {
    const response = await api.get(`/api/v1/scenarios/node/${nodeId}`)
    return response.data
  },

  getTreeNodes: async (treeId: number) => {
    const response = await api.get(`/api/v1/scenarios/tree/${treeId}/nodes`)
    return response.data
  },

  getTreeTypes: async () => {
    const response = await api.get('/api/v1/scenarios/tree-types')
    return response.data
  },

  getNodeTypes: async () => {
    const response = await api.get('/api/v1/scenarios/node-types')
    return response.data
  },

  getRiskLevels: async () => {
    const response = await api.get('/api/v1/scenarios/risk-levels')
    return response.data
  },
}

// Weakness Detection API
export const weaknessAPI = {
  analyzeWeaknesses: async (userId: number, analysisPeriod: string = '30d') => {
    const response = await api.post('/api/v1/weakness/analyze', {
      user_id: userId,
      analysis_period: analysisPeriod,
    })
    return response.data
  },

  getUserWeaknesses: async (userId: number, status?: string) => {
    const params = status ? `?status=${status}` : ''
    const response = await api.get(`/api/v1/weakness/user/${userId}${params}`)
    return response.data
  },

  updateWeaknessProgress: async (weaknessId: number, progress: number) => {
    const response = await api.put('/api/v1/weakness/progress', {
      weakness_id: weaknessId,
      progress: progress,
    })
    return response.data
  },

  getWeaknessDetail: async (weaknessId: number) => {
    const response = await api.get(`/api/v1/weakness/weakness/${weaknessId}`)
    return response.data
  },

  getWeaknessTypes: async () => {
    const response = await api.get('/api/v1/weakness/types')
    return response.data
  },

  getWeaknessCategories: async () => {
    const response = await api.get('/api/v1/weakness/categories')
    return response.data
  },

  getSeverityLevels: async () => {
    const response = await api.get('/api/v1/weakness/severity-levels')
    return response.data
  },

  getRecommendations: async (weaknessType: string) => {
    const response = await api.get(`/api/v1/weakness/recommendations/${weaknessType}`)
    return response.data
  },
}

// Dashboard API
export const dashboardAPI = {
  getDashboardData: async (userId: number) => {
    const response = await api.get(`/api/v1/dashboard/${userId}`)
    return response.data
  },

  getUserStats: async (userId: number) => {
    const response = await api.get(`/api/v1/stats/user/${userId}`)
    return response.data
  },

  getSystemStats: async () => {
    const response = await api.get('/api/v1/stats')
    return response.data
  },

  updateProfile: async (userData: any) => {
    const response = await api.put('/api/v1/user/profile', userData)
    return response.data
  },
}

// Health Check API
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health')
    return response.data
  },

  checkIRACHealth: async () => {
    const response = await api.get('/api/v1/irac/health')
    return response.data
  },

  checkScenarioHealth: async () => {
    const response = await api.get('/api/v1/scenarios/health')
    return response.data
  },

  checkWeaknessHealth: async () => {
    const response = await api.get('/api/v1/weakness/health')
    return response.data
  },
}

// Utility functions
export const handleAPIError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      message: error.response.data.detail || error.response.data.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data
    }
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      data: null
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      data: null
    }
  }
}

// Retry utility for failed requests
export const retryRequest = async (
  requestFn: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
    }
  }
  throw new Error('Max retries exceeded')
}

export default api
