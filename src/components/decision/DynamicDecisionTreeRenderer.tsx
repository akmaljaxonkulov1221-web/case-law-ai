'use client'

import React, { useState, useEffect, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Position,
  Handle,
  NodeProps,
  EdgeProps,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { scenarioAPI, handleAPIError } from '@/lib/api-service'
import { ScenarioGeneration } from '@/lib/api-service'
import {
  GitBranch,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  Zap,
  RefreshCw,
  Play,
  Save,
  Eye,
  ArrowRight,
  Info,
  Shield,
  AlertCircle
} from 'lucide-react'

// Custom Node Types
interface DecisionNodeData {
  label: string
  description: string
  nodeType: string
  scenarios?: Array<{
    option_letter: string
    title: string
    description: string
    probability: number
    potential_outcome: string
    reasoning: string
    risk_level: string
    legal_implications: string[]
  }>
  loading?: boolean
}

// Custom Node Component
const DecisionNode: React.FC<NodeProps<DecisionNodeData>> = ({ data, selected }) => {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  const getNodeColor = (nodeType: string) => {
    switch (nodeType) {
      case 'start': return 'bg-green-500'
      case 'decision': return 'bg-blue-500'
      case 'action': return 'bg-orange-500'
      case 'outcome': return 'bg-purple-500'
      case 'info': return 'bg-gray-500'
      default: return 'bg-blue-500'
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'high': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.7) return 'text-green-600'
    if (probability >= 0.4) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`relative bg-white border-2 rounded-lg shadow-lg ${selected ? 'border-blue-500' : 'border-gray-200'} min-w-[280px] max-w-[400px]`}>
      {/* Node Header */}
      <div className={`${getNodeColor(data.nodeType)} p-3 rounded-t-lg`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            {data.nodeType === 'start' && <CheckCircle className="w-4 h-4" />}
            {data.nodeType === 'decision' && <Target className="w-4 h-4" />}
            {data.nodeType === 'action' && <Zap className="w-4 h-4" />}
            {data.nodeType === 'outcome' && <AlertCircle className="w-4 h-4" />}
            {data.nodeType === 'info' && <Info className="w-4 h-4" />}
            <span className="font-semibold">{data.label}</span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <ArrowRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Node Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-3">{data.description}</p>
        
        {/* Scenarios */}
        {data.scenarios && expanded && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 mb-2">SCENARIOS</div>
            {data.scenarios.map((scenario, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                      {scenario.option_letter}
                    </div>
                    <span className="font-medium text-gray-900">{scenario.title}</span>
                  </div>
                  <Badge className={getRiskColor(scenario.risk_level)}>
                    {scenario.risk_level}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">{scenario.description}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${getProbabilityColor(scenario.probability)}`}>
                    {scenario.probability.toFixed(2)} probability
                  </span>
                  <span className="text-xs text-gray-500">
                    {scenario.potential_outcome}
                  </span>
                </div>
                
                {scenario.legal_implications.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Legal:</span> {scenario.legal_implications.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Loading State */}
        {data.loading && (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Generating scenarios...</span>
          </div>
        )}
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  )
}

// Custom Edge Component
const DecisionEdge: React.FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY, data }) => {
  const edgePath = `M${sourceX},${sourceY} C${sourceX + 100},${sourceY} ${targetX - 100},${targetY} ${targetX},${targetY}`
  
  return (
    <g>
      <path
        id={id}
        style={{
          fill: 'none',
          stroke: '#6b7280',
          strokeWidth: 2,
        }}
        d={edgePath}
      />
      <circle>
        <animate
          attributeName="r"
          from="0"
          to="0"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  )
}

// Node types
const nodeTypes = {
  decisionNode: DecisionNode,
}

const edgeTypes = {
  decision: DecisionEdge,
}

interface DynamicDecisionTreeRendererProps {
  initialNodeId?: number
  onScenarioSelect?: (scenario: any) => void
}

export default function DynamicDecisionTreeRenderer({ 
  initialNodeId = 1, 
  onScenarioSelect 
}: DynamicDecisionTreeRendererProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [currentNodeId, setCurrentNodeId] = useState(initialNodeId)

  // Initialize with root node
  useEffect(() => {
    initializeTree()
  }, [])

  const initializeTree = async () => {
    try {
      setLoading(true)
      
      // Get node info
      const nodeInfo = await scenarioAPI.getNodeInfo(currentNodeId)
      
      // Create initial node
      const initialNode: Node = {
        id: `node-${currentNodeId}`,
        type: 'decisionNode',
        position: { x: 400, y: 50 },
        data: {
          label: nodeInfo.title,
          description: nodeInfo.description,
          nodeType: nodeInfo.node_type,
          loading: false
        }
      }
      
      setNodes([initialNode])
      setError(null)
      
    } catch (err) {
      const errorInfo = handleAPIError(err)
      setError(errorInfo.message)
    } finally {
      setLoading(false)
    }
  }

  // Generate scenarios for a node
  const generateScenarios = useCallback(async (nodeId: string) => {
    try {
      setLoading(true)
      
      // Extract node ID from string
      const actualNodeId = parseInt(nodeId.replace('node-', ''))
      
      // Generate scenarios
      const result = await scenarioAPI.generateScenarios(actualNodeId)
      
      if (result.success && result.generation) {
        // Update node with scenarios
        setNodes(prevNodes => 
          prevNodes.map(node => 
            node.id === nodeId 
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    scenarios: result.generation.scenarios,
                    loading: false
                  }
                }
              : node
          )
        )
        
        // Create child nodes for each scenario
        const newNodes: Node[] = []
        const newEdges: Edge[] = []
        
        result.generation.scenarios.forEach((scenario, index) => {
          const childNodeId = `node-${actualNodeId}-${scenario.option_letter}`
          const yOffset = 200 + (index * 150)
          const xOffset = 200 + (index * 150)
          
          // Create child node
          const childNode: Node = {
            id: childNodeId,
            type: 'decisionNode',
            position: { x: xOffset, y: yOffset },
            data: {
              label: scenario.title,
              description: scenario.description,
              nodeType: 'outcome',
              scenarios: [],
              loading: false
            }
          }
          
          // Create edge
          const edge: Edge = {
            id: `edge-${nodeId}-${childNodeId}`,
            source: nodeId,
            target: childNodeId,
            type: 'smoothstep',
            data: {
              label: `${scenario.option_letter}: ${scenario.probability.toFixed(2)}`,
              probability: scenario.probability
            }
          }
          
          newNodes.push(childNode)
          newEdges.push(edge)
        })
        
        setNodes(prevNodes => [...prevNodes, ...newNodes])
        setEdges(prevEdges => [...prevEdges, ...newEdges])
        
        // Call callback if provided
        if (onScenarioSelect) {
          onScenarioSelect(result.generation)
        }
        
      } else {
        setError(result.message || 'Failed to generate scenarios')
      }
      
    } catch (err) {
      const errorInfo = handleAPIError(err)
      setError(errorInfo.message)
    } finally {
      setLoading(false)
    }
  }, [onScenarioSelect])

  // Handle node click
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id)
    
    // Generate scenarios if node doesn't have them yet
    if (!node.data.scenarios || node.data.scenarios.length === 0) {
      generateScenarios(node.id)
    }
  }, [generateScenarios])

  // Handle new connection
  const onConnect = useCallback(
    (params: Connection) => addEdge(params, setEdges),
    [setEdges]
  )

  // Reset tree
  const resetTree = () => {
    setNodes([])
    setEdges([])
    setSelectedNode(null)
    setCurrentNodeId(initialNodeId)
    initializeTree()
  }

  // Save scenario
  const saveScenario = useCallback(async (scenario: any) => {
    try {
      const result = await scenarioAPI.saveScenario({
        node_id: currentNodeId,
        option_letter: scenario.option_letter,
        title: scenario.title,
        description: scenario.description,
        probability: scenario.probability,
        potential_outcome: scenario.potential_outcome,
        reasoning: scenario.reasoning,
        risk_level: scenario.risk_level,
        legal_implications: scenario.legal_implications
      })
      
      if (result.success) {
        // Show success message
        console.log('Scenario saved successfully')
      } else {
        setError(result.message)
      }
    } catch (err) {
      const errorInfo = handleAPIError(err)
      setError(errorInfo.message)
    }
  }, [currentNodeId])

  if (loading && nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading decision tree...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200 rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
            <button 
              onClick={resetTree}
              className="ml-auto px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dynamic Decision Tree</h2>
          <p className="text-gray-600">Click on nodes to generate scenarios and explore decision paths</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-700">
            AI Powered
          </Badge>
          <Badge className="bg-green-100 text-green-700">
            Interactive
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button onClick={resetTree} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset Tree
        </Button>
        <Button onClick={() => generateScenarios(`node-${currentNodeId}`)} disabled={loading}>
          <Play className="w-4 h-4 mr-2" />
          Generate Scenarios
        </Button>
        <Button onClick={() => saveScenario({})} variant="outline">
          <Save className="w-4 h-4 mr-2" />
          Save Scenario
        </Button>
      </div>

      {/* Decision Tree */}
      <div className="h-[600px] bg-gray-50 rounded-xl border border-gray-200">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap 
            nodeStrokeColor="#6b7280"
            nodeColor={(node) => {
              const nodeData = node.data as DecisionNodeData
              return nodeData.nodeType === 'start' ? '#10b981' : '#3b82f6'
            }}
            maskColor="rgb(251, 191, 36)"
          />
          <Background color="#f9fafb" gap={16} />
        </ReactFlow>
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Selected Node
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nodes.find(node => node.id === selectedNode) && (
              <div className="space-y-2">
                <p className="font-medium">{nodes.find(node => node.id === selectedNode)?.data.label}</p>
                <p className="text-sm text-gray-600">{nodes.find(node => node.id === selectedNode)?.data.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => generateScenarios(selectedNode)} disabled={loading}>
                    Generate Scenarios
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedNode(null)}>
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200 rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">How to Use</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Click on any node to generate AI-powered scenarios</li>
                <li>• Each scenario shows probability, risk level, and legal implications</li>
                <li>• Scenarios are generated in real-time using advanced AI</li>
                <li>• You can save scenarios for later reference</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
