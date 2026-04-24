export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'milestone' | 'skill' | 'streak' | 'social' | 'exploration'
  points: number
  condition: {
    type: 'cases_completed' | 'level_reached' | 'streak_days' | 'win_rate' | 'xp_earned'
    value: number
  }
  unlocked: boolean
  unlockedAt?: Date
}

export interface UserProgress {
  level: number
  xp: number
  nextLevelXp: number
  streak: number
  totalCases: number
  winRate: number
  achievements: Achievement[]
  rank: number
}

export class GamificationSystem {
  private achievements: Achievement[] = [
    {
      id: 'first_case',
      title: 'First Steps',
      description: 'Complete your first legal case',
      icon: '🎯',
      category: 'milestone',
      points: 50,
      condition: { type: 'cases_completed', value: 1 },
      unlocked: false
    },
    {
      id: 'case_master',
      title: 'Case Master',
      description: 'Complete 10 cases',
      icon: '📚',
      category: 'milestone',
      points: 200,
      condition: { type: 'cases_completed', value: 10 },
      unlocked: false
    },
    {
      id: 'streak_week',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      category: 'streak',
      points: 100,
      condition: { type: 'streak_days', value: 7 },
      unlocked: false
    },
    {
      id: 'high_scorer',
      title: 'High Scorer',
      description: 'Achieve 90% win rate',
      icon: '⭐',
      category: 'skill',
      points: 150,
      condition: { type: 'win_rate', value: 90 },
      unlocked: false
    }
  ]

  calculateLevel(xp: number): number {
    return Math.floor(xp / 100) + 1
  }

  calculateNextLevelXp(level: number): number {
    return level * 100
  }

  checkAchievements(progress: UserProgress): Achievement[] {
    const newAchievements: Achievement[] = []

    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return

      let shouldUnlock = false

      switch (achievement.condition.type) {
        case 'cases_completed':
          shouldUnlock = progress.totalCases >= achievement.condition.value
          break
        case 'level_reached':
          shouldUnlock = progress.level >= achievement.condition.value
          break
        case 'streak_days':
          shouldUnlock = progress.streak >= achievement.condition.value
          break
        case 'win_rate':
          shouldUnlock = progress.winRate >= achievement.condition.value
          break
        case 'xp_earned':
          shouldUnlock = progress.xp >= achievement.condition.value
          break
      }

      if (shouldUnlock) {
        achievement.unlocked = true
        achievement.unlockedAt = new Date()
        newAchievements.push(achievement)
      }
    })

    return newAchievements
  }

  awardXP(currentXP: number, caseScore: number, difficulty: string): number {
    const baseXP = 50
    const difficultyMultiplier = {
      'BEGINNER': 1,
      'INTERMEDIATE': 1.5,
      'ADVANCED': 2,
      'EXPERT': 3
    }[difficulty] || 1

    const scoreMultiplier = caseScore / 100
    const xpAwarded = Math.round(baseXP * difficultyMultiplier * scoreMultiplier)

    return currentXP + xpAwarded
  }
}
