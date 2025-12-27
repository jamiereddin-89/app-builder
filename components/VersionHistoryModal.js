import React from 'react';
import { diffLines } from 'diff';

/**
 * Component for displaying diff between two app versions
 * Supports unified and side-by-side view modes with syntax highlighting
 * @param {Object} oldVersion - Previous version object
 * @param {string} viewMode - Display mode ('unified' or 'side-by-side')
 * @param {boolean} darkMode - Dark mode theme setting
 * @returns {Object} Version diff display element
 * @example
 * VersionDiff({
 *   oldVersion: version1,
 *   newVersion: version2,
 *   viewMode: "unified"
 * })
 */
function VersionDiff({ oldVersion, newVersion, viewMode = 'unified', darkMode }) {
  if (!oldVersion || !newVersion) {
    return React.createElement('div', {
      className: `${darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"} shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] rounded-xl p-4 text-center`
    }, React.createElement('div', {
      className: `${darkMode ? "text-[#cccccc]" : "text-[#666]"}`
    }, 'Select two versions to compare'));
  }

  const diff = diffLines(oldVersion.code, newVersion.code);
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  const textSecondary = darkMode ? "text-[#cccccc]" : "text-[#666]";
  const bgAdded = darkMode ? "bg-[#064e3b]" : "bg-[#dcfce7]";
  const bgRemoved = darkMode ? "bg-[#7f1d1d]" : "bg-[#fee2e2]";
  const textAdded = darkMode ? "text-[#10b981]" : "text-[#059669]";
  const textRemoved = darkMode ? "text-[#ef4444]" : "text-[#dc2626]";

  if (viewMode === 'side-by-side') {
    // Create side-by-side diff view
    const createSideBySideColumn = (parts, showAdded, showRemoved) => {
      return React.createElement('div', {
        key: showAdded ? 'right-column' : 'left-column',
        className: 'flex-1 max-h-96 overflow-y-auto',
        ...(showAdded ? { style: { borderLeft: '1px solid #d0d0d0' } } : {})
      }, diff.map((part, index) => {
        if ((showAdded && part.removed) || (showRemoved && part.added)) return null;
        
        const lines = part.value.split('\n');
        return React.createElement('div', {
          key: index,
          className: `font-mono text-xs p-1 ${
            (showAdded && part.added) || (showRemoved && part.removed) ? 
              (part.added ? bgAdded : bgRemoved) : ''
          }`
        }, lines.map((line, lineIndex) => 
          React.createElement('div', {
            key: lineIndex,
            className: `whitespace-pre ${
              (showAdded && part.added) || (showRemoved && part.removed) ?
                (part.added ? textAdded : textRemoved) : textPrimary
            }`
          }, line)
        ));
      }));
    };

    return React.createElement('div', {
      className: `${darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"} shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] rounded-xl overflow-hidden`
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex border-b border-[#d0d0d0]'
      }, [
        React.createElement('div', {
          key: 'old-version-header',
          className: 'flex-1 p-3'
        }, [
          React.createElement('h4', {
            key: 'old-title',
            className: `font-bold ${textPrimary} text-sm`
          }, `Version ${oldVersion.version}`),
          React.createElement('div', {
            key: 'old-date',
            className: `${textSecondary} text-xs`
          }, new Date(oldVersion.createdAt).toLocaleString())
        ]),
        React.createElement('div', {
          key: 'new-version-header',
          className: 'flex-1 p-3 border-l border-[#d0d0d0]'
        }, [
          React.createElement('h4', {
            key: 'new-title',
            className: `font-bold ${textPrimary} text-sm`
          }, `Version ${newVersion.version}`),
          React.createElement('div', {
            key: 'new-date',
            className: `${textSecondary} text-xs`
          }, new Date(newVersion.createdAt).toLocaleString())
        ])
      ]),
      React.createElement('div', {
        key: 'content',
        className: 'flex'
      }, [
        createSideBySideColumn(diff, false, true),  // Left column (removed)
        createSideBySideColumn(diff, true, false)   // Right column (added)
      ])
    ]);
  }

  // Unified view
  return React.createElement('div', {
    className: `${darkMode ? "bg-[#2a2a2a]" : "bg-[#e8e8e8]"} shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] rounded-xl overflow-hidden`
  }, [
    React.createElement('div', {
      key: 'header',
      className: 'p-3 border-b border-[#d0d0d0]'
    }, React.createElement('div', {
      className: 'flex justify-between items-center'
    }, [
      React.createElement('div', {
        key: 'title-section'
      }, [
        React.createElement('h4', {
          key: 'title',
          className: `font-bold ${textPrimary} text-sm`
        }, `Comparing Version ${oldVersion.version} → ${newVersion.version}`),
        React.createElement('div', {
          key: 'dates',
          className: `${textSecondary} text-xs`
        }, `${new Date(oldVersion.createdAt).toLocaleString()} → ${new Date(newVersion.createdAt).toLocaleString()}`)
      ])
    ])),
    React.createElement('div', {
      key: 'diff-content',
      className: 'max-h-96 overflow-y-auto'
    }, diff.map((part, index) => {
      const lines = part.value.split('\n');
      return React.createElement('div', {
        key: index,
        className: `font-mono text-xs p-2 border-b border-[#f0f0f0] last:border-b-0 ${
          part.added ? bgAdded : part.removed ? bgRemoved : ''
        }`
      }, lines.map((line, lineIndex) => 
        React.createElement('div', {
          key: lineIndex,
          className: `whitespace-pre ${
            part.added ? textAdded : part.removed ? textRemoved : textPrimary
          }`
        }, [
          React.createElement('span', {
            key: 'line-indicator',
            className: `inline-block w-8 ${
              part.added ? textAdded : part.removed ? textRemoved : textSecondary
            }`
          }, part.added ? '+' : part.removed ? '-' : ' '),
          line
        ])
      ));
    }))
  ]);
}

