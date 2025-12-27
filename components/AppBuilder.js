import React from 'react';

/**
 * Main app builder component for creating and configuring new apps
 * Provides UI for template selection, model configuration, and app metadata
 * @param {Object} props - Component props
 * @param {Object} props.selectedTemplate - Selected template object
 * @param {string} props.provider - Selected AI provider
 * @param {string} props.selectedModel - Selected AI model
 * @param {Array<string>} props.providers - Available AI providers
 * @param {Array<Object>} props.models - Available AI models
 * @param {string} props.prompt - App description prompt
 * @param {string} props.appName - App identifier name
 * @param {string} props.appTitle - App display title
 * @param {Array<string>} props.tags - App tags
 * @param {string} props.tagInput - Current tag input value
 * @param {boolean} props.generating - Whether app is being generated
 * @param {boolean} props.darkMode - Dark mode theme setting
 * @param {Function} props.onShowTemplates - Show template selector
 * @param {Function} props.onSelectTemplate - Select template callback
 * @param {Function} props.onClearTemplate - Clear selected template
 * @param {Function} props.onSetProvider - Set provider callback
 * @param {Function} props.onSetModel - Set model callback
 * @param {Function} props.onSetPrompt - Set prompt callback
 * @param {Function} props.onSetAppName - Set app name callback
 * @param {Function} props.onSetAppTitle - Set app title callback
 * @param {Function} props.onAddTag - Add tag callback
 * @param {Function} props.onRemoveTag - Remove tag callback
 * @param {Function} props.onSetTagInput - Set tag input callback
 * @param {Function} props.onBuildAndDeploy - Build and deploy callback
 * @returns {Object} App builder form element
 * @example
 * AppBuilder({
 *   selectedTemplate: template,
 *   provider: "OpenAI",
 *   models: availableModels,
 *   onBuildAndDeploy: handleBuild
 * })
 */
