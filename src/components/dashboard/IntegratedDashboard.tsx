'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Target, 
  Flame, 
  TrendingUp, 
  Star,
  Zap,
  Award,
  Crown,
  Shield,
  BookOpen,
  Users,
  Activity,
  Clock,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import { dashboardAPI, handleAPIError } from '@/lib/api-service'

interface UserStats {
  total_cases: number
  active_cases: number
  compliance_rate: number
  risk_score: number
  monthly_analyses: number
  average_processing_time: number
}

interface UserData {
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

interface Achievement {
  id: number
  title: string
  description: string
  unlocked_at: string
  icon_url: string
}

interface RecentCase {
  id: number
  title: string
  legal_domain: string
  difficulty_level: string
  completed_at: string
  score: number
}

export default function IntegratedDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [recentCases, setRecentCases] = useState<RecentCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null)
      
      // Mock user ID - in real app, get from auth context
      const userId = 1
      
      // Fetch user stats
      const statsResponse = await dashboardAPI.getUserStats(userId)
      setStats(statsResponse.stats)
      
      // Mock user data for now
      setUserData({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        xp_points: 2450,
        level: 12,
        current_streak: 7,
        longest_streak: 15,
        total_cases_solved: 89,
        success_rate: 87.5,
        subscription_plan: 'premium'
      })
      
      // Mock achievements
      setAchievements([
        {
          id: 1,
          title: 'First Steps',
          description: 'Complete your first case',
          unlocked_at: '2024-01-15',
          icon_url: '/badges/first-steps.png'
        },
        {
          id: 2,
          title: 'Week Warrior',
          description: 'Maintain a 7-day streak',
          unlocked_at: '2024-01-20',
          icon_url: '/badges/week-warrior.png'
        },
        {
          id: 3,
          title: 'Legal Expert',
          description: 'Reach level 10',
          unlocked_at: '2024-01-25',
          icon_url: '/badges/legal-expert.png'
        }
      ])
      
      // Mock recent cases
      setRecentCases([
        {
          id: 1,
          title: 'Contract Dispute Case',
          legal_domain: 'civil',
          difficulty_level: 'medium',
          completed_at: '2024-01-30',
          score: 92
        },
        {
          id: 2,
          title: 'Criminal Law Analysis',
          legal_domain: 'criminal',
          difficulty_level: 'advanced',
          completed_at: '2024-01-29',
          score: 88
        },
        {
          id: 3,
          title: 'Constitutional Rights Case',
          legal_domain: 'constitutional',
          difficulty_level: 'expert',
          completed_at: '2024-01-28',
          score: 95
        }
      ])
      
    } catch (err) {
      const errorInfo = handleAPIError(err)
      setError(errorInfo.message)
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
  }

  // Calculate level progress
  const getLevelProgress = (level: number, xp: number) => {
    const xpForNextLevel = level * 100
    const xpForCurrentLevel = (level - 1) * 100
    const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
    return Math.min(progress, 100)
  }

  // Get risk level color
  const getRiskLevelColor = (riskScore: number) => {
    if (riskScore <= 20) return 'text-green-600'
    if (riskScore <= 40) return 'text-yellow-600'
    if (riskScore <= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  // Get success rate color
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 75) return 'text-yellow-600'
    if (rate >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button 
              onClick={handleRefresh}
              className="ml-auto px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Level Card */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="w-5 h-5 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">
                Level {userData?.level || 1}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {userData?.xp_points || 0} XP
              </div>
              <div className="text-sm text-gray-600">Experience Points</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getLevelProgress(userData?.level || 1, userData?.xp_points || 0)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate Card */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700">
                Success
              </Badge>
            </div>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getSuccessRateColor(userData?.success_rate || 0)}`}>
                {userData?.success_rate || 0}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle className="w-3 h-3" />
                {userData?.total_cases_solved || 0} cases solved
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-700">
                Active
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-600">
                {userData?.current_streak || 0}
              </div>
              <div className="text-sm text-gray-600">Current Streak</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <TrendingUp className="w-3 h-3" />
                Best: {userData?.longest_streak || 0} days
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Score Card */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700">
                Risk
              </Badge>
            </div>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getRiskLevelColor(stats?.risk_score || 0)}`}>
                {stats?.risk_score || 0}
              </div>
              <div className="text-sm text-gray-600">Risk Score</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <BarChart3 className="w-3 h-3" />
                {stats?.total_cases || 0} total cases
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Analyses */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-blue-600" />
              Monthly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Analyses this month</span>
                <span className="text-lg font-bold text-blue-600">
                  {stats?.monthly_analyses || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average processing time</span>
                <span className="text-lg font-bold text-gray-900">
                  {stats?.average_processing_time || 0}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Compliance rate</span>
                <span className="text-lg font-bold text-green-600">
                  {stats?.compliance_rate || 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-yellow-600" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{achievement.title}</div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Cases */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-green-600" />
              Recent Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCases.slice(0, 3).map((case_) => (
                <div key={case_.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{case_.title}</div>
                    <div className="text-xs text-gray-600">
                      {case_.legal_domain} • {case_.difficulty_level}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">{case_.score}%</div>
                    <div className="text-xs text-gray-500">
                      {new Date(case_.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Status */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  {userData?.subscription_plan === 'premium' ? 'Premium' : 'Basic'} Plan
                </div>
                <div className="text-sm text-white/80">
                  {userData?.subscription_plan === 'premium' 
                    ? 'Unlimited access to all features' 
                    : 'Upgrade to unlock premium features'
                  }
                </div>
              </div>
            </div>
            {userData?.subscription_plan !== 'premium' && (
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100">
                Upgrade Now
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
