import React from 'react';

/**
 * App details component for displaying comprehensive app information
 * Shows app metadata, tags, and provides action buttons
 * @param {Object} props - Component props
 * @param {Object} props.selectedApp - Currently selected app
 * @param {boolean} props.darkMode - Dark mode theme setting
 * @param {Function} props.onToggleFavorite - Toggle favorite status
 * @param {Function} props.onDuplicateApp - Duplicate app callback
 * @param {Function} props.onLaunchApp - Launch app callback
 * @param {Function} props.onDeleteApp - Delete app callback
 * @returns {Object|null} App details element or null if no app selected
 * @example
 * AppDetails({
 *   selectedApp: app,
 *   onToggleFavorite: handleFavorite,
 *   onLaunchApp: handleLaunch
 * })
 */
export function AppDetails({
  // State
  selectedApp,
  darkMode,
  
  // Handlers
  onToggleFavorite,
  onDuplicateApp,
  onLaunchApp,
  onDeleteApp
}) {
  const neu = darkMode ? "bg-[#2a2a2a] shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]";
  const neuInset = darkMode ? "bg-[#2a2a2a] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";
  const neuBtn = darkMode ? "bg-[#2a2a2a] shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a] transition-all duration-150" : "bg-[#e8e8e8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-150";
  const neuBtnRed = darkMode ? "bg-[#dc2626] text-white shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#b91c1c,inset_-4px_-4px_8px_#ef4444] transition-all duration-150" : "bg-[#dc2626] text-white shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#b91c1c,inset_-4px_-4px_8px_#ef4444] transition-all duration-150";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  const textSecondary = darkMode ? "text-[#cccccc]" : "text-[#666]";
  const textMuted = darkMode ? "text-[#888]" : "text-[#888]";

  if (!selectedApp) return null;

  // Create tag elements
  const tagElements = selectedApp.tags && selectedApp.tags.length > 0 ? 
    React.createElement(
      'div',
      { className: 'mt-2' },
      [
        React.createElement('strong', { key: 'tags-label' }, 'Tags:'),
        React.createElement('div', {
          key: 'tags-container',
          className: 'flex flex-wrap gap-2 mt-1'
        }, selectedApp.tags.map((tag, tagIndex) => 
          React.createElement('span', {
            key: tagIndex,
            className: `px-3 py-1 rounded-full text-xs font-bold ${neuBtn} ${textPrimary}`
          }, `#${tag}`)
        ))
      ]
    ) : null;

  // Create app metadata
  const metadataElements = [
    React.createElement('div', {
      key: 'id-info',
      className: 'flex gap-4 flex-wrap'
    }, [
      React.createElement('span', { key: 'id-label' }, React.createElement('strong', null, 'ID: ')),
      React.createElement('span', { key: 'id-value', className: 'font-mono' }, selectedApp.appName)
    ]),
    React.createElement('div', { key: 'version-info' }, [
      React.createElement('strong', { key: 'version-label' }, 'Version: '),
      React.createElement('span', { key: 'version-value' }, selectedApp.version || 1)
    ]),
    React.createElement('div', { key: 'views-info' }, [
      React.createElement('strong', { key: 'views-label' }, 'Views: '),
      React.createElement('span', { key: 'views-value' }, selectedApp.views || 0)
    ]),
    React.createElement('div', { key: 'url-info' }, [
      React.createElement('strong', { key: 'url-label' }, 'URL: '),
      React.createElement('a', {
        key: 'url-link',
        href: selectedApp.hostedUrl,
        target: '_blank',
        className: 'text-[#dc2626] hover:underline'
      }, selectedApp.hostedUrl)
    ]),
    React.createElement('div', { key: 'model-info' }, [
      React.createElement('strong', { key: 'model-label' }, 'Model: '),
      React.createElement('span', { key: 'model-value' }, selectedApp.model)
    ]),
    tagElements,
    React.createElement('div', {
      key: 'prompt-info',
      className: `${textMuted} text-xs mt-2`
    }, selectedApp.prompt)
  ];

  // Create action buttons
  const actionButtons = [
    React.createElement('button', {
      key: 'favorite-btn',
      onClick: (e) => onToggleFavorite(selectedApp, e),
      className: `${neuBtn} rounded-full w-12 h-12 flex items-center justify-center text-xl ${textPrimary}`
    }, selectedApp.favorite ? "⭐" : "☆"),
    React.createElement('button', {
      key: 'duplicate-btn',
      onClick: (e) => onDuplicateApp(selectedApp, e),
      className: `${neuBtn} rounded-full w-12 h-12 flex items-center justify-center text-xl ${textPrimary}`,
      title: "Duplicate App"
    }, "📋"),
    React.createElement('button', {
      key: 'launch-btn',
      onClick: (e) => onLaunchApp(selectedApp, e),
      className: `${neuBtnRed} rounded-2xl px-6 py-3 font-black`
    }, "🚀 Launch"),
    React.createElement('button', {
      key: 'delete-btn',
      onClick: (e) => onDeleteApp(selectedApp, e),
      className: `${neuBtn} rounded-full w-12 h-12 flex items-center justify-center text-xl text-[#dc2626]`
    }, "🗑️")
  ];

  return React.createElement(
    'div',
    { className: `${neu} rounded-[24px] p-5` },
    React.createElement(
      'div',
      { className: 'flex flex-wrap items-start justify-between gap-4' },
      [
        // Left side - app info
        React.createElement(
          'div',
          { key: 'app-info', className: 'flex-1 min-w-0' },
          [
            // App title
            React.createElement('h3', {
              key: 'app-title',
              className: `font-black ${textPrimary} text-xl flex items-center gap-2`
            }, [
              React.createElement('span', { key: 'icon', className: 'text-[#dc2626]' }, '📱'),
              selectedApp.appTitle || selectedApp.appName,
              selectedApp.favorite && React.createElement('span', { key: 'favorite-star' }, '⭐')
            ]),
            // Metadata
            React.createElement('div', {
              key: 'metadata',
              className: `${textSecondary} text-sm mt-3 space-y-1`
            }, metadataElements)
          ]
        ),
        // Right side - action buttons
        React.createElement(
          'div',
          { key: 'action-buttons', className: 'flex gap-2' },
          actionButtons
        )
      ]
    )
  );
}