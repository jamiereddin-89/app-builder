/**
 * ThemeSelector - UI component for theme selection and customization
 * Provides interface for choosing themes, creating custom themes, and managing theme preferences
 */

import React, { useState } from 'react';
import { useTheme, validateTheme } from './ThemeProvider.js';

export function ThemeSelector({ showModal, onClose }) {
  const {
    currentTheme,
    isDarkMode,
    setTheme,
    createCustomTheme,
    deleteCustomTheme,
    resetThemes,
    getAllThemes,
    toggleDarkMode,
    DEFAULT_THEMES
  } = useTheme();

  const [activeTab, setActiveTab] = useState('presets'); // 'presets', 'customize', 'create'
  const [customThemeData, setCustomThemeData] = useState({
    name: '',
    isDark: false,
    colors: {
      primary: '#1a1a1a',
      secondary: '#666666',
      accent: '#dc2626',
      background: '#e8e8e8',
      backgroundSecondary: '#f5f5f5',
      backgroundInset: '#e8e8e8',
      shadowLight: '#c5c5c5',
      shadowDark: '#ffffff'
    }
  });

  const [validationErrors, setValidationErrors] = useState([]);

  const allThemes = getAllThemes();
  const customThemeIds = Object.keys(allThemes).filter(id => id.startsWith('custom-'));
  const presetThemes = Object.values(DEFAULT_THEMES);

  // Handle theme selection
  const handleThemeSelect = (themeId) => {
    setTheme(themeId);
    onClose?.();
  };

  // Handle custom theme creation
  const handleCreateTheme = () => {
    const validation = validateTheme(customThemeData);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      const newTheme = createCustomTheme(customThemeData);
      setCustomThemeData({
        name: '',
        isDark: false,
        colors: {
          primary: '#1a1a1a',
          secondary: '#666666',
          accent: '#dc2626',
          background: '#e8e8e8',
          backgroundSecondary: '#f5f5f5',
          backgroundInset: '#e8e8e8',
          shadowLight: '#c5c5c5',
          shadowDark: '#ffffff'
        }
      });
      setValidationErrors([]);
      setActiveTab('presets');
      onClose?.();
    } catch (error) {
      setValidationErrors(['Failed to create theme: ' + error.message]);
    }
  };

  // Handle custom theme deletion
  const handleDeleteCustomTheme = (themeId) => {
    if (window.confirm('Are you sure you want to delete this custom theme?')) {
      deleteCustomTheme(themeId);
    }
  };

  // Preview theme changes
  const previewTheme = (themeId) => {
    const theme = allThemes[themeId];
    if (theme) {
      // Apply theme temporarily for preview
      const root = document.documentElement;
      if (theme.id === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
      }

      Object.entries(theme.colors).forEach(([key, value]) => {
        const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
      });
    }
  };

  // Reset preview to current theme
  const resetPreview = () => {
    setTheme(currentTheme.id);
  };

  // Neumorphic styles based on current theme
  const neu = isDarkMode 
    ? "bg-[var(--bg-primary)] shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#3a3a3a]"
    : "bg-[var(--bg-primary)] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]";
  
  const neuInset = isDarkMode 
    ? "bg-[var(--bg-inset)] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a]"
    : "bg-[var(--bg-inset)] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";
  
  const neuBtn = isDarkMode 
    ? "bg-[var(--bg-primary)] shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a] transition-all duration-150"
    : "bg-[var(--bg-primary)] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-150";
  
  const textPrimary = isDarkMode ? "text-[var(--color-primary)]" : "text-[var(--color-primary)]";
  const textSecondary = isDarkMode ? "text-[var(--color-secondary)]" : "text-[var(--color-secondary)]";

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className={`${neu} rounded-[24px] p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden`} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`font-black ${textPrimary} text-2xl flex items-center gap-2`}>
            🎨 Theme Selector
          </h2>
          <button 
            onClick={onClose}
            className={`${neuBtn} rounded-full w-10 h-10 flex items-center justify-center text-lg ${textPrimary}`}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className={`${neuInset} rounded-2xl p-2 flex gap-2 mb-6`}>
          {[
            { id: 'presets', label: '🎭 Presets', icon: '🎭' },
            { id: 'customize', label: '✨ Customize', icon: '✨' },
            { id: 'create', label: '🛠️ Create', icon: '🛠️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? `${neu} text-[var(--color-accent)]` 
                  : `${neuBtn} ${textPrimary}`
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {activeTab === 'presets' && (
            <div className="space-y-6">
              {/* Default Themes */}
              <div>
                <h3 className={`font-bold ${textPrimary} text-lg mb-4`}>Default Themes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {presetThemes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      onMouseEnter={() => previewTheme(theme.id)}
                      onMouseLeave={resetPreview}
                      className={`${neuBtn} rounded-xl p-4 text-center transition-all ${
                        currentTheme.id === theme.id ? 'ring-2 ring-[var(--color-accent)]' : ''
                      }`}
                    >
                      {/* Theme Preview */}
                      <div className="flex justify-center mb-3">
                        <div className="w-12 h-8 rounded flex overflow-hidden shadow-sm">
                          <div 
                            className="flex-1"
                            style={{ backgroundColor: theme.colors.background }}
                          ></div>
                          <div 
                            className="w-6"
                            style={{ backgroundColor: theme.colors.accent }}
                          ></div>
                          <div 
                            className="flex-1"
                            style={{ backgroundColor: theme.colors.primary }}
                          ></div>
                        </div>
                      </div>
                      <div className={`font-bold ${textPrimary} text-sm`}>{theme.name}</div>
                      {theme.id === 'dark' && <div className={`${textSecondary} text-xs`}>🌙</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Themes */}
              {customThemeIds.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-bold ${textPrimary} text-lg`}>Custom Themes</h3>
                    <button 
                      onClick={resetThemes}
                      className={`${neuBtn} rounded-full px-3 py-1 text-xs font-bold ${textSecondary}`}
                    >
                      🗑️ Reset All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {customThemeIds.map(themeId => {
                      const theme = allThemes[themeId];
                      return (
                        <div
                          key={themeId}
                          className={`${neuBtn} rounded-xl p-4 transition-all ${
                            currentTheme.id === themeId ? 'ring-2 ring-[var(--color-accent)]' : ''
                          }`}
                        >
                          <div className="flex justify-center mb-3">
                            <div className="w-12 h-8 rounded flex overflow-hidden shadow-sm">
                              <div 
                                className="flex-1"
                                style={{ backgroundColor: theme.colors.background }}
                              ></div>
                              <div 
                                className="w-6"
                                style={{ backgroundColor: theme.colors.accent }}
                              ></div>
                              <div 
                                className="flex-1"
                                style={{ backgroundColor: theme.colors.primary }}
                              ></div>
                            </div>
                          </div>
                          <div className={`font-bold ${textPrimary} text-sm text-center mb-2`}>
                            {theme.name}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleThemeSelect(themeId)}
                              className={`flex-1 ${neuBtn} rounded-lg py-1 text-xs font-bold ${textPrimary}`}
                            >
                              Use
                            </button>
                            <button
                              onClick={() => handleDeleteCustomTheme(themeId)}
                              className={`${neuBtn} rounded-lg py-1 px-2 text-xs font-bold text-[var(--color-error)]`}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'customize' && (
            <div className="space-y-6">
              <h3 className={`font-bold ${textPrimary} text-lg mb-4`}>
                Customize Current Theme
              </h3>
              <p className={`${textSecondary} text-sm mb-4`}>
                Fine-tune the colors of the current theme "{currentTheme.name}"
              </p>
              
              {/* Color Customization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(currentTheme.colors).map(([key, value]) => (
                  <div key={key} className={`${neuInset} rounded-xl p-4`}>
                    <label className={`block ${textPrimary} font-bold text-sm mb-2 capitalize`}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => {
                          // This would require state management for live editing
                          console.log(`Color changed for ${key}:`, e.target.value);
                        }}
                        className="w-12 h-12 rounded-lg border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value}
                        readOnly
                        className={`flex-1 ${neuBtn} rounded-lg px-3 py-2 text-sm font-mono ${textPrimary} border-0 outline-none`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`${neuInset} rounded-xl p-4`}>
                <h4 className={`font-bold ${textPrimary} mb-2`}>Preview</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className="h-16 rounded-lg"
                    style={{ backgroundColor: currentTheme.colors.background }}
                  ></div>
                  <div 
                    className="h-16 rounded-lg"
                    style={{ backgroundColor: currentTheme.colors.accent }}
                  ></div>
                  <div 
                    className="h-16 rounded-lg"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <h3 className={`font-bold ${textPrimary} text-lg mb-4`}>
                Create Custom Theme
              </h3>
              
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className={`${neuInset} rounded-xl p-4 border-l-4 border-[var(--color-error)]`}>
                  <h4 className={`font-bold text-[var(--color-error)] mb-2`}>Validation Errors:</h4>
                  <ul className={`${textSecondary} text-sm space-y-1`}>
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Theme Name */}
              <div className={`${neuInset} rounded-xl p-4`}>
                <label className={`block ${textPrimary} font-bold text-sm mb-2`}>
                  Theme Name
                </label>
                <input
                  type="text"
                  value={customThemeData.name}
                  onChange={(e) => setCustomThemeData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Custom Theme"
                  className={`w-full ${neuBtn} rounded-lg px-4 py-3 ${textPrimary} border-0 outline-none`}
                />
              </div>

              {/* Dark Mode Toggle */}
              <div className={`${neuInset} rounded-xl p-4`}>
                <label className={`flex items-center gap-3 ${textPrimary} font-bold cursor-pointer`}>
                  <input
                    type="checkbox"
                    checked={customThemeData.isDark}
                    onChange={(e) => setCustomThemeData(prev => ({ ...prev, isDark: e.target.checked }))}
                    className="w-5 h-5 rounded"
                  />
                  Dark Mode Theme
                </label>
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'primary', label: 'Primary Text' },
                  { key: 'secondary', label: 'Secondary Text' },
                  { key: 'accent', label: 'Accent Color' },
                  { key: 'background', label: 'Background' },
                  { key: 'backgroundSecondary', label: 'Secondary Background' },
                  { key: 'backgroundInset', label: 'Inset Background' },
                  { key: 'shadowLight', label: 'Shadow Light' },
                  { key: 'shadowDark', label: 'Shadow Dark' }
                ].map(({ key, label }) => (
                  <div key={key} className={`${neuInset} rounded-xl p-4`}>
                    <label className={`block ${textPrimary} font-bold text-sm mb-2`}>
                      {label}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customThemeData.colors[key]}
                        onChange={(e) => setCustomThemeData(prev => ({
                          ...prev,
                          colors: { ...prev.colors, [key]: e.target.value }
                        }))}
                        className="w-12 h-12 rounded-lg border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customThemeData.colors[key]}
                        onChange={(e) => setCustomThemeData(prev => ({
                          ...prev,
                          colors: { ...prev.colors, [key]: e.target.value }
                        }))}
                        className={`flex-1 ${neuBtn} rounded-lg px-3 py-2 text-sm font-mono ${textPrimary} border-0 outline-none`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div className={`${neuInset} rounded-xl p-4`}>
                <h4 className={`font-bold ${textPrimary} mb-3`}>Theme Preview</h4>
                <div 
                  className="p-6 rounded-xl"
                  style={{ 
                    backgroundColor: customThemeData.colors.background,
                    color: customThemeData.colors.primary,
                    boxShadow: `8px 8px 16px ${customThemeData.colors.shadowLight}, -8px -8px 16px ${customThemeData.colors.shadowDark}`
                  }}
                >
                  <h5 className="font-bold mb-2">Sample Text</h5>
                  <p className="mb-3">This is how your theme will look.</p>
                  <div className="flex gap-2">
                    <button 
                      className="px-4 py-2 rounded-lg font-bold"
                      style={{ 
                        backgroundColor: customThemeData.colors.accent,
                        color: '#ffffff'
                      }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg font-bold"
                      style={{ 
                        backgroundColor: customThemeData.colors.backgroundSecondary,
                        color: customThemeData.colors.primary,
                        boxShadow: `inset 4px 4px 8px ${customThemeData.colors.shadowLight}, inset -4px -4px 8px ${customThemeData.colors.shadowDark}`
                      }}
                    >
                      Secondary Button
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleCreateTheme}
                  className={`flex-1 ${neuBtn} rounded-xl py-4 font-black text-lg ${textPrimary}`}
                >
                  ✨ Create Theme
                </button>
                <button
                  onClick={() => {
                    setCustomThemeData({
                      name: '',
                      isDark: false,
                      colors: {
                        primary: '#1a1a1a',
                        secondary: '#666666',
                        accent: '#dc2626',
                        background: '#e8e8e8',
                        backgroundSecondary: '#f5f5f5',
                        backgroundInset: '#e8e8e8',
                        shadowLight: '#c5c5c5',
                        shadowDark: '#ffffff'
                      }
                    });
                    setValidationErrors([]);
                  }}
                  className={`${neuBtn} rounded-xl px-6 py-4 font-bold ${textSecondary}`}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}