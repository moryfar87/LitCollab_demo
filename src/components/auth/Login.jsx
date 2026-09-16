import {useState, useEffect} from 'react';
import {useNavigate, Link, useLocation} from 'react-router-dom';
import {TextField, Button, Paper, Typography, Box, Divider, CircularProgress, Alert} from '@mui/material';

const Login = () => {
    const [credentials, setCredentials] = useState({email: '', password: ''});
    const [errors, setErrors] = useState({email: '', password: '', submit: ''});
    const [touchedFields, setTouchedFields] = useState({email: false, password: false});
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setShowSuccessMessage(true);
            if (location.state.email) {
                setCredentials(prev => ({...prev, email: location.state.email}));
            }
            setTimeout(() => setShowSuccessMessage(false), 5000);
        }

        const isAfterLogout = location.state?.afterLogout;

        if (isAfterLogout) {
            localStorage.clear();
            sessionStorage.clear();

            navigate('/login', {replace: true});
            return;
        }

        const token = localStorage.getItem('access_token');
        if (token) {
            validateToken(token);
        }
    }, [location, navigate]);

    const validateToken = async (token) => {
        if (token === 'mock-access-token') {
            navigate('/profile');
        } else {
            localStorage.clear();
            sessionStorage.clear();
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email обязателен';
        if (!emailRegex.test(email)) return 'Некорректный формат email';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Пароль обязателен';
        if (password.length < 8) return 'Пароль должен содержать минимум 8 символов';
        return '';
    };

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setCredentials(prev => ({...prev, [field]: value}));

        if (touchedFields[field]) {
            let error = '';
            if (field === 'email') error = validateEmail(value);
            if (field === 'password') error = validatePassword(value);
            setErrors(prev => ({...prev, [field]: error}));
        }
    };

    const handleBlur = (field) => () => {
        setTouchedFields(prev => ({...prev, [field]: true}));

        let error = '';
        if (field === 'email') error = validateEmail(credentials.email);
        if (field === 'password') error = validatePassword(credentials.password);

        setErrors(prev => ({...prev, [field]: error}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setTouchedFields({email: true, password: true});

        const emailError = validateEmail(credentials.email);
        const passwordError = validatePassword(credentials.password);

        if (emailError || passwordError) {
            setErrors({email: emailError, password: passwordError});
            return;
        }

        setIsLoading(true);
        setErrors(prev => ({...prev, submit: ''}));

        try {
            localStorage.clear();
            sessionStorage.clear();

            await new Promise((resolve) => setTimeout(resolve, 600));

            const mockUser = {
                id: Date.now(),
                name: credentials.email.split('@')[0],
                email: credentials.email,
                role: 'admin'
            };

            localStorage.setItem('access_token', 'mock-access-token');
            localStorage.setItem('token_type', 'bearer');
            localStorage.setItem('user', JSON.stringify(mockUser));

            window.dispatchEvent(new Event('storage'));

            navigate('/profile');

        } catch (error) {
            console.error('Login error:', error);
            setErrors(prev => ({
                ...prev,
                submit: error.message || 'Произошла ошибка при входе'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const ErrorMessage = ({message, touched}) => (
        <div
            style={{
                color: '#ff3d71',
                fontSize: '0.75rem',
                marginTop: '6px',
                background: 'rgba(255, 61, 113, 0.1)',
                padding: '8px 12px',
                borderRadius: '4px',
                borderLeft: '3px solid #ff3d71',
                opacity: message && touched ? 1 : 0,
                transform: message && touched ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'all 0.2s ease-in-out',
                display: message && touched ? 'block' : 'none',
            }}
        >
            {message}
        </div>
    );

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                padding: 2,
                opacity: 0,
                transform: 'translateY(20px)',
                animation: 'fadeIn 0.5s ease-out forwards',
                '@keyframes fadeIn': {
                    to: {
                        opacity: 1,
                        transform: 'translateY(0)',
                    },
                },
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    maxWidth: 400,
                    width: '100%',
                    background: 'linear-gradient(145deg, #1e1e1e, #151515)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #7C3AED, #A78BFA)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                        mb: 3
                    }}
                >
                    Вход
                </Typography>

                {showSuccessMessage && location.state?.message && (
                    <Alert
                        severity="success"
                        sx={{mb: 2}}
                        onClose={() => setShowSuccessMessage(false)}
                    >
                        {location.state.message}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Box sx={{mb: 2}}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={credentials.email}
                            onChange={handleChange('email')}
                            onBlur={handleBlur('email')}
                            error={touchedFields.email && !!errors.email}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#7C3AED',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7C3AED',
                                    },
                                    '&.Mui-error fieldset': {
                                        borderColor: '#ff3d71',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': {
                                        color: '#A78BFA',
                                    },
                                    '&.Mui-error': {
                                        color: '#ff3d71',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: '#ffffff',
                                },
                            }}
                        />
                        <ErrorMessage message={errors.email} touched={touchedFields.email}/>
                    </Box>

                    <Box sx={{mb: 2}}>
                        <TextField
                            fullWidth
                            label="Пароль"
                            type="password"
                            value={credentials.password}
                            onChange={handleChange('password')}
                            onBlur={handleBlur('password')}
                            error={touchedFields.password && !!errors.password}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#7C3AED',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#7C3AED',
                                    },
                                    '&.Mui-error fieldset': {
                                        borderColor: '#ff3d71',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': {
                                        color: '#A78BFA',
                                    },
                                    '&.Mui-error': {
                                        color: '#ff3d71',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: '#ffffff',
                                },
                            }}
                        />
                        <ErrorMessage message={errors.password} touched={touchedFields.password}/>
                    </Box>

                    <Box sx={{position: 'relative'}}>
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={isLoading}
                            sx={{
                                mt: 3,
                                mb: 2,
                                background: 'linear-gradient(45deg, #5B21B6, #7C3AED)',
                                color: '#ffffff',
                                fontWeight: 600,
                                fontSize: '1rem',
                                padding: '12px',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #7C3AED, #5B21B6)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 5px 15px rgba(91, 33, 182, 0.5)',
                                },
                                '&:disabled': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                },
                            }}
                        >
                            {isLoading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Войти'}
                        </Button>
                        {errors.submit && (
                            <Typography
                                color="error"
                                variant="body2"
                                sx={{
                                    mt: 1,
                                    textAlign: 'center',
                                    background: 'rgba(255, 61, 113, 0.1)',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    borderLeft: '3px solid #ff3d71'
                                }}
                            >
                                {errors.submit}
                            </Typography>
                        )}
                    </Box>

                    <Divider
                        sx={{
                            my: 2,
                            '&::before, &::after': {
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                px: 1
                            }}
                        >
                            или
                        </Typography>
                    </Divider>

                    <Button
                        component={Link}
                        to="/register"
                        fullWidth
                        variant="outlined"
                        sx={{
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                borderColor: '#7C3AED',
                                backgroundColor: 'rgba(91, 33, 182, 0.15)',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        Нет аккаунта?
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;