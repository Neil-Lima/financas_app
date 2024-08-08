import React, { createContext, useState, useContext } from 'react';
import { createGlobalStyle } from 'styled-components';

const ThemeContext = createContext();

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.isDarkMode ? '#121212' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  }
`;

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <GlobalStyle isDarkMode={isDarkMode} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
