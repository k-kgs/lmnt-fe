import { createTheme } from '@mui/material/styles';

export const kayamTheme = createTheme({
  palette: {
    primary: { main: '#ff5a1f' }, // flame
    secondary: { main: '#0e7c7b' }, // teal — verification/trust states
    warning: { main: '#b9860a' }, // gold — coin/reward states
    background: { default: '#fafafa' },
  },
  typography: {
    fontFamily: "'Karla', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
});
