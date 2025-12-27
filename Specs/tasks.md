### [ ] Implement Task 2.2: Template Categories
Organize the 12 app templates into logical categories (Productivity, Utilities, Entertainment, etc.) and modify the template modal to display them with category tabs or sections for easy navigation. Update the template selection logic accordingly.

#### Steps:
1. Create templateCategories object grouping templates by category
2. Add selectedCategory state variable
3. Modify template modal to display category tabs
4. Update template display logic to filter by selected category
5. Test category navigation and template selection
**Acceptance Criteria**:
- [ ] Old directories deleted on app update
- [ ] Old directories deleted on app deletion
- [ ] Error handling for already-deleted directories
- [ ] Log messages for cleanup operations

**Implementation Steps**:
1. Add cleanup logic to `updateAndRedeploy()` function
2. Add cleanup logic to `deleteApp()` function
3. Test with multiple app updates
4. Test with app deletion
5. Verify no errors when directory already deleted

**Code Location**: Lines 304-355, 357-381 in index.html

---

### [X] Task 1.2: Fix Log Array Off-by-One Error
**Priority**: LOW  
**Estimated Effort**: 5 minutes  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Log maintains exactly 16 entries as intended
- [ ] No entries lost

**Implementation Steps**:
1. Change `.slice(-15)` to `.slice(-16)` in `addLog()` function
2. Test log overflow behavior

**Code Location**: Line 104 in index.html

---

### [X] Task 1.3: Enhanced HTML Validation
**Priority**: MEDIUM  
**Estimated Effort**: 1 hour  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Check for required HTML tags (html, head, body)
- [ ] Provide detailed error messages
- [ ] Prevent deployment of invalid HTML

**Implementation Steps**:
1. Create `validateHTML()` function
2. Add checks for DOCTYPE, html, head, body tags
3. Call validation before deployment
4. Add error handling with descriptive messages
5. Test with various invalid HTML inputs

**Code Location**: Around line 216 in index.html

---

## 2. Feature Enhancements - High Priority

### [X] Task 2.1: Dark Mode Support
**Priority**: MEDIUM  
**Estimated Effort**: 4 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Toggle button in header
- [ ] Dark neomorphic color palette defined
- [ ] All components support dark mode
- [ ] Mode persists in localStorage
- [ ] Smooth transitions between modes

**Implementation Steps**:
1. Add `darkMode` state variable
2. Define dark color palette constants
3. Create conditional styling logic
4. Update all neu/neuInset/neuBtn classes
5. Add toggle button to header
6. Implement localStorage persistence
7. Test all components in both modes

**Code Location**: Throughout index.html, especially lines 499-503

---

### [X] Task 2.2: Template Categories
**Priority**: LOW  
**Estimated Effort**: 2 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Templates organized by category
- [ ] Category tabs or sections in modal
- [ ] Easy navigation between categories

**Implementation Steps**:
1. Create `templateCategories` object
2. Modify template modal to show categories
3. Add category navigation/tabs
4. Update template selection logic
5. Test category filtering

**Code Location**: Lines 88-102 in index.html

---

### [X] Task 2.3: Tag System Implementation
**Priority**: MEDIUM  
**Estimated Effort**: 3 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Tag input component in build form
- [ ] Tags saved with app metadata
- [ ] Filter apps by tags
- [ ] Tag chips displayed on app cards
- [ ] Tags can be added/removed

**Implementation Steps**:
1. Add `tags` state variable
2. Create TagInput component
3. Add tag input to build form
4. Save tags in database with app
5. Add tag filter to apps list
6. Display tags on app cards
7. Test tag filtering and persistence

**Code Location**: Build form section, app cards

---

### Task 2.4: Keyboard Shortcuts
**Priority**: LOW  
**Estimated Effort**: 2 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Ctrl/Cmd+K: Focus search
- [ ] Ctrl/Cmd+B: Switch to build tab
- [ ] Ctrl/Cmd+S: Save/redeploy (if editing)
- [ ] Escape: Close modals
- [ ] Help overlay showing shortcuts

