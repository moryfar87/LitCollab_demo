// src/services/authService.js
export const authService = {
  async register(email, password, username) {
    try {
      localStorage.clear();
      sessionStorage.clear();

      // Заглушка: имитируем ответ сервера за 500мс
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newUser = {
        id: Date.now(),
        email: email,
        name: username
      };

      // Сохраняем временного пользователя для работы фронтенда
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', 'mock-demo-token');
      localStorage.setItem('access_token', 'mock-demo-token');

      return { message: 'Успешная регистрация', user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      localStorage.clear();
      sessionStorage.clear();

      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser = {
        id: Date.now(),
        email: email,
        name: email ? email.split('@')[0] : 'Пользователь'
      };
      const mockToken = 'mock-demo-token';

      localStorage.setItem('access_token', mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      window.dispatchEvent(new Event('storage'));

      return { access_token: mockToken, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.dispatchEvent(new Event('storage'));
  },

  isAuthenticated() {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    return !!token;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};