"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Brain,
  Target,
  Award,
  Calendar,
  Download,
  Share,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Shield
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  target: number;
  history: Array<{ date: string; value: number }>;
}

interface HealthGoal {
  id: string;
  title: string;
  category: 'fitness' | 'nutrition' | 'mental-health' | 'medical';
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  progress: number;
  status: 'on-track' | 'behind' | 'ahead' | 'completed';
}

interface HealthInsight {
  id: string;
  type: 'achievement' | 'warning' | 'recommendation' | 'trend';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionRequired: boolean;
  relatedMetrics: string[];
}

export function HealthAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [overallScore, setOverallScore] = useState(85);

  useEffect(() => {
    loadHealthData();
  }, [timeframe, selectedCategory]);

  const loadHealthData = async () => {
    // Simulate loading health analytics data
    const metrics: HealthMetric[] = [
      {
        id: 'heart-rate',
        name: 'Resting Heart Rate',
        value: 68,
        unit: 'BPM',
        trend: 'down',
        change: -3,
        status: 'excellent',
        target: 65,
        history: generateHistory(70, 30)
      },
      {
        id: 'blood-pressure',
        name: 'Blood Pressure',
        value: 118,
        unit: 'mmHg',
        trend: 'stable',
        change: 0,
        status: 'excellent',
        target: 120,
        history: generateHistory(120, 30)
      },
      {
        id: 'weight',
        name: 'Weight',
        value: 72,
        unit: 'kg',
        trend: 'down',
        change: -2,
        status: 'good',
        target: 70,
        history: generateHistory(75, 30)
      },
      {
        id: 'sleep',
        name: 'Sleep Quality',
        value: 7.8,
        unit: 'hours',
        trend: 'up',
        change: 0.5,
        status: 'good',
        target: 8,
        history: generateHistory(7.5, 30)
      },
      {
        id: 'steps',
        name: 'Daily Steps',
        value: 9200,
        unit: 'steps',
        trend: 'up',
        change: 800,
        status: 'good',
        target: 10000,
        history: generateHistory(8500, 30)
      },
      {
        id: 'stress',
        name: 'Stress Level',
        value: 3.2,
        unit: '/10',
        trend: 'down',
        change: -0.8,
        status: 'good',
        target: 3,
        history: generateHistory(4, 30)
      }
    ];

    const goals: HealthGoal[] = [
      {
        id: '1',
        title: 'Lose 5kg',
        category: 'fitness',
        target: 70,
        current: 72,
        unit: 'kg',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        progress: 60,
        status: 'on-track'
      },
      {
        id: '2',
        title: '10,000 Steps Daily',
        category: 'fitness',
        target: 10000,
        current: 9200,
        unit: 'steps',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        progress: 92,
        status: 'on-track'
      },
      {
        id: '3',
        title: 'Reduce Stress',
        category: 'mental-health',
        target: 3,
        current: 3.2,
        unit: '/10',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        progress: 80,
        status: 'on-track'
      },
      {
        id: '4',
        title: 'Improve Sleep',
        category: 'fitness',
        target: 8,
        current: 7.8,
        unit: 'hours',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        progress: 97,
        status: 'ahead'
      }
    ];

    const healthInsights: HealthInsight[] = [
      {
        id: '1',
        type: 'achievement',
        title: 'Sleep Quality Improved',
        description: 'Your sleep quality has improved by 15% over the past month',
        priority: 'medium',
        actionRequired: false,
        relatedMetrics: ['sleep']
      },
      {
        id: '2',
        type: 'warning',
        title: 'Weight Goal Behind Schedule',
        description: 'You need to increase activity to meet your weight loss goal',
        priority: 'high',
        actionRequired: true,
        relatedMetrics: ['weight', 'steps']
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Increase Daily Activity',
        description: 'Adding 800 more steps daily will help you reach your fitness goals',
        priority: 'medium',
        actionRequired: true,
        relatedMetrics: ['steps']
      },
      {
        id: '4',
        type: 'trend',
        title: 'Heart Rate Trending Down',
        description: 'Your resting heart rate has decreased by 3 BPM, indicating improved fitness',
        priority: 'low',
        actionRequired: false,
        relatedMetrics: ['heart-rate']
      }
    ];

    setHealthMetrics(metrics);
    setHealthGoals(goals);
    setInsights(healthInsights);
  };

  const generateHistory = (baseValue: number, days: number) => {
    const history = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variation = (Math.random() - 0.5) * 0.2 * baseValue;
      history.push({
        date: date.toISOString().split('T')[0],
        value: Math.round((baseValue + variation) * 10) / 10
      });
    }
    return history;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return Award;
      case 'warning': return AlertTriangle;
      case 'recommendation': return Target;
      case 'trend': return TrendingUp;
      default: return Activity;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-red-600 bg-red-50 border-red-200';
      case 'recommendation': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'trend': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const radarData = healthMetrics.map(metric => ({
    metric: metric.name,
    score: (metric.value / metric.target) * 100
  }));

  const pieData = [
    { name: 'Excellent', value: 35, color: '#10b981' },
    { name: 'Good', value: 40, color: '#3b82f6' },
    { name: 'Fair', value: 20, color: '#f59e0b' },
    { name: 'Poor', value: 5, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <span>Health Analytics Dashboard</span>
              </CardTitle>
              <CardDescription>
                Comprehensive health data analysis and insights
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="health-gradient">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Health Score */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Overall Health Score</CardTitle>
          <CardDescription>AI-powered comprehensive health assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg">
              <Shield className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Health Score</p>
              <p className="text-4xl font-bold text-emerald-600 mb-2">{overallScore}%</p>
              <Progress value={overallScore} className="mb-2" />
              <Badge className="bg-green-100 text-green-800">EXCELLENT</Badge>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Key Improvements</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>Sleep quality +15%</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span>Stress level -20%</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>Activity level +12%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Health Distribution</h3>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
          <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="trends">Trends Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
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
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>
                          {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit} this {timeframe}
                        </span>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Radar Chart */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Health Profile Overview</CardTitle>
              <CardDescription>Comprehensive view of all health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 120]} tick={{ fontSize: 10 }} />
                  <Radar name="Health Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthGoals.map((goal) => {
              const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={goal.id} className="glass-effect">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{goal.title}</h3>
                          <p className="text-sm text-slate-600 capitalize">{goal.category.replace('-', ' ')}</p>
                        </div>
                        <Badge className={
                          goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                          goal.status === 'ahead' ? 'bg-blue-100 text-blue-800' :
                          goal.status === 'on-track' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {goal.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.current} / {goal.target} {goal.unit}</span>
                        </div>
                        <Progress value={goal.progress} className="h-3" />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{goal.progress}% complete</span>
                          <span>{daysLeft} days left</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Target className="w-4 h-4 mr-1" />
                          Adjust
                        </Button>
                        <Button size="sm" className="flex-1 health-gradient">
                          <Activity className="w-4 h-4 mr-1" />
                          Track
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {insights.map((insight) => {
              const InsightIcon = getInsightIcon(insight.type);
              
              return (
                <Card key={insight.id} className={`glass-effect ${getInsightColor(insight.type)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/50">
                        <InsightIcon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge variant="outline" className={
                            insight.priority === 'high' ? 'border-red-300 text-red-700' :
                            insight.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                            'border-blue-300 text-blue-700'
                          }>
                            {insight.priority.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <p className="text-sm mb-3">{insight.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-1">
                            {insight.relatedMetrics.map((metric, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {metric}
                              </Badge>
                            ))}
                          </div>
                          
                          {insight.actionRequired && (
                            <Button size="sm" variant="outline">
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {healthMetrics.slice(0, 4).map((metric) => (
              <Card key={metric.id} className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-lg">{metric.name} Trend</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={metric.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}