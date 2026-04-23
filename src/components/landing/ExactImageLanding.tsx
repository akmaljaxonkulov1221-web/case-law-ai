'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowRight,
  Play,
  Star,
  Users,
  FileText,
  BarChart3,
  Brain,
  Menu,
  X,
  Scale
} from 'lucide-react'

export default function ExactImageLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const stats = [
    { label: 'Active Students', value: '10,000+', icon: Users },
    { label: 'Legal Cases', value: '5,000+', icon: FileText },
    { label: 'Success Rate', value: '94%', icon: BarChart3 },
    { label: 'Expert Tutors', value: '50+', icon: Brain }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Blue Header */}
      <nav className="fixed top-0 w-full bg-blue-600 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-white">Case-Law AI</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white hover:text-blue-100 transition-colors">Features</a>
              <a href="#pricing" className="text-white hover:text-blue-100 transition-colors">Pricing</a>
              <a href="#about" className="text-white hover:text-blue-100 transition-colors">About</a>
              <a href="#contact" className="text-white hover:text-blue-100 transition-colors">Contact</a>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:bg-blue-700">
                Sign In
              </Button>
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-700">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-white hover:text-blue-100 transition-colors">Features</a>
                <a href="#pricing" className="text-white hover:text-blue-100 transition-colors">Pricing</a>
                <a href="#about" className="text-white hover:text-blue-100 transition-colors">About</a>
                <a href="#contact" className="text-white hover:text-blue-100 transition-colors">Contact</a>
                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" className="text-white hover:bg-blue-700">
                    Sign In
                  </Button>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="w-fit bg-blue-100 text-blue-700 border-blue-200">
                🚀 Trusted by 10,000+ Law Students
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Master Legal Thinking with
                <span className="block text-blue-600">
                  AI-Powered Education
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform your legal education with interactive case analysis, AI-powered reasoning, and personalized learning paths. Think like a lawyer, not just memorize laws.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-gray-600 ml-2">4.9/5 Rating</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold">10,000+</span> Active Users
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-2xl blur-3xl opacity-30"></div>
              <Card className="relative bg-white border-gray-200 rounded-2xl p-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-900 font-semibold">AI Case Analysis</h3>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Live Demo
                    </Badge>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-600 text-sm">Analyzing contract breach case...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Legal Issue Identification</span>
                        <span className="text-green-600">✓ Complete</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rule Application</span>
                        <span className="text-blue-600">Processing...</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Conclusion</span>
                        <span className="text-gray-400">Pending</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Brain className="w-4 h-4 mr-1" />
                      View Analysis
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Explore Paths
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Law Students Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of students who are already mastering legal thinking
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
