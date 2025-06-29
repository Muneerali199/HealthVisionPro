"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Heart, 
  Activity, 
  Thermometer, 
  Droplets, 
  Brain,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PatientData {
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
}

export function PatientDashboard({ healthScore }: { healthScore: number }) {
  const [patientData] = useState<PatientData>({
    name: "Sarah Johnson",
    age: 34,
    gender: "Female",
    bloodType: "A+",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
    address: "123 Health Street, Medical City, MC 12345",
    emergencyContact: "John Johnson - +1 (555) 987-6543",
    medicalHistory: ["Hypertension (2020)", "Appendectomy (2018)", "Migraine"],
    allergies: ["Penicillin", "Shellfish"],
    currentMedications: ["Lisinopril 10mg", "Vitamin D3", "Omega-3"]
  });

  const [vitalsData] = useState([
    { time: '00:00', heartRate: 68, bloodPressure: 120, temperature: 98.6 },
    { time: '04:00', heartRate: 72, bloodPressure: 118, temperature: 98.4 },
    { time: '08:00', heartRate: 75, bloodPressure: 122, temperature: 98.7 },
    { time: '12:00', heartRate: 78, bloodPressure: 125, temperature: 99.1 },
    { time: '16:00', heartRate: 74, bloodPressure: 121, temperature: 98.9 },
    { time: '20:00', heartRate: 71, bloodPressure: 119, temperature: 98.5 }
  ]);

  const [recentActivities] = useState([
    { type: 'appointment', title: 'Annual Physical Exam', time: '2 days ago', status: 'completed' },
    { type: 'medication', title: 'Medication Reminder', time: '4 hours ago', status: 'taken' },
    { type: 'scan', title: 'Health Scan Analysis', time: '1 day ago', status: 'reviewed' },
    { type: 'exercise', title: 'Morning Walk - 30 mins', time: '6 hours ago', status: 'completed' }
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'medication': return FileText;
      case 'scan': return Activity;
      case 'exercise': return Heart;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'taken': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Overview */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-6 h-6 text-blue-600" />
            <span>Patient Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {patientData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{patientData.name}</h2>
                  <p className="text-slate-600">{patientData.age} years old • {patientData.gender} • Blood Type: {patientData.bloodType}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>{patientData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>{patientData.email}</span>
                </div>
                <div className="flex items-center space-x-2 md:col-span-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>{patientData.address}</span>
                </div>
              </div>
            </div>

            {/* Health Score */}
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg">
                <Shield className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Health Score</p>
                <p className="text-3xl font-bold text-emerald-600">{Math.round(healthScore)}%</p>
                <Progress value={healthScore} className="mt-2" />
              </div>
              <Button className="w-full success-gradient">
                <AlertCircle className="w-4 h-4 mr-2" />
                Emergency Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-effect">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Heart Rate</p>
                    <p className="text-2xl font-bold text-red-600">72 BPM</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-600 vitals-animation" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Blood Pressure</p>
                    <p className="text-2xl font-bold text-blue-600">120/80</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Temperature</p>
                    <p className="text-2xl font-bold text-orange-600">98.6°F</p>
                  </div>
                  <Thermometer className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-effect">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Oxygen Sat</p>
                    <p className="text-2xl font-bold text-cyan-600">98%</p>
                  </div>
                  <Droplets className="w-8 h-8 text-cyan-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>24-Hour Vitals Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name="Heart Rate" />
                  <Line type="monotone" dataKey="bloodPressure" stroke="#3b82f6" strokeWidth={2} name="Blood Pressure" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientData.medicalHistory.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="flex-1">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Allergies & Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patientData.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="flex-1 text-red-800 dark:text-red-200">{allergy}</span>
                      <Badge variant="destructive">ALLERGY</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
              <CardDescription>Active prescriptions and supplements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientData.currentMedications.map((medication, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{medication}</p>
                        <p className="text-sm text-slate-600">Daily</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Timeline of recent health activities and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        <ActivityIcon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-slate-600">{activity.time}</p>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}