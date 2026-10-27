export interface JobSubmission {
  id?: string;
  title: string;
  company: string;
  description: string;
  salary?: string;
  location?: string;
  workArrangement: 'remote' | 'hybrid' | 'onsite' | 'unspecified';
  employerWebsite?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactOther?: string; // e.g. Telegram, WhatsApp
  requiresPayment: boolean;
  paymentDetails?: string;
  jobUrl?: string;
  submittedAt?: string;
}

export type RiskCategory = 'low' | 'moderate' | 'high' | 'very_high';

export interface WarningSign {
  id: string;
  category: 'payment' | 'contact' | 'salary' | 'vague_text' | 'urgency' | 'sensitive_info' | 'company_verification';
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  evidence: string;
  explanation: string;
  contributionScore: number; // Contribution to the risk score (e.g. +25)
  recommendation: string;
}

export interface FeatureContribution {
  feature: string;
  value: number; // positive increases scam probability, negative decreases
  type: 'text_ngram' | 'structured_field' | 'heuristic';
  label: string;
  direction: 'scam_indicator' | 'legitimacy_indicator';
}

export interface SimilarPostingMatch {
  postingId: string;
  title: string;
  company: string;
  similarityScore: number; // 0 to 1
  sharedIndicators: string[];
  matchedFields: {
    field: string;
    description: string;
  }[];
  riskCategory: RiskCategory;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AnalysisResult {
  id: string;
  userId?: string; // Owner of the analysis for private history isolation
  submission: JobSubmission;
  timestamp: string;
  riskScore: number; // 0 - 100
  riskCategory: RiskCategory;
  modelProbability: number; // 0 - 1 raw or calibrated ML output
  calibratedScore: number; // 0 - 100
  isCalibrated: boolean;
  warningSigns: WarningSign[];
  featureContributions: FeatureContribution[];
  recommendations: string[];
  similarPostings: SimilarPostingMatch[];
  heuristicFlagsCount: number;
  modelVersion: string;
  summaryVerdict: string;
}

export interface ModelMetricData {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  supportFraud: number;
  supportLegit: number;
}

export interface ConfusionMatrixData {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
}

export interface DatasetStatistics {
  datasetName: string;
  totalRecords: number;
  fraudulentRecords: number;
  legitimateRecords: number;
  fraudulentPercentage: number;
  telecommutingFraudRate: number;
  missingLogoFraudRate: number;
  hasQuestionsFraudRate: number;
  topScamNgrams: { term: string; count: number; weight: number }[];
  topLegitNgrams: { term: string; count: number; weight: number }[];
  salaryDistribution: { range: string; legitimate: number; fraudulent: number }[];
  warningSignFrequencies: { name: string; percentage: number; severity: string }[];
}

export interface ScamPatternCluster {
  id: string;
  patternName: string;
  description: string;
  frequency: number;
  typicalKeywords: string[];
  severity: 'critical' | 'high' | 'medium';
  commonChannels: string[];
}
