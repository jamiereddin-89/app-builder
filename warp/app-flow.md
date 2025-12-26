# Puter App Factory - Application Flow

## User Journey Overview

### Entry Point
1. User loads `index.html` in browser
2. React app initializes in `#container` div
3. Puter SDK loads asynchronously from CDN
4. Model list fetched from Puter AI API
5. App checks for existing Puter authentication

## Core Workflows

### 1. Initial Authentication Flow

```
START → Load App
  ↓
Check: puter.auth.isSignedIn()?
  ├─ YES → Fetch user via puter.auth.getUser()
  │         Display user.username in header
  │         Show main interface with "Build" and "Apps" tabs
  ↓
  └─ NO → Display landing page with "Sign In Free" CTA
           User clicks "Sign In Free"
           Call puter.auth.signIn()
           Redirect to Puter OAuth flow
           Return to app after authentication
           Update UI with user info
```

### 2. App Creation Flow

```
BUILD TAB → User Input
  ↓
Choose Template (Optional)
  ├─ Opens template modal
  ├─ User selects from 12 templates
  ├─ Auto-fills prompt and app title
  └─ Closes modal
  ↓
Configure App
  ├─ Select AI Provider (All/OpenAI/Anthropic/etc.)
  ├─ Select Model (dropdown filtered by provider)
  ├─ Enter/Edit App Description (textarea)
  ├─ Enter App Name (optional, sanitized)
  └─ Enter App Title (optional)
  ↓
Click "🚀 Build & Deploy"
  ↓
VALIDATION
  ├─ Check: User signed in?
  ├─ Check: Prompt not empty?
  └─ Check: Not already generating?
  ↓
GENERATION PROCESS
  ├─ Set generating=true (disables button)
  ├─ Clear previous selection
  ├─ Clear log
  ├─ Log: "Model: {model}"
  ├─ Log: "Generating code..."
  ├─ Call puter.ai.chat() with system + user prompts
  ├─ Parse response and extract HTML
  ├─ Clean code (remove markdown blocks)
  ├─ Validate: contains "<!doctype html>"?
  ├─ Log: "Generated {bytes} bytes"
  └─ Continue to deployment
  ↓
DEPLOYMENT PROCESS
  ├─ Log: "Creating directory..."
  ├─ Create directory: `app_${timestamp}`
  ├─ Write file: `{dir}/index.html` with generated code
  ├─ Log: "Wrote to {dir}/index.html"
  ├─ Log: "Creating hosted site..."
  ├─ Generate subdomain (from appName or random)
  ├─ Call puter.hosting.create(subdomain, dir)
  ├─ Get hosted URL: https://{subdomain}.puter.site
  ├─ Log: "Hosted at: {url}"
  ├─ Log: "Registering Puter app..."
  ├─ Call puter.apps.create() with app metadata
  │   └─ If name collision → retry with random name
  ├─ Log: "App registered: {name}"
  └─ Continue to database save
  ↓
DATABASE SAVE
  ├─ Create app document with all metadata
  ├─ Create initial version document (version: 1)
  ├─ Fetch saved app from database
  ├─ Set as selectedApp
  ├─ Clear input fields
  ├─ Log: "✅ Complete!"
  └─ Open hosted URL in new tab
  ↓
END (generating=false)
```

### 3. App Selection & Viewing Flow

```
APPS TAB → Apps List
  ↓
Apply Filters (Optional)
  ├─ Search by name/title/prompt
  ├─ Toggle favorites filter
  ├─ Sort by: Date/Name/Views
  └─ Enable bulk mode for multi-select
  ↓
Click on App Card
  ↓
LOAD APP DETAILS
  ├─ Set selectedApp state
  ├─ Clear editCode
  ├─ Switch to "Build" tab view (preview panel)
  ├─ Render iframe with app.code in preview
  └─ Display app details card below preview
  ↓
PREVIEW PANEL
  ├─ Shows app title and version in header
  ├─ Toggle button: Preview ↔ Code
  │   ├─ Preview mode: Sandboxed iframe with srcDoc
  │   └─ Code mode: Textarea with editable code
  ├─ Action buttons:
  │   ├─ 📚 Version History
  │   ├─ 🔗 Share Link
  │   ├─ 📤 Export Single App
  │   └─ Launch (opens in new window or Puter app)
  └─ If code edited: "Redeploy" button appears
```

### 4. App Editing & Redeployment Flow

```
EDIT MODE
  ↓
User clicks "</>" to show code
  ↓
Edit code in textarea
  ├─ editCode state updates on change
  ├─ Character count displayed
  └─ "Redeploy" button becomes active
  ↓
Click "Redeploy"
  ↓
UPDATE PROCESS
  ├─ Set generating=true
  ├─ Log: "Updating..."
  ├─ Create new directory: `app_${timestamp}`
  ├─ Write updated code to `{dir}/index.html`
  ├─ Delete old hosted site
  ├─ Create new hosted site with same subdomain
  ├─ Update Puter app registry with new URL
  ├─ Increment version number
  ├─ Save new version document to database
  ├─ Update app document with new code & metadata
  ├─ Fetch updated app
  ├─ Set as selectedApp
  ├─ Clear editCode
  ├─ Log: "✅ Updated to v{version}"
  └─ Open hosted URL in new tab
  ↓
END (generating=false)
```

### 5. Version History Flow

