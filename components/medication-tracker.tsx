"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Pill, 
  Plus, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Bell,
  Calendar,
  Trash2,
  Edit,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice-daily' | 'three-times-daily' | 'weekly' | 'as-needed';
  times: string[];
  startDate: Date;
  endDate?: Date;
  totalPills: number;
  remainingPills: number;
  instructions: string;
  sideEffects?: string[];
  status: 'active' | 'paused' | 'completed' | 'discontinued';
  lastTaken?: Date;
  missedDoses: number;
}

interface Reminder {
  medicationId: string;
  medicationName: string;
  time: string;
  taken: boolean;
  skipped: boolean;
}

export function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'daily',
      times: ['08:00'],
      startDate: new Date('2024-01-01'),
      totalPills: 90,
      remainingPills: 67,
      instructions: 'Take with food',
      status: 'active',
      lastTaken: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      missedDoses: 2
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'twice-daily',
      times: ['08:00', '20:00'],
      startDate: new Date('2024-01-15'),
      totalPills: 60,
      remainingPills: 45,
      instructions: 'Take with meals',
      sideEffects: ['Nausea', 'Diarrhea'],
      status: 'active',
      lastTaken: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      missedDoses: 0
    },
    {
      id: '3',
      name: 'Vitamin D3',
      dosage: '1000 IU',
      frequency: 'daily',
      times: ['08:00'],
      startDate: new Date('2024-01-01'),
      totalPills: 100,
      remainingPills: 82,
      instructions: 'Take with breakfast',
      status: 'active',
      lastTaken: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      missedDoses: 1
    }
  ]);

  const [todaysReminders, setTodaysReminders] = useState<Reminder[]>([]);
  const [isAddingMedication, setIsAddingMedication] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'daily' as const,
    times: ['08:00'],
    totalPills: 30,
    instructions: ''
  });

  // Generate today's reminders
  useEffect(() => {
    const today = new Date();
    const reminders: Reminder[] = [];

    medications.forEach(med => {
      if (med.status === 'active') {
        med.times.forEach(time => {
          const [hour, minute] = time.split(':').map(Number);
          const reminderTime = new Date(today);
          reminderTime.setHours(hour, minute, 0, 0);

          const taken = med.lastTaken ? 
            med.lastTaken.toDateString() === today.toDateString() &&
            med.lastTaken.getHours() === hour : false;

          reminders.push({
            medicationId: med.id,
            medicationName: med.name,
            time,
            taken,
            skipped: false
          });
        });
      }
    });

    setTodaysReminders(reminders);
  }, [medications]);

  const getFrequencyTimes = (frequency: string): string[] => {
    switch (frequency) {
      case 'daily': return ['08:00'];
      case 'twice-daily': return ['08:00', '20:00'];
      case 'three-times-daily': return ['08:00', '12:00', '20:00'];
      case 'weekly': return ['08:00'];
      case 'as-needed': return [];
      default: return ['08:00'];
    }
  };

  const addMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast.error('Please fill in medication name and dosage');
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      ...newMedication,
      times: getFrequencyTimes(newMedication.frequency),
      startDate: new Date(),
      remainingPills: newMedication.totalPills,
      status: 'active',
      missedDoses: 0
    };

    setMedications(prev => [...prev, medication]);
    setIsAddingMedication(false);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'daily',
      times: ['08:00'],
      totalPills: 30,
      instructions: ''
    });
    toast.success('Medication added successfully!');
  };

  const markAsTaken = (medicationId: string, time: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medicationId) {
        return {
          ...med,
          lastTaken: new Date(),
          remainingPills: Math.max(0, med.remainingPills - 1)
        };
      }
      return med;
    }));

    setTodaysReminders(prev => prev.map(reminder => {
      if (reminder.medicationId === medicationId && reminder.time === time) {
        return { ...reminder, taken: true };
      }
      return reminder;
    }));

    toast.success('Medication marked as taken');
  };

  const skipDose = (medicationId: string, time: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medicationId) {
        return {
          ...med,
          missedDoses: med.missedDoses + 1
        };
      }
      return med;
    }));

    setTodaysReminders(prev => prev.map(reminder => {
      if (reminder.medicationId === medicationId && reminder.time === time) {
        return { ...reminder, skipped: true };
      }
      return reminder;
    }));

    toast.info('Dose marked as skipped');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'discontinued': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdherenceScore = (medication: Medication) => {
    const totalExpectedDoses = Math.floor((Date.now() - medication.startDate.getTime()) / (1000 * 60 * 60 * 24)) * medication.times.length;
    const takenDoses = totalExpectedDoses - medication.missedDoses;
    return totalExpectedDoses > 0 ? Math.round((takenDoses / totalExpectedDoses) * 100) : 100;
  };

  const urgentReminders = todaysReminders.filter(r => !r.taken && !r.skipped);
  const overdueReminders = urgentReminders.filter(r => {
    const [hour, minute] = r.time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hour, minute, 0, 0);
    return new Date() > reminderTime;
  });

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="w-6 h-6 text-purple-600" />
                <span>Medication Tracker</span>
              </CardTitle>
              <CardDescription>Manage medications and track adherence</CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              {overdueReminders.length > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  <Bell className="w-4 h-4 mr-1" />
                  {overdueReminders.length} Overdue
                </Badge>
              )}
              <Dialog open={isAddingMedication} onOpenChange={setIsAddingMedication}>
                <DialogTrigger asChild>
                  <Button className="health-gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medication
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Medication</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="medName">Medication Name</Label>
                      <Input
                        id="medName"
                        value={newMedication.name}
                        onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Lisinopril"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        value={newMedication.dosage}
                        onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                        placeholder="e.g., 10mg"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select 
                        value={newMedication.frequency} 
                        onValueChange={(value: any) => setNewMedication(prev => ({ ...prev, frequency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Once Daily</SelectItem>
                          <SelectItem value="twice-daily">Twice Daily</SelectItem>
                          <SelectItem value="three-times-daily">Three Times Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="as-needed">As Needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="totalPills">Total Pills</Label>
                      <Input
                        id="totalPills"
                        type="number"
                        value={newMedication.totalPills}
                        onChange={(e) => setNewMedication(prev => ({ ...prev, totalPills: parseInt(e.target.value) || 30 }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="instructions">Instructions</Label>
                      <Input
                        id="instructions"
                        value={newMedication.instructions}
                        onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
                        placeholder="e.g., Take with food"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddingMedication(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addMedication} className="health-gradient">
                        Add Medication
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Today's Reminders */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-orange-600" />
            <span>Today's Reminders</span>
            <Badge variant="secondary">{urgentReminders.length} Pending</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaysReminders.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No medications scheduled for today</p>
          ) : (
            <div className="space-y-3">
              {todaysReminders.map((reminder, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                  reminder.taken ? 'bg-green-50 border-green-200' : 
                  reminder.skipped ? 'bg-yellow-50 border-yellow-200' : 
                  'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      reminder.taken ? 'bg-green-100' : 
                      reminder.skipped ? 'bg-yellow-100' : 
                      'bg-blue-100'
                    }`}>
                      {reminder.taken ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : reminder.skipped ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <Pill className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium">{reminder.medicationName}</p>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>{reminder.time}</span>
                        {reminder.taken && <span className="text-green-600">• Taken</span>}
                        {reminder.skipped && <span className="text-yellow-600">• Skipped</span>}
                      </div>
                    </div>
                  </div>
                  
                  {!reminder.taken && !reminder.skipped && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => markAsTaken(reminder.medicationId, reminder.time)}
                        className="success-gradient"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Take
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => skipDose(reminder.medicationId, reminder.time)}
                      >
                        Skip
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Medications */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Active Medications</CardTitle>
          <CardDescription>Current prescription and supplement regimen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {medications.filter(med => med.status === 'active').map((medication) => {
              const adherenceScore = getAdherenceScore(medication);
              const pillsPercentage = (medication.remainingPills / medication.totalPills) * 100;
              
              return (
                <div key={medication.id} className="p-6 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{medication.name}</h3>
                      <p className="text-slate-600">{medication.dosage} • {medication.frequency.replace('-', ' ')}</p>
                      <p className="text-sm text-slate-500">{medication.instructions}</p>
                    </div>
                    <Badge className={getStatusColor(medication.status)}>
                      {medication.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2">Adherence Score</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-2xl font-bold text-blue-600">{adherenceScore}%</span>
                          <span className="text-sm text-slate-500">Missed: {medication.missedDoses}</span>
                        </div>
                        <Progress value={adherenceScore} className="h-2" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2">Pills Remaining</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-2xl font-bold text-green-600">{medication.remainingPills}</span>
                          <span className="text-sm text-slate-500">of {medication.totalPills}</span>
                        </div>
                        <Progress value={pillsPercentage} className="h-2" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2">Daily Schedule</p>
                      <div className="flex flex-wrap gap-1">
                        {medication.times.map((time, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {medication.sideEffects && medication.sideEffects.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Possible side effects:</strong> {medication.sideEffects.join(', ')}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {pillsPercentage < 20 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Low stock alert:</strong> Only {medication.remainingPills} pills remaining. Consider refilling soon.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}