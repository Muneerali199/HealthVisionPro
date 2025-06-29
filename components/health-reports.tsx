"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FileText, TrendingUp, TrendingDown, Heart, Activity, Brain, Eye, Settings as Lungs, Apple, Dumbbell, Moon, Download, Share, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface HealthMetric {
  category: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'fair' | 'poor';
  recommendation: string;
}

export function HealthReports() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  const healthMetrics: HealthMetric[] = [
    {
      category: 'Cardiovascular',
      score: 85,
      trend: 'up',
      status: 'good',
      recommendation: 'Continue regular exercise and monitor blood pressure'
    },
    {
      category: 'Respiratory',
      score: 92,
      trend: 'stable',
      status: 'excellent',
      recommendation: 'Maintain current activity level'
    },
    {
      category: 'Mental Health',
      score: 78,
      trend: 'up',
      status: 'good',
      recommendation: 'Consider stress management techniques'
    },
    {
      category: 'Sleep Quality',
      score: 72,
      trend: 'down',
      status: 'fair',
      recommendation: 'Improve sleep hygiene and maintain consistent schedule'
    },
    {
      category: 'Nutrition',
      score: 88,
      trend: 'up',
      status: 'excellent',
      recommendation: 'Excellent dietary choices, continue current plan'
    },
    {
      category: 'Physical Activity',
      score: 80,
      trend: 'stable',
      status: 'good',
      recommendation: 'Add 2 more strength training sessions per week'
    }
  ];

  const vitalsHistory = [
    { date: '2024-01-01', heartRate: 68, bloodPressure: 118, weight: 165, bmi: 24.2 },
    { date: '2024-01-08', heartRate: 70, bloodPressure: 120, weight: 164, bmi: 24.1 },
    { date: '2024-01-15', heartRate: 72, bloodPressure: 122, weight: 163, bmi: 24.0 },
    { date: '2024-01-22', heartRate: 69, bloodPressure: 119, weight: 164, bmi: 24.1 },
    { date: '2024-01-29', heartRate: 71, bloodPressure: 121, weight: 162, bmi: 23.9 }
  ];

  const symptomsData = [
    { symptom: 'Headaches', frequency: 12, severity: 'Mild' },
    { symptom: 'Fatigue', frequency: 8, severity: 'Moderate' },
    { symptom: 'Joint Pain', frequency: 5, severity: 'Mild' },
    { symptom: 'Sleep Issues', frequency: 15, severity: 'Moderate' }
  ];

  const labResults = [
    { test: 'Cholesterol', value: 180, unit: 'mg/dL', normal: '< 200', status: 'normal' },
    { test: 'Blood Sugar', value: 95, unit: 'mg/dL', normal: '70-100', status: 'normal' },
    { test: 'Blood Pressure', value: '120/80', unit: 'mmHg', normal: '< 120/80', status: 'normal' },
    { test: 'BMI', value: 24.0, unit: 'kg/m²', normal: '18.5-24.9', status: 'normal' },
    { test: 'Vitamin D', value: 28, unit: 'ng/mL', normal: '30-100', status: 'low' }
  ];

  const radarData = healthMetrics.map(metric => ({
    category: metric.category,
    score: metric.score
  }));

  const pieData = [
    { name: 'Excellent', value: 35, color: '#10b981' },
    { name: 'Good', value: 40, color: '#3b82f6' },
    { name: 'Fair', value: 20, color: '#f59e0b' },
    { name: 'Poor', value: 5, color: '#ef4444' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cardiovascular': return Heart;
      case 'respiratory': return Lungs;
      case 'mental health': return Brain;
      case 'sleep quality': return Moon;
      case 'nutrition': return Apple;
      case 'physical activity': return Dumbbell;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-indigo-600" />
                <span>Health Reports & Analytics</span>
              </CardTitle>
              <CardDescription>Comprehensive health insights and trends</CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedTimeframe('week')}>
                  Week
                </Button>
                <Button 
                  variant={selectedTimeframe === 'month' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setSelectedTimeframe('month')}
                >
                  Month
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedTimeframe('year')}>
                  Year
                </Button>
              </div>
              <Button className="health-gradient">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Health Score Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Health Score Breakdown</CardTitle>
                <CardDescription>Overall health assessment by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Health Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Health Distribution</CardTitle>
                <CardDescription>Overall health status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Detailed Health Metrics</CardTitle>
              <CardDescription>Individual category analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {healthMetrics.map((metric, index) => {
                  const CategoryIcon = getCategoryIcon(metric.category);
                  const TrendIcon = getTrendIcon(metric.trend);
                  
                  return (
                    <div key={index} className="p-6 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <CategoryIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{metric.category}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(metric.status)}>
                                {metric.status}
                              </Badge>
                              <TrendIcon className={`w-4 h-4 ${getTrendColor(metric.trend)}`} />
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-blue-600">{metric.score}%</p>
                          <p className="text-sm text-slate-500">Health Score</p>
                        </div>
                      </div>
                      
                      <Progress value={metric.score} className="h-2" />
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          <strong>Recommendation:</strong> {metric.recommendation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Vital Signs Trends</CardTitle>
              <CardDescription>Historical vital signs data over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={vitalsHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name="Heart Rate" />
                  <Line type="monotone" dataKey="bloodPressure" stroke="#3b82f6" strokeWidth={2} name="Blood Pressure" />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} name="Weight" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Symptom Tracking</CardTitle>
              <CardDescription>Frequency and severity of reported symptoms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {symptomsData.map((symptom, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{symptom.symptom}</h3>
                      <Badge className={symptom.severity === 'Mild' ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'}>
                        {symptom.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Frequency this month</span>
                          <span>{symptom.frequency} times</span>
                        </div>
                        <Progress value={symptom.frequency * 3} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Laboratory Results</CardTitle>
              <CardDescription>Recent lab work and biomarkers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {labResults.map((lab, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        {lab.status === 'normal' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{lab.test}</p>
                        <p className="text-sm text-slate-600">Normal: {lab.normal}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold">{lab.value} {lab.unit}</p>
                      <Badge className={getStatusColor(lab.status)}>
                        {lab.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>AI Health Insights</CardTitle>
              <CardDescription>Personalized recommendations based on your health data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Brain className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Key Health Insights</h3>
                      <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                        <li>• Your cardiovascular health has improved 12% over the past month</li>
                        <li>• Sleep quality correlation with stress levels shows 85% accuracy</li>
                        <li>• Vitamin D deficiency may be contributing to fatigue symptoms</li>
                        <li>• Exercise consistency has positive impact on mental health scores</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Recommended Actions</h3>
                      <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                        <li>• Schedule vitamin D supplementation consultation</li>
                        <li>• Implement consistent sleep schedule (10 PM - 6 AM)</li>
                        <li>• Add 2 strength training sessions per week</li>
                        <li>• Consider stress management techniques (meditation, yoga)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Areas for Attention</h3>
                      <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                        <li>• Sleep quality has declined 8% this month</li>
                        <li>• Headache frequency increased - consider triggers</li>
                        <li>• Blood pressure trending upward - monitor closely</li>
                        <li>• Medication adherence at 78% - set more reminders</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}