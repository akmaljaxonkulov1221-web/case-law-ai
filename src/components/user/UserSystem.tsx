'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  User,
  Trophy,
  Star,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  BookOpen,
  Brain,
  Zap,
  Flame,
  Medal,
  Crown,
  Gem,
  Shield,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Camera,
  Edit,
  Bell,
  LogOut,
  ChevronRight,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Gift,
  Rocket,
  Heart,
  Eye,
  Download,
  Share2
} from 'lucide-react'

interface UserProfile {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  avatar?: string
  bio?: string
  institution?: string
  joinedAt: Date
  lastActive: Date
}

interface UserStats {
  level: number
  xp: number
  nextLevelXp: number
  totalXp: number
  streak: number
  rank: number
  completedCases: number
  successRate: number
  studyTime: number
  achievements: number
  badges: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'MILESTONE' | 'SKILL' | 'SOCIAL' | 'STREAK' | 'SPECIAL'
  xpReward: number
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
  isUnlocked: boolean
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  unlockedAt: Date
}

interface Activity {
  id: string
  type: 'CASE_COMPLETED' | 'ACHIEVEMENT_UNLOCKED' | 'LEVEL_UP' | 'STREAK_MILESTONE' | 'SOCIAL'
  title: string
  description: string
  timestamp: Date
  xp?: number
  metadata?: any
}

