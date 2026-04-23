'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Settings,
  RefreshCw,
  BarChart3,
  Lightbulb,
  Star,
  Users,
  Calendar,
  Activity,
  ThumbsUp,
  MessageSquare
} from 'lucide-react'

interface AdaptiveLearning {
  userId: string
  userName: string
  currentLevel: number
  learningStyle: string
  strengths: string[]
  weaknesses: string[]
  recommendedContent: {
    type: string
    title: string
    difficulty: string
    estimatedTime: number
    priority: 'high' | 'medium' | 'low'
  }[]
  progress: {
    completed: number
    total: number
    averageScore: number
    timeSpent: number
  }
}

interface SmartRecommendation {
  id: string
  type: 'content' | 'strategy' | 'reminder' | 'achievement'
  title: string
  description: string
  action: string
  priority: 'high' | 'medium' | 'low'
  category: string
  impact: number
}

interface LearningPattern {
  userId: string
  pattern: string
  frequency: number
  effectiveness: number
  recommendations: string[]
}

export default function SmartSystem() {
  const [adaptiveLearning, setAdaptiveLearning] = useState<AdaptiveLearning[]>([
    {
      userId: '1',
      userName: 'Sarvar Karimov',
      currentLevel: 12,
      learningStyle: 'Visual',
      strengths: ['Shartnoma huquqi', 'Dalillar tahlili'],
      weaknesses: ['Intellektual mulk', 'Sud jarayoni'],
      recommendedContent: [
        {
          type: 'case',
          title: 'Intellektual mulk: Patent olish tartibi',
          difficulty: 'Yuqori',
          estimatedTime: 45,
          priority: 'high'
        },
        {
          type: 'video',
          title: 'Sud jarayoni: Notijoratlashtirish amaliyoti',
          difficulty: 'O\'rta',
          estimatedTime: 30,
          priority: 'medium'
        },
        {
          type: 'article',
          title: 'Shartnoma buzilishi: Eng ko\'p uchraydigan xatolar',
          difficulty: 'Boshlang\'ich',
          estimatedTime: 20,
          priority: 'low'
        }
      ],
      progress: {
        completed: 234,
        total: 300,
        averageScore: 78.5,
        timeSpent: 156
      }
    },
    {
      userId: '2',
      userName: 'Dilnoza Azimova',
      currentLevel: 15,
      learningStyle: 'Reading',
      strengths: ['Intellektual mulk', 'Me\'yoriy hujjatlar'],
      weaknesses: ['Shartnoma buzilishi'],
      recommendedContent: [
        {
          type: 'simulation',
          title: 'Shartnoma to\'g\'risidagi murakkab ish',
          difficulty: 'Yuqori',
          estimatedTime: 60,
          priority: 'high'
        },
        {
          type: 'quiz',
          title: 'Shartnoma huquqi bo\'yicha test',
          difficulty: 'O\'rta',
          estimatedTime: 25,
          priority: 'medium'
        }
      ],
      progress: {
        completed: 312,
        total: 350,
        averageScore: 85.2,
        timeSpent: 189
      }
    }
  ])

  const [smartRecommendations, setSmartRecommendations] = useState<SmartRecommendation[]>([
    {
      id: '1',
      type: 'content',
      title: 'Intellektual mulk bo\'yicha intensiv kurs',
      description: 'Sizning intellektual mulk sohasidagi bilimingizni kuchaytirish uchun AI tomonidan moslashtirilgan kurs',
      action: 'Kursni boshlash',
      priority: 'high',
      category: 'Content',
      impact: 0.85
    },
    {
      id: '2',
      type: 'strategy',
      title: 'O\'qish strategiyasini o\'zgartirish',
      description: 'Visual o\'qish usuli sizga ko\'proq mos keladi. Barcha kontentni vizual formatda olishni tavsiya etamiz',
      action: 'Strategiyani qo\'llash',
      priority: 'medium',
      category: 'Strategy',
      impact: 0.72
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Kundalik o\'qish vaqti',
      description: 'Siz har kuni 2 soat o\'qiysangiz, 2 haftada 1 daraja ko\'tarasiz',
      action: 'Eslatma o\'rnatish',
      priority: 'medium',
      category: 'Reminder',
      impact: 0.68
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Mantiq ustasi yutuqi',
      description: 'IRAC metodini mukammal o\'rganib, yangi yutuqni oching',
      action: 'Yutuqni ko\'rish',
      priority: 'low',
      category: 'Achievement',
      impact: 0.45
    }
  ])

  const [learningPatterns, setLearningPatterns] = useState<LearningPattern[]>([
    {
      userId: '1',
      pattern: 'Morning Learner',
      frequency: 0.85,
      effectiveness: 0.92,
      recommendations: [
        'Eng qiyin mavzularni ertalab o\'qing',
        'Kundalik ertalab sessiyalarini rejalashtiring',
        'Ertalabki 2 soat eng samarali vaqt'
      ]
    },
    {
      userId: '2',
      pattern: 'Visual Preference',
      frequency: 0.78,
      effectiveness: 0.88,
      recommendations: [
        'Videolar va diagrammalardan ko\'proq foydalaning',
        'Rasmli izohlarni afzal ko\'ring',
        'Mind maplar yarating'
      ]
    }
  ])

  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const contentTypes = [
    { value: 'case', label: 'Sud ishi', icon: BookOpen, color: 'bg-blue-100 text-blue-700' },
    { value: 'video', label: 'Video', icon: Activity, color: 'bg-purple-100 text-purple-700' },
    { value: 'article', label: 'Maqola', icon: MessageSquare, color: 'bg-green-100 text-green-700' },
    { value: 'quiz', label: 'Test', icon: Target, color: 'bg-orange-100 text-orange-700' },
    { value: 'simulation', label: 'Simulyatsiya', icon: Zap, color: 'bg-red-100 text-red-700' }
  ]

  const recommendationTypes = [
    { value: 'content', label: 'Kontent', icon: BookOpen, color: 'bg-blue-100 text-blue-700' },
    { value: 'strategy', label: 'Strategiya', icon: Settings, color: 'bg-purple-100 text-purple-700' },
    { value: 'reminder', label: 'Eslatma', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
    { value: 'achievement', label: 'Yutuq', icon: Award, color: 'bg-green-100 text-green-700' }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Boshlang\'ich': return 'bg-green-100 text-green-700'
      case 'O\'rta': return 'bg-yellow-100 text-yellow-700'
      case 'Yuqori': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getImpactColor = (impact: number) => {
    if (impact >= 0.8) return 'text-green-600'
    if (impact >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const analyzeUser = (userId: string) => {
    setIsAnalyzing(true)
    
    setTimeout(() => {
      // Simulate AI analysis
      const newRecommendations: SmartRecommendation[] = [
        {
          id: Date.now().toString(),
          type: 'content',
          title: 'Shaxsiy o\'qish rejasi',
          description: 'AI tomonidan siz uchun moslashtirilgan 2 haftalik o\'qish rejasi',
          action: 'Rejani ko\'rish',
          priority: 'high',
          category: 'Content',
          impact: 0.92
        }
      ]
      
      setSmartRecommendations([...smartRecommendations, ...newRecommendations])
      setIsAnalyzing(false)
    }, 2000)
  }

  const applyRecommendation = (recommendationId: string) => {
    setSmartRecommendations(recommendations.filter(r => r.id !== recommendationId))
  }

  const getContentTypeIcon = (type: string) => {
    return contentTypes.find(t => t.value === type)?.icon || BookOpen
  }

  const getRecommendationTypeIcon = (type: string) => {
    return recommendationTypes.find(t => t.value === type)?.icon || Lightbulb
  }

  return (
    <div className="space-y-6">
      {/* Smart System Header */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Smart Adaptive Learning System
            </CardTitle>
            <Button onClick={() => analyzeUser('1')} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  AI tahlil qilayapti...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  AI tahlil qilish
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">92%</div>
              <div className="text-sm text-purple-700">O\'qish samaradorligi</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">45min</div>
              <div className="text-sm text-blue-700">O\'rtacha sessiya</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">3.2x</div>
              <div className="text-sm text-green-700">O\'rganish tezligi</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adaptive Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Adaptive Learning Paths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {adaptiveLearning.map(learning => (
                <div key={learning.userId} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{learning.userName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">Level {learning.currentLevel}</span>
                        <Badge variant="outline">{learning.learningStyle}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Progress</div>
                      <div className="text-lg font-bold text-gray-900">
                        {Math.round((learning.progress.completed / learning.progress.total) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${(learning.progress.completed / learning.progress.total) * 100}%` }}
                    ></div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-gray-600">Ball</div>
                      <div className="font-medium">{learning.progress.averageScore}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Vaqt</div>
                      <div className="font-medium">{learning.progress.timeSpent}h</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Tugallangan</div>
                      <div className="font-medium">{learning.progress.completed}</div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium text-green-700 mb-2">Kuchli tomonlar</h5>
                      <div className="flex flex-wrap gap-1">
                        {learning.strengths.map((strength, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-red-700 mb-2">Kuchsiz tomonlar</h5>
                      <div className="flex flex-wrap gap-1">
                        {learning.weaknesses.map((weakness, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {weakness}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Content */}
                  <div>
                    <h5 className="font-medium text-blue-700 mb-2">Tavsiya etilgan kontent</h5>
                    <div className="space-y-2">
                      {learning.recommendedContent.slice(0, 2).map((content, index) => {
                        const Icon = getContentTypeIcon(content.type)
                        return (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-gray-600" />
                              <div>
                                <div className="text-sm font-medium">{content.title}</div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Badge className={getDifficultyColor(content.difficulty)}>
                                    {content.difficulty}
                                  </Badge>
                                  <span>{content.estimatedTime}min</span>
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              Boshlash
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Smart Recommendations */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              AI Smart Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {smartRecommendations.map(recommendation => {
                const Icon = getRecommendationTypeIcon(recommendation.type)
                return (
                  <div key={recommendation.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={recommendationTypes.find(t => t.value === recommendation.type)?.color}>
                              {recommendationTypes.find(t => t.value === recommendation.type)?.label}
                            </Badge>
                            <Badge className={getPriorityColor(recommendation.priority)}>
                              {recommendation.priority === 'high' ? 'Yuqori' : 
                               recommendation.priority === 'medium' ? 'O\'rta' : 'Past'}
                            </Badge>
                            <div className={`text-sm font-medium ${getImpactColor(recommendation.impact)}`}>
                              Impact: {Math.round(recommendation.impact * 100)}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => applyRecommendation(recommendation.id)}
                      >
                        Qo'llash
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{recommendation.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{recommendation.category}</span>
                      <Button size="sm" variant="outline">
                        {recommendation.action}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Patterns */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Learning Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {learningPatterns.map(pattern => (
              <div key={pattern.userId} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">{pattern.pattern}</h4>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Samaradorlik</div>
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(pattern.effectiveness * 100)}%
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Tez-tez uchrashi</span>
                    <span className="font-medium">{Math.round(pattern.frequency * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${pattern.frequency * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">AI tavsiyalari</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {pattern.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
