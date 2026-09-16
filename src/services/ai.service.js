/*
import { env } from '../../vite.env.js';

const API_URL = "https://api-inference.huggingface.co/models/gpt2";

// Добавляем проверку API ключа
const API_KEY = env.VITE_HUGGINGFACE_API_KEY;
if (!API_KEY) {
  console.error('API ключ не найден! Проверьте файл vite.env.js');
} else {
  console.log('API ключ найден, начинается с:', API_KEY.substring(0, 3));
  if (!API_KEY.startsWith('hf_')) {
    console.error('Внимание: API ключ должен начинаться с "hf_"');
  }
}

const generatePrompt = (type, input) => {
  switch (type) {
    case 'ideas':
      return `Generate 5 story ideas based on this description: "${input}". 
      Each idea should be unique and include possible plot twists.`;
    
    case 'continue':
      return `Continue this story text, maintaining the style and atmosphere. Add an interesting plot development:

      ${input}`;
    
    case 'style':
      return `Analyze this text and provide specific recommendations for improving style, structure, and narrative:

      ${input}

      Give 3-5 specific recommendations with examples.`;
    
    default:
      return input;
  }
};

async function query(data) {
  try {
    console.log('Отправка запроса к Hugging Face API...');
    
    // Создаем заголовки отдельно
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + API_KEY);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        inputs: data.inputs,
        parameters: {
          ...data.parameters,
          return_full_text: false,
          max_new_tokens: data.parameters.max_length || 100
        }
      })
    });

    if (!response.ok) {
      console.error('Ошибка API:', {
        status: response.status,
        statusText: response.statusText
      });
      
      if (response.status === 401) {
        throw new Error('Неверный API ключ Hugging Face. Убедитесь, что:\n1. Файл .env содержит правильный ключ\n2. Ключ начинается с "hf_"\n3. Вы выбрали разрешение "Make calls to Inference Providers"');
      } else if (response.status === 503) {
        throw new Error('Модель временно недоступна. Пожалуйста, попробуйте позже.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Произошла ошибка при обращении к AI сервису.');
      }
    }

    const result = await response.json();
    console.log('Ответ от API:', result);

    if (!result || !Array.isArray(result) || !result[0]?.generated_text) {
      throw new Error('Получен некорректный ответ от AI сервиса.');
    }
    return result;
  } catch (error) {
    console.error('Подробности ошибки:', error);
    throw error;
  }
}

export const generateStoryIdeas = async (prompt) => {
  try {
    const response = await query({
      inputs: generatePrompt('ideas', prompt),
      parameters: {
        max_length: 200,
        temperature: 0.7,
        num_return_sequences: 5
      }
    });

    const ideas = response[0].generated_text
      .split('\n')
      .filter(idea => idea.trim())
      .map(idea => idea.replace(/^\d+\.\s*!/, ''));

    return ideas;
  } catch (error) {
    console.error('Error generating ideas:', error);
    throw error;
  }
};

export const continueStory = async (text) => {
  try {
    const response = await query({
      inputs: generatePrompt('continue', text),
      parameters: {
        max_length: 200,
        temperature: 0.8,
        num_return_sequences: 1
      }
    });

    return response[0].generated_text.trim();
  } catch (error) {
    console.error('Error continuing story:', error);
    throw error;
  }
};

export const analyzeStyle = async (text) => {
  try {
    const response = await query({
      inputs: generatePrompt('style', text),
      parameters: {
        max_length: 300,
        temperature: 0.7,
        num_return_sequences: 1
      }
    });

    const suggestions = response[0].generated_text
      .split('\n')
      .filter(suggestion => suggestion.trim())
      .map(suggestion => suggestion.replace(/^\d+\.\s*!/, ''));

    return suggestions;
  } catch (error) {
    console.error('Error analyzing style:', error);
    throw error;
  }
}; */
