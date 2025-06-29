"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Video,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'telemedicine';
  date: Date;
  time: string;
  duration: number;
  location: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  symptoms?: string[];
}

export function AppointmentScheduler() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'Sarah Johnson',
      doctorName: 'Dr. Michael Smith',
      type: 'consultation',
      date: new Date(),
      time: '10:00 AM',
      duration: 30,
      location: 'Room 205',
      status: 'confirmed',
      symptoms: ['Headache', 'Fatigue']
    },
    {
      id: '2',
      patientName: 'John Doe',
      doctorName: 'Dr. Emily Davis',
      type: 'follow-up',
      date: addDays(new Date(), 1),
      time: '2:30 PM',
      duration: 15,
      location: 'Room 101',
      status: 'scheduled',
      symptoms: ['Blood pressure check']
    },
    {
      id: '3',
      patientName: 'Maria Garcia',
      doctorName: 'Dr. Robert Wilson',
      type: 'telemedicine',
      date: addDays(new Date(), 2),
      time: '11:00 AM',
      duration: 20,
      location: 'Virtual',
      status: 'confirmed',
      symptoms: ['Skin consultation']
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    doctorName: '',
    type: 'consultation' as const,
    time: '',
    duration: 30,
    location: '',
    notes: '',
    symptoms: ''
  });

  const doctorsList = [
    'Dr. Michael Smith - Cardiology',
    'Dr. Emily Davis - Internal Medicine',
    'Dr. Robert Wilson - Dermatology',
    'Dr. Lisa Brown - Pediatrics',
    'Dr. James Taylor - Orthopedics'
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM',
    '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'telemedicine': return Video;
      case 'emergency': return AlertCircle;
      default: return User;
    }
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !newAppointment.patientName || !newAppointment.doctorName || !newAppointment.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      ...newAppointment,
      date: selectedDate,
      status: 'scheduled',
      symptoms: newAppointment.symptoms ? newAppointment.symptoms.split(',').map(s => s.trim()) : []
    };

    setAppointments(prev => [...prev, appointment]);
    setIsBookingOpen(false);
    setNewAppointment({
      patientName: '',
      doctorName: '',
      type: 'consultation',
      time: '',
      duration: 30,
      location: '',
      notes: '',
      symptoms: ''
    });
    toast.success('Appointment scheduled successfully!');
  };

  const updateAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt)
    );
    toast.success(`Appointment ${newStatus}`);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    toast.success('Appointment cancelled');
  };

  const todaysAppointments = appointments.filter(apt => 
    apt.date.toDateString() === new Date().toDateString()
  );

  const upcomingAppointments = appointments.filter(apt => 
    apt.date > new Date() && apt.status !== 'cancelled'
  );

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
                <span>Appointment Management</span>
              </CardTitle>
              <CardDescription>Schedule and manage patient appointments</CardDescription>
            </div>
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button className="health-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule New Appointment</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input
                        id="patientName"
                        value={newAppointment.patientName}
                        onChange={(e) => setNewAppointment(prev => ({ ...prev, patientName: e.target.value }))}
                        placeholder="Enter patient name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="doctorName">Doctor</Label>
                      <Select 
                        value={newAppointment.doctorName} 
                        onValueChange={(value) => setNewAppointment(prev => ({ ...prev, doctorName: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctorsList.map((doctor) => (
                            <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Appointment Type</Label>
                      <Select 
                        value={newAppointment.type} 
                        onValueChange={(value: any) => setNewAppointment(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="telemedicine">Telemedicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Select 
                        value={newAppointment.time} 
                        onValueChange={(value) => setNewAppointment(prev => ({ ...prev, time: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newAppointment.location}
                        onChange={(e) => setNewAppointment(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Room number or Virtual"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <Label htmlFor="symptoms">Symptoms/Reason for Visit</Label>
                      <Input
                        id="symptoms"
                        value={newAppointment.symptoms}
                        onChange={(e) => setNewAppointment(prev => ({ ...prev, symptoms: e.target.value }))}
                        placeholder="Headache, fever, etc. (comma separated)"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={newAppointment.notes}
                        onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any special instructions or notes"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleBookAppointment} className="health-gradient">
                        Schedule Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Today's Appointments */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span>Today's Appointments</span>
            <Badge variant="secondary">{todaysAppointments.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaysAppointments.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No appointments scheduled for today</p>
          ) : (
            <div className="space-y-4">
              {todaysAppointments.map((appointment) => {
                const TypeIcon = getTypeIcon(appointment.type);
                return (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg health-card-hover">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div>
                        <p className="font-semibold">{appointment.patientName}</p>
                        <p className="text-sm text-slate-600">{appointment.doctorName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">{appointment.time}</span>
                          <MapPin className="w-4 h-4 text-slate-400 ml-2" />
                          <span className="text-sm">{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <div className="flex space-x-1">
                        {appointment.status === 'scheduled' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteAppointment(appointment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <span>Upcoming Appointments</span>
            <Badge variant="secondary">{upcomingAppointments.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => {
              const TypeIcon = getTypeIcon(appointment.type);
              return (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg health-card-hover">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    
                    <div>
                      <p className="font-semibold">{appointment.patientName}</p>
                      <p className="text-sm text-slate-600">{appointment.doctorName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <CalendarIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{format(appointment.date, 'MMM dd, yyyy')}</span>
                        <Clock className="w-4 h-4 text-slate-400 ml-2" />
                        <span className="text-sm">{appointment.time}</span>
                        <MapPin className="w-4 h-4 text-slate-400 ml-2" />
                        <span className="text-sm">{appointment.location}</span>
                      </div>
                      {appointment.symptoms && appointment.symptoms.length > 0 && (
                        <div className="flex items-center space-x-1 mt-1">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-xs text-orange-600">
                            {appointment.symptoms.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    <div className="flex space-x-1">
                      {appointment.type === 'telemedicine' && (
                        <Button size="sm" className="health-gradient">
                          <Video className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteAppointment(appointment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}