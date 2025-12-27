import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModels } from '../../hooks/useModels.js';

// Mock useFireproof
vi.mock('use-fireproof', () => ({
  useFireproof: vi.fn(() => ({
    useLiveQuery: vi.fn(() => ({
      docs: []
    })),
    database: {
      put: vi.fn(),
      get: vi.fn(),
      del: vi.fn()
    }
  }))
}));

describe('useModels Hook', () => {
  let mockDatabase;
  let mockPuter;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDatabase = {
      put: vi.fn(),
      get: vi.fn(),
      del: vi.fn()
    };

    mockPuter = {
      ai: {
        models: vi.fn()
      }
    };

    vi.mocked(require('use-fireproof').useFireproof).mockReturnValue({
      useLiveQuery: vi.fn().mockReturnValue({ docs: [] }),
      database: mockDatabase
    });
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useModels());

      expect(result.current.models).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.selectedModel).toBe('gpt-4o-mini');
    });

    it('should initialize toast function', () => {
      const { result } = renderHook(() => useModels());

      const mockToast = vi.fn();
      act(() => {
        result.current.initToast(mockToast);
      });

      expect(result.current.showToast).toBeDefined();
    });
  });

  describe('Model Management', () => {
    it('should get providers from models', () => {
      const { result } = renderHook(() => useModels());

      const mockModels = [
        { id: 'gpt-4o', provider: 'OpenAI' },
        { id: 'gpt-4o-mini', provider: 'OpenAI' },
        { id: 'claude-sonnet', provider: 'Anthropic' },
        { id: 'gemini-pro', provider: 'Google' }
      ];

      act(() => {
        result.current.setModels(mockModels);
      });

      const providers = result.current.getProviders();
      expect(providers).toEqual(['All', 'OpenAI', 'Anthropic', 'Google']);
    });

    it('should get filtered models by provider', () => {
      const { result } = renderHook(() => useModels());

      const mockModels = [
        { id: 'gpt-4o', provider: 'OpenAI', name: 'GPT-4o' },
        { id: 'gpt-4o-mini', provider: 'OpenAI', name: 'GPT-4o Mini' },
        { id: 'claude-sonnet', provider: 'Anthropic', name: 'Claude Sonnet' }
      ];

      act(() => {
        result.current.setModels(mockModels);
      });

      // Filter by OpenAI
      act(() => {
        result.current.setProvider('OpenAI');
      });

      const filtered = result.current.getFilteredModels('OpenAI');
      expect(filtered).toEqual([
        { id: 'gpt-4o', provider: 'OpenAI', name: 'GPT-4o' },
        { id: 'gpt-4o-mini', provider: 'OpenAI', name: 'GPT-4o Mini' }
      ]);
    });

    it('should get all models when provider is "All"', () => {
      const { result } = renderHook(() => useModels());

      const mockModels = [
        { id: 'gpt-4o', provider: 'OpenAI', name: 'GPT-4o' },
        { id: 'claude-sonnet', provider: 'Anthropic', name: 'Claude Sonnet' }
      ];

      act(() => {
        result.current.setModels(mockModels);
      });

      const filtered = result.current.getFilteredModels('All');
      expect(filtered).toEqual(mockModels);
    });

    it('should handle empty models array', () => {
      const { result } = renderHook(() => useModels());

      act(() => {
        result.current.setModels([]);
      });

      const providers = result.current.getProviders();
      expect(providers).toEqual(['All']);

      const filtered = result.current.getFilteredModels('All');
      expect(filtered).toEqual([]);
    });

    it('should handle models without provider', () => {
      const { result } = renderHook(() => useModels());

      const mockModels = [
        { id: 'gpt-4o', name: 'GPT-4o' },
        { id: 'gpt-4o-mini', provider: 'OpenAI', name: 'GPT-4o Mini' }
      ];

      act(() => {
        result.current.setModels(mockModels);
      });

      const providers = result.current.getProviders();
      expect(providers).toEqual(['All', 'OpenAI', '']);

      const filtered = result.current.getFilteredModels('');
      expect(filtered).toEqual([{ id: 'gpt-4o', name: 'GPT-4o' }]);
    });
  });

  describe('Model Selection', () => {
    it('should update selected model', () => {
      const { result } = renderHook(() => useModels());

      act(() => {
        result.current.setSelectedModel('gpt-4o');
      });

      expect(result.current.selectedModel).toBe('gpt-4o');
    });

    it('should update provider', () => {
      const { result } = renderHook(() => useModels());

      act(() => {
        result.current.setProvider('Anthropic');
      });

      expect(result.current.provider).toBe('Anthropic');
    });
  });

  describe('Model Fetching', () => {
    it('should fetch models successfully', async () => {
      const { result } = renderHook(() => useModels());

      const mockModels = [
        { id: 'gpt-4o', provider: 'OpenAI', name: 'GPT-4o' },
        { id: 'gpt-4o-mini', provider: 'OpenAI', name: 'GPT-4o Mini' }
      ];

      mockPuter.ai.models.mockResolvedValue(mockModels);

      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.models).toEqual(mockModels);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch models failure', async () => {
      const { result } = renderHook(() => useModels());

      const fetchError = new Error('Failed to fetch models');
      mockPuter.ai.models.mockRejectedValue(fetchError);

      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.models).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(fetchError.message);
    });

    it('should handle loading state during fetch', async () => {
      const { result } = renderHook(() => useModels());

      // Mock a delayed response
      mockPuter.ai.models.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      const fetchPromise = act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      // Should be loading during fetch
      expect(result.current.loading).toBe(true);

      await fetchPromise;

      // Should not be loading after fetch
      expect(result.current.loading).toBe(false);
    });

    it('should handle empty response from API', async () => {
      const { result } = renderHook(() => useModels());

      mockPuter.ai.models.mockResolvedValue([]);

      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.models).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle null/undefined response from API', async () => {
      const { result } = renderHook(() => useModels());

      mockPuter.ai.models.mockResolvedValue(null);

      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.models).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle Puter SDK not ready', async () => {
      const { result } = renderHook(() => useModels());

      await act(async () => {
        await expect(result.current.fetchModels(null)).rejects.toThrow('Puter SDK not ready');
      });

      expect(result.current.error).toBe('Puter SDK not ready');
    });

    it('should handle network errors', async () => {
      const { result } = renderHook(() => useModels());

      const networkError = new Error('Network error');
      mockPuter.ai.models.mockRejectedValue(networkError);

      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.error).toBe(networkError.message);
    });

    it('should handle API errors with specific messages', async () => {
      const { result } = renderHook(() => useModels());

      const apiError = new Error('API rate limit exceeded');
      mockPuter.ai.models.mockRejectedValue(apiError);

      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.error).toBe('API rate limit exceeded');
    });
  });

  describe('Data Consistency', () => {
    it('should maintain model data integrity', async () => {
      const { result } = renderHook(() => useModels());

      const mockModels = [
        { 
          id: 'gpt-4o', 
          provider: 'OpenAI', 
          name: 'GPT-4o',
          description: 'Latest GPT-4 model',
          capabilities: ['text', 'vision']
        },
        { 
          id: 'gpt-4o-mini', 
          provider: 'OpenAI', 
          name: 'GPT-4o Mini',
          description: 'Smaller, faster GPT-4 model',
          capabilities: ['text']
        }
      ];

      mockPuter.ai.models.mockResolvedValue(mockModels);

      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.models).toHaveLength(2);
      expect(result.current.models[0].id).toBe('gpt-4o');
      expect(result.current.models[0].provider).toBe('OpenAI');
      expect(result.current.models[0].name).toBe('GPT-4o');
      expect(result.current.models[1].id).toBe('gpt-4o-mini');
      expect(result.current.models[1].provider).toBe('OpenAI');
      expect(result.current.models[1].name).toBe('GPT-4o Mini');
    });

    it('should handle duplicate models gracefully', async () => {
      const { result } = renderHook(() => useModels());

      const mockModels = [
        { id: 'gpt-4o', provider: 'OpenAI', name: 'GPT-4o' },
        { id: 'gpt-4o', provider: 'OpenAI', name: 'GPT-4o' }, // Duplicate
        { id: 'gpt-4o-mini', provider: 'OpenAI', name: 'GPT-4o Mini' }
      ];

      mockPuter.ai.models.mockResolvedValue(mockModels);

      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.models).toHaveLength(3); // Should keep duplicates as-is
    });

    it('should handle models with missing fields', async () => {
      const { result } = renderHook(() => useModels());

      const mockModels = [
        { id: 'gpt-4o' }, // Missing provider and name
        { id: 'gpt-4o-mini', provider: 'OpenAI' }, // Missing name
        { id: 'claude-sonnet', name: 'Claude Sonnet' } // Missing provider
      ];

      mockPuter.ai.models.mockResolvedValue(mockModels);

      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.models).toHaveLength(3);
      expect(result.current.models[0].id).toBe('gpt-4o');
      expect(result.current.models[1].id).toBe('gpt-4o-mini');
      expect(result.current.models[2].id).toBe('claude-sonnet');
    });
  });

  describe('Performance', () => {
    it('should handle large number of models efficiently', async () => {
      const { result } = renderHook(() => useModels());

      // Create 1000 mock models
      const largeModelList = Array.from({ length: 1000 }, (_, i) => ({
        id: `model-${i}`,
        provider: `Provider-${i % 10}`,
        name: `Model ${i}`,
        description: `Description for model ${i}`
      }));

      mockPuter.ai.models.mockResolvedValue(largeModelList);

      const startTime = performance.now();
      
      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      const endTime = performance.now();
      const fetchTime = endTime - startTime;

      expect(result.current.models).toHaveLength(1000);
      expect(fetchTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle rapid model updates', async () => {
      const { result } = renderHook(() => useModels());

      const mockModels1 = [{ id: 'model-1', provider: 'Test', name: 'Model 1' }];
      const mockModels2 = [{ id: 'model-2', provider: 'Test', name: 'Model 2' }];

      mockPuter.ai.models.mockResolvedValue(mockModels1);

      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.models).toHaveLength(1);
      expect(result.current.models[0].id).toBe('model-1');

      // Update with new models
      mockPuter.ai.models.mockResolvedValue(mockModels2);

      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.models).toHaveLength(1);
      expect(result.current.models[0].id).toBe('model-2');
    });
  });

  describe('State Management', () => {
    it('should reset error state on successful fetch', async () => {
      const { result } = renderHook(() => useModels());

      // First, trigger an error
      mockPuter.ai.models.mockRejectedValue(new Error('First error'));
      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.error).toBe('First error');

      // Then successful fetch should clear error
      mockPuter.ai.models.mockResolvedValue([]);
      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.models).toEqual([]);
    });

    it('should maintain loading state consistency', async () => {
      const { result } = renderHook(() => useModels());

      // Mock a promise that resolves immediately
      mockPuter.ai.models.mockResolvedValue([]);

      await act(async () => {
        await result.current.fetchModels(mockPuter);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});