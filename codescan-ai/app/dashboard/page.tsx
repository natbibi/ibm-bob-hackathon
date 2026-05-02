'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Bell, Plus, GitBranch, ChevronRight, TrendingUp, TrendingDown,
  Bug, AlertOctagon, FileText, Loader2, ArrowUpRight, ArrowDownRight,
  Sparkles, AlertTriangle, CheckCircle, XCircle, Activity, Download,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AnalysisResult, Vulnerability } from '@/types/analysis';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';

export default function Dashboard() {
  const router = useRouter();
  const { analysisResult, isAnalyzing, reset } = useAppStore();

  useEffect(() => {
    if (!analysisResult && !isAnalyzing) {
      router.push('/');
    }
  }, [analysisResult, isAnalyzing, router]);

  if (!analysisResult && isAnalyzing) return <LoadingSkeleton />;
  if (!analysisResult) return null;

  const r = analysisResult;

  // Derive a display name from the first analysed filename (e.g. "auth.js" → "Auth")
  const rawFileName = r.files?.[0]?.name?.replace(/\.[^/.]+$/, '') ?? 'Developer';
  const displayName = rawFileName.charAt(0).toUpperCase() + rawFileName.slice(1);
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleNewAnalysis = () => {
    reset();
    router.push('/upload');
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codeguardian-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#07070F] text-white relative overflow-x-hidden">

      {/* ── BACKGROUND EFFECTS ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        {/* Purple orb top-left */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full animate-drift"
          style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.14) 0%, transparent 70%)', animationDuration: '28s' }} />
        {/* Cyan orb right */}
        <div className="absolute top-1/2 -right-48 w-[400px] h-[400px] rounded-full animate-drift"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', animationDuration: '35s', animationDelay: '8s' }} />
        {/* Bottom orb */}
        <div className="absolute -bottom-24 left-1/4 w-[400px] h-[300px] rounded-full animate-drift"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', animationDuration: '22s', animationDelay: '4s' }} />
        {/* Particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="absolute rounded-full animate-float-up"
            style={{
              width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
              left: `${(i * 43) % 100}%`, bottom: '-10px',
              background: i % 3 === 0 ? '#6C63FF' : i % 3 === 1 ? '#06B6D4' : '#a78bfa',
              opacity: 0.3 + (i % 5) * 0.08,
              animationDuration: `${7 + (i % 9)}s`,
              animationDelay: `${(i * 1.1) % 10}s`,
            }} />
        ))}
      </div>

      {/* ── TOP NAVBAR ────────────────────────────────────────────────────── */}
      <nav className="bg-[#07070F]/80 backdrop-blur-md border-b border-white/8 sticky top-0 z-50"
        style={{ boxShadow: '0 1px 30px rgba(0,0,0,0.5)' }}>
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30 animate-pulse-glow">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">CodeGuardian AI</h1>
              <p className="text-[10px] text-gray-500 leading-tight">AI-Powered Code Analyzer</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewAnalysis}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Analysis
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[#1E1E2E] hover:bg-[#252538] text-gray-300 text-sm font-semibold rounded-lg border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <div className="relative">
              <div className="w-9 h-9 bg-[#1E1E2E] rounded-lg flex items-center justify-center border border-white/10 cursor-pointer hover:bg-[#252538]">
                <Bell className="w-4 h-4 text-gray-400" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {Math.min(r.totalVulnerabilities, 9)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-white">{displayName}</p>
                <p className="text-[10px] text-primary">Pro Plan</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── PAGE CONTENT ────────────────────────────────────────────────────── */}
      <div className="relative z-10 px-6 py-6 max-w-[1600px] mx-auto">

        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Welcome back, {displayName}! 👋</h2>
          <p className="text-sm text-gray-400 mt-0.5">Here&apos;s your code quality overview</p>
        </div>

        {/* ── ROW 1: 5 STAT CARDS ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={<div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary text-xs font-bold">{r.codeQualityScore}</div>}
            iconBg=""
            label="Overall Code Quality"
            value={`${r.codeQualityScore}/100`}
            sub="Good Quality"
            subColor="text-success"
            trend={+8}
            trendLabel="from last analysis"
          />
          <StatCard
            icon={<Bug className="w-5 h-5 text-danger" />}
            iconBg="bg-danger/10"
            label="Total Issues"
            value={String(r.totalVulnerabilities)}
            sub={`Across ${r.files.length} files`}
            trend={-12}
            trendLabel="from last analysis"
          />
          <CriticalIssuesCard count={r.severityBreakdown.critical} />
          <StatCard
            icon={<Shield className="w-5 h-5 text-warning" />}
            iconBg="bg-warning/10"
            label="Security Risk"
            value={r.securityRisk}
            sub="Multiple vulnerabilities found"
            isText
          />
          <StatCard
            icon={<FileText className="w-5 h-5 text-blue-400" />}
            iconBg="bg-blue-400/10"
            label="Files Analyzed"
            value={String(r.files.length)}
            sub={`Total lines of code: ${r.totalLinesOfCode.toLocaleString()}`}
            trend={+18}
            trendLabel="from last analysis"
          />
        </div>

        {/* ── ROW 2: VULNERABILITY BREAKDOWN | TOP CATEGORIES | AI INSIGHTS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Vulnerability Breakdown */}
          <VulnerabilityBreakdown r={r} />

          {/* Top Issue Categories */}
          <TopIssueCategories r={r} />

          {/* AI-Powered Insights */}
          <AIPoweredInsights r={r} />
        </div>

        {/* ── ROW 3: CRITICAL ISSUES | CODE SNIPPET | AI RECOMMENDATIONS ────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <MostCriticalIssues r={r} />
          <CodeSnippetPanel r={r} />
          <AIRecommendationsPanel r={r} />
        </div>

        {/* ── ROW 4: ADDITIONAL INSIGHTS ──────────────────────────────────── */}
        <AdditionalInsights r={r} />
      </div>
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────

function StatCard({
  icon, iconBg, label, value, sub, subColor, trend, trendLabel, isText,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
  subColor?: string;
  trend?: number;
  trendLabel?: string;
  isText?: boolean;
}) {
  return (
    <div className="border border-white/10 rounded-xl p-4 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5" style={{ background: 'rgba(15,15,30,0.7)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <div className={`${iconBg} rounded-lg p-1.5`}>{icon}</div>
      </div>
      <div className={`${isText ? 'text-2xl' : 'text-3xl'} font-bold text-white mb-1`}>{value}</div>
      <p className={`text-xs ${subColor || 'text-gray-400'} mb-2`}>{sub}</p>
      {trend !== undefined && trendLabel && (
        <div className={`flex items-center gap-1 text-xs ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
          {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{trend >= 0 ? '+' : ''}{trend}% {trendLabel}</span>
        </div>
      )}
    </div>
  );
}

// ─── CRITICAL ISSUES CARD (heartbeat effect) ─────────────────────────────────

function CriticalIssuesCard({ count }: { count: number }) {
  const hasCritical = count > 0;

  // EKG path — flat line that spikes into a heartbeat shape
  const ekgPath = 'M0,20 L30,20 L38,20 L42,4 L46,36 L50,20 L54,20 L58,12 L62,28 L66,20 L100,20';

  return (
    <div
      className={`relative border rounded-xl p-4 overflow-hidden transition-all duration-500 hover:-translate-y-0.5 ${
        hasCritical ? 'animate-critical-pulse' : 'border-white/10 hover:border-danger/30'
      }`}
      style={{
        background: hasCritical
          ? 'rgba(30, 8, 8, 0.85)'
          : 'rgba(15,15,30,0.7)',
        backdropFilter: 'blur(12px)',
        boxShadow: hasCritical
          ? '0 0 30px rgba(239,68,68,0.15), 0 4px 24px rgba(0,0,0,0.5)'
          : '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Red radial glow spreading from center when critical */}
      {hasCritical && (
        <div
          className="absolute inset-0 animate-red-glow pointer-events-none rounded-xl"
          style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(239,68,68,0.25) 0%, transparent 70%)',
          }}
        />
      )}

      {/* EKG line — bottom of the card */}
      <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Ghost flat line */}
          <path
            d="M0,20 L100,20"
            fill="none"
            stroke="rgba(239,68,68,0.12)"
            strokeWidth="0.8"
          />
          {/* Animated EKG spike */}
          {hasCritical && (
            <path
              d={ekgPath}
              fill="none"
              stroke="#EF4444"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-ekg"
              style={{ filter: 'drop-shadow(0 0 3px rgba(239,68,68,0.8))' }}
            />
          )}
          {/* Dim static EKG when no criticals */}
          {!hasCritical && (
            <path
              d={ekgPath}
              fill="none"
              stroke="rgba(239,68,68,0.15)"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      {/* Card content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs text-gray-400 font-medium">Critical Issues</p>
          <div
            className={`rounded-lg p-1.5 ${hasCritical ? 'animate-heartbeat' : ''}`}
            style={{
              background: hasCritical ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)',
              border: hasCritical ? '1px solid rgba(239,68,68,0.4)' : '1px solid transparent',
            }}
          >
            <AlertOctagon
              className="w-5 h-5"
              style={{ color: hasCritical ? '#EF4444' : '#F97316' }}
            />
          </div>
        </div>

        <div
          className="text-3xl font-bold mb-1"
          style={{ color: hasCritical ? '#EF4444' : 'white' }}
        >
          {count}
        </div>
        <p className={`text-xs mb-2 ${hasCritical ? 'text-danger' : 'text-orange-400'}`}>
          {hasCritical ? '⚠ Needs immediate attention' : 'No critical issues'}
        </p>
        <div className="flex items-center gap-1 text-xs text-danger">
          <ArrowDownRight className="w-3 h-3" />
          <span>-33% from last analysis</span>
        </div>
      </div>
    </div>
  );
}

// ─── VULNERABILITY BREAKDOWN ─────────────────────────────────────────────────

function VulnerabilityBreakdown({ r }: { r: AnalysisResult }) {
  const total = r.totalVulnerabilities || 1;
  const data = [
    { name: 'Critical', value: r.severityBreakdown.critical, color: '#EF4444', pct: ((r.severityBreakdown.critical / total) * 100).toFixed(1) },
    { name: 'High', value: r.severityBreakdown.high, color: '#F97316', pct: ((r.severityBreakdown.high / total) * 100).toFixed(1) },
    { name: 'Medium', value: r.severityBreakdown.medium, color: '#F59E0B', pct: ((r.severityBreakdown.medium / total) * 100).toFixed(1) },
    { name: 'Low', value: r.severityBreakdown.low, color: '#10B981', pct: ((r.severityBreakdown.low / total) * 100).toFixed(1) },
  ];

  return (
    <div className="border border-white/10 rounded-xl p-5 transition-all duration-300 hover:border-primary/20" style={{ background: 'rgba(15,15,30,0.7)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      <h3 className="text-sm font-semibold text-white mb-4">Vulnerability Breakdown</h3>
      <div className="flex items-center gap-4">
        <div className="relative w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" strokeWidth={0}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1E1E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#ccc' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-white">{r.totalVulnerabilities}</span>
            <span className="text-[10px] text-gray-400">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                <span className="text-xs text-gray-300">{d.name}</span>
              </div>
              <span className="text-xs text-gray-400">{d.value} ({d.pct}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TOP ISSUE CATEGORIES ────────────────────────────────────────────────────

function TopIssueCategories({ r }: { r: AnalysisResult }) {
  const categories = r.topIssueCategories;
  const maxCount = Math.max(...categories.map((c) => c.count), 1);

  const barColors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#6C63FF'];

  return (
    <div className="border border-white/10 rounded-xl p-5 transition-all duration-300 hover:border-primary/20" style={{ background: 'rgba(15,15,30,0.7)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      <h3 className="text-sm font-semibold text-white mb-4">Top Issue Categories</h3>
      <div className="space-y-3">
        {categories.map((cat, i) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-300">{cat.name}</span>
              <span className="text-xs font-semibold text-white">{cat.count}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(cat.count / maxCount) * 100}%`, background: barColors[i % barColors.length] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI-POWERED INSIGHTS ─────────────────────────────────────────────────────

// ─── INSIGHT DETAIL MODAL ────────────────────────────────────────────────────

const INSIGHT_DETAILS: Record<string, { title: string; actions: string[]; why: string }> = {
  critical: {
    title: 'Fix Critical Vulnerabilities Now',
    why: 'Critical issues can be exploited immediately by attackers. These represent the highest risk to your application and must be resolved before any deployment.',
    actions: [
      'Open each critical file and locate the flagged line immediately',
      'Move any hardcoded secrets/keys to .env and add .env to .gitignore',
      'Replace weak hashing (MD5/SHA1) with bcrypt or argon2',
      'Add authentication middleware to all unprotected routes',
      'Run a full re-scan after fixing to confirm resolution',
    ],
  },
  warning: {
    title: 'Refactor Code Quality Issues',
    why: 'Code smells and maintainability issues slow your team down over time, increase bug risk, and make onboarding harder. Addressing them now prevents technical debt from compounding.',
    actions: [
      'Identify all functions exceeding 50 lines and break them into smaller units',
      'Extract repeated logic into shared utility functions or modules',
      'Replace all TODO/FIXME comments with tracked issues in your issue tracker',
      'Enable ESLint complexity rules to catch future violations automatically',
      'Add JSDoc or TypeScript types to improve code readability',
    ],
  },
  success: {
    title: 'Keep Up Best Practices',
    why: 'Your code already follows many best practices. Maintaining this standard ensures long-term code health, easier reviews, and fewer production incidents.',
    actions: [
      'Continue using typed interfaces and schemas for all data structures',
      'Ensure every new feature has a corresponding unit test',
      'Set up a pre-commit hook (Husky + lint-staged) to enforce standards',
      'Schedule monthly dependency audits using `npm audit`',
      'Document all public APIs and shared utilities for team visibility',
    ],
  },
};

function InsightDetailModal({ insight, onClose }: { insight: { type: string; message: string }; onClose: () => void }) {
  const detail = INSIGHT_DETAILS[insight.type] || INSIGHT_DETAILS.warning;
  const borderColor = insight.type === 'critical' ? 'rgba(239,68,68,0.35)' : insight.type === 'warning' ? 'rgba(245,158,11,0.35)' : 'rgba(16,185,129,0.35)';
  const glowColor  = insight.type === 'critical' ? 'rgba(239,68,68,0.15)'  : insight.type === 'warning' ? 'rgba(245,158,11,0.1)'  : 'rgba(16,185,129,0.1)';
  const accentColor = insight.type === 'critical' ? '#EF4444' : insight.type === 'warning' ? '#F59E0B' : '#10B981';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative w-full max-w-lg rounded-2xl border overflow-hidden animate-fade-in-up"
        style={{ background: 'rgba(10,10,22,0.97)', borderColor, boxShadow: `0 0 60px ${glowColor}, 0 30px 60px rgba(0,0,0,0.8)` }}>

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/8 flex items-start gap-4"
          style={{ background: `${glowColor}` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}>
            {insight.type === 'critical' ? <AlertOctagon className="w-5 h-5 text-danger" /> :
             insight.type === 'warning'  ? <AlertTriangle className="w-5 h-5 text-warning" /> :
                                           <CheckCircle className="w-5 h-5 text-success" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white">{detail.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{insight.message}</p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-colors">
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Why it matters */}
          <div className="p-3 rounded-lg border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1.5">Why This Matters</p>
            <p className="text-xs text-gray-300 leading-relaxed">{detail.why}</p>
          </div>

          {/* Action steps */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-3">Actions to Take</p>
            <div className="space-y-2.5">
              {detail.actions.map((action, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                    style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor }}>
                    {i + 1}
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed">{action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-2"
          style={{ background: 'rgba(0,0,0,0.3)' }}>
          <button onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white rounded-lg transition-all duration-200 hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${accentColor}90, ${accentColor}60)`, boxShadow: `0 0 20px ${accentColor}30` }}>
            Got it, I&apos;ll fix this
          </button>
        </div>
      </div>
    </div>
  );
}

function AIPoweredInsights({ r }: { r: AnalysisResult }) {
  const [activeInsight, setActiveInsight] = useState<{ type: string; message: string } | null>(null);

  const insightIcon = (type: string) => {
    if (type === 'critical') return <AlertOctagon className="w-4 h-4 text-danger" />;
    if (type === 'warning')  return <AlertTriangle className="w-4 h-4 text-warning" />;
    return <CheckCircle className="w-4 h-4 text-success" />;
  };
  const insightStyle = (type: string) => {
    if (type === 'critical') return { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)',  hover: 'rgba(239,68,68,0.14)' };
    if (type === 'warning')  return { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', hover: 'rgba(245,158,11,0.14)' };
    return                          { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)', hover: 'rgba(16,185,129,0.14)' };
  };

  return (
    <>
      {activeInsight && <InsightDetailModal insight={activeInsight} onClose={() => setActiveInsight(null)} />}

      <div className="border border-primary/20 rounded-xl p-5 transition-all duration-300"
        style={{ background: 'rgba(108,99,255,0.05)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 30px rgba(108,99,255,0.1), 0 4px 24px rgba(0,0,0,0.4)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-white">AI-Powered Insights</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Our AI has analyzed your codebase and found several areas for improvement.
        </p>
        <div className="space-y-2.5">
          {r.aiInsights.map((insight, i) => {
            const s = insightStyle(insight.type);
            return (
              <button
                key={i}
                className="w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 group hover:-translate-y-0.5 cursor-pointer"
                style={{ background: s.bg, borderColor: s.border }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = s.hover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = s.bg; }}
                onClick={() => setActiveInsight(insight)}
              >
                <div className="flex-shrink-0 mt-0.5">{insightIcon(insight.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-200 leading-relaxed">{insight.message}</p>
                  <p className="text-[10px] text-gray-500 mt-1 group-hover:text-gray-300 transition-colors">
                    Click to see action steps →
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── SHARED SEVERITY HELPERS ─────────────────────────────────────────────────

function sevBadgeClass(sev: string) {
  const map: Record<string, string> = {
    critical: 'bg-danger/20 text-danger border-danger/30',
    high:     'bg-orange-400/20 text-orange-400 border-orange-400/30',
    medium:   'bg-warning/20 text-warning border-warning/30',
    low:      'bg-success/20 text-success border-success/30',
  };
  return map[sev] || map.low;
}

function SevIcon({ sev, size = 'sm' }: { sev: string; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  if (sev === 'critical') return <XCircle      className={`${cls} text-danger`} />;
  if (sev === 'high')     return <AlertOctagon className={`${cls} text-orange-400`} />;
  if (sev === 'medium')   return <AlertTriangle className={`${cls} text-warning`} />;
  return                         <Activity      className={`${cls} text-success`} />;
}

// ─── ALL ISSUES MODAL ────────────────────────────────────────────────────────

function AllIssuesModal({ r, onClose }: { r: AnalysisResult; onClose: () => void }) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = [...r.vulnerabilities].sort((a, b) => {
    const ord = { critical: 4, high: 3, medium: 2, low: 1 };
    return ord[b.severity] - ord[a.severity];
  });
  const filtered = filter === 'all' ? sorted : sorted.filter((v) => v.severity === filter);

  const counts = {
    all:      sorted.length,
    critical: sorted.filter((v) => v.severity === 'critical').length,
    high:     sorted.filter((v) => v.severity === 'high').length,
    medium:   sorted.filter((v) => v.severity === 'medium').length,
    low:      sorted.filter((v) => v.severity === 'low').length,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 overflow-hidden animate-fade-in-up"
        style={{ background: 'rgba(10,10,22,0.97)', boxShadow: '0 0 80px rgba(108,99,255,0.2), 0 30px 60px rgba(0,0,0,0.8)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8"
          style={{ background: 'rgba(108,99,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center">
              <Bug className="w-4 h-4 text-danger" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">All Issues</h2>
              <p className="text-xs text-gray-400">{counts.all} vulnerabilities found</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 flex-wrap">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((f) => {
            const colors: Record<string, string> = { all: '#6C63FF', critical: '#EF4444', high: '#F97316', medium: '#F59E0B', low: '#10B981' };
            const active = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 border ${active ? 'text-white' : 'text-gray-400 border-white/10 hover:border-white/20'}`}
                style={active ? { background: `${colors[f]}20`, borderColor: `${colors[f]}50`, color: colors[f] } : {}}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </button>
            );
          })}
        </div>

        {/* Issue list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-10 h-10 text-success mx-auto mb-3" />
              <p className="text-success font-semibold">No {filter} issues found!</p>
            </div>
          ) : filtered.map((v) => (
            <div key={v.id}>
              <button
                className="w-full text-left p-4 rounded-xl border transition-all duration-200 hover:border-primary/30 group"
                style={{
                  background: expanded === v.id ? 'rgba(108,99,255,0.08)' : 'rgba(255,255,255,0.02)',
                  borderColor: expanded === v.id ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.07)',
                }}
                onClick={() => setExpanded(expanded === v.id ? null : v.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: expanded === v.id ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.05)' }}>
                    <SevIcon sev={v.severity} size="md" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-gray-200">{v.file}</span>
                      {v.line && <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">Line {v.line}</span>}
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border capitalize ml-auto ${sevBadgeClass(v.severity)}`}>
                        {v.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{v.issue}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${expanded === v.id ? 'rotate-90 text-primary' : 'group-hover:text-gray-300'}`} />
                </div>

                {/* Expanded detail */}
                {expanded === v.id && (
                  <div className="mt-4 pt-4 border-t border-white/8 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/5 rounded-lg p-2.5">
                        <p className="text-[9px] text-gray-500 uppercase tracking-wide mb-1">Category</p>
                        <p className="text-xs text-gray-300 font-medium capitalize">{v.category.replace('-', ' ')}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2.5">
                        <p className="text-[9px] text-gray-500 uppercase tracking-wide mb-1">Confidence</p>
                        <p className="text-xs text-gray-300 font-medium">{v.confidence}%</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2.5">
                        <p className="text-[9px] text-gray-500 uppercase tracking-wide mb-1">Status</p>
                        <p className={`text-xs font-medium capitalize ${v.status === 'open' ? 'text-danger' : 'text-success'}`}>{v.status}</p>
                      </div>
                    </div>
                    <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <CheckCircle className="w-3 h-3 text-success" />
                        <span className="text-[10px] font-semibold text-success uppercase tracking-wide">Recommendation</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{v.recommendation}</p>
                    </div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between"
          style={{ background: 'rgba(0,0,0,0.3)' }}>
          <p className="text-xs text-gray-500">Click any issue to expand details &amp; recommendations</p>
          <button onClick={onClose}
            className="px-4 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary text-xs font-semibold rounded-lg transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ALL RECOMMENDATIONS MODAL ───────────────────────────────────────────────

function AllRecommendationsModal({ r, onClose }: { r: AnalysisResult; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(r.aiRecommendations[0]?.id ?? null);

  const actionSteps: Record<string, string[]> = {
    critical: [
      'Immediately audit all source files for hardcoded credentials',
      'Move secrets to environment variables (.env) or a secrets manager',
      'Rotate any exposed credentials right away',
      'Add pre-commit hooks to prevent future secret leaks',
    ],
    high: [
      'Create a validation schema using Zod or Joi for each endpoint',
      'Sanitize all string inputs to prevent injection attacks',
      'Add type guards and runtime checks for incoming data',
      'Write integration tests for all validation paths',
    ],
    medium: [
      'Identify functions exceeding 40 lines and split them',
      'Apply the Single Responsibility Principle to classes',
      'Extract duplicated logic into shared utility functions',
      'Run a linter with complexity rules enabled',
    ],
    low: [
      'Profile slow queries using EXPLAIN ANALYZE',
      'Add indexes to frequently-queried columns',
      'Use connection pooling (e.g. pg-pool, Prisma connection pool)',
      'Cache expensive read queries with Redis or in-memory cache',
    ],
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-primary/20 overflow-hidden animate-fade-in-up"
        style={{ background: 'rgba(10,10,22,0.97)', boxShadow: '0 0 80px rgba(108,99,255,0.25), 0 30px 60px rgba(0,0,0,0.8)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8"
          style={{ background: 'rgba(108,99,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Recommendations</h2>
              <p className="text-xs text-gray-400">Powered by IBM Granite · {r.aiRecommendations.length} action items</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Recs list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {r.aiRecommendations.map((rec, idx) => {
            const isOpen = expanded === rec.id;
            const steps = actionSteps[rec.severity] || actionSteps.low;
            return (
              <div key={rec.id}
                className="rounded-xl border transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: isOpen ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.07)',
                  background: isOpen ? 'rgba(108,99,255,0.06)' : 'rgba(255,255,255,0.02)',
                }}>
                <button
                  className="w-full text-left px-4 py-4 flex items-start gap-3 group"
                  onClick={() => setExpanded(isOpen ? null : rec.id)}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <SevIcon sev={rec.severity} size="md" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-xs font-bold text-white">#{idx + 1} {rec.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border capitalize ${sevBadgeClass(rec.severity)}`}>
                        {rec.severity}
                      </span>
                      <span className="text-[10px] text-gray-500">Affects {rec.affectedFiles} file{rec.affectedFiles !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-500 flex-shrink-0 mt-1.5 transition-transform duration-200 ${isOpen ? 'rotate-90 text-primary' : 'group-hover:text-gray-300'}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-white/8 pt-3 space-y-3">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      This issue affects <span className="text-white font-semibold">{rec.affectedFiles} file{rec.affectedFiles !== 1 ? 's' : ''}</span> in your codebase and is classified as{' '}
                      <span className={`font-semibold capitalize ${rec.severity === 'critical' ? 'text-danger' : rec.severity === 'high' ? 'text-orange-400' : rec.severity === 'medium' ? 'text-warning' : 'text-success'}`}>{rec.severity}</span> severity.
                      Address this to improve your overall code quality score.
                    </p>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-2">Action Plan</p>
                      <div className="space-y-2">
                        {steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all duration-200 hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', boxShadow: '0 0 15px rgba(108,99,255,0.3)' }}>
                        Mark as In Progress
                      </button>
                      <button className="px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* AI suggestions */}
          {r.aiSuggestions.length > 0 && (
            <div className="mt-4 p-4 rounded-xl border border-primary/15" style={{ background: 'rgba(108,99,255,0.04)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-semibold text-primary">Additional AI Suggestions</p>
              </div>
              <div className="space-y-2">
                {r.aiSuggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-primary text-xs mt-0.5">→</span>
                    <p className="text-xs text-gray-400 leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between"
          style={{ background: 'rgba(0,0,0,0.3)' }}>
          <p className="text-xs text-gray-500">
            <span className="text-primary font-semibold">{r.aiRecommendations.filter((rec) => rec.severity === 'critical' || rec.severity === 'high').length}</span> high-priority actions require immediate attention
          </p>
          <button onClick={onClose}
            className="px-4 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary text-xs font-semibold rounded-lg transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MOST CRITICAL ISSUES ────────────────────────────────────────────────────

function MostCriticalIssues({ r }: { r: AnalysisResult }) {
  const [showModal, setShowModal] = useState(false);

  const topIssues = [...r.vulnerabilities]
    .sort((a, b) => {
      const ord = { critical: 4, high: 3, medium: 2, low: 1 };
      return ord[b.severity] - ord[a.severity];
    })
    .slice(0, 5);

  return (
    <>
      {showModal && <AllIssuesModal r={r} onClose={() => setShowModal(false)} />}

      <div className="border border-white/10 rounded-xl p-5 transition-all duration-300 hover:border-danger/20" style={{ background: 'rgba(15,15,30,0.7)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Most Critical Issues</h3>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-primary hover:text-white font-semibold px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 transition-all duration-200">
            View All Issues
          </button>
        </div>
        <div className="space-y-3">
          {topIssues.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-sm text-success">No critical issues found!</p>
            </div>
          ) : (
            topIssues.map((v) => (
              <button
                key={v.id}
                className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/5 group-hover:bg-white/10 transition-colors">
                  <SevIcon sev={v.severity} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-200 truncate">{v.file}</p>
                  <p className="text-[11px] text-gray-400 truncate">{v.issue}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${sevBadgeClass(v.severity)} capitalize`}>
                    {v.severity}
                  </span>
                  {v.line && <span className="text-[10px] text-gray-500">Line {v.line}</span>}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}

// ─── CODE SNIPPET PANEL ───────────────────────────────────────────────────────

function CodeSnippetPanel({ r }: { r: AnalysisResult }) {
  const snippet = r.codeSnippet;
  const [showRec, setShowRec] = useState(false);
  const critVuln = r.vulnerabilities.find((v) => v.severity === 'critical') || r.vulnerabilities[0];

  if (!snippet && !r.files[0]) {
    return (
      <div className="border border-white/10 rounded-xl p-5 flex items-center justify-center" style={{ background: 'rgba(15,15,30,0.7)', backdropFilter: 'blur(12px)' }}>
        <p className="text-gray-500 text-sm">No code snippet available</p>
      </div>
    );
  }

  const codeLines = (snippet?.code || r.files[0]?.content || '').split('\n').slice(0, 12);
  const fileName = snippet?.file || r.files[0]?.name || 'unknown';
  const issueDesc = snippet?.issueDescription || critVuln?.issue || 'Review for security issues';
  const issueLine = snippet?.issueLine || critVuln?.line || null;

  return (
    <div className="border border-white/10 rounded-xl p-5 transition-all duration-300" style={{ background: 'rgba(15,15,30,0.7)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Code Snippet
          <span className="ml-2 text-xs text-gray-400 font-normal">({fileName})</span>
        </h3>
        <button className="text-xs text-primary hover:text-primary/80">View File</button>
      </div>
        <div className="rounded-lg overflow-hidden border border-white/8 mb-3" style={{ background: 'rgba(5,5,15,0.9)' }}>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border-b border-white/5">
          <div className="w-2 h-2 rounded-full bg-danger/60" />
          <div className="w-2 h-2 rounded-full bg-warning/60" />
          <div className="w-2 h-2 rounded-full bg-success/60" />
          <span className="text-[10px] text-gray-500 ml-1">{fileName}</span>
        </div>
        <div className="p-3 overflow-x-auto">
          <pre className="text-xs font-mono leading-relaxed">
            {codeLines.map((line, i) => {
              const lineNum = i + 1;
              const isIssueLine = issueLine ? lineNum === issueLine : false;
              return (
                <div
                  key={i}
                  className={`flex ${isIssueLine ? 'bg-danger/10 rounded' : ''}`}
                >
                  <span className="text-gray-600 w-6 text-right flex-shrink-0 mr-3 select-none">{lineNum}</span>
                  <span className={isIssueLine ? 'text-danger/90' : 'text-gray-300'}>{line}</span>
                </div>
              );
            })}
          </pre>
        </div>
      </div>
      {critVuln && (
        <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertOctagon className="w-3.5 h-3.5 text-danger flex-shrink-0" />
            <span className="text-xs font-semibold text-danger">
              {critVuln.severity === 'critical' ? 'Critical' : critVuln.severity === 'high' ? 'High severity' : 'Issue'} detected
            </span>
          </div>
          <p className="text-[11px] text-gray-400">{issueDesc}</p>
          <button
            className="mt-2 text-[11px] text-primary hover:text-primary/80 flex items-center gap-1"
            onClick={() => setShowRec(!showRec)}
          >
            {showRec ? 'Hide' : 'Show'} Recommendation
            <ChevronRight className={`w-3 h-3 transition-transform ${showRec ? 'rotate-90' : ''}`} />
          </button>
          {showRec && critVuln.recommendation && (
            <p className="mt-2 text-[11px] text-gray-300 bg-[#0D0D1A] rounded p-2 border border-white/5">
              {critVuln.recommendation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── AI RECOMMENDATIONS PANEL ────────────────────────────────────────────────

function AIRecommendationsPanel({ r }: { r: AnalysisResult }) {
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const actionSteps: Record<string, string[]> = {
    critical: ['Audit all files for hardcoded credentials', 'Move secrets to environment variables or a vault', 'Rotate any exposed credentials immediately'],
    high:     ['Create validation schemas for all endpoints', 'Sanitize string inputs to prevent injection', 'Add runtime type-checks for incoming data'],
    medium:   ['Split functions exceeding 40 lines', 'Apply Single Responsibility Principle', 'Extract duplicated logic into utilities'],
    low:      ['Profile slow queries with EXPLAIN ANALYZE', 'Add indexes to frequently-queried columns', 'Use connection pooling for better performance'],
  };

  return (
    <>
      {showModal && <AllRecommendationsModal r={r} onClose={() => setShowModal(false)} />}

      <div className="border border-primary/15 rounded-xl p-5 transition-all duration-300" style={{ background: 'rgba(108,99,255,0.04)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 30px rgba(108,99,255,0.08), 0 4px 24px rgba(0,0,0,0.4)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">AI Recommendations</h3>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-primary hover:text-white font-semibold px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 transition-all duration-200">
            View All
          </button>
        </div>
        <div className="space-y-2">
          {r.aiRecommendations.map((rec) => {
            const isOpen = expandedId === rec.id;
            const steps = actionSteps[rec.severity] || actionSteps.low;
            return (
              <div key={rec.id}
                className="rounded-lg border transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: isOpen ? 'rgba(108,99,255,0.35)' : 'rgba(255,255,255,0.07)',
                  background: isOpen ? 'rgba(108,99,255,0.08)' : 'rgba(108,99,255,0.04)',
                }}>
                <button
                  className="w-full text-left flex items-start gap-3 p-3 group"
                  onClick={() => setExpandedId(isOpen ? null : rec.id)}
                >
                  <div className="flex-shrink-0 mt-0.5"><SevIcon sev={rec.severity} size="md" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-200 font-medium leading-relaxed">{rec.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Affects {rec.affectedFiles} file{rec.affectedFiles !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${sevBadgeClass(rec.severity)} capitalize`}>
                      {rec.severity}
                    </span>
                    <ChevronRight className={`w-3 h-3 transition-all duration-200 ${isOpen ? 'rotate-90 text-primary' : 'text-gray-600 group-hover:text-primary'}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3 pb-3 border-t border-white/8 pt-2.5 space-y-2">
                    {steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-primary/15 border border-primary/30 text-[9px] font-bold text-primary flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                        <p className="text-[11px] text-gray-300 leading-relaxed">{step}</p>
                      </div>
                    ))}
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-1 text-[10px] text-primary hover:text-white font-semibold flex items-center gap-1 transition-colors">
                      View full action plan
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── ADDITIONAL INSIGHTS ─────────────────────────────────────────────────────

function AdditionalInsights({ r }: { r: AnalysisResult }) {
  const m = r.codeMetrics;

  const getLabel = (val: number, type: 'complexity' | 'coverage' | 'dup' | 'maint') => {
    if (type === 'complexity') return val >= 80 ? 'High' : val >= 50 ? 'Moderate' : 'Low';
    if (type === 'coverage') return val >= 80 ? 'Excellent' : val >= 60 ? 'Good' : val >= 40 ? 'Fair' : 'Poor';
    if (type === 'dup') return val <= 5 ? 'Excellent' : val <= 15 ? 'Low' : val <= 25 ? 'Medium' : 'High';
    return val >= 80 ? 'Excellent' : val >= 60 ? 'Good' : val >= 40 ? 'Fair' : 'Poor';
  };

  const getColor = (val: number, type: 'complexity' | 'coverage' | 'dup' | 'maint') => {
    if (type === 'complexity') return val >= 80 ? '#EF4444' : val >= 50 ? '#F59E0B' : '#10B981';
    if (type === 'coverage') return val >= 80 ? '#10B981' : val >= 60 ? '#10B981' : val >= 40 ? '#F59E0B' : '#EF4444';
    if (type === 'dup') return val <= 5 ? '#10B981' : val <= 15 ? '#10B981' : val <= 25 ? '#F59E0B' : '#EF4444';
    return val >= 80 ? '#10B981' : val >= 60 ? '#10B981' : val >= 40 ? '#F59E0B' : '#EF4444';
  };

  const Sparkline = ({ color, reversed }: { color: string; reversed?: boolean }) => {
    const pts = reversed
      ? [20, 35, 28, 42, 38, 55, 48]
      : [55, 42, 60, 35, 50, 45, 58];
    const max = Math.max(...pts);
    const min = Math.min(...pts);
    const normalize = (v: number) => 30 - ((v - min) / (max - min)) * 28;
    const pathD = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * 12} ${normalize(v)}`).join(' ');
    return (
      <svg width="72" height="32" className="opacity-70">
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const metrics = [
    {
      label: 'Code Complexity',
      value: m.complexity,
      display: String(m.complexity),
      sub: getLabel(m.complexity, 'complexity'),
      note: 'Keep it up!',
      color: getColor(m.complexity, 'complexity'),
      type: 'complexity' as const,
      trend: null,
    },
    {
      label: 'Test Coverage',
      value: m.testCoverage,
      display: `${m.testCoverage}%`,
      sub: getLabel(m.testCoverage, 'coverage'),
      note: null,
      color: getColor(m.testCoverage, 'coverage'),
      type: 'coverage' as const,
      trend: +5,
    },
    {
      label: 'Duplicated Code',
      value: m.duplicatedCode,
      display: `${m.duplicatedCode}%`,
      sub: getLabel(m.duplicatedCode, 'dup'),
      note: null,
      color: getColor(m.duplicatedCode, 'dup'),
      type: 'dup' as const,
      trend: -3,
    },
    {
      label: 'Technical Debt',
      value: 50,
      display: m.technicalDebt,
      sub: 'Medium',
      note: `${m.technicalDebtIssues} issues`,
      color: '#F59E0B',
      type: 'complexity' as const,
      trend: null,
    },
    {
      label: 'Maintainability Index',
      value: m.maintainabilityIndex,
      display: String(m.maintainabilityIndex),
      sub: getLabel(m.maintainabilityIndex, 'maint'),
      note: null,
      color: getColor(m.maintainabilityIndex, 'maint'),
      type: 'maint' as const,
      trend: +7,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="border border-white/10 rounded-xl p-4 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5" style={{ background: 'rgba(15,15,30,0.7)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2" style={{ borderColor: metric.color }}>
                <span className="text-xs font-bold" style={{ color: metric.color }}>
                  {parseFloat(metric.display) || metric.value}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">{metric.label}</p>
              <p className="text-lg font-bold text-white">{metric.display}</p>
              <p className="text-xs font-medium" style={{ color: metric.color }}>{metric.sub}</p>
              {metric.note && <p className="text-[10px] text-gray-500">{metric.note}</p>}
              {metric.trend !== null && (
                <div className={`flex items-center gap-1 text-[10px] mt-0.5 ${(metric.trend ?? 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                  {(metric.trend ?? 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{(metric.trend ?? 0) >= 0 ? '+' : ''}{metric.trend}%</span>
                </div>
              )}
            </div>
            <Sparkline color={metric.color} reversed={(metric.trend ?? 0) < 0} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── LOADING SKELETON ────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#07070F] flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.15) 0%, transparent 70%)' }} />
      <div className="text-center relative z-10">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5 animate-pulse-glow">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-black text-white mb-2">Analyzing Your Code</h2>
        <p className="text-gray-400 text-sm">IBM Granite AI is scanning for vulnerabilities...</p>
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {['Secrets', 'SQL injection', 'XSS', 'Code smells', 'Metrics'].map((step, i) => (
            <span key={step} className="text-[10px] px-2 py-1 rounded-full border border-primary/20 text-primary/60"
              style={{ animationDelay: `${i * 0.2}s` }}>
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
