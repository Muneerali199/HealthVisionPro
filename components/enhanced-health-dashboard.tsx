"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Heart, 
  Brain, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  Users,
  Zap,
  Target,
  Award,
  Clock,
  MapPin,
  Phone,
  Video,
  MessageSquare,
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
  LineChart
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { HealthAPI, initializeBackend } from '@/lib/backend/api-routes';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  trend: 'up' | 'down' | 'stable';
  target: number;
  lastUpdated: Date;
}

interface HealthGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  category: 'fitness' | 'nutrition' | 'mental-health' | 'medical';
  priority: 'low' | 'medium' | 'high';
}

interface Notification {
  id: string;
  type: 'reminder' | 'alert' | 'achievement' | 'appointment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function EnhancedHealthDashboard() {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(85);
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high' | 'critical'>('low');

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    setIsLoading(true);
    try {
      await initializeBackend();
      await loadHealthData();
      await loadNotifications();
      await loadHealthGoals();
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHealthData = async () => {
    // Simulate loading health metrics
    const metrics: HealthMetric[] = [
      {
        id: 'heart-rate',
        name: 'Resting Heart Rate',
        value: 68,
        unit: 'BPM',
        status: 'good',
        trend: 'stable',
        target: 65,
        lastUpdated: new Date()
      },
      {
        id: 'blood-pressure',
        name: 'Blood Pressure',
        value: 120,
        unit: 'mmHg',
        status: 'excellent',
        trend: 'down',
        target: 120,
        lastUpdated: new Date()
      },
      {
        id: 'weight',
        name: 'Weight',
        value: 75,
        unit: 'kg',
        status: 'good',
        trend: 'down',
        target: 72,
        lastUpdated: new Date()
      },
      {
        id: 'sleep',
        name: 'Sleep Quality',
        value: 7.5,
        unit: 'hours',
        status: 'good',
        trend: 'up',
        target: 8,
        lastUpdated: new Date()
      },
      {
        id: 'steps',
        name: 'Daily Steps',
        value: 8500,
        unit: 'steps',
        status: 'good',
        trend: 'up',
        target: 10000,
        lastUpdated: new Date()
      },
      {
        id: 'stress',
        name: 'Stress Level',
        value: 3,
        unit: '/10',
        status: 'good',
        trend: 'down',
        target: 2,
        lastUpdated: new Date()
      }
    ];

    setHealthMetrics(metrics);
    
    // Calculate overall health score
    const avgScore = metrics.reduce((sum, metric) => {
      const statusScores = { excellent: 100, good: 80, fair: 60, poor: 40, critical: 20 };
      return sum + statusScores[metric.status];
    }, 0) / metrics.length;
    
    setHealthScore(Math.round(avgScore));
    
    // Determine risk level
    if (avgScore >= 90) setRiskLevel('low');
    else if (avgScore >= 70) setRiskLevel('moderate');
    else if (avgScore >= 50) setRiskLevel('high');
    else setRiskLevel('critical');
  };

  const loadNotifications = async () => {
    const notifications: Notification[] = [
      {
        id: '1',
        type: 'reminder',
        title: 'Medication Reminder',
        message: 'Time to take your morning medication',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: 'Dr. Smith consultation tomorrow at 2:00 PM',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'achievement',
        title: 'Goal Achieved!',
        message: 'You reached your weekly step goal',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
        priority: 'low'
      },
      {
        id: '4',
        type: 'alert',
        title: 'Health Alert',
        message: 'Blood pressure reading is slightly elevated',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
        priority: 'high'
      }
    ];

    setNotifications(notifications);
  };

  const loadHealthGoals = async () => {
    const goals: HealthGoal[] = [
      {
        id: '1',
        title: 'Lose 5kg',
        description: 'Reach target weight through diet and exercise',
        target: 70,
        current: 75,
        unit: 'kg',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        category: 'fitness',
        priority: 'high'
      },
      {
        id: '2',
        title: '10,000 Steps Daily',
        description: 'Maintain consistent daily activity',
        target: 10000,
        current: 8500,
        unit: 'steps',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: 'fitness',
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Reduce Stress',
        description: 'Practice meditation and stress management',
        target: 2,
        current: 3,
        unit: '/10',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        category: 'mental-health',
        priority: 'high'
      },
      {
        id: '4',
        title: 'Improve Sleep',
        description: 'Get 8 hours of quality sleep nightly',
        target: 8,
        current: 7.5,
        unit: 'hours',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        category: 'fitness',
        priority: 'medium'
      }
    ];

    setHealthGoals(goals);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  const getTrendColor = (trend: string, isGoodDirection: boolean) => {
    if (trend === 'stable') return 'text-gray-500';
    const isPositive = (trend === 'up' && isGoodDirection) || (trend === 'down' && !isGoodDirection);
    return isPositive ? 'text-green-500' : 'text-red-500';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder': return Clock;
      case 'alert': return AlertTriangle;
      case 'achievement': return Award;
      case 'appointment': return Calendar;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return Activity;
      case 'nutrition': return Target;
      case 'mental-health': return Brain;
      case 'medical': return Heart;
      default: return Target;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const urgentNotifications = notifications.filter(n => n.priority === 'urgent' || n.priority === 'high');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Quick Actions */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-emerald-600" />
                <span>Enhanced Health Dashboard</span>
              </CardTitle>
              <CardDescription>
                Comprehensive health monitoring and AI-powered insights
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              {urgentNotifications.length > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {urgentNotifications.length} Urgent
                </Badge>
              )}
              <Badge variant="secondary" className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>AI Active</span>
              </Badge>
              <Button className="health-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Quick Scan
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Health Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-effect">
          <CardHeader>
            <CardTitle>AI Health Score Analysis</CardTitle>
            <CardDescription>Real-time health assessment with predictive insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg">
                  <Shield className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Overall Health Score</p>
                  <p className="text-4xl font-bold text-emerald-600 mb-2">{healthScore}%</p>
                  <Progress value={healthScore} className="mb-2" />
                  <Badge className={`${riskLevel === 'low' ? 'bg-green-100 text-green-800' : 
                    riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                    riskLevel === 'high' ? 'bg-orange-100 text-orange-800' : 
                    'bg-red-100 text-red-800'}`}>
                    {riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">AI Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span>Cardiovascular health improving by 8%</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span>Stress levels within optimal range</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span>Activity goals 85% achieved this week</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Target className="w-4 h-4 text-orange-600" />
                    <span>Sleep quality needs attention</span>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Detailed Analysis
                  </Button>
                  <Button className="w-full health-gradient">
                    <Zap className="w-4 h-4 mr-2" />
                    AI Recommendations
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <span>Notifications</span>
              {unreadNotifications.length > 0 && (
                <Badge variant="destructive">{unreadNotifications.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.slice(0, 5).map((notification) => {
                const NotificationIcon = getNotificationIcon(notification.type);
                return (
                  <div key={notification.id} className={`p-3 rounded-lg border ${
                    notification.read ? 'bg-slate-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-700'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        getPriorityColor(notification.priority)
                      }`}>
                        <NotificationIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{notification.message}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button className="w-full mt-4" variant="outline">
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthMetrics.map((metric) => {
          const TrendIcon = getTrendIcon(metric.trend);
          const isGoodDirection = ['heart-rate', 'blood-pressure', 'weight', 'stress'].includes(metric.id) ? 
            metric.trend === 'down' : metric.trend === 'up';
          
          return (
            <Card key={metric.id} className="glass-effect health-card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(metric.status)}`}>
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{metric.name}</p>
                      <Badge className={getStatusColor(metric.status)} variant="outline">
                        {metric.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <TrendIcon className={`w-5 h-5 ${getTrendColor(metric.trend, isGoodDirection)}`} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {metric.value}{metric.unit}
                    </span>
                    <span className="text-sm text-slate-500">
                      Target: {metric.target}{metric.unit}
                    </span>
                  </div>
                  
                  <Progress 
                    value={Math.min(100, (metric.value / metric.target) * 100)} 
                    className="h-2" 
                  />
                  
                  <p className="text-xs text-slate-500">
                    Last updated: {metric.lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Health Goals */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-purple-600" />
                <span>Health Goals</span>
              </CardTitle>
              <CardDescription>Track your progress towards health objectives</CardDescription>
            </div>
            <Button className="health-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthGoals.map((goal) => {
              const CategoryIcon = getCategoryIcon(goal.category);
              const progress = Math.min(100, (goal.current / goal.target) * 100);
              const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={goal.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{goal.title}</h3>
                          <p className="text-sm text-slate-600">{goal.description}</p>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(goal.priority)} variant="outline">
                        {goal.priority}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.current} / {goal.target} {goal.unit}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{Math.round(progress)}% complete</span>
                        <span>{daysLeft} days left</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { icon: Activity, label: 'Health Scan', color: 'bg-blue-100 text-blue-600' },
          { icon: Calendar, label: 'Appointments', color: 'bg-green-100 text-green-600' },
          { icon: FileText, label: 'Reports', color: 'bg-purple-100 text-purple-600' },
          { icon: Video, label: 'Telemedicine', color: 'bg-orange-100 text-orange-600' },
          { icon: MessageSquare, label: 'AI Assistant', color: 'bg-pink-100 text-pink-600' },
          { icon: Settings, label: 'Settings', color: 'bg-gray-100 text-gray-600' }
        ].map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2 health-card-hover"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}