/**
 * Version history modal component for managing app versions
 * Displays version list, diff viewer, and restoration functionality
 * @param {Object} props - Component props
 * @param {boolean} props.showVersions - Whether modal is visible
 * @param {Object} props.selectedApp - Currently selected app
 * @param {Array<Object>} props.appVersions - All versions of the app
 * @param {Object} props.selectedOldVersion - Selected older version for diff
 * @param {Object} props.selectedNewVersion - Selected newer version for diff
 * @param {string} props.diffViewMode - Current diff view mode
 * @param {boolean} props.darkMode - Dark mode theme setting
 * @param {Function} props.onClose - Close modal callback
 * @param {Function} props.onResetDiffSelection - Reset diff selection
 * @param {Function} props.onHandleVersionSelect - Handle version selection
 * @param {Function} props.onRestoreVersion - Restore selected version
 * @param {Function} props.onSetDiffViewMode - Set diff view mode
 * @returns {Object|null} Version history modal or null if hidden
 * @example
 * VersionHistoryModal({
 *   showVersions: true,
 *   selectedApp: app,
 *   appVersions: versions,
 *   onRestoreVersion: handleRestore
 * })
 */
export function VersionHistoryModal({
  // State
  showVersions,
  selectedApp,
  appVersions,
  selectedOldVersion,
  selectedNewVersion,
  diffViewMode,
  darkMode,
  
  // Handlers
  onClose,
  onResetDiffSelection,
  onHandleVersionSelect,
  onRestoreVersion,
  onSetDiffViewMode
}) {
  const neu = darkMode ? "bg-[#2a2a2a] shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]";
  const neuInset = darkMode ? "bg-[#2a2a2a] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";
  const neuBtn = darkMode ? "bg-[#2a2a2a] shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a] transition-all duration-150" : "bg-[#e8e8e8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-150";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  const textSecondary = darkMode ? "text-[#cccccc]" : "text-[#666]";
  const textMuted = darkMode ? "text-[#888]" : "text-[#888]";

  if (!showVersions || !selectedApp) return null;

  // Create version list
  const createVersionList = () => {
    if (appVersions.length === 0) {
      return React.createElement('p', {
        className: `${textSecondary} text-center py-4`
      }, 'No versions saved yet');
    }

    return appVersions.map(v => {
      const isOldSelected = selectedOldVersion?._id === v._id;
      const isNewSelected = selectedNewVersion?._id === v._id;
      const isDisabled = selectedOldVersion && !selectedNewVersion && isOldSelected;

      // Create version badges
      const badges = [];
      if (isOldSelected) {
        badges.push(React.createElement('span', {
          key: 'old-badge',
          className: 'text-xs bg-[#dc2626] text-white px-2 py-1 rounded-full'
        }, 'Old'));
      }
      if (isNewSelected) {
        badges.push(React.createElement('span', {
          key: 'new-badge',
          className: 'text-xs bg-[#22c55e] text-white px-2 py-1 rounded-full'
        }, 'New'));
      }

      // Create action buttons
      const actionButtons = [
        React.createElement('button', {
          key: 'select-btn',
          onClick: () => onHandleVersionSelect(v),
          disabled: isDisabled,
          className: `${neuBtn} rounded-full px-3 py-1 text-xs font-bold ${textPrimary} disabled:opacity-50`
        }, isOldSelected || isNewSelected ? 'Selected' : 'Select'),
        React.createElement('button', {
          key: 'restore-btn',
          onClick: () => onRestoreVersion(v),
          className: `${neuBtn} rounded-full px-3 py-1 text-xs font-bold ${textPrimary}`
        }, 'Restore')
      ];

      return React.createElement('div', {
        key: v._id,
        className: `${neuInset} rounded-xl p-3 transition-all ${
          isOldSelected || isNewSelected ? 'ring-2 ring-[#dc2626]' : ''
        }`
      }, React.createElement('div', {
        className: 'flex justify-between items-center'
      }, [
        React.createElement('div', {
          key: 'version-info',
          className: 'flex-1'
        }, [
          React.createElement('div', {
            key: 'version-title',
            className: `font-bold ${textPrimary} flex items-center gap-2`
          }, [
            `Version ${v.version}`,
            ...badges
          ]),
          React.createElement('div', {
            key: 'version-date',
            className: `${textSecondary} text-xs`
          }, new Date(v.createdAt).toLocaleString())
        ]),
        React.createElement('div', {
          key: 'version-actions',
          className: 'flex gap-2'
        }, actionButtons)
      ]));
    });
  };

  // Create diff viewer
  const createDiffViewer = () => {
    if (selectedOldVersion && selectedNewVersion) {
      // Create view mode buttons
      const viewModeButtons = [
        React.createElement('button', {
          key: 'unified-btn',
          onClick: () => onSetDiffViewMode('unified'),
          className: `px-3 py-1 rounded-full text-xs font-bold transition-all ${
            diffViewMode === 'unified' 
              ? 'bg-[#dc2626] text-white shadow-[inset_2px_2px_4px_#b91c1c,inset_-2px_-2px_4px_#ef4444]' 
              : `${neuBtn} ${textPrimary}`
          }`
        }, 'Unified'),
        React.createElement('button', {
          key: 'side-by-side-btn',
          onClick: () => onSetDiffViewMode('side-by-side'),
          className: `px-3 py-1 rounded-full text-xs font-bold transition-all ${
            diffViewMode === 'side-by-side' 
              ? 'bg-[#dc2626] text-white shadow-[inset_2px_2px_4px_#b91c1c,inset_-2px_-2px_4px_#ef4444]' 
              : `${neuBtn} ${textPrimary}`
          }`
        }, 'Side-by-Side')
      ];

      return React.createElement('div', {
        key: 'diff-viewer-with-controls'
      }, [
        React.createElement('div', {
          key: 'diff-controls',
          className: 'flex items-center justify-between mb-4'
        }, [
          React.createElement('h4', {
            key: 'diff-title',
            className: `font-bold ${textPrimary}`
          }, 'Diff Viewer'),
          React.createElement('div', {
            key: 'view-mode-buttons',
            className: 'flex gap-2'
          }, viewModeButtons)
        ]),
        React.createElement(VersionDiff, {
          key: 'version-diff',
          oldVersion: selectedOldVersion,
          newVersion: selectedNewVersion,
          viewMode: diffViewMode,
          darkMode: darkMode
        })
      ]);
    }

    // Empty state for diff viewer
    return React.createElement('div', {
      key: 'empty-diff',
      className: `${neuInset} rounded-xl p-8 text-center`
    }, [
      React.createElement('div', {
        key: 'icon',
        className: 'text-4xl mb-4'
      }, '🔍'),
      React.createElement('div', {
        key: 'instruction',
        className: `${textSecondary} mb-2`
      }, 'Select two versions to compare'),
      React.createElement('div', {
        key: 'help-text',
        className: `${textMuted} text-sm`
      }, 'Choose an "Old" version first, then a "New" version to see the differences')
    ]);
  };

  return React.createElement(
    'div',
    { 
      className: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4',
      onClick: onClose
    },
    React.createElement(
      'div',
      { 
        className: `${neu} rounded-[24px] p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden`,
        onClick: e => e.stopPropagation()
      },
      [
        // Modal header
        React.createElement('div', {
          key: 'modal-header',
          className: 'flex items-center justify-between mb-4'
        }, [
          React.createElement('h3', {
            key: 'modal-title',
            className: `font-black ${textPrimary} text-xl`
          }, '📚 Version History & Diff Viewer'),
          React.createElement('button', {
            key: 'close-btn',
            onClick: onClose,
            className: `${neuBtn} rounded-full w-8 h-8 flex items-center justify-center text-sm ${textPrimary}`
          }, '×')
        ]),
        
        // Main content grid
        React.createElement('div', {
          key: 'content-grid',
          className: 'grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-hidden'
        }, [
          // Version List Panel
          React.createElement('div', {
            key: 'version-list-panel',
            className: 'space-y-4'
          }, [
            React.createElement('div', {
              key: 'version-list-header',
              className: 'flex items-center justify-between'
            }, [
              React.createElement('h4', {
                key: 'version-list-title',
                className: `font-bold ${textPrimary}`
              }, 'Versions'),
              selectedOldVersion && selectedNewVersion && React.createElement('button', {
                key: 'clear-selection-btn',
                onClick: onResetDiffSelection,
                className: `${neuBtn} rounded-full px-3 py-1 text-xs font-bold ${textPrimary}`
              }, 'Clear Selection')
            ]),
            React.createElement('div', {
              key: 'version-list',
              className: 'space-y-2 max-h-[50vh] overflow-y-auto'
            }, createVersionList())
          ]),
          
          // Diff Viewer Panel
          React.createElement('div', {
            key: 'diff-viewer-panel',
            className: 'space-y-4'
          }, createDiffViewer())
        ])
      ]
    )
  );
}