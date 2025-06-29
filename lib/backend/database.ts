export interface Patient {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    bloodType: string;
    height: number; // cm
    weight: number; // kg
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  medicalHistory: {
    conditions: MedicalCondition[];
    surgeries: Surgery[];
    allergies: Allergy[];
    familyHistory: FamilyHistory[];
    immunizations: Immunization[];
  };
  currentMedications: Medication[];
  vitalSigns: VitalSignRecord[];
  labResults: LabResult[];
  appointments: Appointment[];
  healthScans: HealthScan[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalCondition {
  id: string;
  name: string;
  icd10Code: string;
  diagnosisDate: Date;
  status: 'active' | 'resolved' | 'chronic' | 'remission';
  severity: 'mild' | 'moderate' | 'severe';
  notes: string;
  treatingPhysician: string;
}

export interface Surgery {
  id: string;
  procedure: string;
  date: Date;
  surgeon: string;
  hospital: string;
  complications?: string;
  notes: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  type: 'drug' | 'food' | 'environmental' | 'other';
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  reaction: string;
  onsetDate?: Date;
}

export interface FamilyHistory {
  id: string;
  relationship: string;
  condition: string;
  ageOfOnset?: number;
  notes?: string;
}

export interface Immunization {
  id: string;
  vaccine: string;
  date: Date;
  provider: string;
  lotNumber?: string;
  nextDue?: Date;
}

export interface VitalSignRecord {
  id: string;
  patientId: string;
  timestamp: Date;
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight?: number;
  height?: number;
  bmi?: number;
  recordedBy: string;
  location: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  testCode: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical' | 'pending';
  orderedBy: string;
  performedBy: string;
  orderDate: Date;
  resultDate: Date;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  type: 'consultation' | 'follow-up' | 'procedure' | 'emergency' | 'telemedicine';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  scheduledDate: Date;
  duration: number;
  location: string;
  chiefComplaint: string;
  notes?: string;
  diagnosis?: string;
  treatment?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
}

export interface HealthScan {
  id: string;
  patientId: string;
  scanType: 'basic' | 'comprehensive' | 'vital-signs' | 'ai-analysis';
  timestamp: Date;
  results: {
    overallScore: number;
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    findings: ScanFinding[];
    recommendations: string[];
    urgentAlerts: string[];
  };
  imageData?: string;
  videoData?: string;
  aiConfidence: number;
  reviewedBy?: string;
  reviewDate?: Date;
}

export interface ScanFinding {
  category: string;
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  recommendations: string[];
  confidence: number;
}

export interface Provider {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    specialty: string;
    subSpecialty?: string;
    licenseNumber: string;
    npiNumber: string;
    phone: string;
    email: string;
  };
  credentials: {
    medicalSchool: string;
    residency: string;
    fellowship?: string;
    boardCertifications: string[];
    yearsOfExperience: number;
  };
  availability: {
    schedule: WeeklySchedule;
    timeZone: string;
    consultationTypes: string[];
  };
  ratings: {
    averageRating: number;
    totalReviews: number;
    patientSatisfaction: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isAvailable: boolean;
  startTime: string;
  endTime: string;
  breaks: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

// Database simulation class
export class HealthDatabase {
  private static patients: Map<string, Patient> = new Map();
  private static providers: Map<string, Provider> = new Map();
  private static appointments: Map<string, Appointment> = new Map();
  private static labResults: Map<string, LabResult[]> = new Map();
  private static vitalSigns: Map<string, VitalSignRecord[]> = new Map();
  private static healthScans: Map<string, HealthScan[]> = new Map();

  // Patient operations
  static async createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    const id = this.generateId();
    const newPatient: Patient = {
      ...patient,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.patients.set(id, newPatient);
    return newPatient;
  }

  static async getPatient(id: string): Promise<Patient | null> {
    return this.patients.get(id) || null;
  }

  static async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    const patient = this.patients.get(id);
    if (!patient) return null;

    const updatedPatient = {
      ...patient,
      ...updates,
      updatedAt: new Date()
    };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  static async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  // Provider operations
  static async createProvider(provider: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>): Promise<Provider> {
    const id = this.generateId();
    const newProvider: Provider = {
      ...provider,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.providers.set(id, newProvider);
    return newProvider;
  }

  static async getProvider(id: string): Promise<Provider | null> {
    return this.providers.get(id) || null;
  }

  static async getAvailableProviders(specialty?: string): Promise<Provider[]> {
    const providers = Array.from(this.providers.values()).filter(p => p.isActive);
    if (specialty) {
      return providers.filter(p => p.personalInfo.specialty.toLowerCase().includes(specialty.toLowerCase()));
    }
    return providers;
  }

  // Appointment operations
  static async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    const id = this.generateId();
    const newAppointment: Appointment = { ...appointment, id };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  static async getAppointment(id: string): Promise<Appointment | null> {
    return this.appointments.get(id) || null;
  }

  static async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(apt => apt.patientId === patientId);
  }

  static async getProviderAppointments(providerId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(apt => apt.providerId === providerId);
  }

  // Vital signs operations
  static async addVitalSigns(vitalSigns: Omit<VitalSignRecord, 'id'>): Promise<VitalSignRecord> {
    const id = this.generateId();
    const newVitalSigns: VitalSignRecord = { ...vitalSigns, id };
    
    const patientVitals = this.vitalSigns.get(vitalSigns.patientId) || [];
    patientVitals.push(newVitalSigns);
    this.vitalSigns.set(vitalSigns.patientId, patientVitals);
    
    return newVitalSigns;
  }

  static async getPatientVitalSigns(patientId: string, limit?: number): Promise<VitalSignRecord[]> {
    const vitals = this.vitalSigns.get(patientId) || [];
    const sortedVitals = vitals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? sortedVitals.slice(0, limit) : sortedVitals;
  }

  // Lab results operations
  static async addLabResult(labResult: Omit<LabResult, 'id'>): Promise<LabResult> {
    const id = this.generateId();
    const newLabResult: LabResult = { ...labResult, id };
    
    const patientLabs = this.labResults.get(labResult.patientId) || [];
    patientLabs.push(newLabResult);
    this.labResults.set(labResult.patientId, patientLabs);
    
    return newLabResult;
  }

  static async getPatientLabResults(patientId: string): Promise<LabResult[]> {
    const labs = this.labResults.get(patientId) || [];
    return labs.sort((a, b) => b.resultDate.getTime() - a.resultDate.getTime());
  }

  // Health scan operations
  static async addHealthScan(healthScan: Omit<HealthScan, 'id'>): Promise<HealthScan> {
    const id = this.generateId();
    const newHealthScan: HealthScan = { ...healthScan, id };
    
    const patientScans = this.healthScans.get(healthScan.patientId) || [];
    patientScans.push(newHealthScan);
    this.healthScans.set(healthScan.patientId, patientScans);
    
    return newHealthScan;
  }

  static async getPatientHealthScans(patientId: string): Promise<HealthScan[]> {
    const scans = this.healthScans.get(patientId) || [];
    return scans.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Utility methods
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Initialize with sample data
  static async initializeSampleData(): Promise<void> {
    // Sample providers
    const sampleProviders = [
      {
        personalInfo: {
          firstName: 'Sarah',
          lastName: 'Mitchell',
          title: 'MD',
          specialty: 'Internal Medicine',
          licenseNumber: 'MD123456',
          npiNumber: '1234567890',
          phone: '+1-555-0101',
          email: 'sarah.mitchell@healthcenter.com'
        },
        credentials: {
          medicalSchool: 'Harvard Medical School',
          residency: 'Massachusetts General Hospital',
          boardCertifications: ['Internal Medicine'],
          yearsOfExperience: 12
        },
        availability: {
          schedule: {
            monday: { isAvailable: true, startTime: '08:00', endTime: '17:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
            tuesday: { isAvailable: true, startTime: '08:00', endTime: '17:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
            wednesday: { isAvailable: true, startTime: '08:00', endTime: '17:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
            thursday: { isAvailable: true, startTime: '08:00', endTime: '17:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
            friday: { isAvailable: true, startTime: '08:00', endTime: '17:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
            saturday: { isAvailable: false, startTime: '', endTime: '', breaks: [] },
            sunday: { isAvailable: false, startTime: '', endTime: '', breaks: [] }
          },
          timeZone: 'America/New_York',
          consultationTypes: ['in-person', 'telemedicine']
        },
        ratings: {
          averageRating: 4.9,
          totalReviews: 156,
          patientSatisfaction: 98
        },
        isActive: true
      },
      {
        personalInfo: {
          firstName: 'Michael',
          lastName: 'Chen',
          title: 'MD',
          specialty: 'Cardiology',
          subSpecialty: 'Interventional Cardiology',
          licenseNumber: 'MD789012',
          npiNumber: '0987654321',
          phone: '+1-555-0102',
          email: 'michael.chen@heartcenter.com'
        },
        credentials: {
          medicalSchool: 'Johns Hopkins School of Medicine',
          residency: 'Johns Hopkins Hospital',
          fellowship: 'Cleveland Clinic',
          boardCertifications: ['Cardiology', 'Interventional Cardiology'],
          yearsOfExperience: 15
        },
        availability: {
          schedule: {
            monday: { isAvailable: true, startTime: '07:00', endTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
            tuesday: { isAvailable: true, startTime: '07:00', endTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
            wednesday: { isAvailable: true, startTime: '07:00', endTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
            thursday: { isAvailable: true, startTime: '07:00', endTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
            friday: { isAvailable: true, startTime: '07:00', endTime: '16:00', breaks: [{ startTime: '12:00', endTime: '13:00' }] },
            saturday: { isAvailable: true, startTime: '08:00', endTime: '12:00', breaks: [] },
            sunday: { isAvailable: false, startTime: '', endTime: '', breaks: [] }
          },
          timeZone: 'America/New_York',
          consultationTypes: ['in-person', 'telemedicine']
        },
        ratings: {
          averageRating: 4.8,
          totalReviews: 203,
          patientSatisfaction: 96
        },
        isActive: true
      }
    ];

    for (const provider of sampleProviders) {
      await this.createProvider(provider);
    }

    // Sample patient
    const samplePatient = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1985-06-15'),
        gender: 'male' as const,
        bloodType: 'O+',
        height: 175,
        weight: 75,
        phone: '+1-555-0123',
        email: 'john.doe@email.com',
        address: {
          street: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA'
        },
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1-555-0124'
        }
      },
      medicalHistory: {
        conditions: [],
        surgeries: [],
        allergies: [
          {
            id: 'allergy1',
            allergen: 'Penicillin',
            type: 'drug' as const,
            severity: 'moderate' as const,
            reaction: 'Rash and itching',
            onsetDate: new Date('2010-03-15')
          }
        ],
        familyHistory: [
          {
            id: 'fh1',
            relationship: 'Father',
            condition: 'Hypertension',
            ageOfOnset: 45
          }
        ],
        immunizations: []
      },
      currentMedications: [],
      vitalSigns: [],
      labResults: [],
      appointments: [],
      healthScans: []
    };

    await this.createPatient(samplePatient);
  }
}