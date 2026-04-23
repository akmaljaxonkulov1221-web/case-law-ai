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
  Target,
  GitBranch,
  BookOpen,
  Trophy,
  TrendingUp,
  CheckCircle,
  Shield,
  Zap,
  Award,
  MessageSquare,
  Activity,
  Scale
} from 'lucide-react'

export default function CompleteReferenceLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced legal reasoning with step-by-step case analysis',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Target,
      title: 'Interactive Learning',
      description: 'Practice with real legal scenarios and get instant feedback',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: GitBranch,
      title: 'Decision Trees',
      description: 'Explore different legal strategies and possible outcomes',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Library',
      description: 'Access thousands of legal cases and study materials',
      gradient: 'from-orange-500 to-orange-600'
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
      content: 'Case-Law AI transformed how I study. The AI analysis helps me understand complex cases much better.',
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

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel in Law
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and resources you need to master legal thinking and reasoning.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 group hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Law Students & Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their experience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Legal Education?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of law students and professionals who are already mastering legal thinking with Case-Law AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                <Zap className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg">
                <Shield className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xl font-bold">Case-Law AI</span>
              </div>
              <p className="text-gray-400">
                Transforming legal education with AI-powered learning tools.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Case-Law AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