**Implementation Steps**:
1. Add keydown event listener in useEffect
2. Implement shortcut handlers
3. Prevent default browser behaviors
4. Create keyboard shortcut help modal
5. Test on Mac and Windows

**Code Location**: New useEffect hook

---

### Task 2.5: App Duplication Feature
**Priority**: LOW  
**Estimated Effort**: 1.5 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Duplicate button on app card/details
- [ ] Creates copy with "-copy" suffix
- [ ] New subdomain generated
- [ ] New hosting site created
- [ ] Version reset to 1

**Implementation Steps**:
1. Create `duplicateApp()` function
2. Clone app object and modify fields
3. Generate new subdomain
4. Deploy to hosting
5. Save to database
6. Add button to UI
7. Test duplication process

**Code Location**: New function around line 400

---

## 3. UI/UX Improvements

### [X] Task 3.1: Loading Progress Indicator
**Priority**: MEDIUM  
**Estimated Effort**: 1 hour  
**Dependencies**: None

**Acceptance Criteria**:
- [x] Shows current stage during generation
- [x] Stages: "Generating code", "Creating filesystem", "Deploying", etc.
- [x] Updates in real-time
- [x] Visible in preview panel

**Implementation Steps**:
1. Add `generationStage` state variable ✓
2. Update stage at each step in `buildAndDeploy()` ✓
3. Display stage in UI below spinner ✓
4. Test with actual app generation ✓

**Code Location**: Lines 62, 269-383, 1170-1172 in index.html

---

### [X] Task 3.2: Toast Notifications
**Priority**: LOW  
**Estimated Effort**: 2 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Toast component created
- [ ] Auto-dismiss after 3 seconds
- [ ] Success and error variants
- [ ] Stack multiple toasts
- [ ] Replace log panel for key events

**Implementation Steps**:
1. Create Toast component
2. Add toast state array
3. Create `showToast()` helper
4. Replace key `addLog()` calls with toasts
5. Implement auto-dismiss
6. Style with neomorphic design
7. Test with various operations

**Code Location**: New Toast component

---

### Task 3.3: App Preview Zoom Controls
**Priority**: LOW  
**Estimated Effort**: 1 hour  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Zoom in/out buttons
- [ ] Percentage display
- [ ] Reset button
- [ ] Smooth scaling
- [ ] Zoom level persists per app

**Implementation Steps**:
1. Add `previewZoom` state variable
2. Add zoom controls to preview header
3. Apply CSS transform to iframe
4. Implement zoom functions (+10%, -10%, reset)
5. Test at various zoom levels

**Code Location**: Preview panel header, lines 929-970

---

### Task 3.4: Code Editor Syntax Highlighting
**Priority**: MEDIUM  
**Estimated Effort**: 3 hours  
**Dependencies**: Monaco Editor or CodeMirror CDN

**Acceptance Criteria**:
- [ ] HTML syntax highlighting
- [ ] Line numbers
- [ ] Code folding
- [ ] Auto-indentation
- [ ] Dark theme support

**Implementation Steps**:
1. Add Monaco Editor from CDN
2. Replace textarea with Editor component
3. Configure options (language, theme, etc.)
4. Test performance with large files
5. Ensure edit functionality works

**Code Location**: Lines 932-937

---

## 4. Performance Optimizations

### Task 4.1: Debounced Search
**Priority**: MEDIUM  
**Estimated Effort**: 30 minutes  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Search doesn't filter on every keystroke
- [ ] Uses React's useDeferredValue
- [ ] Smooth user experience
- [ ] No lag with large app lists

**Implementation Steps**:
1. Import `useDeferredValue` from React
2. Wrap searchQuery with useDeferredValue
3. Use deferred value in filter logic
4. Test with 100+ apps

**Code Location**: Lines 73, 108-126

---

