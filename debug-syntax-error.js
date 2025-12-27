// Diagnostic script to identify the ThemeSelector.js syntax error
console.log("=== ThemeSelector.js Syntax Error Diagnostics ===");

// Check if ThemeSelector.js is being loaded
console.log("1. Checking script loading...");

const scripts = Array.from(document.querySelectorAll('script'));
console.log("All scripts found:", scripts.map(s => ({
  src: s.src || 'inline',
  type: s.type,
  'data-type': s.getAttribute('data-type')
})));

// Check Babel availability
console.log("\n2. Checking Babel availability...");
console.log("Babel object:", typeof Babel !== 'undefined' ? 'Available' : 'Not found');
if (typeof Babel !== 'undefined') {
  console.log("Babel presets:", Babel.availablePresets);
  console.log("Babel plugins:", Babel.availablePlugins);
}

// Check if ThemeSelector is accessible
console.log("\n3. Checking ThemeSelector module...");
try {
  // Try to fetch the ThemeSelector file directly
  fetch('./components/ThemeSelector.js')
    .then(response => response.text())
    .then(content => {
      console.log("ThemeSelector.js content preview (first 200 chars):");
      console.log(content.substring(0, 200) + "...");
      
      // Check for JSX syntax
      const jsxMatches = content.match(/<div|<span|<button/g);
      console.log("JSX elements found:", jsxMatches ? jsxMatches.length : 0);
      
      // Check for export syntax
      const exportMatches = content.match(/export\s+/g);
      console.log("Export statements found:", exportMatches ? exportMatches.length : 0);
      
      // Look for the problematic line around 133
      const lines = content.split('\n');
      console.log("Lines around 133:");
      for (let i = 130; i <= 135; i++) {
        if (lines[i - 1]) {
          console.log(`Line ${i}: ${lines[i - 1]}`);
        }
      }
    })
    .catch(error => {
      console.error("Failed to fetch ThemeSelector.js:", error);
    });
} catch (error) {
  console.error("Error in diagnostics:", error);
}

console.log("\n4. Analysis:");
console.log("- The error occurs because ThemeSelector.js contains JSX but isn't transpiled by Babel");
console.log("- External JS files with JSX need to be either:");
console.log("  a) Inlined in the main HTML script tag");
console.log("  b) Pre-transpiled before serving");
console.log("  c) Loaded differently to allow Babel processing");