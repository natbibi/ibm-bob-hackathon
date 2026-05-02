export interface UploadedFile {
  id: string;
  name: string;
  language: string;
  size: number;
  content: string;
  linesOfCode: number;
}

export interface Vulnerability {
  id: string;
  category:
    | 'exposed-secret'
    | 'dependency'
    | 'sql-injection'
    | 'xss'
    | 'hardcoded-credential'
    | 'missing-auth'
    | 'code-smell'
    | 'performance'
    | 'best-practice'
    | 'maintainability'
    | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line?: number;
  issue: string;
  recommendation: string;
  status: 'open' | 'closed';
  confidence: number;
}

export interface AIInsight {
  type: 'critical' | 'warning' | 'success';
  message: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedFiles: number;
}

export interface TopIssueCategory {
  name: string;
  count: number;
}

export interface CodeMetrics {
  complexity: number;
  testCoverage: number;
  duplicatedCode: number;
  technicalDebt: string;
  technicalDebtIssues: number;
  maintainabilityIndex: number;
}

export interface CodeSnippet {
  file: string;
  code: string;
  issueDescription: string;
  issueLine: number;
  issueType: 'critical' | 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  files: UploadedFile[];
  healthScore: number;
  codeQualityScore: number;
  totalVulnerabilities: number;
  highRisk: number;
  missingTests: number;
  exposedSecrets: number;
  dependencyIssues: number;
  totalLinesOfCode: number;
  securityRisk: 'Critical' | 'High' | 'Medium' | 'Low';
  severityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  topIssueCategories: TopIssueCategory[];
  vulnerabilities: Vulnerability[];
  aiSuggestions: string[];
  aiInsights: AIInsight[];
  aiRecommendations: AIRecommendation[];
  codeMetrics: CodeMetrics;
  codeSnippet: CodeSnippet | null;
  analysisStatus: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
}

export interface WatsonResponse {
  generatedText?: string;
  categories?: Array<{
    label: string;
    score: number;
  }>;
  keywords?: Array<{
    text: string;
    relevance: number;
    sentiment?: {
      score: number;
    };
  }>;
  entities?: Array<{
    type: string;
    text: string;
    relevance: number;
    confidence?: number;
  }>;
  sentiment?: {
    document?: {
      score: number;
      label: string;
    };
  };
  concepts?: Array<{
    text: string;
    relevance: number;
  }>;
}
