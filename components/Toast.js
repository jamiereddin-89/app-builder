import React from 'react';

/**
 * Individual toast notification component
 * Displays a single notification with type-based styling and dismiss functionality
 * @param {Object} toast - Toast notification object
 * @param {string} toast.id - Unique toast identifier
 * @param {string} toast.message - Notification message text
 * @param {string} toast.type - Notification type ('success', 'error', 'info')
 * @param {Function} onRemove - Function to dismiss the toast
 * @returns {JSX.Element} Toast notification element
 * @example
 * <Toast toast={toastData} onRemove={removeToast} />
 */
export function Toast({ toast, onRemove }) {
  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";
  
  const toastStyles = isSuccess
    ? "bg-green-500 text-white shadow-[inset_2px_2px_4px_#16a34a,inset_-2px_-2px_4px_#22c55e]"
    : isError
    ? "bg-red-500 text-white shadow-[inset_2px_2px_4px_#dc2626,inset_-2px_-2px_4px_#ef4444]"
    : "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";
  
  const icon = isSuccess ? "✅" : isError ? "❌" : "ℹ️";
  
  return React.createElement(
    'div',
    {
      className: `${toastStyles} rounded-2xl p-4 mb-3 flex items-center gap-3 transform transition-all duration-300 ease-in-out animate-in slide-in-from-right-full`,
      style: {
        animation: 'slideIn 0.3s ease-out forwards'
      }
    },
    [
      React.createElement('span', { key: 'icon', className: 'text-xl' }, icon),
      React.createElement('span', { key: 'message', className: 'flex-1 font-medium' }, toast.message),
      React.createElement('button', {
        key: 'close-btn',
        onClick: () => onRemove(toast.id),
        className: 'text-white hover:text-gray-200 transition-colors text-xl leading-none'
      }, '×')
    ]
  );
}

/**
 * Container component for managing multiple toast notifications
 * Handles rendering and positioning of toast list
 * @param {Array<Object>} toasts - Array of toast notification objects
 * @param {Function} removeToast - Function to remove a specific toast
 * @returns {JSX.Element|null} Toast container element or null if no toasts
 * @example
 * <ToastContainer toasts={toastList} removeToast={removeToast} />
 */
export function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;
  
  return React.createElement(
    'div',
    { className: 'fixed top-4 right-4 z-50 max-w-sm w-full space-y-2' },
    toasts.map(toast =>
      React.createElement(Toast, {
        key: toast.id,
        toast: toast,
        onRemove: removeToast
      })
    )
  );
}