// Prompt 3: Code parser utilities
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from '@/types/analysis';

export function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

export function detectLanguage(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    'py': 'Python',
    'js': 'JavaScript',
    'jsx': 'JavaScript',
    'ts': 'TypeScript',
    'tsx': 'TypeScript',
    'java': 'Java',
    'go': 'Go',
    'rb': 'Ruby',
    'php': 'PHP',
    'cs': 'C#',
    'cpp': 'C++',
    'c': 'C++',
    'rs': 'Rust',
  };

  return languageMap[extension || ''] || 'Unknown';
}

export function countLines(content: string): number {
  return content
    .split('\n')
    .filter(line => line.trim().length > 0)
    .length;
}

export function extractFileMetadata(file: File, content: string): UploadedFile {
  return {
    id: uuidv4(),
    name: file.name,
    language: detectLanguage(file.name),
    size: file.size,
    content,
    linesOfCode: countLines(content),
  };
}

// Made with Bob
