import React from 'react';

// Import react-window components from global object with error handling
const { FixedSizeList } = window.ReactWindow || {};

/**
 * Fallback component for rendering lists when react-window is unavailable
 * Simple implementation that renders all items without virtualization
 * @param {Function} children - Function to render each item
 * @param {number} height - Container height
 * @param {number} itemCount - Total number of items
 * @param {number} itemSize - Height of each item
 * @param {Object} itemData - Data passed to item renderer
 * @param {string} className - CSS classes for container
 * @returns {Object} Virtualized list container element
 * @example
 * VirtualizedList({...props})
 */
function VirtualizedList({ children, height, itemCount, itemSize, itemData, className }) {
  // Simple fallback that renders all items
  const items = [];
  for (let i = 0; i < itemCount; i++) {
    items.push(children({ index: i, style: {}, data: itemData }));
  }
  
  // Create DOM element using React.createElement instead of JSX
  return React.createElement(
    'div',
    { className, style: { height, overflow: 'auto' } },
    items
  );
}

// Use the real component if available, otherwise fallback
const AppList = FixedSizeList || VirtualizedList;

/**
 * Individual app card component for displaying app information
 * Shows app details, tags, and action buttons with bulk selection support
 * @param {Object} app - App object with metadata
 * @param {Object} selectedApp - Currently selected app
 * @param {boolean} bulkMode - Whether bulk selection mode is active
 * @param {Set<string>} selectedApps - Set of selected app IDs
 * @param {string} textPrimary - Primary text color class
 * @param {string} textSecondary - Secondary text color class
 * @param {string} textMuted - Muted text color class
 * @param {string} neu - Neuomorphic background class
 * @param {string} neuInset - Neuomorphic inset class
 * @param {string} neuBtn - Neuomorphic button class
 * @param {string} neuBtnRed - Red button class
 * @param {string} neuBtnBlack - Black button class
 * @param {Function} onSelectApp - Function to select app
 * @param {Function} onToggleFavorite - Function to toggle favorite status
 * @param {Function} onDuplicateApp - Function to duplicate app
 * @param {Function} onLaunchApp - Function to launch app
 * @param {Function} onToggleSelection - Function to toggle app selection
 * @returns {Object} App card element
 * @example
 * AppCard({app: appData, onSelectApp: handleSelect})
 */
function AppCard({ 
  app, 
  selectedApp, 
  bulkMode, 
  selectedApps, 
  textPrimary, 
  textSecondary, 
  textMuted, 
  neu, 
  neuInset, 
  neuBtn, 
  neuBtnRed, 
  neuBtnBlack,
  onSelectApp,
  onToggleFavorite,
  onDuplicateApp,
  onLaunchApp,
  onToggleSelection
}) {
  // Create tag elements
  const tagElements = app.tags && app.tags.length > 0 ? 
    React.createElement(
      'div',
      { className: 'flex flex-wrap gap-1 mt-2' },
      app.tags.map((tag, tagIndex) =>
        React.createElement(
          'span',
          { 
            key: tagIndex, 
            className: `px-2 py-1 rounded-full text-xs font-bold ${neuBtn} ${textSecondary}` 
          },
          '#' + tag
        )
      )
    ) : null;

  // Create action buttons
  const actionButtons = !bulkMode ? 
    React.createElement(
      'div',
      { className: 'flex flex-col gap-1' },
      [
        React.createElement(
          'button',
          {
            key: 'favorite',
            onClick: (e) => onToggleFavorite(app, e),
            className: `${neuBtn} rounded-full w-8 h-8 flex items-center justify-center text-sm ${textPrimary}`
          },
          app.favorite ? "⭐" : "☆"
        ),
        React.createElement(
          'button',
          {
            key: 'duplicate',
            onClick: (e) => onDuplicateApp(app, e),
            className: `${neuBtn} rounded-full w-8 h-8 flex items-center justify-center text-xs`,
            title: "Duplicate"
          },
          "📋"
        ),
        React.createElement(
          'button',
          {
            key: 'launch',
            onClick: (e) => onLaunchApp(app, e),
            className: `${neuBtnBlack} rounded-full w-8 h-8 flex items-center justify-center text-xs`
          },
          "▶"
        )
      ]
    ) : null;

  // Create checkbox for bulk mode
  const checkbox = bulkMode ? 
    React.createElement(
      'input',
      {
        type: 'checkbox',
        checked: selectedApps.has(app._id),
        onChange: (e) => {
          e.stopPropagation();
          onToggleSelection(app._id, e.target.checked);
        },
        className: 'mt-1 w-5 h-5'
      }
    ) : null;

  return React.createElement(
    'div',
    {
      onClick: () => { if (!bulkMode) onSelectApp(app); },
      className: `p-4 border-b border-[#d0d0d0] cursor-pointer transition-all ${
        selectedApp?._id === app._id ? neuInset : "hover:bg-[#ddd]"
      }`
    },
    React.createElement(
      'div',
      { className: 'flex items-start gap-3' },
      [
        checkbox,
        React.createElement(
          'div',
          { className: 'min-w-0 flex-1' },
          [
            React.createElement(
              'div',
              { className: `font-black ${textPrimary} flex items-center gap-2` },
              [
                React.createElement('span', { key: 'icon', className: 'text-[#dc2626]' }, '📱'),
                app.appTitle || app.appName,
                app.favorite && React.createElement('span', { key: 'star' }, '⭐')
              ]
            ),
            React.createElement(
              'div',
              { className: `${textSecondary} text-xs flex items-center gap-2 mt-1` },
              [
                React.createElement('span', { key: 'version' }, `v${app.version || 1}`),
                React.createElement('span', { key: 'dot1' }, '•'),
                React.createElement('span', { key: 'views' }, `👁️ ${app.views || 0}`)
              ]
            ),
            React.createElement(
              'div',
              { className: `${textMuted} text-xs mt-1 truncate` },
              app.prompt
            ),
            tagElements
          ]
        ),
        actionButtons
      ]
    )
  );
}

export { AppList, AppCard };