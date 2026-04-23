'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Scale, 
  Brain, 
  FileText, 
  Lightbulb, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Clock,
  Target
} from 'lucide-react'

interface CaseStep {
  id: string
  title: string
  description: string
  type: 'issue' | 'rule' | 'application' | 'conclusion'
  userAnswer?: string
  correctAnswer?: string
  isCorrect?: boolean
  feedback?: string
  hints?: string[]
}

interface CaseData {
  id: string
  title: string
  description: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  category: string
  timeLimit: number
  steps: CaseStep[]
}

const mockCase: CaseData = {
  id: '1',
  title: 'Breach of Contract - Software Development Agreement',
  description: 'A software company contracted to develop a custom application for a client. The project was delivered 2 months late with missing features. The client refused to pay the final installment and is suing for damages.',
  difficulty: 'INTERMEDIATE',
  category: 'Contract Law',
  timeLimit: 30,
  steps: [
    {
      id: '1',
      title: 'Identify the Legal Issue',
      description: 'What is the primary legal issue in this case?',
      type: 'issue',
      correctAnswer: 'Breach of contract due to late delivery and incomplete performance',
      hints: [
        'Consider what obligations were not met',
        'Think about the agreement terms',
        'Focus on the core dispute'
      ]
    },
    {
      id: '2',
      title: 'Identify Applicable Rules',
      description: 'What legal principles govern this situation?',
      type: 'rule',
      correctAnswer: 'Contract law principles including offer, acceptance, consideration, and breach',
      hints: [
        'What makes a contract valid?',
        'What constitutes a breach?',
        'What remedies are available?'
      ]
    },
    {
      id: '3',
      title: 'Apply Rules to Facts',
      description: 'How do the legal rules apply to this specific case?',
      type: 'application',
      correctAnswer: 'The software company failed to meet delivery deadlines and deliver agreed features, constituting a material breach',
      hints: [
        'Compare actual performance vs. promised performance',
        'Consider the impact of delays',
        'Evaluate missing features'
      ]
    },
    {
      id: '4',
      title: 'Reach Conclusion',
      description: 'What is the likely outcome of this case?',
      type: 'conclusion',
      correctAnswer: 'Client likely entitled to damages for breach, but software company may claim partial payment for work completed',
      hints: [
        'Consider damages calculation',
        'Think about partial performance',
        'Evaluate settlement possibilities'
      ]
    }
  ]
}

