'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Users,
  Trophy,
  Target,
  Brain,
  Timer,
  Zap,
  Award,
  TrendingUp,
  BarChart3,
  Download,
  Share2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Save,
  Flag,
  Star,
  BookOpen,
  Lightbulb,
  HelpCircle
} from 'lucide-react'

interface Question {
  id: string
  type: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'ESSAY' | 'CASE_ANALYSIS' | 'TRUE_FALSE'
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  category: string
  explanation?: string
  timeLimit?: number
  hints?: string[]
}

interface TestSession {
  id: string
  title: string
  type: 'QUIZ' | 'EXAM' | 'PRACTICE' | 'ADAPTIVE'
  duration: number
  totalPoints: number
  passingScore: number
  questions: Question[]
  startTime?: Date
  endTime?: Date
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED'
}

interface UserAnswer {
  questionId: string
  answer: string | number
  timeSpent: number
  isCorrect?: boolean
  pointsEarned?: number
  confidence?: number
}

interface TestResult {
  sessionId: string
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
  timeSpent: number
  answers: UserAnswer[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  rank?: number
  percentile?: number
}

interface AdaptiveDifficulty {
  currentLevel: number
  correctAnswers: number
  totalAnswers: number
  nextDifficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  adjustmentFactor: number
}

export default function TestExamSystem() {
  const [activeMode, setActiveMode] = useState<'quiz' | 'exam' | 'practice' | 'adaptive'>('quiz')
  const [currentSession, setCurrentSession] = useState<TestSession | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null)
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState<AdaptiveDifficulty>({
    currentLevel: 1,
    correctAnswers: 0,
    totalAnswers: 0,
    nextDifficulty: 'BEGINNER',
    adjustmentFactor: 0.1
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showHint, setShowHint] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([])

  const quizTemplates: TestSession[] = [
    {
      id: 'quiz-1',
      title: 'Contract Law Basics',
      type: 'QUIZ',
      duration: 600, // 10 minutes
      totalPoints: 50,
      passingScore: 35,
      questions: [
        {
          id: 'q1',
          type: 'MULTIPLE_CHOICE',
          question: 'What are the essential elements of a valid contract?',
          options: [
            'Offer, Acceptance, Consideration',
            'Offer, Acceptance, Performance',
            'Consideration, Performance, Capacity',
            'Offer, Capacity, Performance'
          ],
          correctAnswer: 0,
          points: 10,
          difficulty: 'BEGINNER',
          category: 'Contract Law',
          explanation: 'A valid contract requires offer, acceptance, and consideration.',
          timeLimit: 60
        },
        {
          id: 'q2',
          type: 'TRUE_FALSE',
          question: 'Oral contracts are never enforceable in court.',
          correctAnswer: 1, // False
          points: 5,
          difficulty: 'BEGINNER',
          category: 'Contract Law',
          explanation: 'Oral contracts can be enforceable, though written contracts are preferred.',
          timeLimit: 30
        },
        {
          id: 'q3',
          type: 'SHORT_ANSWER',
          question: 'What is the statute of limitations for breach of contract in most jurisdictions?',
          correctAnswer: '3-6 years',
          points: 15,
          difficulty: 'INTERMEDIATE',
          category: 'Contract Law',
          explanation: 'Most jurisdictions have a 3-6 year statute of limitations for contract claims.',
          timeLimit: 90
        },
        {
          id: 'q4',
          type: 'CASE_ANALYSIS',
          question: 'Analyze this scenario: A buyer signs a contract to purchase a car, but the seller fails to deliver. What legal remedies are available to the buyer?',
          points: 20,
          difficulty: 'ADVANCED',
          category: 'Contract Law',
          explanation: 'The buyer can seek specific performance or damages for breach of contract.',
          timeLimit: 180
        }
      ],
      status: 'NOT_STARTED'
    },
    {
      id: 'exam-1',
      title: 'Comprehensive Legal Exam',
      type: 'EXAM',
      duration: 3600, // 1 hour
      totalPoints: 200,
      passingScore: 140,
      questions: [
        {
          id: 'e1',
          type: 'ESSAY',
          question: 'Discuss the evolution of contract law from common law to modern commercial transactions.',
          points: 50,
          difficulty: 'EXPERT',
          category: 'Legal History',
          timeLimit: 600
        },
        {
          id: 'e2',
          type: 'CASE_ANALYSIS',
          question: 'Analyze a complex merger agreement and identify potential legal issues.',
          points: 40,
          difficulty: 'EXPERT',
          category: 'Corporate Law',
          timeLimit: 300
        }
      ],
      status: 'NOT_STARTED'
    }
  ]

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && currentSession) {
      completeTest()
    }
  }, [isPlaying, timeRemaining, currentSession])

  const startTest = (session: TestSession) => {
    const newSession = { ...session, startTime: new Date(), status: 'IN_PROGRESS' as const }
    setCurrentSession(newSession)
    setTimeRemaining(session.duration)
    setIsPlaying(true)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setShowResults(false)
    setFlaggedQuestions([])
  }

  const pauseTest = () => {
    setIsPlaying(false)
  }

  const resumeTest = () => {
    setIsPlaying(true)
  }

  const completeTest = useCallback(() => {
    if (!currentSession) return

    const endTime = new Date()
    const timeSpent = currentSession.duration - timeRemaining
    
    // Calculate results
    let totalPoints = 0
    let earnedPoints = 0
    const answers: UserAnswer[] = userAnswers.map(answer => {
      const question = currentSession.questions.find(q => q.id === answer.questionId)
      if (!question) return answer

      totalPoints += question.points
      
      let isCorrect = false
      let pointsEarned = 0

      if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
        isCorrect = answer.answer === question.correctAnswer
        pointsEarned = isCorrect ? question.points : 0
      } else if (question.type === 'SHORT_ANSWER') {
        isCorrect = typeof answer.answer === 'string' && 
          answer.answer.toLowerCase().includes(question.correctAnswer?.toLowerCase() || '')
        pointsEarned = isCorrect ? question.points : 0
      } else {
        // Essay and case analysis require manual grading
        pointsEarned = Math.floor(question.points * 0.7) // Assume 70% for demo
      }

      earnedPoints += pointsEarned

      return {
        ...answer,
        isCorrect,
        pointsEarned
      }
    })

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    const passed = percentage >= (currentSession.passingScore / currentSession.totalPoints) * 100

    const result: TestResult = {
      sessionId: currentSession.id,
      score: earnedPoints,
      totalPoints,
      percentage,
      passed,
      timeSpent,
      answers,
      strengths: ['Contract law principles', 'Legal analysis'],
      weaknesses: ['Time management', 'Complex case analysis'],
      recommendations: ['Practice more timed exercises', 'Focus on case analysis techniques'],
      rank: Math.floor(Math.random() * 100) + 1,
      percentile: Math.floor(Math.random() * 30) + 70
    }

    setCurrentResult(result)
    setShowResults(true)
    setIsPlaying(false)
    
    // Update session status
    setCurrentSession({
      ...currentSession,
      endTime,
      status: 'COMPLETED'
    })
  }, [currentSession, userAnswers, timeRemaining])

  const handleAnswer = (answer: string | number) => {
    if (!currentSession) return

    const question = currentSession.questions[currentQuestionIndex]
    const existingAnswerIndex = userAnswers.findIndex(a => a.questionId === question.id)

    const newAnswer: UserAnswer = {
      questionId: question.id,
      answer,
      timeSpent: 0, // Would track actual time
      confidence: 0.8 // Would be calculated based on user behavior
    }

    if (existingAnswerIndex >= 0) {
      const updatedAnswers = [...userAnswers]
      updatedAnswers[existingAnswerIndex] = newAnswer
      setUserAnswers(updatedAnswers)
    } else {
      setUserAnswers([...userAnswers, newAnswer])
    }
  }

  const nextQuestion = () => {
    if (currentSession && currentQuestionIndex < currentSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowHint(false)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowHint(false)
    }
  }

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
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

  const currentQuestion = currentSession?.questions[currentQuestionIndex]
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion?.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Test & Exam System</h1>
          <p className="text-xl text-gray-600">Comprehensive assessment tools for legal education</p>
        </div>

        {/* Mode Selection */}
        {!currentSession && !showResults && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { id: 'quiz', label: 'Quick Quiz', icon: Zap, description: 'Fast-paced knowledge checks' },
              { id: 'exam', label: 'Formal Exam', icon: FileText, description: 'Comprehensive assessments' },
              { id: 'practice', label: 'Practice Mode', icon: Target, description: 'No time pressure practice' },
              { id: 'adaptive', label: 'Adaptive Test', icon: Brain, description: 'AI-adjusted difficulty' }
            ].map((mode) => (
              <Card key={mode.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <mode.icon className="w-8 h-8 text-blue-600" />
                    <h3 className="font-semibold text-lg">{mode.label}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{mode.description}</p>
                  <Button 
                    className="w-full"
                    onClick={() => setActiveMode(mode.id as any)}
                    variant={activeMode === mode.id ? 'default' : 'outline'}
                  >
                    Select
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Test Selection */}
        {!currentSession && !showResults && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Available Tests</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {quizTemplates
                .filter(test => test.type.toLowerCase() === activeMode)
                .map((test) => (
                <Card key={test.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{test.title}</CardTitle>
                      <Badge variant="outline">{test.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{formatTime(test.duration)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Questions:</span>
                        <span className="font-medium">{test.questions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Points:</span>
                        <span className="font-medium">{test.totalPoints}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Passing Score:</span>
                        <span className="font-medium">{test.passingScore}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => startTest(test)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Test
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active Test */}
        {currentSession && !showResults && currentQuestion && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Question Area */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{currentSession.title}</CardTitle>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" onClick={() => toggleFlag(currentQuestion.id)}>
                        <Flag className={`w-4 h-4 ${flaggedQuestions.includes(currentQuestion.id) ? 'text-red-500' : ''}`} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
                        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={isPlaying ? pauseTest : resumeTest}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Question {currentQuestionIndex + 1} of {currentSession.questions.length}</span>
                      <span>{formatTime(timeRemaining)}</span>
                    </div>
                    <Progress value={(currentQuestionIndex / currentSession.questions.length) * 100} />
                  </div>

                  {/* Question */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                        {currentQuestion.difficulty}
                      </Badge>
                      <Badge variant="outline">{currentQuestion.points} points</Badge>
                      <Badge variant="outline">{currentQuestion.category}</Badge>
                    </div>

                    <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>

                    {/* Answer Options */}
                    {currentQuestion.type === 'MULTIPLE_CHOICE' && currentQuestion.options && (
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <Button
                            key={index}
                            variant={currentAnswer?.answer === index ? 'default' : 'outline'}
                            className="w-full justify-start text-left p-4 h-auto"
                            onClick={() => handleAnswer(index)}
                          >
                            <span className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 ${
                                currentAnswer?.answer === index ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                              }`} />
                              {option}
                            </span>
                          </Button>
                        ))}
                      </div>
                    )}

                    {currentQuestion.type === 'TRUE_FALSE' && (
                      <div className="space-y-3">
                        <Button
                          variant={currentAnswer?.answer === 0 ? 'default' : 'outline'}
                          className="w-full justify-start p-4 h-auto"
                          onClick={() => handleAnswer(0)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 ${
                              currentAnswer?.answer === 0 ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                            }`} />
                            True
                          </div>
                        </Button>
                        <Button
                          variant={currentAnswer?.answer === 1 ? 'default' : 'outline'}
                          className="w-full justify-start p-4 h-auto"
                          onClick={() => handleAnswer(1)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 ${
                              currentAnswer?.answer === 1 ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                            }`} />
                            False
                          </div>
                        </Button>
                      </div>
                    )}

                    {(currentQuestion.type === 'SHORT_ANSWER' || currentQuestion.type === 'ESSAY' || currentQuestion.type === 'CASE_ANALYSIS') && (
                      <Textarea
                        placeholder="Enter your answer here..."
                        value={currentAnswer?.answer?.toString() || ''}
                        onChange={(e) => handleAnswer(e.target.value)}
                        className="min-h-[150px]"
                      />
                    )}

                    {/* Hint */}
                    {currentQuestion.hints && currentQuestion.hints.length > 0 && (
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowHint(!showHint)}
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          {showHint ? 'Hide Hint' : 'Show Hint'}
                        </Button>
                        {showHint && (
                          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">{currentQuestion.hints[0]}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={previousQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <div className="flex gap-2">
                        {currentQuestionIndex < currentSession.questions.length - 1 ? (
                          <Button onClick={nextQuestion}>
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        ) : (
                          <Button onClick={completeTest}>
                            Complete Test
                            <CheckCircle className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Question Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Question Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {currentSession.questions.map((question, index) => (
                      <Button
                        key={question.id}
                        variant={index === currentQuestionIndex ? 'default' : 'outline'}
                        size="sm"
                        className={`p-2 ${
                          userAnswers.find(a => a.questionId === question.id) ? 'bg-green-100' : ''
                        }`}
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Answered:</span>
                    <span className="font-medium">{userAnswers.length}/{currentSession.questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Flagged:</span>
                    <span className="font-medium">{flaggedQuestions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Time Left:</span>
                    <span className="font-medium">{formatTime(timeRemaining)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Points:</span>
                    <span className="font-medium">{currentQuestion.points}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Save className="w-4 h-4 mr-2" />
                    Save Progress
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Get Help
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={completeTest}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Test
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && currentResult && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      currentResult.passed ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {currentResult.passed ? 
                        <CheckCircle className="w-10 h-10 text-green-600" /> :
                        <XCircle className="w-10 h-10 text-red-600" />
                      }
                    </div>
                    <h3 className="font-semibold text-lg">{currentResult.passed ? 'PASSED' : 'FAILED'}</h3>
                    <p className="text-gray-600">{currentResult.percentage.toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {currentResult.score}/{currentResult.totalPoints}
                    </div>
                    <p className="text-gray-600">Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {formatTime(currentResult.timeSpent)}
                    </div>
                    <p className="text-gray-600">Time Spent</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      #{currentResult.rank}
                    </div>
                    <p className="text-gray-600">Rank</p>
                  </div>
                </div>

                {/* Performance Analysis */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {currentResult.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {currentResult.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {currentResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Results
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowResults(false)
                    setCurrentSession(null)
                    setCurrentResult(null)
                  }}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Take Another Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
