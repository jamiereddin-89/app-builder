import React from 'react';

/**
 * Share modal component for generating and displaying app sharing options
 * Provides share link, QR code generation, and download functionality
 * @param {Object} props - Component props
 * @param {boolean} props.showShareModal - Whether modal is visible
 * @param {string} props.shareLink - App share URL
 * @param {string} props.qrCodeDataURL - Generated QR code data URL
 * @param {boolean} props.isGeneratingQR - QR code generation state
 * @param {boolean} props.darkMode - Dark mode theme setting
 * @param {Function} props.onClose - Close modal callback
 * @param {Function} props.onCopyShareLink - Copy share link callback
 * @param {Function} props.onDownloadQRCode - Download QR code callback
 * @returns {Object|null} Share modal element or null if hidden
 * @example
 * ShareModal({
 *   showShareModal: true,
 *   shareLink: appUrl,
 *   onCopyShareLink: handleCopy
 * })
 */
export function ShareModal({
  // State
  showShareModal,
  shareLink,
  qrCodeDataURL,
  isGeneratingQR,
  darkMode,
  
  // Handlers
  onClose,
  onCopyShareLink,
  onDownloadQRCode
}) {
  const neu = darkMode ? "bg-[#2a2a2a] shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]";
  const neuInset = darkMode ? "bg-[#2a2a2a] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";
  const neuBtn = darkMode ? "bg-[#2a2a2a] shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a] transition-all duration-150" : "bg-[#e8e8e8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-150";
  const neuBtnRed = darkMode ? "bg-[#dc2626] text-white shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#b91c1c,inset_-4px_-4px_8px_#ef4444] transition-all duration-150" : "bg-[#dc2626] text-white shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#b91c1c,inset_-4px_-4px_8px_#ef4444] transition-all duration-150";
  const neuBtnBlack = darkMode ? "bg-[#1a1a1a] text-white shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#000,inset_-4px_-4px_8px_#333] transition-all duration-150" : "bg-[#1a1a1a] text-white shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#000,inset_-4px_-4px_8px_#333] transition-all duration-150";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  const textSecondary = darkMode ? "text-[#cccccc]" : "text-[#666]";
  const textMuted = darkMode ? "text-[#888]" : "text-[#888]";

  if (!showShareModal) return null;

  // Create QR code section content
  const createQRCodeSection = () => {
    if (isGeneratingQR) {
      return React.createElement('div', {
        key: 'generating',
        className: 'flex flex-col items-center py-8'
      }, [
        React.createElement('div', {
          key: 'spinner',
          className: `w-12 h-12 mx-auto mb-3 rounded-full ${neuInset} flex items-center justify-center animate-spin`
        }, React.createElement('span', { className: 'text-xl' }, '⚙️')),
        React.createElement('div', {
          key: 'text',
          className: `${textSecondary} text-sm`
        }, 'Generating QR Code...')
      ]);
    }

    if (qrCodeDataURL) {
      return React.createElement('div', {
        key: 'qr-code',
        className: 'text-center'
      }, [
        React.createElement('img', {
          key: 'qr-image',
          src: qrCodeDataURL,
          alt: 'QR Code for app sharing',
          className: 'mx-auto mb-3 border-2 border-gray-200 rounded-lg',
          style: { width: '200px', height: '200px' }
        }),
        React.createElement('button', {
          key: 'download-btn',
          onClick: onDownloadQRCode,
          className: `${neuBtn} rounded-xl py-2 px-4 font-bold ${textPrimary} text-sm flex items-center gap-2 mx-auto`
        }, '💾 Download QR Code')
      ]);
    }

    return React.createElement('div', {
      key: 'error',
      className: `${textMuted} text-center py-4`
    }, [
      React.createElement('div', { key: 'icon', className: 'text-2xl mb-2' }, '⚠️'),
      React.createElement('div', { key: 'text', className: 'text-sm' }, 'Failed to generate QR code')
    ]);
  };

  // Create action buttons
  const actionButtons = [
    React.createElement('button', {
      key: 'copy-btn',
      onClick: onCopyShareLink,
      className: `flex-1 ${neuBtnRed} rounded-xl py-3 font-bold`
    }, '📋 Copy Link'),
    React.createElement('button', {
      key: 'close-btn',
      onClick: onClose,
      className: `flex-1 ${neuBtnBlack} rounded-xl py-3 font-bold`
    }, 'Close')
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
        }, '🔗 Share App'),
        
        // Share Link Section
        React.createElement('div', {
          key: 'share-link-section',
          className: `${neuInset} rounded-xl p-3 mb-4`
        }, React.createElement('input', {
          value: shareLink,
          readOnly: true,
          className: `w-full bg-transparent text-xs font-mono ${textPrimary} outline-none`
        })),
        
        // QR Code Section
        React.createElement('div', {
          key: 'qr-section',
          className: 'mb-4'
        }, [
          React.createElement('h4', {
            key: 'qr-title',
            className: `font-bold ${textPrimary} text-sm mb-3 flex items-center gap-2`
          }, [
            '📱 Mobile QR Code',
            React.createElement('span', {
              key: 'qr-subtitle',
              className: `${textSecondary} text-xs`
            }, '(Scan to open on mobile)')
          ]),
          React.createElement('div', {
            key: 'qr-container',
            className: `${neuInset} rounded-xl p-4 flex flex-col items-center`
          }, createQRCodeSection())
        ]),
        
        // Action Buttons
        React.createElement('div', {
          key: 'action-buttons',
          className: 'flex gap-3'
        }, actionButtons)
      ]
    )
  );
}