export default function CaseSolver() {
  const [currentStep, setCurrentStep] = useState(0)
  const [caseData, setCaseData] = useState<CaseData>(mockCase)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [showHints, setShowHints] = useState<Record<string, boolean>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswer = (stepId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [stepId]: answer }))
  }

  const checkAnswer = () => {
    const currentStepData = caseData.steps[currentStep]
    const userAnswer = userAnswers[currentStepData.id]
    
    if (!userAnswer) {
      alert('Please provide an answer before checking')
      return
    }

    setShowFeedback(true)
    
    // Simple similarity check (in real app, this would use AI)
    const isCorrect = checkAnswerSimilarity(userAnswer, currentStepData.correctAnswer || '')
    
    if (isCorrect) {
      setScore(prev => prev + 25)
    }
  }

  const checkAnswerSimilarity = (userAnswer: string, correctAnswer: string): boolean => {
    // Simple keyword matching for demo
    const userWords = userAnswer.toLowerCase().split(' ')
    const correctWords = correctAnswer.toLowerCase().split(' ')
    
    const matches = userWords.filter(word => 
      correctWords.some(correctWord => correctWord.includes(word) || word.includes(correctWord))
    )
    
    return matches.length >= Math.floor(correctWords.length * 0.6)
  }

  const nextStep = () => {
    if (currentStep < caseData.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setShowFeedback(false)
    } else {
      setIsCompleted(true)
    }
  }

  const resetCase = () => {
    setCurrentStep(0)
    setUserAnswers({})
    setShowFeedback(false)
    setScore(0)
    setTimeSpent(0)
    setShowHints({})
    setIsCompleted(false)
  }

  const toggleHint = (stepId: string) => {
    setShowHints(prev => ({ ...prev, [stepId]: !prev[stepId] }))
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'issue': return <Target className="w-5 h-5" />
      case 'rule': return <FileText className="w-5 h-5" />
      case 'application': return <Brain className="w-5 h-5" />
      case 'conclusion': return <CheckCircle className="w-5 h-5" />
      default: return <Lightbulb className="w-5 h-5" />
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

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600 flex items-center justify-center gap-2">
              <CheckCircle className="w-8 h-8" />
              Case Completed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{score}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatTime(timeSpent)}</div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{caseData.steps.length}</div>
                <div className="text-sm text-gray-600">Steps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{caseData.difficulty}</div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={resetCase} variant="outline">
                Try Another Case
              </Button>
              <Button>
                View Detailed Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentStepData = caseData.steps[currentStep]
  const progress = ((currentStep + 1) / caseData.steps.length) * 100

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-xl">{caseData.title}</CardTitle>
              <p className="text-gray-600">{caseData.description}</p>
              <div className="flex gap-2 items-center">
                <Badge className={getDifficultyColor(caseData.difficulty)}>
                  {caseData.difficulty}
                </Badge>
                <Badge variant="outline">{caseData.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeSpent)} / {caseData.timeLimit}:00
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{score}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{currentStep + 1} of {caseData.steps.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStepIcon(currentStepData.type)}
                Step {currentStep + 1}: {currentStepData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Question:</h3>
                <p className="text-gray-700">{currentStepData.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Your Answer:</h3>
                <textarea
                  value={userAnswers[currentStepData.id] || ''}
                  onChange={(e) => handleAnswer(currentStepData.id, e.target.value)}
                  className="w-full p-3 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide your legal analysis here..."
                  disabled={showFeedback}
                />
              </div>

              {showFeedback && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {userAnswers[currentStepData.id] && 
                     checkAnswerSimilarity(userAnswers[currentStepData.id], currentStepData.correctAnswer || '') ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-600 font-semibold">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-600 font-semibold">Needs Improvement</span>
                      </>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-600">Expected Answer:</h4>
                    <p className="text-gray-700">{currentStepData.correctAnswer}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-600">Feedback:</h4>
                    <p className="text-gray-700">
                      {currentStepData.type === 'issue' && 
                        "Good legal issue identification requires focusing on the core dispute. Consider what specific legal right or obligation was violated."
                      }
                      {currentStepData.type === 'rule' && 
                        "Legal rules should be stated precisely with reference to statutes or precedents. Be specific about the elements."
                      }
                      {currentStepData.type === 'application' && 
                        "Applying rules to facts requires connecting each element of the rule to specific facts in the case."
                      }
                      {currentStepData.type === 'conclusion' && 
                        "Conclusions should flow logically from the analysis and address the likely outcome with reasoning."
                      }
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {!showFeedback ? (
                  <Button onClick={checkAnswer} className="flex-1">
                    Check Answer
                  </Button>
                ) : (
                  <Button onClick={nextStep} className="flex-1">
                    {currentStep < caseData.steps.length - 1 ? (
                      <>
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      'Complete Case'
                    )}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => toggleHint(currentStepData.id)}
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHints[currentStepData.id] ? 'Hide' : 'Show'} Hint
                </Button>
              </div>

              {showHints[currentStepData.id] && currentStepData.hints && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Hints:</h4>
                  <ul className="space-y-1">
                    {currentStepData.hints.map((hint, index) => (
                      <li key={index} className="text-blue-700 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* IRAC Method Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">IRAC Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg border-2 ${
                  currentStepData.type === 'issue' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="font-semibold text-blue-600">Issue</div>
                  <div className="text-sm text-gray-600">Identify the legal question</div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${
                  currentStepData.type === 'rule' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="font-semibold text-blue-600">Rule</div>
                  <div className="text-sm text-gray-600">State applicable law</div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${
                  currentStepData.type === 'application' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="font-semibold text-blue-600">Application</div>
                  <div className="text-sm text-gray-600">Apply law to facts</div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${
                  currentStepData.type === 'conclusion' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="font-semibold text-blue-600">Conclusion</div>
                  <div className="text-sm text-gray-600">Reach logical outcome</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Step Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {caseData.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-2 rounded-lg flex items-center gap-3 ${
                      index === currentStep ? 'bg-blue-100 border border-blue-300' :
                      index < currentStep ? 'bg-green-100 border border-green-300' :
                      'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getStepIcon(step.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs text-gray-500">Step {index + 1}</div>
                    </div>
                    {index < currentStep && (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
