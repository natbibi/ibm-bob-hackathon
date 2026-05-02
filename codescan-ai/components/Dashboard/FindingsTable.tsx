'use client';

import { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, XCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Vulnerability } from '@/types/analysis';

interface FindingsTableProps {
  vulnerabilities: Vulnerability[];
}

type SortField = 'severity' | 'file' | 'category' | 'status';
type SortDirection = 'asc' | 'desc';

export default function FindingsTable({ vulnerabilities }: FindingsTableProps) {
  const [sortField, setSortField] = useState<SortField>('severity');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const getSeverityIcon = (severity: Vulnerability['severity']) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-danger" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'low':
        return <Info className="w-5 h-5 text-success" />;
    }
  };

  const getSeverityColor = (severity: Vulnerability['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-danger/20 text-danger border-danger/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'low':
        return 'bg-success/20 text-success border-success/30';
    }
  };

  const getSeverityOrder = (severity: Vulnerability['severity']): number => {
    const order = { critical: 4, high: 3, medium: 2, low: 1 };
    return order[severity];
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedVulnerabilities = [...vulnerabilities].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'severity':
        comparison = getSeverityOrder(b.severity) - getSeverityOrder(a.severity);
        break;
      case 'file':
        comparison = a.file.localeCompare(b.file);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const topVulnerabilities = sortedVulnerabilities.slice(0, 10);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="bg-[#1E1E2E] border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Findings</h2>

      {vulnerabilities.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-success" />
          </div>
          <p className="text-lg text-success font-semibold mb-2">No vulnerabilities found!</p>
          <p className="text-gray-400">Your code looks secure</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('severity')}
                >
                  <div className="flex items-center gap-2">
                    Severity
                    <SortIcon field="severity" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('file')}
                >
                  <div className="flex items-center gap-2">
                    File
                    <SortIcon field="file" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                  Issue
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300 hidden lg:table-cell">
                  Recommendation
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {topVulnerabilities.map((vuln, index) => (
                <tr
                  key={vuln.id}
                  className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-900/20' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(vuln.severity)}
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold border ${getSeverityColor(
                          vuln.severity
                        )}`}
                      >
                        {vuln.severity.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-gray-200 font-medium">{vuln.file}</p>
                      {vuln.line && (
                        <p className="text-xs text-gray-500">Line {vuln.line}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-300 max-w-md truncate lg:whitespace-normal">
                      {vuln.issue}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{vuln.category}</p>
                  </td>
                  <td className="py-4 px-4 hidden lg:table-cell">
                    <p className="text-sm text-gray-400 max-w-md">
                      {vuln.recommendation}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        vuln.status === 'open'
                          ? 'bg-danger/20 text-danger'
                          : 'bg-success/20 text-success'
                      }`}
                    >
                      {vuln.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vulnerabilities.length > 10 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Showing top 10 of {vulnerabilities.length} vulnerabilities
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Made with Bob
