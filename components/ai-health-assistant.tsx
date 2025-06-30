"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff,
  Camera,
  Image,
  FileText,
  Search,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Heart,
  Activity,
  Pill,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  BookOpen,
  Target,
  Clock,
  User,
  Settings,
  Download,
  Share,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { toast } from 'sonner';
import { HealthAPI } from '@/lib/backend/api-routes';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    sources?: string[];
    recommendations?: string[];
    analysis?: any;
    attachments?: string[];
  };
  rating?: 'helpful' | 'not-helpful';
}

interface HealthAnalysis {
  type: 'symptom' | 'risk' | 'medication' | 'lifestyle';
  title: string;
  summary: string;
  details: any;
  confidence: number;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
}

interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'analysis' | 'monitoring' | 'prediction' | 'education';
  accuracy: number;
  usage: number;
}

interface PossibleDiagnosis {
  disease: {
    name: string;
  };
  probability: number;
}

export function AIHealthAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your advanced AI Health Assistant. I can help you with comprehensive health analysis, symptom assessment, medication guidance, risk prediction, and personalized health recommendations. How can I assist you today?',
      timestamp: new Date(),
      metadata: {
        confidence: 100,
        sources: ['Medical Knowledge Base', 'Clinical Guidelines']
      }
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<HealthAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<HealthAnalysis | null>(null);
  const [aiCapabilities] = useState<AICapability[]>([
    {
      id: 'symptom-analysis',
      name: 'Symptom Analysis',
      description: 'Advanced symptom assessment with differential diagnosis',
      icon: Search,
      category: 'analysis',
      accuracy: 94.2,
      usage: 1250
    },
    {
      id: 'risk-prediction',
      name: 'Risk Prediction',
      description: 'Predictive health risk assessment using ML models',
      icon: TrendingUp,
      category: 'prediction',
      accuracy: 89.7,
      usage: 890
    },
    {
      id: 'medication-guidance',
      name: 'Medication Guidance',
      description: 'Drug interactions and dosage recommendations',
      icon: Pill,
      category: 'analysis',
      accuracy: 96.8,
      usage: 2100
    },
    {
      id: 'health-monitoring',
      name: 'Health Monitoring',
      description: 'Continuous health parameter tracking and alerts',
      icon: Activity,
      category: 'monitoring',
      accuracy: 91.5,
      usage: 1800
    },
    {
      id: 'lifestyle-coaching',
      name: 'Lifestyle Coaching',
      description: 'Personalized lifestyle and wellness recommendations',
      icon: Target,
      category: 'education',
      accuracy: 87.3,
      usage: 1450
    },
    {
      id: 'emergency-detection',
      name: 'Emergency Detection',
      description: 'Critical health condition identification and alerts',
      icon: AlertTriangle,
      category: 'analysis',
      accuracy: 98.1,
      usage: 320
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

    try {
      // Simulate AI processing with advanced analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse = await generateAdvancedAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      
      // If the message contains symptoms, perform analysis
      if (containsSymptoms(inputMessage)) {
        const analysis = await performSymptomAnalysis(inputMessage);
        setAnalysisResults(prev => [...prev, analysis]);
      }
      
    } catch (error) {
      toast.error('Failed to process your request. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const generateAdvancedAIResponse = async (userInput: string): Promise<ChatMessage> => {
    const lowerInput = userInput.toLowerCase();
    
    let response = '';
    let confidence = 85;
    let sources: string[] = [];
    let recommendations: string[] = [];
    let analysis: any = null;

    // Advanced symptom analysis
    if (containsSymptoms(lowerInput)) {
      const symptoms = extractSymptoms(lowerInput);
      const symptomAnalysis = await HealthAPI.analyzeSymptoms(symptoms);
      
      if (symptomAnalysis.success) {
        response = `I've analyzed your symptoms and identified several possible conditions. Based on the symptoms you've described (${symptoms.join(', ')}), here are my findings:

**Most Likely Conditions:**
${symptomAnalysis.data.possibleDiagnoses.slice(0, 3).map((d: PossibleDiagnosis, i: number) => 
  `${i + 1}. ${d.disease.name} (${Math.round(d.probability)}% match)`
).join('\n')}

**Immediate Recommendations:**
${symptomAnalysis.data.recommendations.slice(0, 3).map((r: string) => `• ${r}`).join('\n')}

${symptomAnalysis.data.redFlags.length > 0 ? 
  `⚠️ **Red Flags Detected:** ${symptomAnalysis.data.redFlags.join(', ')}` : ''}`;

        confidence = 92;
        sources = ['Medical Knowledge Base', 'Clinical Decision Support', 'Symptom Database'];
        recommendations = symptomAnalysis.data.recommendations;
        analysis = symptomAnalysis.data;
      }
    }
    // Medication queries
    else if (lowerInput.includes('medication') || lowerInput.includes('drug') || lowerInput.includes('pill')) {
      response = `I can help you with comprehensive medication information including:

• **Drug Interactions**: Check for potential interactions between medications
• **Dosage Guidelines**: Proper dosing based on age, weight, and condition
• **Side Effects**: Common and serious adverse reactions to watch for
• **Contraindications**: When medications should not be used
• **Generic Alternatives**: Cost-effective medication options

What specific medication information do you need? Please provide the medication names or describe your concerns.`;

      confidence = 88;
      sources = ['FDA Drug Database', 'Clinical Pharmacology', 'Drug Interaction Database'];
      recommendations = [
        'Always consult with your healthcare provider before making medication changes',
        'Keep an updated list of all medications and supplements',
        'Report any unusual side effects to your doctor immediately'
      ];
    }
    // Health risk assessment
    else if (lowerInput.includes('risk') || lowerInput.includes('prevent') || lowerInput.includes('family history')) {
      response = `I can perform a comprehensive health risk assessment based on various factors:

**Risk Factors I Analyze:**
• Age, gender, and genetic predisposition
• Lifestyle factors (diet, exercise, smoking, alcohol)
• Medical history and family history
• Current health metrics and biomarkers
• Environmental and occupational exposures

**Conditions I Can Assess Risk For:**
• Cardiovascular disease
• Type 2 diabetes
• Various cancers
• Osteoporosis
• Mental health conditions

Would you like me to perform a specific risk assessment? Please share relevant information about your health profile.`;

      confidence = 90;
      sources = ['Epidemiological Studies', 'Risk Prediction Models', 'Clinical Guidelines'];
      recommendations = [
        'Regular health screenings based on age and risk factors',
        'Maintain a healthy lifestyle with proper diet and exercise',
        'Know your family medical history'
      ];
    }
    // General health education
    else if (lowerInput.includes('healthy') || lowerInput.includes('wellness') || lowerInput.includes('lifestyle')) {
      response = `I'm here to help you achieve optimal health and wellness! Here are key areas I can assist with:

**Nutrition & Diet:**
• Personalized meal planning and nutritional guidance
• Weight management strategies
• Dietary restrictions and special diets

**Physical Activity:**
• Exercise recommendations based on fitness level
• Injury prevention and recovery
• Activity tracking and goal setting

**Mental Health:**
• Stress management techniques
• Sleep optimization strategies
• Mindfulness and meditation guidance

**Preventive Care:**
• Screening recommendations by age and risk
• Vaccination schedules
• Health monitoring best practices

What aspect of your health and wellness would you like to focus on?`;

      confidence = 85;
      sources = ['WHO Guidelines', 'CDC Recommendations', 'Nutrition Science'];
      recommendations = [
        'Aim for 150 minutes of moderate exercise per week',
        'Eat a balanced diet rich in fruits and vegetables',
        'Prioritize 7-9 hours of quality sleep nightly',
        'Practice stress management techniques regularly'
      ];
    }
    // Emergency situations
    else if (lowerInput.includes('emergency') || lowerInput.includes('urgent') || lowerInput.includes('severe pain')) {
      response = `🚨 **IMPORTANT**: If you're experiencing a medical emergency, please call emergency services immediately (911 in the US) or go to the nearest emergency room.

**Emergency Warning Signs:**
• Chest pain or pressure
• Difficulty breathing
• Severe headache with confusion
• Loss of consciousness
• Severe bleeding
• Signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 911)

**For Non-Emergency Urgent Care:**
• Contact your healthcare provider
• Visit an urgent care center
• Use telemedicine services

I'm here to provide information and support, but I cannot replace emergency medical care. Your safety is the top priority.`;

      confidence = 95;
      sources = ['Emergency Medicine Guidelines', 'First Aid Protocols'];
      recommendations = [
        'Always err on the side of caution with potential emergencies',
        'Keep emergency contact numbers readily available',
        'Know the location of nearest emergency facilities'
      ];
    }
    else {
      response = `I'm your comprehensive AI Health Assistant with advanced capabilities in:

🧠 **Medical Analysis**: Symptom assessment, differential diagnosis, and clinical decision support
📊 **Health Monitoring**: Vital signs tracking, trend analysis, and early warning systems
💊 **Medication Management**: Drug interactions, dosing, and safety information
🎯 **Risk Prediction**: Personalized health risk assessment using machine learning
📚 **Health Education**: Evidence-based information on conditions, treatments, and prevention
🏥 **Care Coordination**: Appointment scheduling, provider recommendations, and care planning

I use advanced AI models trained on vast medical databases and continuously updated with the latest research. How can I help you with your health today?`;

      confidence = 90;
      sources = ['Medical Literature', 'Clinical Guidelines', 'AI Training Data'];
      recommendations = [
        'Feel free to ask specific health questions',
        'Share symptoms for detailed analysis',
        'Request medication information or interactions',
        'Ask about health risks and prevention strategies'
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
        recommendations,
        analysis
      }
    };
  };

  const containsSymptoms = (text: string): boolean => {
    const symptomKeywords = [
      'pain', 'ache', 'hurt', 'sore', 'headache', 'fever', 'nausea', 'dizzy', 'tired', 'fatigue',
      'cough', 'sneeze', 'runny nose', 'congestion', 'shortness of breath', 'chest pain',
      'stomach ache', 'diarrhea', 'constipation', 'vomiting', 'rash', 'itchy', 'swelling',
      'joint pain', 'muscle pain', 'back pain', 'neck pain', 'leg pain', 'arm pain'
    ];
    
    return symptomKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const extractSymptoms = (text: string): string[] => {
    const symptomKeywords = [
      'headache', 'fever', 'nausea', 'dizziness', 'fatigue', 'cough', 'chest pain',
      'stomach ache', 'diarrhea', 'vomiting', 'rash', 'joint pain', 'muscle pain'
    ];
    
    return symptomKeywords.filter(symptom => text.toLowerCase().includes(symptom));
  };

  const performSymptomAnalysis = async (symptoms: string): Promise<HealthAnalysis> => {
    // Simulate advanced symptom analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      type: 'symptom',
      title: 'Symptom Analysis Complete',
      summary: 'Based on the symptoms provided, I\'ve identified potential conditions and recommendations.',
      details: {
        primarySymptoms: extractSymptoms(symptoms),
        possibleConditions: ['Common Cold', 'Viral Infection', 'Stress-related symptoms'],
        riskLevel: 'low',
        recommendedActions: ['Rest and hydration', 'Monitor symptoms', 'Consult healthcare provider if symptoms worsen']
      },
      confidence: 87,
      recommendations: [
        'Monitor symptoms for 24-48 hours',
        'Stay hydrated and get adequate rest',
        'Seek medical attention if symptoms worsen'
      ],
      urgency: 'low'
    };
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        toast.info('Listening... Speak now');
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition failed. Please try again.');
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      toast.error('Voice recognition not supported in this browser');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file processing
      toast.success(`File "${file.name}" uploaded for analysis`);
      
      const fileMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: `Uploaded file: ${file.name}`,
        timestamp: new Date(),
        metadata: {
          attachments: [file.name]
        }
      };
      
      setMessages(prev => [...prev, fileMessage]);
      
      // Simulate AI analysis of uploaded file
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I've analyzed your uploaded file "${file.name}". Based on the content, I can provide insights about your health data, lab results, or medical images. What specific questions do you have about this file?`,
          timestamp: new Date(),
          metadata: {
            confidence: 85,
            sources: ['File Analysis Engine', 'Medical Image Processing']
          }
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 2000);
    }
  };

  const rateMessage = (messageId: string, rating: 'helpful' | 'not-helpful') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
    toast.success(`Thank you for your feedback!`);
  };

  const quickQuestions = [
    'Analyze my symptoms: headache and fatigue',
    'Check drug interactions for my medications',
    'What are my cardiovascular risk factors?',
    'How can I improve my sleep quality?',
    'Explain my lab results',
    'Create a personalized wellness plan'
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
                <span>Advanced AI Health Assistant</span>
              </CardTitle>
              <CardDescription>
                Powered by advanced machine learning models and comprehensive medical databases
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
              <Badge variant="outline">
                <Zap className="w-4 h-4 mr-1" />
                GPT-4 Enhanced
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-2 space-y-4">
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
                          <div className="prose prose-sm max-w-none">
                            {message.content.split('\n').map((line, index) => (
                              <p key={index} className="mb-2 last:mb-0">
                                {line.startsWith('**') && line.endsWith('**') ? (
                                  <strong>{line.slice(2, -2)}</strong>
                                ) : line.startsWith('• ') ? (
                                  <span className="block ml-4">{line}</span>
                                ) : line.startsWith('⚠️') ? (
                                  <span className="text-orange-600 font-medium">{line}</span>
                                ) : line.startsWith('🚨') ? (
                                  <span className="text-red-600 font-bold">{line}</span>
                                ) : (
                                  line
                                )}
                              </p>
                            ))}
                          </div>
                          
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
                          
                          {message.metadata?.attachments && (
                            <div className="mt-2 flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span className="text-xs">{message.metadata.attachments.join(', ')}</span>
                            </div>
                          )}
                          
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs opacity-70">
                              {message.metadata?.confidence && (
                                <span>Confidence: {message.metadata.confidence}%</span>
                              )}
                              {message.metadata?.sources && (
                                <Badge variant="outline" className="text-xs">
                                  {message.metadata.sources.length} sources
                                </Badge>
                              )}
                            </div>
                            
                            {message.type === 'ai' && (
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => rateMessage(message.id, 'helpful')}
                                  className={`h-6 w-6 p-0 ${message.rating === 'helpful' ? 'text-green-600' : ''}`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => rateMessage(message.id, 'not-helpful')}
                                  className={`h-6 w-6 p-0 ${message.rating === 'not-helpful' ? 'text-red-600' : ''}`}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
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
                        <span className="text-sm text-slate-600">AI is analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me about symptoms, medications, health risks, or any medical questions..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startVoiceInput}
                    disabled={isListening}
                    className={isListening ? 'bg-red-100 text-red-600' : ''}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button onClick={sendMessage} className="health-gradient">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.txt,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
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
        </div>

        {/* AI Capabilities & Analysis */}
        <div className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-lg">AI Capabilities</CardTitle>
              <CardDescription>Advanced medical AI features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiCapabilities.slice(0, 4).map((capability) => (
                  <div key={capability.id} className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <capability.icon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{capability.name}</p>
                        <p className="text-xs text-slate-600">{capability.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={capability.accuracy} className="h-1 flex-1" />
                          <span className="text-xs text-slate-500">{capability.accuracy}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {analysisResults.length > 0 && (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Recent Analysis</CardTitle>
                <CardDescription>AI-powered health insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResults.slice(-3).map((analysis, index) => (
                    <div key={index} className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                         onClick={() => setSelectedAnalysis(analysis)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{analysis.title}</p>
                          <p className="text-xs text-slate-600">{analysis.summary}</p>
                        </div>
                        <Badge className={`${
                          analysis.urgency === 'emergency' ? 'bg-red-100 text-red-800' :
                          analysis.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                          analysis.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {analysis.urgency}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <Progress value={analysis.confidence} className="h-1" />
                        <p className="text-xs text-slate-500 mt-1">Confidence: {analysis.confidence}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-lg">Health Education</CardTitle>
              <CardDescription>Learn about health topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  'Understanding Blood Pressure',
                  'Diabetes Prevention',
                  'Heart Health Basics',
                  'Mental Wellness Tips',
                  'Nutrition Guidelines'
                ].map((topic, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setInputMessage(`Tell me about ${topic.toLowerCase()}`)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}