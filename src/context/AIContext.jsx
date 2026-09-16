import { createContext, useContext, useState } from 'react';
import { generateStoryIdeas, continueStory, analyzeStyle } from '../services/ai.service';

export const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Функция для генерации идей для историй
  const handleGenerateStoryIdeas = async (prompt) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const ideas = await generateStoryIdeas(prompt);
      return ideas;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsProcessing(false);
    }
  };

  // Функция для автоматического продолжения текста
  const handleContinueStory = async (currentText) => {
    try {
      setIsProcessing(true);
      setError(null);

      const continuation = await continueStory(currentText);
      return continuation;
    } catch (err) {
      setError(err.message);
      return '';
    } finally {
      setIsProcessing(false);
    }
  };

  // Функция для анализа стиля и предложений по улучшению
  const handleAnalyzeStyle = async (text) => {
    try {
      setIsProcessing(true);
      setError(null);

      const suggestions = await analyzeStyle(text);
      return suggestions;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        isProcessing,
        error,
        generateStoryIdeas: handleGenerateStoryIdeas,
        continueStory: handleContinueStory,
        analyzeStyle: handleAnalyzeStyle,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}; 