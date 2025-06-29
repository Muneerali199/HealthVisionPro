import { HealthScanData, HealthAssessment } from '../ai-health-analyzer';

export interface AIModel {
  id: string;
  name: string;
  version: string;
  type: 'classification' | 'regression' | 'detection' | 'analysis';
  accuracy: number;
  trainingData: string;
  lastUpdated: Date;
}

export interface PredictionResult {
  prediction: any;
  confidence: number;
  modelUsed: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface MedicalKnowledgeBase {
  diseases: DiseaseInfo[];
  symptoms: SymptomInfo[];
  treatments: TreatmentInfo[];
  drugInteractions: DrugInteraction[];
  diagnosticCriteria: DiagnosticCriteria[];
}

export interface DiseaseInfo {
  id: string;
  name: string;
  icd10Code: string;
  category: string;
  prevalence: number;
  symptoms: string[];
  riskFactors: string[];
  complications: string[];
  prognosis: string;
  treatment: string[];
  prevention: string[];
  differentialDiagnosis: string[];
}

export interface SymptomInfo {
  id: string;
  name: string;
  category: string;
  severity: 'mild' | 'moderate' | 'severe';
  associatedDiseases: string[];
  redFlags: string[];
  commonCauses: string[];
}

export interface TreatmentInfo {
  id: string;
  name: string;
  type: 'medication' | 'procedure' | 'therapy' | 'lifestyle';
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  effectiveness: number;
  cost: 'low' | 'medium' | 'high';
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  mechanism: string;
  clinicalEffect: string;
  management: string;
}

export interface DiagnosticCriteria {
  diseaseId: string;
  criteria: {
    major: string[];
    minor: string[];
    laboratory: string[];
    imaging: string[];
  };
  algorithm: string;
}

export class MedicalAIEngine {
  private static knowledgeBase: MedicalKnowledgeBase = {
    diseases: [],
    symptoms: [],
    treatments: [],
    drugInteractions: [],
    diagnosticCriteria: []
  };

  private static models: Map<string, AIModel> = new Map();

  // Initialize AI models and knowledge base
  static async initialize(): Promise<void> {
    await this.loadKnowledgeBase();
    await this.loadAIModels();
  }

  // Comprehensive symptom analysis
  static async analyzeSymptoms(symptoms: string[], patientHistory?: any): Promise<{
    possibleDiagnoses: Array<{
      disease: DiseaseInfo;
      probability: number;
      reasoning: string;
      requiredTests: string[];
      urgency: 'low' | 'medium' | 'high' | 'emergency';
    }>;
    recommendations: string[];
    redFlags: string[];
    nextSteps: string[];
  }> {
    const possibleDiagnoses = [];
    const redFlags = [];
    const recommendations = [];

    // Analyze each symptom
    for (const symptom of symptoms) {
      const symptomInfo = this.knowledgeBase.symptoms.find(s => 
        s.name.toLowerCase().includes(symptom.toLowerCase())
      );

      if (symptomInfo) {
        redFlags.push(...symptomInfo.redFlags);
        
        // Find associated diseases
        for (const diseaseId of symptomInfo.associatedDiseases) {
          const disease = this.knowledgeBase.diseases.find(d => d.id === diseaseId);
          if (disease) {
            const matchingSymptoms = disease.symptoms.filter(s => 
              symptoms.some(userSymptom => 
                s.toLowerCase().includes(userSymptom.toLowerCase())
              )
            );
            
            const probability = (matchingSymptoms.length / disease.symptoms.length) * 100;
            
            if (probability > 20) {
              possibleDiagnoses.push({
                disease,
                probability,
                reasoning: `${matchingSymptoms.length} of ${disease.symptoms.length} symptoms match`,
                requiredTests: this.getRequiredTests(disease.id),
                urgency: this.assessUrgency(disease, symptoms)
              });
            }
          }
        }
      }
    }

    // Sort by probability
    possibleDiagnoses.sort((a, b) => b.probability - a.probability);

    // Generate recommendations
    recommendations.push(
      'Consult with a healthcare professional for proper diagnosis',
      'Keep a detailed symptom diary',
      'Monitor symptom progression and severity'
    );

    if (redFlags.length > 0) {
      recommendations.unshift('Seek immediate medical attention due to red flag symptoms');
    }

    return {
      possibleDiagnoses: possibleDiagnoses.slice(0, 5),
      recommendations,
      redFlags: [...new Set(redFlags)],
      nextSteps: this.generateNextSteps(possibleDiagnoses)
    };
  }

