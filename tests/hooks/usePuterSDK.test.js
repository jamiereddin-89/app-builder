import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePuterSDK } from '../../hooks/usePuterSDK.js';

// Mock puter-sdk
vi.mock('puter-sdk', () => ({
  Puter: vi.fn()
}));

describe('usePuterSDK Hook', () => {
  let mockPuterInstance;
  let mockToast;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock Puter instance
    mockPuterInstance = {
      ai: {
        chat: vi.fn(),
        models: vi.fn()
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
      },
      auth: {
        signIn: vi.fn(),
        signOut: vi.fn(),
        onAuthStateChanged: vi.fn()
      },
      user: {
        username: 'testuser',
        email: 'test@example.com'
      }
    };

    // Mock Puter constructor
    vi.mocked(require('puter-sdk').Puter).mockImplementation(() => mockPuterInstance);

    // Setup mock toast function
    mockToast = vi.fn();
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => usePuterSDK());

      expect(result.current.sdkReady).toBe(false);
      expect(result.current.puter).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should initialize toast function', () => {
      const { result } = renderHook(() => usePuterSDK());

      act(() => {
        result.current.initToast(mockToast);
      });

      expect(result.current.showToast).toBeDefined();
    });
  });

  describe('SDK Initialization', () => {
    it('should initialize Puter SDK successfully', async () => {
      const { result } = renderHook(() => usePuterSDK());

      // Mock successful SDK initialization
      vi.mocked(require('puter-sdk').Puter).mockImplementation(() => mockPuterInstance);

      await act(async () => {
        await result.current.initPuterSDK();
      });

      expect(result.current.sdkReady).toBe(true);
      expect(result.current.puter).toBe(mockPuterInstance);
      expect(result.current.error).toBeNull();
    });

    it('should handle SDK initialization failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      // Mock failed SDK initialization
      const initError = new Error('SDK initialization failed');
      vi.mocked(require('puter-sdk').Puter).mockImplementation(() => {
        throw initError;
      });

      await act(async () => {
        await result.current.initPuterSDK();
      });

      expect(result.current.sdkReady).toBe(false);
      expect(result.current.puter).toBeNull();
      expect(result.current.error).toBe(initError.message);
    });
  });

  describe('Authentication', () => {
    it('should handle successful sign in', async () => {
      const { result } = renderHook(() => usePuterSDK());

      // Initialize SDK first
      await act(async () => {
        await result.current.initPuterSDK();
      });

      // Mock successful sign in
      mockPuterInstance.auth.signIn.mockResolvedValue({
        user: mockPuterInstance.user
      });

      await act(async () => {
        await result.current.signIn();
      });

      expect(result.current.user).toEqual(mockPuterInstance.user);
      expect(mockToast).toHaveBeenCalledWith('Signed in successfully!', 'success');
    });

    it('should handle sign in failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      // Initialize SDK first
      await act(async () => {
        await result.current.initPuterSDK();
      });

      // Mock failed sign in
      const signInError = new Error('Authentication failed');
      mockPuterInstance.auth.signIn.mockRejectedValue(signInError);

      await act(async () => {
        await result.current.signIn();
      });

      expect(result.current.user).toBeNull();
      expect(mockToast).toHaveBeenCalledWith(`Sign in failed: ${signInError.message}`, 'error');
    });

    it('should handle sign out', async () => {
      const { result } = renderHook(() => usePuterSDK());

      // Initialize SDK and sign in
      await act(async () => {
        await result.current.initPuterSDK();
      });

      await act(async () => {
        await result.current.signIn();
      });

      // Mock successful sign out
      mockPuterInstance.auth.signOut.mockResolvedValue();

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
      expect(mockToast).toHaveBeenCalledWith('Signed out successfully!', 'success');
    });

    it('should handle sign out failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      // Initialize SDK and sign in
      await act(async () => {
        await result.current.initPuterSDK();
      });

      await act(async () => {
        await result.current.signIn();
      });

      // Mock failed sign out
      const signOutError = new Error('Sign out failed');
      mockPuterInstance.auth.signOut.mockRejectedValue(signOutError);

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toEqual(mockPuterInstance.user); // Should still be signed in
      expect(mockToast).toHaveBeenCalledWith(`Sign out failed: ${signOutError.message}`, 'error');
    });
  });

  describe('AI Operations', () => {
    beforeEach(async () => {
      // Initialize SDK and sign in
      const { result } = renderHook(() => usePuterSDK());

      await act(async () => {
        await result.current.initPuterSDK();
      });

      await act(async () => {
        await result.current.signIn();
      });
    });

    it('should perform AI chat successfully', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const mockResponse = {
        message: { content: 'AI response content' }
      };

      mockPuterInstance.ai.chat.mockResolvedValue(mockResponse);

      const messages = [
        { role: 'system', content: 'System prompt' },
        { role: 'user', content: 'User message' }
      ];
      const options = { model: 'gpt-4o' };

      let response;
      await act(async () => {
        response = await result.current.aiChat(messages, options);
      });

      expect(response).toEqual(mockResponse);
      expect(mockPuterInstance.ai.chat).toHaveBeenCalledWith(messages, options);
    });

    it('should handle AI chat failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const chatError = new Error('AI service unavailable');
      mockPuterInstance.ai.chat.mockRejectedValue(chatError);

      const messages = [
        { role: 'system', content: 'System prompt' },
        { role: 'user', content: 'User message' }
      ];
      const options = { model: 'gpt-4o' };

      await act(async () => {
        await expect(result.current.aiChat(messages, options)).rejects.toThrow('AI service unavailable');
      });
    });

    it('should get available models', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const mockModels = [
        { id: 'gpt-4o', name: 'GPT-4o' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini' }
      ];

      mockPuterInstance.ai.models.mockResolvedValue(mockModels);

      let models;
      await act(async () => {
        models = await result.current.getModels();
      });

      expect(models).toEqual(mockModels);
      expect(mockPuterInstance.ai.models).toHaveBeenCalled();
    });

    it('should handle models fetch failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const modelsError = new Error('Failed to fetch models');
      mockPuterInstance.ai.models.mockRejectedValue(modelsError);

      await act(async () => {
        await expect(result.current.getModels()).rejects.toThrow('Failed to fetch models');
      });
    });
  });

  describe('File System Operations', () => {
    beforeEach(async () => {
      // Initialize SDK and sign in
      const { result } = renderHook(() => usePuterSDK());

      await act(async () => {
        await result.current.initPuterSDK();
      });

      await act(async () => {
        await result.current.signIn();
      });
    });

    it('should create directory successfully', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const dirName = 'test-directory';
      mockPuterInstance.fs.mkdir.mockResolvedValue();

      await act(async () => {
        await result.current.createDirectory(dirName);
      });

      expect(mockPuterInstance.fs.mkdir).toHaveBeenCalledWith(dirName);
    });

    it('should handle directory creation failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const dirName = 'test-directory';
      const mkdirError = new Error('Directory creation failed');
      mockPuterInstance.fs.mkdir.mockRejectedValue(mkdirError);

      await act(async () => {
        await expect(result.current.createDirectory(dirName)).rejects.toThrow('Directory creation failed');
      });
    });

    it('should write file successfully', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const filePath = 'test-directory/index.html';
      const content = '<!DOCTYPE html><html><body>Test</body></html>';
      mockPuterInstance.fs.write.mockResolvedValue();

      await act(async () => {
        await result.current.writeFile(filePath, content);
      });

      expect(mockPuterInstance.fs.write).toHaveBeenCalledWith(filePath, content);
    });

    it('should handle file write failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const filePath = 'test-directory/index.html';
      const content = '<!DOCTYPE html><html><body>Test</body></html>';
      const writeError = new Error('File write failed');
      mockPuterInstance.fs.write.mockRejectedValue(writeError);

      await act(async () => {
        await expect(result.current.writeFile(filePath, content)).rejects.toThrow('File write failed');
      });
    });

    it('should remove directory successfully', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const dirName = 'test-directory';
      mockPuterInstance.fs.rmdir.mockResolvedValue();

      await act(async () => {
        await result.current.removeDirectory(dirName);
      });

      expect(mockPuterInstance.fs.rmdir).toHaveBeenCalledWith(dirName);
    });

    it('should handle directory removal failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const dirName = 'test-directory';
      const rmdirError = new Error('Directory removal failed');
      mockPuterInstance.fs.rmdir.mockRejectedValue(rmdirError);

      await act(async () => {
        await expect(result.current.removeDirectory(dirName)).rejects.toThrow('Directory removal failed');
      });
    });
  });

  describe('Hosting Operations', () => {
    beforeEach(async () => {
      // Initialize SDK and sign in
      const { result } = renderHook(() => usePuterSDK());

      await act(async () => {
        await result.current.initPuterSDK();
      });

      await act(async () => {
        await result.current.signIn();
      });
    });

    it('should create hosting site successfully', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const subdomain = 'test-app';
      const directory = 'app_123';
      const mockSite = { subdomain: 'test-app', url: 'https://test-app.puter.site' };

      mockPuterInstance.hosting.create.mockResolvedValue(mockSite);

      let site;
      await act(async () => {
        site = await result.current.createHostingSite(subdomain, directory);
      });

      expect(site).toEqual(mockSite);
      expect(mockPuterInstance.hosting.create).toHaveBeenCalledWith(subdomain, directory);
    });

    it('should handle hosting site creation failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const subdomain = 'test-app';
      const directory = 'app_123';
      const hostingError = new Error('Hosting creation failed');
      mockPuterInstance.hosting.create.mockRejectedValue(hostingError);

      await act(async () => {
        await expect(result.current.createHostingSite(subdomain, directory)).rejects.toThrow('Hosting creation failed');
      });
    });

    it('should delete hosting site successfully', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const subdomain = 'test-app';
      mockPuterInstance.hosting.delete.mockResolvedValue();

      await act(async () => {
        await result.current.deleteHostingSite(subdomain);
      });

      expect(mockPuterInstance.hosting.delete).toHaveBeenCalledWith(subdomain);
    });

    it('should handle hosting site deletion failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const subdomain = 'test-app';
      const deleteError = new Error('Hosting deletion failed');
      mockPuterInstance.hosting.delete.mockRejectedValue(deleteError);

      await act(async () => {
        await expect(result.current.deleteHostingSite(subdomain)).rejects.toThrow('Hosting deletion failed');
      });
    });
  });

  describe('App Operations', () => {
    beforeEach(async () => {
      // Initialize SDK and sign in
      const { result } = renderHook(() => usePuterSDK());

      await act(async () => {
        await result.current.initPuterSDK();
      });

      await act(async () => {
        await result.current.signIn();
      });
    });

    it('should create app successfully', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const appConfig = {
        name: 'test-app',
        indexURL: 'https://test-app.puter.site',
        title: 'Test App',
        description: 'A test application'
      };

      const mockApp = { name: 'test-app', uid: 'app-uid' };
      mockPuterInstance.apps.create.mockResolvedValue(mockApp);

      let app;
      await act(async () => {
        app = await result.current.createApp(appConfig);
      });

      expect(app).toEqual(mockApp);
      expect(mockPuterInstance.apps.create).toHaveBeenCalledWith(appConfig);
    });

    it('should handle app creation failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const appConfig = {
        name: 'test-app',
        indexURL: 'https://test-app.puter.site',
        title: 'Test App',
        description: 'A test application'
      };

      const appError = new Error('App creation failed');
      mockPuterInstance.apps.create.mockRejectedValue(appError);

      await act(async () => {
        await expect(result.current.createApp(appConfig)).rejects.toThrow('App creation failed');
      });
    });

    it('should update app successfully', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const appName = 'test-app';
      const updates = { indexURL: 'https://updated-app.puter.site' };
      mockPuterInstance.apps.update.mockResolvedValue();

      await act(async () => {
        await result.current.updateApp(appName, updates);
      });

      expect(mockPuterInstance.apps.update).toHaveBeenCalledWith(appName, updates);
    });

    it('should handle app update failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const appName = 'test-app';
      const updates = { indexURL: 'https://updated-app.puter.site' };
      const updateError = new Error('App update failed');
      mockPuterInstance.apps.update.mockRejectedValue(updateError);

      await act(async () => {
        await expect(result.current.updateApp(appName, updates)).rejects.toThrow('App update failed');
      });
    });

    it('should delete app successfully', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const appName = 'test-app';
      mockPuterInstance.apps.delete.mockResolvedValue();

      await act(async () => {
        await result.current.deleteApp(appName);
      });

      expect(mockPuterInstance.apps.delete).toHaveBeenCalledWith(appName);
    });

    it('should handle app deletion failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const appName = 'test-app';
      const deleteError = new Error('App deletion failed');
      mockPuterInstance.apps.delete.mockRejectedValue(deleteError);

      await act(async () => {
        await expect(result.current.deleteApp(appName)).rejects.toThrow('App deletion failed');
      });
    });

    it('should launch app successfully', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const appName = 'test-app';
      mockPuterInstance.apps.launch.mockResolvedValue();

      await act(async () => {
        await result.current.launchApp(appName);
      });

      expect(mockPuterInstance.apps.launch).toHaveBeenCalledWith(appName);
    });

    it('should handle app launch failure', async () => {
      const { result } = renderHook(() => usePuterSDK());

      const appName = 'test-app';
      const launchError = new Error('App launch failed');
      mockPuterInstance.apps.launch.mockRejectedValue(launchError);

      await act(async () => {
        await expect(result.current.launchApp(appName)).rejects.toThrow('App launch failed');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle SDK not ready errors', async () => {
      const { result } = renderHook(() => usePuterSDK());

      // Don't initialize SDK
      const messages = [{ role: 'user', content: 'Test' }];

      await act(async () => {
        await expect(result.current.aiChat(messages)).rejects.toThrow('Puter SDK not ready');
      });
    });

    it('should handle user not authenticated errors', async () => {
      const { result } = renderHook(() => usePuterSDK());

      // Initialize SDK but don't sign in
      await act(async () => {
        await result.current.initPuterSDK();
      });

      const messages = [{ role: 'user', content: 'Test' }];

      await act(async () => {
        await expect(result.current.aiChat(messages)).rejects.toThrow('User not authenticated');
      });
    });

    it('should handle network errors gracefully', async () => {
      const { result } = renderHook(() => usePuterSDK());

      // Initialize SDK and sign in
      await act(async () => {
        await result.current.initPuterSDK();
      });

      await act(async () => {
        await result.current.signIn();
      });

      // Mock network error
      const networkError = new Error('Network error');
      mockPuterInstance.ai.chat.mockRejectedValue(networkError);

      const messages = [{ role: 'user', content: 'Test' }];

      await act(async () => {
        await expect(result.current.aiChat(messages)).rejects.toThrow('Network error');
      });
    });
  });

  describe('State Management', () => {
    it('should maintain consistent state during operations', async () => {
      const { result } = renderHook(() => usePuterSDK());

      // Initial state
      expect(result.current.sdkReady).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeNull();

      // Initialize SDK
      await act(async () => {
        await result.current.initPuterSDK();
      });

      expect(result.current.sdkReady).toBe(true);
      expect(result.current.error).toBeNull();

      // Sign in
      await act(async () => {
        await result.current.signIn();
      });

      expect(result.current.user).toEqual(mockPuterInstance.user);

      // Sign out
      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
    });

    it('should handle concurrent operations', async () => {
      const { result } = renderHook(() => usePuterSDK());

      // Initialize SDK
      await act(async () => {
        await result.current.initPuterSDK();
      });

      await act(async () => {
        await result.current.signIn();
      });

      // Mock responses
      mockPuterInstance.ai.chat.mockResolvedValue({ message: { content: 'Response' } });
      mockPuterInstance.fs.mkdir.mockResolvedValue();

      const messages = [{ role: 'user', content: 'Test' }];
      const dirName = 'test-dir';

      // Start concurrent operations
      const promises = [
        result.current.aiChat(messages),
        result.current.createDirectory(dirName)
      ];

      const results = await act(async () => {
        return Promise.all(promises);
      });

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({ message: { content: 'Response' } });
    });
  });
});