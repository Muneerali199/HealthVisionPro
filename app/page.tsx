"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Heart, 
  Brain, 
  Stethoscope, 
  Camera, 
  Calendar, 
  FileText, 
  AlertTriangle,
  Pill,
  Dumbbell,
  Apple,
  Moon,
  Users,
  TrendingUp,
  Shield,
  Phone,
  Video,
  MessageSquare,
  Zap,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Share,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Clock,
  MapPin,
  Mail,
  User
} from 'lucide-react';
import { AdvancedHealthScanner } from '@/components/advanced-health-scanner';
import { PatientDashboard } from '@/components/patient-dashboard';
import { VitalsMonitor } from '@/components/vitals-monitor';
import { AppointmentScheduler } from '@/components/appointment-scheduler';
import { MedicationTracker } from '@/components/medication-tracker';
import { HealthReports } from '@/components/health-reports';
import { TelemedicinePlatform } from '@/components/telemedicine-platform';
import { MedicalAIAssistant } from '@/components/medical-ai-assistant';
import { EnhancedHealthDashboard } from '@/components/enhanced-health-dashboard';
import { AIHealthAssistant } from '@/components/ai-health-assistant';
import { ComprehensiveHealthScanner } from '@/components/comprehensive-health-scanner';
import { DoctorConsultationPlatform } from '@/components/doctor-consultation-platform';
import { HealthAnalyticsDashboard } from '@/components/health-analytics-dashboard';
import { NutritionTracker } from '@/components/nutrition-tracker';
import { FitnessTracker } from '@/components/fitness-tracker';
import { initializeBackend } from '@/lib/backend/api-routes';
import { DoctorConsultationService } from '@/lib/backend/doctor-consultation';

