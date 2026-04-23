"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, BookOpen, Info, ExternalLink } from 'lucide-react'
import { apiService } from '@/lib/api-service'

interface LegalTerm {
  id: string
  term: string
  definition: string
  explanation: string
  category: string
  synonyms: string[]
  examples: string[]
  related_terms: string[]
  source?: string
  last_updated: string
}

interface GlossaryTooltipProps {
  term: string
  children: React.ReactNode
  showIcon?: boolean
  className?: string
  onTermClick?: (term: LegalTerm) => void
}

interface TermHighlightProps {
  text: string
  className?: string
  onTermClick?: (term: LegalTerm) => void
}

const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({
  term,
  children,
  showIcon = true,
  className = "",
  onTermClick
}) => {
  const [termData, setTermData] = useState<LegalTerm | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const fetchTermData = useCallback(async () => {
    if (!term.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Add small delay to prevent immediate API calls on hover
      timeoutRef.current = setTimeout(async () => {
        try {
          const response = await apiService.get(`/api/v1/legal-dictionary/term/${encodeURIComponent(term.trim())}`)
          if (response.success && response.data) {
            setTermData(response.data)
          } else {
            // Try to find similar terms
            const searchResponse = await apiService.get(`/api/v1/legal-dictionary/search?q=${encodeURIComponent(term.trim())}&limit=1`)
            if (searchResponse.success && searchResponse.data && searchResponse.data.length > 0) {
              setTermData(searchResponse.data[0])
            } else {
              setError("Term not found")
            }
          }
        } catch (err) {
          setError("Failed to fetch term definition")
        } finally {
          setLoading(false)
        }
      }, 300)
    } catch (err) {
      setError("Failed to fetch term definition")
      setLoading(false)
    }
  }, [term])

  const handleTooltipOpen = (open: boolean) => {
    if (open && !termData && !loading && !error) {
      fetchTermData()
    }
  }

  const handleTermClick = () => {
    if (termData && onTermClick) {
      onTermClick(termData)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'civil': 'bg-blue-100 text-blue-800',
      'criminal': 'bg-red-100 text-red-800',
      'administrative': 'bg-green-100 text-green-800',
      'constitutional': 'bg-purple-100 text-purple-800',
      'commercial': 'bg-orange-100 text-orange-800',
      'family': 'bg-pink-100 text-pink-800',
      'labor': 'bg-yellow-100 text-yellow-800',
      'tax': 'bg-indigo-100 text-indigo-800',
      'customs': 'bg-teal-100 text-teal-800',
      'general': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.general
  }

  return (
    <TooltipProvider>
      <Tooltip onOpenChange={handleTooltipOpen}>
        <TooltipTrigger asChild>
          <span 
            className={`inline-flex items-center gap-1 cursor-help border-b-2 border-dotted border-blue-400 hover:border-blue-600 transition-colors ${className}`}
            onClick={handleTermClick}
          >
            {children}
            {showIcon && (
              <Info className="h-3 w-3 text-blue-500 inline" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-md p-0" 
          side="top" 
          align="center"
          sideOffset={5}
        >
          {loading ? (
            <div className="p-4 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Loading definition...</span>
            </div>
          ) : error ? (
            <div className="p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : termData ? (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {termData.term}
                  </CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getCategoryColor(termData.category)}`}
                  >
                    {termData.category}
                  </Badge>
                </div>
                {termData.source && (
                  <CardDescription className="text-xs">
                    Source: {termData.source}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold mb-1">Definition</h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {termData.definition}
                  </p>
                </div>
                
                {termData.explanation && termData.explanation !== termData.definition && (
                  <div>
                    <h4 className="text-xs font-semibold mb-1">Explanation</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {termData.explanation}
                    </p>
                  </div>
                )}
                
                {termData.synonyms && termData.synonyms.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold mb-1">Synonyms</h4>
                    <div className="flex flex-wrap gap-1">
                      {termData.synonyms.slice(0, 3).map((synonym, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {synonym}
                        </Badge>
                      ))}
                      {termData.synonyms.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{termData.synonyms.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {termData.examples && termData.examples.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold mb-1">Examples</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {termData.examples.slice(0, 2).map((example, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-gray-400">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {termData.related_terms && termData.related_terms.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {termData.related_terms.length} related terms
                      </span>
                      {onTermClick && (
                        <button
                          onClick={handleTermClick}
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          View details
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Component for highlighting legal terms in text
export const TermHighlighter: React.FC<TermHighlightProps> = ({
  text,
  className = "",
  onTermClick
}) => {
  const [highlightedTerms, setHighlightedTerms] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!text.trim()) return

    const findLegalTerms = async () => {
      setLoading(true)
      try {
        // Get all legal terms to check against
        const response = await apiService.get('/api/v1/legal-dictionary/terms?limit=1000')
        if (response.success && response.data) {
          const terms = response.data.map((term: LegalTerm) => term.term.toLowerCase())
          setHighlightedTerms(terms)
        }
      } catch (error) {
        console.error('Failed to fetch legal terms:', error)
      } finally {
        setLoading(false)
      }
    }

    findLegalTerms()
  }, [text])

  const highlightText = (text: string) => {
    if (highlightedTerms.length === 0) return text

    const words = text.split(/(\s+)/)
    const highlighted = words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[^\w\u0400-\u04FF]/g, '')
      
      if (highlightedTerms.some(term => 
        term.includes(cleanWord) || cleanWord.includes(term)
      ) && word.length > 2) {
        return (
          <GlossaryTooltip
            key={index}
            term={word.replace(/[^\w\u0400-\u04FF\s]/g, '')}
            showIcon={false}
            onTermClick={onTermClick}
          >
            {word}
          </GlossaryTooltip>
        )
      }
      return word
    })

    return <>{highlighted}</>
  }

  if (loading) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {highlightText(text)}
    </span>
  )
}

// Component for displaying detailed term information
export const TermDetailModal: React.FC<{
  term: LegalTerm
  isOpen: boolean
  onClose: () => void
}> = ({ term, isOpen, onClose }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      'civil': 'bg-blue-100 text-blue-800',
      'criminal': 'bg-red-100 text-red-800',
      'administrative': 'bg-green-100 text-green-800',
      'constitutional': 'bg-purple-100 text-purple-800',
      'commercial': 'bg-orange-100 text-orange-800',
      'family': 'bg-pink-100 text-pink-800',
      'labor': 'bg-yellow-100 text-yellow-800',
      'tax': 'bg-indigo-100 text-indigo-800',
      'customs': 'bg-teal-100 text-teal-800',
      'general': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.general
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">{term.term}</CardTitle>
                <CardDescription>
                  <Badge 
                    variant="secondary" 
                    className={`mt-1 ${getCategoryColor(term.category)}`}
                  >
                    {term.category}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Definition</h3>
            <p className="text-gray-700 leading-relaxed">{term.definition}</p>
          </div>

          {term.explanation && term.explanation !== term.definition && (
            <div>
              <h3 className="font-semibold mb-2">Explanation</h3>
              <p className="text-gray-600 leading-relaxed">{term.explanation}</p>
            </div>
          )}

          {term.synonyms && term.synonyms.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Synonyms</h3>
              <div className="flex flex-wrap gap-2">
                {term.synonyms.map((synonym, index) => (
                  <Badge key={index} variant="outline">
                    {synonym}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {term.examples && term.examples.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Examples</h3>
              <ul className="space-y-2">
                {term.examples.map((example, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-600">{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {term.related_terms && term.related_terms.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Related Terms</h3>
              <div className="flex flex-wrap gap-2">
                {term.related_terms.map((relatedTerm, index) => (
                  <GlossaryTooltip key={index} term={relatedTerm} showIcon={false}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                      {relatedTerm}
                    </Badge>
                  </GlossaryTooltip>
                ))}
              </div>
            </div>
          )}

          {term.source && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Source: {term.source} | Last updated: {new Date(term.last_updated).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default GlossaryTooltip
