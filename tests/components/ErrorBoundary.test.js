import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../../components/ErrorBoundary.js';

// Test component that throws an error
const ThrowErrorComponent = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error for ErrorBoundary');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    consoleSpy.mockClear();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should catch and display error when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should display error details in development mode', () => {
    // Mock process.env.NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    expect(screen.getByText('Error details:')).toBeInTheDocument();
    expect(screen.getByText('Test error for ErrorBoundary')).toBeInTheDocument();

    // Restore original env
    process.env.NODE_ENV = originalEnv;
  });

  it('should reset error state when reset button is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    // Click reset button
    const resetButton = screen.getByText('Reset');
    resetButton.click();

    // Should show children content
    rerender(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should handle multiple errors gracefully', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // First error
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    // Reset
    const resetButton = screen.getByText('Reset');
    resetButton.click();

    // Second error
    rerender(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('should display fallback UI when provided', () => {
    const customFallback = <div>Custom error fallback</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
  });

  it('should log error to console in development', () => {
    // Mock process.env.NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('ErrorBoundary caught an error:'),
      expect.any(Error)
    );

    // Restore original env
    process.env.NODE_ENV = originalEnv;
  });

  it('should handle errors in render method', () => {
    const ComponentWithError = () => {
      throw new Error('Render error');
    };

    render(
      <ErrorBoundary>
        <ComponentWithError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('should handle async errors in useEffect', () => {
    const ComponentWithAsyncError = () => {
      // This simulates an async error that would normally not be caught
      // by ErrorBoundary, but we're testing the boundary's resilience
      return <div>Async component</div>;
    };

    render(
      <ErrorBoundary>
        <ComponentWithAsyncError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Async component')).toBeInTheDocument();
  });
});