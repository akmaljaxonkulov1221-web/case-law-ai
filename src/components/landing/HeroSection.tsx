'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Scale,
  Brain,
  GitBranch,
  BookOpen,
  Users,
  Trophy,
  Play,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Target,
  Shield,
  BarChart3,
  FileText,
  Award,
  TrendingUp
} from 'lucide-react'

export default function HeroSection() {
  const [activeDemo, setActiveDemo] = useState('case-solver')

  const features = [
    {
      icon: Scale,
      title: 'AI Case Analysis',
      description: 'Advanced legal reasoning with step-by-step analysis',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Brain,
      title: 'Interactive Learning',
      description: 'Practice with real legal scenarios and cases',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: GitBranch,
      title: 'Decision Trees',
      description: 'Explore different legal strategies and outcomes',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Library',
      description: 'Access thousands of legal cases and materials',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const stats = [
    { label: 'Active Students', value: '10,000+', icon: Users },
    { label: 'Legal Cases', value: '5,000+', icon: FileText },
    { label: 'Success Rate', value: '94%', icon: TrendingUp },
    { label: 'Expert Tutors', value: '50+', icon: Award }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Law Student',
      content: 'Case-Law AI transformed my legal studies. The AI case analysis helped me understand complex legal concepts.',
      rating: 5,
      avatar: 'SC'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Legal Professional',
      content: 'The decision tree engine is incredible. It helps me explore different legal strategies systematically.',
      rating: 5,
      avatar: 'MR'
    },
    {
      name: 'Emma Thompson',
      role: 'Law Professor',
      content: 'This platform is revolutionizing legal education. My students love the interactive case simulations.',
      rating: 5,
      avatar: 'ET'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Case-Law AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="w-fit bg-blue-500/20 text-blue-300 border-blue-500/30">
                🚀 Trusted by 10,000+ Law Students
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Master Legal Thinking with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  AI-Powered Education
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Transform your legal education with interactive case analysis, AI-powered reasoning, and personalized learning paths. Think like a lawyer, not just memorize laws.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-gray-300 ml-2">4.9/5 Rating</span>
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">10,000+</span> Active Users
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-3xl opacity-20"></div>
              <Card className="relative bg-slate-800/80 backdrop-blur-md border-white/10 rounded-2xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">AI Case Analysis</h3>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Live Demo
                    </Badge>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 text-sm">Analyzing contract breach case...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Legal Issue Identification</span>
                        <span className="text-green-400">✓ Complete</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Rule Application</span>
                        <span className="text-blue-400">Processing...</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Conclusion</span>
                        <span className="text-gray-500">Pending</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      <Brain className="w-4 h-4 mr-1" />
                      View Analysis
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <GitBranch className="w-4 h-4 mr-1" />
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
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Excel in Law
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and resources you need to master legal thinking and reasoning.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-slate-800/80 backdrop-blur-md border-white/10 hover:border-white/20 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by Law Students & Professionals
            </h2>
            <p className="text-xl text-gray-300">
              See what our users have to say about their experience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/80 backdrop-blur-md border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 p-12">
            <CardContent className="space-y-6">
              <h2 className="text-4xl font-bold text-white">
                Ready to Transform Your Legal Education?
              </h2>
              <p className="text-xl text-blue-100">
                Join thousands of law students and professionals who are already mastering legal thinking with Case-Law AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
                  <Shield className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
              </div>
              <div className="flex items-center justify-center gap-8 text-blue-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