export default function UserSystem() {
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'stats' | 'activity'>('profile')
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    username: 'legalmaster2024',
    email: 'student@law.edu',
    firstName: 'John',
    lastName: 'Doe',
    role: 'STUDENT',
    institution: 'Harvard Law School',
    joinedAt: new Date('2024-01-15'),
    lastActive: new Date()
  })

  const [userStats, setUserStats] = useState<UserStats>({
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    totalXp: 8750,
    streak: 7,
    rank: 234,
    completedCases: 45,
    successRate: 78,
    studyTime: 156, // hours
    achievements: 18,
    badges: 12
  })

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first legal case',
      icon: '🎯',
      category: 'MILESTONE',
      xpReward: 50,
      isUnlocked: true,
      unlockedAt: new Date('2024-01-16')
    },
    {
      id: '2',
      title: 'Quick Thinker',
      description: 'Complete a case in under 5 minutes',
      icon: '⚡',
      category: 'SKILL',
      xpReward: 100,
      isUnlocked: true,
      unlockedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      title: 'Case Master',
      description: 'Complete 100 cases',
      icon: '📚',
      category: 'MILESTONE',
      xpReward: 500,
      isUnlocked: false,
      progress: 45,
      maxProgress: 100
    },
    {
      id: '4',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      category: 'STREAK',
      xpReward: 200,
      isUnlocked: true,
      unlockedAt: new Date('2024-01-22')
    },
    {
      id: '5',
      title: 'Legal Scholar',
      description: 'Reach level 20',
      icon: '🎓',
      category: 'MILESTONE',
      xpReward: 1000,
      isUnlocked: false,
      progress: 12,
      maxProgress: 20
    },
    {
      id: '6',
      title: 'Debate Champion',
      description: 'Win 10 argument challenges',
      icon: '🏆',
      category: 'SKILL',
      xpReward: 300,
      isUnlocked: false,
      progress: 3,
      maxProgress: 10
    }
  ])

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'Rising Star',
      description: 'Reached level 10',
      icon: '⭐',
      rarity: 'COMMON',
      unlockedAt: new Date('2024-01-18')
    },
    {
      id: '2',
      name: 'Case Analyst',
      description: 'Completed 25 cases',
      icon: '🔍',
      rarity: 'RARE',
      unlockedAt: new Date('2024-01-25')
    },
    {
      id: '3',
      name: 'Legal Expert',
      description: 'Achieved 90% success rate',
      icon: '⚖️',
      rarity: 'EPIC',
      unlockedAt: new Date('2024-02-01')
    }
  ])

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'CASE_COMPLETED',
      title: 'Completed Contract Dispute Case',
      description: 'Score: 85/100',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      xp: 25
    },
    {
      id: '2',
      type: 'ACHIEVEMENT_UNLOCKED',
      title: 'Unlocked: Quick Thinker',
      description: 'Completed a case in under 5 minutes',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      xp: 100
    },
    {
      id: '3',
      type: 'LEVEL_UP',
      title: 'Level Up!',
      description: 'Reached level 12',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      xp: 50
    },
    {
      id: '4',
      type: 'STREAK_MILESTONE',
      title: '7-Day Streak!',
      description: 'Keep up the great work',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      xp: 200
    }
  ])

  const progressPercentage = (userStats.xp / userStats.nextLevelXp) * 100

  const getLevelColor = (level: number) => {
    if (level >= 20) return 'text-purple-600'
    if (level >= 15) return 'text-red-600'
    if (level >= 10) return 'text-orange-600'
    if (level >= 5) return 'text-blue-600'
    return 'text-green-600'
  }

  const getLevelIcon = (level: number) => {
    if (level >= 20) return <Crown className="w-6 h-6" />
    if (level >= 15) return <Gem className="w-6 h-6" />
    if (level >= 10) return <Shield className="w-6 h-6" />
    if (level >= 5) return <Medal className="w-6 h-6" />
    return <Star className="w-6 h-6" />
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'bg-gray-100 text-gray-800'
      case 'RARE': return 'bg-blue-100 text-blue-800'
      case 'EPIC': return 'bg-purple-100 text-purple-800'
      case 'LEGENDARY': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'CASE_COMPLETED': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'ACHIEVEMENT_UNLOCKED': return <Trophy className="w-4 h-4 text-yellow-500" />
      case 'LEVEL_UP': return <Rocket className="w-4 h-4 text-blue-500" />
      case 'STREAK_MILESTONE': return <Flame className="w-4 h-4 text-orange-500" />
      case 'SOCIAL': return <Users className="w-4 h-4 text-purple-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Profile</h1>
          <p className="text-xl text-gray-600">Manage your profile, track progress, and view achievements</p>
        </div>

        {/* User Overview Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userProfile.firstName[0]}{userProfile.lastName[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {userProfile.firstName} {userProfile.lastName}
                  </h2>
                  <p className="text-gray-600">@{userProfile.username}</p>
                  <p className="text-sm text-gray-500">{userProfile.institution}</p>
                  <Badge variant="outline" className="mt-2">
                    {userProfile.role}
                  </Badge>
                </div>
              </div>

              {/* Level & XP */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${getLevelColor(userStats.level)}`}>
                    {getLevelIcon(userStats.level)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Level {userStats.level}</h3>
                    <p className="text-sm text-gray-600">{userStats.xp} / {userStats.nextLevelXp} XP</p>
                  </div>
                </div>
                <Progress value={progressPercentage} className="mb-2" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{userStats.totalXp} Total XP</span>
                  <span>{Math.round(progressPercentage)}% to next level</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-2xl font-bold">{userStats.streak}</span>
                  </div>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-2xl font-bold">#{userStats.rank}</span>
                  </div>
                  <p className="text-sm text-gray-600">Global Rank</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-2xl font-bold">{userStats.successRate}%</span>
                  </div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-2xl font-bold">{userStats.completedCases}</span>
                  </div>
                  <p className="text-sm text-gray-600">Cases</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'stats', label: 'Statistics', icon: BarChart3 },
            { id: 'activity', label: 'Activity', icon: Activity }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              className="flex items-center gap-2"
              onClick={() => setActiveTab(tab.id as any)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Settings */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <p className="mt-1">{userProfile.firstName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <p className="mt-1">{userProfile.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Username</label>
                      <p className="mt-1">@{userProfile.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1">{userProfile.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Institution</label>
                      <p className="mt-1">{userProfile.institution}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Member Since</label>
                      <p className="mt-1">{userProfile.joinedAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {badges.slice(0, 6).map((badge) => (
                      <div key={badge.id} className="text-center">
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h4 className="font-medium text-sm">{badge.name}</h4>
                        <Badge className={`text-xs mt-1 ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Study Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Study Time</span>
                    <span className="font-medium">{userStats.studyTime}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg. Score</span>
                    <span className="font-medium">{userStats.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total XP</span>
                    <span className="font-medium">{userStats.totalXp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Achievements</span>
                    <span className="font-medium">{userStats.achievements}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`${achievement.isUnlocked ? 'bg-white' : 'bg-gray-50 opacity-75'} hover:shadow-lg transition-shadow`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      {achievement.isUnlocked ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {achievement.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-sm font-medium">{achievement.xpReward} XP</span>
                      </div>
                    </div>
                    {achievement.progress && achievement.maxProgress && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
                      </div>
                    )}
                    {achievement.unlockedAt && (
                      <div className="mt-2 text-xs text-gray-500">
                        Unlocked {achievement.unlockedAt.toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{userStats.completedCases}</h3>
                <p className="text-gray-600">Cases Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{userStats.successRate}%</h3>
                <p className="text-gray-600">Success Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{userStats.streak}</h3>
                <p className="text-gray-600">Day Streak</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{userStats.studyTime}h</h3>
                <p className="text-gray-600">Study Time</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'activity' && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{activity.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                        {activity.xp && (
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            <span className="text-sm font-medium">+{activity.xp} XP</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
