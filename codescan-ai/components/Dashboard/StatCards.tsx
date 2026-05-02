'use client';

import { Activity, AlertTriangle, Shield, TestTube } from 'lucide-react';
import { AnalysisResult } from '@/types/analysis';

interface StatCardsProps {
  analysisResult: AnalysisResult;
}

export default function StatCards({ analysisResult }: StatCardsProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  const stats = [
    {
      icon: Activity,
      label: 'Code Health Score',
      value: analysisResult.healthScore.toString(),
      color: getScoreColor(analysisResult.healthScore),
      bgColor: analysisResult.healthScore >= 80 ? 'bg-success/10' : analysisResult.healthScore >= 60 ? 'bg-warning/10' : 'bg-danger/10',
    },
    {
      icon: AlertTriangle,
      label: 'Total Vulnerabilities',
      value: analysisResult.totalVulnerabilities.toString(),
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: Shield,
      label: 'High Risk Issues',
      value: analysisResult.highRisk.toString(),
      color: 'text-danger',
      bgColor: 'bg-danger/10',
    },
    {
      icon: TestTube,
      label: 'Missing Tests',
      value: analysisResult.missingTests.toString(),
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-[#1E1E2E] border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                {index === 0 && <span className="text-sm text-gray-500">/ 100</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Made with Bob
