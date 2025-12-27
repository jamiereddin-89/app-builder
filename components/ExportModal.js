import React from 'react';

/**
 * Export/Import modal component for app data management
 * Handles bulk export and import of app collections
 * @param {Object} props - Component props
 * @param {boolean} props.showExportModal - Whether modal is visible
 * @param {boolean} props.darkMode - Dark mode theme setting
 * @param {Function} props.onClose - Close modal callback
 * @param {Function} props.onExportApps - Export all apps callback
 * @param {Function} props.onImportApps - Import apps callback
 * @param {Object} props.fileInputRef - File input reference for import
 * @returns {Object|null} Export modal element or null if hidden
 * @example
 * ExportModal({
 *   showExportModal: true,
 *   onExportApps: handleExport,
 *   onImportApps: handleImport
 * })
 */
export function ExportModal({
  // State
  showExportModal,
  darkMode,
  
  // Handlers
  onClose,
  onExportApps,
  onImportApps,
  fileInputRef
}) {
  const neu = darkMode ? "bg-[#2a2a2a] shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]";
  const neuBtn = darkMode ? "bg-[#2a2a2a] shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a] transition-all duration-150" : "bg-[#e8e8e8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-150";
  const neuBtnBlack = darkMode ? "bg-[#1a1a1a] text-white shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#000,inset_-4px_-4px_8px_#333] transition-all duration-150" : "bg-[#1a1a1a] text-white shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#000,inset_-4px_-4px_8px_#333] transition-all duration-150";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";

  if (!showExportModal) return null;

  // Create action buttons
  const actionButtons = [
    React.createElement('button', {
      key: 'export-btn',
      onClick: onExportApps,
      className: `w-full ${neuBtn} rounded-xl py-3 font-bold ${textPrimary}`
    }, '📤 Export All Apps (JSON)'),
    React.createElement('button', {
      key: 'import-btn',
      onClick: () => fileInputRef.current?.click(),
      className: `w-full ${neuBtn} rounded-xl py-3 font-bold ${textPrimary}`
    }, '📥 Import Apps (JSON)'),
    React.createElement('input', {
      key: 'file-input',
      ref: fileInputRef,
      type: 'file',
      accept: '.json',
      onChange: onImportApps,
      className: 'hidden'
    })
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
        }, '📦 Export / Import'),
        React.createElement('div', {
          key: 'action-buttons',
          className: 'space-y-3'
        }, actionButtons),
        React.createElement('button', {
          key: 'close-btn',
          onClick: onClose,
          className: `w-full ${neuBtnBlack} rounded-xl py-3 font-bold mt-4`
        }, 'Close')
      ]
    )
  );
}