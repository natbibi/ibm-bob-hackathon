// Prompt 3: Zustand store with enhanced file management
import { create } from 'zustand';
import { UploadedFile, AnalysisResult } from '@/types/analysis';
import { readFileContent, extractFileMetadata } from './codeParser';

interface AppState {
  uploadedFiles: UploadedFile[];
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  addFiles: (files: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setAnalyzing: (value: boolean) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  uploadedFiles: [],
  analysisResult: null,
  isAnalyzing: false,
  error: null,

  addFiles: async (files: File[]) => {
    const currentFiles = get().uploadedFiles;
    const totalFiles = currentFiles.length + files.length;

    // Max 5 files total
    if (totalFiles > 5) {
      set({ error: 'Maximum 5 files allowed. Please remove some files first.' });
      return;
    }

    try {
      const newFiles: UploadedFile[] = [];

      for (const file of files) {
        const content = await readFileContent(file);
        const metadata = extractFileMetadata(file, content);
        newFiles.push(metadata);
      }

      set({
        uploadedFiles: [...currentFiles, ...newFiles],
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to read files',
      });
    }
  },

  removeFile: (id: string) => {
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((file) => file.id !== id),
    }));
  },

  setAnalysisResult: (result: AnalysisResult) => {
    set({ analysisResult: result });
  },

  setAnalyzing: (value: boolean) => {
    set({ isAnalyzing: value });
  },

  setError: (msg: string | null) => {
    set({ error: msg });
  },

  reset: () => {
    set({
      uploadedFiles: [],
      analysisResult: null,
      isAnalyzing: false,
      error: null,
    });
  },
}));

// Made with Bob
