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

describe('App Workflow Integration Tests', () => {
  let mockDatabase;
  let mockPuter;
  let mockUser;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDatabase = {
      put: vi.fn(),
      get: vi.fn(),
      del: vi.fn()
    };

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

    mockUser = {
      username: 'testuser'
    };

    vi.mocked(require('use-fireproof').useFireproof).mockReturnValue({
      useLiveQuery: vi.fn().mockReturnValue({ docs: [] }),
      database: mockDatabase
    });
  });

  describe('Complete App Lifecycle', () => {
    it('should handle complete app lifecycle: create → update → duplicate → delete', async () => {
      const { result } = renderHook(() => useAppManagement());

      // 1. Create app
      mockPuter.ai.chat.mockResolvedValue({
        message: { content: '<!DOCTYPE html><html><head><title>Test</title></head><body>Content</body></html>' }
      });
      mockPuter.fs.mkdir.mockResolvedValue();
      mockPuter.fs.write.mockResolvedValue();
      mockPuter.hosting.create.mockResolvedValue({ subdomain: 'test-app' });
      mockPuter.apps.create.mockResolvedValue({ name: 'test-app', uid: 'app-uid' });
      mockDatabase.put.mockResolvedValue({ id: 'app-id' });
      mockDatabase.get.mockResolvedValue({
        _id: 'app-id',
        appName: 'test-app',
        version: 1
      });

      const createParams = {
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
        createdApp = await result.current.buildAndDeploy(createParams);
      });

      expect(createdApp).toBeDefined();
      expect(createdApp.version).toBe(1);

      // 2. Update app
      mockDatabase.put.mockResolvedValue();
      mockDatabase.get.mockResolvedValue({
        ...createdApp,
        version: 2
      });
      mockPuter.fs.mkdir.mockResolvedValue();
      mockPuter.fs.write.mockResolvedValue();
      mockPuter.fs.rmdir.mockResolvedValue();
      mockPuter.hosting.create.mockResolvedValue({ subdomain: 'test-app' });
      mockPuter.hosting.delete.mockResolvedValue();
      mockPuter.apps.update.mockResolvedValue();

      const updateParams = {
        selectedApp: createdApp,
        editCode: '<!DOCTYPE html><html><head><title>Updated</title></head><body>Updated Content</body></html>',
        puter: mockPuter,
        tags: ['updated']
      };

      let updatedApp;
      await act(async () => {
        updatedApp = await result.current.updateAndRedeploy(updateParams);
      });

      expect(updatedApp.version).toBe(2);

      // 3. Duplicate app
      mockDatabase.put.mockResolvedValue({ id: 'duplicated-app-id' });
      mockDatabase.get.mockResolvedValue({
        _id: 'duplicated-app-id',
        appName: 'test-app-copy',
        version: 1
      });
      mockPuter.fs.mkdir.mockResolvedValue();
      mockPuter.fs.write.mockResolvedValue();
      mockPuter.hosting.create.mockResolvedValue({ subdomain: 'test-app-copy' });
      mockPuter.apps.create.mockResolvedValue({ name: 'test-app-copy', uid: 'copy-uid' });

      const duplicateParams = {
        appToDuplicate: updatedApp,
        puter: mockPuter,
        user: mockUser
      };

      let duplicatedApp;
      await act(async () => {
        duplicatedApp = await result.current.duplicateApp(duplicateParams);
      });

      expect(duplicatedApp.appName).toBe('test-app-copy');
      expect(duplicatedApp.version).toBe(1);
      expect(duplicatedApp.views).toBe(0);

      // 4. Delete original app
      mockDatabase.del.mockResolvedValue();

      const deleteParams = {
        app: updatedApp,
        puter: mockPuter,
        versions: [{ _id: 'version-1', appId: 'app-id' }]
      };

      await act(async () => {
        await result.current.deleteApp(deleteParams);
      });

      expect(mockDatabase.del).toHaveBeenCalledWith('app-id');
    });

    it('should handle error recovery in app creation', async () => {
      const { result } = renderHook(() => useAppManagement());

      // Mock partial failure in AI chat
      mockPuter.ai.chat.mockRejectedValue(new Error('AI service temporarily unavailable'));

      const createParams = {
        prompt: 'Create a test app',
        appName: 'test-app',
        appTitle: 'Test App',
        model: 'gpt-4o',
        tags: [],
        puter: mockPuter,
        user: mockUser
      };

      await act(async () => {
        await expect(result.current.buildAndDeploy(createParams)).rejects.toThrow('AI service temporarily unavailable');
      });

      // Verify no partial data was created
      expect(mockPuter.fs.mkdir).not.toHaveBeenCalled();
      expect(mockDatabase.put).not.toHaveBeenCalled();
    });

    it('should handle concurrent operations gracefully', async () => {
      const { result } = renderHook(() => useAppManagement());

      // Setup successful responses
      mockPuter.ai.chat.mockResolvedValue({
        message: { content: '<!DOCTYPE html><html><head><title>Test</title></head><body>Content</body></html>' }
      });
      mockPuter.fs.mkdir.mockResolvedValue();
      mockPuter.fs.write.mockResolvedValue();
      mockPuter.hosting.create.mockResolvedValue({ subdomain: 'test-app' });
      mockPuter.apps.create.mockResolvedValue({ name: 'test-app', uid: 'app-uid' });
      mockDatabase.put.mockResolvedValue({ id: 'app-id' });
      mockDatabase.get.mockResolvedValue({
        _id: 'app-id',
        appName: 'test-app'
      });

      const createParams = {
        prompt: 'Create a test app',
        appName: 'test-app',
        appTitle: 'Test App',
        model: 'gpt-4o',
        tags: [],
        puter: mockPuter,
        user: mockUser
      };

      // Start multiple concurrent operations
      const promises = [
        result.current.buildAndDeploy(createParams),
        result.current.buildAndDeploy({ ...createParams, appName: 'test-app-2' }),
        result.current.buildAndDeploy({ ...createParams, appName: 'test-app-3' })
      ];

      const results = await act(async () => {
        return Promise.all(promises);
      });

      expect(results).toHaveLength(3);
      expect(results[0]).toBeDefined();
      expect(results[1]).toBeDefined();
      expect(results[2]).toBeDefined();
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across operations', async () => {
      const { result } = renderHook(() => useAppManagement());

      // Create app
      mockPuter.ai.chat.mockResolvedValue({
        message: { content: '<!DOCTYPE html><html><head><title>Test</title></head><body>Content</body></html>' }
      });
      mockPuter.fs.mkdir.mockResolvedValue();
      mockPuter.fs.write.mockResolvedValue();
      mockPuter.hosting.create.mockResolvedValue({ subdomain: 'test-app' });
      mockPuter.apps.create.mockResolvedValue({ name: 'test-app', uid: 'app-uid' });
      mockDatabase.put.mockResolvedValue({ id: 'app-id' });
      mockDatabase.get.mockResolvedValue({
        _id: 'app-id',
        appName: 'test-app',
        version: 1,
        tags: ['test']
      });

      const createParams = {
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
        createdApp = await result.current.buildAndDeploy(createParams);
      });

      // Verify app data integrity
      expect(createdApp.prompt).toBe('Create a test app');
      expect(createdApp.appName).toBe('test-app');
      expect(createdApp.appTitle).toBe('Test App');
      expect(createdApp.model).toBe('gpt-4o');
      expect(createdApp.tags).toEqual(['test']);
      expect(createdApp.version).toBe(1);
      expect(createdApp.views).toBe(0);
      expect(createdApp.favorite).toBe(false);

      // Update app
      mockDatabase.put.mockResolvedValue();
      mockDatabase.get.mockResolvedValue({
        ...createdApp,
        version: 2,
        tags: ['updated', 'test']
      });
      mockPuter.fs.mkdir.mockResolvedValue();
      mockPuter.fs.write.mockResolvedValue();
      mockPuter.fs.rmdir.mockResolvedValue();
      mockPuter.hosting.create.mockResolvedValue({ subdomain: 'test-app' });
      mockPuter.hosting.delete.mockResolvedValue();
      mockPuter.apps.update.mockResolvedValue();

      const updateParams = {
        selectedApp: createdApp,
        editCode: '<!DOCTYPE html><html><head><title>Updated</title></head><body>Updated Content</body></html>',
        puter: mockPuter,
        tags: ['updated', 'test']
      };

      let updatedApp;
      await act(async () => {
        updatedApp = await result.current.updateAndRedeploy(updateParams);
      });

      // Verify update data integrity
      expect(updatedApp.version).toBe(2);
      expect(updatedApp.tags).toEqual(['updated', 'test']);
      expect(updatedApp._id).toBe(createdApp._id); // Same app
    });
  });

  describe('Error Handling', () => {
    it('should handle filesystem errors gracefully', async () => {
      const { result } = renderHook(() => useAppManagement());

      // Mock filesystem error
      mockPuter.ai.chat.mockResolvedValue({
        message: { content: '<!DOCTYPE html><html><head><title>Test</title></head><body>Content</body></html>' }
      });
      mockPuter.fs.mkdir.mockRejectedValue(new Error('Disk full'));

      const createParams = {
        prompt: 'Create a test app',
        appName: 'test-app',
        appTitle: 'Test App',
        model: 'gpt-4o',
        tags: [],
        puter: mockPuter,
        user: mockUser
      };

      await act(async () => {
        await expect(result.current.buildAndDeploy(createParams)).rejects.toThrow('Disk full');
      });

      // Verify cleanup was attempted
      expect(mockPuter.fs.mkdir).toHaveBeenCalledWith('app_' + expect.any(String));
    });

    it('should handle hosting errors gracefully', async () => {
      const { result } = renderHook(() => useAppManagement());

      // Mock hosting error
      mockPuter.ai.chat.mockResolvedValue({
        message: { content: '<!DOCTYPE html><html><head><title>Test</title></head><body>Content</body></html>' }
      });
      mockPuter.fs.mkdir.mockResolvedValue();
      mockPuter.fs.write.mockResolvedValue();
      mockPuter.hosting.create.mockRejectedValue(new Error('Subdomain already taken'));

      const createParams = {
        prompt: 'Create a test app',
        appName: 'test-app',
        appTitle: 'Test App',
        model: 'gpt-4o',
        tags: [],
        puter: mockPuter,
        user: mockUser
      };

      await act(async () => {
        await expect(result.current.buildAndDeploy(createParams)).rejects.toThrow('Subdomain already taken');
      });

      // Verify filesystem cleanup
      expect(mockPuter.fs.rmdir).toHaveBeenCalledWith('app_' + expect.any(String));
    });

    it('should handle database errors gracefully', async () => {
      const { result } = renderHook(() => useAppManagement());

      // Mock database error
      mockPuter.ai.chat.mockResolvedValue({
        message: { content: '<!DOCTYPE html><html><head><title>Test</title></head><body>Content</body></html>' }
      });
      mockPuter.fs.mkdir.mockResolvedValue();
      mockPuter.fs.write.mockResolvedValue();
      mockPuter.hosting.create.mockResolvedValue({ subdomain: 'test-app' });
      mockPuter.apps.create.mockResolvedValue({ name: 'test-app', uid: 'app-uid' });
      mockDatabase.put.mockRejectedValue(new Error('Database connection lost'));

      const createParams = {
        prompt: 'Create a test app',
        appName: 'test-app',
        appTitle: 'Test App',
        model: 'gpt-4o',
        tags: [],
        puter: mockPuter,
        user: mockUser
      };

      await act(async () => {
        await expect(result.current.buildAndDeploy(createParams)).rejects.toThrow('Database connection lost');
      });

      // Verify cleanup
      expect(mockPuter.fs.rmdir).toHaveBeenCalledWith('app_' + expect.any(String));
      expect(mockPuter.hosting.delete).toHaveBeenCalledWith('test-app');
      expect(mockPuter.apps.delete).toHaveBeenCalledWith('test-app');
    });
  });

  describe('Performance', () => {
    it('should handle large HTML content efficiently', async () => {
      const { result } = renderHook(() => useAppManagement());

      // Create large HTML content
      const largeHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Large App</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; }
        /* Add many CSS rules */
        ${Array.from({ length: 1000 }, (_, i) => `.class-${i} { color: #${Math.random().toString(16).slice(2, 8)}; }`).join('\n')}
    </style>
</head>
<body>
    <div class="container">
        <h1>Large Application</h1>
        <!-- Add many DOM elements -->
        ${Array.from({ length: 1000 }, (_, i) => `<div class="class-${i}">Element ${i}</div>`).join('\n')}
    </div>
    <script>
        // Add large JavaScript
        ${Array.from({ length: 1000 }, (_, i) => `function function${i}() { console.log('Function ${i}'); }`).join('\n')}
    </script>
</body>
</html>`;

      mockPuter.ai.chat.mockResolvedValue({
        message: { content: largeHTML }
      });
      mockPuter.fs.mkdir.mockResolvedValue();
      mockPuter.fs.write.mockResolvedValue();
      mockPuter.hosting.create.mockResolvedValue({ subdomain: 'large-app' });
      mockPuter.apps.create.mockResolvedValue({ name: 'large-app', uid: 'app-uid' });
      mockDatabase.put.mockResolvedValue({ id: 'app-id' });
      mockDatabase.get.mockResolvedValue({
        _id: 'app-id',
        appName: 'large-app'
      });

      const createParams = {
        prompt: 'Create a large app',
        appName: 'large-app',
        appTitle: 'Large App',
        model: 'gpt-4o',
        tags: [],
        puter: mockPuter,
        user: mockUser
      };

      const startTime = Date.now();
      let createdApp;
      await act(async () => {
        createdApp = await result.current.buildAndDeploy(createParams);
      });
      const endTime = Date.now();

      expect(createdApp).toBeDefined();
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });
});