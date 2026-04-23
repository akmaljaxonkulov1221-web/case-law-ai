'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Eye,
  MessageSquare,
  ThumbsUp,
  Award,
  Target,
  Zap,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Activity,
  PieChart,
  LineChart,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  totalCases: number
  completedCases: number
  averageScore: number
  totalStudyTime: number
  engagementRate: number
  retentionRate: number
}

interface UserActivity {
  date: string
  users: number
  sessions: number
  studyTime: number
  casesCompleted: number
}

interface PerformanceMetrics {
  category: string
  averageScore: number
  completionRate: number
  timeSpent: number
  difficulty: string
}

interface LearningPath {
  userId: string
  userName: string
  progress: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  nextSteps: string[]
}

export default function AnalyticsSystem() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 1234,
    activeUsers: 892,
    totalCases: 5678,
    completedCases: 4234,
    averageScore: 78.5,
    totalStudyTime: 12345,
    engagementRate: 85.2,
    retentionRate: 92.3
  })

  const [userActivity, setUserActivity] = useState<UserActivity[]>([
    { date: '2024-01-20', users: 892, sessions: 1456, studyTime: 2340, casesCompleted: 156 },
    { date: '2024-01-19', users: 845, sessions: 1321, studyTime: 2189, casesCompleted: 142 },
    { date: '2024-01-18', users: 912, sessions: 1523, studyTime: 2456, casesCompleted: 167 },
    { date: '2024-01-17', users: 878, sessions: 1389, studyTime: 2234, casesCompleted: 134 },
    { date: '2024-01-16', users: 901, sessions: 1456, studyTime: 2367, casesCompleted: 149 },
    { date: '2024-01-15', users: 856, sessions: 1298, studyTime: 2123, casesCompleted: 128 },
    { date: '2024-01-14', users: 889, sessions: 1412, studyTime: 2289, casesCompleted: 139 }
  ])

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([
    { category: 'Shartnoma huquqi', averageScore: 82.3, completionRate: 88.5, timeSpent: 45, difficulty: 'O\'rta' },
    { category: 'Fuqarolik huquqi', averageScore: 76.8, completionRate: 85.2, timeSpent: 52, difficulty: 'O\'rta' },
    { category: 'Intellektual mulk', averageScore: 71.2, completionRate: 78.9, timeSpent: 68, difficulty: 'Yuqori' },
    { category: 'Sud jarayoni', averageScore: 79.5, completionRate: 83.4, timeSpent: 58, difficulty: 'O\'rta' },
    { category: 'Me\'yoriy hujjatlar', averageScore: 85.7, completionRate: 91.2, timeSpent: 38, difficulty: 'Boshlang\'ich' }
  ])

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([
    {
      userId: '1',
      userName: 'Sarvar Karimov',
      progress: 78,
      strengths: ['Shartnoma huquqi', 'Dalillar tahlili'],
      weaknesses: ['Intellektual mulk', 'Sud jarayoni'],
      recommendations: ['Intellektual mulk bo\'yicha qo\'shimcha o\'qish', 'Sud jarayoni simulyatorlari'],
      nextSteps: ['Yuqori darajali shartnoma ishlari', 'Pretsedent tahlili']
    },
    {
      userId: '2',
      userName: 'Dilnoza Azimova',
      progress: 92,
      strengths: ['Intellektual mulk', 'Me\'yoriy hujjatlar'],
      weaknesses: ['Shartnoma buzilishi'],
      recommendations: ['Shartnoma to\'g\'risidagi amaliy ishlar'],
      nextSteps: ['Ekspert sifati sertifikati', 'Mentorlik dasturi']
    }
  ])

  const periods = [
    { value: 'day', label: 'Kun' },
    { value: 'week', label: 'Hafta' },
    { value: 'month', label: 'Oy' },
    { value: 'year', label: 'Yil' }
  ]

  const categories = [
    { value: 'all', label: 'Barchasi' },
    { value: 'contract', label: 'Shartnoma huquqi' },
    { value: 'civil', label: 'Fuqarolik huquqi' },
    { value: 'intellectual', label: 'Intellektual mulk' },
    { value: 'court', label: 'Sud jarayoni' }
  ]

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Activity className="w-4 h-4 text-gray-600" />
  }

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600'
    if (current < previous) return 'text-red-600'
    return 'text-gray-600'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Boshlang\'ich': return 'bg-green-100 text-green-700'
      case 'O\'rta': return 'bg-yellow-100 text-yellow-700'
      case 'Yuqori': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const refreshData = () => {
    // Simulate data refresh
    setAnalyticsData(prev => ({
      ...prev,
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
      engagementRate: Math.min(100, Math.max(0, prev.engagementRate + Math.random() * 2 - 1))
    }))
  }

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Analytics System
            </CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
              <Button variant="outline" onClick={refreshData}>
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {categories.map(category => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              {getTrendIcon(analyticsData.activeUsers, analyticsData.totalUsers - 100)}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{analyticsData.activeUsers}</div>
            <div className="text-sm text-gray-600">Aktiv foydalanuvchilar</div>
            <div className={`text-xs font-medium mt-2 ${getTrendColor(analyticsData.activeUsers, analyticsData.totalUsers - 100)}`}>
              +{((analyticsData.activeUsers / (analyticsData.totalUsers - 100) - 1) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              {getTrendIcon(analyticsData.completedCases, analyticsData.totalCases - 500)}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{analyticsData.completedCases}</div>
            <div className="text-sm text-gray-600">Tugallangan ishlar</div>
            <div className={`text-xs font-medium mt-2 ${getTrendColor(analyticsData.completedCases, analyticsData.totalCases - 500)}`}>
              +{((analyticsData.completedCases / (analyticsData.totalCases - 500) - 1) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              {getTrendIcon(analyticsData.averageScore, 75)}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{analyticsData.averageScore}%</div>
            <div className="text-sm text-gray-600">O\'rtacha ball</div>
            <div className={`text-xs font-medium mt-2 ${getTrendColor(analyticsData.averageScore, 75)}`}>
              +{(analyticsData.averageScore - 75).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              {getTrendIcon(analyticsData.totalStudyTime, 10000)}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{Math.floor(analyticsData.totalStudyTime / 60)}h</div>
            <div className="text-sm text-gray-600">O\'qish vaqti</div>
            <div className={`text-xs font-medium mt-2 ${getTrendColor(analyticsData.totalStudyTime, 10000)}`}>
              +{((analyticsData.totalStudyTime / 10000 - 1) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Foydalanuvchi faolligi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userActivity.slice(0, 7).map((activity, index) => (
                <div key={activity.date} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600 w-20">{activity.date}</div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{activity.users}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.floor(activity.studyTime / 60)}h
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {activity.casesCompleted}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              O\'qish ko\'rsatkichlari
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map(metric => (
                <div key={metric.category} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{metric.category}</h4>
                    <Badge className={getDifficultyColor(metric.difficulty)}>
                      {metric.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Ball</div>
                      <div className="font-medium">{metric.averageScore}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Tugallanish</div>
                      <div className="font-medium">{metric.completionRate}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Vaqt</div>
                      <div className="font-medium">{metric.timeSpent}min</div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${metric.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Paths */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            AI Learning Paths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {learningPaths.map(path => (
              <div key={path.userId} className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{path.userName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-sm text-gray-600">Progress:</div>
                      <div className="flex-1 max-w-xs">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(path.progress)}`}
                            style={{ width: `${path.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{path.progress}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <h5 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Kuchli tomonlar
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {path.strengths.map((strength, index) => (
                        <li key={index}>• {strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Kuchsiz tomonlar
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {path.weaknesses.map((weakness, index) => (
                        <li key={index}>• {weakness}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-blue-700 mb-2 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Tavsiyalar
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {path.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-purple-700 mb-2 flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Keyingi qadamlar
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {path.nextSteps.map((step, index) => (
                        <li key={index}>• {step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