### Task 4.2: Virtualized App List
**Priority**: LOW  
**Estimated Effort**: 2 hours  
**Dependencies**: react-window or similar library

**Acceptance Criteria**:
- [ ] Only visible apps rendered
- [ ] Smooth scrolling
- [ ] Works with 1000+ apps
- [ ] Maintains all functionality

**Implementation Steps**:
1. Add react-window from CDN
2. Wrap app list in FixedSizeList
3. Adjust item sizing
4. Test with large datasets
5. Ensure selection/interaction works

**Code Location**: Lines 809-858

---

## 5. Data & Storage

### Task 5.1: Automatic Backup System
**Priority**: MEDIUM  
**Estimated Effort**: 2 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Auto-backup every 5 minutes
- [ ] Saves to localStorage
- [ ] Includes apps and versions
- [ ] Restore functionality
- [ ] Notification on backup

**Implementation Steps**:
1. Create backup interval in useEffect
2. Serialize apps and versions to JSON
3. Save to localStorage
4. Create restore function
5. Add restore UI (in export modal)
6. Test backup and restore

**Code Location**: New useEffect, export modal

---

### Task 5.2: Cloud Sync via Fireproof
**Priority**: LOW  
**Estimated Effort**: 1 hour  
**Dependencies**: Fireproof cloud endpoint

**Acceptance Criteria**:
- [ ] Database syncs to cloud
- [ ] Works across devices
- [ ] Conflict resolution
- [ ] Sync status indicator

**Implementation Steps**:
1. Update Fireproof initialization with sync options
2. Configure cloud endpoint
3. Test cross-device sync
4. Add sync status indicator to UI
5. Handle sync errors

**Code Location**: Line 54

---

### Task 5.3: Export to GitHub
**Priority**: LOW  
**Estimated Effort**: 4 hours  
**Dependencies**: GitHub API or Puter git integration

**Acceptance Criteria**:
- [ ] Creates GitHub repository
- [ ] Pushes app code
- [ ] Includes README
- [ ] Links shown in UI

**Implementation Steps**:
1. Research Puter git integration
2. Create `exportToGitHub()` function
3. Implement repo creation
4. Implement code push
5. Add button to app details
6. Test with GitHub account

**Code Location**: New function, app details card

---

## 6. Security & Reliability

### Task 6.1: Code Size Limits
**Priority**: MEDIUM  
**Estimated Effort**: 30 minutes  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Enforces 500KB max code size
- [ ] Clear error message
- [ ] Check during generation
- [ ] Check during edit

**Implementation Steps**:
1. Define MAX_CODE_SIZE constant
2. Add size check after AI generation
3. Add size check before redeploy
4. Provide user-friendly error
5. Test with large code samples

**Code Location**: Lines 212-216, 304-355

---

### Task 6.2: Rate Limiting UI
**Priority**: LOW  
**Estimated Effort**: 1 hour  
**Dependencies**: Puter API rate limit info

**Acceptance Criteria**:
- [ ] Displays remaining API calls
- [ ] Updates after each request
- [ ] Warning when limit approaching
- [ ] Disables actions when limit reached

**Implementation Steps**:
1. Add `rateLimitInfo` state
2. Parse rate limit from API responses
3. Display in header or near action buttons
4. Add warning UI
5. Test with actual rate limits

**Code Location**: Header area

---

### Task 6.3: Input Sanitization
**Priority**: MEDIUM  
**Estimated Effort**: 1 hour  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Sanitizes user inputs
- [ ] Removes HTML tags from text inputs
- [ ] Enforces max lengths
- [ ] Prevents XSS attacks

**Implementation Steps**:
1. Create `sanitizeInput()` function
2. Apply to all text inputs
3. Add max length checks
4. Test with malicious inputs
5. Ensure functionality not broken

**Code Location**: Input handlers throughout

---

## 7. Advanced Features