export default function HealthVisionHome() {
  const [activeModule, setActiveModule] = useState('enhanced-dashboard');
  const [healthScore, setHealthScore] = useState(85);
  const [isScanning, setIsScanning] = useState(false);
  const [isBackendReady, setIsBackendReady] = useState(false);

  useEffect(() => {
    // Initialize backend systems
    const initSystems = async () => {
      try {
        await initializeBackend();
        await DoctorConsultationService.initializeSampleDoctors();
        setIsBackendReady(true);
      } catch (error) {
        console.error('Failed to initialize backend:', error);
      }
    };

    initSystems();

    // Simulate real-time health score updates
    const interval = setInterval(() => {
      setHealthScore(prev => Math.max(70, Math.min(100, prev + (Math.random() - 0.5) * 2)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const quickStats = [
    { icon: Heart, label: 'Heart Rate', value: '72 BPM', status: 'normal', color: 'text-green-600' },
    { icon: Activity, label: 'Blood Pressure', value: '120/80', status: 'optimal', color: 'text-blue-600' },
    { icon: Brain, label: 'Mental Health', value: '8.5/10', status: 'good', color: 'text-purple-600' },
    { icon: Shield, label: 'Overall Health', value: `${Math.round(healthScore)}%`, status: 'excellent', color: 'text-emerald-600' }
  ];

  const healthModules = [
    { id: 'enhanced-dashboard', icon: BarChart3, title: 'Enhanced Dashboard', desc: 'Comprehensive health overview' },
    { id: 'comprehensive-scanner', icon: Camera, title: 'Advanced Scanner', desc: 'Multi-modal health analysis' },
    { id: 'ai-assistant', icon: Brain, title: 'AI Assistant', desc: 'Advanced medical AI support' },
    { id: 'doctor-consultation', icon: Stethoscope, title: 'Doctor Consultation', desc: 'Connect with real doctors' },
    { id: 'health-analytics', icon: BarChart3, title: 'Health Analytics', desc: 'Advanced health insights' },
    { id: 'nutrition-tracker', icon: Apple, title: 'Nutrition Tracker', desc: 'Track your daily nutrition' },
    { id: 'fitness-tracker', icon: Dumbbell, title: 'Fitness Tracker', desc: 'Monitor workouts & goals' },
    { id: 'dashboard', icon: Activity, title: 'Patient Dashboard', desc: 'Personal health overview' },
    { id: 'vitals', icon: Heart, title: 'Vitals Monitor', desc: 'Real-time health tracking' },
    { id: 'telemedicine', icon: Video, title: 'Telemedicine', desc: 'Virtual consultations' },
    { id: 'appointments', icon: Calendar, title: 'Appointments', desc: 'Schedule & manage visits' },
    { id: 'medications', icon: Pill, title: 'Medications', desc: 'Track prescriptions & reminders' },
    { id: 'reports', icon: FileText, title: 'Health Reports', desc: 'Detailed analytics & insights' }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'enhanced-dashboard':
        return <EnhancedHealthDashboard />;
      case 'comprehensive-scanner':
        return <ComprehensiveHealthScanner />;
      case 'ai-assistant':
        return <AIHealthAssistant />;
      case 'doctor-consultation':
        return <DoctorConsultationPlatform />;
      case 'health-analytics':
        return <HealthAnalyticsDashboard />;
      case 'nutrition-tracker':
        return <NutritionTracker />;
      case 'fitness-tracker':
        return <FitnessTracker />;
      case 'scanner':
        return <AdvancedHealthScanner />;
      case 'dashboard':
        return <PatientDashboard healthScore={healthScore} />;
      case 'vitals':
        return <VitalsMonitor />;
      case 'telemedicine':
        return <TelemedicinePlatform />;
      case 'appointments':
        return <AppointmentScheduler />;
      case 'medications':
        return <MedicationTracker />;
      case 'reports':
        return <HealthReports />;
      default:
        return <EnhancedHealthDashboard />;
    }
  };

  if (!isBackendReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Initializing HealthVision Pro</h2>
          <p className="text-slate-600 dark:text-slate-300">Loading advanced AI health systems with Gemini AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Advanced Header */}
      <header className="glass-effect border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="health-gradient p-3 rounded-xl">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">HealthVision Pro</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">Advanced AI-Powered Health Management Platform with Gemini AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Gemini AI Active</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Premium</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>HIPAA Compliant</span>
              </Badge>
              <Button size="sm" className="health-gradient">
                <Phone className="w-4 h-4 mr-2" />
                Emergency
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Quick Stats */}
      <section className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="glass-effect health-card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {stat.status}
                    </Badge>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color} vitals-animation`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI-Enhanced Health Score */}
        <Card className="glass-effect mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-emerald-600" />
              <span>Gemini AI-Powered Health Score</span>
            </CardTitle>
            <CardDescription>Comprehensive health assessment using Google's advanced Gemini AI algorithms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Health Index</span>
                  <span className="text-3xl font-bold text-emerald-600">{Math.round(healthScore)}%</span>
                </div>
                <Progress value={healthScore} className="w-full h-3" />
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Poor</span>
                  <span>Fair</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Gemini AI Insights</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span>Cardiovascular health improving by 12%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span>Stress levels within optimal range</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span>Activity goals 85% achieved this week</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span>Sleep quality needs attention</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Quick Actions</h3>
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setActiveModule('comprehensive-scanner')}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Advanced AI Scan
                  </Button>
                  <Button 
                    size="sm" 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setActiveModule('ai-assistant')}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask Gemini AI
                  </Button>
                  <Button 
                    size="sm" 
                    className="w-full health-gradient"
                    onClick={() => setActiveModule('doctor-consultation')}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Consult Real Doctor
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Module Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {healthModules.map((module) => (
            <Button
              key={module.id}
              variant={activeModule === module.id ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                activeModule === module.id ? 'health-gradient' : 'glass-effect'
              } health-card-hover`}
              onClick={() => setActiveModule(module.id)}
            >
              <module.icon className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium text-sm">{module.title}</p>
                <p className="text-xs opacity-70">{module.desc}</p>
              </div>
            </Button>
          ))}
        </div>

        {/* Active Module Content */}
        <div className="space-y-6">
          {renderActiveModule()}
        </div>
      </section>
    </div>
  );
}