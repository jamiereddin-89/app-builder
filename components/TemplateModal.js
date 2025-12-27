import React from 'react';

/**
 * Template selection modal component
 * Displays available app templates with category filtering
 * @param {Object} props - Component props
 * @param {boolean} props.showTemplates - Whether modal is visible
 * @param {Array<Object>} props.templates - Available templates
 * @param {string} props.activeCategory - Currently active category filter
 * @param {Object} props.selectedTemplate - Currently selected template
 * @param {boolean} props.darkMode - Dark mode theme setting
 * @param {Function} props.onClose - Close modal callback
 * @param {Function} props.onSetActiveCategory - Set active category
 * @param {Function} props.onSelectTemplate - Select template callback
 * @returns {Object|null} Template modal element or null if hidden
 * @example
 * TemplateModal({
 *   showTemplates: true,
 *   templates: availableTemplates,
 *   onSelectTemplate: handleTemplateSelect
 * })
 */
export function TemplateModal({
  // State
  showTemplates,
  templates,
  activeCategory,
  selectedTemplate,
  darkMode,
  
  // Handlers
  onClose,
  onSetActiveCategory,
  onSelectTemplate
}) {
  /**
   * Get unique categories from templates with 'All' option
   * Extracts category names and sorts them alphabetically
   * @returns {Array<string>} Sorted array of category names with 'All' first
   * @example
   * const categories = getCategories() // ['All', 'Productivity', 'Games', 'Utilities']
   */
  const getCategories = () => {
    const categories = [...new Set(templates.map(t => t.category))];
    return ["All", ...categories.sort()];
  };

  const filteredTemplates = activeCategory === "All"
    ? templates
    : templates.filter(t => t.category === activeCategory);

  const neu = darkMode ? "bg-[#2a2a2a] shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]";
  const neuInset = darkMode ? "bg-[#2a2a2a] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";
  const neuBtn = darkMode ? "bg-[#2a2a2a] shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a] transition-all duration-150" : "bg-[#e8e8e8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-150";
  const neuBtnBlack = darkMode ? "bg-[#1a1a1a] text-white shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#000,inset_-4px_-4px_8px_#333] transition-all duration-150" : "bg-[#1a1a1a] text-white shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#000,inset_-4px_-4px_8px_#333] transition-all duration-150";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  const textSecondary = darkMode ? "text-[#cccccc]" : "text-[#666]";

  if (!showTemplates) return null;

  // Create category tabs
  const categoryTabs = getCategories().map(category => 
    React.createElement(
      'button',
      {
        key: category,
        onClick: () => onSetActiveCategory(category),
        className: `px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
          activeCategory === category
            ? `${neuInset} text-[#dc2626]`
            : `${neuBtn} ${textPrimary}`
        }`
      },
      category === "All" ? "🌐 All" : category
    )
  );

  // Create template buttons
  const templateButtons = filteredTemplates.map(t => 
    React.createElement(
      'button',
      {
        key: t.id,
        onClick: () => onSelectTemplate(t),
        className: `${neuBtn} rounded-xl p-4 text-left transition-all ${selectedTemplate?.id === t.id ? "ring-2 ring-[#dc2626]" : ""}`
      },
      [
        React.createElement('div', { key: 'icon', className: 'text-3xl mb-2' }, t.icon),
        React.createElement('div', { key: 'name', className: `font-bold ${textPrimary} text-sm` }, t.name),
        React.createElement('div', { key: 'category', className: `text-xs ${textSecondary} mt-1` }, t.category)
      ]
    )
  );

  return React.createElement(
    'div',
    { 
      className: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4',
      onClick: onClose
    },
    React.createElement(
      'div',
      { 
        className: `${neu} rounded-[24px] p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden`,
        onClick: e => e.stopPropagation()
      },
      [
        React.createElement('h3', {
          key: 'title',
          className: `font-black ${textPrimary} text-xl mb-4`
        }, '🎨 App Templates'),
        
        // Category tabs
        React.createElement('div', {
          key: 'category-tabs',
          className: 'flex gap-2 mb-4 overflow-x-auto pb-2'
        }, categoryTabs),
        
        // Template grid
        React.createElement('div', {
          key: 'template-grid',
          className: 'grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[55vh] overflow-y-auto'
        }, templateButtons),
        
        // Close button
        React.createElement('button', {
          key: 'close-btn',
          onClick: onClose,
          className: `w-full ${neuBtnBlack} rounded-xl py-3 font-bold mt-4`
        }, 'Close')
      ]
    )
  );
}