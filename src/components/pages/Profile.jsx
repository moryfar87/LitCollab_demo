import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Grid,
    CircularProgress,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CardActions,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { api } from '../../services/api';

function Profile() {
    const [userStories, setUserStories] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [storiesLoading, setStoriesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    setUserData(JSON.parse(savedUser));
                } else {
                    const mockUser = {
                        id: 1,
                        name: 'Пользователь',
                        email: 'user@example.com',
                        role: 'writers',
                    };
                    setUserData(mockUser);
                    localStorage.setItem('user', JSON.stringify(mockUser));
                }
            } catch (err) {
                console.error('Error in fetchUserData:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const fetchUserStories = async () => {
            if (!userData) return;

            setStoriesLoading(true);
            try {
                const stories = await api.getStories();
                const myStories = stories.filter(
                    (story) => !story.user_id || story.user_id === userData.id
                );

                setUserStories(myStories);
            } catch (err) {
                console.error('Error fetching user stories:', err);
            } finally {
                setStoriesLoading(false);
            }
        };

        if (userData) {
            fetchUserStories();
        }
    }, [userData]);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();

        document.cookie.split(';').forEach((c) => {
            document.cookie = c
                .replace(/^ +/, '')
                .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });

        setLogoutDialogOpen(false);
        window.dispatchEvent(new Event('storage'));
        navigate('/login', { state: { afterLogout: true } });
    };

    const getDisplayRole = (role) => {
        const roleMap = {
            writers: 'Писатель',
            readers: 'Читатель',
            admin: 'Администратор',
        };
        return roleMap[role] || role;
    };

    const totalContinuations = userStories.reduce((acc, story) => {
        return acc + (story.children_count || 0);
    }, 0);

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress sx={{ color: '#7C3AED' }} />
            </Container>
        );
    }

    if (error && !userData) {
        return (
            <Container sx={{ py: 8 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(21,21,21,0.9))',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <Typography variant="h5" sx={{ color: 'error.main', mb: 3 }}>
                        Произошла ошибка при загрузке данных
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                        {error}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                            sx={{
                                background: 'linear-gradient(45deg, #5B21B6, #7C3AED)',
                                color: '#ffffff',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #7C3AED, #5B21B6)',
                                },
                            }}
                        >
                            Войти заново
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => window.location.reload()}
                            sx={{
                                borderColor: '#7C3AED',
                                color: '#A78BFA',
                                '&:hover': {
                                    borderColor: '#A78BFA',
                                    backgroundColor: 'rgba(91, 33, 182, 0.2)',
                                },
                            }}
                        >
                            Попробовать снова
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    mb: 4,
                    background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(21,21,21,0.9))',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: 'rgba(91, 33, 182, 0.25)',
                            border: '2px solid #7C3AED',
                            boxShadow: '0 0 25px rgba(124, 58, 237, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 65, color: '#A78BFA' }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                background: 'linear-gradient(45deg, #7C3AED, #A78BFA)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 700,
                                mb: 1,
                            }}
                        >
                            {userData?.name}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                <Typography color="text.secondary">{userData?.email}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BadgeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                <Chip
                                    label={getDisplayRole(userData?.role)}
                                    size="small"
                                    sx={{
                                        background: 'rgba(91, 33, 182, 0.2)',
                                        color: '#A78BFA',
                                        border: '1px solid #7C3AED',
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                <Typography variant="caption" color="text.secondary">
                                    ID пользователя: {userData?.id}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<LogoutIcon />}
                        onClick={() => setLogoutDialogOpen(true)}
                        sx={{
                            background: 'linear-gradient(45deg, #ff2957, #ff4081)',
                            color: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 15px rgba(255, 41, 87, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #ff4081, #ff2957)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(255, 41, 87, 0.4)',
                            },
                            '&:active': {
                                transform: 'translateY(0)',
                                boxShadow: '0 2px 10px rgba(255, 41, 87, 0.3)',
                            },
                        }}
                    >
                        Выйти
                    </Button>
                </Box>
            </Paper>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(21,21,21,0.9))',
                            border: '1px solid rgba(255,255,255,0.1)',
                            textAlign: 'center',
                        }}
                    >
                        <AutoStoriesIcon sx={{ fontSize: 40, color: '#A78BFA', mb: 1 }} />
                        <Typography variant="h3" sx={{ color: '#A78BFA', fontWeight: 700 }}>
                            {userStories.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Создано историй
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(21,21,21,0.9))',
                            border: '1px solid rgba(255,255,255,0.1)',
                            textAlign: 'center',
                        }}
                    >
                        <EditIcon sx={{ fontSize: 40, color: '#A78BFA', mb: 1 }} />
                        <Typography variant="h3" sx={{ color: '#A78BFA', fontWeight: 700 }}>
                            {totalContinuations}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Продолжений
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(21,21,21,0.9))',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ color: '#A78BFA', mb: 3 }}>
                    Мои истории
                </Typography>

                {storiesLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress sx={{ color: '#7C3AED' }} />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {userStories.length > 0 ? (
                            userStories.map((story) => (
                                <Grid item xs={12} sm={6} md={4} key={story.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 16px rgba(124,58,237,0.2)',
                                                border: '1px solid #7C3AED',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                                                {story.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {story.description || 'Без описания'}
                                            </Typography>
                                            {story.genre && (
                                                <Chip
                                                    label={story.genre}
                                                    size="small"
                                                    sx={{
                                                        background: 'rgba(91, 33, 182, 0.2)',
                                                        color: '#A78BFA',
                                                        border: '1px solid #7C3AED',
                                                    }}
                                                />
                                            )}
                                        </CardContent>
                                        <CardActions sx={{ p: 2, pt: 0 }}>
                                            <Button
                                                size="small"
                                                component={RouterLink}
                                                to={`/story/${story.id}`}
                                                startIcon={<VisibilityIcon />}
                                                sx={{ color: '#A78BFA' }}
                                            >
                                                Читать
                                            </Button>
                                            <Button
                                                size="small"
                                                component={RouterLink}
                                                to={`/story/${story.id}/edit`}
                                                startIcon={<EditIcon />}
                                                sx={{ color: '#A78BFA' }}
                                            >
                                                Редактировать
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <AutoStoriesIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                        У вас пока нет созданных историй
                                    </Typography>
                                    <Button
                                        component={RouterLink}
                                        to="/create-story"
                                        variant="contained"
                                        sx={{
                                            background: 'linear-gradient(45deg, #5B21B6, #7C3AED)',
                                            color: '#ffffff',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #7C3AED, #5B21B6)',
                                            },
                                        }}
                                    >
                                        Создать первую историю
                                    </Button>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Paper>

            <Dialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(145deg, #1e1e1e, #151515)',
                        color: 'white',
                        minWidth: '300px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        pb: 2,
                    }}
                >
                    Подтверждение выхода
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography>Вы действительно хотите выйти из аккаунта?</Typography>
                </DialogContent>
                <DialogActions
                    sx={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        pt: 2,
                    }}
                >
                    <Button
                        onClick={() => setLogoutDialogOpen(false)}
                        color="inherit"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleLogout}
                        color="error"
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(45deg, #ff2957, #ff4081)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #ff4081, #ff2957)',
                            },
                        }}
                    >
                        Выйти
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Profile;