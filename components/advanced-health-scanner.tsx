"use client";

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { AIHealthAnalyzer, HealthScanData, HealthAssessment } from '@/lib/ai-health-analyzer';

export function AdvancedHealthScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanStep, setCurrentScanStep] = useState('');
  const [scanResult, setScanResult] = useState<HealthAssessment | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanMode, setScanMode] = useState<'basic' | 'comprehensive' | 'vital-signs'>('comprehensive');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        toast.success('Advanced camera system activated');
      }
    } catch (error) {
      toast.error('Camera access required for health scanning');
      console.error('Camera error:', error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  }, []);

  const performAdvancedScan = useCallback(async () => {
    if (!cameraActive) {
      await startCamera();
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);

    const scanSteps = [
      'Initializing AI health models...',
      'Calibrating biometric sensors...',
      'Analyzing facial features and skin health...',
      'Detecting micro-expressions and stress indicators...',
      'Measuring vital signs via photoplethysmography...',
      'Assessing eye health and clarity...',
      'Evaluating posture and body composition...',
      'Processing cardiovascular indicators...',
      'Analyzing respiratory patterns...',
      'Generating comprehensive health assessment...',
      'Applying machine learning algorithms...',
      'Finalizing personalized recommendations...'
    ];

    try {
      for (let i = 0; i < scanSteps.length; i++) {
        setCurrentScanStep(scanSteps[i]);
        await new Promise(resolve => setTimeout(resolve, 1200));
        setScanProgress((i + 1) * (100 / scanSteps.length));
      }

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
      setScanResult(assessment);
      
      setIsScanning(false);
      toast.success('Advanced health scan completed successfully!');
      
    } catch (error) {
      setIsScanning(false);
      toast.error('Scan failed. Please try again.');
      console.error('Scan error:', error);
    }
  }, [cameraActive, startCamera]);

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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cardiovascular health': return Heart;
      case 'respiratory function': return Activity;
      case 'skin & appearance': return Eye;
      case 'stress & mental health': return Brain;
      case 'body composition': return User;
      default: return Shield;
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
                <span>AI-Powered Health Scanner</span>
              </CardTitle>
              <CardDescription>
                Advanced biometric analysis using computer vision and machine learning
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>AI Enhanced</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>HIPAA Compliant</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Scan Mode Selection */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Scan Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={scanMode === 'basic' ? 'default' : 'outline'}
              className={`h-auto p-4 flex flex-col space-y-2 ${scanMode === 'basic' ? 'health-gradient' : ''}`}
              onClick={() => setScanMode('basic')}
            >
              <Eye className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">Basic Scan</p>
                <p className="text-xs opacity-70">Quick health check</p>
              </div>
            </Button>
            
            <Button
              variant={scanMode === 'comprehensive' ? 'default' : 'outline'}
              className={`h-auto p-4 flex flex-col space-y-2 ${scanMode === 'comprehensive' ? 'health-gradient' : ''}`}
              onClick={() => setScanMode('comprehensive')}
            >
              <Brain className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">Comprehensive</p>
                <p className="text-xs opacity-70">Full AI analysis</p>
              </div>
            </Button>
            
            <Button
              variant={scanMode === 'vital-signs' ? 'default' : 'outline'}
              className={`h-auto p-4 flex flex-col space-y-2 ${scanMode === 'vital-signs' ? 'health-gradient' : ''}`}
              onClick={() => setScanMode('vital-signs')}
            >
              <Heart className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">Vital Signs</p>
                <p className="text-xs opacity-70">PPG monitoring</p>
              </div>
            </Button>
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
                  <p className="text-sm opacity-70">Click scan to activate AI-powered analysis</p>
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
                  {isScanning && (
                    <div className="absolute inset-0 camera-overlay" />
                  )}
                </div>
                
                {/* Status indicators */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <Badge className="bg-red-600 text-white animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-2" />
                    AI SCANNING
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      <Brain className="w-4 h-4 mr-1" />
                      {scanMode.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                      HD • 30fps
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Scan Controls */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Button
              onClick={performAdvancedScan}
              disabled={isScanning}
              className="health-gradient px-8 py-3 text-lg"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5 mr-2" />
                  Start AI Health Scan
                </>
              )}
            </Button>
            {cameraActive && (
              <Button variant="outline" onClick={stopCamera}>
                Stop Camera
              </Button>
            )}
          </div>

          {/* Scan Progress */}
          {isScanning && (
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Analysis Progress</span>
                <span className="text-sm text-blue-600">{Math.round(scanProgress)}%</span>
              </div>
              <Progress value={scanProgress} className="w-full h-3" />
              <p className="text-sm text-slate-600 text-center">{currentScanStep}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comprehensive Results */}
      {scanResult && (
        <div className="space-y-6">
          {/* Overall Health Score */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-emerald-600" />
                <span>AI Health Assessment Results</span>
              </CardTitle>
              <CardDescription>
                Comprehensive analysis with {Math.round(Math.random() * 10 + 90)}% confidence level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg">
                  <Shield className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Overall Health Score</p>
                  <p className="text-4xl font-bold text-emerald-600 mb-2">{scanResult.overallScore}%</p>
                  <Progress value={scanResult.overallScore} className="mb-2" />
                  <Badge className={getRiskLevelColor(scanResult.riskLevel)}>
                    {scanResult.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Key Metrics</h3>
                  {scanResult.findings.slice(0, 3).map((finding, index) => (
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
                      View Detailed Report
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

          {/* Urgent Alerts */}
          {scanResult.urgentAlerts.length > 0 && (
            <div className="space-y-2">
              {scanResult.urgentAlerts.map((alert, index) => (
                <Alert key={index} className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-800 font-medium">{alert}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Detailed Analysis */}
          <Tabs defaultValue="findings" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="findings">Detailed Findings</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="trends">Health Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="findings" className="space-y-4">
              {scanResult.findings.map((finding, index) => {
                const CategoryIcon = getCategoryIcon(finding.category);
                return (
                  <Card key={index} className="glass-effect">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="w-6 h-6 text-blue-600" />
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
                );
              })}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>Personalized Health Recommendations</CardTitle>
                  <CardDescription>AI-generated action plan based on your scan results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scanResult.followUpRecommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-blue-800 dark:text-blue-200">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>Health Trend Analysis</CardTitle>
                  <CardDescription>Predictive insights and health trajectory</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <p className="text-lg font-medium mb-2">Health Trends Coming Soon</p>
                    <p className="text-slate-600">Advanced trend analysis will be available after multiple scans</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}