```
APP SELECTED
  ↓
Click "📚" Version History Button
  ↓
OPEN VERSION MODAL
  ├─ Query versions where appId === selectedApp._id
  ├─ Sort by version DESC (newest first)
  └─ Display list with version number + timestamp
  ↓
User clicks "Restore" on a version
  ↓
RESTORE VERSION
  ├─ Set editCode = version.code
  ├─ Log: "Restored v{version}"
  ├─ Close modal
  └─ User can now preview or redeploy restored code
```

### 6. Import/Export Flow

#### Export All Apps
```
Click "📦" in header
  → Opens Export/Import Modal
  → Click "📤 Export All Apps"
  → Serialize all apps to JSON
  → Create Blob and trigger download
  → File: puter-apps-export-{timestamp}.json
  → Log: "✅ Exported apps"
```

#### Export Single App
```
App Selected
  → Click "📤" in preview header
  → Serialize single app to JSON
  → Create Blob and trigger download
  → File: {appName}-export.json
  → Log: "✅ Exported {appName}"
```

#### Import Apps
```
Click "📦" in header
  → Opens Export/Import Modal
  → Click "📥 Import Apps"
  → Opens file picker
  → User selects .json file
  → Parse JSON
  → For each app:
      ├─ Remove _id (generate new)
      ├─ Set imported=true flag
      ├─ Set createdAt=now
      └─ database.put(app)
  → Log: "✅ Imported {count} app(s)"
```

### 7. Share Link Flow

```
App Selected
  → Click "🔗" in preview header
  → GENERATE SHARE LINK
      ├─ Create object: { prompt, code, title }
      ├─ Serialize to JSON
      ├─ Encode with btoa() to base64
      ├─ Create link: {origin}?share={encoded}
      └─ Display in modal
  → User clicks "📋 Copy Link"
  → Copy to clipboard
  → Log: "✅ Link copied!"
```

### 8. App Launch Flow

```
Click Launch/Play Button
  ↓
INCREMENT VIEW COUNTER
  ├─ app.views = (app.views || 0) + 1
  └─ database.put(app)
  ↓
LAUNCH APP
  ├─ Try: puter.apps.launch(app.appName)
  │   └─ Opens app in Puter environment
  └─ Catch: window.open(app.hostedUrl)
      └─ Opens app in new browser tab
```

### 9. Bulk Operations Flow

```
APPS TAB
  ↓
Click "☑️ Select" to enable bulk mode
  ↓
BULK MODE ACTIVE
  ├─ Checkboxes appear on each app card
  ├─ User checks multiple apps
  ├─ selectedApps Set updates
  └─ "🗑️ Delete {count} Selected" button appears
  ↓
Click Delete Selected
  ↓
FOR EACH SELECTED APP
  ├─ Delete from puter.apps
  ├─ Delete from puter.hosting
  ├─ Delete all version documents
  ├─ Delete app document
  └─ Log: "✅ Deleted"
  ↓
Clear selectedApps Set
Disable bulk mode
```

### 10. Analytics View Flow

```
Click "📊" in header
  ↓
TOGGLE ANALYTICS PANEL
  ├─ Calculate analytics object:
  │   ├─ totalApps: apps.length
  │   ├─ favorites: apps.filter(a => a.favorite).length
  │   ├─ totalViews: sum of all app.views
  │   ├─ modelsUsed: unique models count
  │   ├─ avgCodeSize: average code.length in KB
  │   └─ versions: total version documents
  └─ Display as 6-column grid with icons
```

## State Transitions

### Tab Navigation
```
activeTab State:
  "build" → Shows build form and preview panel
  "apps"  → Shows app list and preview panel
```

### Loading States
```
generating: false → User can interact
generating: true  → Buttons disabled, spinner shown
```

### Selection States
```
selectedApp: null    → Preview shows placeholder
selectedApp: object  → Preview shows app
editCode: ""         → Shows original code
editCode: string     → Shows edited code, enables Redeploy
```

### Modal States
```
showTemplates: true   → Template picker modal
showVersions: true    → Version history modal
showExportModal: true → Export/Import modal
showShareModal: true  → Share link modal
showAnalytics: true   → Analytics panel in header
```

## Data Synchronization

### Real-time Updates via LiveQuery
```
Database Change
  ↓
Fireproof LiveQuery detects change
  ↓
React automatically re-renders
  ├─ Apps list updates
  ├─ Version list updates
  ├─ Analytics recalculate
  └─ UI reflects current state
```

### Log System
```
addLog(message)
  ↓
Prepend timestamp
  ↓
Add to log array (keep last 16 entries)
  ↓
Display in log panel with color coding:
  ├─ ✅ → Green (success)
  ├─ ❌ → Red (error)
  └─ Default → Gray (info)
```

## Error Scenarios

### Generation Failures
```
Error during AI generation
  → Catch error
  → Log: "❌ Error: {message}"
  → Set generating=false
  → User can retry
```

### Deployment Failures
```
Error during hosting/app creation
  → Catch error
  → Log: "❌ Error: {message}"
  → Partial cleanup may be needed
  → Set generating=false
```

### Name Collisions
```
puter.apps.create() fails
  → Catch error
  → Log: "Name taken, using random..."
  → Generate random name with puter.randName()
  → Retry with random name
  → Continue normally
```

## Performance Considerations

### Lazy Operations
- SDK loaded after initial render
- Models fetched once on mount
- Database queries reactive (only on document changes)

### Optimistic UI
- Immediate state updates before async operations
- Log provides feedback during long operations
- Loading states prevent duplicate actions

### Cleanup Strategy
- Old directories NOT deleted (accumulate over time)
- Hosting sites reused by subdomain (old replaced)
- Database documents soft-deleted only when user explicitly deletes
