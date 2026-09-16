import { Box } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
                color: '#ffffff',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0) 50%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                },
                '&::after': {
                    content: '""',
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80vw',
                    height: '80vh',
                    background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0) 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                    zIndex: 1,
                },
            }}
        >
            <Navbar />
            <Box
                component="main"
                sx={{
                    pt: '64px',
                    minHeight: 'calc(100vh - 64px)',
                    position: 'relative',
                    zIndex: 2,
                    animation: 'fadeIn 0.5s ease-out',
                    '@keyframes fadeIn': {
                        from: {
                            opacity: 0,
                            transform: 'translateY(20px)',
                        },
                        to: {
                            opacity: 1,
                            transform: 'translateY(0)',
                        },
                    },
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;