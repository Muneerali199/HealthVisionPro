export interface MedicalCondition {
  id: string;
  name: string;
  category: 'cardiovascular' | 'respiratory' | 'neurological' | 'endocrine' | 'musculoskeletal' | 'dermatological' | 'gastrointestinal' | 'psychiatric' | 'infectious' | 'oncological';
  symptoms: string[];
  riskFactors: string[];
  treatments: string[];
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  prevalence: number;
  description: string;
  diagnosticCriteria: string[];
  complications: string[];
  prevention: string[];
}

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  interactions: string[];
  dosage: {
    adult: string;
    pediatric: string;
    elderly: string;
  };
  mechanism: string;
  pharmacokinetics: {
    absorption: string;
    distribution: string;
    metabolism: string;
    elimination: string;
  };
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  normalRange: {
    min: number;
    max: number;
    unit: string;
  };
  description: string;
  indications: string[];
  preparation: string[];
  interpretation: {
    low: string;
    normal: string;
    high: string;
  };
}

export const medicalConditions: MedicalCondition[] = [
  {
    id: 'hypertension',
    name: 'Hypertension',
    category: 'cardiovascular',
    symptoms: ['Headaches', 'Dizziness', 'Chest pain', 'Shortness of breath', 'Nosebleeds'],
    riskFactors: ['Age', 'Family history', 'Obesity', 'Sedentary lifestyle', 'High sodium diet', 'Smoking', 'Excessive alcohol'],
    treatments: ['ACE inhibitors', 'Beta blockers', 'Diuretics', 'Lifestyle modifications', 'Dietary changes'],
    severity: 'moderate',
    prevalence: 45.4,
    description: 'A condition where blood pressure in the arteries is persistently elevated',
    diagnosticCriteria: ['Systolic BP ≥140 mmHg', 'Diastolic BP ≥90 mmHg', 'Multiple readings over time'],
    complications: ['Heart attack', 'Stroke', 'Heart failure', 'Kidney disease', 'Vision problems'],
    prevention: ['Regular exercise', 'Healthy diet', 'Weight management', 'Limit alcohol', 'Quit smoking']
  },
  {
    id: 'diabetes-t2',
    name: 'Type 2 Diabetes',
    category: 'endocrine',
    symptoms: ['Increased thirst', 'Frequent urination', 'Fatigue', 'Blurred vision', 'Slow healing wounds'],
    riskFactors: ['Obesity', 'Age >45', 'Family history', 'Sedentary lifestyle', 'High blood pressure'],
    treatments: ['Metformin', 'Insulin therapy', 'Lifestyle modifications', 'Blood glucose monitoring'],
    severity: 'moderate',
    prevalence: 11.3,
    description: 'A metabolic disorder characterized by high blood sugar due to insulin resistance',
    diagnosticCriteria: ['Fasting glucose ≥126 mg/dL', 'HbA1c ≥6.5%', 'Random glucose ≥200 mg/dL with symptoms'],
    complications: ['Diabetic retinopathy', 'Nephropathy', 'Neuropathy', 'Cardiovascular disease'],
    prevention: ['Weight management', 'Regular exercise', 'Healthy diet', 'Regular screening']
  },
  {
    id: 'depression',
    name: 'Major Depressive Disorder',
    category: 'psychiatric',
    symptoms: ['Persistent sadness', 'Loss of interest', 'Fatigue', 'Sleep disturbances', 'Appetite changes'],
    riskFactors: ['Family history', 'Trauma', 'Chronic illness', 'Substance abuse', 'Social isolation'],
    treatments: ['Antidepressants', 'Psychotherapy', 'Cognitive behavioral therapy', 'Lifestyle changes'],
    severity: 'moderate',
    prevalence: 8.5,
    description: 'A mental health disorder characterized by persistent feelings of sadness and loss of interest',
    diagnosticCriteria: ['Depressed mood', 'Anhedonia', 'Duration >2 weeks', 'Functional impairment'],
    complications: ['Suicide risk', 'Substance abuse', 'Social isolation', 'Physical health problems'],
    prevention: ['Stress management', 'Social support', 'Regular exercise', 'Adequate sleep']
  }
];

export const medications: Medication[] = [
  {
    id: 'lisinopril',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    category: 'ACE Inhibitor',
    dosageForm: 'Tablet',
    strength: '10mg, 20mg, 40mg',
    indications: ['Hypertension', 'Heart failure', 'Post-MI cardioprotection'],
    contraindications: ['Pregnancy', 'Angioedema history', 'Bilateral renal artery stenosis'],
    sideEffects: ['Dry cough', 'Hyperkalemia', 'Angioedema', 'Hypotension', 'Renal impairment'],
    interactions: ['NSAIDs', 'Potassium supplements', 'Lithium'],
    dosage: {
      adult: '10-40mg once daily',
      pediatric: 'Not recommended <6 years',
      elderly: 'Start with lower dose'
    },
    mechanism: 'Inhibits ACE enzyme, reducing angiotensin II formation',
    pharmacokinetics: {
      absorption: 'Oral bioavailability ~25%',
      distribution: 'Does not cross blood-brain barrier',
      metabolism: 'Not metabolized',
      elimination: 'Renal excretion, half-life 12 hours'
    }
  },
  {
    id: 'metformin',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    category: 'Biguanide',
    dosageForm: 'Tablet, Extended-release',
    strength: '500mg, 850mg, 1000mg',
    indications: ['Type 2 diabetes', 'Prediabetes', 'PCOS'],
    contraindications: ['Severe renal impairment', 'Metabolic acidosis', 'Severe heart failure'],
    sideEffects: ['GI upset', 'Lactic acidosis (rare)', 'Vitamin B12 deficiency', 'Metallic taste'],
    interactions: ['Contrast agents', 'Alcohol', 'Cimetidine'],
    dosage: {
      adult: '500-2000mg daily in divided doses',
      pediatric: '500-2000mg daily (>10 years)',
      elderly: 'Reduce dose if renal impairment'
    },
    mechanism: 'Decreases hepatic glucose production, improves insulin sensitivity',
    pharmacokinetics: {
      absorption: 'Oral bioavailability ~50-60%',
      distribution: 'Does not bind to plasma proteins',
      metabolism: 'Not metabolized',
      elimination: 'Renal excretion, half-life 4-9 hours'
    }
  }
];

