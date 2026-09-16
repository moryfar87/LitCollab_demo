import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TagIcon from '@mui/icons-material/Tag';
import { api } from '../../services/api';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(21,21,21,0.9))',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  background: 'rgba(91,33,182,0.2)',
  color: '#A78BFA',
  borderRadius: '16px',
  '&:hover': {
    background: 'rgba(91,33,182,0.35)',
  },
}));

function MyStories() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyStories();
  }, []);

  const fetchMyStories = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const data = await api.getStories();
      setStories(data);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, story) => {
    setAnchorEl(event.currentTarget);
    setSelectedStory(story);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStory(null);
  };

  const handleCreateStory = () => {
    navigate('/create-story');
  };

  const handleEditStory = () => {
    if (selectedStory) {
      navigate(`/story/${selectedStory.id}/edit`);
    }
    handleMenuClose();
  };

  const handleDeleteStory = async () => {
    if (!selectedStory) return;

    try {
      const stored = localStorage.getItem('demo_stories');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.filter((s) => s.id !== selectedStory.id);
        localStorage.setItem('demo_stories', JSON.stringify(updated));
        setStories(updated);
      }
    } catch (err) {
      console.error('Error deleting story:', err);
    }
    handleMenuClose();
  };

  const handleViewStory = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Только что';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || isNaN(diffDays)) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        return `${diffMinutes || 1} минут назад`;
      }
      return `${diffHours} часов назад`;
    } else if (diffDays === 1) {
      return 'Вчера';
    } else if (diffDays < 7) {
      return `${diffDays} дней назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  if (loading) {
    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress sx={{ color: '#7C3AED' }} />
        </Container>
    );
  }

  if (error) {
    return (
        <Container sx={{ py: 8 }}>
          <Alert severity="error">
            Произошла ошибка при загрузке историй: {error}
          </Alert>
        </Container>
    );
  }

  return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: 'linear-gradient(45deg, #7C3AED, #A78BFA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
          >
            Мои истории
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Управляйте своими историями и следите за их развитием
          </Typography>
          <Button
              variant="contained"
              onClick={handleCreateStory}
              sx={{
                mt: 2,
                background: 'linear-gradient(45deg, #5B21B6, #7C3AED)',
                color: '#ffffff',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(45deg, #7C3AED, #5B21B6)',
                  boxShadow: '0 5px 15px rgba(91, 33, 182, 0.4)',
                },
              }}
          >
            Создать новую историю
          </Button>
        </Box>

        {stories.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                У вас пока нет историй
              </Typography>
              <Typography color="text.secondary">
                Создайте свою первую историю и начните творить!
              </Typography>
            </Box>
        ) : (
            <Grid container spacing={4}>
              {stories.map((story) => (
                  <Grid item xs={12} md={6} key={story.id}>
                    <StyledCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h5" gutterBottom component="div" sx={{ color: '#fff', fontWeight: 600 }}>
                            {story.title}
                          </Typography>
                          <IconButton
                              size="small"
                              onClick={(e) => handleMenuClick(e, story)}
                              sx={{ color: 'rgba(255,255,255,0.7)' }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                          {story.description || 'Без описания'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          {story.genre && <StyledChip label={story.genre} size="small" />}
                          {story.tags && story.tags.map((tag) => (
                              <StyledChip
                                  key={tag.id || tag}
                                  label={tag.name || tag}
                                  size="small"
                                  icon={<TagIcon sx={{ color: '#A78BFA !important' }} />}
                              />
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon fontSize="small" />
                            <Typography variant="body2">
                              {formatDate(story.updated_at || story.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ mt: 'auto', p: 2, pt: 0 }}>
                        <Button
                            size="small"
                            onClick={() => navigate(`/story/${story.id}/edit`)}
                            sx={{
                              color: '#A78BFA',
                              '&:hover': {
                                background: 'rgba(91,33,182,0.2)',
                              },
                            }}
                        >
                          Редактировать
                        </Button>
                        <Button
                            size="small"
                            onClick={() => handleViewStory(story.id)}
                            sx={{
                              color: '#A78BFA',
                              '&:hover': {
                                background: 'rgba(91,33,182,0.2)',
                              },
                            }}
                        >
                          Просмотреть
                        </Button>
                      </CardActions>
                    </StyledCard>
                  </Grid>
              ))}
            </Grid>
        )}

        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              '& .MuiPaper-root': {
                background: 'linear-gradient(145deg, rgba(30,30,30,0.95), rgba(21,21,21,0.95))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
              },
            }}
        >
          <MenuItem
              onClick={handleEditStory}
              sx={{
                color: '#ffffff',
                '&:hover': { background: 'rgba(91,33,182,0.2)' },
              }}
          >
            Редактировать
          </MenuItem>
          <MenuItem
              onClick={handleMenuClose}
              sx={{
                color: '#ffffff',
                '&:hover': { background: 'rgba(91,33,182,0.2)' },
              }}
          >
            Поделиться
          </MenuItem>
          <MenuItem
              onClick={handleDeleteStory}
              sx={{
                color: '#ff3d71',
                '&:hover': { background: 'rgba(255,61,113,0.1)' },
              }}
          >
            Удалить
          </MenuItem>
        </Menu>
      </Container>
  );
}

export default MyStories;