export interface Doctor {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    profileImage: string;
    languages: string[];
  };
  professional: {
    specialty: string;
    subSpecialties: string[];
    licenseNumber: string;
    yearsOfExperience: number;
    education: string[];
    certifications: string[];
    hospitalAffiliations: string[];
  };
  consultation: {
    availableSlots: TimeSlot[];
    consultationFee: number;
    consultationDuration: number;
    consultationTypes: ('video' | 'audio' | 'chat')[];
    emergencyAvailable: boolean;
  };
  ratings: {
    averageRating: number;
    totalReviews: number;
    patientSatisfaction: number;
    responseTime: number; // in minutes
  };
  verification: {
    isVerified: boolean;
    verificationDate: Date;
    backgroundCheck: boolean;
    medicalLicenseVerified: boolean;
  };
  availability: {
    timezone: string;
    workingHours: {
      [key: string]: { start: string; end: string; available: boolean };
    };
    nextAvailable: Date;
  };
}

export interface ConsultationSession {
  id: string;
  patientId: string;
  doctorId: string;
  type: 'video' | 'audio' | 'chat' | 'emergency';
  status: 'scheduled' | 'waiting' | 'active' | 'completed' | 'cancelled';
  scheduledTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  duration: number;
  fee: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  consultation: {
    chiefComplaint: string;
    symptoms: string[];
    currentMedications: string[];
    allergies: string[];
    medicalHistory: string[];
  };
  diagnosis?: {
    primaryDiagnosis: string;
    secondaryDiagnoses: string[];
    icdCodes: string[];
    confidence: number;
  };
  treatment?: {
    prescriptions: Prescription[];
    recommendations: string[];
    followUpRequired: boolean;
    followUpDate?: Date;
    referrals: string[];
  };
  notes: {
    doctorNotes: string;
    patientNotes: string;
    privateNotes: string;
  };
  attachments: {
    labResults: string[];
    images: string[];
    documents: string[];
  };
  recording?: {
    videoUrl: string;
    audioUrl: string;
    transcription: string;
    consentGiven: boolean;
  };
}

export interface Prescription {
  id: string;
  medicationName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  refills: number;
  pharmacyInstructions: string;
  sideEffects: string[];
  interactions: string[];
}

export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  available: boolean;
  type: 'regular' | 'emergency' | 'follow-up';
}

export interface DoctorReview {
  id: string;
  patientId: string;
  doctorId: string;
  consultationId: string;
  rating: number;
  review: string;
  categories: {
    communication: number;
    expertise: number;
    bedside_manner: number;
    wait_time: number;
    overall_experience: number;
  };
  wouldRecommend: boolean;
  createdAt: Date;
  verified: boolean;
}

export class DoctorConsultationService {
  private static doctors: Map<string, Doctor> = new Map();
  private static consultations: Map<string, ConsultationSession> = new Map();
  private static reviews: Map<string, DoctorReview[]> = new Map();

  // Doctor Management
  static async getAllDoctors(filters?: {
    specialty?: string;
    availability?: 'now' | 'today' | 'week';
    rating?: number;
    experience?: number;
    consultationType?: 'video' | 'audio' | 'chat';
  }): Promise<Doctor[]> {
    let doctors = Array.from(this.doctors.values());

    if (filters) {
      if (filters.specialty) {
        doctors = doctors.filter(d => 
          d.professional.specialty.toLowerCase().includes(filters.specialty!.toLowerCase()) ||
          d.professional.subSpecialties.some(s => s.toLowerCase().includes(filters.specialty!.toLowerCase()))
        );
      }

      if (filters.rating) {
        doctors = doctors.filter(d => d.ratings.averageRating >= filters.rating!);
      }

      if (filters.experience) {
        doctors = doctors.filter(d => d.professional.yearsOfExperience >= filters.experience!);
      }

      if (filters.consultationType) {
        doctors = doctors.filter(d => d.consultation.consultationTypes.includes(filters.consultationType!));
      }

      if (filters.availability) {
        const now = new Date();
        doctors = doctors.filter(d => {
          switch (filters.availability) {
            case 'now':
              return d.availability.nextAvailable <= new Date(now.getTime() + 30 * 60 * 1000);
            case 'today':
              return d.availability.nextAvailable.toDateString() === now.toDateString();
            case 'week':
              return d.availability.nextAvailable <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            default:
              return true;
          }
        });
      }
    }

    return doctors.sort((a, b) => b.ratings.averageRating - a.ratings.averageRating);
  }

