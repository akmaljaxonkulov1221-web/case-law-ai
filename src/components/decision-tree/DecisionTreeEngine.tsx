'use client'

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  GitBranch, 
  ArrowRight, 
  RotateCcw, 
  Play, 
  Pause,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react'

interface DecisionNode {
  id: string
  title: string
  description: string
  type: 'decision' | 'outcome' | 'evidence' | 'argument'
  choices?: DecisionChoice[]
  outcome?: {
    result: string
    confidence: number
    reasoning: string
    alternatives?: string[]
  }
  evidence?: {
    credibility: number
    relevance: number
    impact: string
  }
  position?: { x: number; y: number }
  parent?: string
  visited?: boolean
}

interface DecisionChoice {
  id: string
  text: string
  description: string
  leadsTo: string
  probability?: number
  risks?: string[]
  benefits?: string[]
}

interface DecisionPath {
  nodes: string[]
  choices: Record<string, string>
  outcome?: string
  score?: number
}

const mockDecisionTree: DecisionNode[] = [
  {
    id: '1',
    title: 'Initial Legal Strategy',
    description: 'Choose your primary approach to this contract dispute case',
    type: 'decision',
    position: { x: 400, y: 50 },
    choices: [
      {
        id: '1a',
        text: 'Pursue Damages',
        description: 'Seek monetary compensation for breach of contract',
        leadsTo: '2',
        probability: 0.6,
        benefits: ['Higher potential recovery', 'Clear legal precedent'],
        risks: ['Longer litigation', 'Higher legal costs']
      },
      {
        id: '1b',
        text: 'Seek Specific Performance',
        description: 'Force completion of original contract terms',
        leadsTo: '3',
        probability: 0.3,
        benefits: ['Original outcome achieved', 'Deters future breaches'],
        risks: ['Difficult to enforce', 'May not be practical']
      },
      {
        id: '1c',
        text: 'Negotiated Settlement',
        description: 'Attempt alternative dispute resolution',
        leadsTo: '4',
        probability: 0.1,
        benefits: ['Faster resolution', 'Lower costs', 'Preserves relationship'],
        risks: ['May require compromise', 'Less favorable terms']
      }
    ]
  },
  {
    id: '2',
    title: 'Damages Calculation',
    description: 'How should damages be calculated?',
    type: 'decision',
    parent: '1',
    position: { x: 200, y: 200 },
    choices: [
      {
        id: '2a',
        text: 'Expectation Damages',
        description: 'Based on what parties expected from contract',
        leadsTo: '5',
        probability: 0.7
      },
      {
        id: '2b',
        text: 'Reliance Damages',
        description: 'Based on costs incurred in reliance on contract',
        leadsTo: '6',
        probability: 0.3
      }
    ]
  },
  {
    id: '3',
    title: 'Specific Performance Analysis',
    description: 'Evaluate feasibility of court-ordered completion',
    type: 'evidence',
    parent: '1',
    position: { x: 600, y: 200 },
    evidence: {
      credibility: 0.6,
      relevance: 0.8,
      impact: 'Moderate - depends on technical feasibility'
    }
  },
  {
    id: '4',
    title: 'Settlement Strategy',
    description: 'Determine optimal settlement approach',
    type: 'decision',
    parent: '1',
    position: { x: 800, y: 200 },
    choices: [
      {
        id: '4a',
        text: 'Mediation',
        description: 'Use neutral third-party mediator',
        leadsTo: '7',
        probability: 0.8
      },
      {
        id: '4b',
        text: 'Arbitration',
        description: 'Binding decision from private arbitrator',
        leadsTo: '8',
        probability: 0.2
      }
    ]
  },
  {
    id: '5',
    title: 'Outcome: Expectation Damages Awarded',
    description: 'Court awards damages based on contract expectations',
    type: 'outcome',
    parent: '2',
    position: { x: 100, y: 350 },
    outcome: {
      result: 'Plaintiff awarded $150,000 in expectation damages',
      confidence: 0.75,
      reasoning: 'Based on market value of delivered software vs. contracted specifications',
      alternatives: [
        'Reduced award if mitigation not proven',
        'Increased if consequential damages established'
      ]
    }
  },
  {
    id: '6',
    title: 'Outcome: Reliance Damages Awarded',
    description: 'Court awards costs incurred in reliance on contract',
    type: 'outcome',
    parent: '2',
    position: { x: 300, y: 350 },
    outcome: {
      result: 'Plaintiff awarded $85,000 in reliance damages',
      confidence: 0.65,
      reasoning: 'Based on documented development costs and lost opportunities',
      alternatives: [
        'Higher if opportunity costs proven',
        'Lower if costs deemed unreasonable'
      ]
    }
  },
  {
    id: '7',
    title: 'Outcome: Successful Mediation',
    description: 'Parties reach mediated settlement agreement',
    type: 'outcome',
    parent: '4',
    position: { x: 700, y: 350 },
    outcome: {
      result: 'Settlement for $120,000 with modified delivery terms',
      confidence: 0.85,
      reasoning: 'Mediator facilitates compromise preserving business relationship',
      alternatives: [
        'Higher amount if plaintiff stronger position',
        'Lower if defendant has stronger counter-arguments'
      ]
    }
  },
  {
    id: '8',
    title: 'Outcome: Arbitration Decision',
    description: 'Arbitrator issues binding decision',
    type: 'outcome',
    parent: '4',
    position: { x: 900, y: 350 },
    outcome: {
      result: 'Arbitrator awards $110,000 with interest',
      confidence: 0.70,
      reasoning: 'Arbitrator favors compromise between positions',
      alternatives: [
        'Different arbitrator may reach different conclusion',
        'Appeal options limited'
      ]
    }
  }
]

