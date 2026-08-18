import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ maxWidth: 600, width: '100%', mx: 'auto' }}>
          <Typography
            variant="h6"
            fontWeight={700}
            color="primary.main"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Kayam
          </Typography>
          {user && (
            <Button size="small" onClick={logout}>
              Log out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
