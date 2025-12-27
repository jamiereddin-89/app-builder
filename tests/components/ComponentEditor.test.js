import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentEditor } from '../../components/ComponentEditor.js';

// Mock React DnD
vi.mock('react-dnd', () => ({
  useDrag: () => [{ isDragging: false }, vi.fn()],
  useDrop: () => [{ isOver: false }, vi.fn()],
}));

vi.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: vi.fn(),
}));

describe('ComponentEditor', () => {
  const mockOnCodeChange = vi.fn();
  const defaultProps = {
    htmlCode: '<div><h1>Hello World</h1><p>This is a test</p></div>',
    onCodeChange: mockOnCodeChange,
    darkMode: false,
  };

  beforeEach(() => {
    mockOnCodeChange.mockClear();
  });

  it('renders component editor with parsed HTML elements', () => {
    render(<ComponentEditor {...defaultProps} />);

    expect(screen.getByText('Component Editor')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop components to rearrange the HTML structure')).toBeInTheDocument();

    // Check if components are parsed and displayed
    expect(screen.getByText('div')).toBeInTheDocument();
    expect(screen.getByText('h1')).toBeInTheDocument();
    expect(screen.getByText('p')).toBeInTheDocument();
  });

  it('displays component content correctly', () => {
    render(<ComponentEditor {...defaultProps} />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('This is a test')).toBeInTheDocument();
  });

  it('shows empty state when no HTML code provided', () => {
    render(<ComponentEditor {...defaultProps} htmlCode="" />);

    expect(screen.getByText('No components to edit. Add some HTML code first.')).toBeInTheDocument();
  });

  it('applies dark mode styles when darkMode is true', () => {
    render(<ComponentEditor {...defaultProps} darkMode={true} />);

    // Check that dark mode classes are applied
    const container = screen.getByText('Component Editor').closest('.bg-\\[\\#2a2a2a\\]');
    expect(container).toBeInTheDocument();
  });

  it('displays correct icons for different HTML elements', () => {
    const htmlWithVariousElements = `
      <div></div>
      <h1></h1>
      <p></p>
      <button></button>
      <input />
      <img />
    `;
    render(<ComponentEditor {...defaultProps} htmlCode={htmlWithVariousElements} />);

    // The icons should be present (checked by their presence in the component)
    expect(screen.getAllByText('📦')).toHaveLength(1); // div
    expect(screen.getAllByText('📰')).toHaveLength(1); // h1
    expect(screen.getAllByText('📝')).toHaveLength(1); // p
    expect(screen.getAllByText('🔲')).toHaveLength(1); // button
    expect(screen.getAllByText('📥')).toHaveLength(1); // input
    expect(screen.getAllByText('🖼️')).toHaveLength(1); // img
  });

  it('handles complex nested HTML structures', () => {
    const complexHTML = `
      <div class="container">
        <header>
          <h1>Title</h1>
          <nav>
            <ul>
              <li>Home</li>
              <li>About</li>
            </ul>
          </nav>
        </header>
        <main>
          <section>
            <h2>Section 1</h2>
            <p>Content</p>
          </section>
        </main>
      </div>
    `;
    render(<ComponentEditor {...defaultProps} htmlCode={complexHTML} />);

    // Check that all elements are present
    expect(screen.getByText('div')).toBeInTheDocument();
    expect(screen.getAllByText('h1')).toHaveLength(1);
    expect(screen.getAllByText('h2')).toHaveLength(1);
    expect(screen.getAllByText('p')).toHaveLength(1);
    expect(screen.getByText('header')).toBeInTheDocument();
    expect(screen.getByText('nav')).toBeInTheDocument();
    expect(screen.getByText('main')).toBeInTheDocument();
    expect(screen.getByText('section')).toBeInTheDocument();
    expect(screen.getAllByText('ul')).toHaveLength(1);
    expect(screen.getAllByText('li')).toHaveLength(2);
  });

  it('displays CSS classes when present', () => {
    const htmlWithClasses = '<div class="container main-content"><h1 class="title">Test</h1></div>';
    render(<ComponentEditor {...defaultProps} htmlCode={htmlWithClasses} />);

    expect(screen.getByText('container main-content')).toBeInTheDocument();
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('handles HTML elements with IDs', () => {
    const htmlWithIds = '<div id="main"><h1 id="title">Test</h1></div>';
    render(<ComponentEditor {...defaultProps} htmlCode={htmlWithIds} />);

    // IDs should be displayed alongside classes or separately
    const divElement = screen.getByText('div');
    expect(divElement).toBeInTheDocument();
  });

  it('handles malformed HTML gracefully', () => {
    const malformedHTML = '<div><h1>Unclosed<h2>More content</div>';
    render(<ComponentEditor {...defaultProps} htmlCode={malformedHTML} />);

    // Should still parse and display what it can
    expect(screen.getByText('div')).toBeInTheDocument();
    expect(screen.getAllByText('h1')).toHaveLength(1);
    expect(screen.getAllByText('h2')).toHaveLength(1);
  });

  it('truncates long content appropriately', () => {
    const longContent = '<p>' + 'This is a very long piece of content that should be truncated for display purposes in the component editor interface. '.repeat(10) + '</p>';
    render(<ComponentEditor {...defaultProps} htmlCode={longContent} />);

    const paragraphElement = screen.getByText(/This is a very long piece of content.*\.\.\./);
    expect(paragraphElement).toBeInTheDocument();
  });
});