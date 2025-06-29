import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiAIClient {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async analyzeHealthData(healthData: any): Promise<{
    analysis: string;
    recommendations: string[];
    riskAssessment: string;
    confidence: number;
  }> {
    const prompt = `
    As an advanced medical AI assistant, analyze the following health data and provide:
    1. Comprehensive health analysis
    2. Specific recommendations
    3. Risk assessment
    4. Confidence level (0-100)

    Health Data:
    ${JSON.stringify(healthData, null, 2)}

    Please provide a detailed medical analysis focusing on:
    - Current health status
    - Potential health risks
    - Preventive measures
    - Lifestyle recommendations
    - When to seek medical attention

    Format your response as JSON with the following structure:
    {
      "analysis": "detailed analysis",
      "recommendations": ["recommendation1", "recommendation2"],
      "riskAssessment": "risk level and explanation",
      "confidence": number
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return {
        analysis: text,
        recommendations: ['Consult with healthcare provider', 'Monitor symptoms'],
        riskAssessment: 'Unable to assess risk',
        confidence: 70
      };
    } catch (error) {
      console.error('Gemini AI analysis error:', error);
      throw new Error('Failed to analyze health data');
    }
  }

  async chatWithAI(message: string, context?: any): Promise<string> {
    const prompt = `
    You are an advanced medical AI assistant. Respond to the following health-related question:
    
    Question: ${message}
    
    ${context ? `Context: ${JSON.stringify(context)}` : ''}
    
    Provide a helpful, accurate, and professional medical response. Always remind users to consult healthcare professionals for serious concerns.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini AI chat error:', error);
      return 'I apologize, but I\'m unable to process your request at the moment. Please try again or consult with a healthcare professional.';
    }
  }

  async analyzeSymptoms(symptoms: string[]): Promise<{
    possibleConditions: Array<{
      name: string;
      probability: number;
      description: string;
      urgency: string;
    }>;
    recommendations: string[];
    redFlags: string[];
  }> {
    const prompt = `
    Analyze the following symptoms and provide medical insights:
    
    Symptoms: ${symptoms.join(', ')}
    
    Please provide:
    1. Possible medical conditions with probability percentages
    2. General recommendations
    3. Red flag symptoms that require immediate attention
    
    Format as JSON:
    {
      "possibleConditions": [
        {
          "name": "condition name",
          "probability": percentage,
          "description": "brief description",
          "urgency": "low/medium/high/emergency"
        }
      ],
      "recommendations": ["recommendation1", "recommendation2"],
      "redFlags": ["red flag1", "red flag2"]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        possibleConditions: [],
        recommendations: ['Consult healthcare provider'],
        redFlags: []
      };
    } catch (error) {
      console.error('Symptom analysis error:', error);
      throw new Error('Failed to analyze symptoms');
    }
  }

  async generateHealthPlan(userProfile: any): Promise<{
    plan: string;
    goals: string[];
    timeline: string;
    milestones: Array<{ week: number; goal: string; }>;
  }> {
    const prompt = `
    Create a personalized health plan for the following user profile:
    
    ${JSON.stringify(userProfile, null, 2)}
    
    Generate a comprehensive health plan including:
    1. Overall health improvement strategy
    2. Specific health goals
    3. Timeline for achieving goals
    4. Weekly milestones
    
    Format as JSON:
    {
      "plan": "detailed health plan",
      "goals": ["goal1", "goal2"],
      "timeline": "timeline description",
      "milestones": [
        {"week": 1, "goal": "week 1 goal"},
        {"week": 2, "goal": "week 2 goal"}
      ]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        plan: 'Unable to generate plan',
        goals: [],
        timeline: '',
        milestones: []
      };
    } catch (error) {
      console.error('Health plan generation error:', error);
      throw new Error('Failed to generate health plan');
    }
  }
}

export const geminiClient = new GeminiAIClient();