  // Advanced health scan analysis
  static async analyzeHealthScan(scanData: HealthScanData, patientHistory?: any): Promise<HealthAssessment> {
    const findings = [];
    const urgentAlerts = [];
    const recommendations = [];

    // Cardiovascular analysis
    const cardioScore = await this.analyzeCardiovascular(scanData.vitalSigns);
    findings.push({
      category: 'Cardiovascular Health',
      score: cardioScore.score,
      status: this.getHealthStatus(cardioScore.score),
      description: cardioScore.description,
      recommendations: cardioScore.recommendations
    });

    if (cardioScore.urgent) {
      urgentAlerts.push(cardioScore.urgentMessage);
    }

    // Respiratory analysis
    const respScore = await this.analyzeRespiratory(scanData.vitalSigns);
    findings.push({
      category: 'Respiratory Function',
      score: respScore.score,
      status: this.getHealthStatus(respScore.score),
      description: respScore.description,
      recommendations: respScore.recommendations
    });

    // Facial analysis
    const faceScore = await this.analyzeFacialFeatures(scanData.faceAnalysis);
    findings.push({
      category: 'Facial Health Analysis',
      score: faceScore.score,
      status: this.getHealthStatus(faceScore.score),
      description: faceScore.description,
      recommendations: faceScore.recommendations
    });

    // Body composition analysis
    const bodyScore = await this.analyzeBodyComposition(scanData.bodyComposition);
    findings.push({
      category: 'Body Composition',
      score: bodyScore.score,
      status: this.getHealthStatus(bodyScore.score),
      description: bodyScore.description,
      recommendations: bodyScore.recommendations
    });

    const overallScore = findings.reduce((sum, f) => sum + f.score, 0) / findings.length;
    const riskLevel = this.calculateRiskLevel(overallScore, urgentAlerts.length);

    // Generate comprehensive recommendations
    recommendations.push(
      'Maintain regular health monitoring',
      'Follow up with healthcare provider as recommended',
      'Continue healthy lifestyle practices'
    );

    return {
      overallScore: Math.round(overallScore),
      riskLevel,
      findings,
      urgentAlerts,
      followUpRecommendations: recommendations
    };
  }

  // Drug interaction checker
  static async checkDrugInteractions(medications: string[]): Promise<{
    interactions: DrugInteraction[];
    severity: 'none' | 'minor' | 'moderate' | 'major' | 'contraindicated';
    recommendations: string[];
  }> {
    const interactions = [];
    let maxSeverity = 'none';

    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const interaction = this.knowledgeBase.drugInteractions.find(di =>
          (di.drug1.toLowerCase() === medications[i].toLowerCase() && 
           di.drug2.toLowerCase() === medications[j].toLowerCase()) ||
          (di.drug1.toLowerCase() === medications[j].toLowerCase() && 
           di.drug2.toLowerCase() === medications[i].toLowerCase())
        );

        if (interaction) {
          interactions.push(interaction);
          if (this.getSeverityLevel(interaction.severity) > this.getSeverityLevel(maxSeverity)) {
            maxSeverity = interaction.severity;
          }
        }
      }
    }

    const recommendations = this.generateInteractionRecommendations(interactions);

