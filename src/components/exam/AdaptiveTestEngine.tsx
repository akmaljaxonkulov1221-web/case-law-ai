'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Brain,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  FileText,
  BarChart3,
  Play,
  RotateCcw,
  ArrowRight
} from 'lucide-react'

interface Question {
  id: string
  type: 'multiple_choice' | 'case_analysis' | 'legal_reasoning' | 'essay'
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  question: string
  options?: string[]
  correctAnswer?: string
  explanation?: string
  timeLimit: number
  points: number
}

interface TestSession {
  id: string
  title: string
  questions: Question[]
  currentQuestionIndex: number
  answers: Record<string, string>
  startTime: Date
  timeSpent: number
  adaptiveLevel: number
  performance: number[]
}

interface TestResult {
  score: number
  totalPoints: number
  correctAnswers: number
  timeSpent: number
  difficultyReached: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'multiple_choice',
    difficulty: 'easy',
    category: 'Contract Law',
    question: 'Which of the following is NOT an essential element of a valid contract?',
    options: [
      'Offer and acceptance',
      'Consideration',
      'Written form',
      'Legal capacity'
    ],
    correctAnswer: 'Written form',
    explanation: 'While written form is important for certain contracts, it is not an essential element for all contracts. Oral contracts can be valid.',
    timeLimit: 60,
    points: 10
  },
  {
    id: '2',
    type: 'case_analysis',
    difficulty: 'medium',
    category: 'Tort Law',
    question: 'A customer slips and falls in a grocery store due to a wet floor with no warning sign. Analyze the potential negligence claim.',
    correctAnswer: 'The store may be liable for negligence due to failure to maintain safe premises and warn customers of hazards.',
    explanation: 'The store owes a duty of care to customers, breached that duty by not warning of the wet floor, and the customer suffered damages.',
    timeLimit: 180,
    points: 25
  },
  {
    id: '3',
    type: 'legal_reasoning',
    difficulty: 'hard',
    category: 'Criminal Law',
    question: 'Explain the difference between mens rea and actus reus in criminal liability.',
    correctAnswer: 'Mens rea refers to the guilty mind or mental state, while actus reus refers to the guilty act or physical conduct.',
    explanation: 'Both elements must be present for most criminal liability. Mens rea covers intent, knowledge, recklessness, or negligence, while actus reus covers the actual criminal act.',
    timeLimit: 120,
    points: 20
  }
]

