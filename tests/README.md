# Testing Documentation

This directory contains comprehensive unit tests, component tests, and integration tests for the Puter App Factory project.

## Test Structure

```
tests/
├── setup.js                    # Test environment setup and mocks
├── utils/
│   └── validateHTML.test.js    # Core utility function tests
├── components/
│   ├── Toast.test.js          # Toast component tests
│   ├── ErrorBoundary.test.js  # ErrorBoundary component tests
│   └── AppList.test.js        # AppList component tests
├── hooks/
│   ├── useAppManagement.test.js # App management hook tests
│   ├── usePuterSDK.test.js    # Puter SDK hook tests
│   └── useModels.test.js      # Models hook tests
└── integration/
    └── appWorkflow.test.js    # End-to-end workflow tests
```

## Running Tests

### Basic Test Run
```bash
npm test
```

### Test with Coverage
```bash
npm run test:coverage
```

### Interactive Test UI
```bash
npm run test:ui
```

## Test Coverage

The test suite covers:

- **Core Functions**: HTML validation, sanitization
- **Components**: Toast, ErrorBoundary, AppList
- **Hooks**: useAppManagement, usePuterSDK, useModels
- **Integration**: Complete app lifecycle workflows
- **Error Handling**: Network failures, validation errors, edge cases
- **Performance**: Large datasets, concurrent operations

## Test Categories

### Unit Tests
- Test individual functions and components in isolation
- Mock external dependencies (Puter SDK, database)
- Fast execution and focused testing

### Component Tests
- Test React components with user interactions
- Verify rendering, state changes, and prop handling
- Use React Testing Library for realistic testing

### Integration Tests
- Test complete workflows and data flow
- Verify interactions between multiple components/hooks
- Test error recovery and edge cases

### Mock Setup

The test setup includes mocks for:

- **Puter SDK**: AI chat, file system, hosting, apps
- **Database**: Fireproof database operations
- **Browser APIs**: localStorage, console, crypto
- **External Libraries**: react-window, monaco editor

## Writing Tests

### Adding New Component Tests

1. Create test file in `tests/components/`
2. Use React Testing Library for rendering
3. Mock external dependencies
4. Test user interactions and state changes
5. Verify accessibility and error handling

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Component from '../../components/Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Adding New Hook Tests

1. Create test file in `tests/hooks/`
2. Use renderHook from React Testing Library
3. Mock external dependencies
4. Test state management and async operations
5. Verify error handling

```javascript
import { renderHook, act } from '@testing-library/react';
import { useHook } from '../../hooks/useHook';

describe('useHook', () => {
  it('should handle async operation', async () => {
    const { result } = renderHook(() => useHook());
    
    await act(async () => {
      await result.current.asyncFunction();
    });
    
    expect(result.current.state).toBe('expected');
  });
});
```

### Adding New Utility Tests

1. Create test file in `tests/utils/`
2. Test pure functions directly
3. Cover edge cases and error conditions
4. Verify input validation and output correctness

## Coverage Goals

- **Target Coverage**: >70% overall coverage
- **Critical Functions**: 100% coverage for core utilities
- **Components**: 80%+ coverage for user-facing components
- **Error Paths**: Comprehensive error handling coverage

## Continuous Integration

Tests are configured to run automatically with:

- Coverage reporting
- Linting integration
- Performance monitoring
- Error reporting

## Troubleshooting

### Common Issues

1. **Mock Errors**: Ensure all external dependencies are properly mocked
2. **Async Operations**: Use `act()` wrapper for state updates
3. **Timing Issues**: Use `waitFor()` for async operations
4. **Memory Leaks**: Clean up mocks in `beforeEach()`/`afterEach()`

### Debug Tips

- Use `npm run test:ui` for interactive debugging
- Check coverage reports for untested code
- Use `console.log()` in tests (will be suppressed in CI)
- Verify mocks are called with expected parameters

## Performance Considerations

- Tests should complete within reasonable time
- Use mock responses for external API calls
- Avoid real network requests in unit tests
- Use virtualization for large dataset tests