import { Link as RouterLink } from 'react-router-dom';
import { Button, Box } from '@mui/material';

function Navigation() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button component={RouterLink} to="/" color="inherit">
        Главная
      </Button>
      <Button component={RouterLink} to="/create" color="inherit">
        Создать историю
      </Button>
      <Button component={RouterLink} to="/profile" color="inherit">
        Профиль
      </Button>
    </Box>
  );
}

export default Navigation;