"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Droplets, 
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface VitalSign {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: any;
  color: string;
  normal: { min: number; max: number };
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

export function VitalsMonitor() {
  const [vitals, setVitals] = useState<VitalSign[]>([
    {
      id: 'heartRate',
      name: 'Heart Rate',
      value: 72,
      unit: 'BPM',
      icon: Heart,
      color: 'text-red-600',
      normal: { min: 60, max: 100 },
      status: 'normal',
      trend: 'stable'
    },
    {
      id: 'bloodPressure',
      name: 'Blood Pressure',
      value: 120,
      unit: 'mmHg',
      icon: Activity,
      color: 'text-blue-600',
      normal: { min: 90, max: 140 },
      status: 'normal',
      trend: 'stable'
    },
    {
      id: 'temperature',
      name: 'Temperature',
      value: 98.6,
      unit: '°F',
      icon: Thermometer,
      color: 'text-orange-600',
      normal: { min: 97, max: 100 },
      status: 'normal',
      trend: 'stable'
    },
    {
      id: 'oxygenSat',
      name: 'Oxygen Saturation',
      value: 98,
      unit: '%',
      icon: Droplets,
      color: 'text-cyan-600',
      normal: { min: 95, max: 100 },
      status: 'normal',
      trend: 'stable'
    }
  ]);

  const [historicalData, setHistoricalData] = useState([
    { time: '10:00', heartRate: 68, bloodPressure: 118, temperature: 98.4, oxygenSat: 99 },
    { time: '10:15', heartRate: 70, bloodPressure: 120, temperature: 98.5, oxygenSat: 98 },
    { time: '10:30', heartRate: 72, bloodPressure: 122, temperature: 98.6, oxygenSat: 97 },
    { time: '10:45', heartRate: 74, bloodPressure: 119, temperature: 98.7, oxygenSat: 98 },
    { time: '11:00', heartRate: 72, bloodPressure: 121, temperature: 98.6, oxygenSat: 98 },
    { time: '11:15', heartRate: 71, bloodPressure: 120, temperature: 98.5, oxygenSat: 99 }
  ]);

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [alerts, setAlerts] = useState<string[]>([]);

  // Simulate real-time vital signs updates
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setVitals(prev => prev.map(vital => {
        const variance = (Math.random() - 0.5) * 0.1;
        let newValue = vital.value + (vital.value * variance);
        
        // Ensure values stay within reasonable bounds
        switch (vital.id) {
          case 'heartRate':
            newValue = Math.max(50, Math.min(150, newValue));
            break;
          case 'bloodPressure':
            newValue = Math.max(80, Math.min(180, newValue));
            break;
          case 'temperature':
            newValue = Math.max(96, Math.min(102, newValue));
            break;
          case 'oxygenSat':
            newValue = Math.max(90, Math.min(100, newValue));
            break;
        }

        // Determine status
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        if (newValue < vital.normal.min * 0.9 || newValue > vital.normal.max * 1.1) {
          status = 'critical';
        } else if (newValue < vital.normal.min || newValue > vital.normal.max) {
          status = 'warning';
        }

        // Determine trend
        const trend = newValue > vital.value ? 'up' : newValue < vital.value ? 'down' : 'stable';

        return {
          ...vital,
          value: Math.round(newValue * 10) / 10,
          status,
          trend
        };
      }));

      // Update historical data
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      setHistoricalData(prev => {
        const newData = [...prev];
        if (newData.length >= 20) {
          newData.shift();
        }
        
        const currentVitals = vitals.reduce((acc, vital) => {
          acc[vital.id] = vital.value;
          return acc;
        }, {} as any);
        
        newData.push({
          time: timeStr,
          ...currentVitals
        });
        
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring, vitals]);

  // Check for alerts
  useEffect(() => {
    const newAlerts: string[] = [];
    vitals.forEach(vital => {
      if (vital.status === 'critical') {
        newAlerts.push(`Critical: ${vital.name} is ${vital.value} ${vital.unit}`);
      } else if (vital.status === 'warning') {
        newAlerts.push(`Warning: ${vital.name} is ${vital.value} ${vital.unit}`);
      }
    });
    setAlerts(newAlerts);
  }, [vitals]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return CheckCircle;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-500';
      case 'down': return 'text-blue-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Monitoring Controls */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-yellow-600" />
                <span>Live Vitals Monitor</span>
              </CardTitle>
              <CardDescription>Real-time patient vital signs monitoring</CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={isMonitoring ? "default" : "secondary"} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span>{isMonitoring ? 'MONITORING' : 'PAUSED'}</span>
              </Badge>
              <Button
                variant={isMonitoring ? "outline" : "default"}
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={isMonitoring ? '' : 'health-gradient'}
              >
                {isMonitoring ? (
                  <>Pause Monitor</>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start Monitor
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert key={index} className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800">{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Current Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vitals.map((vital) => {
          const VitalIcon = vital.icon;
          const TrendIcon = getTrendIcon(vital.trend);
          
          return (
            <Card key={vital.id} className={`glass-effect health-card-hover ${vital.status === 'critical' ? 'ring-2 ring-red-500' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <VitalIcon className={`w-8 h-8 ${vital.color} ${vital.status === 'normal' ? 'vitals-animation' : ''}`} />
                  <Badge className={getStatusColor(vital.status)}>
                    {vital.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{vital.name}</p>
                  <div className="flex items-center justify-between">
                    <p className={`text-3xl font-bold ${vital.color}`}>
                      {vital.value}{vital.unit}
                    </p>
                    <TrendIcon className={`w-5 h-5 ${getTrendColor(vital.trend)}`} />
                  </div>
                  <p className="text-xs text-slate-500">
                    Normal: {vital.normal.min}-{vital.normal.max} {vital.unit}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Historical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Heart Rate & Blood Pressure</CardTitle>
            <CardDescription>Real-time cardiovascular monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  name="Heart Rate (BPM)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="bloodPressure" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  name="Blood Pressure (mmHg)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Temperature & Oxygen Saturation</CardTitle>
            <CardDescription>Respiratory and metabolic indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stackId="1"
                  stroke="#f97316" 
                  fill="#f97316" 
                  fillOpacity={0.3}
                  name="Temperature (°F)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="oxygenSat" 
                  stackId="2"
                  stroke="#06b6d4" 
                  fill="#06b6d4" 
                  fillOpacity={0.3}
                  name="Oxygen Saturation (%)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>24-Hour Summary</CardTitle>
          <CardDescription>Average, minimum, and maximum values over the past 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vitals.map((vital) => (
              <div key={`${vital.id}-summary`} className="space-y-2">
                <p className="font-medium text-slate-700 dark:text-slate-300">{vital.name}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current:</span>
                    <span className="font-medium">{vital.value} {vital.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Avg 24h:</span>
                    <span className="font-medium">{(vital.value * 0.95).toFixed(1)} {vital.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Range:</span>
                    <span className="font-medium text-xs">
                      {(vital.value * 0.9).toFixed(1)} - {(vital.value * 1.1).toFixed(1)} {vital.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}