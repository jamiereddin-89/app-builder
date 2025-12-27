import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

/**
 * Drag and Drop Context Provider for the App Builder
 * Provides drag and drop functionality throughout the application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {Object} DndProvider wrapper component
 * @example
 * <DragContext>
 *   <App />
 * </DragContext>
 */
export function DragContext({ children }) {
  return (
    <DndProvider backend={HTML5Backend}>
      {children}
    </DndProvider>
  );
}