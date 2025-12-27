import React, { useState } from 'react';

/**
 * App preview component for displaying app code and live preview
 * Handles code editor integration, zoom controls, and preview modes
 * @param {Object} props - Component props
 * @param {Object} props.selectedApp - Currently selected app
 * @param {boolean} props.showCode - Whether to show code editor
 * @param {string} props.displayCode - HTML code to display
 * @param {number} props.previewZoom - Current zoom level (0.25-3.0)
 * @param {boolean} props.monacoLoading - Monaco editor loading state
 * @param {string} props.monacoError - Monaco editor error message
 * @param {Object} props.monacoEditorRef - Monaco editor reference
 * @param {boolean} props.generating - Whether app is being generated
 * @param {string} props.generationStage - Current generation stage
 * @param {boolean} props.darkMode - Dark mode theme setting
 * @param {Function} props.onSetShowVersions - Show version history
 * @param {Function} props.onGenerateShareLink - Generate share link
 * @param {Function} props.onExportSingleApp - Export single app
 * @param {Function} props.onZoomOut - Zoom out callback
 * @param {Function} props.onZoomIn - Zoom in callback
 * @param {Function} props.onResetZoom - Reset zoom callback
 * @param {Function} props.onSetShowCode - Toggle code display
 * @param {Function} props.onSetIsChatVisible - Toggle chat visibility
 * @param {boolean} props.onIsChatVisible - Chat panel visibility
 * @param {Function} props.onLaunchApp - Launch app callback
 * @param {Function} props.onUpdateAndRedeploy - Update and redeploy callback
 * @param {Function} props.onCodeChange - Code change callback for component editor
 * @param {boolean} props.monacoInitialized - Monaco initialization state
 * @returns {Object} App preview element
 * @example
 * AppPreview({
 *   selectedApp: app,
 *   showCode: true,
 *   onLaunchApp: handleLaunch
 * })
 */
