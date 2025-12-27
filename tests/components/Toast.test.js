import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toast, ToastContainer } from '../../components/Toast.js';

describe('Toast Component', () => {
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    mockOnRemove.mockClear();
  });

  describe('Toast', () => {
    it('should render success toast correctly', () => {
      const toast = {
        id: '1',
        message: 'Operation successful',
        type: 'success'
      };

      render(<Toast toast={toast} onRemove={mockOnRemove} />);

      expect(screen.getByText('✅')).toBeInTheDocument();
      expect(screen.getByText('Operation successful')).toBeInTheDocument();
      expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('should render error toast correctly', () => {
      const toast = {
        id: '2',
        message: 'Operation failed',
        type: 'error'
      };

      render(<Toast toast={toast} onRemove={mockOnRemove} />);

      expect(screen.getByText('❌')).toBeInTheDocument();
      expect(screen.getByText('Operation failed')).toBeInTheDocument();
      expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('should render info toast correctly', () => {
      const toast = {
        id: '3',
        message: 'Information message',
        type: 'info'
      };

      render(<Toast toast={toast} onRemove={mockOnRemove} />);

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
      expect(screen.getByText('Information message')).toBeInTheDocument();
      expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('should call onRemove when close button is clicked', () => {
      const toast = {
        id: '1',
        message: 'Test message',
        type: 'success'
      };

      render(<Toast toast={toast} onRemove={mockOnRemove} />);

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      expect(mockOnRemove).toHaveBeenCalledWith('1');
    });

    it('should apply correct styles for success toast', () => {
      const toast = {
        id: '1',
        message: 'Success',
        type: 'success'
      };

      const { container } = render(<Toast toast={toast} onRemove={mockOnRemove} />);
      const toastElement = container.firstChild;

      expect(toastElement).toHaveClass('bg-green-500');
      expect(toastElement).toHaveClass('text-white');
    });

    it('should apply correct styles for error toast', () => {
      const toast = {
        id: '1',
        message: 'Error',
        type: 'error'
      };

      const { container } = render(<Toast toast={toast} onRemove={mockOnRemove} />);
      const toastElement = container.firstChild;

      expect(toastElement).toHaveClass('bg-red-500');
      expect(toastElement).toHaveClass('text-white');
    });

    it('should apply correct styles for info toast', () => {
      const toast = {
        id: '1',
        message: 'Info',
        type: 'info'
      };

      const { container } = render(<Toast toast={toast} onRemove={mockOnRemove} />);
      const toastElement = container.firstChild;

      expect(toastElement).toHaveClass('bg-[#e8e8e8]');
    });
  });

  describe('ToastContainer', () => {
    it('should not render when no toasts', () => {
      const { container } = render(<ToastContainer toasts={[]} removeToast={mockOnRemove} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('should render single toast', () => {
      const toasts = [{
        id: '1',
        message: 'Single toast',
        type: 'success'
      }];

      render(<ToastContainer toasts={toasts} removeToast={mockOnRemove} />);

      expect(screen.getByText('Single toast')).toBeInTheDocument();
      expect(screen.getByText('✅')).toBeInTheDocument();
    });

    it('should render multiple toasts', () => {
      const toasts = [
        { id: '1', message: 'First toast', type: 'success' },
        { id: '2', message: 'Second toast', type: 'error' },
        { id: '3', message: 'Third toast', type: 'info' }
      ];

      render(<ToastContainer toasts={toasts} removeToast={mockOnRemove} />);

      expect(screen.getByText('First toast')).toBeInTheDocument();
      expect(screen.getByText('Second toast')).toBeInTheDocument();
      expect(screen.getByText('Third toast')).toBeInTheDocument();
      expect(screen.getByText('✅')).toBeInTheDocument();
      expect(screen.getByText('❌')).toBeInTheDocument();
      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });

    it('should call removeToast when toast close button is clicked', () => {
      const toasts = [{
        id: '1',
        message: 'Test toast',
        type: 'success'
      }];

      render(<ToastContainer toasts={toasts} removeToast={mockOnRemove} />);

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      expect(mockOnRemove).toHaveBeenCalledWith('1');
    });

    it('should render toasts in correct order', () => {
      const toasts = [
        { id: '1', message: 'First', type: 'success' },
        { id: '2', message: 'Second', type: 'error' }
      ];

      render(<ToastContainer toasts={toasts} removeToast={mockOnRemove} />);

      const toastElements = screen.getAllByRole('button', { name: '×' });
      expect(toastElements).toHaveLength(2);
    });
  });
});