import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(21,21,21,0.9))',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, #5B21B6, #7C3AED)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    zIndex: -1,
  },
  '&:hover': {
    color: '#ffffff',
    '&::before': {
      opacity: 1,
    },
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #7C3AED, #A78BFA)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  letterSpacing: '0.5px',
  textShadow: '0 0 20px rgba(124,58,237,0.3)',
}));

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const pages = isAuthenticated
      ? ['Главная', 'Мои истории', 'Создать историю']
      : ['Главная', 'Истории'];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handlePageClick = (page) => {
    handleCloseNavMenu();
    let path;
    switch (page) {
      case 'Главная':
        path = '/';
        break;
      case 'Истории':
        path = '/stories';
        break;
      case 'Мои истории':
        path = '/my-story';
        break;
      case 'Создать историю':
        path = '/create-story';
        break;
      default:
        path = `/${page.toLowerCase().replace(/\s+/g, '-')}`;
    }
    navigate(path);
  };

  return (
      <StyledAppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AutoStoriesIcon
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  mr: 1,
                  color: '#7C3AED'
                }}
            />

            <LogoText
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  textDecoration: 'none',
                }}
            >
              LitCollab
            </LogoText>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiPaper-root': {
                      background: 'linear-gradient(145deg, rgba(30,30,30,0.95), rgba(21,21,21,0.95))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }
                  }}
              >
                {pages.map((page) => (
                    <MenuItem
                        key={page}
                        onClick={() => handlePageClick(page)}
                        sx={{
                          color: '#ffffff',
                          '&:hover': {
                            background: 'rgba(91,33,182,0.2)',
                          }
                        }}
                    >
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                ))}
              </Menu>
            </Box>

            <AutoStoriesIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: '#7C3AED' }} />

            <LogoText
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  textDecoration: 'none',
                }}
            >
              LitCollab
            </LogoText>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                  <StyledButton
                      key={page}
                      onClick={() => handlePageClick(page)}
                      sx={{ my: 2, mx: 1, display: 'block' }}
                  >
                    {page}
                  </StyledButton>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={isAuthenticated ? "Профиль" : "Войти"}>
                <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                  <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: 'rgba(91, 33, 182, 0.2)',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)',
                        color: '#A78BFA',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          bgcolor: 'rgba(91, 33, 182, 0.35)',
                          boxShadow: '0 0 25px rgba(124, 58, 237, 0.4)',
                          transform: 'scale(1.05)',
                          '& .MuiSvgIcon-root': {
                            color: '#ffffff',
                          },
                        },
                      }}
                  >
                    <PersonIcon sx={{ color: '#A78BFA', transition: 'all 0.3s ease-in-out' }} />
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>
  );
}

export default Navbar;