export function AppBuilder({
  // State
  selectedTemplate,
  provider,
  model,
  providers,
  models,
  prompt,
  appName,
  appTitle,
  tags,
  tagInput,
  generating,
  darkMode,
  
  // Handlers
  onShowTemplates,
  onSelectTemplate,
  onClearTemplate,
  onSetProvider,
  onSetModel,
  onSetPrompt,
  onSetAppName,
  onSetAppTitle,
  onAddTag,
  onRemoveTag,
  onSetTagInput,
  onBuildAndDeploy
}) {
  const neu = darkMode ? "bg-[#2a2a2a] shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]";
  const neuInset = darkMode ? "bg-[#2a2a2a] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";
  const neuBtn = darkMode ? "bg-[#2a2a2a] shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a] transition-all duration-150" : "bg-[#e8e8e8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-150";
  const neuBtnRed = darkMode ? "bg-[#dc2626] text-white shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#b91c1c,inset_-4px_-4px_8px_#ef4444] transition-all duration-150" : "bg-[#dc2626] text-white shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#b91c1c,inset_-4px_-4px_8px_#ef4444] transition-all duration-150";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  const textSecondary = darkMode ? "text-[#cccccc]" : "text-[#666]";
  
  const filtered = provider === "All" ? models : models.filter(m => m.provider === provider);

  // Create provider buttons
  const providerButtons = providers.slice(0, 6).map(p => 
    React.createElement(
      'button',
      {
        key: p,
        onClick: () => onSetProvider(p),
        className: `px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          provider === p
            ? "bg-[#dc2626] text-white shadow-[inset_2px_2px_4px_#b91c1c,inset_-2px_-2px_4px_#ef4444]"
            : `${neuBtn} ${textPrimary}`
        }`
      },
      p
    )
  );

  // Create model options
  const modelOptions = filtered.map(m => 
    React.createElement(
      'option',
      { key: m.id, value: m.id },
      m.id
    )
  );

  // Create tag elements
  const tagElements = tags.map((tag, index) => 
    React.createElement(
      'div',
      { key: index, className: `flex items-center gap-2 ${neuBtn} rounded-full px-3 py-1 text-sm` },
      [
        React.createElement('span', { key: 'tag', className: textPrimary }, tag),
        React.createElement('button', {
          key: 'remove',
          onClick: (e) => { e.stopPropagation(); onRemoveTag(tag); },
          className: "text-[#dc2626] hover:text-[#ef4444] transition-colors"
        }, '×')
      ]
    )
  );

  // Template section
  const templateSection = selectedTemplate ? 
    React.createElement(
      'div',
      { className: `${neuInset} rounded-xl p-3 mb-4 flex items-center gap-3` },
      [
        React.createElement('span', { key: 'icon', className: 'text-2xl' }, selectedTemplate.icon),
        React.createElement(
          'div',
          { key: 'content' },
          [
            React.createElement('div', { key: 'name', className: `font-bold ${textPrimary} text-sm` }, selectedTemplate.name),
            React.createElement('button', { 
              key: 'clear', 
              onClick: onClearTemplate, 
              className: "text-[#dc2626] text-xs" 
            }, 'Clear')
          ]
        )
      ]
    ) : null;

  return React.createElement(
    'div',
    { className: `${neu} rounded-[24px] p-5` },
    [
      React.createElement(
        'button',
        {
          key: 'template-btn',
          onClick: onShowTemplates,
          className: `w-full ${neuBtn} rounded-xl py-3 font-bold ${textPrimary} mb-4 flex items-center justify-center gap-2`
        },
        '🎨 Choose Template'
      ),
      templateSection,
      
      // Provider section
      React.createElement(
        'div',
        { key: 'provider-section', className: 'mb-4' },
        [
          React.createElement('label', { 
            key: 'provider-label',
            className: `font-black ${textPrimary} text-xs uppercase tracking-wider mb-2 block` 
          }, 'Provider'),
          React.createElement(
            'div',
            { key: 'provider-buttons', className: 'flex flex-wrap gap-2' },
            providerButtons
          )
        ]
      ),

      // Model section
      React.createElement(
        'div',
        { key: 'model-section', className: 'mb-4' },
        [
          React.createElement('label', { 
            key: 'model-label',
            className: `font-black ${textPrimary} text-xs uppercase tracking-wider mb-2 block` 
          }, 'Model'),
          React.createElement(
            'div',
            { key: 'model-select', className: `${neuInset} rounded-2xl p-1` },
            React.createElement('select', {
              value: model,
              onChange: (e) => onSetModel(e.target.value),
              className: `w-full p-3 bg-transparent font-mono text-sm ${textPrimary} border-0 outline-none`
            }, modelOptions)
          )
        ]
      ),

      // Prompt section
      React.createElement(
        'div',
        { key: 'prompt-section', className: 'mb-4' },
        [
          React.createElement('label', { 
            key: 'prompt-label',
            className: `font-black ${textPrimary} text-xs uppercase tracking-wider mb-2 block` 
          }, 'App Description'),
          React.createElement(
            'div',
            { key: 'prompt-textarea', className: `${neuInset} rounded-2xl p-1` },
            React.createElement('textarea', {
              value: prompt,
              onChange: (e) => onSetPrompt(e.target.value),
              placeholder: "Describe your app in detail...",
              className: `w-full h-24 p-3 bg-transparent font-mono text-sm ${textPrimary} resize-none border-0 outline-none placeholder-[#999]`
            })
          )
        ]
      ),

      // Name and Title section
      React.createElement(
        'div',
        { key: 'name-title-section', className: 'grid grid-cols-2 gap-3 mb-4' },
        [
          React.createElement(
            'div',
            { key: 'name-div' },
            [
              React.createElement('label', { 
                key: 'name-label',
                className: `font-black ${textPrimary} text-xs uppercase tracking-wider mb-2 block` 
              }, 'App Name'),
              React.createElement(
                'div',
                { key: 'name-input-wrap', className: `${neuInset} rounded-xl p-1` },
                React.createElement('input', {
                  value: appName,
                  onChange: (e) => onSetAppName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")),
                  placeholder: "my-app",
                  className: `w-full p-2 bg-transparent font-mono text-sm ${textPrimary} border-0 outline-none placeholder-[#999]`
                })
              )
            ]
          ),
          React.createElement(
            'div',
            { key: 'title-div' },
            [
              React.createElement('label', { 
                key: 'title-label',
                className: `font-black ${textPrimary} text-xs uppercase tracking-wider mb-2 block` 
              }, 'Title'),
              React.createElement(
                'div',
                { key: 'title-input-wrap', className: `${neuInset} rounded-xl p-1` },
                React.createElement('input', {
                  value: appTitle,
                  onChange: (e) => onSetAppTitle(e.target.value),
                  placeholder: "My App",
                  className: `w-full p-2 bg-transparent text-sm ${textPrimary} border-0 outline-none placeholder-[#999]`
                })
              )
            ]
          )
        ]
      ),

      // Tags section
      React.createElement(
        'div',
        { key: 'tags-section', className: 'mb-4' },
        [
          React.createElement('label', { 
            key: 'tags-label',
            className: `font-black ${textPrimary} text-xs uppercase tracking-wider mb-2 block` 
          }, 'Tags'),
          React.createElement(
            'div',
            { key: 'tags-input-wrap', className: `${neuInset} rounded-2xl p-1` },
            React.createElement(
              'div',
              { key: 'tags-container', className: 'flex flex-wrap gap-2 p-2' },
              [
                ...tagElements,
                React.createElement(
                  'div',
                  { key: 'tag-input-container', className: 'flex-1 min-w-[120px]' },
                  React.createElement('input', {
                    value: tagInput,
                    onChange: (e) => onSetTagInput(e.target.value),
                    onKeyPress: (e) => e.key === 'Enter' && onAddTag(),
                    placeholder: "Add tag...",
                    className: `w-full p-2 bg-transparent text-sm ${textPrimary} border-0 outline-none placeholder-[#999]`
                  })
                ),
                React.createElement('button', {
                  key: 'add-tag-btn',
                  onClick: onAddTag,
                  className: `${neuBtnRed} rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold`
                }, '+')
              ]
            )
          )
        ]
      ),

      // Build button
      React.createElement(
        'button',
        {
          key: 'build-btn',
          onClick: onBuildAndDeploy,
          disabled: generating || !prompt.trim(),
          className: `w-full ${neuBtnRed} rounded-2xl py-4 font-black text-lg disabled:opacity-50`
        },
        generating ? "⏳ Building..." : "🚀 Build & Deploy"
      )
    ]
  );
}