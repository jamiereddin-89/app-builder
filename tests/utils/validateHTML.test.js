import { describe, it, expect } from 'vitest';
import { validateHTML } from '../../hooks/useAppManagement.js';

describe('validateHTML', () => {
  describe('Valid HTML', () => {
    it('should accept complete HTML5 document', () => {
      const validHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Test App</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`;

      expect(() => validateHTML(validHTML)).not.toThrow();
    });

    it('should accept HTML with attributes', () => {
      const validHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test App</title>
</head>
<body class="container">
    <div id="app">Content</div>
</body>
</html>`;

      expect(() => validateHTML(validHTML)).not.toThrow();
    });

    it('should accept HTML with self-closing tags', () => {
      const validHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <img src="test.jpg" alt="test">
    <input type="text">
</body>
</html>`;

      expect(() => validateHTML(validHTML)).not.toThrow();
    });

    it('should accept HTML with case variations', () => {
      const validHTML = `<!DOCTYPE html>
<HTML>
<HEAD>
    <TITLE>Test</TITLE>
</HEAD>
<BODY>
    <H1>Content</H1>
</BODY>
</HTML>`;

      expect(() => validateHTML(validHTML)).not.toThrow();
    });
  });

  describe('Invalid HTML', () => {
    it('should reject HTML without DOCTYPE', () => {
      const invalidHTML = `<html>
<head><title>Test</title></head>
<body>Content</body>
</html>`;

      expect(() => validateHTML(invalidHTML)).toThrow('HTML Validation Failed:');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing DOCTYPE declaration');
    });

    it('should reject HTML without html tags', () => {
      const invalidHTML = `<!DOCTYPE html>
<head><title>Test</title></head>
<body>Content</body>`;

      expect(() => validateHTML(invalidHTML)).toThrow('HTML Validation Failed:');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing <html> opening tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing </html> closing tag');
    });

    it('should reject HTML without head tags', () => {
      const invalidHTML = `<!DOCTYPE html>
<html>
<body>Content</body>
</html>`;

      expect(() => validateHTML(invalidHTML)).toThrow('HTML Validation Failed:');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing <head> opening tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing </head> closing tag');
    });

    it('should reject HTML without body tags', () => {
      const invalidHTML = `<!DOCTYPE html>
<html>
<head><title>Test</title></head>
</html>`;

      expect(() => validateHTML(invalidHTML)).toThrow('HTML Validation Failed:');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing <body> opening tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing </body> closing tag');
    });

    it('should reject HTML with incomplete tags', () => {
      const invalidHTML = `<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>Content</bod`;

      expect(() => validateHTML(invalidHTML)).toThrow('HTML Validation Failed:');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing </body> closing tag');
    });

    it('should reject empty HTML', () => {
      const invalidHTML = '';

      expect(() => validateHTML(invalidHTML)).toThrow('HTML Validation Failed:');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing DOCTYPE declaration');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing <html> opening tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing </html> closing tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing <head> opening tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing </head> closing tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing <body> opening tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing </body> closing tag');
    });

    it('should reject HTML with only DOCTYPE', () => {
      const invalidHTML = '<!DOCTYPE html>';

      expect(() => validateHTML(invalidHTML)).toThrow('HTML Validation Failed:');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing <html> opening tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing </html> closing tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing <head> opening tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing </head> closing tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing <body> opening tag');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing </body> closing tag');
    });

    it('should reject HTML with malformed DOCTYPE', () => {
      const invalidHTML = `<!DOCTYPE html5>
<html>
<head><title>Test</title></head>
<body>Content</body>
</html>`;

      expect(() => validateHTML(invalidHTML)).toThrow('HTML Validation Failed:');
      expect(() => validateHTML(invalidHTML)).toThrow('Missing DOCTYPE declaration');
    });
  });

  describe('Error message format', () => {
    it('should provide detailed error messages', () => {
      const invalidHTML = '<html><head></head><body></body></html>';

      try {
        validateHTML(invalidHTML);
        fail('Expected validation to throw');
      } catch (error) {
        expect(error.message).toContain('HTML Validation Failed:');
        expect(error.message).toContain('Missing DOCTYPE declaration');
        expect(error.message).toContain('HTML must start with <!DOCTYPE html>');
      }
    });

    it('should list multiple errors', () => {
      const invalidHTML = '<head></head><body></body>';

      try {
        validateHTML(invalidHTML);
        fail('Expected validation to throw');
      } catch (error) {
        expect(error.message).toContain('HTML Validation Failed:');
        expect(error.message.split('\n').length).toBeGreaterThan(3); // Should have multiple errors
      }
    });
  });
});