export default function DecisionTreeEngine() {
  const [nodes, setNodes] = useState<DecisionNode[]>(mockDecisionTree)
  const [currentNode, setCurrentNode] = useState<string>('1')
  const [path, setPath] = useState<DecisionPath>({ nodes: ['1'], choices: {} })
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set(['1']))
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1000)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const currentNodeData = nodes.find(n => n.id === currentNode)

  const makeChoice = useCallback((choiceId: string) => {
    const choice = currentNodeData?.choices?.find(c => c.id === choiceId)
    if (!choice || !choice.leadsTo) return

    const nextNode = choice.leadsTo
    setCurrentNode(nextNode)
    
    setPath(prev => ({
      nodes: [...prev.nodes, nextNode],
      choices: { ...prev.choices, [currentNode]: choiceId }
    }))

    setVisitedNodes(prev => new Set([...prev, nextNode]))
  }, [currentNode, currentNodeData])

  const resetSimulation = () => {
    setCurrentNode('1')
    setPath({ nodes: ['1'], choices: {} })
    setVisitedNodes(new Set(['1']))
    setIsSimulating(false)
    setShowAnalysis(false)
  }

  const backtrack = () => {
    if (path.nodes.length <= 1) return

    const newPath = { ...path }
    newPath.nodes.pop()
    delete newPath.choices[currentNode]

    const previousNode = newPath.nodes[newPath.nodes.length - 1]
    setCurrentNode(previousNode)
    setPath(newPath)
  }

  const getNodeColor = (node: DecisionNode) => {
    if (node.id === currentNode) return '#3b82f6' // blue
    if (visitedNodes.has(node.id)) return '#10b981' // green
    return '#6b7280' // gray
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'decision': return <GitBranch className="w-4 h-4" />
      case 'outcome': return <CheckCircle className="w-4 h-4" />
      case 'evidence': return <AlertTriangle className="w-4 h-4" />
      default: return <Lightbulb className="w-4 h-4" />
    }
  }

  const calculatePathScore = () => {
    let score = 0
    let totalConfidence = 0
    let confidenceCount = 0

    path.nodes.forEach(nodeId => {
      const node = nodes.find(n => n.id === nodeId)
      if (node?.outcome) {
        score += node.outcome.confidence * 100
        totalConfidence += node.outcome.confidence
        confidenceCount++
      }
    })

    return confidenceCount > 0 ? Math.round(totalConfidence / confidenceCount * 100) : 0
  }

  const runAutoSimulation = async () => {
    setIsSimulating(true)
    let currentNodeId = '1'
    const simulationPath: DecisionPath = { nodes: ['1'], choices: {} }

    while (currentNodeId) {
      const node = nodes.find(n => n.id === currentNodeId)
      if (!node || node.type === 'outcome') break

      await new Promise(resolve => setTimeout(resolve, simulationSpeed))

      if (node.choices && node.choices.length > 0) {
        const randomChoice = node.choices[Math.floor(Math.random() * node.choices.length)]
        const nextNodeId = randomChoice.leadsTo

        simulationPath.nodes.push(nextNodeId)
        simulationPath.choices[currentNodeId] = randomChoice.id
        currentNodeId = nextNodeId

        setCurrentNode(currentNodeId)
        setPath({ ...simulationPath })
        setVisitedNodes(prev => new Set([...prev, currentNodeId]))
      } else {
        break
      }
    }

    setIsSimulating(false)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <GitBranch className="w-6 h-6" />
                Decision Tree Engine
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Explore different legal strategies and their potential outcomes
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={backtrack}
                disabled={path.nodes.length <= 1}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Backtrack
              </Button>
              <Button
                variant="outline"
                onClick={resetSimulation}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={() => setIsSimulating(!isSimulating)}
                disabled={isSimulating}
              >
                {isSimulating ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Auto Simulate
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{path.nodes.length}</div>
              <div className="text-sm text-gray-600">Steps Taken</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{visitedNodes.size}</div>
              <div className="text-sm text-gray-600">Nodes Visited</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{calculatePathScore()}%</div>
              <div className="text-sm text-gray-600">Path Confidence</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {nodes.filter(n => n.type === 'outcome').length}
              </div>
              <div className="text-sm text-gray-600">Total Outcomes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decision Tree Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Decision Tree</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 bg-gray-50 rounded-lg border overflow-hidden">
              <svg className="w-full h-full">
                {/* Draw connections */}
                {nodes.map(node => {
                  if (!node.parent) return null
                  const parentNode = nodes.find(n => n.id === node.parent)
                  if (!parentNode || !parentNode.position || !node.position) return null

                  return (
                    <line
                      key={`${node.parent}-${node.id}`}
                      x1={parentNode.position.x}
                      y1={parentNode.position.y}
                      x2={node.position.x}
                      y2={node.position.y}
                      stroke={visitedNodes.has(node.id) ? '#10b981' : '#d1d5db'}
                      strokeWidth="2"
                    />
                  )
                })}

                {/* Draw nodes */}
                {nodes.map(node => (
                  <g key={node.id}>
                    <circle
                      cx={node.position?.x || 0}
                      cy={node.position?.y || 0}
                      r="20"
                      fill={getNodeColor(node)}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer"
                      onClick={() => node.id !== currentNode && setCurrentNode(node.id)}
                    />
                    <text
                      x={node.position?.x || 0}
                      y={(node.position?.y || 0) + 35}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#374151"
                    >
                      {node.title.substring(0, 15)}...
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Current Node Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {currentNodeData && getNodeIcon(currentNodeData.type)}
              {currentNodeData?.title}
            </CardTitle>
            <Badge variant="outline" className="ml-2">
              {currentNodeData?.type}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Description:</h4>
              <p className="text-gray-700">{currentNodeData?.description}</p>
            </div>

            {currentNodeData?.type === 'decision' && currentNodeData.choices && (
              <div>
                <h4 className="font-semibold mb-3">Available Choices:</h4>
                <div className="space-y-3">
                  {currentNodeData.choices.map(choice => (
                    <div
                      key={choice.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => !isSimulating && makeChoice(choice.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-blue-600">{choice.text}</h5>
                        {choice.probability && (
                          <Badge variant="outline">
                            {Math.round(choice.probability * 100)}%
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{choice.description}</p>
                      
                      {choice.risks && choice.risks.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-red-600">Risks:</span>
                          <ul className="text-sm text-gray-600 ml-4">
                            {choice.risks.map((risk, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-red-500" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {choice.benefits && choice.benefits.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-green-600">Benefits:</span>
                          <ul className="text-sm text-gray-600 ml-4">
                            {choice.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        className="mt-3"
                        disabled={isSimulating}
                      >
                        Choose This Path
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentNodeData?.type === 'outcome' && currentNodeData.outcome && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Outcome:</h4>
                  <p className="text-green-700">{currentNodeData.outcome.result}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Confidence:</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={currentNodeData.outcome.confidence * 100} className="flex-1" />
                    <span className="text-sm font-medium">
                      {Math.round(currentNodeData.outcome.confidence * 100)}%
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Reasoning:</h4>
                  <p className="text-gray-700">{currentNodeData.outcome.reasoning}</p>
                </div>
                
                {currentNodeData.outcome.alternatives && (
                  <div>
                    <h4 className="font-semibold mb-2">Alternative Outcomes:</h4>
                    <ul className="space-y-1">
                      {currentNodeData.outcome.alternatives.map((alt, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          {alt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {currentNodeData?.type === 'evidence' && currentNodeData.evidence && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Evidence Analysis:</h4>
                  <p className="text-gray-700">{currentNodeData.evidence.impact}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Credibility:</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={currentNodeData.evidence.credibility * 100} className="flex-1" />
                      <span className="text-sm font-medium">
                        {Math.round(currentNodeData.evidence.credibility * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Relevance:</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={currentNodeData.evidence.relevance * 100} className="flex-1" />
                      <span className="text-sm font-medium">
                        {Math.round(currentNodeData.evidence.relevance * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Path Analysis */}
      {showAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Path Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Decision Path:</h4>
                <div className="flex flex-wrap gap-2">
                  {path.nodes.map((nodeId, index) => (
                    <div key={nodeId} className="flex items-center gap-1">
                      <Badge variant="outline">
                        {nodes.find(n => n.id === nodeId)?.title}
                      </Badge>
                      {index < path.nodes.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{path.nodes.length}</div>
                  <div className="text-sm text-gray-600">Total Steps</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{calculatePathScore()}%</div>
                  <div className="text-sm text-gray-600">Average Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {path.nodes.filter(nid => nodes.find(n => n.id === nid)?.type === 'outcome').length}
                  </div>
                  <div className="text-sm text-gray-600">Outcomes Reached</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
