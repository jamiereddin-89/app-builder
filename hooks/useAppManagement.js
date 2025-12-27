import { useState } from 'react';
import { useFireproof } from 'use-fireproof';

/**
 * Custom hook for managing app CRUD operations
 * Handles creating, reading, updating, and deleting apps with Puter SDK integration
 */
/**
 * Custom hook for managing app CRUD operations
 * Handles creating, reading, updating, and deleting apps with Puter SDK integration
 * @returns {Object} Hook return object with state and functions
 */
export function useAppManagement() {
  const { useLiveQuery, database } = useFireproof("puter-apps-v6");
  const { docs: apps } = useLiveQuery("type", { key: "app", descending: true });
  const { docs: versions } = useLiveQuery("type", { key: "version", descending: true });

  /** @type {boolean} Whether an app is currently being generated */
  const [generating, setGenerating] = useState(false);
  /** @type {string} Current stage of app generation process */
  const [generationStage, setGenerationStage] = useState("");
  /** @type {Function} Toast notification function for user feedback */
  const [showToast, setShowToast] = useState(() => (message, type = "success", duration = 3000) => {
    // This will be overridden by the component that uses this hook
    console.log(`Toast: ${message} (${type})`);
  });

  /**
   * Initialize the toast notification function from the parent component
   * @param {Function} toastFunction - Toast notification function to set
   */
  const initToast = (toastFunction) => {
    setShowToast(() => toastFunction);
  };

  /**
   * Validates HTML code structure for completeness and correctness
   * Checks for required HTML elements and proper document structure
   * @param {string} code - HTML code to validate
   * @throws {Error} Throws error with validation details if HTML is invalid
   * @example
   * validateHTML('<!DOCTYPE html><html><head></head><body>Hello</body></html>')
   * // Returns without error
   */
  const validateHTML = (code) => {
    const errors = [];
    if (!code.toLowerCase().includes("<!doctype html>")) {
      errors.push("Missing DOCTYPE declaration. HTML must start with <!DOCTYPE html>");
    }
    if (!/<html[^>]*>/i.test(code)) {
      errors.push("Missing <html> opening tag");
    }
    if (!/<\/html>/i.test(code)) {
      errors.push("Missing </html> closing tag");
    }
    if (!/<head[^>]*>/i.test(code)) {
      errors.push("Missing <head> opening tag");
    }
    if (!/<\/head>/i.test(code)) {
      errors.push("Missing </head> closing tag");
    }
    if (!/<body[^>]*>/i.test(code)) {
      errors.push("Missing <body> opening tag");
    }
    if (!/<\/body>/i.test(code)) {
      errors.push("Missing </body> closing tag");
    }
    if (errors.length > 0) {
      throw new Error("HTML Validation Failed:\n" + errors.join("\n"));
    }
  };

  /**
   * Build and deploy a new app using AI model and Puter SDK
   * Creates filesystem, deploys to hosting, and registers as Puter app
   * @param {Object} params - Parameters for app building
   * @param {string} params.prompt - App description and requirements
   * @param {string} params.appName - Unique app identifier
   * @param {string} params.appTitle - Human-readable app title
   * @param {string} params.model - AI model to use for generation
   * @param {Array<string>} params.tags - Optional app tags
   * @param {Object} params.puter - Puter SDK instance
   * @param {Object} params.user - Current user object
   * @returns {Promise<Object>} Created app document from database
   * @throws {Error} Throws error if build process fails
   * @example
   * await buildAndDeploy({
   *   prompt: 'Create a calculator app',
   *   appName: 'my-calculator',
   *   appTitle: 'Calculator App',
   *   model: 'gpt-4o',
   *   tags: ['calculator', 'math'],
   *   puter: puterSDK,
   *   user: currentUser
   * })
   */
  const buildAndDeploy = async (params) => {
    const { prompt, appName, appTitle, model, tags, puter, user } = params;
    
    if (!prompt?.trim() || !puter || !user) return;
    setGenerating(true);
    setGenerationStage("Initializing...");
    
    try {
      setGenerationStage(`Model: ${model}`);
      
      const systemPrompt = `You are an expert web developer. Create a COMPLETE single HTML file app.
RULES:
- Start with <!DOCTYPE html>
- ALL CSS in <style> tag, ALL JS in <script> tag
- Modern CSS: variables, flexbox/grid, animations, gradients
- Modern JS: ES6+, localStorage, event handling
- Responsive and polished UI
- NO external dependencies
- Return ONLY HTML code`;

      const res = await puter.ai.chat([
        { role: "system", content: systemPrompt },
        { role: "user", content: `Build: ${prompt}` }
      ], { model });

      let code = res?.message?.content || res?.text || res?.content || String(res);
      code = code.replace(/```html?\n?/gi, "").replace(/```\n?/g, "").trim();
      const start = code.search(/<!doctype\s+html>/i);
      if (start > 0) code = code.slice(start);
      validateHTML(code);

      setGenerationStage("Creating filesystem...");
      const dirName = `app_${Date.now()}`;
      await puter.fs.mkdir(dirName);
      await puter.fs.write(`${dirName}/index.html`, code);

      setGenerationStage("Deploying...");
      const subdomain = appName.trim().toLowerCase().replace(/[^a-z0-9-]/g, "") || puter.randName();
      const site = await puter.hosting.create(subdomain, dirName);
      const hostedUrl = `https://${site.subdomain}.puter.site`;

      setGenerationStage("Registering app...");
      const finalAppName = appName.trim() || puter.randName();
      const finalAppTitle = appTitle.trim() || prompt.slice(0, 50);
      
      let puterApp;
      try {
        puterApp = await puter.apps.create({
          name: finalAppName,
          indexURL: hostedUrl,
          title: finalAppTitle,
          description: prompt,
          maximizeOnStart: true,
          dedupeName: true
        });
      } catch (appErr) {
        const randomName = puter.randName();
        puterApp = await puter.apps.create({
          name: randomName,
          indexURL: hostedUrl,
          title: finalAppTitle,
          description: prompt,
          maximizeOnStart: true
        });
      }

      setGenerationStage("Saving to database...");
      const doc = await database.put({
        type: "app",
        prompt,
        code,
        subdomain: site.subdomain,
        hostedUrl,
        appName: puterApp.name,
        appUid: puterApp.uid,
        appTitle: finalAppTitle,
        model,
        dir: dirName,
        createdAt: Date.now(),
        views: 0,
        favorite: false,
        tags: tags || [],
        version: 1
      });

      // Save initial version
      await database.put({
        type: "version",
        appId: doc.id,
        code,
        version: 1,
        createdAt: Date.now(),
        note: "Initial version"
      });

      setGenerationStage("");
      showToast("App created and deployed successfully!", "success");
      window.open(hostedUrl, "_blank");

      return await database.get(doc.id);

    } catch (err) {
      setGenerationStage("");
      showToast(`Error: ${err.message}`, "error");
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  /**
   * Update and redeploy an existing app with new code
   * Updates hosting, app registration, and saves version history
   * @param {Object} params - Parameters for app update
   * @param {Object} params.selectedApp - Existing app to update
   * @param {string} params.editCode - New HTML code for the app
   * @param {Object} params.puter - Puter SDK instance
   * @param {Array<string>} params.tags - Optional updated tags
   * @returns {Promise<Object>} Updated app document from database
   * @throws {Error} Throws error if update process fails
   * @example
   * await updateAndRedeploy({
   *   selectedApp: currentApp,
   *   editCode: newHTMLCode,
   *   puter: puterSDK,
   *   tags: ['updated', 'calculator']
   * })
   */
  const updateAndRedeploy = async (params) => {
    const { selectedApp, editCode, puter, tags } = params;
    
    if (!selectedApp || !editCode || !puter) return;
    setGenerating(true);
    
    try {
      // Cleanup old directory
      if (selectedApp.dir) {
        try {
          await puter.fs.rmdir(selectedApp.dir);
        } catch (e) {
          // Directory already removed or not found
        }
      }

      const dirName = `app_${Date.now()}`;
      await puter.fs.mkdir(dirName);
      await puter.fs.write(`${dirName}/index.html`, editCode);
      
      try { await puter.hosting.delete(selectedApp.subdomain); } catch (e) {}
      const site = await puter.hosting.create(selectedApp.subdomain, dirName);
      const hostedUrl = `https://${site.subdomain}.puter.site`;
      
      if (selectedApp.appName) {
        try {
          await puter.apps.update(selectedApp.appName, { indexURL: hostedUrl });
        } catch (e) {}
      }

      const newVersion = (selectedApp.version || 1) + 1;
      
      // Save version history
      await database.put({
        type: "version",
        appId: selectedApp._id,
        code: editCode,
        version: newVersion,
        createdAt: Date.now(),
        note: `Version ${newVersion}`
      });
      
      await database.put({
        ...selectedApp,
        code: editCode,
        dir: dirName,
        hostedUrl,
        updatedAt: Date.now(),
        version: newVersion,
        tags: tags || selectedApp.tags
      });
      
      showToast(`App updated to version ${newVersion}!`, "success");
      window.open(hostedUrl, "_blank");

      return await database.get(selectedApp._id);
      
    } catch (err) {
      showToast(`Update failed: ${err.message}`, "error");
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  /**
   * Delete an app and clean up all associated resources
   * Removes from filesystem, hosting, Puter apps, and database
   * @param {Object} params - Parameters for app deletion
   * @param {Object} params.app - App to delete
   * @param {Object} params.puter - Puter SDK instance
   * @param {Array} params.versions - All app versions for cleanup
   * @returns {Promise<void>}
   * @throws {Error} Throws error if deletion fails
   * @example
   * await deleteApp({
   *   app: appToDelete,
   *   puter: puterSDK,
   *   versions: appVersions
   * })
   */
  const deleteApp = async (params) => {
    const { app, puter, versions } = params;
    
    try {
      // Cleanup directory
      if (app.dir) {
        try {
          await puter.fs.rmdir(app.dir);
        } catch (e) {
          // Directory already removed or not found
        }
      }
      
      if (app.appName) {
        try { await puter.apps.delete(app.appName); } catch (e) {}
      }
      if (app.subdomain) {
        try { await puter.hosting.delete(app.subdomain); } catch (e) {}
      }
      
      // Delete versions
      const appVersions = versions.filter(v => v.appId === app._id);
      for (const v of appVersions) {
        await database.del(v._id);
      }
      
      await database.del(app._id);
      showToast("App deleted successfully!", "success");
      
    } catch (e) {
      showToast(`Delete failed: ${e.message}`, "error");
      throw e;
    }
  };

  /**
   * Create a duplicate of an existing app
   * Generates new names, deploys copy, and initializes version history
   * @param {Object} params - Parameters for app duplication
   * @param {Object} params.appToDuplicate - App to duplicate
   * @param {Object} params.puter - Puter SDK instance
   * @param {Object} params.user - Current user object
   * @returns {Promise<Object>} Duplicated app document from database
   * @throws {Error} Throws error if duplication fails
   * @example
   * await duplicateApp({
   *   appToDuplicate: originalApp,
   *   puter: puterSDK,
   *   user: currentUser
   * })
   */
  const duplicateApp = async (params) => {
    const { appToDuplicate, puter, user } = params;
    
    if (!puter || !user || !appToDuplicate) return;
    
    try {
      // Generate new names with "-copy" suffix
      const originalName = appToDuplicate.appName || appToDuplicate.subdomain;
      const copySuffix = "-copy";
      const baseName = originalName.replace(/(-copy)+$/, ""); // Remove existing copy suffixes
      const newName = `${baseName}${copySuffix}`;
      const newTitle = `${appToDuplicate.appTitle || appToDuplicate.appName}${copySuffix}`;
      
      // Generate new subdomain
      const newSubdomain = newName.toLowerCase().replace(/[^a-z0-9-]/g, "") || puter.randName();
      
      // Create new directory with unique timestamp
      const dirName = `app_${Date.now()}_copy`;
      
      // Write the same code to the new directory
      await puter.fs.mkdir(dirName);
      await puter.fs.write(`${dirName}/index.html`, appToDuplicate.code);
      
      // Create new hosted site
      const site = await puter.hosting.create(newSubdomain, dirName);
      const hostedUrl = `https://${site.subdomain}.puter.site`;
      
      // Create Puter app
      let puterApp;
      try {
        puterApp = await puter.apps.create({
          name: newName,
          indexURL: hostedUrl,
          title: newTitle,
          description: appToDuplicate.prompt,
          maximizeOnStart: true,
          dedupeName: true
        });
      } catch (appErr) {
        const randomName = puter.randName();
        puterApp = await puter.apps.create({
          name: randomName,
          indexURL: hostedUrl,
          title: newTitle,
          description: appToDuplicate.prompt,
          maximizeOnStart: true
        });
      }
      
      // Save duplicated app to database with version reset to 1
      const doc = await database.put({
        type: "app",
        prompt: appToDuplicate.prompt,
        code: appToDuplicate.code,
        subdomain: site.subdomain,
        hostedUrl,
        appName: puterApp.name,
        appUid: puterApp.uid,
        appTitle: newTitle,
        model: appToDuplicate.model,
        dir: dirName,
        createdAt: Date.now(),
        views: 0, // Reset views for duplicate
        favorite: false, // Reset favorite status
        tags: [...(appToDuplicate.tags || [])], // Copy tags
        version: 1 // Reset version to 1
      });
      
      // Save initial version for the duplicate
      await database.put({
        type: "version",
        appId: doc.id,
        code: appToDuplicate.code,
        version: 1,
        createdAt: Date.now(),
        note: "Initial version (duplicate)"
      });
      
      showToast(`App duplicated successfully as "${newTitle}"!`, "success");
      return await database.get(doc.id);
      
    } catch (err) {
      showToast(`Duplication failed: ${err.message}`, "error");
      throw err;
    }
  };

  /**
   * Toggle the favorite status of an app
   * Updates database and optionally refreshes selected app state
   * @param {Object} app - App to toggle favorite status
   * @param {Function} setSelectedApp - Optional function to update selected app state
   * @returns {Promise<void>}
   * @example
   * await toggleFavorite(app, setSelectedApp)
   */
  const toggleFavorite = async (app, setSelectedApp) => {
    await database.put({ ...app, favorite: !app.favorite });
    if (setSelectedApp && selectedApp?._id === app._id) {
      setSelectedApp({ ...app, favorite: !app.favorite });
    }
  };

  /**
   * Increment the view count for an app
   * Updates the views counter in the database
   * @param {Object} app - App to increment views for
   * @returns {Promise<void>}
   * @example
   * await incrementViews(app)
   */
  const incrementViews = async (app) => {
    await database.put({ ...app, views: (app.views || 0) + 1 });
  };

  /**
   * Launch an app either through Puter or external browser
   * Increments views and attempts Puter app launch, falls back to browser
   * @param {Object} app - App to launch
   * @param {Object} puter - Puter SDK instance (optional)
   * @returns {Promise<void>}
   * @example
   * await launchApp(app, puterSDK)
   */
  const launchApp = async (app, puter) => {
    await incrementViews(app);
    if (app.appName && puter) {
      try {
        await puter.apps.launch(app.appName);
        showToast(`Launched ${app.appName}!`, "success");
      } catch (err) {
        window.open(app.hostedUrl, "_blank");
      }
    } else {
      window.open(app.hostedUrl, "_blank");
    }
  };

  /**
   * Delete multiple apps in bulk operation
   * Deletes selected apps and resets bulk selection state
   * @param {Set<string>} selectedApps - Set of app IDs to delete
   * @param {Array} apps - All available apps
   * @param {Object} puter - Puter SDK instance
   * @param {Array} versions - All app versions
   * @param {Function} setSelectedApps - Function to clear selected apps
   * @param {Function} setBulkMode - Function to exit bulk mode
   * @returns {Promise<void>}
   * @example
   * await bulkDelete(selectedApps, allApps, puterSDK, allVersions, setSelectedApps, setBulkMode)
   */
  const bulkDelete = async (selectedApps, apps, puter, versions, setSelectedApps, setBulkMode) => {
    for (const appId of selectedApps) {
      const app = apps.find(a => a._id === appId);
      if (app) await deleteApp({ app, puter, versions });
    }
    setSelectedApps(new Set());
    setBulkMode(false);
  };

  return {
    // State
    apps,
    versions,
    generating,
    generationStage,
    database,
    
    // Toast initialization
    initToast,
    
    // CRUD Operations
    buildAndDeploy,
    updateAndRedeploy,
    deleteApp,
    duplicateApp,
    toggleFavorite,
    incrementViews,
    launchApp,
    bulkDelete,
    
    // Utilities
    validateHTML
  };
}