  static async getDoctorById(id: string): Promise<Doctor | null> {
    return this.doctors.get(id) || null;
  }

  static async getDoctorAvailability(doctorId: string, date: Date): Promise<TimeSlot[]> {
    const doctor = await this.getDoctorById(doctorId);
    if (!doctor) return [];

    // Generate available slots for the given date
    const slots: TimeSlot[] = [];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const workingHours = doctor.availability.workingHours[dayName];

    if (workingHours && workingHours.available) {
      const startTime = new Date(date);
      const [startHour, startMinute] = workingHours.start.split(':').map(Number);
      startTime.setHours(startHour, startMinute, 0, 0);

      const endTime = new Date(date);
      const [endHour, endMinute] = workingHours.end.split(':').map(Number);
      endTime.setHours(endHour, endMinute, 0, 0);

      // Generate 30-minute slots
      const current = new Date(startTime);
      while (current < endTime) {
        const slotEnd = new Date(current.getTime() + 30 * 60 * 1000);
        
        slots.push({
          id: `${doctorId}-${current.getTime()}`,
          startTime: new Date(current),
          endTime: slotEnd,
          available: !this.isSlotBooked(doctorId, current),
          type: 'regular'
        });

        current.setTime(current.getTime() + 30 * 60 * 1000);
      }
    }

    return slots;
  }

