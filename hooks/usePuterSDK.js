import { useState, useEffect } from 'react';

/**
 * Custom hook for managing Puter SDK initialization and user authentication
 * Handles SDK loading, user state, and authentication operations
 */
/**
 * Custom hook for managing Puter SDK initialization and user authentication
 * Handles SDK loading, user state, and authentication operations
 * @returns {Object} Hook return object with state and functions
 */
export function usePuterSDK() {
  /** @type {Object|null} Puter SDK instance or null if not loaded */
  const [puter, setPuter] = useState(null);
  /** @type {Object|null} Current user object or null if not signed in */
  const [user, setUser] = useState(null);
  /** @type {boolean} Whether Puter SDK has been successfully loaded */
  const [sdkReady, setSdkReady] = useState(false);

  /** @type {Function} Toast notification function for user feedback */
  const [showToast, setShowToast] = useState(() => (message, type = "success", duration = 3000) => {
    console.log(`Toast: ${message} (${type})`);
  });

  /**
   * Initialize the Puter SDK by loading the external script
   * Sets up SDK, handles user authentication, and manages script lifecycle
   * @returns {void}
   * @example
   * initPuterSDK()
   */
  const initPuterSDK = () => {
    // Initialize the SDK if not already loaded
    if (!sdkReady && !puter) {
      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.onload = async () => {
        setPuter(window.puter);
        setSdkReady(true);
        showToast("SDK ready!", "success");
        
        // Check if user is already signed in
        if (window.puter.auth.isSignedIn()) {
          try {
            const u = await window.puter.auth.getUser();
            setUser(u);
            showToast(`Welcome ${u.username}!`, "success");
          } catch (error) {
            console.warn("Failed to get user info:", error);
          }
        }
      };
      script.onerror = () => {
        showToast("Failed to load Puter SDK", "error");
      };
      document.body.appendChild(script);
    }
  };

  // Auto-initialize SDK when hook mounts (top-level useEffect)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.onload = async () => {
      setPuter(window.puter);
      setSdkReady(true);
      showToast("SDK ready!", "success");
      
      // Check if user is already signed in
      if (window.puter.auth.isSignedIn()) {
        try {
          const u = await window.puter.auth.getUser();
          setUser(u);
          showToast(`Welcome ${u.username}!`, "success");
        } catch (error) {
          console.warn("Failed to get user info:", error);
        }
      }
    };
    script.onerror = () => {
      showToast("Failed to load Puter SDK", "error");
    };
    document.body.appendChild(script);
    
    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src="https://js.puter.com/v2/"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  /**
   * Sign in the user through Puter authentication
   * Handles authentication flow and user state updates
   * @returns {Promise<Object>} User object after successful sign-in
   * @throws {Error} Throws error if sign-in fails
   * @example
   * const user = await signIn()
   */
  const signIn = async () => {
    if (!puter) return;
    
    try {
      await puter.auth.signIn();
      const u = await puter.auth.getUser();
      setUser(u);
      showToast(`Welcome ${u.username}!`, "success");
      return u;
    } catch (error) {
      showToast(`Sign in failed: ${error.message}`, "error");
      throw error;
    }
  };

  /**
   * Sign out the current user
   * Clears user state and handles authentication cleanup
   * @returns {Promise<void>}
   * @throws {Error} Throws error if sign-out fails
   * @example
   * await signOut()
   */
  const signOut = async () => {
    if (!puter) return;
    
    try {
      await puter.auth.signOut();
      setUser(null);
      showToast("Signed out successfully", "success");
    } catch (error) {
      showToast(`Sign out failed: ${error.message}`, "error");
      throw error;
    }
  };

  /**
   * Get current user information and refresh user state
   * Updates user state with fresh data from Puter
   * @returns {Promise<Object|null>} Current user object or null if not signed in
   * @example
   * const user = await getCurrentUser()
   */
  const getCurrentUser = async () => {
    if (!puter || !puter.auth.isSignedIn()) return null;
    
    try {
      const u = await puter.auth.getUser();
      setUser(u);
      return u;
    } catch (error) {
      console.warn("Failed to get current user:", error);
      return null;
    }
  };

  /**
   * Check if user is currently signed in
   * Verifies SDK readiness and authentication status
   * @returns {boolean} True if user is signed in, false otherwise
   * @example
   * const signedIn = isSignedIn()
   */
  const isSignedIn = () => {
    return puter && puter.auth.isSignedIn() && user;
  };

  /**
   * Initialize the toast notification function from the parent component
   * @param {Function} toastFunction - Toast notification function to set
   * @example
   * initToast(showToastFunction)
   */
  const initToast = (toastFunction) => {
    setShowToast(() => toastFunction);
  };

  return {
    // State
    puter,
    user,
    sdkReady,
    
    // Initialization
    initPuterSDK,
    initToast,
    
    // Authentication
    signIn,
    signOut,
    getCurrentUser,
    isSignedIn
  };
}