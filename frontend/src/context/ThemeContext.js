import React, { createContext, useState, useContext, useMemo } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { CssBaseline } from '@mui/material';
import { alpha, createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import GlobalStyle from '../styles/GlobalStyle';
import { darkTheme, lightTheme } from '../styles/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: theme.mode === 'dark' ? 'dark' : 'light',
        background: {
          default: theme.colors.bgPrimary,
          paper: theme.colors.bgSecondary,
        },
        text: {
          primary: theme.colors.textPrimary,
          secondary: theme.colors.textSecondary,
        },
        primary: {
          main: theme.colors.primary || '#1976d2',
        },
        secondary: {
          main: theme.colors.secondary || '#dc004e',
        },
        success: {
          main: theme.colors.success || '#2e7d32',
        },
        error: {
          main: theme.colors.error || '#d32f2f',
        },
        warning: {
          main: theme.colors.warning || '#ed6c02',
        },
        info: {
          main: theme.colors.info || '#0288d1',
        },
        divider: theme.colors.borderPrimary,
      },
      shape: {
        borderRadius: theme.borderRadius.md,
      },
      typography: {
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: ({ theme: mui }) => ({
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${alpha(mui.palette.primary.main, 0.18)}`,
              backgroundImage: `linear-gradient(135deg, ${alpha(mui.palette.primary.main, 0.14)} 0%, ${alpha(
                mui.palette.info.main,
                0.1
              )} 45%, ${alpha(mui.palette.background.paper, 0.06)} 100%)`,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 10px 30px ${alpha(mui.palette.common.black, 0.22)}`,
            }),
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: ({ theme: mui }) => ({
              backgroundImage: 'none',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(mui.palette.primary.main, 0.12)}`,
            }),
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: ({ theme: mui }) => ({
              backgroundColor: alpha(mui.palette.background.default, 0.28),
              backdropFilter: 'blur(8px)',
              borderRadius: theme.borderRadius.md,
              transition: 'box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(mui.palette.primary.main, 0.55),
              },
              '&.Mui-focused': {
                boxShadow: `0 0 0 4px ${alpha(mui.palette.primary.main, 0.18)}`,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(mui.palette.primary.main, 0.8),
              },
            }),
            notchedOutline: ({ theme: mui }) => ({
              borderColor: mui.palette.divider,
            }),
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: ({ theme: mui }) => ({
              '&.Mui-focused': {
                color: mui.palette.primary.main,
              },
            }),
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: theme.borderRadius.md,
              textTransform: 'none',
              fontWeight: 700,
            },
            contained: ({ theme: mui }) => ({
              backgroundImage: `linear-gradient(135deg, ${mui.palette.primary.main} 0%, ${mui.palette.info.main} 100%)`,
              boxShadow: `0 10px 22px ${alpha(mui.palette.primary.main, 0.35)}`,
              '&:hover': {
                backgroundImage: `linear-gradient(135deg, ${mui.palette.primary.dark} 0%, ${mui.palette.info.dark} 100%)`,
                boxShadow: `0 12px 26px ${alpha(mui.palette.primary.main, 0.42)}`,
              },
            }),
          },
        },
      },
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <StyledThemeProvider theme={theme}>
          <GlobalStyle />
          {children}
        </StyledThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
