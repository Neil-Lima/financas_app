export const colors = {
  primary: '#3b82f6',
  secondary: '#dc004e',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',

  bgPrimary: '#0f172a',
  bgSecondary: '#1e293b',
  bgTertiary: 'rgba(2,6,23,0.8)',
  bgCard: 'rgba(2,6,23,0.25)',
  bgHover: 'rgba(2,6,23,0.35)',

  textPrimary: '#e5e7eb',
  textSecondary: 'rgba(226,232,240,0.9)',
  textMuted: 'rgba(226,232,240,0.6)',
  textDisabled: 'rgba(226,232,240,0.4)',

  borderPrimary: 'rgba(113,162,255,0.2)',
  borderSecondary: 'rgba(113,162,255,0.15)',
  borderHover: 'rgba(113,162,255,0.25)',
  borderFocus: 'rgba(56,189,248,0.3)',

  income: {
    bg: 'rgba(16,185,129,0.1)',
    bgHover: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.2)',
    borderHover: 'rgba(16,185,129,0.3)',
    color: '#10b981',
  },
  expense: {
    bg: 'rgba(239,68,68,0.1)',
    bgHover: 'rgba(239,68,68,0.15)',
    border: 'rgba(239,68,68,0.2)',
    borderHover: 'rgba(239,68,68,0.3)',
    color: '#ef4444',
  },
  transfer: {
    bg: 'rgba(59,130,246,0.1)',
    bgHover: 'rgba(59,130,246,0.15)',
    border: 'rgba(59,130,246,0.2)',
    borderHover: 'rgba(59,130,246,0.3)',
    color: '#3b82f6',
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const typography = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
  xl: '0 20px 25px rgba(0,0,0,0.1)',
  hover: '0 4px 12px rgba(0,0,0,0.15)',
};

export const transitions = {
  fast: 'all 0.15s ease',
  normal: 'all 0.2s ease',
  slow: 'all 0.3s ease',
};

export const darkTheme = {
  mode: 'dark',
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
};

export const lightTheme = {
  mode: 'light',
  colors: {
    ...colors,
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    bgTertiary: '#ffffff',
    bgCard: 'rgba(0,0,0,0.03)',
    bgHover: 'rgba(0,0,0,0.06)',
    textPrimary: '#0f172a',
    textSecondary: 'rgba(15,23,42,0.85)',
    textMuted: 'rgba(15,23,42,0.6)',
    textDisabled: 'rgba(15,23,42,0.4)',
    borderPrimary: 'rgba(15,23,42,0.12)',
    borderSecondary: 'rgba(15,23,42,0.08)',
    borderHover: 'rgba(15,23,42,0.18)',
    borderFocus: 'rgba(59,130,246,0.35)',
  },
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
};
