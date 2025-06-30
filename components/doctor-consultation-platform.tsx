"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Stethoscope,
  Video,
  MessageSquare,
  Phone,
  Calendar as CalendarIcon,
  Clock,
  Star,
  Shield,
  Heart,
  Brain,
  Eye,
  Activity,
  AlertTriangle,
  Search,
  Languages,
  FileText,
  Camera,
  Mic,
  PhoneOff
} from 'lucide-react';
import { toast } from 'sonner';
import { DoctorConsultationService, Doctor, ConsultationSession } from '@/lib/backend/doctor-consultation';

type SearchFilters = {
  specialty?: string;
  availability?: "week" | "now" | "today";
  rating?: number;
  consultationType?: "audio" | "video" | "chat" | "";
};

export function DoctorConsultationPlatform() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [consultations, setConsultations] = useState<ConsultationSession[]>([]);
  const [activeConsultation, setActiveConsultation] = useState<ConsultationSession | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    specialty: '',
    availability: undefined,
    rating: 0,
    consultationType: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isConsultationActive, setIsConsultationActive] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    chiefComplaint: '',
    symptoms: '',
    currentMedications: '',
    allergies: '',
    medicalHistory: ''
  });

  const loadDoctors = useCallback(async () => {
    try {
      // Convert empty string to undefined before making the API call
      const filters = {
        ...searchFilters,
        consultationType: searchFilters.consultationType === "" ? undefined : searchFilters.consultationType
      };
      const doctorsList = await DoctorConsultationService.getAllDoctors(filters);
      setDoctors(doctorsList);
    } catch (error) {
      toast.error('Failed to load doctors');
    }
  }, [searchFilters]);

  const loadConsultations = useCallback(async () => {
    try {
      const consultationsList = await DoctorConsultationService.getPatientConsultations('current-patient');
      setConsultations(consultationsList);
    } catch (error) {
      toast.error('Failed to load consultations');
    }
  }, []);

  useEffect(() => {
    loadDoctors();
    loadConsultations();
    DoctorConsultationService.initializeSampleDoctors();
  }, [loadDoctors, loadConsultations]);

  const handleSearch = async () => {
    await loadDoctors();
  };

  const scheduleConsultation = async (doctor: Doctor, timeSlot: string) => {
    try {
      const consultation = await DoctorConsultationService.scheduleConsultation({
        patientId: 'current-patient',
        doctorId: doctor.id,
        type: 'video',
        scheduledTime: new Date(`${selectedDate.toDateString()} ${timeSlot}`),
        chiefComplaint: consultationForm.chiefComplaint,
        symptoms: consultationForm.symptoms.split(',').map(s => s.trim()),
        currentMedications: consultationForm.currentMedications.split(',').map(s => s.trim()),
        allergies: consultationForm.allergies.split(',').map(s => s.trim()),
        medicalHistory: consultationForm.medicalHistory.split(',').map(s => s.trim())
      });

      setConsultations(prev => [consultation, ...prev]);
      setIsBookingOpen(false);
      toast.success('Consultation scheduled successfully!');
    } catch (error) {
      toast.error('Failed to schedule consultation');
    }
  };

  const startConsultation = async (consultationId: string) => {
    try {
      const sessionData = await DoctorConsultationService.startConsultation(consultationId);
      const consultation = await DoctorConsultationService.getConsultation(consultationId);
      
      setActiveConsultation(consultation);
      setIsConsultationActive(true);
      toast.success('Consultation started!');
    } catch (error) {
      toast.error('Failed to start consultation');
    }
  };

  const requestEmergencyConsultation = async () => {
    try {
      const emergencyData = await DoctorConsultationService.requestEmergencyConsultation({
        patientId: 'current-patient',
        emergencyType: 'urgent',
        symptoms: ['chest pain', 'shortness of breath'],
        location: 'Home'
      });

      toast.success(`Emergency consultation requested. Code: ${emergencyData.emergencyCode}`);
    } catch (error) {
      toast.error('Failed to request emergency consultation');
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'cardiology': return Heart;
      case 'neurology': return Brain;
      case 'ophthalmology': return Eye;
      case 'psychiatry': return Brain;
      case 'internal medicine': return Stethoscope;
      default: return Activity;
    }
  };

  const getAvailabilityColor = (nextAvailable: Date) => {
    const now = new Date();
    const diffMinutes = (nextAvailable.getTime() - now.getTime()) / (1000 * 60);
    
    if (diffMinutes <= 30) return 'bg-green-100 text-green-800';
    if (diffMinutes <= 120) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getAvailabilityText = (nextAvailable: Date) => {
    const now = new Date();
    const diffMinutes = (nextAvailable.getTime() - now.getTime()) / (1000 * 60);
    
    if (diffMinutes <= 30) return 'Available Now';
    if (diffMinutes <= 120) return `Available in ${Math.round(diffMinutes)} min`;
    return `Next: ${nextAvailable.toLocaleTimeString()}`;
  };

  if (isConsultationActive && activeConsultation) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Consultation Header */}
        <div className="bg-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/api/placeholder/100/100" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium">Dr. Sarah Johnson</p>
              <p className="text-slate-300 text-sm">Cardiology Specialist</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-600 text-white">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              LIVE CONSULTATION
            </Badge>
            <span className="text-white text-sm">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-slate-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src="/api/placeholder/200/200" />
                <AvatarFallback className="text-4xl">DR</AvatarFallback>
              </Avatar>
              <p className="text-xl font-medium">Dr. Sarah Johnson</p>
              <p className="text-slate-300">Cardiology Specialist</p>
            </div>
          </div>

          {/* Patient Video */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-700 rounded-lg overflow-hidden">
            <div className="w-full h-full bg-slate-600 flex items-center justify-center">
              <Camera className="w-8 h-8 text-slate-400" />
            </div>
          </div>

          {/* Chat Panel */}
          <div className="absolute top-4 right-4 w-80 h-96 bg-white/95 backdrop-blur rounded-lg flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-medium flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Consultation Chat
              </h3>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto">
              <div className="space-y-2">
                <div className="bg-slate-200 p-2 rounded-lg text-sm">
                  <strong>Dr. Johnson:</strong> Hello! How are you feeling today?
                </div>
                <div className="bg-blue-600 text-white p-2 rounded-lg text-sm ml-8">
                  I&apos;ve been experiencing some chest discomfort.
                </div>
              </div>
            </div>
            
            <div className="p-3 border-t flex space-x-2">
              <Input placeholder="Type a message..." className="flex-1" />
              <Button size="sm">Send</Button>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="bg-slate-800 p-4 flex items-center justify-center space-x-4">
          <Button variant="secondary" size="lg" className="rounded-full w-12 h-12">
            <Mic className="w-5 h-5" />
          </Button>
          
          <Button variant="secondary" size="lg" className="rounded-full w-12 h-12">
            <Video className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="destructive" 
            size="lg" 
            className="rounded-full w-12 h-12"
            onClick={() => setIsConsultationActive(false)}
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
          
          <Button variant="secondary" size="lg" className="rounded-full w-12 h-12">
            <FileText className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-6 h-6 text-blue-600" />
                <span>Doctor Consultation Platform</span>
              </CardTitle>
              <CardDescription>
                Connect with verified healthcare professionals for expert medical consultation
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="destructive" onClick={requestEmergencyConsultation}>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency
              </Button>
              <Badge variant="secondary" className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>{doctors.length} Doctors Online</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-lg">Find the Right Doctor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Select value={searchFilters.specialty} onValueChange={(value) => setSearchFilters(prev => ({ ...prev, specialty: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Specialties</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="psychiatry">Psychiatry</SelectItem>
                <SelectItem value="dermatology">Dermatology</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={searchFilters.availability} 
              onValueChange={(value: "week" | "now" | "today") => setSearchFilters(prev => ({ ...prev, availability: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Time</SelectItem>
                <SelectItem value="now">Available Now</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={searchFilters.consultationType} 
              onValueChange={(value: "audio" | "video" | "chat" | "") => 
                setSearchFilters(prev => ({ ...prev, consultationType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Consultation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="video">Video Call</SelectItem>
                <SelectItem value="audio">Audio Call</SelectItem>
                <SelectItem value="chat">Chat Only</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} className="health-gradient">
              <Search className="w-4 h-4 mr-2" />
              Search Doctors
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="doctors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="doctors">Available Doctors</TabsTrigger>
          <TabsTrigger value="consultations">My Consultations</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Care</TabsTrigger>
        </TabsList>

        <TabsContent value="doctors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => {
              const SpecialtyIcon = getSpecialtyIcon(doctor.professional.specialty);
              return (
                <Card key={doctor.id} className="glass-effect health-card-hover">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Doctor Header */}
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={doctor.personalInfo.profileImage} />
                          <AvatarFallback>
                            {doctor.personalInfo.firstName[0]}{doctor.personalInfo.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {doctor.personalInfo.firstName} {doctor.personalInfo.lastName}
                          </h3>
                          <p className="text-sm text-slate-600">{doctor.personalInfo.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <SpecialtyIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{doctor.professional.specialty}</span>
                          </div>
                        </div>
                        
                        {doctor.verification.isVerified && (
                          <Shield className="w-5 h-5 text-green-600" />
                        )}
                      </div>

                      {/* Rating and Experience */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{doctor.ratings.averageRating}</span>
                          <span className="text-sm text-slate-500">({doctor.ratings.totalReviews})</span>
                        </div>
                        <div className="text-sm text-slate-600">
                          {doctor.professional.yearsOfExperience} years exp.
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="flex items-center justify-between">
                        <Badge className={getAvailabilityColor(doctor.availability.nextAvailable)}>
                          <Clock className="w-3 h-3 mr-1" />
                          {getAvailabilityText(doctor.availability.nextAvailable)}
                        </Badge>
                        <div className="text-sm font-medium">
                          ${doctor.consultation.consultationFee}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex items-center space-x-2">
                        <Languages className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          {doctor.personalInfo.languages.join(', ')}
                        </span>
                      </div>

                      {/* Consultation Types */}
                      <div className="flex space-x-2">
                        {doctor.consultation.consultationTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type === 'video' && <Video className="w-3 h-3 mr-1" />}
                            {type === 'audio' && <Phone className="w-3 h-3 mr-1" />}
                            {type === 'chat' && <MessageSquare className="w-3 h-3 mr-1" />}
                            {type}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Dialog open={isBookingOpen && selectedDoctor?.id === doctor.id} onOpenChange={setIsBookingOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full health-gradient"
                              onClick={() => setSelectedDoctor(doctor)}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              Book Consultation
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Book Consultation with {doctor.personalInfo.firstName} {doctor.personalInfo.lastName}</DialogTitle>
                            </DialogHeader>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Chief Complaint</label>
                                  <Textarea
                                    value={consultationForm.chiefComplaint}
                                    onChange={(e) => setConsultationForm(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                                    placeholder="Describe your main concern..."
                                    rows={3}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-2">Current Symptoms</label>
                                  <Input
                                    value={consultationForm.symptoms}
                                    onChange={(e) => setConsultationForm(prev => ({ ...prev, symptoms: e.target.value }))}
                                    placeholder="Headache, fever, etc. (comma separated)"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-2">Current Medications</label>
                                  <Input
                                    value={consultationForm.currentMedications}
                                    onChange={(e) => setConsultationForm(prev => ({ ...prev, currentMedications: e.target.value }))}
                                    placeholder="List current medications"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Select Date</label>
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => date && setSelectedDate(date)}
                                    className="rounded-md border"
                                  />
                                </div>
                              </div>
                              
                              <div className="md:col-span-2">
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                                    <Button
                                      key={time}
                                      variant="outline"
                                      onClick={() => scheduleConsultation(doctor, time)}
                                      className="text-sm"
                                    >
                                      {time}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <Card key={consultation.id} className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/api/placeholder/100/100" />
                        <AvatarFallback>DR</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <p className="font-medium">Dr. Sarah Johnson</p>
                        <p className="text-sm text-slate-600">Cardiology</p>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                          <CalendarIcon className="w-3 h-3" />
                          <span>{consultation.scheduledTime.toLocaleDateString()}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{consultation.scheduledTime.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={
                        consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        consultation.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        consultation.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {consultation.status.toUpperCase()}
                      </Badge>
                      
                      {consultation.status === 'scheduled' && (
                        <Button 
                          className="health-gradient"
                          onClick={() => startConsultation(consultation.id)}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join
                        </Button>
                      )}
                      
                      {consultation.status === 'completed' && (
                        <Button variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Report
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card className="glass-effect border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6" />
                <span>Emergency Medical Consultation</span>
              </CardTitle>
              <CardDescription>
                Get immediate medical attention for urgent health concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-red-800">Critical Emergency</h3>
                    <p className="text-sm text-red-600 mb-3">Life-threatening conditions</p>
                    <Button variant="destructive" className="w-full">
                      Call 911
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-orange-800">Urgent Care</h3>
                    <p className="text-sm text-orange-600 mb-3">Needs immediate attention</p>
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      onClick={requestEmergencyConsultation}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Emergency Consult
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-yellow-800">Quick Consultation</h3>
                    <p className="text-sm text-yellow-600 mb-3">Non-urgent medical advice</p>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat with Nurse
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Emergency Guidelines</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Call 911 for life-threatening emergencies</li>
                  <li>• Use emergency consultation for urgent but non-life-threatening conditions</li>
                  <li>• Average emergency consultation wait time: 2-5 minutes</li>
                  <li>• Emergency consultations are available 24/7</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}