  // Consultation Management
  static async scheduleConsultation(consultationData: {
    patientId: string;
    doctorId: string;
    type: 'video' | 'audio' | 'chat' | 'emergency';
    scheduledTime: Date;
    chiefComplaint: string;
    symptoms: string[];
    currentMedications: string[];
    allergies: string[];
    medicalHistory: string[];
  }): Promise<ConsultationSession> {
    const doctor = await this.getDoctorById(consultationData.doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    const consultation: ConsultationSession = {
      id: this.generateId(),
      ...consultationData,
      status: 'scheduled',
      duration: doctor.consultation.consultationDuration,
      fee: doctor.consultation.consultationFee,
      paymentStatus: 'pending',
      consultation: {
        chiefComplaint: consultationData.chiefComplaint,
        symptoms: consultationData.symptoms,
        currentMedications: consultationData.currentMedications,
        allergies: consultationData.allergies,
        medicalHistory: consultationData.medicalHistory
      },
      notes: {
        doctorNotes: '',
        patientNotes: '',
        privateNotes: ''
      },
      attachments: {
        labResults: [],
        images: [],
        documents: []
      }
    };

    this.consultations.set(consultation.id, consultation);
    return consultation;
  }

  static async getConsultation(id: string): Promise<ConsultationSession | null> {
    return this.consultations.get(id) || null;
  }

  static async getPatientConsultations(patientId: string): Promise<ConsultationSession[]> {
    return Array.from(this.consultations.values())
      .filter(c => c.patientId === patientId)
      .sort((a, b) => b.scheduledTime.getTime() - a.scheduledTime.getTime());
  }

  static async getDoctorConsultations(doctorId: string): Promise<ConsultationSession[]> {
    return Array.from(this.consultations.values())
      .filter(c => c.doctorId === doctorId)
      .sort((a, b) => b.scheduledTime.getTime() - a.scheduledTime.getTime());
  }

  static async startConsultation(consultationId: string): Promise<{
    sessionToken: string;
    roomId: string;
    accessToken: string;
  }> {
    const consultation = await this.getConsultation(consultationId);
    if (!consultation) {
      throw new Error('Consultation not found');
    }

    consultation.status = 'active';
    consultation.actualStartTime = new Date();

    // Generate session credentials
    return {
      sessionToken: this.generateSessionToken(),
      roomId: `room_${consultationId}`,
      accessToken: this.generateAccessToken()
    };
  }

  static async endConsultation(consultationId: string, summary: {
    diagnosis?: {
      primaryDiagnosis: string;
      secondaryDiagnoses: string[];
      icdCodes: string[];
      confidence: number;
    };
    treatment?: {
      prescriptions: Prescription[];
      recommendations: string[];
      followUpRequired: boolean;
      followUpDate?: Date;
      referrals: string[];
    };
    doctorNotes: string;
  }): Promise<ConsultationSession> {
    const consultation = await this.getConsultation(consultationId);
    if (!consultation) {
      throw new Error('Consultation not found');
    }

    consultation.status = 'completed';
    consultation.actualEndTime = new Date();
    consultation.diagnosis = summary.diagnosis;
    consultation.treatment = summary.treatment;
    consultation.notes.doctorNotes = summary.doctorNotes;

    this.consultations.set(consultationId, consultation);
    return consultation;
  }

  // Review System
  static async addReview(review: Omit<DoctorReview, 'id' | 'createdAt' | 'verified'>): Promise<DoctorReview> {
    const newReview: DoctorReview = {
      ...review,
      id: this.generateId(),
      createdAt: new Date(),
      verified: true
    };

    const doctorReviews = this.reviews.get(review.doctorId) || [];
    doctorReviews.push(newReview);
    this.reviews.set(review.doctorId, doctorReviews);

    // Update doctor's rating
    await this.updateDoctorRating(review.doctorId);

    return newReview;
  }

  static async getDoctorReviews(doctorId: string): Promise<DoctorReview[]> {
    return this.reviews.get(doctorId) || [];
  }

  // Emergency Consultation
  static async requestEmergencyConsultation(patientData: {
    patientId: string;
    emergencyType: 'critical' | 'urgent' | 'moderate';
    symptoms: string[];
    vitalSigns?: any;
    location?: string;
  }): Promise<{
    consultationId: string;
    estimatedWaitTime: number;
    availableDoctors: Doctor[];
    emergencyCode: string;
  }> {
    const availableDoctors = await this.getAllDoctors({
      availability: 'now'
    });

    const emergencyDoctors = availableDoctors.filter(d => d.consultation.emergencyAvailable);

    const consultation = await this.scheduleConsultation({
      patientId: patientData.patientId,
      doctorId: emergencyDoctors[0]?.id || 'emergency-pool',
      type: 'emergency',
      scheduledTime: new Date(),
      chiefComplaint: `Emergency: ${patientData.emergencyType}`,
      symptoms: patientData.symptoms,
      currentMedications: [],
      allergies: [],
      medicalHistory: []
    });

    return {
      consultationId: consultation.id,
      estimatedWaitTime: this.calculateEmergencyWaitTime(patientData.emergencyType),
      availableDoctors: emergencyDoctors,
      emergencyCode: this.generateEmergencyCode()
    };
  }

  // Helper Methods
  private static isSlotBooked(doctorId: string, time: Date): boolean {
    const consultations = Array.from(this.consultations.values());
    return consultations.some(c => 
      c.doctorId === doctorId && 
      c.scheduledTime.getTime() === time.getTime() &&
      c.status !== 'cancelled'
    );
  }

  private static async updateDoctorRating(doctorId: string): Promise<void> {
    const doctor = await this.getDoctorById(doctorId);
    const reviews = await this.getDoctorReviews(doctorId);

    if (doctor && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      doctor.ratings.averageRating = Math.round(averageRating * 10) / 10;
      doctor.ratings.totalReviews = reviews.length;

      this.doctors.set(doctorId, doctor);
    }
  }

  private static calculateEmergencyWaitTime(emergencyType: string): number {
    switch (emergencyType) {
      case 'critical': return 2; // 2 minutes
      case 'urgent': return 10; // 10 minutes
      case 'moderate': return 30; // 30 minutes
      default: return 60; // 1 hour
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static generateSessionToken(): string {
    return 'session_' + this.generateId();
  }

  private static generateAccessToken(): string {
    return 'access_' + this.generateId();
  }

  private static generateEmergencyCode(): string {
    return 'EMG' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  // Initialize with sample doctors
  static async initializeSampleDoctors(): Promise<void> {
    const sampleDoctors: Doctor[] = [
      {
        id: 'doc1',
        personalInfo: {
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          title: 'MD, FACC',
          profileImage: '/api/placeholder/200/200',
          languages: ['English', 'Spanish']
        },
        professional: {
          specialty: 'Cardiology',
          subSpecialties: ['Interventional Cardiology', 'Heart Failure'],
          licenseNumber: 'MD123456',
          yearsOfExperience: 15,
          education: ['Harvard Medical School', 'Johns Hopkins Residency'],
          certifications: ['Board Certified Cardiologist', 'ACLS Certified'],
          hospitalAffiliations: ['Massachusetts General Hospital', 'Brigham and Women\'s Hospital']
        },
        consultation: {
          availableSlots: [],
          consultationFee: 200,
          consultationDuration: 30,
          consultationTypes: ['video', 'audio', 'chat'],
          emergencyAvailable: true
        },
        ratings: {
          averageRating: 4.9,
          totalReviews: 156,
          patientSatisfaction: 98,
          responseTime: 5
        },
        verification: {
          isVerified: true,
          verificationDate: new Date('2024-01-01'),
          backgroundCheck: true,
          medicalLicenseVerified: true
        },
        availability: {
          timezone: 'America/New_York',
          workingHours: {
            monday: { start: '09:00', end: '17:00', available: true },
            tuesday: { start: '09:00', end: '17:00', available: true },
            wednesday: { start: '09:00', end: '17:00', available: true },
            thursday: { start: '09:00', end: '17:00', available: true },
            friday: { start: '09:00', end: '15:00', available: true },
            saturday: { start: '10:00', end: '14:00', available: true },
            sunday: { start: '00:00', end: '00:00', available: false }
          },
          nextAvailable: new Date(Date.now() + 30 * 60 * 1000)
        }
      },
      {
        id: 'doc2',
        personalInfo: {
          firstName: 'Dr. Michael',
          lastName: 'Chen',
          title: 'MD, PhD',
          profileImage: '/api/placeholder/200/200',
          languages: ['English', 'Mandarin']
        },
        professional: {
          specialty: 'Internal Medicine',
          subSpecialties: ['Diabetes', 'Hypertension'],
          licenseNumber: 'MD789012',
          yearsOfExperience: 12,
          education: ['Stanford Medical School', 'UCSF Residency'],
          certifications: ['Board Certified Internal Medicine', 'Diabetes Educator'],
          hospitalAffiliations: ['Stanford Hospital', 'UCSF Medical Center']
        },
        consultation: {
          availableSlots: [],
          consultationFee: 150,
          consultationDuration: 25,
          consultationTypes: ['video', 'chat'],
          emergencyAvailable: false
        },
        ratings: {
          averageRating: 4.8,
          totalReviews: 203,
          patientSatisfaction: 96,
          responseTime: 8
        },
        verification: {
          isVerified: true,
          verificationDate: new Date('2024-01-01'),
          backgroundCheck: true,
          medicalLicenseVerified: true
        },
        availability: {
          timezone: 'America/Los_Angeles',
          workingHours: {
            monday: { start: '08:00', end: '18:00', available: true },
            tuesday: { start: '08:00', end: '18:00', available: true },
            wednesday: { start: '08:00', end: '18:00', available: true },
            thursday: { start: '08:00', end: '18:00', available: true },
            friday: { start: '08:00', end: '16:00', available: true },
            saturday: { start: '00:00', end: '00:00', available: false },
            sunday: { start: '00:00', end: '00:00', available: false }
          },
          nextAvailable: new Date(Date.now() + 2 * 60 * 60 * 1000)
        }
      }
    ];

    sampleDoctors.forEach(doctor => {
      this.doctors.set(doctor.id, doctor);
    });
  }
}