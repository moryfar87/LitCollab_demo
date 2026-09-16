import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    CircularProgress,
    Chip,
    TextField,
    Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TagIcon from '@mui/icons-material/Tag';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '../../services/api';

function Story() {
    const [stories, setStories] = useState([]);
    const [filteredStories, setFilteredStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadStories();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredStories(stories);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredStories(
                stories.filter(
                    (story) =>
                        story.title?.toLowerCase().includes(term) ||
                        story.description?.toLowerCase().includes(term)
                )
            );
        }
    }, [searchTerm, stories]);

    const loadStories = async () => {
        try {
            setLoading(true);
            const data = await api.getStories();
            setStories(data);
            setFilteredStories(data);
        } catch (err) {
            console.error('Error fetching stories:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStoryClick = (storyId) => {
        navigate(`/story/${storyId}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Дата не указана';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                <Alert severity="error">Произошла ошибка при загрузке историй: {error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4, mt: 8 }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    textAlign: 'center',
                    mb: 4,
                    background: 'linear-gradient(45deg, #7C3AED, #A78BFA)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700
                }}
            >
                Все истории
            </Typography>

            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    placeholder="Поиск историй..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{
                        flexGrow: 1,
                        minWidth: 250,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                            '&:hover fieldset': { borderColor: '#7C3AED' },
                            '&.Mui-focused fieldset': { borderColor: '#7C3AED' }
                        }
                    }}
                />
            </Box>

            {filteredStories.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        Истории не найдены
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredStories.map((story) => (
                        <Grid item xs={12} sm={6} md={4} key={story.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(21,21,21,0.9))',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 40px rgba(124, 58, 237, 0.25)'
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            color: '#ffffff'
                                        }}
                                    >
                                        {story.title}
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            mb: 2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical'
                                        }}
                                    >
                                        {story.description || 'Описание отсутствует'}
                                    </Typography>

                                    {story.genre && (
                                        <Chip
                                            label={story.genre}
                                            size="small"
                                            sx={{
                                                mb: 1,
                                                mr: 1,
                                                background: 'rgba(91, 33, 182, 0.2)',
                                                color: '#A78BFA',
                                                borderColor: '#7C3AED'
                                            }}
                                        />
                                    )}

                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                                        {story.tags &&
                                            story.tags.slice(0, 3).map((tag, idx) => (
                                                <Chip
                                                    key={tag.id || idx}
                                                    icon={<TagIcon sx={{ color: '#A78BFA !important' }} />}
                                                    label={tag.name || tag}
                                                    size="small"
                                                    sx={{ background: 'rgba(91, 33, 182, 0.2)', color: '#A78BFA' }}
                                                />
                                            ))}
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {story.user?.name || 'Аноним'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(story.created_at)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>

                                <CardActions>
                                    <Button
                                        onClick={() => handleStoryClick(story.id)}
                                        sx={{
                                            color: '#A78BFA',
                                            '&:hover': { background: 'rgba(91, 33, 182, 0.2)' }
                                        }}
                                    >
                                        Просмотреть
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default Story;