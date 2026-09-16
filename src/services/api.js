const INITIAL_STORIES = [
  {
    id: 1,
    parent_id: null,
    title: 'Тайна заброшенной станции',
    description: 'Научно-фантастическая история о поиске сигналов в глубоком космосе.',
    content: 'В 2145 году станция "Гелиос-4" перестала выходить на связь. Экипаж исследователей отправляется на поиски причины...',
    genre: 'Фантастика',
    user_id: 1,
    user: { id: 1, name: 'Преподаватель (Тест)' },
    children_count: 2,
    created_at: '2026-03-01T12:00:00Z'
  },
  {
    id: 2,
    parent_id: 1,
    title: 'Продолжение: Сигнал из бездны',
    description: 'Ветвь исследования нижних отсеков станции.',
    content: 'Спустившись на нижнюю палубу, команда обнаружила странный пульсирующий источник энергии...',
    genre: 'Фантастика',
    user_id: 1,
    user: { id: 1, name: 'Преподаватель (Тест)' },
    children_count: 0,
    created_at: '2026-03-02T15:30:00Z'
  },
  {
    id: 3,
    parent_id: 1,
    title: 'Продолжение: Побег на катере',
    description: 'Альтернативная ветвь с экстренной эвакуацией.',
    content: 'Решив не рисковать, капитаном было принято решение срочно отстыковаться...',
    genre: 'Фантастика',
    user_id: 2,
    user: { id: 2, name: 'Алексей И.' },
    children_count: 0,
    created_at: '2026-03-03T10:15:00Z'
  }
];

const getStoredStories = () => {
  const stored = localStorage.getItem('demo_stories');
  if (!stored) {
    localStorage.setItem('demo_stories', JSON.stringify(INITIAL_STORIES));
    return INITIAL_STORIES;
  }
  return JSON.parse(stored);
};

export const api = {
  getStories: async () => {
    return getStoredStories();
  },

  getStoryById: async (id) => {
    const stories = getStoredStories();
    return stories.find((s) => String(s.id) === String(id)) || null;
  },

  createStory: async (data) => {
    const stories = getStoredStories();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const newStory = {
      id: Date.now(),
      parent_id: data.parentId ? Number(data.parentId) : null,
      title: data.title || 'Новая история',
      description: data.description || '',
      content: data.content || '',
      genre: data.genre || 'Приключения',
      user_id: currentUser.id || 1,
      user: {
        id: currentUser.id || 1,
        name: currentUser.name || 'Пользователь'
      },
      children_count: 0,
      created_at: new Date().toISOString()
    };

    // Если создается продолжение, увеличиваем счетчик у родителя
    if (newStory.parent_id) {
      const parentIndex = stories.findIndex((s) => Number(s.id) === newStory.parent_id);
      if (parentIndex !== -1) {
        stories[parentIndex].children_count = (stories[parentIndex].children_count || 0) + 1;
      }
    }

    stories.unshift(newStory);
    localStorage.setItem('demo_stories', JSON.stringify(stories));
    return newStory;
  },

  updateStory: async (id, data) => {
    const stories = getStoredStories();
    const index = stories.findIndex((s) => String(s.id) === String(id));
    if (index !== -1) {
      stories[index] = {
        ...stories[index],
        ...data,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('demo_stories', JSON.stringify(stories));
      return stories[index];
    }
    return data;
  },

  vote: async (chapterId, isUpvote) => {
    return { success: true, votes: isUpvote ? 1 : -1 };
  }
};