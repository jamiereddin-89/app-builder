import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRecovery = () => {
    // Reset error state to attempt recovery
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Create elements for the fallback UI
      const headerSection = React.createElement(
        'div',
        { className: 'flex items-center gap-4 mb-4' },
        [
          React.createElement('div', {
            key: 'icon',
            className: 'w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'
          }, React.createElement('span', { className: 'text-2xl' }, '🚨')),
          React.createElement('div', { key: 'text' }, [
            React.createElement('h1', {
              key: 'title',
              className: 'text-2xl font-bold text-gray-900'
            }, 'Something went wrong'),
            React.createElement('p', {
              key: 'description',
              className: 'text-gray-600'
            }, 'The application encountered an unexpected error.')
          ])
        ]
      );

      const errorDetailsSection = React.createElement('div', {
        className: 'bg-gray-50 rounded-lg p-4 mb-4'
      }, [
        React.createElement('h2', {
          key: 'error-details-title',
          className: 'font-semibold text-gray-900 mb-2'
        }, 'Error Details:'),
        React.createElement('div', {
          key: 'error-content',
          className: 'text-sm text-gray-700 font-mono bg-white p-3 rounded border'
        }, [
          React.createElement('div', {
            key: 'error-message',
            className: 'mb-2'
          }, [
            React.createElement('strong', null, 'Error: '),
            this.state.error?.message || 'Unknown error'
          ]),
          React.createElement('div', {
            key: 'component-stack-label',
            className: 'mb-2'
          }, React.createElement('strong', null, 'Component Stack:')),
          React.createElement('pre', {
            key: 'component-stack',
            className: 'whitespace-pre-wrap overflow-auto max-h-32'
          }, this.state.errorInfo?.componentStack || 'No component stack available')
        ])
      ]);

      const actionButtons = React.createElement('div', {
        className: 'flex gap-3'
      }, [
        React.createElement('button', {
          key: 'recovery-btn',
          onClick: this.handleRecovery,
          className: 'flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
        }, 'Try to Recover'),
        React.createElement('button', {
          key: 'reload-btn',
          onClick: () => window.location.reload(),
          className: 'flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors'
        }, 'Reload Page')
      ]);

      const footerNote = React.createElement('div', {
        className: 'mt-4 text-xs text-gray-500'
      }, 'The error has been logged to the console for debugging purposes.');

      // Fallback UI with error details
      return React.createElement(
        'div',
        { className: 'min-h-screen bg-gray-50 flex items-center justify-center p-4' },
        React.createElement(
          'div',
          { className: 'max-w-2xl w-full bg-white rounded-lg shadow-lg p-6' },
          [headerSection, errorDetailsSection, actionButtons, footerNote]
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;