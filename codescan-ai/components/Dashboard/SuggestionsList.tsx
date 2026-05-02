'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

interface SuggestionsListProps {
  suggestions: string[];
}

export default function SuggestionsList({ suggestions }: SuggestionsListProps) {
  return (
    <div className="bg-[#1E1E2E] border border-white/10 rounded-xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-100">AI Suggestions</h2>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400">No suggestions at this time</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-gray-900/30 rounded-lg border-l-4 border-primary hover:bg-gray-900/50 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-200 leading-relaxed">{suggestion}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Watson AI</span>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
