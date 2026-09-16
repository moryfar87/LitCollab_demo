import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const MOCK_USER = {
  id: 1,
  name: 'Преподаватель (Тест)',
  email: 'teacher@demo.com',
  role: 'admin'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(MOCK_USER); // По умолчанию сразу авторизован
  const navigate = useNavigate();

  const login = async (email, password) => {
    setUser({ ...MOCK_USER, email: email || MOCK_USER.email });
    localStorage.setItem('token', 'mock-demo-token');
    return { token: 'mock-demo-token', user: MOCK_USER };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
      <AuthContext.Provider
          value={{
            user,
            login,
            logout,
            isAuthenticated: !!user,
            isLoading: false
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);