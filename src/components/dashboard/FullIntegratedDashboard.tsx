'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import IntegratedDashboard from './IntegratedDashboard'
import InteractiveCaseSolver from '../case/InteractiveCaseSolver'
import DynamicDecisionTreeRenderer from '../decision/DynamicDecisionTreeRenderer'
import GamificationFeedback from '../gamification/GamificationFeedback'
import { 
  Brain,
  GitBranch,
  Trophy,
  Target,
  Activity,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  Zap,
  Shield,
  BookOpen,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'

export default function FullIntegratedDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial user data
  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      // Mock user data - in real app, fetch from API
      setUserData({
        id: 1,
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
      setError(null)
    } catch (err) {
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  // Handle achievement unlock
  const handleAchievementUnlocked = (achievement: any) => {
    console.log('Achievement unlocked:', achievement)
    // Show notification or update UI
  }

  // Handle level up
  const handleLevelUp = (levelData: any) => {
    console.log('Level up:', levelData)
    // Update user data
    setUserData(prev => prev ? {
      ...prev,
      level: levelData.new_level,
      xp_points: levelData.xp_points
    } : null)
  }

  // Handle streak update
  const handleStreakUpdate = (streakData: any) => {
    console.log('Streak update:', streakData)
    // Update user data
    setUserData(prev => prev ? {
      ...prev,
      current_streak: streakData.current_streak,
      longest_streak: streakData.longest_streak
    } : null)
  }

  // Handle IRAC analysis complete
  const handleIRACAnalysisComplete = (analysis: any) => {
    console.log('IRAC analysis complete:', analysis)
    // Update user stats
    setUserData(prev => prev ? {
      ...prev,
      total_cases_solved: prev.total_cases_solved + 1,
      xp_points: prev.xp_points + 50 // Add XP for completing analysis
    } : null)
  }

  // Handle scenario selection
  const handleScenarioSelect = (scenario: any) => {
    console.log('Scenario selected:', scenario)
    // Add XP for scenario exploration
    setUserData(prev => prev ? {
      ...prev,
      xp_points: prev.xp_points + 25
    } : null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200 rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button 
              onClick={fetchUserData}
              className="ml-auto px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Case-Law AI Platform</h1>
          <p className="text-gray-600">Welcome back, {userData?.name}!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {userData?.level}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Level {userData?.level}</div>
              <div className="text-xs text-gray-600">{userData?.xp_points} XP</div>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700">
            {userData?.subscription_plan === 'premium' ? 'Premium' : 'Basic'}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {userData?.total_cases_solved}
                </div>
                <div className="text-sm text-gray-600">Cases Solved</div>
              </div>
              <Target className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {userData?.success_rate}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {userData?.current_streak}
                </div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
              <Activity className="w-8 h-8 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {userData?.xp_points}
                </div>
                <div className="text-sm text-gray-600">Total XP</div>
              </div>
              <Trophy className="w-8 h-8 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="solver" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Case Solver
          </TabsTrigger>
          <TabsTrigger value="decision-tree" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Decision Tree
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <IntegratedDashboard />
        </TabsContent>

        {/* Case Solver Tab */}
        <TabsContent value="solver">
          <InteractiveCaseSolver onAnalysisComplete={handleIRACAnalysisComplete} />
        </TabsContent>

        {/* Decision Tree Tab */}
        <TabsContent value="decision-tree">
          <DynamicDecisionTreeRenderer onScenarioSelect={handleScenarioSelect} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Analytics & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Analytics Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    Advanced analytics and insights will be available here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Gamification Feedback Component */}
      <GamificationFeedback
        userId={userData?.id}
        onAchievementUnlocked={handleAchievementUnlocked}
        onLevelUp={handleLevelUp}
        onStreakUpdate={handleStreakUpdate}
      />
    </div>
  )
}