    return {
      interactions,
      severity: maxSeverity as any,
      recommendations
    };
  }

  // Predictive health analytics
  static async predictHealthRisks(patientData: any): Promise<{
    risks: Array<{
      condition: string;
      probability: number;
      timeframe: string;
      riskFactors: string[];
      prevention: string[];
    }>;
    overallRiskScore: number;
    recommendations: string[];
  }> {
    const risks = [];
    
    // Cardiovascular risk prediction
    const cvdRisk = await this.predictCardiovascularRisk(patientData);
    if (cvdRisk.probability > 10) {
      risks.push(cvdRisk);
    }

    // Diabetes risk prediction
    const diabetesRisk = await this.predictDiabetesRisk(patientData);
    if (diabetesRisk.probability > 15) {
      risks.push(diabetesRisk);
    }

    // Cancer screening recommendations
    const cancerRisks = await this.assessCancerRisks(patientData);
    risks.push(...cancerRisks);

    const overallRiskScore = risks.length > 0 
      ? risks.reduce((sum, r) => sum + r.probability, 0) / risks.length 
      : 0;

    const recommendations = this.generateRiskRecommendations(risks);

    return {
      risks,
      overallRiskScore,
      recommendations
    };
  }

  // Private helper methods
  private static async loadKnowledgeBase(): Promise<void> {
    // Load comprehensive medical knowledge base
    this.knowledgeBase.diseases = [
      {
        id: 'hypertension',
        name: 'Hypertension',
        icd10Code: 'I10',
        category: 'Cardiovascular',
        prevalence: 45.4,
        symptoms: ['headache', 'dizziness', 'chest pain', 'shortness of breath'],
        riskFactors: ['age', 'obesity', 'smoking', 'high sodium diet', 'family history'],
        complications: ['stroke', 'heart attack', 'kidney disease', 'heart failure'],
        prognosis: 'Good with proper management',
        treatment: ['ACE inhibitors', 'lifestyle modifications', 'dietary changes'],
        prevention: ['regular exercise', 'healthy diet', 'weight management'],
        differentialDiagnosis: ['white coat hypertension', 'secondary hypertension']
      },
      {
        id: 'diabetes-t2',
        name: 'Type 2 Diabetes Mellitus',
        icd10Code: 'E11',
        category: 'Endocrine',
        prevalence: 11.3,
        symptoms: ['increased thirst', 'frequent urination', 'fatigue', 'blurred vision'],
        riskFactors: ['obesity', 'sedentary lifestyle', 'family history', 'age over 45'],
        complications: ['diabetic retinopathy', 'nephropathy', 'neuropathy', 'cardiovascular disease'],
        prognosis: 'Good with proper management',
        treatment: ['metformin', 'lifestyle modifications', 'insulin therapy'],
        prevention: ['weight management', 'regular exercise', 'healthy diet'],
        differentialDiagnosis: ['type 1 diabetes', 'MODY', 'secondary diabetes']
      }
    ];

    this.knowledgeBase.symptoms = [
      {
        id: 'headache',
        name: 'Headache',
        category: 'Neurological',
        severity: 'moderate',
        associatedDiseases: ['hypertension', 'migraine', 'tension-headache'],
        redFlags: ['sudden severe headache', 'headache with fever and neck stiffness'],
        commonCauses: ['tension', 'dehydration', 'stress', 'eye strain']
      },
      {
        id: 'chest-pain',
        name: 'Chest Pain',
        category: 'Cardiovascular',
        severity: 'severe',
        associatedDiseases: ['myocardial-infarction', 'angina', 'pulmonary-embolism'],
        redFlags: ['crushing chest pain', 'pain radiating to arm or jaw', 'shortness of breath'],
        commonCauses: ['heart disease', 'muscle strain', 'acid reflux', 'anxiety']
      }
    ];

    this.knowledgeBase.drugInteractions = [
      {
        drug1: 'Warfarin',
        drug2: 'Aspirin',
        severity: 'major',
        mechanism: 'Additive anticoagulant effects',
        clinicalEffect: 'Increased bleeding risk',
        management: 'Monitor INR closely, consider dose adjustment'
      },
      {
        drug1: 'Lisinopril',
        drug2: 'Potassium supplements',
        severity: 'moderate',
        mechanism: 'Additive hyperkalemic effects',
        clinicalEffect: 'Increased potassium levels',
        management: 'Monitor serum potassium levels'
      }
    ];
  }

  private static async loadAIModels(): Promise<void> {
    const models = [
      {
        id: 'cardiovascular-risk',
        name: 'Cardiovascular Risk Predictor',
        version: '2.1.0',
        type: 'regression' as const,
        accuracy: 89.5,
        trainingData: 'Framingham Heart Study + NHANES data',
        lastUpdated: new Date('2024-01-15')
      },
      {
        id: 'symptom-classifier',
        name: 'Symptom Classification Model',
        version: '1.8.0',
        type: 'classification' as const,
        accuracy: 92.3,
        trainingData: 'Medical literature + clinical databases',
        lastUpdated: new Date('2024-01-10')
      },
      {
        id: 'facial-health-analyzer',
        name: 'Facial Health Analysis Model',
        version: '1.5.0',
        type: 'detection' as const,
        accuracy: 87.1,
        trainingData: 'Dermatological image datasets',
        lastUpdated: new Date('2024-01-05')
      }
    ];

    models.forEach(model => this.models.set(model.id, model));
  }

  private static async analyzeCardiovascular(vitals: any): Promise<any> {
    let score = 100;
    let urgent = false;
    let urgentMessage = '';
    const recommendations = [];

    if (vitals.heartRate < 50 || vitals.heartRate > 120) {
      score -= 20;
      if (vitals.heartRate < 40 || vitals.heartRate > 150) {
        urgent = true;
        urgentMessage = 'Critical heart rate detected - seek immediate medical attention';
      }
      recommendations.push('Monitor heart rate regularly');
    }

    if (vitals.bloodPressure.systolic > 140 || vitals.bloodPressure.diastolic > 90) {
      score -= 15;
      if (vitals.bloodPressure.systolic > 180 || vitals.bloodPressure.diastolic > 110) {
        urgent = true;
        urgentMessage = 'Severe hypertension detected - seek immediate medical attention';
      }
      recommendations.push('Reduce sodium intake', 'Increase physical activity');
    }

    return {
      score: Math.max(0, score),
      description: 'Analysis of heart rate, blood pressure, and circulation',
      recommendations,
      urgent,
      urgentMessage
    };
  }

  private static async analyzeRespiratory(vitals: any): Promise<any> {
    let score = 100;
    const recommendations = [];

    if (vitals.oxygenSaturation < 95) {
      score -= 25;
      recommendations.push('Practice deep breathing exercises', 'Ensure good air quality');
    }

    if (vitals.respiratoryRate < 12 || vitals.respiratoryRate > 20) {
      score -= 10;
      recommendations.push('Monitor breathing patterns');
    }

    return {
      score: Math.max(0, score),
      description: 'Assessment of breathing patterns and oxygen saturation',
      recommendations
    };
  }

  private static async analyzeFacialFeatures(faceAnalysis: any): Promise<any> {
    let score = (faceAnalysis.skinHealth + faceAnalysis.eyeClarity + faceAnalysis.facialSymmetry) / 3;
    const recommendations = [];

    if (faceAnalysis.skinHealth < 70) {
      recommendations.push('Increase hydration', 'Use moisturizer regularly');
    }

    if (faceAnalysis.stressIndicators > 60) {
      score -= 10;
      recommendations.push('Practice stress management techniques', 'Ensure adequate sleep');
    }

    return {
      score: Math.max(0, score),
      description: 'Analysis of facial features, skin health, and stress indicators',
      recommendations
    };
  }

  private static async analyzeBodyComposition(bodyComp: any): Promise<any> {
    let score = 100;
    const recommendations = [];

    if (bodyComp.bmi < 18.5 || bodyComp.bmi > 30) {
      score -= 20;
      recommendations.push('Consult with nutritionist', 'Develop healthy eating plan');
    }

    if (bodyComp.bodyFat > 30) {
      score -= 15;
      recommendations.push('Increase physical activity', 'Focus on strength training');
    }

    if (bodyComp.hydrationLevel < 70) {
      score -= 10;
      recommendations.push('Increase daily water intake');
    }

    return {
      score: Math.max(0, score),
      description: 'Assessment of BMI, body fat, muscle mass, and hydration',
      recommendations
    };
  }

  private static getHealthStatus(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  }

  private static calculateRiskLevel(score: number, alertCount: number): 'low' | 'moderate' | 'high' | 'critical' {
    if (alertCount > 0) return 'critical';
    if (score < 50) return 'high';
    if (score < 70) return 'moderate';
    return 'low';
  }

  private static getRequiredTests(diseaseId: string): string[] {
    const criteria = this.knowledgeBase.diagnosticCriteria.find(c => c.diseaseId === diseaseId);
    return criteria ? [...criteria.criteria.laboratory, ...criteria.criteria.imaging] : [];
  }

  private static assessUrgency(disease: DiseaseInfo, symptoms: string[]): 'low' | 'medium' | 'high' | 'emergency' {
    const emergencySymptoms = ['chest pain', 'severe headache', 'difficulty breathing', 'loss of consciousness'];
    const hasEmergencySymptom = symptoms.some(s => 
      emergencySymptoms.some(es => s.toLowerCase().includes(es))
    );

    if (hasEmergencySymptom) return 'emergency';
    if (disease.category === 'Cardiovascular') return 'high';
    return 'medium';
  }

  private static generateNextSteps(diagnoses: any[]): string[] {
    const steps = ['Schedule appointment with primary care physician'];
    
    if (diagnoses.some(d => d.urgency === 'emergency')) {
      steps.unshift('Seek immediate emergency medical care');
    } else if (diagnoses.some(d => d.urgency === 'high')) {
      steps.unshift('Schedule urgent medical consultation within 24-48 hours');
    }

    return steps;
  }

  private static getSeverityLevel(severity: string): number {
    const levels = { 'none': 0, 'minor': 1, 'moderate': 2, 'major': 3, 'contraindicated': 4 };
    return levels[severity] || 0;
  }

  private static generateInteractionRecommendations(interactions: DrugInteraction[]): string[] {
    const recommendations = [];
    
    if (interactions.some(i => i.severity === 'contraindicated')) {
      recommendations.push('URGENT: Contraindicated drug combination detected - contact healthcare provider immediately');
    }
    
    if (interactions.some(i => i.severity === 'major')) {
      recommendations.push('Major drug interaction detected - requires medical supervision');
    }

    recommendations.push('Review all medications with healthcare provider or pharmacist');
    return recommendations;
  }

  private static async predictCardiovascularRisk(patientData: any): Promise<any> {
    // Simplified cardiovascular risk calculation
    let probability = 0;
    const riskFactors = [];

    if (patientData.age > 45) {
      probability += 15;
      riskFactors.push('Age over 45');
    }

    if (patientData.smoking) {
      probability += 20;
      riskFactors.push('Smoking');
    }

    if (patientData.bmi > 30) {
      probability += 10;
      riskFactors.push('Obesity');
    }

    return {
      condition: 'Cardiovascular Disease',
      probability,
      timeframe: '10 years',
      riskFactors,
      prevention: ['Quit smoking', 'Regular exercise', 'Healthy diet', 'Weight management']
    };
  }

  private static async predictDiabetesRisk(patientData: any): Promise<any> {
    let probability = 0;
    const riskFactors = [];

    if (patientData.age > 45) {
      probability += 10;
      riskFactors.push('Age over 45');
    }

    if (patientData.bmi > 25) {
      probability += 15;
      riskFactors.push('Overweight');
    }

    if (patientData.familyHistory?.includes('diabetes')) {
      probability += 20;
      riskFactors.push('Family history of diabetes');
    }

    return {
      condition: 'Type 2 Diabetes',
      probability,
      timeframe: '5 years',
      riskFactors,
      prevention: ['Weight management', 'Regular exercise', 'Healthy diet', 'Regular screening']
    };
  }

  private static async assessCancerRisks(patientData: any): Promise<any[]> {
    const risks = [];
    
    // Age-based screening recommendations
    if (patientData.age >= 50) {
      risks.push({
        condition: 'Colorectal Cancer',
        probability: 5,
        timeframe: 'Lifetime',
        riskFactors: ['Age over 50'],
        prevention: ['Regular colonoscopy screening', 'Healthy diet', 'Regular exercise']
      });
    }

    if (patientData.gender === 'female' && patientData.age >= 40) {
      risks.push({
        condition: 'Breast Cancer',
        probability: 12,
        timeframe: 'Lifetime',
        riskFactors: ['Female gender', 'Age over 40'],
        prevention: ['Regular mammography', 'Self-examination', 'Healthy lifestyle']
      });
    }

    return risks;
  }

  private static generateRiskRecommendations(risks: any[]): string[] {
    const recommendations = ['Maintain regular health check-ups'];
    
    if (risks.some(r => r.probability > 20)) {
      recommendations.push('Discuss high-risk conditions with healthcare provider');
    }

    recommendations.push('Follow age-appropriate screening guidelines');
    recommendations.push('Maintain healthy lifestyle practices');
    
    return recommendations;
  }
}