export const labTests: LabTest[] = [
  {
    id: 'hba1c',
    name: 'Hemoglobin A1c',
    category: 'Diabetes Monitoring',
    normalRange: { min: 4.0, max: 5.6, unit: '%' },
    description: 'Measures average blood glucose over 2-3 months',
    indications: ['Diabetes diagnosis', 'Diabetes monitoring', 'Prediabetes screening'],
    preparation: ['No fasting required', 'Can be done any time of day'],
    interpretation: {
      low: 'May indicate hypoglycemia or certain anemias',
      normal: 'Normal glucose metabolism',
      high: 'Indicates diabetes (≥6.5%) or prediabetes (5.7-6.4%)'
    }
  },
  {
    id: 'lipid-panel',
    name: 'Lipid Panel',
    category: 'Cardiovascular Risk',
    normalRange: { min: 0, max: 200, unit: 'mg/dL' },
    description: 'Measures cholesterol and triglycerides',
    indications: ['Cardiovascular risk assessment', 'Lipid disorder monitoring'],
    preparation: ['12-hour fasting required', 'Avoid alcohol 24 hours prior'],
    interpretation: {
      low: 'May indicate malnutrition or liver disease',
      normal: 'Low cardiovascular risk',
      high: 'Increased cardiovascular risk'
    }
  }
];

export class MedicalAI {
  static analyzeSymptoms(symptoms: string[]): {
    possibleConditions: MedicalCondition[];
    confidence: number;
    recommendations: string[];
  } {
    const matchingConditions = medicalConditions.filter(condition =>
      symptoms.some(symptom =>
        condition.symptoms.some(conditionSymptom =>
          conditionSymptom.toLowerCase().includes(symptom.toLowerCase()) ||
          symptom.toLowerCase().includes(conditionSymptom.toLowerCase())
        )
      )
    );

    const scoredConditions = matchingConditions.map(condition => {
      const matchCount = symptoms.filter(symptom =>
        condition.symptoms.some(conditionSymptom =>
          conditionSymptom.toLowerCase().includes(symptom.toLowerCase()) ||
          symptom.toLowerCase().includes(conditionSymptom.toLowerCase())
        )
      ).length;

      return {
        condition,
        score: (matchCount / condition.symptoms.length) * 100
      };
    }).sort((a, b) => b.score - a.score);

    const topConditions = scoredConditions.slice(0, 3).map(item => item.condition);
    const confidence = scoredConditions.length > 0 ? scoredConditions[0].score : 0;

    const recommendations = [
      'Consult with a healthcare professional for proper diagnosis',
      'Monitor symptoms and their progression',
      'Maintain a symptom diary',
      'Consider lifestyle modifications based on risk factors'
    ];

    return {
      possibleConditions: topConditions,
      confidence,
      recommendations
    };
  }

  static checkDrugInteractions(medicationIds: string[]): {
    interactions: Array<{
      medications: string[];
      severity: 'mild' | 'moderate' | 'severe';
      description: string;
    }>;
    warnings: string[];
  } {
    const interactions = [];
    const warnings = [];

    // Simulate drug interaction checking
    if (medicationIds.includes('lisinopril') && medicationIds.includes('metformin')) {
      interactions.push({
        medications: ['Lisinopril', 'Metformin'],
        severity: 'mild' as const,
        description: 'Monitor kidney function when using together'
      });
    }

    return { interactions, warnings };
  }

  static interpretLabResults(testId: string, value: number): {
    interpretation: string;
    status: 'low' | 'normal' | 'high';
    recommendations: string[];
  } {
    const test = labTests.find(t => t.id === testId);
    if (!test) {
      return {
        interpretation: 'Test not found',
        status: 'normal',
        recommendations: []
      };
    }

    let status: 'low' | 'normal' | 'high';
    let interpretation: string;
    let recommendations: string[] = [];

    if (value < test.normalRange.min) {
      status = 'low';
      interpretation = test.interpretation.low;
      recommendations.push('Consider retesting', 'Consult healthcare provider');
    } else if (value > test.normalRange.max) {
      status = 'high';
      interpretation = test.interpretation.high;
      recommendations.push('Lifestyle modifications may be needed', 'Follow up with healthcare provider');
    } else {
      status = 'normal';
      interpretation = test.interpretation.normal;
      recommendations.push('Continue current health practices');
    }

    return { interpretation, status, recommendations };
  }
}