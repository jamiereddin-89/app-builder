/**
 * ThemeProvider - Context and hooks for managing customizable themes
 * Provides theme state management, persistence, and theme switching capabilities
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Theme configuration
const DEFAULT_THEMES = {
  light: {
    id: 'light',
    name: 'Light',
    colors: {
      primary: '#1a1a1a',
      secondary: '#666666', 
      muted: '#888888',
      accent: '#dc2626',
      success: '#16a34a',
      warning: '#fbbf24',
      error: '#dc2626',
      background: '#e8e8e8',
      backgroundSecondary: '#f5f5f5',
      backgroundAccent: '#dc2626',
      backgroundInset: '#e8e8e8',
      shadowLight: '#c5c5c5',
      shadowDark: '#ffffff'
    },
    isDark: false
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#e8e8e8',
      secondary: '#cccccc',
      muted: '#888888', 
      accent: '#dc2626',
      success: '#22c55e',
      warning: '#fbbf24',
      error: '#ef4444',
      background: '#2a2a2a',
      backgroundSecondary: '#1a1a1a',
      backgroundAccent: '#dc2626',
      backgroundInset: '#2a2a2a',
      shadowLight: '#1a1a1a',
      shadowDark: '#3a3a3a'
    },
    isDark: true
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    colors: {
      primary: '#1a3319',
      secondary: '#4a6741',
      muted: '#6b7c6b',
      accent: '#8b4513',
      success: '#228b22',
      warning: '#daa520',
      error: '#b22222',
      background: '#e8f5e8',
      backgroundSecondary: '#d4e8d4',
      backgroundAccent: '#8b4513',
      backgroundInset: '#e8f5e8',
      shadowLight: '#c8d8c8',
      shadowDark: '#f0fff0'
    },
    isDark: false
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#64748b',
      accent: '#0891b2',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      background: '#f0f9ff',
      backgroundSecondary: '#e0f2fe',
      backgroundAccent: '#0891b2',
      backgroundInset: '#f0f9ff',
      shadowLight: '#c7d2fe',
      shadowDark: '#ffffff'
    },
    isDark: false
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      primary: '#1c1c1c',
      secondary: '#4a4a4a',
      muted: '#6b7280',
      accent: '#f59e0b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#fef3c7',
      backgroundSecondary: '#fde68a',
      backgroundAccent: '#f59e0b',
      backgroundInset: '#fef3c7',
      shadowLight: '#fcd34d',
      shadowDark: '#ffffff'
    },
    isDark: false
  }
};

// Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export function ThemeProvider({ children, defaultTheme = 'light' }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('selectedTheme');
      if (savedTheme && DEFAULT_THEMES[savedTheme]) {
        return DEFAULT_THEMES[savedTheme];
      }
    } catch (error) {
      console.warn('localStorage not available, using default theme');
    }
    return DEFAULT_THEMES[defaultTheme] || DEFAULT_THEMES.light;
  });

  const [customThemes, setCustomThemes] = useState(() => {
    try {
      const saved = localStorage.getItem('customThemes');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('localStorage not available, starting with empty custom themes');
      return {};
    }
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      return false;
    }
  });

  // Apply theme to document
  const applyTheme = useCallback((theme) => {
    const root = document.documentElement;
    
    if (theme.id === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }

    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });

    // Set theme-specific variables
    if (theme.id === 'dark') {
      root.style.setProperty('--bg-primary', theme.colors.backgroundSecondary);
      root.style.setProperty('--bg-secondary', theme.colors.background);
      root.style.setProperty('--bg-inset', theme.colors.backgroundInset);
    } else {
      root.style.setProperty('--bg-primary', theme.colors.background);
      root.style.setProperty('--bg-secondary', theme.colors.backgroundSecondary);
      root.style.setProperty('--bg-inset', theme.colors.backgroundInset);
    }

    root.style.setProperty('--shadow-light', theme.colors.shadowLight);
    root.style.setProperty('--shadow-dark', theme.colors.shadowDark);
  }, []);

  // Update theme
  const setTheme = useCallback((themeId) => {
    const theme = customThemes[themeId] || DEFAULT_THEMES[themeId];
    if (!theme) {
      console.warn(`Theme "${themeId}" not found`);
      return;
    }

    setCurrentTheme(theme);
    setIsDarkMode(theme.isDark);

    // Save to localStorage
    try {
      localStorage.setItem('selectedTheme', themeId);
      localStorage.setItem('darkMode', JSON.stringify(theme.isDark));
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }

    applyTheme(theme);
  }, [customThemes, applyTheme]);

  // Create custom theme
  const createCustomTheme = useCallback((themeData) => {
    const themeId = `custom-${Date.now()}`;
    const customTheme = {
      id: themeId,
      name: themeData.name || 'Custom Theme',
      colors: {
        ...themeData.colors,
        // Ensure all required color properties exist
        primary: themeData.colors?.primary || '#1a1a1a',
        secondary: themeData.colors?.secondary || '#666666',
        muted: themeData.colors?.muted || '#888888',
        accent: themeData.colors?.accent || '#dc2626',
        success: themeData.colors?.success || '#16a34a',
        warning: themeData.colors?.warning || '#fbbf24',
        error: themeData.colors?.error || '#dc2626',
        background: themeData.colors?.background || '#e8e8e8',
        backgroundSecondary: themeData.colors?.backgroundSecondary || '#f5f5f5',
        backgroundAccent: themeData.colors?.backgroundAccent || '#dc2626',
        backgroundInset: themeData.colors?.backgroundInset || '#e8e8e8',
        shadowLight: themeData.colors?.shadowLight || '#c5c5c5',
        shadowDark: themeData.colors?.shadowDark || '#ffffff'
      },
      isDark: themeData.isDark || false
    };

    setCustomThemes(prev => ({
      ...prev,
      [themeId]: customTheme
    }));

    try {
      localStorage.setItem('customThemes', JSON.stringify({
        ...customThemes,
        [themeId]: customTheme
      }));
    } catch (error) {
      console.warn('Failed to save custom theme to localStorage:', error);
    }

    setTheme(themeId);
    return customTheme;
  }, [customThemes, setTheme]);

  // Delete custom theme
  const deleteCustomTheme = useCallback((themeId) => {
    if (!customThemes[themeId]) return;

    const newCustomThemes = { ...customThemes };
    delete newCustomThemes[themeId];

    setCustomThemes(newCustomThemes);

    try {
      localStorage.setItem('customThemes', JSON.stringify(newCustomThemes));
      
      // If deleted theme was current theme, switch to default
      if (currentTheme.id === themeId) {
        setTheme('light');
      }
    } catch (error) {
      console.warn('Failed to save custom themes to localStorage:', error);
    }
  }, [customThemes, currentTheme.id, setTheme]);

  // Reset to default themes
  const resetThemes = useCallback(() => {
    setCustomThemes({});
    try {
      localStorage.removeItem('customThemes');
      setTheme('light');
    } catch (error) {
      console.warn('Failed to reset themes:', error);
    }
  }, [setTheme]);

  // Get all available themes
  const getAllThemes = useCallback(() => {
    return {
      ...DEFAULT_THEMES,
      ...customThemes
    };
  }, [customThemes]);

  // Toggle dark mode for current theme
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newDarkMode = !prev;
      
      try {
        localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
      } catch (error) {
        console.warn('Failed to save dark mode to localStorage:', error);
      }

      return newDarkMode;
    });
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

  const value = {
    currentTheme,
    isDarkMode,
    setTheme,
    createCustomTheme,
    deleteCustomTheme,
    resetThemes,
    getAllThemes,
    toggleDarkMode,
    DEFAULT_THEMES
  };

  return React.createElement(ThemeContext.Provider, { value }, children);
}

// Custom hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme validation utilities
export function validateTheme(themeData) {
  const errors = [];

  // Validate color values
  const colorRegex = /^#[0-9A-F]{6}$/i;
  const requiredColors = ['primary', 'secondary', 'accent', 'background'];
  
  requiredColors.forEach(color => {
    const value = themeData.colors?.[color];
    if (!value || !colorRegex.test(value)) {
      errors.push(`Invalid color value for ${color}: ${value}`);
    }
  });

  // Validate theme name
  if (!themeData.name || typeof themeData.name !== 'string') {
    errors.push('Theme name is required and must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Export default themes for reference
export { DEFAULT_THEMES };