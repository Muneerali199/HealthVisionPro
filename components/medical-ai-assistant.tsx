"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  MessageSquare, 
  Search, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Pill,
  Activity,
  Heart,
  Send,
  Mic,
  Image,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { MedicalAI } from '@/lib/medical-database';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    sources?: string[];
    recommendations?: string[];
  };
}

export function MedicalAIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI Medical Assistant. I can help you with symptom analysis, medication information, health education, and general medical questions. How can I assist you today?',
      timestamp: new Date(),
      metadata: {
        confidence: 100
      }
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string): ChatMessage => {
    const lowerInput = userInput.toLowerCase();
    
    let response = '';
    let confidence = 85;
    let sources: string[] = [];
    let recommendations: string[] = [];

    if (lowerInput.includes('headache') || lowerInput.includes('pain')) {
      response = 'I understand you\'re experiencing headaches. Headaches can have various causes including tension, dehydration, stress, or underlying medical conditions. Common types include tension headaches, migraines, and cluster headaches.';
      recommendations = [
        'Stay hydrated by drinking plenty of water',
        'Get adequate rest and maintain regular sleep schedule',
        'Manage stress through relaxation techniques',
        'Consider over-the-counter pain relievers if appropriate',
        'Consult a healthcare provider if headaches persist or worsen'
      ];
      sources = ['Mayo Clinic Headache Guidelines', 'American Headache Society'];
    } else if (lowerInput.includes('fever') || lowerInput.includes('temperature')) {
      response = 'Fever is your body\'s natural response to infection or illness. A normal body temperature is around 98.6°F (37°C). Fever is generally considered 100.4°F (38°C) or higher.';
      recommendations = [
        'Rest and stay hydrated',
        'Monitor temperature regularly',
        'Use fever-reducing medications if needed',
        'Seek medical attention if fever exceeds 103°F (39.4°C)',
        'Contact healthcare provider if fever persists more than 3 days'
      ];
      sources = ['CDC Fever Guidelines', 'WHO Temperature Monitoring'];
    } else if (lowerInput.includes('medication') || lowerInput.includes('drug')) {
      response = 'I can provide general information about medications, but always consult with your healthcare provider or pharmacist for specific medical advice. What medication would you like to know about?';
      recommendations = [
        'Always follow prescribed dosages',
        'Check for drug interactions',
        'Be aware of side effects',
        'Store medications properly',
        'Never share prescription medications'
      ];
      sources = ['FDA Drug Information', 'Pharmacist Guidelines'];
    } else {
      response = 'Thank you for your question. While I can provide general health information, I recommend consulting with a qualified healthcare professional for personalized medical advice. Is there a specific health topic you\'d like to learn more about?';
      recommendations = [
        'Consult with healthcare professionals for medical concerns',
        'Maintain regular health check-ups',
        'Keep track of your symptoms',
        'Follow evidence-based health practices'
      ];
    }

    return {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      metadata: {
        confidence,
        sources,
        recommendations
      }
    };
  };

  const analyzeSymptoms = () => {
    if (!symptoms.trim()) {
      toast.error('Please enter your symptoms');
      return;
    }

    const symptomList = symptoms.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const result = MedicalAI.analyzeSymptoms(symptomList);
    setAnalysisResult(result);
    toast.success('Symptom analysis completed');
  };

  const quickQuestions = [
    'What are the symptoms of high blood pressure?',
    'How can I improve my sleep quality?',
    'What should I know about diabetes management?',
    'Tell me about heart-healthy foods',
    'How do I manage stress effectively?',
    'What are the signs of dehydration?'
  ];

  return (
    <div className="space-y-6">
      {/* AI Assistant Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-600" />
                <span>Medical AI Assistant</span>
              </CardTitle>
              <CardDescription>
                AI-powered medical information and symptom analysis
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>AI Online</span>
              </Badge>
              <Badge variant="outline">
                <Shield className="w-4 h-4 mr-1" />
                HIPAA Compliant
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="symptoms">Symptom Checker</TabsTrigger>
          <TabsTrigger value="education">Health Education</TabsTrigger>
          <TabsTrigger value="drug-info">Drug Information</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          {/* Chat Interface */}
          <Card className="glass-effect">
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl p-4 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'ai' && (
                          <Brain className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          
                          {message.metadata?.recommendations && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">
                                AI Recommendations:
                              </p>
                              <ul className="space-y-1">
                                {message.metadata.recommendations.map((rec, idx) => (
                                  <li key={idx} className="text-xs text-blue-700 dark:text-blue-300 flex items-start">
                                    <CheckCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {message.metadata?.confidence && (
                            <div className="mt-2 flex items-center space-x-2">
                              <span className="text-xs opacity-70">
                                Confidence: {message.metadata.confidence}%
                              </span>
                              {message.metadata.sources && (
                                <Badge variant="outline" className="text-xs">
                                  {message.metadata.sources.length} sources
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me about symptoms, medications, or health topics..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} className="health-gradient">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.slice(0, 3).map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputMessage(question)}
                        className="text-xs"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-blue-600" />
                <span>AI Symptom Checker</span>
              </CardTitle>
              <CardDescription>
                Describe your symptoms for AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe your symptoms (separate with commas)
                </label>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., headache, fever, fatigue, nausea"
                  rows={3}
                />
              </div>
              
              <Button onClick={analyzeSymptoms} className="health-gradient">
                <Brain className="w-4 h-4 mr-2" />
                Analyze Symptoms
              </Button>
              
              {analysisResult && (
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This is for informational purposes only. Always consult a healthcare professional for medical advice.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Possible Conditions:</h3>
                      {analysisResult.possibleConditions.map((condition: any, index: number) => (
                        <Card key={index} className="mb-3">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{condition.name}</h4>
                              <Badge variant="outline">{condition.category}</Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{condition.description}</p>
                            <div className="text-xs text-slate-500">
                              <p><strong>Common symptoms:</strong> {condition.symptoms.join(', ')}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">AI Recommendations:</h3>
                      <ul className="space-y-1">
                        {analysisResult.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm flex items-start">
                            <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Heart Health',
                icon: Heart,
                description: 'Learn about cardiovascular wellness',
                topics: ['Blood Pressure', 'Cholesterol', 'Exercise', 'Diet']
              },
              {
                title: 'Mental Wellness',
                icon: Brain,
                description: 'Mental health and stress management',
                topics: ['Stress', 'Anxiety', 'Depression', 'Sleep']
              },
              {
                title: 'Nutrition',
                icon: Apple,
                description: 'Healthy eating and nutrition',
                topics: ['Balanced Diet', 'Vitamins', 'Hydration', 'Weight']
              },
              {
                title: 'Exercise & Fitness',
                icon: Activity,
                description: 'Physical activity and fitness',
                topics: ['Cardio', 'Strength', 'Flexibility', 'Recovery']
              },
              {
                title: 'Preventive Care',
                icon: Shield,
                description: 'Prevention and early detection',
                topics: ['Screenings', 'Vaccines', 'Check-ups', 'Risk Factors']
              },
              {
                title: 'Medication Safety',
                icon: Pill,
                description: 'Safe medication practices',
                topics: ['Dosage', 'Interactions', 'Side Effects', 'Storage']
              }
            ].map((category, index) => (
              <Card key={index} className="glass-effect health-card-hover">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                      <category.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.title}</h3>
                      <p className="text-sm text-slate-600">{category.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {category.topics.map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full" variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drug-info" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-green-600" />
                <span>Drug Information Database</span>
              </CardTitle>
              <CardDescription>
                Search for medication information and interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search for medication name..."
                  className="flex-1"
                />
                <Button className="health-gradient">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              
              <div className="text-center py-8">
                <Pill className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-lg font-medium mb-2">Drug Information Coming Soon</p>
                <p className="text-slate-600">Comprehensive medication database will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}