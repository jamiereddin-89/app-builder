import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppManagement } from '../../hooks/useAppManagement.js';

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

describe('useAppManagement Hook', () => {
  let mockDatabase;
  let mockUseLiveQuery;
  let mockPuter;
  let mockUser;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup mock database
    mockDatabase = {
      put: vi.fn(),
      get: vi.fn(),
      del: vi.fn()
    };

    // Setup mock useLiveQuery
    mockUseLiveQuery = vi.fn().mockReturnValue({
      docs: []
    });

    // Setup mock Puter SDK
    mockPuter = {
      ai: {
        chat: vi.fn()
      },
      fs: {
        mkdir: vi.fn(),
        write: vi.fn(),
        rmdir: vi.fn()
      },
      hosting: {
        create: vi.fn(),
        delete: vi.fn()
      },
      apps: {
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        launch: vi.fn(),
        randName: vi.fn(() => 'random-name')
      }
    };

    // Setup mock user
    mockUser = {
      username: 'testuser'
    };

    // Mock useFireproof to return our mocks
    vi.mocked(require('use-fireproof').useFireproof).mockReturnValue({
      useLiveQuery: mockUseLiveQuery,
      database: mockDatabase
    });
  });

  describe('validateHTML', () => {
    it('should validate complete HTML document', () => {
      const { result } = renderHook(() => useAppManagement());

      const validHTML = `<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>Content</body>
</html>`;

      expect(() => result.current.validateHTML(validHTML)).not.toThrow();
    });

    it('should throw error for missing DOCTYPE', () => {
      const { result } = renderHook(() => useAppManagement());

      const invalidHTML = `<html>
<head><title>Test</title></head>
<body>Content</body>
</html>`;

      expect(() => result.current.validateHTML(invalidHTML)).toThrow('HTML Validation Failed:');
      expect(() => result.current.validateHTML(invalidHTML)).toThrow('Missing DOCTYPE declaration');
    });
  });

  describe('buildAndDeploy', () => {
    it('should build and deploy app successfully', async () => {
      const { result } = renderHook(() => useAppManagement());

      // Setup mock responses
      mockPuter.ai.chat.mockResolvedValue({
        message: { content: '<!DOCTYPE html><html><head><title>Test</title></head><body>Content</body></html>' }
      });
      mockPuter.fs.mkdir.mockResolvedValue();
      mockPuter.fs.write.mockResolvedValue();
      mockPuter.hosting.create.mockResolvedValue({
        subdomain: 'test-app'
      });
      mockPuter.apps.create.mockResolvedValue({
        name: 'test-app',
        uid: 'app-uid'
      });
      mockDatabase.put.mockResolvedValue({ id: 'app-id' });
      mockDatabase.get.mockResolvedValue({
        _id: 'app-id',
        appName: 'test-app'
      });

      const params = {
        prompt: 'Create a test app',
        appName: 'test-app',
        appTitle: 'Test App',
        model: 'gpt-4o',
        tags: ['test'],
        puter: mockPuter,
        user: mockUser
      };

      let createdApp;
      await act(async () => {
        createdApp = await result.current.buildAndDeploy(params);
      });

      expect(createdApp).toBeDefined();
      expect(mockPuter.ai.chat).toHaveBeenCalledWith([
        { role: "system", content: expect.stringContaining('expert web developer') },
        { role: "user", content: "Build: Create a test app" }
      ], { model: 'gpt-4o' });
      expect(mockDatabase.put).toHaveBeenCalled();
    });

    it('should handle build errors gracefully', async () => {
      const { result } = renderHook(() => useAppManagement());

      // Mock error in AI chat
      mockPuter.ai.chat.mockRejectedValue(new Error('AI service unavailable'));

      const params = {
        prompt: 'Create a test app',
        appName: 'test-app',
        appTitle: 'Test App',
        model: 'gpt-4o',
        tags: [],
        puter: mockPuter,
        user: mockUser
      };

      await act(async () => {
        await expect(result.current.buildAndDeploy(params)).rejects.toThrow('AI service unavailable');
      });
    });

    it('should handle missing parameters', async () => {
      const { result } = renderHook(() => useAppManagement());

      const params = {
        prompt: '',
        appName: 'test-app',
        appTitle: 'Test App',
        model: 'gpt-4o',
        tags: [],
        puter: mockPuter,
        user: mockUser
      };

      await act(async () => {
        const createdApp = await result.current.buildAndDeploy(params);
        expect(createdApp).toBeUndefined();
      });
    });
  });

  describe('updateAndRedeploy', () => {
    it('should update and redeploy app successfully', async () => {
      const { result } = renderHook(() => useAppManagement());

      const mockApp = {
        _id: 'app-id',
        appName: 'test-app',
        subdomain: 'test-app',
        dir: 'app_123',
        version: 1
      };

      mockDatabase.put.mockResolvedValue();
      mockDatabase.get.mockResolvedValue(mockApp);
      mockPuter.fs.mkdir.mockResolvedValue();
      mockPuter.fs.write.mockResolvedValue();
      mockPuter.fs.rmdir.mockResolvedValue();
      mockPuter.hosting.create.mockResolvedValue({
        subdomain: 'test-app'
      });
      mockPuter.hosting.delete.mockResolvedValue();
      mockPuter.apps.update.mockResolvedValue();

      const params = {
        selectedApp: mockApp,
        editCode: '<!DOCTYPE html><html><head><title>Updated</title></head><body>Updated Content</body></html>',
        puter: mockPuter,
        tags: ['updated']
      };

      let updatedApp;
      await act(async () => {
        updatedApp = await result.current.updateAndRedeploy(params);
      });

      expect(updatedApp).toBeDefined();
      expect(mockDatabase.put).toHaveBeenCalledTimes(2); // App and version
      expect(mockPuter.apps.update).toHaveBeenCalledWith('test-app', {
        indexURL: 'https://test-app.puter.site'
      });
    });
  });

  describe('deleteApp', () => {
    it('should delete app successfully', async () => {
      const { result } = renderHook(() => useAppManagement());

      const mockApp = {
        _id: 'app-id',
        appName: 'test-app',
        subdomain: 'test-app',
        dir: 'app_123'
      };

      const mockVersions = [
        { _id: 'version-1', appId: 'app-id' },
        { _id: 'version-2', appId: 'app-id' }
      ];

      mockDatabase.del.mockResolvedValue();

      const params = {
        app: mockApp,
        puter: mockPuter,
        versions: mockVersions
      };

      await act(async () => {
        await result.current.deleteApp(params);
      });

      expect(mockPuter.fs.rmdir).toHaveBeenCalledWith('app_123');
      expect(mockPuter.apps.delete).toHaveBeenCalledWith('test-app');
      expect(mockPuter.hosting.delete).toHaveBeenCalledWith('test-app');
      expect(mockDatabase.del).toHaveBeenCalledTimes(3); // App + 2 versions
    });
  });

  describe('duplicateApp', () => {
    it('should duplicate app successfully', async () => {
      const { result } = renderHook(() => useAppManagement());

      const mockApp = {
        _id: 'app-id',
        appName: 'test-app',
        appTitle: 'Test App',
        prompt: 'Original prompt',
        code: '<!DOCTYPE html><html><head><title>Test</title></head><body>Content</body></html>',
        model: 'gpt-4o',
        tags: ['original']
      };

      mockDatabase.put.mockResolvedValue({ id: 'duplicated-app-id' });
      mockDatabase.get.mockResolvedValue({
        _id: 'duplicated-app-id',
        appName: 'test-app-copy'
      });
      mockPuter.fs.mkdir.mockResolvedValue();
      mockPuter.fs.write.mockResolvedValue();
      mockPuter.hosting.create.mockResolvedValue({
        subdomain: 'test-app-copy'
      });
      mockPuter.apps.create.mockResolvedValue({
        name: 'test-app-copy',
        uid: 'copy-uid'
      });

      const params = {
        appToDuplicate: mockApp,
        puter: mockPuter,
        user: mockUser
      };

      let duplicatedApp;
      await act(async () => {
        duplicatedApp = await result.current.duplicateApp(params);
      });

      expect(duplicatedApp).toBeDefined();
      expect(duplicatedApp.appName).toBe('test-app-copy');
      expect(duplicatedApp.appTitle).toBe('Test App-copy');
      expect(duplicatedApp.version).toBe(1);
      expect(duplicatedApp.views).toBe(0);
      expect(duplicatedApp.favorite).toBe(false);
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite status', async () => {
      const { result } = renderHook(() => useAppManagement());

      const mockApp = {
        _id: 'app-id',
        favorite: false
      };

      mockDatabase.put.mockResolvedValue();

      await act(async () => {
        await result.current.toggleFavorite(mockApp);
      });

      expect(mockDatabase.put).toHaveBeenCalledWith({
        ...mockApp,
        favorite: true
      });
    });
  });

  describe('launchApp', () => {
    it('should launch app through Puter SDK', async () => {
      const { result } = renderHook(() => useAppManagement());

      const mockApp = {
        _id: 'app-id',
        appName: 'test-app',
        hostedUrl: 'https://test-app.puter.site'
      };

      mockPuter.apps.launch.mockResolvedValue();

      await act(async () => {
        await result.current.launchApp(mockApp, mockPuter);
      });

      expect(mockPuter.apps.launch).toHaveBeenCalledWith('test-app');
    });

    it('should fallback to browser when Puter launch fails', async () => {
      const { result } = renderHook(() => useAppManagement());

      const mockApp = {
        _id: 'app-id',
        appName: 'test-app',
        hostedUrl: 'https://test-app.puter.site'
      };

      mockPuter.apps.launch.mockRejectedValue(new Error('Launch failed'));
      window.open = vi.fn();

      await act(async () => {
        await result.current.launchApp(mockApp, mockPuter);
      });

      expect(window.open).toHaveBeenCalledWith('https://test-app.puter.site', '_blank');
    });
  });

  describe('bulkDelete', () => {
    it('should delete multiple apps', async () => {
      const { result } = renderHook(() => useAppManagement());

      const selectedApps = new Set(['app-1', 'app-2']);
      const allApps = [
        { _id: 'app-1', appName: 'app1' },
        { _id: 'app-2', appName: 'app2' },
        { _id: 'app-3', appName: 'app3' }
      ];
      const allVersions = [
        { _id: 'v1', appId: 'app-1' },
        { _id: 'v2', appId: 'app-2' }
      ];

      const mockSetSelectedApps = vi.fn();
      const mockSetBulkMode = vi.fn();

      mockDatabase.del.mockResolvedValue();

      await act(async () => {
        await result.current.bulkDelete(
          selectedApps,
          allApps,
          mockPuter,
          allVersions,
          mockSetSelectedApps,
          mockSetBulkMode
        );
      });

      expect(mockSetSelectedApps).toHaveBeenCalledWith(new Set());
      expect(mockSetBulkMode).toHaveBeenCalledWith(false);
      expect(mockDatabase.del).toHaveBeenCalledTimes(4); // 2 apps + 2 versions
    });
  });

  describe('incrementViews', () => {
    it('should increment view count', async () => {
      const { result } = renderHook(() => useAppManagement());

      const mockApp = {
        _id: 'app-id',
        views: 5
      };

      mockDatabase.put.mockResolvedValue();

      await act(async () => {
        await result.current.incrementViews(mockApp);
      });

      expect(mockDatabase.put).toHaveBeenCalledWith({
        ...mockApp,
        views: 6
      });
    });
  });
});