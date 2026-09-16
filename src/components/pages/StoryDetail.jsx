import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Chip,
    CircularProgress,
    Alert,
    Button,
    Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import StoryNavigationTree from './StoryNavigationTree';
import { api } from '../../services/api.js';

function StoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [treeData, setTreeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        loadStoryAndTree();
    }, [id]);

    const loadStoryAndTree = async () => {
        try {
            setLoading(true);
            setError(null);

            const currentStory = await api.getStoryById(id);
            if (!currentStory) {
                throw new Error('История не найдена');
            }
            setStory(currentStory);

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.id === currentStory.user_id) {
                setIsAuthor(true);
            } else {
                setIsAuthor(false);
            }

            const allStories = await api.getStories();

            const getChildrenNodes = (parentId) => {
                return allStories
                    .filter((s) => Number(s.parent_id) === Number(parentId))
                    .map((child) => ({
                        id: child.id,
                        title: child.title,
                        isCurrent: Number(child.id) === Number(id),
                        relationType: 'continuation',
                        children: getChildrenNodes(child.id)
                    }));
            };

            let rootStory = currentStory;
            while (rootStory.parent_id) {
                const parent = allStories.find((s) => Number(s.id) === Number(rootStory.parent_id));
                if (parent) {
                    rootStory = parent;
                } else {
                    break;
                }
            }

            const fullTree = {
                id: rootStory.id,
                title: rootStory.title,
                isCurrent: Number(rootStory.id) === Number(id),
                relationType: rootStory.parent_id ? 'continuation' : null,
                children: getChildrenNodes(rootStory.id)
            };

            setTreeData(fullTree);
        } catch (err) {
            console.error('Error in StoryDetail:', err);
            setError(err.message || 'Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateContinuation = () => {
        navigate('/create-story', {
            state: {
                parentId: Number(id),
                parentTitle: story?.title
            }
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Дата неизвестна';
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress sx={{ color: '#7C3AED' }} />
            </Container>
        );
    }

    if (error || !story) {
        return (
            <Container sx={{ py: 8 }}>
                <Alert severity="error">{error || 'История не найдена'}</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/stories')} sx={{ mt: 2, color: '#A78BFA' }}>
                    Назад к историям
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/stories')} sx={{ color: '#A78BFA' }}>
                    Все истории
                </Button>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {isAuthor && (
                        <Button
                            startIcon={<EditIcon />}
                            variant="outlined"
                            onClick={() => navigate(`/story/${id}/edit`)}
                            sx={{
                                borderColor: '#7C3AED',
                                color: '#A78BFA',
                                '&:hover': { borderColor: '#A78BFA', backgroundColor: 'rgba(91, 33, 182, 0.2)' }
                            }}
                        >
                            Редактировать
                        </Button>
                    )}

                    <Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        onClick={handleCreateContinuation}
                        sx={{
                            background: 'linear-gradient(45deg, #5B21B6, #7C3AED)',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #7C3AED, #5B21B6)',
                                boxShadow: '0 5px 15px rgba(91, 33, 182, 0.4)',
                            }
                        }}
                    >
                        Написать продолжение
                    </Button>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'stretch' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(21,21,21,0.9))',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        <Typography
                            variant="h3"
                            component="h1"
                            gutterBottom
                            sx={{
                                background: 'linear-gradient(45deg, #7C3AED, #A78BFA)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 700,
                                mb: 3,
                                wordBreak: 'break-word'
                            }}
                        >
                            {story.title || 'Без названия'}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Typography color="text.secondary">
                                    {story.user?.name || story.author || 'Аноним'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                                <Typography color="text.secondary">{formatDate(story.created_at)}</Typography>
                            </Box>
                        </Box>

                        {story.genre && (
                            <Box sx={{ mb: 3 }}>
                                <Chip
                                    label={story.genre}
                                    sx={{
                                        background: 'rgba(91, 33, 182, 0.2)',
                                        color: '#A78BFA',
                                        border: '1px solid rgba(124, 58, 237, 0.4)'
                                    }}
                                />
                            </Box>
                        )}

                        <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

                        {story.description && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ color: '#A78BFA' }}>
                                    Описание
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                                    {story.description}
                                </Typography>
                            </Box>
                        )}

                        {story.content && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ color: '#A78BFA' }}>
                                    Содержание
                                </Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#ffffff' }}>
                                    {story.content}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>

                {treeData && (
                    <Box sx={{ width: { xs: '100%', lg: '380px' }, flexShrink: 0 }}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(21,21,21,0.9))',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                height: '550px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="h6" gutterBottom sx={{ color: '#A78BFA', mb: 2 }}>
                                Дерево развилок
                            </Typography>
                            <Box sx={{ flex: 1, minHeight: 0 }}>
                                <StoryNavigationTree
                                    currentStoryId={Number(id)}
                                    treeData={treeData}
                                    onStorySelect={(selectedId) => navigate(`/story/${selectedId}`)}
                                />
                            </Box>
                        </Paper>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default StoryDetail;