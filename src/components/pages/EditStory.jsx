import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper, Alert, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '../../services/api';

export default function EditStory() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadStory();
    }, [id]);

    const loadStory = async () => {
        try {
            setLoading(true);
            const story = await api.getStoryById(id);
            if (!story) {
                throw new Error('История не найдена');
            }
            setTitle(story.title || '');
            setDescription(story.description || '');
            setContent(story.content || '');
        } catch (err) {
            console.error('Error loading story:', err);
            setError(err.message || 'Не удалось загрузить историю');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) return;

        try {
            setIsSaving(true);
            setError('');
            await api.updateStory(id, { title, description, content });
            navigate(`/story/${id}`);
        } catch (err) {
            console.error('Error updating story:', err);
            setError('Ошибка при сохранении изменений');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress sx={{ color: '#7C3AED' }} />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/story/${id}`)}
                sx={{ color: '#A78BFA', mb: 2 }}
            >
                Назад к истории
            </Button>

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    background: 'linear-gradient(145deg, #1e1e1e, #151515)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        background: 'linear-gradient(45deg, #7C3AED, #A78BFA)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                        mb: 3,
                    }}
                >
                    Редактировать историю
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Название истории"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover fieldset': { borderColor: '#7C3AED' },
                                '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)', '&.Mui-focused': { color: '#A78BFA' } },
                            '& .MuiInputBase-input': { color: '#ffffff' },
                        }}
                    />
                    <TextField
                        label="Краткое описание"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={2}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover fieldset': { borderColor: '#7C3AED' },
                                '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)', '&.Mui-focused': { color: '#A78BFA' } },
                            '& .MuiInputBase-input': { color: '#ffffff' },
                        }}
                    />
                    <TextField
                        label="Текст истории"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        rows={8}
                        required
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover fieldset': { borderColor: '#7C3AED' },
                                '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)', '&.Mui-focused': { color: '#A78BFA' } },
                            '& .MuiInputBase-input': { color: '#ffffff' },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSaving}
                        sx={{
                            background: 'linear-gradient(45deg, #5B21B6, #7C3AED)',
                            color: '#ffffff',
                            fontWeight: 600,
                            fontSize: '1rem',
                            py: 1.5,
                            '&:hover': {
                                background: 'linear-gradient(45deg, #7C3AED, #5B21B6)',
                                boxShadow: '0 5px 15px rgba(91, 33, 182, 0.5)',
                            },
                        }}
                    >
                        {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}