export function AppPreview({
  // State
  selectedApp,
  showCode,
  displayCode,
  previewZoom,
  monacoLoading,
  monacoError,
  monacoEditorRef,
  generating,
  generationStage,
  darkMode,
  
  // Handlers
  onSetShowVersions,
  onGenerateShareLink,
  onExportSingleApp,
  onZoomOut,
  onZoomIn,
  onResetZoom,
  onSetShowCode,
  onSetIsChatVisible,
  onIsChatVisible,
  onLaunchApp,
  onUpdateAndRedeploy,
  monacoInitialized
}) {
  const neu = darkMode ? "bg-[#2a2a2a] shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]";
  const neuInset = darkMode ? "bg-[#2a2a2a] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";
  const neuBtn = darkMode ? "bg-[#2a2a2a] shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a] transition-all duration-150" : "bg-[#e8e8e8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-150";
  const neuBtnBlack = darkMode ? "bg-[#1a1a1a] text-white shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#000,inset_-4px_-4px_8px_#333] transition-all duration-150" : "bg-[#1a1a1a] text-white shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#000,inset_-4px_-4px_8px_#333] transition-all duration-150";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  const textSecondary = darkMode ? "text-[#cccccc]" : "text-[#666]";

  // Component editor state
  const [showComponentEditor, setShowComponentEditor] = useState(false);

  // Create toolbar buttons for selected app
  const appButtons = selectedApp ? [
    React.createElement('button', {
      key: 'versions-btn',
      onClick: onSetShowVersions,
      className: `${neuBtn} rounded-full px-3 py-2 font-bold text-xs ${textPrimary}`
    }, '📚'),
    React.createElement('button', {
      key: 'share-btn',
      onClick: () => onGenerateShareLink(selectedApp),
      className: `${neuBtn} rounded-full px-3 py-2 font-bold text-xs ${textPrimary}`
    }, '🔗'),
    React.createElement('button', {
      key: 'export-btn',
      onClick: () => onExportSingleApp(selectedApp),
      className: `${neuBtn} rounded-full px-3 py-2 font-bold text-xs ${textPrimary}`
    }, '📤'),
    // Zoom controls
    React.createElement('div', {
      key: 'zoom-controls',
      className: `${neuInset} rounded-full px-3 py-2 flex items-center gap-2`
    }, [
      React.createElement('button', {
        key: 'zoom-out',
        onClick: onZoomOut,
        disabled: previewZoom <= 0.25,
        className: `${neuBtn} rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ${textPrimary} disabled:opacity-50`
      }, '-'),
      React.createElement('span', {
        key: 'zoom-display',
        className: `font-mono text-xs ${textPrimary} min-w-[3rem] text-center`
      }, `${Math.round(previewZoom * 100)}%`),
      React.createElement('button', {
        key: 'zoom-in',
        onClick: onZoomIn,
        disabled: previewZoom >= 3.0,
        className: `${neuBtn} rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ${textPrimary} disabled:opacity-50`
      }, '+'),
      React.createElement('button', {
        key: 'zoom-reset',
        onClick: onResetZoom,
        className: `${neuBtn} rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ${textPrimary}`
      }, '⌂')
    ])
  ] : [];

  // Create main action buttons
  const mainButtons = [
    React.createElement('button', {
      key: 'code-toggle-btn',
      onClick: () => onSetShowCode(!showCode),
      disabled: !displayCode,
      className: `${neuBtn} rounded-full px-4 py-2 font-bold text-xs ${textPrimary} disabled:opacity-50`
    }, showCode ? "Preview" : "</>"),
    React.createElement('button', {
      key: 'component-editor-btn',
      onClick: () => setShowComponentEditor(!showComponentEditor),
      disabled: !displayCode,
      className: `${neuBtn} rounded-full px-4 py-2 font-bold text-xs ${showComponentEditor ? "bg-[#dc2626] text-white" : textPrimary} disabled:opacity-50`
    }, '🎨'),
    React.createElement('button', {
      key: 'chat-toggle-btn',
      onClick: () => onSetIsChatVisible(!onIsChatVisible),
      className: `${neuBtn} rounded-full px-4 py-2 font-bold text-xs ${onIsChatVisible ? "bg-[#22c55e] text-white" : textPrimary} disabled:opacity-50`
    }, '💬')
  ];

  // Add app-specific buttons
  if (selectedApp) {
    mainButtons.push(
      React.createElement('button', {
        key: 'launch-btn',
        onClick: (e) => onLaunchApp(selectedApp, e),
        className: `${neuBtnBlack} rounded-full px-4 py-2 font-bold text-xs`
      }, 'Launch')
    );
  }

  if (selectedApp && displayCode) {
    mainButtons.push(
      React.createElement('button', {
        key: 'redeploy-btn',
        onClick: onUpdateAndRedeploy,
        disabled: generating,
        className: `bg-[#dc2626] text-white rounded-full px-4 py-2 font-bold text-xs disabled:opacity-50`
      }, 'Redeploy')
    );
  }

  // Create preview content based on mode
  const createPreviewContent = () => {
    if (showComponentEditor && displayCode) {
      // Component Editor view
      return React.createElement(ComponentEditor, {
        htmlCode: displayCode,
        onCodeChange: (newCode) => {
          if (onCodeChange) onCodeChange(newCode);
        },
        darkMode: darkMode
      });
    }

    if (showCode && displayCode) {
      if (monacoLoading) {
        return React.createElement('div', {
          key: 'loading',
          className: 'h-full flex items-center justify-center'
        }, React.createElement('div', {
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'spinner',
            className: `w-16 h-16 mx-auto mb-4 rounded-full ${neuInset} flex items-center justify-center animate-spin`
          }, React.createElement('span', { className: 'text-2xl' }, '⚙️')),
          React.createElement('div', {
            key: 'text',
            className: `font-black ${textPrimary} text-lg`
          }, 'Loading Editor...')
        ]));
      }

      if (monacoError) {
        return React.createElement('div', {
          key: 'error',
          className: 'h-full flex items-center justify-center'
        }, React.createElement('div', {
          className: 'text-center'
        }, [
          React.createElement('div', {
            key: 'icon',
            className: `w-16 h-16 mx-auto mb-4 rounded-full ${neuInset} flex items-center justify-center`
          }, React.createElement('span', { className: 'text-2xl' }, '⚠️')),
          React.createElement('div', {
            key: 'title',
            className: `font-black ${textPrimary} text-lg mb-2`
          }, 'Editor Error'),
          React.createElement('div', {
            key: 'message',
            className: `${textSecondary} text-sm mb-4`
          }, monacoError),
          React.createElement('button', {
            key: 'back-btn',
            onClick: () => onSetShowCode(false),
            className: `${neuBtn} rounded-xl px-4 py-2 font-bold ${textPrimary} text-sm`
          }, 'Back to Preview')
        ]));
      }

      // Monaco Editor view
      return React.createElement('div', {
        key: 'editor',
        className: 'relative h-full'
      }, [
        React.createElement('div', {
          key: 'monaco-container',
          id: 'monaco-editor',
          className: 'w-full h-full',
          ref: monacoEditorRef
        }),
        React.createElement('div', {
          key: 'char-count',
          className: 'absolute bottom-2 right-2 text-[#666] text-xs'
        }, `${(displayCode || "").length} chars`)
      ]);
    }

    if (displayCode) {
      // Preview iframe
      return React.createElement('div', {
        key: 'preview',
        className: 'w-full h-full overflow-auto',
        style: {
          transform: `scale(${previewZoom})`,
          transformOrigin: 'top left',
          transition: 'transform 0.2s ease-in-out'
        }
      }, React.createElement('iframe', {
        srcDoc: displayCode,
        className: 'w-full h-full border-0',
        sandbox: "allow-scripts allow-forms allow-modals allow-popups",
        onLoad: (e) => {
          try {
            const iframeDoc = e.target?.contentDocument;
            if (iframeDoc) {
              iframeDoc.documentElement.setAttribute('data-sandboxed', 'true');
            }
          } catch (error) {
            console.warn('Cannot access iframe document:', error);
          }
        },
        style: {
          width: `${100 / previewZoom}%`,
          height: `${100 / previewZoom}%`,
          minWidth: `${100 / previewZoom}%`,
          minHeight: `${100 / previewZoom}%`
        }
      }));
    }

    // Empty state
    return React.createElement('div', {
      key: 'empty',
      className: 'h-full flex items-center justify-center'
    }, React.createElement('div', {
      className: 'text-center'
    }, [
      React.createElement('div', {
        key: 'icon',
        className: generating 
          ? `w-20 h-20 mx-auto mb-4 rounded-full ${neuInset} flex items-center justify-center`
          : `w-20 h-20 mx-auto mb-4 rounded-full ${neu} flex items-center justify-center`
      }, React.createElement('span', { 
        key: 'icon-symbol',
        className: generating ? 'text-3xl animate-spin' : 'text-3xl'
      }, generating ? '⚙️' : '📱')),
      React.createElement('div', {
        key: 'title',
        className: `font-black ${textPrimary} text-lg`
      }, generating ? "BUILDING..." : "APP PREVIEW"),
      generating && generationStage && React.createElement('div', {
        key: 'stage',
        className: `${textSecondary} text-sm mt-2`
      }, generationStage),
      !generating && React.createElement('div', {
        key: 'instruction',
        className: `${textSecondary} text-sm mt-2`
      }, 'Build or select an app')
    ]));
  };

  return React.createElement(
    'div',
    { className: `${neu} rounded-[24px] overflow-hidden` },
    [
      // Header toolbar
      React.createElement('div', {
        key: 'toolbar',
        className: 'bg-[#1a1a1a] p-4 flex items-center justify-between flex-wrap gap-3'
      }, [
        // Left side - app info and traffic lights
        React.createElement('div', {
          key: 'left-side',
          className: 'flex items-center gap-3'
        }, [
          React.createElement('div', {
            key: 'traffic-lights',
            className: 'flex gap-2'
          }, [
            React.createElement('div', { key: 'red', className: 'w-3 h-3 rounded-full bg-[#dc2626]' }),
            React.createElement('div', { key: 'yellow', className: 'w-3 h-3 rounded-full bg-[#fbbf24]' }),
            React.createElement('div', { key: 'green', className: 'w-3 h-3 rounded-full bg-[#22c55e]' })
          ]),
          React.createElement('span', {
            key: 'app-title',
            className: 'text-white font-black text-sm'
          }, selectedApp?.appTitle || selectedApp?.appName || "PREVIEW"),
          selectedApp && React.createElement('span', {
            key: 'app-version',
            className: 'text-[#cccccc] text-xs'
          }, `v${selectedApp.version || 1}`)
        ]),
        // Right side - buttons
        React.createElement('div', {
          key: 'right-side',
          className: 'flex gap-2 flex-wrap'
        }, [
          ...(selectedApp ? appButtons : []),
          ...mainButtons
        ])
      ]),
      
      // Preview/content area
      React.createElement('div', {
        key: 'content-area',
        className: 'h-[480px] bg-white'
      }, createPreviewContent())
    ]
  );
}