'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Confetti from 'react-confetti'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { dashboardAPI, handleAPIError } from '@/lib/api-service'
import {
  Trophy,
  Star,
  Zap,
  Crown,
  Award,
  Target,
  Flame,
  TrendingUp,
  Gift,
  Sparkles,
  Bell,
  CheckCircle,
  AlertCircle,
  X,
  Volume2,
  VolumeX
} from 'lucide-react'

interface Achievement {
  id: number
  title: string
  description: string
  icon_url: string
  unlocked_at: string
  xp_reward: number
  badge_color: string
}

interface LevelUpData {
  new_level: number
  old_level: number
  xp_points: number
  unlocked_features: string[]
}

interface StreakData {
  current_streak: number
  longest_streak: number
  streak_type: 'daily' | 'weekly' | 'monthly'
}

interface GamificationFeedbackProps {
  userId?: number
  onAchievementUnlocked?: (achievement: Achievement) => void
  onLevelUp?: (levelData: LevelUpData) => void
  onStreakUpdate?: (streakData: StreakData) => void
}

export default function GamificationFeedback({ 
  userId = 1,
  onAchievementUnlocked,
  onLevelUp,
  onStreakUpdate
}: GamificationFeedbackProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  const [showLevelUpModal, setShowLevelUpModal] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)
  const [currentLevelUp, setCurrentLevelUp] = useState<LevelUpData | null>(null)
  const [currentStreak, setCurrentStreak] = useState<StreakData | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'achievement' | 'level' | 'streak' | 'milestone'
    title: string
    message: string
    timestamp: Date
  }>>([])
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  // Update window size for confetti
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Monitor user progress
  useEffect(() => {
    const interval = setInterval(() => {
      checkUserProgress()
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [userId])

  const checkUserProgress = async () => {
    try {
      // Get user data
      const userData = await dashboardAPI.getUserStats(userId)
      
      // Check for achievements
      await checkAchievements(userData)
      
      // Check for level up
      await checkLevelUp(userData)
      
      // Check for streak updates
      await checkStreakUpdate(userData)
      
    } catch (err) {
      console.error('Failed to check user progress:', err)
    }
  }

  const checkAchievements = async (userData: any) => {
    // Mock achievement checking logic
    const achievements = [
      {
        id: 1,
        title: 'First Steps',
        description: 'Complete your first case analysis',
        icon_url: '/badges/first-steps.png',
        unlocked_at: new Date().toISOString(),
        xp_reward: 50,
        badge_color: 'blue'
      },
      {
        id: 2,
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon_url: '/badges/week-warrior.png',
        unlocked_at: new Date().toISOString(),
        xp_reward: 100,
        badge_color: 'green'
      },
      {
        id: 3,
        title: 'Legal Expert',
        description: 'Reach level 10',
        icon_url: '/badges/legal-expert.png',
        unlocked_at: new Date().toISOString(),
        xp_reward: 200,
        badge_color: 'purple'
      }
    ]

    // Check if any new achievements should be unlocked
    const newAchievement = achievements[Math.floor(Math.random() * achievements.length)]
    
    if (Math.random() > 0.95) { // 5% chance to unlock achievement
      triggerAchievement(newAchievement)
    }
  }

  const checkLevelUp = async (userData: any) => {
    const currentLevel = userData.user?.level || 1
    const xpPoints = userData.user?.xp_points || 0
    
    // Calculate if user should level up
    const xpForNextLevel = currentLevel * 100
    const xpForCurrentLevel = (currentLevel - 1) * 100
    
    if (xpPoints >= xpForNextLevel && Math.random() > 0.98) { // 2% chance
      const levelUpData: LevelUpData = {
        new_level: currentLevel + 1,
        old_level: currentLevel,
        xp_points: xpPoints,
        unlocked_features: [
          'Advanced AI Analysis',
          'Premium Templates',
          'Expert Legal Resources'
        ]
      }
      
      triggerLevelUp(levelUpData)
    }
  }

  const checkStreakUpdate = async (userData: any) => {
    const currentStreak = userData.user?.current_streak || 0
    
    // Check for streak milestones
    const streakMilestones = [3, 7, 14, 30, 60, 100]
    
    for (const milestone of streakMilestones) {
      if (currentStreak === milestone && Math.random() > 0.99) { // 1% chance
        const streakData: StreakData = {
          current_streak: currentStreak,
          longest_streak: userData.user?.longest_streak || currentStreak,
          streak_type: 'daily'
        }
        
        triggerStreakUpdate(streakData)
        break
      }
    }
  }

  const triggerAchievement = (achievement: Achievement) => {
    setCurrentAchievement(achievement)
    setShowAchievementModal(true)
    setShowConfetti(true)
    
    // Add notification
    addNotification({
      id: `achievement-${Date.now()}`,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: achievement.title,
      timestamp: new Date()
    })
    
    // Play sound if enabled
    if (soundEnabled) {
      playAchievementSound()
    }
    
    // Hide confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000)
    
    // Call callback
    onAchievementUnlocked?.(achievement)
  }

  const triggerLevelUp = (levelData: LevelUpData) => {
    setCurrentLevelUp(levelData)
    setShowLevelUpModal(true)
    setShowConfetti(true)
    
    // Add notification
    addNotification({
      id: `level-${Date.now()}`,
      type: 'level',
      title: 'Level Up!',
      message: `You've reached level ${levelData.new_level}!`,
      timestamp: new Date()
    })
    
    // Play sound if enabled
    if (soundEnabled) {
      playLevelUpSound()
    }
    
    // Hide confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000)
    
    // Call callback
    onLevelUp?.(levelData)
  }

  const triggerStreakUpdate = (streakData: StreakData) => {
    setCurrentStreak(streakData)
    setShowStreakModal(true)
    
    // Add notification
    addNotification({
      id: `streak-${Date.now()}`,
      type: 'streak',
      title: 'Streak Milestone!',
      message: `${streakData.current_streak} day streak!`,
      timestamp: new Date()
    })
    
    // Play sound if enabled
    if (soundEnabled) {
      playStreakSound()
    }
    
    // Call callback
    onStreakUpdate?.(streakData)
  }

  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev].slice(0, 5)) // Keep only 5 recent notifications
  }

  const playAchievementSound = () => {
    // Create achievement sound effect
    const audio = new Audio('/sounds/achievement.mp3')
    audio.volume = 0.5
    audio.play().catch(() => {
      // Fallback to Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    })
  }

  const playLevelUpSound = () => {
    // Create level up sound effect
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const playStreakSound = () => {
    // Create streak sound effect
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.2)
    oscillator.type = 'triangle'
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'green': return 'bg-green-100 text-green-700 border-green-200'
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'orange': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'red': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getAchievementIcon = (iconUrl: string) => {
    // Return appropriate icon based on achievement type
    if (iconUrl.includes('first-steps')) return <Target className="w-8 h-8" />
    if (iconUrl.includes('week-warrior')) return <Flame className="w-8 h-8" />
    if (iconUrl.includes('legal-expert')) return <Crown className="w-8 h-8" />
    return <Trophy className="w-8 h-8" />
  }

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}

      {/* Achievement Modal */}
      {showAchievementModal && currentAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white rounded-2xl shadow-2xl max-w-md mx-4">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                {getAchievementIcon(currentAchievement.icon_url)}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Achievement Unlocked!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getBadgeColor(currentAchievement.badge_color)}`}>
                <Award className="w-4 h-4 mr-2" />
                {currentAchievement.title}
              </div>
              <p className="text-gray-600">{currentAchievement.description}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span>+{currentAchievement.xp_reward} XP</span>
              </div>
              <Button
                onClick={() => setShowAchievementModal(false)}
                className="w-full"
              >
                Awesome!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Level Up Modal */}
      {showLevelUpModal && currentLevelUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white rounded-2xl shadow-2xl max-w-md mx-4">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Level Up!
              </CardTitle>
              <p className="text-lg text-purple-600 font-semibold">
                Level {currentLevelUp.old_level} → {currentLevelUp.new_level}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Total XP</div>
                <div className="text-2xl font-bold text-purple-600">
                  {currentLevelUp.xp_points}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-700">Unlocked Features:</div>
                <ul className="space-y-1">
                  {currentLevelUp.unlocked_features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => setShowLevelUpModal(false)}
                className="w-full"
              >
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Streak Modal */}
      {showStreakModal && currentStreak && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white rounded-2xl shadow-2xl max-w-md mx-4">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Streak Milestone!
              </CardTitle>
              <p className="text-lg text-orange-600 font-semibold">
                {currentStreak.current_streak} Day Streak
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Longest Streak</div>
                <div className="text-2xl font-bold text-orange-600">
                  {currentStreak.longest_streak} days
                </div>
              </div>
              <div className="text-center text-sm text-gray-600">
                Keep up the great work! Your consistency is paying off.
              </div>
              <Button
                onClick={() => setShowStreakModal(false)}
                className="w-full"
              >
                Keep Going!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-40">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className="bg-white border-gray-200 rounded-lg shadow-lg p-3 min-w-[300px]"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {notification.type === 'achievement' && <Trophy className="w-5 h-5 text-yellow-600" />}
                {notification.type === 'level' && <Crown className="w-5 h-5 text-purple-600" />}
                {notification.type === 'streak' && <Flame className="w-5 h-5 text-orange-600" />}
                {notification.type === 'milestone' && <Star className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{notification.title}</div>
                <div className="text-sm text-gray-600">{notification.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {notification.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Sound Toggle */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="bg-white/90 backdrop-blur-sm"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>
      </div>
    </>
  )
}
