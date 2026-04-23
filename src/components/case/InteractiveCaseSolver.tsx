'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { iracAPI, handleAPIError } from '@/lib/api-service'
import { IRACAnalysis } from '@/lib/api-service'
import {
  FileText,
  Brain,
  Scale,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Send,
  Edit3,
  Save,
  Star,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Zap
} from 'lucide-react'

interface CaseSolverProps {
  onAnalysisComplete?: (analysis: IRACAnalysis) => void
}

export default function InteractiveCaseSolver({ onAnalysisComplete }: CaseSolverProps) {
  const [caseText, setCaseText] = useState('')
  const [legalDomain, setLegalDomain] = useState('')
  const [analysis, setAnalysis] = useState<IRACAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'input' | 'analysis'>('input')
  const [editingComponent, setEditingComponent] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [legalDomains, setLegalDomains] = useState<string[]>([])

  // Fetch legal domains on mount
  useEffect(() => {
    fetchLegalDomains()
  }, [])

  const fetchLegalDomains = async () => {
    try {
      const domains = await iracAPI.getLegalDomains()
      setLegalDomains(domains)
    } catch (err) {
      console.error('Failed to fetch legal domains:', err)
    }
  }

  // Handle case analysis
  const handleAnalyzeCase = async () => {
    if (!caseText.trim()) {
      setError('Please enter case text to analyze')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await iracAPI.solveCase(caseText, undefined, legalDomain)
      
      if (result.success && result.analysis) {
        setAnalysis(result.analysis)
        setActiveTab('analysis')
        onAnalysisComplete?.(result.analysis)
      } else {
        setError(result.message || 'Analysis failed')
      }
    } catch (err) {
      const errorInfo = handleAPIError(err)
      setError(errorInfo.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle component editing
  const handleEditComponent = (componentType: string, currentText: string) => {
    setEditingComponent(componentType)
    setEditText(currentText)
  }

  const handleSaveComponent = async () => {
    if (!analysis || !editingComponent) return

    try {
      const result = await iracAPI.updateSession(1, editingComponent, editText)
      
      if (result.success) {
        // Update local analysis
        setAnalysis({
          ...analysis,
          [editingComponent]: editText
        })
        setEditingComponent(null)
        setEditText('')
      } else {
        setError(result.message)
      }
    } catch (err) {
      const errorInfo = handleAPIError(err)
      setError(errorInfo.message)
    }
  }

  // Handle evaluation
  const handleEvaluate = async () => {
    if (!analysis) return

    try {
      const result = await iracAPI.evaluateSession(1)
      
      if (result.success) {
        // Show evaluation result
        alert(`Score: ${result.score}\n\nFeedback: ${result.feedback}`)
      } else {
        setError(result.message)
      }
    } catch (err) {
      const errorInfo = handleAPIError(err)
      setError(errorInfo.message)
    }
  }

  // Render component content
  const renderComponent = (title: string, content: string, componentType: string) => {
    const isEditing = editingComponent === componentType

    return (
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              {componentType === 'issue' && <Target className="w-5 h-5 text-blue-600" />}
              {componentType === 'rule' && <BookOpen className="w-5 h-5 text-green-600" />}
              {componentType === 'application' && <Scale className="w-5 h-5 text-orange-600" />}
              {componentType === 'conclusion' && <CheckCircle className="w-5 h-5 text-purple-600" />}
              {title}
            </CardTitle>
            {!isEditing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEditComponent(componentType, content)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
                placeholder={`Edit ${title}...`}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveComponent}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingComponent(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">{content}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Interactive Case Solver</h2>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-700">
            IRAC Method
          </Badge>
          <Badge className="bg-green-100 text-green-700">
            AI Powered
          </Badge>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200 rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <Button
          variant={activeTab === 'input' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('input')}
          className="border-b-2 border-transparent rounded-none"
        >
          <FileText className="w-4 h-4 mr-2" />
          Input
        </Button>
        <Button
          variant={activeTab === 'analysis' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('analysis')}
          className="border-b-2 border-transparent rounded-none"
          disabled={!analysis}
        >
          <Brain className="w-4 h-4 mr-2" />
          Analysis
        </Button>
      </div>

      {/* Input Tab */}
      {activeTab === 'input' && (
        <div className="space-y-6">
          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Case Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Legal Domain Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Domain (Optional)
                </label>
                <select
                  value={legalDomain}
                  onChange={(e) => setLegalDomain(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select domain...</option>
                  {legalDomains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain.charAt(0).toUpperCase() + domain.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Case Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Text
                </label>
                <textarea
                  value={caseText}
                  onChange={(e) => setCaseText(e.target.value)}
                  placeholder="Enter the case text you want to analyze using the IRAC methodology..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={12}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {caseText.length} characters
                  </span>
                  <span className="text-sm text-gray-500">
                    Minimum 100 characters required
                  </span>
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyzeCase}
                disabled={loading || caseText.length < 100}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Case
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-blue-50 border-blue-200 rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">IRAC Analysis Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Provide detailed case facts and legal issues</li>
                    <li>• Include relevant context and background information</li>
                    <li>• Specify legal domain for better accuracy</li>
                    <li>• AI will identify Issues, Rules, Application, and Conclusion</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && analysis && (
        <div className="space-y-6">
          {/* Analysis Header */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-xl font-bold mb-2">IRAC Analysis Complete</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Confidence: {(analysis.confidence_score * 100).toFixed(1)}%
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Generated in real-time
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={handleEvaluate}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Evaluate
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => setActiveTab('input')}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New Case
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IRAC Components */}
          <div className="space-y-6">
            {renderComponent('Issue', analysis.issue, 'issue')}
            {renderComponent('Rule', analysis.rule, 'rule')}
            {renderComponent('Application', analysis.application, 'application')}
            {renderComponent('Conclusion', analysis.conclusion, 'conclusion')}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Relevant Laws */}
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  Relevant Laws ({analysis.relevant_laws.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.relevant_laws.map((law, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{law.title}</span>
                        <Badge className="bg-green-100 text-green-700">
                          {law.relevance.toFixed(2)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {law.code_name} {law.article_number}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Relevant Cases */}
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Scale className="w-5 h-5 text-orange-600" />
                  Relevant Cases ({analysis.relevant_cases.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.relevant_cases.map((case_, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{case_.title}</span>
                        <Badge className="bg-orange-100 text-orange-700">
                          {case_.relevance.toFixed(2)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {case_.legal_domain} • {case_.precedent_value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Reasoning */}
          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-purple-600" />
                AI Reasoning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">{analysis.reasoning}</p>
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          {analysis.feedback && (
            <Card className="bg-yellow-50 border-yellow-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  AI Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">{analysis.feedback}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
