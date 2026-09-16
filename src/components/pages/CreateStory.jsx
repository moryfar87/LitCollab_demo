import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper, Alert, Chip } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { api } from '../../services/api';

export default function CreateStory() {
    const navigate = useNavigate();
    const location = useLocation();

    const parentId = location.state?.parentId || null;
    const parentTitle = location.state?.parentTitle || null;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) return;

        try {
            setIsLoading(true);
            setError('');

            const newStory = await api.createStory({
                title,
                description,
                content,
                parentId
            });

            if (newStory && newStory.id) {
                navigate(`/story/${newStory.id}`);
            } else {
                navigate('/stories');
            }
        } catch (err) {
            console.error('Error creating story:', err);
            setError('Ошибка при создании истории');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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
                        mb: parentId ? 1 : 3,
                    }}
                >
                    {parentId ? 'Написать продолжение' : 'Создать новую историю'}
                </Typography>

                {parentId && (
                    <Box sx={{ mb: 3 }}>
                        <Chip
                            icon={<AccountTreeIcon sx={{ color: '#A78BFA !important' }} />}
                            label={`Продолжение для: "${parentTitle || `История #${parentId}`}"`}
                            sx={{
                                background: 'rgba(91, 33, 182, 0.2)',
                                color: '#A78BFA',
                                border: '1px solid rgba(124, 58, 237, 0.4)',
                                fontSize: '0.9rem',
                                py: 2
                            }}
                        />
                    </Box>
                )}

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Заголовок ветки / главы"
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
                        label="Краткое описание развилки"
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
                        label="Текст продолжения"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        rows={6}
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
                        disabled={isLoading}
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
                        {isLoading ? 'Публикация...' : (parentId ? 'Опубликовать продолжение' : 'Опубликовать')}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}