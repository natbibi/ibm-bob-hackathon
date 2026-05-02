'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Rocket, ShieldCheck, Sparkles, Zap, Lock,
  Brain, BarChart3, ChevronRight, Code2, Bug, CheckCircle,
} from 'lucide-react';

const CODE_LINES = [
  { n: 1,  t: "import jwt from 'jsonwebtoken';" },
  { n: 2,  t: '' },
  { n: 3,  t: 'export async function login(req, res) {' },
  { n: 4,  t: "  const { email, password } = req.body;" },
  { n: 5,  t: "  const user = await User.findOne({ email });" },
  { n: 6,  t: '' },
  { n: 7,  t: "  if(!user) return res.status(404).json({ error: 'User not found' });" },
  { n: 8,  t: '' },
  { n: 9,  t: "  if(!user.validatePassword(password)) {" },
  { n: 10, t: "    return res.status(401).json({ error: 'Invalid credentials' });" },
  { n: 11, t: "  }" },
  { n: 12, t: '' },
  { n: 13, t: "  const token = jwt.sign(" },
  { n: 14, t: "    { id: user._id, role: user.role }," },
  { n: 15, t: "    'secret_key', // hardcoded secret", highlight: true },
  { n: 16, t: "    { expiresIn: '1h' }" },
  { n: 17, t: "  );" },
  { n: 18, t: '' },
  { n: 19, t: "  res.json({ token });" },
  { n: 20, t: '}' },
];

const FINDINGS = [
  { label: 'Hardcoded Secret Key',    sev: 'Critical', color: '#EF4444', desc: 'Use environment variables' },
  { label: 'Weak Hashing (MD5)',      sev: 'High',     color: '#F97316', desc: 'Consider stronger hashing' },
  { label: 'Missing Input Validation',sev: 'Medium',   color: '#F59E0B', desc: 'Validate user input' },
  { label: 'SQL Injection Risk',      sev: 'Low',      color: '#10B981', desc: 'Use parameterized queries' },
];

const FEATURES = [
  { icon: <ShieldCheck className="w-7 h-7" />, color: '#6C63FF', label: 'Vulnerability Detection',  desc: 'Identify security vulnerabilities and exposures before they become real threats.' },
  { icon: <Code2         className="w-7 h-7" />, color: '#06B6D4', label: 'Code Quality Analysis',   desc: 'Detect code smells, anti-patterns, and maintainability issues with AI precision.' },
  { icon: <Brain         className="w-7 h-7" />, color: '#10B981', label: 'AI Suggestions',          desc: 'Get intelligent, actionable suggestions to fix issues and improve your codebase.' },
  { icon: <BarChart3     className="w-7 h-7" />, color: '#F59E0B', label: 'Detailed Reports',        desc: 'Generate comprehensive reports with clear explanations and remediation steps.' },
];

const COMPANIES = ['Google', 'Microsoft', 'GitHub', 'Docker', 'AWS', 'GitLab'];

