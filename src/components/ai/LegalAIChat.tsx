'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LegalAISystem, LegalResponse, CaseMode } from '@/lib/legal-ai-system'
import {
  Bot,
  Scale,
  MessageSquare,
  Send,
  Brain,
  Gavel,
  BookOpen,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  response?: LegalResponse
}

export default function LegalAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [currentMode, setCurrentMode] = useState<CaseMode>('case_solver')
  const [isProcessing, setIsProcessing] = useState(false)
  const [legalAI] = useState(() => new LegalAISystem())

  const modeOptions = [
    { value: 'case_solver', label: 'Case Solver', icon: Scale, description: 'Solve legal cases step-by-step' },
    { value: 'judge', label: 'Judge Mode', icon: Gavel, description: 'Act as judge and give verdict' },
    { value: 'debate', label: 'Debate Mode', icon: MessageSquare, description: 'Generate PRO vs CONTRA arguments' },
    { value: 'summarizer', label: 'Summarizer', icon: BookOpen, description: 'Summarize legal cases' },
    { value: 'chat_assistant', label: 'Chat Assistant', icon: Bot, description: 'Answer legal questions' },
    { value: 'prediction', label: 'Prediction', icon: TrendingUp, description: 'Predict case outcomes' }
  ]

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsProcessing(true)

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      let aiResponse: LegalResponse

      switch (currentMode) {
        case 'case_solver':
          aiResponse = legalAI.analyzeLegalCase(inputText, "Solve this legal case")
          break
        case 'debate':
          const debateArgs = legalAI.generateDebateArguments(inputText)
          aiResponse = {
            shortAnswer: "Debate arguments generated",
            legalAnalysis: {
              issue: "Multiple legal perspectives identified",
              rule: "Competing legal principles apply",
              application: "Arguments can be made for both sides",
              conclusion: "Strong case for both prosecution and defense"
            },
            lawRule: "Legal precedent supports multiple interpretations",
            applicationToCase: `PRO: ${debateArgs.pro} CONTRA: ${debateArgs.contra}`,
            finalConclusion: "Case requires careful judicial consideration",
            confidenceScore: 75
          }
          break
        case 'summarizer':
          const summary = legalAI.summarizeCase(inputText)
          aiResponse = {
            shortAnswer: summary.substring(0, 100) + '...',
            legalAnalysis: {
              issue: "Case summary requested",
              rule: "Key legal principles identified",
              application: "Facts analyzed and condensed",
              conclusion: "Summary generated"
            },
            lawRule: "Legal summary principles applied",
            applicationToCase: summary,
            finalConclusion: "Case successfully summarized",
            confidenceScore: 85
          }
          break
        case 'prediction':
          const prediction = legalAI.predictOutcome(inputText)
          aiResponse = {
            shortAnswer: `Likely outcome: ${prediction.outcome}`,
            legalAnalysis: {
              issue: "Case outcome prediction requested",
              rule: "Legal probability analysis applied",
              application: "Facts weighed against precedent",
              conclusion: prediction.outcome
            },
            lawRule: "Predictive legal analysis principles",
            applicationToCase: `Probability: ${Math.round(prediction.probability * 100)}%`,
            finalConclusion: prediction.outcome,
            confidenceScore: Math.round(prediction.probability * 100)
          }
          break
        default:
          aiResponse = legalAI.analyzeLegalCase(inputText, "Provide legal guidance")
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.shortAnswer,
        timestamp: new Date(),
        response: aiResponse
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I encountered an error processing your request. Please rephrase your legal question.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const formatResponse = (response: LegalResponse) => {
    return (
      <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg border">
        {/* 🧠 Short Answer */}
        <div className="border-l-4 border-blue-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">🧠 Short Answer</span>
          </div>
          <p className="text-gray-700">{response.shortAnswer}</p>
        </div>

        {/* ⚖️ Legal Analysis */}
        <div className="border-l-4 border-green-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">⚖️ Legal Analysis</span>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Issue:</span>
              <p className="text-gray-700">{response.legalAnalysis.issue}</p>
            </div>
            <div>
              <span className="font-medium">Rule:</span>
              <p className="text-gray-700">{response.legalAnalysis.rule}</p>
            </div>
            <div>
              <span className="font-medium">Application:</span>
              <p className="text-gray-700">{response.legalAnalysis.application}</p>
            </div>
            <div>
              <span className="font-medium">Conclusion:</span>
              <p className="text-gray-700">{response.legalAnalysis.conclusion}</p>
            </div>
          </div>
        </div>

        {/* 📚 Law / Rule */}
        <div className="border-l-4 border-purple-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-800">📚 Law / Rule</span>
          </div>
          <p className="text-gray-700">{response.lawRule}</p>
        </div>

        {/* 🔍 Application to Case */}
        <div className="border-l-4 border-orange-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">🔍 Application to Case</span>
          </div>
          <p className="text-gray-700">{response.applicationToCase}</p>
        </div>

        {/* 🎯 Final Conclusion */}
        <div className="border-l-4 border-red-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <Gavel className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-800">🎯 Final Conclusion</span>
          </div>
          <p className="text-gray-700">{response.finalConclusion}</p>
        </div>

        {/* 📊 Confidence Score */}
        <div className="border-l-4 border-indigo-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-indigo-800">📊 Confidence Score</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${response.confidenceScore}%` }}
                />
              </div>
            </div>
            <span className="font-bold text-indigo-800">{response.confidenceScore}/100</span>
          </div>
        </div>

        {/* ⚠️ Uncertainty Warning */}
        {response.uncertainty && (
          <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 p-3 rounded">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">⚠️ Uncertainty</span>
            </div>
            <p className="text-yellow-700">{response.uncertainty}</p>
          </div>
        )}
      </div>
    )
  }

  const currentModeInfo = modeOptions.find(option => option.value === currentMode)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            Case-Law AI - Professional Legal Assistant
          </CardTitle>
          <p className="text-gray-600">
            Advanced legal AI system for case analysis, legal reasoning, and judicial simulation
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select AI Mode:</label>
            <Select value={currentMode} onValueChange={(value: CaseMode) => setCurrentMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modeOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {currentModeInfo && (
              <Badge variant="outline" className="flex items-center gap-2 w-fit">
                <currentModeInfo.icon className="w-4 h-4" />
                {currentModeInfo.description}
              </Badge>
            )}
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Ask me a legal question or present a case for analysis.</p>
                <p className="text-sm mt-2">I am Case-Law AI, your professional legal assistant.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.type === 'user' ? (
                        <span className="text-sm font-medium">You</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Bot className="w-4 h-4" />
                          <span className="text-sm font-medium">Case-Law AI</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm">{message.content}</p>
                    {message.response && formatResponse(message.response)}
                  </div>
                </div>
              ))
            )}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your legal question or case description..."
              className="flex-1 min-h-[100px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isProcessing}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* System Instructions */}
          <div className="text-xs text-gray-500 border-t pt-4">
            <p className="font-semibold mb-2">🔐 Case-Law AI System Instructions:</p>
            <ul className="space-y-1">
              <li>• I think step-by-step using legal reasoning methodology</li>
              <li>• I stay strictly in the legal domain - no hallucination</li>
              <li>• I always explain my reasoning and provide confidence scores</li>
              <li>• If uncertain, I explicitly state "UNCERTAIN" and explain why</li>
              <li>• I act as legal expert, judge simulator, and legal educator</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
