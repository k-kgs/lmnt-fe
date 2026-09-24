import { createTheme } from '@mui/material/styles';

// day0 brand tokens — ported from idea/survey/day0-checkin-v2.html.
export const day0Tokens = {
  ink: '#1c232c',
  inkSoft: '#5b6673',
  paper: '#faf6ef',
  surface: '#ffffff',
  surface2: '#f1ece1',
  sky: '#3860c9',
  skySoft: '#e8edfb',
  sunrise: '#ef8354',
  sunriseSoft: '#fdeae1',
  sage: '#4f8f6d',
  sageSoft: '#e6f2ea',
  plum: '#7d5ba6',
  plumSoft: '#efe7f7',
  mist: '#e1dcd0',
  danger: '#c1503f',
  personaDeep: '#20262d',
};

export const day0Theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: day0Tokens.sky },
    secondary: { main: day0Tokens.sunrise },
    success: { main: day0Tokens.sage },
    error: { main: day0Tokens.danger },
    background: { default: day0Tokens.paper, paper: day0Tokens.surface },
    text: { primary: day0Tokens.ink, secondary: day0Tokens.inkSoft },
  },
  typography: {
    fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: { fontFamily: "'Fraunces', Georgia, serif" },
    h2: { fontFamily: "'Fraunces', Georgia, serif" },
    h3: { fontFamily: "'Fraunces', Georgia, serif" },
    h4: { fontFamily: "'Fraunces', Georgia, serif" },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 700, borderRadius: 14 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, borderRadius: 99 },
      },
    },
  },
});
