import { HealthDatabase, Patient, Provider, Appointment, VitalSignRecord, LabResult, HealthScan } from './database';
import { MedicalAIEngine } from './ai-engine';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class HealthAPI {
  // Patient endpoints
  static async createPatient(patientData: any): Promise<APIResponse<Patient>> {
    try {
      const patient = await HealthDatabase.createPatient(patientData);
      return {
        success: true,
        data: patient,
        message: 'Patient created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getPatient(id: string): Promise<APIResponse<Patient>> {
    try {
      const patient = await HealthDatabase.getPatient(id);
      if (!patient) {
        return {
          success: false,
          error: 'Patient not found'
        };
      }
      return {
        success: true,
        data: patient
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async updatePatient(id: string, updates: Partial<Patient>): Promise<APIResponse<Patient>> {
    try {
      const patient = await HealthDatabase.updatePatient(id, updates);
      if (!patient) {
        return {
          success: false,
          error: 'Patient not found'
        };
      }
      return {
        success: true,
        data: patient,
        message: 'Patient updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getAllPatients(): Promise<APIResponse<Patient[]>> {
    try {
      const patients = await HealthDatabase.getAllPatients();
      return {
        success: true,
        data: patients
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Provider endpoints
  static async getAvailableProviders(specialty?: string): Promise<APIResponse<Provider[]>> {
    try {
      const providers = await HealthDatabase.getAvailableProviders(specialty);
      return {
        success: true,
        data: providers
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getProvider(id: string): Promise<APIResponse<Provider>> {
    try {
      const provider = await HealthDatabase.getProvider(id);
      if (!provider) {
        return {
          success: false,
          error: 'Provider not found'
        };
      }
      return {
        success: true,
        data: provider
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Appointment endpoints
  static async createAppointment(appointmentData: any): Promise<APIResponse<Appointment>> {
    try {
      // Validate appointment data
      const validation = await this.validateAppointment(appointmentData);
      if (!validation.success) {
        return validation;
      }

      const appointment = await HealthDatabase.createAppointment(appointmentData);
      return {
        success: true,
        data: appointment,
        message: 'Appointment scheduled successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getPatientAppointments(patientId: string): Promise<APIResponse<Appointment[]>> {
    try {
      const appointments = await HealthDatabase.getPatientAppointments(patientId);
      return {
        success: true,
        data: appointments
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getProviderAppointments(providerId: string): Promise<APIResponse<Appointment[]>> {
    try {
      const appointments = await HealthDatabase.getProviderAppointments(providerId);
      return {
        success: true,
        data: appointments
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Vital signs endpoints
  static async addVitalSigns(vitalSignsData: any): Promise<APIResponse<VitalSignRecord>> {
    try {
      const vitalSigns = await HealthDatabase.addVitalSigns(vitalSignsData);
      return {
        success: true,
        data: vitalSigns,
        message: 'Vital signs recorded successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getPatientVitalSigns(patientId: string, limit?: number): Promise<APIResponse<VitalSignRecord[]>> {
    try {
      const vitalSigns = await HealthDatabase.getPatientVitalSigns(patientId, limit);
      return {
        success: true,
        data: vitalSigns
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Lab results endpoints
  static async addLabResult(labResultData: any): Promise<APIResponse<LabResult>> {
    try {
      const labResult = await HealthDatabase.addLabResult(labResultData);
      return {
        success: true,
        data: labResult,
        message: 'Lab result added successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getPatientLabResults(patientId: string): Promise<APIResponse<LabResult[]>> {
    try {
      const labResults = await HealthDatabase.getPatientLabResults(patientId);
      return {
        success: true,
        data: labResults
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Health scan endpoints
  static async processHealthScan(scanData: any): Promise<APIResponse<HealthScan>> {
    try {
      // Process scan with AI
      const aiAnalysis = await MedicalAIEngine.analyzeHealthScan(scanData.scanData, scanData.patientHistory);
      
      const healthScan = {
        patientId: scanData.patientId,
        scanType: scanData.scanType,
        timestamp: new Date(),
        results: aiAnalysis,
        imageData: scanData.imageData,
        videoData: scanData.videoData,
        aiConfidence: 85 + Math.random() * 10 // Simulated confidence
      };

      const savedScan = await HealthDatabase.addHealthScan(healthScan);
      
      return {
        success: true,
        data: savedScan,
        message: 'Health scan processed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getPatientHealthScans(patientId: string): Promise<APIResponse<HealthScan[]>> {
    try {
      const healthScans = await HealthDatabase.getPatientHealthScans(patientId);
      return {
        success: true,
        data: healthScans
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // AI Analysis endpoints
  static async analyzeSymptoms(symptoms: string[], patientHistory?: any): Promise<APIResponse> {
    try {
      const analysis = await MedicalAIEngine.analyzeSymptoms(symptoms, patientHistory);
      return {
        success: true,
        data: analysis
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async checkDrugInteractions(medications: string[]): Promise<APIResponse> {
    try {
      const interactions = await MedicalAIEngine.checkDrugInteractions(medications);
      return {
        success: true,
        data: interactions
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async predictHealthRisks(patientData: any): Promise<APIResponse> {
    try {
      const risks = await MedicalAIEngine.predictHealthRisks(patientData);
      return {
        success: true,
        data: risks
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Health analytics endpoints
  static async getHealthAnalytics(patientId: string, timeframe: string): Promise<APIResponse> {
    try {
      const vitalSigns = await HealthDatabase.getPatientVitalSigns(patientId);
      const labResults = await HealthDatabase.getPatientLabResults(patientId);
      const healthScans = await HealthDatabase.getPatientHealthScans(patientId);

      const analytics = this.calculateHealthAnalytics(vitalSigns, labResults, healthScans, timeframe);
      
      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Telemedicine endpoints
  static async initiateTelemedicineSession(sessionData: any): Promise<APIResponse> {
    try {
      // Validate session data
      if (!sessionData.patientId || !sessionData.providerId) {
        return {
          success: false,
          error: 'Patient ID and Provider ID are required'
        };
      }

      const session = {
        id: this.generateSessionId(),
        patientId: sessionData.patientId,
        providerId: sessionData.providerId,
        startTime: new Date(),
        status: 'active',
        sessionType: sessionData.sessionType || 'video',
        roomId: this.generateRoomId()
      };

      return {
        success: true,
        data: session,
        message: 'Telemedicine session initiated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Emergency endpoints
  static async triggerEmergencyAlert(alertData: any): Promise<APIResponse> {
    try {
      const alert = {
        id: this.generateId(),
        patientId: alertData.patientId,
        type: alertData.type,
        severity: alertData.severity,
        location: alertData.location,
        timestamp: new Date(),
        status: 'active',
        description: alertData.description,
        vitalSigns: alertData.vitalSigns
      };

      // In a real implementation, this would trigger emergency services
      console.log('EMERGENCY ALERT:', alert);

      return {
        success: true,
        data: alert,
        message: 'Emergency alert triggered successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Private helper methods
  private static async validateAppointment(appointmentData: any): Promise<APIResponse> {
    if (!appointmentData.patientId) {
      return { success: false, error: 'Patient ID is required' };
    }

    if (!appointmentData.providerId) {
      return { success: false, error: 'Provider ID is required' };
    }

    if (!appointmentData.scheduledDate) {
      return { success: false, error: 'Scheduled date is required' };
    }

    // Check if provider is available
    const provider = await HealthDatabase.getProvider(appointmentData.providerId);
    if (!provider || !provider.isActive) {
      return { success: false, error: 'Provider is not available' };
    }

    return { success: true };
  }

  private static calculateHealthAnalytics(vitalSigns: VitalSignRecord[], labResults: LabResult[], healthScans: HealthScan[], timeframe: string): any {
    const now = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    const filteredVitals = vitalSigns.filter(v => v.timestamp >= startDate);
    const filteredLabs = labResults.filter(l => l.resultDate >= startDate);
    const filteredScans = healthScans.filter(s => s.timestamp >= startDate);

    return {
      summary: {
        totalVitalSignRecords: filteredVitals.length,
        totalLabResults: filteredLabs.length,
        totalHealthScans: filteredScans.length,
        timeframe
      },
      trends: {
        heartRate: this.calculateTrend(filteredVitals.map(v => v.heartRate)),
        bloodPressure: this.calculateTrend(filteredVitals.map(v => v.bloodPressure.systolic)),
        weight: this.calculateTrend(filteredVitals.map(v => v.weight).filter(w => w !== undefined))
      },
      averages: {
        heartRate: this.calculateAverage(filteredVitals.map(v => v.heartRate)),
        systolicBP: this.calculateAverage(filteredVitals.map(v => v.bloodPressure.systolic)),
        diastolicBP: this.calculateAverage(filteredVitals.map(v => v.bloodPressure.diastolic)),
        temperature: this.calculateAverage(filteredVitals.map(v => v.temperature))
      },
      healthScoreProgression: filteredScans.map(s => ({
        date: s.timestamp,
        score: s.results.overallScore
      }))
    };
  }

  private static calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = this.calculateAverage(firstHalf);
    const secondAvg = this.calculateAverage(secondHalf);
    
    const difference = secondAvg - firstAvg;
    const threshold = firstAvg * 0.05; // 5% threshold
    
    if (difference > threshold) return 'increasing';
    if (difference < -threshold) return 'decreasing';
    return 'stable';
  }

  private static calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static generateSessionId(): string {
    return 'session_' + this.generateId();
  }

  private static generateRoomId(): string {
    return 'room_' + this.generateId();
  }
}

// Initialize the backend
export async function initializeBackend(): Promise<void> {
  try {
    await HealthDatabase.initializeSampleData();
    await MedicalAIEngine.initialize();
    console.log('Backend initialized successfully');
  } catch (error) {
    console.error('Failed to initialize backend:', error);
  }
}