### Task 7.1: AI Chat for Iterative Edits
**Priority**: LOW  
**Estimated Effort**: 6 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Chat interface for selected app
- [ ] Maintains conversation context
- [ ] AI suggests code improvements
- [ ] Apply suggestions with one click
- [ ] Chat history saved

**Implementation Steps**:
1. Create chat UI component
2. Add `chatHistory` state
3. Implement `iterateOnApp()` function
4. Maintain context across messages
5. Parse and apply AI suggestions
6. Add chat panel to preview area
7. Test conversation flow

**Code Location**: New component/section

---

### Task 7.2: Version Diff Viewer
**Priority**: LOW  
**Estimated Effort**: 3 hours  
**Dependencies**: diff library

**Acceptance Criteria**:
- [ ] Shows changes between versions
- [ ] Color-coded additions/deletions
- [ ] Side-by-side or unified view
- [ ] Works with version history

**Implementation Steps**:
1. Add diff library from CDN
2. Create VersionDiff component
3. Calculate diff between versions
4. Render with color coding
5. Add to version history modal
6. Test with various code changes

**Code Location**: Version history modal

---

### Task 7.3: QR Code Generator
**Priority**: LOW  
**Estimated Effort**: 1 hour  
**Dependencies**: qrcode library

**Acceptance Criteria**:
- [ ] Generates QR code for app URL
- [ ] Displays in share modal
- [ ] Downloadable image
- [ ] Mobile-friendly scanning

**Implementation Steps**:
1. Add qrcode library from CDN
2. Create `generateQR()` function
3. Add QR code to share modal
4. Add download button
5. Test with mobile device

**Code Location**: Share modal

---

## 8. Code Quality & Maintenance

### Task 8.1: Component Extraction
**Priority**: MEDIUM  
**Estimated Effort**: 8 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Separate files for major components
- [ ] Reduced main App component size
- [ ] Maintained functionality
- [ ] Improved code organization

**Implementation Steps**:
1. Create AppList component
2. Create AppBuilder component
3. Create AppPreview component
4. Create AppDetails component
5. Create modal components
6. Move logic to components
7. Test all functionality
8. Refactor imports

**Code Location**: Entire index.html

---

### Task 8.2: Custom Hooks
**Priority**: LOW  
**Estimated Effort**: 4 hours  
**Dependencies**: Task 8.1

**Acceptance Criteria**:
- [ ] useAppManagement hook
- [ ] usePuterSDK hook
- [ ] useModels hook
- [ ] Simplified component logic

**Implementation Steps**:
1. Create useAppManagement hook (CRUD operations)
2. Create usePuterSDK hook (SDK initialization)
3. Create useModels hook (model fetching/filtering)
4. Extract logic from components
5. Test hooks in isolation
6. Update components to use hooks

**Code Location**: New hook files

---

### Task 8.3: Add JSDoc Comments
**Priority**: LOW  
**Estimated Effort**: 3 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] All functions documented
- [ ] Parameter types specified
- [ ] Return types specified
- [ ] Examples for complex functions

**Implementation Steps**:
1. Document buildAndDeploy()
2. Document updateAndRedeploy()
3. Document deleteApp()
4. Document all helper functions
5. Document state variables
6. Review and refine

**Code Location**: Throughout code

---

### Task 8.4: Error Boundary
**Priority**: MEDIUM  
**Estimated Effort**: 1.5 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Catches React errors
- [ ] Shows error fallback UI
- [ ] Logs errors
- [ ] Allows recovery

**Implementation Steps**:
1. Create ErrorBoundary component
2. Implement error catching
3. Create error fallback UI
4. Wrap App component
5. Test with intentional errors

**Code Location**: Root level

---

### Task 8.5: Unit Tests
**Priority**: LOW  
**Estimated Effort**: 12 hours  
**Dependencies**: Test framework setup

**Acceptance Criteria**:
- [ ] Test coverage >70%
- [ ] Core functions tested
- [ ] Component tests
- [ ] Integration tests

