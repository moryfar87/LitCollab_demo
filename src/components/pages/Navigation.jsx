// components/Navigation.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Проверяем авторизацию при монтировании и изменениях
  useEffect(() => {
    checkAuth();

    // Слушаем изменения в localStorage
    window.addEventListener('storage', checkAuth);

    // Проверяем при изменении location
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [location]);

  const checkAuth = () => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <nav>
        <Link to="/" className="logo">
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '& svg': {
              transition: 'transform 0.3s ease',
            },
            '&:hover svg': {
              transform: 'rotate(-10deg)',
            }
          }}>
            <MenuBookIcon sx={{
              fontSize: 40,
              color: '#00f5d4'
            }} />
            <Typography
              variant="h4"
              component="span"
              sx={{
                background: 'linear-gradient(45deg, #00f5d4, #00fff2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700
              }}
            >
              StoryTree
            </Typography>
          </Box>
        </Link>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <div className="nav-links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Главная
            </Link>
            <Link to="/stories" className={isActive('/stories') ? 'active' : ''}>
              Истории
            </Link>
            {isAuthenticated && (
              <Link to="/create-story" className={isActive('/create-story') ? 'active' : ''}>
                Создать историю
              </Link>
            )}
          </div>

          <div className="auth-buttons">
            {!isAuthenticated ? (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  size="small"
                  sx={{
                    borderColor: '#00f5d4',
                    color: '#00f5d4',
                    '&:hover': {
                      borderColor: '#00fff2',
                      backgroundColor: 'rgba(0, 245, 212, 0.1)',
                    }
                  }}
                >
                  Войти
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="small"
                  sx={{
                    background: 'linear-gradient(45deg, #00f5d4, #00fff2)',
                    color: '#000',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #00fff2, #00f5d4)',
                    }
                  }}
                >
                  Регистрация
                </Button>
              </>
            ) : (
              <Button
                component={Link}
                to="/profile"
                variant="text"
                color="inherit"
                startIcon={<PersonIcon />}
                className={isActive('/profile') ? 'active' : ''}
                sx={{
                  '&:hover': {
                    color: '#00f5d4',
                  },
                  '&.active': {
                    color: '#00f5d4',
                  }
                }}
              >
                {user?.name || 'Профиль'}
              </Button>
            )}
          </div>
        </Box>
      </nav>
    </header>
  );
}

export default Navigation;