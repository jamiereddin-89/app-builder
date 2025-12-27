import { useState, useEffect } from 'react';

/**
 * Custom hook for managing AI models fetching and filtering
 * Handles model loading from API, provider categorization, and filtering
 */
/**
 * Custom hook for managing AI models fetching and filtering
 * Handles model loading from API, provider categorization, and filtering
 * @returns {Object} Hook return object with state and functions
 */
export function useModels() {
  /** @type {Array<Object>} Available AI models with provider information */
  const [models, setModels] = useState([]);
  /** @type {boolean} Whether models are currently being loaded */
  const [loading, setLoading] = useState(false);
  /** @type {string|null} Error message if model loading fails */
  const [error, setError] = useState(null);

  /** @type {Function} Toast notification function for user feedback */
  const [showToast, setShowToast] = useState(() => (message, type = "success", duration = 3000) => {
    console.log(`Toast: ${message} (${type})`);
  });

  /**
   * Categorize a model ID by its provider based on naming patterns
   * Uses regex patterns to identify major AI providers
   * @param {string} modelId - Model identifier to categorize
   * @returns {string} Provider name (e.g., 'OpenAI', 'Anthropic', 'Google')
   * @example
   * categorizeModel('gpt-4o-mini') // returns 'OpenAI'
   * categorizeModel('claude-3-5-sonnet') // returns 'Anthropic'
   */
  const categorizeModel = (modelId) => {
    if (/gpt|o1|o3|chatgpt/i.test(modelId)) return "OpenAI";
    if (/claude/i.test(modelId)) return "Anthropic";
    if (/gemini|gemma/i.test(modelId)) return "Google";
    if (/llama/i.test(modelId)) return "Meta";
    if (/mistral|mixtral/i.test(modelId)) return "Mistral";
    if (/deepseek/i.test(modelId)) return "DeepSeek";
    if (/grok/i.test(modelId)) return "xAI";
    if (/qwen/i.test(modelId)) return "Alibaba";
    return "Other";
  };

  /**
   * Fetch available AI models from Puter API
   * Handles loading states, errors, and provides fallback models
   * @returns {Promise<void>}
   * @throws {Error} Throws error if API request fails
   * @example
   * await fetchModels()
   */
  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("https://api.puter.com/puterai/chat/models/");
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const modelList = (Array.isArray(data) ? data : data.models || []).map(m => {
        const id = typeof m === "string" ? m : m.id;
        return { 
          id, 
          provider: categorizeModel(id) 
        };
      });
      
      setModels(modelList);
      
      if (modelList.length === 0) {
        setError("No models available");
      }
      
    } catch (err) {
      setError(err.message);
      console.warn("Failed to fetch models:", err);
      
      // Set fallback models if API fails
      const fallbackModels = [
        { id: "gpt-4o-mini", provider: "OpenAI" },
        { id: "gpt-4o", provider: "OpenAI" },
        { id: "claude-3-5-sonnet", provider: "Anthropic" },
        { id: "gemini-pro", provider: "Google" }
      ];
      setModels(fallbackModels);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get unique list of available providers
   * Extracts unique provider names and adds 'All' option
   * @returns {Array<string>} Sorted array of provider names with 'All' first
   * @example
   * const providers = getProviders() // ['All', 'OpenAI', 'Anthropic', 'Google']
   */
  const getProviders = () => {
    const providers = [...new Set(models.map(m => m.provider))];
    return ["All", ...providers.sort()];
  };

  /**
   * Get models filtered by provider
   * Returns all models if 'All' provider is selected
   * @param {string} provider - Provider name to filter by
   * @returns {Array<Object>} Filtered array of model objects
   * @example
   * const openAIModels = getFilteredModels('OpenAI')
   * const allModels = getFilteredModels('All')
   */
  const getFilteredModels = (provider) => {
    if (provider === "All") return models;
    return models.filter(m => m.provider === provider);
  };

  /**
   * Get a specific model by its ID
   * @param {string} modelId - Model identifier to look for
   * @returns {Object|null} Model object or null if not found
   * @example
   * const model = getModelById('gpt-4o-mini')
   */
  const getModelById = (modelId) => {
    return models.find(m => m.id === modelId);
  };

  /**
   * Check if a model ID exists in the available models
   * @param {string} modelId - Model identifier to check
   * @returns {boolean} True if model exists, false otherwise
   * @example
   * const exists = hasModel('gpt-4o')
   */
  const hasModel = (modelId) => {
    return models.some(m => m.id === modelId);
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

  // Auto-fetch models on mount
  useEffect(() => {
    fetchModels();
  }, []);

  return {
    // State
    models,
    loading,
    error,
    
    // Data accessors
    getProviders,
    getFilteredModels,
    getModelById,
    hasModel,
    
    // Actions
    fetchModels,
    initToast
  };
}