/* ─── FLOATING PARTICLES ─────────────────────────────────────────────────── */
function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 28 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float-up"
          style={{
            width:  `${2 + (i % 4)}px`,
            height: `${2 + (i % 4)}px`,
            left:   `${(i * 37) % 100}%`,
            bottom: `-10px`,
            background: i % 3 === 0 ? '#6C63FF' : i % 3 === 1 ? '#06B6D4' : '#a78bfa',
            opacity: 0.4 + (i % 5) * 0.1,
            animationDuration: `${6 + (i % 8)}s`,
            animationDelay:    `${(i * 0.7) % 8}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── BACKGROUND ORBS ────────────────────────────────────────────────────── */
function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Large purple orb top-left */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full animate-drift"
        style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%)', animationDuration: '25s' }}
      />
      {/* Cyan orb right */}
      <div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full animate-drift"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', animationDuration: '30s', animationDelay: '5s' }}
      />
      {/* Small purple orb bottom */}
      <div
        className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full animate-drift"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)', animationDuration: '20s', animationDelay: '10s' }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}

/* ─── SCANNER LINE ────────────────────────────────────────────────────────── */
function ScannerLine() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-b-xl">
      <div
        className="absolute left-0 right-0 h-[2px] opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent, #6C63FF, #06B6D4, #6C63FF, transparent)',
          animation: 'scanLine 3.5s linear infinite',
          boxShadow: '0 0 12px 2px rgba(108,99,255,0.8)',
        }}
      />
    </div>
  );
}

/* ─── CODE PANEL ─────────────────────────────────────────────────────────── */
function CodePanel() {
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((p) => (p >= 100 ? 0 : p + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex-1 min-w-0">
      {/* Outer glow */}
      <div className="absolute -inset-1 rounded-xl opacity-60"
        style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.4), rgba(6,182,212,0.2))', filter: 'blur(8px)' }}
      />
      <div className="relative bg-[#0D0D1A] rounded-xl border border-white/10 overflow-hidden"
        style={{ boxShadow: '0 0 40px rgba(108,99,255,0.2), inset 0 0 40px rgba(0,0,0,0.5)' }}>
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#12121F] border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
            <span className="text-[11px] text-gray-400 ml-2 font-mono">auth.service.ts</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-success/20 text-success rounded font-semibold">Analyzed</span>
        </div>

        {/* Code lines */}
        <div className="relative p-4 font-mono text-[11px] leading-relaxed overflow-hidden" style={{ minHeight: '280px' }}>
          {/* Moving scan beam */}
          <div
            className="absolute left-0 right-0 h-[1px] pointer-events-none transition-none"
            style={{
              top: `${scanLine}%`,
              background: 'linear-gradient(90deg, transparent 0%, rgba(108,99,255,0.6) 30%, rgba(6,182,212,0.8) 50%, rgba(108,99,255,0.6) 70%, transparent 100%)',
              boxShadow: '0 0 8px rgba(108,99,255,0.5)',
              opacity: scanLine < 5 || scanLine > 95 ? 0 : 0.7,
            }}
          />
          {CODE_LINES.map((line) => (
            <div
              key={line.n}
              className={`flex gap-3 ${line.highlight ? 'bg-danger/10 rounded px-1 -mx-1 border-l-2 border-danger/70' : ''}`}
            >
              <span className="text-gray-600 w-5 text-right flex-shrink-0 select-none">{line.n}</span>
              <span className={line.highlight ? 'text-danger/90' : 'text-gray-300'}>{line.t}</span>
            </div>
          ))}
          <div className="flex gap-3 mt-1">
            <span className="text-gray-600 w-5 text-right select-none">21</span>
            <span className="text-gray-300 animate-blink">▋</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ANALYSIS RESULTS PANEL ────────────────────────────────────────────── */
function AnalysisPanel() {
  return (
    <div
      className="relative w-[240px] flex-shrink-0 bg-[#0D0D1A] rounded-xl border border-white/10 overflow-hidden animate-fade-in-up"
      style={{
        boxShadow: '0 0 40px rgba(108,99,255,0.25), 0 20px 60px rgba(0,0,0,0.6)',
        animationDelay: '0.4s',
      }}
    >
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold text-white">Analysis Results</span>
      </div>

      <div className="p-3 space-y-2">
        {FINDINGS.map((f) => (
          <div key={f.label} className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors border border-white/5">
            <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
              style={{ background: `${f.color}20`, border: `1px solid ${f.color}50` }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: f.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-200 leading-tight">{f.label}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">{f.desc}</p>
            </div>
            <span className="text-[9px] font-bold flex-shrink-0 mt-0.5" style={{ color: f.color }}>{f.sev}</span>
          </div>
        ))}

        {/* AI Suggestion */}
        <div className="p-2.5 rounded-lg border border-primary/30 bg-primary/10">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-primary">AI Suggestion</span>
          </div>
          <p className="text-[9px] text-gray-300 leading-relaxed">
            Use environment variables for secrets and implement input validation to improve security.
          </p>
        </div>

        {/* Score */}
        <div className="p-2.5 rounded-lg border border-white/10 bg-white/[0.03]">
          <p className="text-[10px] text-gray-400 mb-2 font-medium">Overall Code Quality</p>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle cx="22" cy="22" r="18" fill="none" stroke="#6C63FF" strokeWidth="4"
                  strokeDasharray="113" strokeDashoffset="24" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">87</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white">/100</p>
              <p className="text-[10px] text-success font-semibold">Good</p>
              <div className="w-14 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                <div className="h-full rounded-full bg-success" style={{ width: '87%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN LANDING PAGE ──────────────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#07070F] text-white relative">
      <BackgroundOrbs />
      <Particles />

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? 'bg-[#07070F]/95 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/50' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center glow-border">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-bold text-white text-base leading-tight block">CodeGuardian
                <span className="text-primary"> AI</span>
              </span>
              <span className="text-[9px] text-gray-500 leading-tight block">AI-Powered Code Analyzer</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-gray-600 border border-white/10 rounded-full px-3 py-1">
              AI Powered · Secure · Intelligent
            </span>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/upload')}
              className="text-sm font-semibold px-5 py-2 rounded-lg text-white transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)',
                boxShadow: '0 0 20px rgba(108,99,255,0.4)',
              }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 badge-shimmer mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-widest text-primary/90 uppercase">
                AI Powered • Secure • Intelligent
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-6">
              <span className="text-white">AI-Powered Code</span>
              <br />
              <span className="text-white">Analysis.</span>
              <br />
              <span
                className="shimmer-text"
                style={{ background: 'linear-gradient(90deg, #a78bfa, #7c3aed, #8B5CF6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Smarter
              </span>{' '}
              <span className="text-white">Reviews.</span>{' '}
              <span
                style={{ background: 'linear-gradient(90deg, #06b6d4, #0ea5e9)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Safer
              </span>{' '}
              <span className="text-white">Code.</span>
            </h1>

            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
              CodeGuardian AI analyzes your codebase to detect vulnerabilities,
              code smells, and anti-patterns — and provides intelligent
              recommendations to help you build secure, high-quality software.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => router.push('/upload')}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)',
                  boxShadow: '0 0 30px rgba(108,99,255,0.5), 0 4px 20px rgba(108,99,255,0.3)',
                }}
              >
                <Rocket className="w-4 h-4" />
              Start Free Analysis
            </button>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'Advanced Security',    sub: 'Detect vulnerabilities before attackers do' },
                { icon: <Sparkles     className="w-3.5 h-3.5" />, label: 'AI-Powered Insights', sub: 'Get smart suggestions to improve your code' },
                { icon: <Zap          className="w-3.5 h-3.5" />, label: 'Instant Results',     sub: 'Real-time analysis in seconds' },
                { icon: <Lock         className="w-3.5 h-3.5" />, label: 'Privacy First',       sub: "Your code is secure and never shared" },
              ].map((pill) => (
                <div key={pill.label} className="flex items-start gap-2">
                  <div className="text-primary mt-0.5 flex-shrink-0">{pill.icon}</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-200">{pill.label}</p>
                    <p className="text-[10px] text-gray-500">{pill.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual panels */}
          <div className="relative flex gap-3 items-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CodePanel />
            <AnalysisPanel />
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] text-gray-500 uppercase font-semibold mb-8">
            Trusted by Developers &amp; Teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {COMPANIES.map((name) => (
              <div key={name}
                className="text-gray-600 font-bold text-lg tracking-wide hover:text-gray-300 transition-all duration-300 hover:scale-110 cursor-default select-none"
                style={{ filter: 'grayscale(1)', transition: 'all 0.3s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.filter = 'grayscale(0)'; (e.currentTarget as HTMLDivElement).style.color = '#a78bfa'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.filter = 'grayscale(1)'; (e.currentTarget as HTMLDivElement).style.color = ''; }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">
            Everything you need for{' '}
            <span style={{ background: 'linear-gradient(90deg, #6C63FF, #06B6D4)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              better code
            </span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Comprehensive code analysis powered by IBM Granite AI — catch issues before they reach production.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feat, i) => (
            <div
              key={feat.label}
              className="group relative p-6 rounded-xl border transition-all duration-500 hover:-translate-y-1.5 cursor-default overflow-hidden animate-fade-in-up"
              style={{
                animationDelay: `${0.1 * i}s`,
                background: `radial-gradient(ellipse at 60% 110%, ${feat.color}12 0%, #0D0D1A 55%)`,
                borderColor: `${feat.color}28`,
                boxShadow: `0 0 18px ${feat.color}10, inset 0 0 30px ${feat.color}06`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = feat.color + '60';
                el.style.boxShadow = `0 0 36px ${feat.color}28, 0 8px 32px rgba(0,0,0,0.55), inset 0 0 40px ${feat.color}0E`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = feat.color + '28';
                el.style.boxShadow = `0 0 18px ${feat.color}10, inset 0 0 30px ${feat.color}06`;
              }}
            >
              {/* Ambient bottom glow — always visible, subtle */}
              <div
                className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none rounded-b-xl"
                style={{
                  background: `linear-gradient(to top, ${feat.color}1A 0%, transparent 100%)`,
                }}
              />

              {/* Breathing radial glow behind icon */}
              <div
                className="absolute top-3 left-3 w-24 h-24 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${feat.color}20 0%, transparent 70%)`,
                  animation: `redGlow ${2.5 + i * 0.4}s ease-in-out infinite`,
                }}
              />

              {/* Corner shimmer line */}
              <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${feat.color}60 50%, transparent 100%)`,
                  opacity: 0.6,
                }}
              />

              {/* Icon */}
              <div
                className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  background: `${feat.color}1A`,
                  border: `1px solid ${feat.color}50`,
                  color: feat.color,
                  boxShadow: `0 0 12px ${feat.color}20`,
                }}
              >
                {feat.icon}
              </div>
              <h3 className="relative text-sm font-bold text-white mb-2">{feat.label}</h3>
              <p className="relative text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative inline-block p-px rounded-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.5), rgba(6,182,212,0.3))' }}>
            <div className="bg-[#0D0D1A] rounded-2xl px-10 py-12">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse-glow">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-white mb-3">
                Ready to secure your code?
              </h2>
              <p className="text-gray-400 text-sm mb-7">
                Join thousands of developers using CodeGuardian AI to ship safer, higher-quality code.
              </p>
              <button
                onClick={() => router.push('/upload')}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)',
                  boxShadow: '0 0 30px rgba(108,99,255,0.5)',
                }}
              >
                <Rocket className="w-4 h-4" />
                Start Free Analysis
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-white">CodeGuardian <span className="text-primary">AI</span></span>
        </div>
        <p className="text-xs text-gray-600">
          Powered by IBM watsonx · IBM Granite 8B Code Instruct · Enterprise Security Analysis
        </p>
      </footer>
    </div>
  );
}
