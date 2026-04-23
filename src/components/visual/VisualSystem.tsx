'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  GitBranch,
  ArrowRight,
  Circle,
  Square,
  Triangle,
  Diamond,
  Clock,
  Users,
  FileText,
  Scale,
  Gavel,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Eye,
  Download,
  Share2,
  Settings,
  Maximize2,
  Minimize2,
  RefreshCw,
  Save,
  Layers,
  Target,
  Brain,
  Lightbulb,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react'

interface DiagramNode {
  id: string
  label: string
  type: 'START' | 'PROCESS' | 'DECISION' | 'END' | 'DATA'
  x: number
  y: number
  connections: string[]
  color: string
  description?: string
}

interface FlowchartStep {
  id: string
  title: string
  description: string
  type: 'ACTION' | 'DECISION' | 'OUTCOME'
  nextSteps: string[]
  conditions?: string[]
  icon: React.ReactNode
}

interface TimelineEvent {
  id: string
  title: string
  date: string
  description: string
  type: 'FILING' | 'HEARING' | 'MOTION' | 'DECISION' | 'APPEAL'
  status: 'COMPLETED' | 'PENDING' | 'UPCOMING'
  participants: string[]
  documents: string[]
}

interface HeatmapData {
  topic: string
  difficulty: number
  frequency: number
  mastery: number
  color: string
}

