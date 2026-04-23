'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Trophy,
  Star,
  BookOpen,
  Target,
  Brain,
  GitBranch,
  MessageSquare,
  Timer,
  Zap,
  Award,
  TrendingUp,
  Eye,
  EyeOff,
  Volume2,
  VolumeX
} from 'lucide-react'

interface MiniCase {
  id: string
  title: string
  scenario: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  estimatedTime: number
  category: string
  learningObjectives: string[]
}

interface ScenarioCard {
  id: string
  title: string
  description: string
  icon: string
  difficulty: string
  xpReward: number
}

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  type: 'FILING' | 'HEARING' | 'DECISION' | 'APPEAL'
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface RolePlayMode {
  role: 'LAWYER' | 'JUDGE' | 'PROSECUTOR' | 'DEFENDER'
  scenario: string
  objectives: string[]
  constraints: string[]
}

export default function InteractiveLearningSystem() {
  const [activeMode, setActiveMode] = useState<'mini-case' | 'flowchart' | 'scenario' | 'timeline' | 'roleplay' | 'multiplayer' | 'timed'>('mini-case')
  const [currentCase, setCurrentCase] = useState<MiniCase | null>(null)
  const [userProgress, setUserProgress] = useState(0)
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'LAWYER' | 'JUDGE' | 'PROSECUTOR' | 'DEFENDER'>('LAWYER')
  const [soundEnabled, setSoundEnabled] = useState(true)

  const miniCases: MiniCase[] = [
    {
      id: '1',
      title: 'Contract Breach Dispute',
      scenario: 'A small business owner signed a contract with a supplier but the supplier failed to deliver goods on time, causing significant business losses.',
      difficulty: 'BEGINNER',
      estimatedTime: 15,
      category: 'Contract Law',
      learningObjectives: ['Identify breach elements', 'Understand remedies', 'Calculate damages']
    },
    {
      id: '2',
      title: 'Negligence Claim',
      scenario: 'A customer slipped and fell in a grocery store due to a wet floor that was not properly marked. They suffered injuries and are seeking compensation.',
      difficulty: 'INTERMEDIATE',
      estimatedTime: 20,
      category: 'Tort Law',
      learningObjectives: ['Determine duty of care', 'Analyze causation', 'Assess damages']
    },
    {
      id: '3',
      title: 'Employment Discrimination',
      scenario: 'An employee claims they were unfairly terminated based on age discrimination. The company argues performance issues were the real reason.',
      difficulty: 'ADVANCED',
      estimatedTime: 25,
      category: 'Employment Law',
      learningObjectives: ['Identify protected classes', 'Analyze evidence', 'Understand burden of proof']
    },
    {
      id: '4',
      title: 'Complex Corporate Merger',
      scenario: 'Two major corporations are merging, but shareholders claim the process violates fiduciary duties and fair dealing principles.',
      difficulty: 'EXPERT',
      estimatedTime: 30,
      category: 'Corporate Law',
      learningObjectives: ['Analyze merger regulations', 'Evaluate fiduciary duties', 'Assess shareholder rights']
    }
  ]

  const scenarioCards: ScenarioCard[] = [
    {
      id: '1',
      title: 'Evidence Evaluation',
      description: 'Analyze various pieces of evidence and determine their admissibility and weight.',
      icon: '🔍',
      difficulty: 'Medium',
      xpReward: 50
    },
    {
      id: '2',
      title: 'Legal Research',
      description: 'Find relevant case law and statutes to support your legal argument.',
      icon: '📚',
      difficulty: 'Hard',
      xpReward: 75
    },
    {
      id: '3',
      title: 'Client Interview',
      description: 'Conduct effective client interviews to gather crucial case information.',
      icon: '👥',
      difficulty: 'Medium',
      xpReward: 60
    },
    {
      id: '4',
      title: 'Courtroom Procedure',
      description: 'Navigate courtroom procedures and make strategic decisions during trial.',
      icon: '⚖️',
      difficulty: 'Expert',
      xpReward: 100
    }
  ]

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'Case Filed',
      description: 'Initial complaint filed with the court',
      date: '2024-01-15',
      type: 'FILING',
      impact: 'HIGH'
    },
    {
      id: '2',
      title: 'Pre-Trial Hearing',
      description: 'Motions heard and preliminary rulings made',
      date: '2024-02-20',
      type: 'HEARING',
      impact: 'MEDIUM'
    },
    {
      id: '3',
      title: 'Trial Begins',
      description: 'Jury selection and opening statements',
      date: '2024-03-10',
      type: 'HEARING',
      impact: 'HIGH'
    },
    {
      id: '4',
      title: 'Verdict Reached',
      description: 'Jury returns verdict in favor of plaintiff',
      date: '2024-03-25',
      type: 'DECISION',
      impact: 'HIGH'
    },
    {
      id: '5',
      title: 'Appeal Filed',
      description: 'Defendant files notice of appeal',
      date: '2024-04-10',
      type: 'APPEAL',
      impact: 'MEDIUM'
    }
  ]

  const rolePlayModes: RolePlayMode[] = [
    {
      role: 'LAWYER',
      scenario: 'Represent a client in a contract dispute case',
      objectives: ['Build strong legal arguments', 'Negotiate favorable settlement', 'Protect client interests'],
      constraints: ['Must follow ethical guidelines', 'Limited by case facts', 'Time constraints']
    },
    {
      role: 'JUDGE',
      scenario: 'Preside over a civil case and render fair judgment',
      objectives: ['Ensure fair trial', 'Apply law correctly', 'Maintain courtroom order'],
      constraints: ['Must remain impartial', 'Bound by legal precedent', 'Procedural requirements']
    },
    {
      role: 'PROSECUTOR',
      scenario: 'Prosecute a criminal case on behalf of the state',
      objectives: ['Prove guilt beyond reasonable doubt', 'Present compelling evidence', 'Achieve justice'],
      constraints: ['Must disclose exculpatory evidence', 'Ethical prosecution standards', 'Burden of proof']
    },
    {
      role: 'DEFENDER',
      scenario: 'Defend a client against criminal charges',
      objectives: ['Protect constitutional rights', 'Challenge prosecution evidence', 'Achieve best outcome'],
      constraints: ['Must maintain client confidentiality', 'Ethical defense obligations', 'Professional conduct']
    }
  ]

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      setIsPlaying(false)
    }
  }, [isPlaying, timeRemaining])

  const startMiniCase = (caseData: MiniCase) => {
    setCurrentCase(caseData)
    setUserProgress(0)
    setScore(0)
    setTimeRemaining(caseData.estimatedTime * 60)
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 10)
      setUserProgress(Math.min(100, userProgress + 25))
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-orange-100 text-orange-800'
      case 'EXPERT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interactive Learning System</h1>
          <p className="text-xl text-gray-600">Master legal thinking through hands-on scenarios and simulations</p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {[
            { id: 'mini-case', label: 'Mini Cases', icon: BookOpen },
            { id: 'flowchart', label: 'Flowchart', icon: GitBranch },
            { id: 'scenario', label: 'Scenarios', icon: Target },
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'roleplay', label: 'Role Play', icon: Users },
            { id: 'multiplayer', label: 'Multiplayer', icon: Users },
            { id: 'timed', label: 'Timed Mode', icon: Timer }
          ].map((mode) => (
            <Button
              key={mode.id}
              variant={activeMode === mode.id ? 'default' : 'outline'}
              className={`h-20 flex-col gap-2 ${activeMode === mode.id ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              onClick={() => setActiveMode(mode.id as any)}
            >
              <mode.icon className="w-6 h-6" />
              <span className="text-sm">{mode.label}</span>
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">{score} XP</span>
            </div>
          </div>
          {timeRemaining > 0 && (
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {userProgress > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{userProgress}%</span>
            </div>
            <Progress value={userProgress} className="h-2" />
          </div>
        )}

        {/* Content Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeMode === 'mini-case' && (
              <div className="space-y-6">
                {!currentCase ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {miniCases.map((case_) => (
                      <Card key={case_.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{case_.title}</CardTitle>
                            <Badge className={getDifficultyColor(case_.difficulty)}>
                              {case_.difficulty}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{case_.scenario}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-500">{case_.estimatedTime} min</span>
                            </div>
                            <Button onClick={() => startMiniCase(case_)}>
                              <Play className="w-4 h-4 mr-2" />
                              Start
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{currentCase.title}</CardTitle>
                        <Button variant="outline" onClick={() => setCurrentCase(null)}>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2">Scenario</h3>
                        <p className="text-gray-600">{currentCase.scenario}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Learning Objectives</h3>
                        <ul className="space-y-1">
                          {currentCase.learningObjectives.map((objective, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Quick Questions</h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="mb-3">What is the primary legal issue in this case?</p>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleAnswer(true)}>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Contract Breach
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleAnswer(false)}>
                                <XCircle className="w-4 h-4 mr-1" />
                                Negligence
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeMode === 'scenario' && (
              <div className="grid md:grid-cols-2 gap-4">
                {scenarioCards.map((card) => (
                  <Card key={card.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-3xl mb-4">{card.icon}</div>
                      <h3 className="font-semibold mb-2">{card.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{card.difficulty}</Badge>
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-semibold">{card.xpReward} XP</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeMode === 'timeline' && (
              <Card>
                <CardHeader>
                  <CardTitle>Case Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timelineEvents.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full ${
                            event.type === 'FILING' ? 'bg-blue-500' :
                            event.type === 'HEARING' ? 'bg-yellow-500' :
                            event.type === 'DECISION' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`} />
                          {index < timelineEvents.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            <span className="text-sm text-gray-500">{event.date}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{event.description}</p>
                          <Badge 
                            variant="outline" 
                            className={`mt-2 ${
                              event.impact === 'HIGH' ? 'border-red-500 text-red-500' :
                              event.impact === 'MEDIUM' ? 'border-yellow-500 text-yellow-500' :
                              'border-green-500 text-green-500'
                            }`}
                          >
                            {event.impact} Impact
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeMode === 'roleplay' && (
              <div className="space-y-6">
                <div className="flex gap-4 mb-6">
                  {rolePlayModes.map((mode) => (
                    <Button
                      key={mode.role}
                      variant={selectedRole === mode.role ? 'default' : 'outline'}
                      onClick={() => setSelectedRole(mode.role)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {mode.role}
                    </Button>
                  ))}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedRole} Mode</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Scenario</h3>
                      <p className="text-gray-600">
                        {rolePlayModes.find(m => m.role === selectedRole)?.scenario}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Objectives</h3>
                      <ul className="space-y-1">
                        {rolePlayModes.find(m => m.role === selectedRole)?.objectives.map((objective, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Constraints</h3>
                      <ul className="space-y-1">
                        {rolePlayModes.find(m => m.role === selectedRole)?.constraints.map((constraint, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-orange-500" />
                            <span className="text-sm">{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Start Role Play
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total XP</span>
                  <span className="font-semibold">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed Cases</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Streak</span>
                  <span className="font-semibold">5 days</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">First Case Win</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Speed Demon</p>
                    <p className="text-xs text-gray-500">5 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Perfect Score</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leaderboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">1. Alex Chen</span>
                  <span className="font-semibold">2,450 XP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">2. Sarah Johnson</span>
                  <span className="font-semibold">2,320 XP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">3. Mike Davis</span>
                  <span className="font-semibold">2,180 XP</span>
                </div>
                <div className="flex justify-between items-center text-blue-600 font-semibold">
                  <span>4. You</span>
                  <span>{score} XP</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
