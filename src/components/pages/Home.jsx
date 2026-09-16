import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import GroupIcon from '@mui/icons-material/Group';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #7C3AED, #A78BFA)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  textShadow: '0 0 20px rgba(91, 33, 182, 0.4)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  background: 'linear-gradient(145deg, rgba(30,30,30,0.9), rgba(21,21,21,0.9))',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(91,33,182,0.3)',
    '& .MuiSvgIcon-root': {
      color: '#A78BFA',
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'rgba(91, 33, 182, 0.2)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  border: '1px solid rgba(124, 58, 237, 0.3)',
  boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)',
  '& .MuiSvgIcon-root': {
    fontSize: '40px',
    color: '#A78BFA',
    transition: 'all 0.3s ease-in-out',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: 'auto',
  background: 'linear-gradient(45deg, #5B21B6, #7C3AED)',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: 600,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(45deg, #7C3AED, #5B21B6)',
    transform: 'scale(1.05)',
    boxShadow: '0 5px 15px rgba(91,33,182,0.5)',
  },
}));

const AnimatedCard = styled(StyledCard)(({ theme, visible, direction, opacity }) => ({
  opacity: opacity,
  transform: visible
      ? 'translateY(0) translateX(0)'
      : direction === 'left'
          ? 'translateX(-100px)'
          : 'translateX(100px)',
  transition: 'all 0.8s ease-out',
  visibility: opacity === 0 ? 'hidden' : 'visible',
}));

function Home() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const [cardStates, setCardStates] = useState([
    { visible: false, opacity: 0 },
    { visible: false, opacity: 0 },
    { visible: false, opacity: 0 }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll('.feature-card');
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardTop = rect.top + scrollY;

        const triggerPoint = cardTop - windowHeight + 100;

        const progress = Math.min(
            Math.max((scrollY - triggerPoint) / (windowHeight * 0.5), 0),
            1
        );

        setCardStates(prev => {
          const newStates = [...prev];
          newStates[index] = {
            visible: progress > 0,
            opacity: progress
          };
          return newStates;
        });

        if (scrollY < triggerPoint) {
          setCardStates(prev => {
            const newStates = [...prev];
            newStates[index] = {
              visible: false,
              opacity: 0
            };
            return newStates;
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cardContents = [
    {
      icon: <AutoStoriesIcon />,
      title: 'Читайте истории',
      description: 'Погрузитесь в мир увлекательных историй, созданных нашим сообществом',
      buttonText: 'Смотреть истории',
      path: '/stories',
      direction: 'left'
    },
    {
      icon: <CreateIcon />,
      title: 'Создавайте',
      description: 'Делитесь своими идеями и создавайте захватывающие истории',
      buttonText: 'Создать историю',
      path: '/create-story',
      direction: 'right'
    },
    {
      icon: <GroupIcon />,
      title: 'Сотрудничайте',
      description: 'Работайте вместе с другими авторами над общими проектами',
      buttonText: 'Найти соавторов',
      path: '/my-story',
      direction: 'left'
    }
  ];

  return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <GradientTypography variant="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
            Создавайте истории вместе
          </GradientTypography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Платформа для совместного написания увлекательных историй
          </Typography>
          {!isAuthenticated && (
              <StyledButton
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{ fontSize: '1.2rem' }}
              >
                Начать писать
              </StyledButton>
          )}
        </Box>

        <Grid container spacing={4}>
          {cardContents.map((content, index) => (
              <Grid item xs={12} md={4} key={content.title}>
                <AnimatedCard
                    className="feature-card"
                    visible={cardStates[index].visible}
                    opacity={cardStates[index].opacity}
                    direction={content.direction}
                >
                  <IconWrapper>
                    {content.icon}
                  </IconWrapper>
                  <CardContent sx={{
                    textAlign: 'center',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        {content.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {content.description}
                      </Typography>
                    </Box>
                    <StyledButton
                        onClick={() => navigate(content.path)}
                        sx={{ mt: 3 }}
                    >
                      {content.buttonText}
                    </StyledButton>
                  </CardContent>
                </AnimatedCard>
              </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Как это работает?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Наша платформа позволяет авторам со всего мира объединяться и создавать уникальные истории.
            Каждый участник может внести свой вклад в развитие сюжета, предложить новые идеи и
            помочь сделать историю еще более интересной.
          </Typography>
        </Box>
      </Container>
  );
}

export default Home;