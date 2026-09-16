import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Divider, CircularProgress } from '@mui/material';
import { authService } from '../../services/authService';

const ErrorMessage = ({ message, touched }) => (
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
        }}
    >
        {message}
    </div>
);

const Register = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        submit: ''
    });

    const [touchedFields, setTouchedFields] = useState({
        username: false,
        email: false,
        password: false,
        confirmPassword: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email обязателен';
        if (!emailRegex.test(email)) return 'Некорректный формат email';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Пароль обязателен';
        if (password.length < 8) return 'Пароль должен содержать минимум 8 символов';
        if (!/\d/.test(password)) return 'Пароль должен содержать хотя бы одну цифру';
        if (/[а-яА-Я]/.test(password)) return 'Пароль не должен содержать кириллицу';
        if (!/[A-Z]/.test(password)) return 'Пароль должен содержать хотя бы одну заглавную букву';
        if (!/[a-z]/.test(password)) return 'Пароль должен содержать хотя бы одну строчную букву';
        return '';
    };

    const validateConfirmPassword = (confirmPassword) => {
        if (!confirmPassword) return 'Подтверждение пароля обязательно';
        if (confirmPassword !== userData.password) return 'Пароли не совпадают';
        return '';
    };

    const validateUsername = (username) => {
        if (!username) return 'Имя пользователя обязательно';
        if (username.length < 3) return 'Имя пользователя должно содержать минимум 3 символа';
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Имя пользователя может содержать только латинские буквы, цифры и подчеркивания';
        return '';
    };

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setUserData(prev => ({ ...prev, [field]: value }));

        if (touchedFields[field]) {
            let error = '';
            switch (field) {
                case 'email':
                    error = validateEmail(value);
                    break;
                case 'password':
                    error = validatePassword(value);
                    break;
                case 'confirmPassword':
                    error = validateConfirmPassword(value);
                    break;
                case 'username':
                    error = validateUsername(value);
                    break;
                default:
                    error = '';
            }
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    const handleBlur = (field) => () => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));

        let error = '';
        switch (field) {
            case 'email':
                error = validateEmail(userData[field]);
                break;
            case 'password':
                error = validatePassword(userData[field]);
                break;
            case 'confirmPassword':
                error = validateConfirmPassword(userData[field]);
                break;
            case 'username':
                error = validateUsername(userData[field]);
                break;
            default:
                error = '';
        }
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setTouchedFields({
            username: true,
            email: true,
            password: true,
            confirmPassword: true
        });

        const newErrors = {
            username: validateUsername(userData.username),
            email: validateEmail(userData.email),
            password: validatePassword(userData.password),
            confirmPassword: validateConfirmPassword(userData.confirmPassword)
        };

        setErrors({ ...newErrors, submit: '' });

        const hasErrors = Object.values(newErrors).some(error => error !== '');
        if (!hasErrors) {
            setIsLoading(true);
            try {
                localStorage.clear();
                sessionStorage.clear();

                await authService.register(userData.email, userData.password, userData.username);

                setErrors(prev => ({
                    ...prev,
                    submit: 'Регистрация успешна! Перенаправление на страницу входа...'
                }));

                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            message: 'Регистрация успешна! Теперь вы можете войти.',
                            email: userData.email
                        }
                    });
                }, 1500);

            } catch (error) {
                setErrors(prev => ({
                    ...prev,
                    submit: error.message || 'Произошла ошибка при регистрации'
                }));
            } finally {
                setIsLoading(false);
            }
        }
    };

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
                    Регистрация
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Имя пользователя"
                            value={userData.username}
                            onChange={handleChange('username')}
                            onBlur={handleBlur('username')}
                            error={touchedFields.username && !!errors.username}
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
                        <ErrorMessage message={errors.username} touched={touchedFields.username} />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={userData.email}
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
                        <ErrorMessage message={errors.email} touched={touchedFields.email} />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Пароль"
                            type="password"
                            value={userData.password}
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
                        <ErrorMessage message={errors.password} touched={touchedFields.password} />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Подтвердите пароль"
                            type="password"
                            value={userData.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            error={touchedFields.confirmPassword && !!errors.confirmPassword}
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
                        <ErrorMessage message={errors.confirmPassword} touched={touchedFields.confirmPassword} />
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={isLoading || Object.values(errors).some(error => error !== '' && error !== undefined)}
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
                            {isLoading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Зарегистрироваться'}
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
                        to="/login"
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
                        Уже есть аккаунт?
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

export default Register;