export default function VisualSystem() {
  const [activeView, setActiveView] = useState<'diagram' | 'flowchart' | 'timeline' | 'heatmap' | 'infographic'>('diagram')
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const diagramNodes: DiagramNode[] = [
    {
      id: '1',
      label: 'Case Intake',
      type: 'START',
      x: 100,
      y: 100,
      connections: ['2'],
      color: '#10b981',
      description: 'Initial case assessment and documentation'
    },
    {
      id: '2',
      label: 'Legal Research',
      type: 'PROCESS',
      x: 250,
      y: 100,
      connections: ['3', '4'],
      color: '#3b82f6',
      description: 'Research relevant laws and precedents'
    },
    {
      id: '3',
      label: 'Evidence Collection',
      type: 'PROCESS',
      x: 400,
      y: 50,
      connections: ['5'],
      color: '#3b82f6',
      description: 'Gather and organize evidence'
    },
    {
      id: '4',
      label: 'Client Interview',
      type: 'PROCESS',
      x: 400,
      y: 150,
      connections: ['5'],
      color: '#3b82f6',
      description: 'Conduct thorough client interviews'
    },
    {
      id: '5',
      label: 'Case Strategy',
      type: 'DECISION',
      x: 550,
      y: 100,
      connections: ['6', '7'],
      color: '#f59e0b',
      description: 'Determine optimal legal strategy'
    },
    {
      id: '6',
      label: 'Settlement Negotiation',
      type: 'PROCESS',
      x: 700,
      y: 50,
      connections: ['8'],
      color: '#3b82f6',
      description: 'Attempt settlement negotiations'
    },
    {
      id: '7',
      label: 'Trial Preparation',
      type: 'PROCESS',
      x: 700,
      y: 150,
      connections: ['8'],
      color: '#3b82f6',
      description: 'Prepare for trial proceedings'
    },
    {
      id: '8',
      label: 'Resolution',
      type: 'END',
      x: 850,
      y: 100,
      connections: [],
      color: '#ef4444',
      description: 'Case resolution and closure'
    }
  ]

  const flowchartSteps: FlowchartStep[] = [
    {
      id: '1',
      title: 'Identify Legal Issue',
      description: 'Determine the central legal question',
      type: 'ACTION',
      nextSteps: ['2'],
      icon: <Target className="w-5 h-5" />
    },
    {
      id: '2',
      title: 'Research Applicable Law',
      description: 'Find relevant statutes and precedents',
      type: 'ACTION',
      nextSteps: ['3'],
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: '3',
      title: 'Apply Facts to Law',
      description: 'Analyze how facts relate to legal principles',
      type: 'DECISION',
      nextSteps: ['4', '5'],
      conditions: ['Strong case', 'Weak case'],
      icon: <Brain className="w-5 h-5" />
    },
    {
      id: '4',
      title: 'Proceed to Trial',
      description: 'Move forward with litigation',
      type: 'ACTION',
      nextSteps: ['6'],
      icon: <Gavel className="w-5 h-5" />
    },
    {
      id: '5',
      title: 'Seek Settlement',
      description: 'Negotiate settlement terms',
      type: 'ACTION',
      nextSteps: ['6'],
      icon: <Users className="w-5 h-5" />
    },
    {
      id: '6',
      title: 'Case Resolution',
      description: 'Final resolution achieved',
      type: 'OUTCOME',
      nextSteps: [],
      icon: <CheckCircle className="w-5 h-5" />
    }
  ]

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'Complaint Filed',
      date: '2024-01-15',
      description: 'Initial complaint filed with district court',
      type: 'FILING',
      status: 'COMPLETED',
      participants: ['Plaintiff', 'Attorney'],
      documents: ['Complaint', 'Summons']
    },
    {
      id: '2',
      title: 'Defendant Response',
      date: '2024-02-01',
      description: 'Defendant files answer and counterclaims',
      type: 'FILING',
      status: 'COMPLETED',
      participants: ['Defendant', 'Attorney'],
      documents: ['Answer', 'Counterclaim']
    },
    {
      id: '3',
      title: 'Discovery Phase',
      date: '2024-02-15',
      description: 'Exchange of evidence and depositions',
      type: 'MOTION',
      status: 'COMPLETED',
      participants: ['Both Parties', 'Attorneys'],
      documents: ['Depositions', 'Interrogatories']
    },
    {
      id: '4',
      title: 'Pre-Trial Hearing',
      date: '2024-03-20',
      description: 'Motions heard and trial date set',
      type: 'HEARING',
      status: 'PENDING',
      participants: ['Judge', 'Attorneys'],
      documents: ['Motion Briefs', 'Orders']
    },
    {
      id: '5',
      title: 'Trial',
      date: '2024-04-15',
      description: 'Jury trial scheduled',
      type: 'DECISION',
      status: 'UPCOMING',
      participants: ['Judge', 'Jury', 'Attorneys', 'Parties'],
      documents: ['Trial Briefs', 'Exhibits']
    }
  ]

  const heatmapData: HeatmapData[] = [
    { topic: 'Contract Law', difficulty: 3, frequency: 8, mastery: 75, color: '#10b981' },
    { topic: 'Tort Law', difficulty: 4, frequency: 6, mastery: 60, color: '#f59e0b' },
    { topic: 'Criminal Law', difficulty: 5, frequency: 4, mastery: 45, color: '#ef4444' },
    { topic: 'Property Law', difficulty: 3, frequency: 5, mastery: 80, color: '#10b981' },
    { topic: 'Family Law', difficulty: 2, frequency: 7, mastery: 85, color: '#10b981' },
    { topic: 'Corporate Law', difficulty: 5, frequency: 3, mastery: 40, color: '#ef4444' }
  ]

  useEffect(() => {
    if (canvasRef.current && activeView === 'diagram') {
      drawDiagram()
    }
  }, [activeView, zoomLevel, selectedNode])

  const drawDiagram = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Apply zoom
    ctx.scale(zoomLevel, zoomLevel)
    
    // Draw connections
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 2
    diagramNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = diagramNodes.find(n => n.id === connectionId)
        if (targetNode) {
          ctx.beginPath()
          ctx.moveTo(node.x + 40, node.y + 20)
          ctx.lineTo(targetNode.x + 40, targetNode.y + 20)
          ctx.stroke()
          
          // Draw arrow
          const angle = Math.atan2(targetNode.y - node.y, targetNode.x - node.x)
          ctx.save()
          ctx.translate(targetNode.x + 40, targetNode.y + 20)
          ctx.rotate(angle)
          ctx.beginPath()
          ctx.moveTo(-10, -5)
          ctx.lineTo(0, 0)
          ctx.lineTo(-10, 5)
          ctx.stroke()
          ctx.restore()
        }
      })
    })
    
    // Draw nodes
    diagramNodes.forEach(node => {
      ctx.fillStyle = node.color
      ctx.strokeStyle = selectedNode === node.id ? '#1f2937' : node.color
      ctx.lineWidth = selectedNode === node.id ? 3 : 2
      
      // Draw shape based on type
      switch (node.type) {
        case 'START':
        case 'END':
          ctx.beginPath()
          ctx.arc(node.x + 40, node.y + 20, 30, 0, 2 * Math.PI)
          ctx.fill()
          ctx.stroke()
          break
        case 'DECISION':
          ctx.beginPath()
          ctx.moveTo(node.x + 40, node.y)
          ctx.lineTo(node.x + 80, node.y + 20)
          ctx.lineTo(node.x + 40, node.y + 40)
          ctx.lineTo(node.x, node.y + 20)
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
          break
        default:
          ctx.fillRect(node.x, node.y, 80, 40)
          ctx.strokeRect(node.x, node.y, 80, 40)
      }
      
      // Draw label
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(node.label, node.x + 40, node.y + 25)
    })
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'START': return <Circle className="w-4 h-4" />
      case 'PROCESS': return <Square className="w-4 h-4" />
      case 'DECISION': return <Diamond className="w-4 h-4" />
      case 'END': return <Circle className="w-4 h-4" />
      default: return <Circle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'UPCOMING': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FILING': return <FileText className="w-4 h-4" />
      case 'HEARING': return <Users className="w-4 h-4" />
      case 'MOTION': return <GitBranch className="w-4 h-4" />
      case 'DECISION': return <Gavel className="w-4 h-4" />
      case 'APPEAL': return <ArrowRight className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Visual System</h1>
          <p className="text-xl text-gray-600">Interactive diagrams, flowcharts, and visual legal analysis tools</p>
        </div>

        {/* View Selection */}
        <div className="flex flex-wrap gap-4 mb-6">
          {[
            { id: 'diagram', label: 'Case Diagram', icon: GitBranch },
            { id: 'flowchart', label: 'Legal Flowchart', icon: ArrowRight },
            { id: 'timeline', label: 'Case Timeline', icon: Clock },
            { id: 'heatmap', label: 'Topic Heatmap', icon: Activity },
            { id: 'infographic', label: 'Infographics', icon: BarChart3 }
          ].map((view) => (
            <Button
              key={view.id}
              variant={activeView === view.id ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() => setActiveView(view.id as any)}
            >
              <view.icon className="w-4 h-4" />
              {view.label}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">{Math.round(zoomLevel * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(1)}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Visual Display */}
          <div className="lg:col-span-2">
            {activeView === 'diagram' && (
              <Card>
                <CardHeader>
                  <CardTitle>Case Structure Diagram</CardTitle>
                </CardHeader>
                <CardContent>
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    className="border border-gray-200 rounded-lg w-full"
                  />
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Start/End</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Process</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Diamond className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Decision</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-400" />
                      <span className="text-sm">Connection</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeView === 'flowchart' && (
              <Card>
                <CardHeader>
                  <CardTitle>Legal Decision Flowchart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flowchartSteps.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            step.type === 'ACTION' ? 'bg-blue-100' :
                            step.type === 'DECISION' ? 'bg-yellow-100' :
                            'bg-green-100'
                          }`}>
                            {step.icon}
                          </div>
                          {index < flowchartSteps.length - 1 && (
                            <ArrowRight className="w-6 h-6 text-gray-400 mt-2" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{step.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                          {step.conditions && (
                            <div className="flex gap-2">
                              {step.conditions.map((condition, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeView === 'timeline' && (
              <Card>
                <CardHeader>
                  <CardTitle>Case Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timelineEvents.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            event.status === 'COMPLETED' ? 'bg-green-100' :
                            event.status === 'PENDING' ? 'bg-yellow-100' :
                            'bg-blue-100'
                          }`}>
                            {getTypeIcon(event.type)}
                          </div>
                          {index < timelineEvents.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{event.title}</h3>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(event.status)}>
                                {event.status}
                              </Badge>
                              <span className="text-sm text-gray-500">{event.date}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {event.participants.map((participant, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {participant}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {event.documents.map((doc, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                <FileText className="w-3 h-3 mr-1" />
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeView === 'heatmap' && (
              <Card>
                <CardHeader>
                  <CardTitle>Topic Difficulty Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {heatmapData.map((topic, index) => (
                      <div key={index} className="p-4 rounded-lg border" style={{ backgroundColor: `${topic.color}20` }}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{topic.topic}</h3>
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: topic.color }} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Difficulty:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full mr-1 ${
                                    i < topic.difficulty ? topic.color : '#e5e7eb'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Frequency:</span>
                            <span>{topic.frequency}/10</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Mastery:</span>
                            <span>{topic.mastery}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeView === 'infographic' && (
              <Card>
                <CardHeader>
                  <CardTitle>Legal Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4">
                        <PieChart className="w-full h-full text-blue-500" />
                      </div>
                      <h3 className="font-semibold">Case Distribution</h3>
                      <p className="text-sm text-gray-600">By legal category</p>
                    </div>
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4">
                        <BarChart3 className="w-full h-full text-green-500" />
                      </div>
                      <h3 className="font-semibold">Success Rate</h3>
                      <p className="text-sm text-gray-600">By case type</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Node Details */}
            {selectedNode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Node Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const node = diagramNodes.find(n => n.id === selectedNode)
                    return node ? (
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold">{node.label}</h3>
                          <p className="text-sm text-gray-600">{node.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getNodeIcon(node.type)}
                          <span className="text-sm">{node.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: node.color }} />
                          <span className="text-sm">Color Code</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Connections: </span>
                          <span className="text-sm">{node.connections.join(', ')}</span>
                        </div>
                      </div>
                    ) : null
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Start Point</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Process Step</span>
                </div>
                <div className="flex items-center gap-2">
                  <Diamond className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Decision Point</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-red-500" />
                  <span className="text-sm">End Point</span>
                </div>
              </CardContent>
            </Card>

            {/* Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Save className="w-4 h-4 mr-2" />
                  Save Diagram
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