export default function AdaptiveTestEngine() {
  const [testSession, setTestSession] = useState<TestSession | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [testResults, setTestResults] = useState<TestResult | null>(null)
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    if (testSession) {
      const timer = setInterval(() => {
        setTestSession(prev => prev ? {
          ...prev,
          timeSpent: Math.floor((new Date().getTime() - prev.startTime.getTime()) / 1000)
        } : null)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [testSession])

  const startTest = () => {
    const session: TestSession = {
      id: Date.now().toString(),
      title: 'Legal Knowledge Assessment',
      questions: [...mockQuestions],
      currentQuestionIndex: 0,
      answers: {},
      startTime: new Date(),
      timeSpent: 0,
      adaptiveLevel: 1,
      performance: []
    }
    setTestSession(session)
    setIsStarted(true)
    setShowResult(false)
    setTestResults(null)
  }

  const submitAnswer = () => {
    if (!testSession || !selectedAnswer) return

    const currentQuestion = testSession.questions[testSession.currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    
    const updatedSession = {
      ...testSession,
      answers: {
        ...testSession.answers,
        [currentQuestion.id]: selectedAnswer
      },
      performance: [...testSession.performance, isCorrect ? 1 : 0],
      adaptiveLevel: calculateAdaptiveLevel(testSession.performance, isCorrect)
    }

    setTestSession(updatedSession)

    if (testSession.currentQuestionIndex < testSession.questions.length - 1) {
      setTestSession({
        ...updatedSession,
        currentQuestionIndex: testSession.currentQuestionIndex + 1
      })
      setSelectedAnswer('')
    } else {
      completeTest(updatedSession)
    }
  }

  const calculateAdaptiveLevel = (performance: number[], isCorrect: boolean): number => {
    const recentPerformance = performance.slice(-3)
    const recentScore = recentPerformance.length > 0 ? 
      recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length : 0.5

    if (recentScore > 0.8) return Math.min(3, testSession?.adaptiveLevel || 1 + 1)
    if (recentScore < 0.3) return Math.max(1, (testSession?.adaptiveLevel || 1) - 1)
    return testSession?.adaptiveLevel || 1
  }

  const completeTest = (session: TestSession) => {
    const correctAnswers = Object.entries(session.answers).filter(
      ([questionId, answer]) => {
        const question = session.questions.find(q => q.id === questionId)
        return question && answer === question.correctAnswer
      }
    ).length

    const totalPoints = session.questions.reduce((sum, q) => sum + q.points, 0)
    const earnedPoints = session.questions.reduce((sum, q) => {
      const isCorrect = session.answers[q.id] === q.correctAnswer
      return sum + (isCorrect ? q.points : 0)
    }, 0)

    const score = Math.round((earnedPoints / totalPoints) * 100)

    const results: TestResult = {
      score,
      totalPoints,
      correctAnswers,
      timeSpent: session.timeSpent,
      difficultyReached: session.adaptiveLevel === 3 ? 'Advanced' : 
                       session.adaptiveLevel === 2 ? 'Intermediate' : 'Basic',
      strengths: analyzeStrengths(session),
      weaknesses: analyzeWeaknesses(session),
      recommendations: generateRecommendations(session)
    }

    setTestResults(results)
    setShowResult(true)
    setIsStarted(false)
  }

  const analyzeStrengths = (session: TestSession): string[] => {
    const strengths: string[] = []
    const categories = session.questions.reduce((acc, q) => {
      if (!acc[q.category]) acc[q.category] = { correct: 0, total: 0 }
      acc[q.category].total++
      if (session.answers[q.id] === q.correctAnswer) acc[q.category].correct++
      return acc
    }, {} as Record<string, { correct: number; total: number }>)

    Object.entries(categories).forEach(([category, stats]) => {
      if (stats.correct / stats.total > 0.7) {
        strengths.push(`${category} (${Math.round((stats.correct / stats.total) * 100)}%)`)
      }
    })

    return strengths.length > 0 ? strengths : ['General legal reasoning']
  }

  const analyzeWeaknesses = (session: TestSession): string[] => {
    const weaknesses: string[] = []
    const categories = session.questions.reduce((acc, q) => {
      if (!acc[q.category]) acc[q.category] = { correct: 0, total: 0 }
      acc[q.category].total++
      if (session.answers[q.id] === q.correctAnswer) acc[q.category].correct++
      return acc
    }, {} as Record<string, { correct: number; total: number }>)

    Object.entries(categories).forEach(([category, stats]) => {
      if (stats.correct / stats.total < 0.5) {
        weaknesses.push(`${category} (${Math.round((stats.correct / stats.total) * 100)}%)`)
      }
    })

    return weaknesses.length > 0 ? weaknesses : ['None identified']
  }

  const generateRecommendations = (session: TestSession): string[] => {
    const recommendations: string[] = []
    const score = Math.round((session.performance.filter(p => p === 1).length / session.performance.length) * 100)

    if (score < 60) {
      recommendations.push('Review fundamental legal concepts')
      recommendations.push('Practice with beginner-level cases')
    } else if (score < 80) {
      recommendations.push('Focus on intermediate case analysis')
      recommendations.push('Practice IRAC method application')
    } else {
      recommendations.push('Challenge yourself with advanced scenarios')
      recommendations.push('Explore complex legal reasoning problems')
    }

    return recommendations
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = testSession?.questions[testSession.currentQuestionIndex]
  const progress = testSession ? ((testSession.currentQuestionIndex + 1) / testSession.questions.length) * 100 : 0

  if (showResult && testResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600 flex items-center justify-center gap-2">
              <CheckCircle className="w-8 h-8" />
              Test Completed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{testResults.score}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{testResults.correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{formatTime(testResults.timeSpent)}</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{testResults.difficultyReached}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {testResults.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-500" />
                    Areas to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {testResults.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-500" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {testResults.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={startTest}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Test
              </Button>
              <Button variant="outline">
                <Award className="w-4 h-4 mr-2" />
                View Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Brain className="w-8 h-8 text-blue-600" />
              Adaptive Legal Test Engine
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Personalized assessment that adapts to your skill level
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Adaptive Difficulty</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Questions adjust based on your performance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Time Tracking</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Monitor your pace and efficiency
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Detailed Analytics</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Comprehensive performance analysis
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button onClick={startTest} size="lg">
                <Play className="w-5 h-5 mr-2" />
                Start Adaptive Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!testSession || !currentQuestion) return null

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">{testSession.title}</h2>
              <p className="text-gray-600">Question {testSession.currentQuestionIndex + 1} of {testSession.questions.length}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{formatTime(testSession.timeSpent)}</div>
              <div className="text-sm text-gray-600">Time Elapsed</div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg mb-2">{currentQuestion.question}</CardTitle>
              <div className="flex gap-2">
                <Badge className={
                  currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">{currentQuestion.category}</Badge>
                <Badge variant="outline">{currentQuestion.points} points</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">{currentQuestion.timeLimit}s</div>
              <div className="text-sm text-gray-600">Time Limit</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnswer === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedAnswer(option)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedAnswer === option ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedAnswer === option && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === 'case_analysis' && (
            <div>
              <textarea
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="w-full p-4 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide your legal analysis here..."
              />
            </div>
          )}

          {currentQuestion.type === 'legal_reasoning' && (
            <div>
              <textarea
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="w-full p-4 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Explain your legal reasoning..."
              />
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button 
              onClick={submitAnswer}
              disabled={!selectedAnswer}
              className="min-w-[120px]"
            >
              {testSession.currentQuestionIndex === testSession.questions.length - 1 ? (
                'Complete Test'
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
