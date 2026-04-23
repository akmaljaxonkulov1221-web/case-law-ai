'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  FileText,
  BarChart3,
  Clock,
  Volume2,
  Languages,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface VoiceRecording {
  id: string
  text: string
  duration: number
  timestamp: Date
  language: string
  confidence: number
}

interface CaseComparison {
  case1: {
    title: string
    content: string
    court: string
    date: string
  }
  case2: {
    title: string
    content: string
    court: string
    date: string
  }
  similarities: number
  differences: string[]
  precedentialValue: number
}

export default function VoiceAISystem() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recordings, setRecordings] = useState<VoiceRecording[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('uz')
  const [isProcessing, setIsProcessing] = useState(false)
  const [comparisonResult, setComparisonResult] = useState<CaseComparison | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const languages = [
    { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ]

  const mockRecordings: VoiceRecording[] = [
    {
      id: '1',
      text: 'Shartnoma shartlarini buzish holati to\'g\'risida Fuqarolik kodeksining 330-moddasiga muvofiq...',
      duration: 45,
      timestamp: new Date(Date.now() - 3600000),
      language: 'uz',
      confidence: 0.92
    },
    {
      id: '2',
      text: 'Sud qarori asosida da\'vogar tomonidan taqdim etilgan dalillar yetarli deb topildi...',
      duration: 32,
      timestamp: new Date(Date.now() - 7200000),
      language: 'uz',
      confidence: 0.89
    }
  ]

  const mockComparison: CaseComparison = {
    case1: {
      title: 'Shartnoma buzilishi ishi',
      content: 'Mijoz tomonidan to\'lov muddati buzilishi sababli da\'vo...',
      court: 'Toshkent shahar sudining fuqarolik ishlari bo\'limi',
      date: '2024-01-15'
    },
    case2: {
      title: 'Tovar etkazib berish shartnomasi',
      content: 'Yetkazib berilgan tovar sifati shartnomaga mos kelmadi...',
      court: 'Samarqand viloyat sudining fuqarolik ishlari bo\'limi',
      date: '2023-12-20'
    },
    similarities: 0.75,
    differences: [
      'Shartnoma turi har xil (xizmat vs tovar)',
      'Buzilish holati farq qiladi',
      'Sud instansiyasi har xil'
    ],
    precedentialValue: 0.82
  }

  useEffect(() => {
    setRecordings(mockRecordings)
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        await processAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)
    } catch (error) {
      console.error('Microphone access denied:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    
    // Simulate AI processing
    setTimeout(() => {
      const newRecording: VoiceRecording = {
        id: Date.now().toString(),
        text: 'Bu yozib olingan matn AI tomonidan avtomatik transkripsiya qilindi...',
        duration: Math.floor(Math.random() * 60) + 20,
        timestamp: new Date(),
        language: selectedLanguage,
        confidence: Math.random() * 0.2 + 0.8
      }
      
      setRecordings(prev => [newRecording, ...prev])
      setTranscript(newRecording.text)
      setIsProcessing(false)
    }, 2000)
  }

  const compareCases = () => {
    setComparisonResult(mockComparison)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.8) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Voice AI System */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-blue-600" />
            Voice AI System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Controls */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                className={`${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? 'To\'xtatish' : 'Yozib olish'}
              </Button>
              
              {isRecording && (
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                  className="border-gray-300"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  {isPaused ? 'Davom ettirish' : 'Pauza'}
                </Button>
              )}
              
              <Button variant="outline" className="border-gray-300">
                <RotateCcw className="w-4 h-4" />
                Qayta boshlash
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              {isRecording && <span className="text-sm text-gray-600">Yozib olinmoqda...</span>}
            </div>
          </div>

          {/* Language Selection */}
          <div className="flex items-center gap-4">
            <Languages className="w-4 h-4 text-gray-500" />
            <div className="flex gap-2">
              {languages.map(lang => (
                <Button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  variant={selectedLanguage === lang.code ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs"
                >
                  {lang.flag} {lang.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Transcript */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Transkripsiya</h3>
              {transcript && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {isProcessing ? (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">AI matnni qayta ishlayapti...</p>
              </div>
            ) : (
              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Ovoz yozuvi bu yerga ko'rinadi..."
                className="min-h-[120px]"
              />
            )}
          </div>

          {/* Recent Recordings */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">So'nggi yozuvlar</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {recordings.map(recording => (
                <div key={recording.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 line-clamp-2">{recording.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{formatDuration(recording.duration)}</span>
                      <span className={`text-xs ${getConfidenceColor(recording.confidence)}`}>
                        {Math.round(recording.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Case Comparator */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Case Comparator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Case Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Case 1</h4>
              <Textarea
                placeholder="Birinchi ish matnini kiriting..."
                className="min-h-[100px] text-sm"
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Case 2</h4>
              <Textarea
                placeholder="Ikkinchi ish matnini kiriting..."
                className="min-h-[100px] text-sm"
              />
            </div>
          </div>

          <Button onClick={compareCases} className="w-full">
            <BarChart3 className="w-4 h-4 mr-2" />
            Ishlarni solishtirish
          </Button>

          {/* Comparison Results */}
          {comparisonResult && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900">O'xshashlik darajasi</h4>
                  <Badge className="bg-blue-100 text-blue-700">
                    {Math.round(comparisonResult.similarities * 100)}%
                  </Badge>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${comparisonResult.similarities * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Farqlar</h4>
                <div className="space-y-2">
                  {comparisonResult.differences.map((diff, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700">{diff}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-900">Pretsedent qiymati</h4>
                  <Badge className="bg-green-100 text-green-700">
                    {Math.round(comparisonResult.precedentialValue * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-green-800">
                  Bu ish kelajudagi sud jarayonlari uchun yuqori prezident qiymatiga ega.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
