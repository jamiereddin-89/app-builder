import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DragContext } from './DragContext.js';

/**
 * Draggable Component Item
 * Represents a single HTML element that can be dragged
 * @param {Object} props - Component props
 * @param {Object} props.component - Component data
 * @param {number} props.index - Component index in the list
 * @param {Function} props.moveComponent - Function to move component
 * @param {boolean} props.darkMode - Dark mode flag
 * @returns {Object} Draggable component element
 */
function DraggableComponent({ component, index, moveComponent, darkMode }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'component',
    hover: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveComponent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const neu = darkMode ? "bg-[#2a2a2a] shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]";
  const neuBtn = darkMode ? "bg-[#2a2a2a] shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#3a3a3a] hover:shadow-[2px_2px_5px_#1a1a1a,-2px_-2px_5px_#3a3a3a] active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a] transition-all duration-150" : "bg-[#e8e8e8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all duration-150";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  const textSecondary = darkMode ? "text-[#cccccc]" : "text-[#666]";

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`${neu} rounded-lg p-3 mb-2 cursor-move transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ borderLeft: `4px solid ${component.color || '#dc2626'}` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{component.icon || '📦'}</span>
          <div>
            <div className={`font-bold text-sm ${textPrimary}`}>{component.tag}</div>
            <div className={`${textSecondary} text-xs`}>{component.classes || 'No classes'}</div>
          </div>
        </div>
        <div className={`${neuBtn} rounded-full w-6 h-6 flex items-center justify-center text-xs`}>
          ⋮⋮
        </div>
      </div>
      {component.content && (
        <div className={`${textSecondary} text-xs mt-2 truncate`}>
          {component.content.substring(0, 50)}{component.content.length > 50 ? '...' : ''}
        </div>
      )}
    </div>
  );
}

/**
 * Drop Zone for Components
 * Area where components can be dropped to rearrange
 * @param {Object} props - Component props
 * @param {number} props.index - Drop zone index
 * @param {Function} props.onDrop - Drop handler function
 * @param {boolean} props.darkMode - Dark mode flag
 * @returns {Object} Drop zone element
 */
function DropZone({ index, onDrop, darkMode }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item) => onDrop(item.index, index),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const neuInset = darkMode ? "bg-[#2a2a2a] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]";

  return (
    <div
      ref={drop}
      className={`h-2 rounded transition-colors ${isOver ? 'bg-[#dc2626]' : neuInset}`}
    />
  );
}

/**
 * Component Editor for Drag-and-Drop HTML Structure
 * Allows users to visually rearrange HTML elements
 * @param {Object} props - Component props
 * @param {string} props.htmlCode - HTML code to parse and edit
 * @param {Function} props.onCodeChange - Callback when code changes
 * @param {boolean} props.darkMode - Dark mode flag
 * @returns {Object} Component editor element
 * @example
 * <ComponentEditor
 *   htmlCode="<div><h1>Hello</h1><p>World</p></div>"
 *   onCodeChange={(newCode) => setCode(newCode)}
 *   darkMode={false}
 * />
 */
export function ComponentEditor({ htmlCode, onCodeChange, darkMode }) {
  const [components, setComponents] = useState([]);

  // Parse HTML into components
  useEffect(() => {
    const parseHTML = (html) => {
      const components = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const walkDOM = (node, depth = 0) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'HTML' && node.tagName !== 'HEAD' && node.tagName !== 'BODY') {
          const component = {
            tag: node.tagName.toLowerCase(),
            classes: node.getAttribute('class') || '',
            id: node.getAttribute('id') || '',
            content: node.textContent.trim(),
            attributes: {},
            color: getTagColor(node.tagName),
            icon: getTagIcon(node.tagName),
            depth,
            originalElement: node
          };

          // Store other attributes
          Array.from(node.attributes).forEach(attr => {
            if (!['class', 'id'].includes(attr.name)) {
              component.attributes[attr.name] = attr.value;
            }
          });

          components.push(component);

          // Process children
          Array.from(node.children).forEach(child => walkDOM(child, depth + 1));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Handle text nodes
          components.push({
            tag: 'text',
            content: node.textContent.trim(),
            color: '#666',
            icon: '📝',
            depth,
            isTextNode: true,
            originalElement: node
          });
        }
      };

      // Start walking from body or first element
      const body = doc.body;
      if (body.children.length > 0) {
        Array.from(body.children).forEach(child => walkDOM(child));
      } else if (body.textContent.trim()) {
        walkDOM(body);
      }

      return components;
    };

    if (htmlCode) {
      const parsed = parseHTML(htmlCode);
      setComponents(parsed);
    }
  }, [htmlCode]);

  // Move component in the list
  const moveComponent = (fromIndex, toIndex) => {
    const newComponents = [...components];
    const [moved] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, moved);
    setComponents(newComponents);

    // Update HTML code
    const newHTML = reconstructHTML(newComponents);
    onCodeChange(newHTML);
  };

  // Reconstruct HTML from components
  const reconstructHTML = (comps) => {
    const buildElement = (comp, children = []) => {
      if (comp.isTextNode) {
        return comp.content;
      }

      let attrs = '';
      if (comp.classes) attrs += ` class="${comp.classes}"`;
      if (comp.id) attrs += ` id="${comp.id}"`;

      Object.entries(comp.attributes).forEach(([key, value]) => {
        attrs += ` ${key}="${value}"`;
      });

      const childrenHTML = children.join('');
      return `<${comp.tag}${attrs}>${childrenHTML}</${comp.tag}>`;
    };

    // Group components by depth for proper nesting
    const rootComponents = comps.filter(c => c.depth === 0);
    return rootComponents.map(comp => {
      const children = comps.filter(c => c.depth > 0 && comps.indexOf(c) > comps.indexOf(comp));
      return buildElement(comp, children.map(c => buildElement(c)));
    }).join('');
  };

  const neu = darkMode ? "bg-[#2a2a2a] shadow-[8px_8px_16px_#1a1a1a,-8px_-8px_16px_#3a3a3a]" : "bg-[#e8e8e8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]";
  const textPrimary = darkMode ? "text-[#e8e8e8]" : "text-[#1a1a1a]";
  const textSecondary = darkMode ? "text-[#cccccc]" : "text-[#666]";

  return (
    <DragContext>
      <div className={`${neu} rounded-xl p-4`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🎨</span>
          <h3 className={`font-black ${textPrimary}`}>Component Editor</h3>
        </div>

        <div className={`${textSecondary} text-sm mb-4`}>
          Drag and drop components to rearrange the HTML structure
        </div>

        <div className="space-y-1">
          {components.length === 0 ? (
            <div className={`text-center py-8 ${textSecondary}`}>
              No components to edit. Add some HTML code first.
            </div>
          ) : (
            components.map((component, index) => (
              <React.Fragment key={index}>
                <DropZone index={index} onDrop={moveComponent} darkMode={darkMode} />
                <DraggableComponent
                  component={component}
                  index={index}
                  moveComponent={moveComponent}
                  darkMode={darkMode}
                />
              </React.Fragment>
            ))
          )}
          <DropZone index={components.length} onDrop={moveComponent} darkMode={darkMode} />
        </div>
      </div>
    </DragContext>
  );
}

// Helper functions for component styling
function getTagColor(tagName) {
  const colors = {
    div: '#dc2626',
    h1: '#2563eb',
    h2: '#2563eb',
    h3: '#2563eb',
    p: '#16a34a',
    span: '#ca8a04',
    a: '#7c3aed',
    button: '#dc2626',
    input: '#ea580c',
    img: '#059669',
    ul: '#0891b2',
    ol: '#0891b2',
    li: '#0891b2'
  };
  return colors[tagName] || '#6b7280';
}

function getTagIcon(tagName) {
  const icons = {
    div: '📦',
    h1: '📰',
    h2: '📄',
    h3: '📃',
    p: '📝',
    span: '🏷️',
    a: '🔗',
    button: '🔲',
    input: '📥',
    img: '🖼️',
    ul: '📋',
    ol: '🔢',
    li: '•'
  };
  return icons[tagName] || '📦';
}