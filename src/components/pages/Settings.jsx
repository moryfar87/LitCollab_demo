import { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(21,21,21,0.9))',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    marginBottom: theme.spacing(3),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.2)',
        },
        '&:hover fieldset': {
            borderColor: '#7C3AED',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#7C3AED',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255,255,255,0.7)',
        '&.Mui-focused': {
            color: '#A78BFA',
        },
    },
}));

function Settings() {
    const [settings, setSettings] = useState({
        notifications: {
            newComments: true,
            newFollowers: true,
            storyUpdates: true,
            emailNotifications: false,
        },
        privacy: {
            profileVisibility: 'public',
            showEmail: false,
            allowMessages: true,
        },
        appearance: {
            fontSize: 'medium',
            reduceAnimations: false,
        },
    });

    const [saveStatus, setSaveStatus] = useState(null);

    const handleNotificationChange = (setting) => (event) => {
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [setting]: event.target.checked,
            },
        }));
    };

    const handlePrivacyChange = (setting) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setSettings((prev) => ({
            ...prev,
            privacy: {
                ...prev.privacy,
                [setting]: value,
            },
        }));
    };

    const handleAppearanceChange = (setting) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setSettings((prev) => ({
            ...prev,
            appearance: {
                ...prev.appearance,
                [setting]: value,
            },
        }));
    };

    const handleSave = () => {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 3000);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography
                variant="h1"
                sx={{
                    textAlign: 'center',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    mb: 4,
                    background: 'linear-gradient(45deg, #7C3AED, #A78BFA)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                }}
            >
                Настройки
            </Typography>

            {saveStatus === 'success' && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                        background: 'rgba(91,33,182,0.2)',
                        color: '#A78BFA',
                        border: '1px solid #7C3AED',
                    }}
                >
                    Настройки успешно сохранены
                </Alert>
            )}

            <StyledPaper>
                <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                    Уведомления
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.notifications.newComments}
                                onChange={handleNotificationChange('newComments')}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#A78BFA',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#7C3AED',
                                    },
                                }}
                            />
                        }
                        label="Новые комментарии"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.notifications.newFollowers}
                                onChange={handleNotificationChange('newFollowers')}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#A78BFA',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#7C3AED',
                                    },
                                }}
                            />
                        }
                        label="Новые подписчики"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.notifications.storyUpdates}
                                onChange={handleNotificationChange('storyUpdates')}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#A78BFA',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#7C3AED',
                                    },
                                }}
                            />
                        }
                        label="Обновления историй"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.notifications.emailNotifications}
                                onChange={handleNotificationChange('emailNotifications')}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#A78BFA',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#7C3AED',
                                    },
                                }}
                            />
                        }
                        label="Email уведомления"
                    />
                </Box>
            </StyledPaper>

            <StyledPaper>
                <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                    Конфиденциальность
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <StyledFormControl fullWidth>
                        <InputLabel>Видимость профиля</InputLabel>
                        <Select
                            value={settings.privacy.profileVisibility}
                            onChange={handlePrivacyChange('profileVisibility')}
                            label="Видимость профиля"
                        >
                            <MenuItem value="public">Публичный</MenuItem>
                            <MenuItem value="private">Приватный</MenuItem>
                            <MenuItem value="followers">Только подписчики</MenuItem>
                        </Select>
                    </StyledFormControl>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.privacy.showEmail}
                                onChange={handlePrivacyChange('showEmail')}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#A78BFA',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#7C3AED',
                                    },
                                }}
                            />
                        }
                        label="Показывать email"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.privacy.allowMessages}
                                onChange={handlePrivacyChange('allowMessages')}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#A78BFA',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#7C3AED',
                                    },
                                }}
                            />
                        }
                        label="Разрешить сообщения"
                    />
                </Box>
            </StyledPaper>

            <StyledPaper>
                <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                    Внешний вид
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <StyledFormControl fullWidth>
                        <InputLabel>Размер шрифта</InputLabel>
                        <Select
                            value={settings.appearance.fontSize}
                            onChange={handleAppearanceChange('fontSize')}
                            label="Размер шрифта"
                        >
                            <MenuItem value="small">Маленький</MenuItem>
                            <MenuItem value="medium">Средний</MenuItem>
                            <MenuItem value="large">Большой</MenuItem>
                        </Select>
                    </StyledFormControl>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.appearance.reduceAnimations}
                                onChange={handleAppearanceChange('reduceAnimations')}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#A78BFA',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#7C3AED',
                                    },
                                }}
                            />
                        }
                        label="Уменьшить анимации"
                    />
                </Box>
            </StyledPaper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                        background: 'linear-gradient(45deg, #5B21B6, #7C3AED)',
                        color: '#ffffff',
                        fontWeight: 600,
                        '&:hover': {
                            background: 'linear-gradient(45deg, #7C3AED, #5B21B6)',
                            boxShadow: '0 5px 15px rgba(91, 33, 182, 0.4)',
                        },
                    }}
                >
                    Сохранить настройки
                </Button>
            </Box>
        </Container>
    );
}

export default Settings;