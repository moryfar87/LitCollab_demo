import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState('guest');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          if (userData.role === 'admin') {
            setUserRole('admin');
          } else {
            setUserRole('user');
          }
        } catch (e) {
          setUserRole('guest');
        }
      } else {
        setUserRole('guest');
      }
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setLogoutDialogOpen(false);
    setUserRole('guest');

    if (logout) {
      logout();
    }

    navigate('/');
    window.dispatchEvent(new Event('storage'));
  };

  return (
      <AppBar
          position="fixed"
          elevation={0}
          style={{
            background: 'rgba(21, 21, 21, 0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters style={{ justifyContent: 'space-between', minHeight: '70px' }}>
            {/* Логотип */}
            <Box
                component={Link}
                to="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                }}
            >
              <MenuBookIcon style={{ fontSize: 36, color: '#A78BFA' }} />
              <Typography
                  variant="h5"
                  style={{
                    background: 'linear-gradient(45deg, #7C3AED, #A78BFA)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                  }}
              >
                LitCollab
              </Typography>
            </Box>

            {/* Навигация и кнопка Аватара */}
            <Box style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Box style={{ display: 'flex', gap: '16px' }}>
                <Button
                    component={Link}
                    to="/"
                    style={{
                      color: isActive('/') ? '#A78BFA' : 'rgba(255,255,255,0.7)',
                      fontWeight: isActive('/') ? 600 : 400,
                    }}
                >
                  Главная
                </Button>
                <Button
                    component={Link}
                    to="/stories"
                    style={{
                      color: isActive('/stories') ? '#A78BFA' : 'rgba(255,255,255,0.7)',
                      fontWeight: isActive('/stories') ? 600 : 400,
                    }}
                >
                  Истории
                </Button>
                {userRole !== 'guest' && (
                    <Button
                        component={Link}
                        to="/create-story"
                        style={{
                          color: isActive('/create-story') ? '#A78BFA' : 'rgba(255,255,255,0.7)',
                          fontWeight: isActive('/create-story') ? 600 : 400,
                        }}
                    >
                      Создать историю
                    </Button>
                )}
              </Box>

              <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {userRole === 'guest' ? (
                    <>
                      <Button
                          component={Link}
                          to="/login"
                          variant="outlined"
                          startIcon={<LoginIcon />}
                          size="small"
                          style={{ borderColor: '#7C3AED', color: '#A78BFA' }}
                      >
                        Войти
                      </Button>
                      <Button
                          component={Link}
                          to="/register"
                          variant="contained"
                          size="small"
                          style={{
                            background: 'linear-gradient(45deg, #5B21B6, #7C3AED)',
                            color: '#ffffff',
                          }}
                      >
                        Регистрация
                      </Button>
                    </>
                ) : (
                    <>
                      {userRole === 'admin' && (
                          <Button
                              component={Link}
                              to="/admin"
                              variant="outlined"
                              startIcon={<AdminPanelSettingsIcon />}
                              size="small"
                              style={{ borderColor: '#7C3AED', color: '#A78BFA' }}
                          >
                            Админ
                          </Button>
                      )}

                      {/* Неоновый круг аватара профиля */}
                      <Tooltip title="Профиль">
                        <IconButton
                            component={Link}
                            to="/profile"
                            aria-label="Профиль"
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(91, 33, 182, 0.3)',
                              border: isActive('/profile')
                                  ? '2px solid #A78BFA'
                                  : '1px solid rgba(124, 58, 237, 0.5)',
                              boxShadow: isActive('/profile')
                                  ? '0 0 15px rgba(167, 139, 250, 0.8)'
                                  : '0 0 10px rgba(124, 58, 237, 0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 0,
                            }}
                        >
                          <PersonIcon style={{ fontSize: 26, color: '#A78BFA' }} />
                        </IconButton>
                      </Tooltip>

                      <Button
                          variant="text"
                          startIcon={<LogoutIcon />}
                          onClick={() => setLogoutDialogOpen(true)}
                          style={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        Выйти
                      </Button>
                    </>
                )}
              </Box>
            </Box>
          </Toolbar>
        </Container>

        <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
          <DialogTitle>Подтверждение выхода</DialogTitle>
          <DialogContent>
            <Typography>Вы действительно хотите выйти из аккаунта?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogoutDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleLogout} color="error" variant="contained">
              Выйти
            </Button>
          </DialogActions>
        </Dialog>
      </AppBar>
  );
}

export default Header;