"use client";

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Scan, 
  CheckCircle, 
  AlertTriangle, 
  Brain, 
  Eye, 
  Heart,
  Thermometer,
  Activity,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface ScanResult {
  confidence: number;
  findings: Array<{
    category: string;
    status: 'normal' | 'attention' | 'concern';
    description: string;
    recommendation: string;
  }>;
  overallHealth: number;
  riskFactors: string[];
}

export function HealthScanner({ onScanComplete }: { onScanComplete: (result: ScanResult) => void }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        toast.success('Camera activated successfully');
      }
    } catch (error) {
      toast.error('Unable to access camera. Please check permissions.');
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

  const performHealthScan = useCallback(async () => {
    if (!cameraActive) {
      await startCamera();
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);

    // Simulate AI scanning process
    const scanSteps = [
      'Initializing AI models...',
      'Analyzing facial features...',
      'Detecting vital signs...',
      'Assessing skin health...',
      'Evaluating eye condition...',
      'Processing health indicators...',
      'Generating recommendations...'
    ];

    for (let i = 0; i < scanSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setScanProgress((i + 1) * (100 / scanSteps.length));
      toast.info(scanSteps[i]);
    }

    // Simulate scan results
    const mockResult: ScanResult = {
      confidence: 87,
      findings: [
        {
          category: 'Cardiovascular',
          status: 'normal',
          description: 'Heart rate appears stable, no irregular patterns detected',
          recommendation: 'Continue regular exercise and maintain healthy diet'
        },
        {
          category: 'Respiratory',
          status: 'normal',
          description: 'Breathing pattern analysis shows normal respiratory function',
          recommendation: 'No immediate action required'
        },
        {
          category: 'Skin Health',
          status: 'attention',
          description: 'Slight signs of dehydration detected in facial analysis',
          recommendation: 'Increase daily water intake to 8-10 glasses'
        },
        {
          category: 'Eye Health',
          status: 'normal',
          description: 'Eye clarity and pupil response within normal parameters',
          recommendation: 'Continue regular eye care routine'
        },
        {
          category: 'Stress Indicators',
          status: 'attention',
          description: 'Mild stress indicators detected in facial micro-expressions',
          recommendation: 'Consider stress management techniques and adequate sleep'
        }
      ],
      overallHealth: 82,
      riskFactors: ['Mild dehydration', 'Stress indicators']
    };

    setScanResult(mockResult);
    onScanComplete(mockResult);
    setIsScanning(false);
    toast.success('Health scan completed successfully!');
  }, [cameraActive, startCamera, onScanComplete]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'attention': return 'text-yellow-600 bg-yellow-50';
      case 'concern': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return CheckCircle;
      case 'attention': return AlertTriangle;
      case 'concern': return AlertTriangle;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-6 h-6 text-blue-600" />
            <span>AI Health Scanner</span>
          </CardTitle>
          <CardDescription>
            Advanced facial analysis for real-time health assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera Section */}
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
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Camera Ready</p>
                  <p className="text-sm opacity-70">Click scan to activate camera</p>
                </div>
              </div>
            )}

            {cameraActive && (
              <>
                <div className="absolute inset-0 camera-overlay pointer-events-none" />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <Badge className="bg-red-600 text-white animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-2" />
                    LIVE
                  </Badge>
                  <div className="text-white text-sm font-medium">
                    AI Analysis Active
                  </div>
                </div>
                
                {/* Scanning overlay */}
                <div className="absolute inset-4 border-2 border-blue-400 rounded-lg">
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
                </div>
              </>
            )}
          </div>

          {/* Scan Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={performHealthScan}
              disabled={isScanning}
              className="health-gradient px-8 py-3 text-lg"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5 mr-2" />
                  Start Health Scan
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Scan Progress</span>
                <span className="text-sm text-blue-600">{Math.round(scanProgress)}%</span>
              </div>
              <Progress value={scanProgress} className="w-full h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResult && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <span>Health Analysis Results</span>
            </CardTitle>
            <CardDescription>
              AI-powered health assessment with {scanResult.confidence}% confidence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Health Score */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold">Overall Health Score</span>
                <span className="text-3xl font-bold text-blue-600">{scanResult.overallHealth}%</span>
              </div>
              <Progress value={scanResult.overallHealth} className="w-full h-3" />
            </div>

            {/* Detailed Findings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detailed Analysis</h3>
              {scanResult.findings.map((finding, index) => {
                const StatusIcon = getStatusIcon(finding.status);
                return (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-5 h-5" />
                        <span className="font-medium">{finding.category}</span>
                      </div>
                      <Badge className={getStatusColor(finding.status)}>
                        {finding.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {finding.description}
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Recommendation: {finding.recommendation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Risk Factors */}
            {scanResult.riskFactors.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Areas for attention:</strong> {scanResult.riskFactors.join(', ')}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}