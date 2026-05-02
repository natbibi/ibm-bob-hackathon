'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Shield, Upload, AlertTriangle, X, Loader2, ArrowLeft, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function UploadPage() {
  const router = useRouter();
  const { uploadedFiles, isAnalyzing, error, addFiles, removeFile, setAnalyzing, setAnalysisResult, setError } = useAppStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    await addFiles(acceptedFiles);
  }, [addFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.go', '.rb', '.php', '.cs', '.cpp', '.c', '.rs', '.env'],
    },
    multiple: true,
  });

  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      Python: 'bg-blue-500', JavaScript: 'bg-yellow-500', TypeScript: 'bg-blue-600',
      Java: 'bg-orange-500', Go: 'bg-cyan-500', Ruby: 'bg-red-500',
      Rust: 'bg-orange-600', PHP: 'bg-purple-500', 'C#': 'bg-green-600', 'C++': 'bg-pink-500',
    };
    return colors[language] || 'bg-gray-500';
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return;
    setAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: uploadedFiles }),
      });
      if (!response.ok) throw new Error('Analysis failed');
      const result = await response.json();
      setAnalysisResult(result);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze code');
      setAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07070F] relative overflow-hidden">

      {/* ── BACKGROUND EFFECTS ─────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        {/* Purple orb top-center */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full animate-drift"
          style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 65%)', animationDuration: '28s' }} />
        {/* Cyan orb bottom-right */}
        <div className="absolute bottom-0 -right-40 w-[450px] h-[450px] rounded-full animate-drift"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)', animationDuration: '32s', animationDelay: '6s' }} />
        {/* Violet orb bottom-left */}
        <div className="absolute -bottom-20 -left-32 w-[400px] h-[400px] rounded-full animate-drift"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)', animationDuration: '24s', animationDelay: '3s' }} />
        {/* Particles */}
        {Array.from({ length: 22 }).map((_, i) => (
          <div key={i} className="absolute rounded-full animate-float-up"
            style={{
              width:  `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left:   `${(i * 41) % 100}%`,
              bottom: '-10px',
              background: i % 3 === 0 ? '#6C63FF' : i % 3 === 1 ? '#06B6D4' : '#a78bfa',
              opacity: 0.3 + (i % 5) * 0.08,
              animationDuration: `${6 + (i % 8)}s`,
              animationDelay:    `${(i * 0.9) % 9}s`,
            }} />
        ))}
      </div>

      {/* Navbar */}
      <nav className="bg-[#07070F]/70 backdrop-blur-md border-b border-white/8 sticky top-0 z-50"
        style={{ boxShadow: '0 1px 30px rgba(0,0,0,0.5)' }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-white text-sm">CodeGuardian <span className="text-primary">AI</span></span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Zap className="w-3 h-3 text-primary" />
            <span>IBM Granite AI</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-14 relative z-10 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center"
            style={{ boxShadow: '0 0 30px rgba(108,99,255,0.3)' }}>
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Analyze Your Code
          </h1>
          <p className="text-gray-400 text-sm">
            Upload up to 5 files — IBM Granite AI will scan for vulnerabilities, code smells &amp; quality issues
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 bg-danger/10 border border-danger/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0" />
              <p className="text-danger text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-danger hover:text-danger/70">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
            ${isDragActive
              ? 'border-primary shadow-xl shadow-primary/20'
              : 'border-white/10 hover:border-primary/40'
            }`}
          style={{
            background: isDragActive ? 'rgba(108,99,255,0.12)' : 'rgba(15,15,30,0.6)',
            backdropFilter: 'blur(12px)',
            boxShadow: isDragActive ? '0 0 40px rgba(108,99,255,0.2), inset 0 0 40px rgba(108,99,255,0.05)' : '0 4px 30px rgba(0,0,0,0.4)',
          }}
        >
          <input {...getInputProps()} />
          <div className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center border transition-all duration-300
            ${isDragActive ? 'bg-primary/30 border-primary' : 'bg-primary/10 border-primary/20'}`}>
            <Upload className={`w-7 h-7 transition-colors ${isDragActive ? 'text-white' : 'text-primary'}`} />
          </div>
          <p className="text-lg font-semibold text-gray-200 mb-1">
            {isDragActive ? 'Drop your files here' : 'Drag & drop code files'}
          </p>
          <p className="text-gray-500 text-sm mb-3">or click to browse</p>
          <p className="text-xs text-gray-600">
            Python · JavaScript · TypeScript · Java · Go · Ruby · Rust · PHP · C++ · C# · .env (Max 5 files)
          </p>
        </div>

        {/* File list */}
        {uploadedFiles.length > 0 && (
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-300">Queued Files</p>
              <span className="text-xs text-gray-500">{uploadedFiles.length}/5 files</span>
            </div>
            {uploadedFiles.map((file) => (
              <div key={file.id}
                className="border border-white/8 rounded-xl px-4 py-3 flex items-center justify-between hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'rgba(15,15,30,0.6)', backdropFilter: 'blur(8px)' }}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${getLanguageColor(file.language)}`}>
                        {file.language}
                      </span>
                      <span className="text-xs text-gray-500">{file.linesOfCode} lines</span>
                      <span className="text-xs text-gray-600">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeFile(file.id)} disabled={isAnalyzing}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Analyze button */}
        {uploadedFiles.length > 0 && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full mt-5 font-bold py-4 px-8 rounded-xl text-white text-base flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: isAnalyzing ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)',
              boxShadow: isAnalyzing ? 'none' : '0 0 30px rgba(108,99,255,0.4), 0 4px 20px rgba(108,99,255,0.2)',
            }}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing with IBM Granite AI...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Analyze Code
              </>
            )}
          </button>
        )}
      </div>
    </main>
  );
}
