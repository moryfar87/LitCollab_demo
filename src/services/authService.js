// services/authService.js
export const authService = {
  async register(email, password, username) {
    try {
      // Очищаем старые данные перед регистрацией
      localStorage.clear();
      sessionStorage.clear();
      
      const response = await fetch('http://localhost:8000/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: username,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Ошибка регистрации');
      }

      const data = await response.json();
      
      // НЕ сохраняем токен после регистрации
      // Пользователь должен войти после регистрации
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      // Очищаем старые данные перед входом
      localStorage.clear();
      sessionStorage.clear();
      
      const response = await fetch('http://localhost:8000/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Неверный email или пароль');
      }

      const data = await response.json();
      
      // Сохраняем токен и данные пользователя
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token', data.access_token); // для совместимости
      }
      
      if (data.token_type) {
        localStorage.setItem('token_type', data.token_type);
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Вызываем событие для обновления Header
      window.dispatchEvent(new Event('storage'));
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout() {
    // Полная очистка всех данных
    localStorage.clear();
    sessionStorage.clear();
    
    // Вызываем событие для обновления компонентов
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