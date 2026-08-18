import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const ROUTES = ['/dashboard', '/wallet', '/progress'];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeIndex = ROUTES.indexOf(location.pathname);

  return (
    <Paper elevation={3} sx={{ position: 'sticky', bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        value={activeIndex === -1 ? false : activeIndex}
        onChange={(_, newIndex) => navigate(ROUTES[newIndex])}
        showLabels
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Wallet" icon={<AccountBalanceWalletIcon />} />
        <BottomNavigationAction label="Progress" icon={<TrendingUpIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