**Implementation Steps**:
1. Set up test framework (Jest/Vitest)
2. Write tests for validateHTML()
3. Write tests for sanitization
4. Write tests for app CRUD
5. Write component tests
6. Write integration tests
7. Achieve target coverage

**Code Location**: New test files

---

## 9. Documentation

### Task 9.1: README.md
**Priority**: MEDIUM  
**Estimated Effort**: 2 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Project description
- [ ] Features list
- [ ] Setup instructions
- [ ] Usage guide
- [ ] Architecture overview
- [ ] Contributing guidelines

**Implementation Steps**:
1. Write project overview
2. List key features
3. Document setup process
4. Create usage examples
5. Add architecture diagram
6. Include contribution guide
7. Review and polish

**Code Location**: New README.md file

---

### Task 9.2: CHANGELOG.md
**Priority**: LOW  
**Estimated Effort**: 1 hour  
**Dependencies**: None

**Acceptance Criteria**:
- [ ] Version history tracked
- [ ] Changes categorized (Added, Fixed, Changed)
- [ ] Dates included
- [ ] Follows semantic versioning

**Implementation Steps**:
1. Create CHANGELOG.md
2. Document initial version
3. Establish version numbering
4. Set up template for future entries
5. Update with each release

**Code Location**: New CHANGELOG.md file

---

## 10. Testing & Validation

### Task 10.1: Cross-browser Testing
**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Dependencies**: All features implemented

**Acceptance Criteria**:
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Documented browser issues

**Implementation Steps**:
1. Test in Chrome (latest)
2. Test in Firefox (latest)
3. Test in Safari (latest)
4. Test in Edge (latest)
5. Document any issues
6. Fix critical browser bugs

**Code Location**: N/A (testing)

---

### Task 10.2: Mobile Responsiveness Testing
**Priority**: MEDIUM  
**Estimated Effort**: 3 hours  
**Dependencies**: All UI complete

**Acceptance Criteria**:
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Touch targets adequate (44x44px min)
- [ ] All features accessible
- [ ] Smooth scrolling

**Implementation Steps**:
1. Test on iOS device
2. Test on Android device
3. Test various screen sizes
4. Fix responsive issues
5. Optimize touch interactions

**Code Location**: N/A (testing)

---

### Task 10.3: Performance Benchmarking
**Priority**: LOW  
**Estimated Effort**: 2 hours  
**Dependencies**: All features complete

**Acceptance Criteria**:
- [ ] Lighthouse score >90
- [ ] Fast initial load (<2s)
- [ ] Smooth interactions (60fps)
- [ ] Efficient memory usage

**Implementation Steps**:
1. Run Lighthouse audit
2. Measure load times
3. Profile performance
4. Identify bottlenecks
5. Implement optimizations
6. Re-test and validate

**Code Location**: N/A (testing)

---

## Task Priority Summary

### Immediate (This Week)
1. Task 1.1: Directory Cleanup
2. Task 1.3: Enhanced HTML Validation
3. Task 10.1: Cross-browser Testing

### Short-term (Next 2 Weeks)
1. Task 2.1: Dark Mode Support
2. Task 3.1: Loading Progress Indicator
3. Task 6.1: Code Size Limits
4. Task 9.1: README.md

### Medium-term (Next Month)
1. Task 2.3: Tag System
2. Task 3.4: Code Editor Syntax Highlighting
3. Task 4.1: Debounced Search
4. Task 5.1: Automatic Backup
5. Task 8.1: Component Extraction

### Long-term (Future)
1. Task 7.1: AI Chat Interface
2. Task 7.2: Version Diff Viewer
3. Task 8.5: Unit Tests
4. All other LOW priority tasks

## Estimation Summary

- **Total Tasks**: 38
- **High Priority**: 5 tasks (~12 hours)
- **Medium Priority**: 13 tasks (~35 hours)
- **Low Priority**: 20 tasks (~53 hours)
- **Total Estimated Effort**: ~100 hours
