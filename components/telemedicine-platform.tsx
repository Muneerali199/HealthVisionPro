"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  MessageSquare,
  FileText,
  Camera,
  Share,
  Settings,
  Users,
  Clock,
  Calendar,
  Stethoscope,
  Heart,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  avatar: string;
  status: 'available' | 'busy' | 'offline';
  nextAvailable?: string;
}

interface ConsultationSession {
  id: string;
  doctorId: string;
  patientId: string;
  startTime: Date;
  duration: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  prescription?: string[];
  followUp?: Date;
}

export function TelemedicinePlatform() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'doctor' | 'patient';
    message: string;
    timestamp: Date;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const availableDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Mitchell',
      specialty: 'Internal Medicine',
      rating: 4.9,
      experience: 12,
      avatar: '/api/placeholder/150/150',
      status: 'available'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      rating: 4.8,
      experience: 15,
      avatar: '/api/placeholder/150/150',
      status: 'available'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      rating: 4.9,
      experience: 8,
      avatar: '/api/placeholder/150/150',
      status: 'busy',
      nextAvailable: '2:30 PM'
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialty: 'Psychiatry',
      rating: 4.7,
      experience: 20,
      avatar: '/api/placeholder/150/150',
      status: 'available'
    }
  ];

  const startVideoCall = async (doctor: Doctor) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setSelectedDoctor(doctor);
      setIsCallActive(true);
      toast.success(`Starting consultation with ${doctor.name}`);
      
      // Simulate doctor joining
      setTimeout(() => {
        toast.success('Doctor has joined the consultation');
      }, 2000);
      
    } catch (error) {
      toast.error('Unable to access camera/microphone');
      console.error('Media access error:', error);
    }
  };

  const endCall = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    
    setIsCallActive(false);
    setSelectedDoctor(null);
    toast.info('Consultation ended');
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = (localVideoRef.current.srcObject as MediaStream)
        .getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = (localVideoRef.current.srcObject as MediaStream)
        .getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedDoctor) {
      const message = {
        id: Date.now().toString(),
        sender: 'patient' as const,
        message: newMessage,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate doctor response
      setTimeout(() => {
        const doctorResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'doctor' as const,
          message: 'Thank you for that information. I understand your concern.',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, doctorResponse]);
      }, 1500);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isCallActive && selectedDoctor) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Call Header */}
        <div className="bg-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedDoctor.avatar} />
              <AvatarFallback>{selectedDoctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium">{selectedDoctor.name}</p>
              <p className="text-slate-300 text-sm">{selectedDoctor.specialty}</p>
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
        <div className="flex-1 relative">
          {/* Remote Video (Doctor) */}
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover bg-slate-800"
            autoPlay
            playsInline
          />
          
          {/* Simulated doctor video placeholder */}
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
            <div className="text-center text-white">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={selectedDoctor.avatar} />
                <AvatarFallback className="text-4xl">
                  {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <p className="text-xl font-medium">{selectedDoctor.name}</p>
              <p className="text-slate-300">{selectedDoctor.specialty}</p>
            </div>
          </div>

          {/* Local Video (Patient) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-700 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-slate-400" />
              </div>
            )}
          </div>

          {/* Chat Panel */}
          <div className="absolute top-4 right-4 w-80 h-96 bg-white/95 backdrop-blur rounded-lg flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-medium flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Consultation Chat
              </h3>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-2 rounded-lg text-sm ${
                      msg.sender === 'patient'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button size="sm" onClick={sendMessage}>
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="bg-slate-800 p-4 flex items-center justify-center space-x-4">
          <Button
            variant={isAudioEnabled ? "secondary" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-12 h-12"
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>
          
          <Button
            variant={isVideoEnabled ? "secondary" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12"
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={endCall}
            className="rounded-full w-12 h-12"
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full w-12 h-12"
          >
            <Share className="w-5 h-5" />
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full w-12 h-12"
          >
            <FileText className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-6 h-6 text-blue-600" />
                <span>Telemedicine Platform</span>
              </CardTitle>
              <CardDescription>
                Connect with healthcare professionals from anywhere
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Platform Online</span>
              </Badge>
              <Button className="health-gradient">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Consultation */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Instant Consultation</CardTitle>
          <CardDescription>Connect with available doctors immediately</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableDoctors.map((doctor) => (
              <Card key={doctor.id} className="health-card-hover">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <Avatar className="w-16 h-16 mx-auto">
                      <AvatarImage src={doctor.avatar} />
                      <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-slate-600">{doctor.specialty}</p>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm">{doctor.rating}</span>
                        <span className="text-xs text-slate-500">({doctor.experience}y exp)</span>
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(doctor.status)}>
                      {doctor.status === 'busy' && doctor.nextAvailable
                        ? `Available ${doctor.nextAvailable}`
                        : doctor.status.toUpperCase()
                      }
                    </Badge>
                    
                    <Button
                      className="w-full health-gradient"
                      disabled={doctor.status !== 'available'}
                      onClick={() => startVideoCall(doctor)}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      {doctor.status === 'available' ? 'Start Consultation' : 'Not Available'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consultation History */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Recent Consultations</CardTitle>
          <CardDescription>Your consultation history and follow-ups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                doctor: 'Dr. Sarah Mitchell',
                specialty: 'Internal Medicine',
                date: '2024-01-15',
                duration: '25 min',
                status: 'completed',
                notes: 'Follow-up on blood pressure medication'
              },
              {
                doctor: 'Dr. Michael Chen',
                specialty: 'Cardiology',
                date: '2024-01-10',
                duration: '30 min',
                status: 'completed',
                notes: 'Routine cardiac check-up'
              },
              {
                doctor: 'Dr. Emily Rodriguez',
                specialty: 'Dermatology',
                date: '2024-01-08',
                duration: '20 min',
                status: 'completed',
                notes: 'Skin condition consultation'
              }
            ].map((consultation, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <p className="font-medium">{consultation.doctor}</p>
                    <p className="text-sm text-slate-600">{consultation.specialty}</p>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{consultation.date}</span>
                      <span>•</span>
                      <span>{consultation.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <Badge className="bg-green-100 text-green-800">
                    {consultation.status.toUpperCase()}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-1" />
                      Notes
                    </Button>
                    <Button size="sm" variant="outline">
                      <Video className="w-4 h-4 mr-1" />
                      Follow-up
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Monitoring Integration */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Remote Health Monitoring</CardTitle>
          <CardDescription>Share your health data with your healthcare team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
              <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="font-medium">Vital Signs</p>
              <p className="text-sm text-slate-600">Real-time monitoring</p>
              <Button size="sm" className="mt-2" variant="outline">
                Share Data
              </Button>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="font-medium">Activity Tracking</p>
              <p className="text-sm text-slate-600">Exercise & wellness</p>
              <Button size="sm" className="mt-2" variant="outline">
                Sync Devices
              </Button>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="font-medium">Health Records</p>
              <p className="text-sm text-slate-600">Secure sharing</p>
              <Button size="sm" className="mt-2" variant="outline">
                Upload Records
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}