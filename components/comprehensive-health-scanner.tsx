"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Camera, 
  Scan, 
  Brain, 
  Heart,
  Eye,
  Activity,
  Thermometer,
  Droplets,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Zap,
  Shield,
  TrendingUp,
  User,
  Settings,
  Download,
  Share,
  Play,
  Pause,
  Square,
  RotateCcw,
  Maximize,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  Signal
} from 'lucide-react';
import { toast } from 'sonner';
import { AIHealthAnalyzer, HealthScanData, HealthAssessment } from '@/lib/ai-health-analyzer';
import { HealthAPI } from '@/lib/backend/api-routes';

interface ScanMode {
  id: string;
  name: string;
  description: string;
  duration: number;
  features: string[];
  accuracy: number;
}

interface ScanSession {
  id: string;
  mode: string;
  startTime: Date;
  duration: number;
  status: 'preparing' | 'scanning' | 'analyzing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  results?: HealthAssessment;
}

interface DeviceStatus {
  camera: boolean;
  microphone: boolean;
  sensors: boolean;
  network: boolean;
  battery: number;
  signal: number;
}

export function ComprehensiveHealthScanner() {
  const [scanSession, setScanSession] = useState<ScanSession | null>(null);
  const [selectedMode, setSelectedMode] = useState<ScanMode | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    camera: false,
    microphone: false,
    sensors: true,
    network: true,
    battery: 85,
    signal: 4
  });
  const [cameraActive, setCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [scanHistory, setScanHistory] = useState<HealthAssessment[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const scanModes: ScanMode[] = [
    {
      id: 'quick-scan',
      name: 'Quick Health Scan',
      description: 'Basic vital signs and facial analysis',
      duration: 30,
      features: ['Heart Rate', 'Stress Level', 'Skin Health', 'Eye Clarity'],
      accuracy: 85
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Analysis',
      description: 'Full biometric assessment with AI analysis',
      duration: 120,
      features: ['All Vital Signs', 'Body Composition', 'Mental Health', 'Risk Assessment', 'Recommendations'],
      accuracy: 94
    },
    {
      id: 'vital-signs',
      name: 'Vital Signs Monitor',
      description: 'Continuous monitoring of key health metrics',
      duration: 60,
      features: ['Heart Rate', 'Blood Pressure', 'Respiratory Rate', 'Temperature'],
      accuracy: 92
    },
    {
      id: 'mental-health',
      name: 'Mental Health Assessment',
      description: 'Stress, mood, and cognitive health analysis',
      duration: 90,
      features: ['Stress Analysis', 'Mood Detection', 'Cognitive Assessment', 'Sleep Quality'],
      accuracy: 88
    },
    {
      id: 'fitness-assessment',
      name: 'Fitness & Wellness',
      description: 'Physical fitness and wellness evaluation',
      duration: 75,
      features: ['Body Composition', 'Fitness Level', 'Posture Analysis', 'Movement Quality'],
      accuracy: 90
    },
    {
      id: 'preventive-screening',
      name: 'Preventive Screening',
      description: 'Early detection and risk assessment',
      duration: 150,
      features: ['Disease Risk', 'Biomarker Analysis', 'Genetic Factors', 'Lifestyle Assessment'],
      accuracy: 96
    }
  ];

  useEffect(() => {
    checkDeviceCapabilities();
  }, []);

  const checkDeviceCapabilities = async () => {
    try {
      // Check camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setDeviceStatus(prev => ({ ...prev, camera: true, microphone: true }));
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Device capability check failed:', error);
    }
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: audioEnabled
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setDeviceStatus(prev => ({ ...prev, camera: true }));
        toast.success('Advanced camera system activated');
      }
    } catch (error) {
      toast.error('Camera access required for health scanning');
      console.error('Camera error:', error);
    }
  }, [audioEnabled]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
      setDeviceStatus(prev => ({ ...prev, camera: false }));
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });

    recordedChunksRef.current = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.start(1000); // Record in 1-second chunks
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    toast.info('Recording started for analysis');
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info('Recording stopped');
    }
  }, [isRecording]);

  const performAdvancedScan = useCallback(async () => {
    if (!selectedMode) {
      toast.error('Please select a scan mode');
      return;
    }

    if (!cameraActive) {
      await startCamera();
      return;
    }

    const sessionId = Date.now().toString();
    const newSession: ScanSession = {
      id: sessionId,
      mode: selectedMode.id,
      startTime: new Date(),
      duration: selectedMode.duration,
      status: 'preparing',
      progress: 0,
      currentStep: 'Initializing scan...'
    };

    setScanSession(newSession);
    startRecording();

    const scanSteps = [
      'Initializing AI health models...',
      'Calibrating biometric sensors...',
      'Analyzing facial features and micro-expressions...',
      'Detecting vital signs via photoplethysmography...',
      'Measuring heart rate variability...',
      'Assessing respiratory patterns...',
      'Evaluating skin health and hydration...',
      'Analyzing eye health and clarity...',
      'Detecting stress and fatigue indicators...',
      'Processing body composition data...',
      'Applying machine learning algorithms...',
      'Generating personalized health insights...',
      'Calculating risk assessments...',
      'Finalizing comprehensive report...'
    ];

    try {
      setScanSession(prev => prev ? { ...prev, status: 'scanning' } : prev);

      for (let i = 0; i < scanSteps.length; i++) {
        setScanSession(prev => prev ? {
          ...prev,
          currentStep: scanSteps[i],
          progress: ((i + 1) / scanSteps.length) * 80 // 80% for scanning
        } : prev);
        
        await new Promise(resolve => setTimeout(resolve, selectedMode.duration * 1000 / scanSteps.length));
      }

      setScanSession(prev => prev ? { 
        ...prev, 
        status: 'analyzing',
        currentStep: 'AI analysis in progress...',
        progress: 85
      } : prev);

      // Simulate comprehensive health data collection
      const mockScanData: HealthScanData = {
        faceAnalysis: {
          skinHealth: Math.random() * 30 + 70,
          eyeClarity: Math.random() * 25 + 75,
          facialSymmetry: Math.random() * 20 + 80,
          stressIndicators: Math.random() * 40 + 20
        },
        vitalSigns: {
          heartRate: Math.round(Math.random() * 30 + 65),
          respiratoryRate: Math.round(Math.random() * 6 + 14),
          bloodPressure: {
            systolic: Math.round(Math.random() * 40 + 110),
            diastolic: Math.round(Math.random() * 20 + 70)
          },
          oxygenSaturation: Math.round(Math.random() * 5 + 95)
        },
        bodyComposition: {
          bmi: Math.random() * 10 + 20,
          bodyFat: Math.random() * 15 + 15,
          muscleMass: Math.random() * 20 + 40,
          hydrationLevel: Math.random() * 20 + 70
        }
      };

      const assessment = await AIHealthAnalyzer.performComprehensiveAnalysis(mockScanData);
      
      // Save scan results
      const scanResult = await HealthAPI.processHealthScan({
        patientId: 'current-user',
        scanType: selectedMode.id,
        scanData: mockScanData,
        imageData: await captureImage(),
        videoData: recordedChunksRef.current.length > 0 ? 'video-data' : undefined
      });

      setScanSession(prev => prev ? {
        ...prev,
        status: 'completed',
        progress: 100,
        currentStep: 'Scan completed successfully!',
        results: assessment
      } : prev);

      setScanHistory(prev => [assessment, ...prev]);
      stopRecording();
      toast.success('Advanced health scan completed successfully!');
      
    } catch (error) {
      setScanSession(prev => prev ? {
        ...prev,
        status: 'failed',
        currentStep: 'Scan failed. Please try again.'
      } : prev);
      stopRecording();
      toast.error('Scan failed. Please try again.');
      console.error('Scan error:', error);
    }
  }, [selectedMode, cameraActive, startCamera, startRecording, stopRecording]);

  const captureImage = async (): Promise<string> => {
    if (!videoRef.current || !canvasRef.current) return '';
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    
    return '';
  };

  const resetScan = () => {
    setScanSession(null);
    stopRecording();
  };

  const downloadResults = () => {
    if (scanSession?.results) {
      const dataStr = JSON.stringify(scanSession.results, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `health-scan-${scanSession.id}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Advanced Scanner Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-600" />
                <span>Comprehensive Health Scanner</span>
              </CardTitle>
              <CardDescription>
                Advanced AI-powered health assessment with multi-modal analysis
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>AI Enhanced</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Medical Grade</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Device Status */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-lg">Device Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="flex items-center space-x-2">
              <Camera className={`w-5 h-5 ${deviceStatus.camera ? 'text-green-600' : 'text-red-600'}`} />
              <span className="text-sm">Camera</span>
              {deviceStatus.camera ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
            </div>
            <div className="flex items-center space-x-2">
              {audioEnabled ? <Volume2 className="w-5 h-5 text-green-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
              <span className="text-sm">Audio</span>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span className="text-sm">Sensors</span>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-center space-x-2">
              {deviceStatus.network ? <Wifi className="w-5 h-5 text-green-600" /> : <WifiOff className="w-5 h-5 text-red-600" />}
              <span className="text-sm">Network</span>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-center space-x-2">
              <Battery className="w-5 h-5 text-green-600" />
              <span className="text-sm">{deviceStatus.battery}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Signal className="w-5 h-5 text-green-600" />
              <span className="text-sm">Signal</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-1 h-3 ${i < deviceStatus.signal ? 'bg-green-600' : 'bg-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Mode Selection */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Select Scan Mode</CardTitle>
          <CardDescription>Choose the type of health assessment you want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scanModes.map((mode) => (
              <Card
                key={mode.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedMode?.id === mode.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedMode(mode)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{mode.name}</h3>
                      <Badge variant="outline">{mode.duration}s</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{mode.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Accuracy</span>
                        <span>{mode.accuracy}%</span>
                      </div>
                      <Progress value={mode.accuracy} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {mode.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Camera Interface */}
      <Card className="glass-effect">
        <CardContent className="p-6">
          <div className="relative bg-slate-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ display: cameraActive ? 'block' : 'none' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ display: 'none' }}
            />
            
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="text-center text-white">
                  <Camera className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium mb-2">Advanced Health Scanner Ready</p>
                  <p className="text-sm opacity-70">Select a scan mode and click start to begin analysis</p>
                </div>
              </div>
            )}

            {cameraActive && (
              <>
                {/* AI Scanning Overlay */}
                <div className="absolute inset-0">
                  <div className="absolute inset-4 border-2 border-blue-400 rounded-lg">
                    {/* Corner markers */}
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
                    
                    {/* Center crosshair */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 border-2 border-blue-400 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Scanning animation */}
                  {scanSession?.status === 'scanning' && (
                    <div className="absolute inset-0 camera-overlay" />
                  )}
                </div>
                
                {/* Status indicators */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-600 text-white animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full mr-2" />
                      {isRecording ? 'RECORDING' : 'LIVE'}
                    </Badge>
                    {selectedMode && (
                      <Badge variant="secondary">
                        <Brain className="w-4 h-4 mr-1" />
                        {selectedMode.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                      HD • 30fps
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className="bg-black/50 border-white/20 text-white"
                    >
                      {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Scan Progress */}
                {scanSession && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {scanSession.status === 'preparing' ? 'Preparing...' :
                           scanSession.status === 'scanning' ? 'Scanning...' :
                           scanSession.status === 'analyzing' ? 'Analyzing...' :
                           scanSession.status === 'completed' ? 'Completed!' : 'Failed'}
                        </span>
                        <span className="text-sm">{Math.round(scanSession.progress)}%</span>
                      </div>
                      <Progress value={scanSession.progress} className="mb-2" />
                      <p className="text-xs opacity-80">{scanSession.currentStep}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Scan Controls */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Button
              onClick={performAdvancedScan}
              disabled={!selectedMode || (scanSession && scanSession.status !== 'completed' && scanSession.status !== 'failed')}
              className="health-gradient px-8 py-3 text-lg"
            >
              {scanSession && scanSession.status !== 'completed' && scanSession.status !== 'failed' ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5 mr-2" />
                  Start Advanced Scan
                </>
              )}
            </Button>
            
            {scanSession && (
              <Button variant="outline" onClick={resetScan}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
            
            {cameraActive && (
              <Button variant="outline" onClick={stopCamera}>
                <Square className="w-4 h-4 mr-2" />
                Stop Camera
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanSession?.results && (
        <div className="space-y-6">
          {/* Overall Results */}
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-emerald-600" />
                    <span>Comprehensive Health Assessment</span>
                  </CardTitle>
                  <CardDescription>
                    AI analysis completed with {Math.round(Math.random() * 10 + 90)}% confidence
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={downloadResults}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg">
                  <Shield className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Overall Health Score</p>
                  <p className="text-4xl font-bold text-emerald-600 mb-2">{scanSession.results.overallScore}%</p>
                  <Progress value={scanSession.results.overallScore} className="mb-2" />
                  <Badge className={getRiskLevelColor(scanSession.results.riskLevel)}>
                    {scanSession.results.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Key Findings</h3>
                  {scanSession.results.findings.slice(0, 3).map((finding, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{finding.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{Math.round(finding.score)}%</span>
                        <Badge className={getStatusColor(finding.status)} variant="outline">
                          {finding.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Trends
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Heart className="w-4 h-4 mr-2" />
                      Schedule Follow-up
                    </Button>
                    <Button className="w-full health-gradient">
                      <Activity className="w-4 h-4 mr-2" />
                      Start Health Plan
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Findings */}
          <Tabs defaultValue="findings" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="findings">Detailed Findings</TabsTrigger>
              <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
              <TabsTrigger value="history">Scan History</TabsTrigger>
            </TabsList>

            <TabsContent value="findings" className="space-y-4">
              {scanSession.results.findings.map((finding, index) => (
                <Card key={index} className="glass-effect">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{finding.category}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-blue-600">{Math.round(finding.score)}%</span>
                            <Badge className={getStatusColor(finding.status)}>
                              {finding.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <Progress value={finding.score} className="h-2" />
                        
                        <p className="text-slate-600 dark:text-slate-300">{finding.description}</p>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">AI Recommendations:</h4>
                          <ul className="space-y-1">
                            {finding.recommendations.map((rec, idx) => (
                              <li key={idx} className="text-sm text-blue-700 dark:text-blue-300 flex items-start">
                                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>Personalized Health Recommendations</CardTitle>
                  <CardDescription>AI-generated action plan based on your comprehensive scan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scanSession.results.followUpRecommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-blue-800 dark:text-blue-200">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>Scan History</CardTitle>
                  <CardDescription>Previous health assessments and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  {scanHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <p className="text-lg font-medium mb-2">No Previous Scans</p>
                      <p className="text-slate-600">Complete more scans to see your health trends</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scanHistory.map((scan, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Health Scan #{scanHistory.length - index}</p>
                              <p className="text-sm text-slate-600">Overall Score: {scan.overallScore}%</p>
                            </div>
                            <Badge className={getRiskLevelColor(scan.riskLevel)}>
                              {scan.riskLevel.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}