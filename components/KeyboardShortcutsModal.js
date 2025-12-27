import React from 'react';

/**
 * Keyboard shortcuts modal component for displaying available shortcuts
 * Shows keyboard shortcuts for common actions with platform-specific keys
 * @param {Object} props - Component props
 * @param {boolean} props.showHelpModal - Whether modal is visible
 * @param {boolean} props.darkMode - Dark mode theme setting
 * @param {Function} props.onClose - Close modal callback
 * @returns {Object|null} Keyboard shortcuts modal or null if hidden
 * @example
 * KeyboardShortcutsModal({
 *   showHelpModal: true,
 *   onClose: handleClose
 * })
 */
export function KeyboardShortcutsModal({
  // State
  showHelpModal,
  darkMode,
  
  // Handlers
  onClose
}) {
  const neu = darkMode ? "bg-[#2a2a2a] shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]";
  const neuInset = darkMode ? "bg-[#2a2a2a] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";
  const neuBtnBlack = darkMode ? "bg-[#1a1a1a] text-white shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#000,inset_-4px_-4px_8px_#333] transition-all duration-150" : "bg-[#1a1a1a] text-white shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#000,inset_-4px_-4px_8px_#333] transition-all duration-150";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  const textSecondary = darkMode ? "text-[#cccccc]" : "text-[#666]";

  if (!showHelpModal) return null;

  // Create keyboard shortcut rows
  const createShortcutRow = (action, keys) => {
    const keyElements = [];
    keys.forEach((key, index) => {
      if (index > 0) {
        keyElements.push(React.createElement('span', {
          key: `plus-${index}`,
          className: `${textSecondary} text-xs`
        }, '+'));
      }
      keyElements.push(React.createElement('kbd', {
        key: key,
        className: `px-2 py-1 rounded text-xs font-mono ${darkMode ? "bg-[#1a1a1a]" : "bg-[#fff]"} border`
      }, key));
    });

    return React.createElement('div', {
      key: action,
      className: `${neuInset} rounded-xl p-3 flex justify-between items-center`
    }, [
      React.createElement('span', {
        key: 'action',
        className: `${textPrimary} font-medium`
      }, action),
      React.createElement('div', {
        key: 'keys',
        className: 'flex gap-1'
      }, keyElements)
    ]);
  };

  const shortcuts = [
    createShortcutRow('Focus Search', ['Ctrl', 'K', 'or', '⌘', 'K']),
    createShortcutRow('Switch to Build Tab', ['Ctrl', 'B', 'or', '⌘', 'B']),
    createShortcutRow('Save/Redeploy', ['Ctrl', 'S', 'or', '⌘', 'S']),
    createShortcutRow('Close Modals', ['Esc']),
    createShortcutRow('Show Help', ['Ctrl', '?', 'or', '⌘', '?'])
  ];

  return React.createElement(
    'div',
    { 
      className: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4',
      onClick: onClose
    },
    React.createElement(
      'div',
      { 
        className: `${neu} rounded-[24px] p-6 max-w-md w-full`,
        onClick: e => e.stopPropagation()
      },
      [
        React.createElement('h3', {
          key: 'title',
          className: `font-black ${textPrimary} text-xl mb-4`
        }, '⌨️ Keyboard Shortcuts'),
        React.createElement('div', {
          key: 'shortcuts',
          className: 'space-y-3'
        }, shortcuts),
        React.createElement('button', {
          key: 'close-btn',
          onClick: onClose,
          className: `w-full ${neuBtnBlack} rounded-xl py-3 font-bold mt-4`
        }, 'Close')
      ]
    )
  );
}