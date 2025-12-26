# Puter App Factory - Context Documentation

## Overview
The Puter App Factory is a comprehensive web application that enables users to build, deploy, and manage web applications using AI-generated code. It integrates with Puter's cloud platform to provide seamless hosting and application management.

## Technology Stack

### Core Technologies
- **React 18**: UI library loaded via ESM from esm.sh
- **Babel Standalone**: In-browser JSX/ES6+ transpilation
- **Tailwind CSS v4**: Browser-based styling via CDN
- **Fireproof Database**: Local-first database using `use-fireproof` (aliased as `use-vibes`)

### External APIs & SDKs
- **Puter SDK v2**: Cloud platform integration for auth, filesystem, hosting, and app management
- **Puter AI API**: LLM chat completions via `puter.ai.chat()`
- **API Endpoint**: `https://api.puter.com/puterai/chat/models/` for model discovery

## Data Architecture

### Database Collections
The app uses Fireproof database with document types identified by a `type` field:

#### App Documents (`type: "app"`)
```javascript
{
  type: "app",
  prompt: String,           // User's original description
  code: String,             // Generated HTML code
  subdomain: String,        // Puter hosting subdomain
  hostedUrl: String,        // Full URL (e.g., https://xyz.puter.site)
  appName: String,          // Puter app identifier
  appUid: String,           // Puter app UID
  appTitle: String,         // Display title
  model: String,            // AI model used for generation
  dir: String,              // Puter filesystem directory (e.g., app_timestamp)
  createdAt: Number,        // Timestamp
  updatedAt: Number,        // Timestamp (optional)
  views: Number,            // View counter
  favorite: Boolean,        // User favorite flag
  tags: Array,              // Tag array (currently unused)
  version: Number           // Version counter
}
```

#### Version Documents (`type: "version"`)
```javascript
{
  type: "version",
  appId: String,           // Reference to parent app _id
  code: String,            // Code snapshot
  version: Number,         // Version number
  createdAt: Number,       // Timestamp
  note: String             // Version description
}
```

### Indexes
- **Apps**: Indexed by `type: "app"` (descending)
- **Versions**: Indexed by `type: "version"` (descending)

## Key Features

### 1. AI Code Generation
- Uses multiple LLM providers (OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, xAI, Alibaba)
- System prompt enforces single-file HTML apps with embedded CSS/JS
- Validates HTML structure before deployment
- No external dependencies allowed

### 2. Puter Platform Integration
- **Authentication**: OAuth-style sign-in via `puter.auth`
- **Filesystem**: Creates directories and writes files via `puter.fs`
- **Hosting**: Creates/updates/deletes hosted sites via `puter.hosting`
- **App Registry**: Registers apps in Puter's app catalog via `puter.apps`

### 3. App Management
- Search apps by name, title, or prompt
- Filter by favorites
- Sort by date, name, or views
- Bulk operations (multi-select delete)
- View counter tracking
- Favorite toggling

### 4. Version Control
- Automatic version history on each update
- Version restoration
- Version comparison via stored snapshots

### 5. Import/Export
- Export all apps as JSON
- Export individual app as JSON
- Import apps from JSON files
- Share links with encoded app data (base64)

### 6. Templates
12 pre-built app templates including:
- Todo App, Calculator, Notes App
- Pomodoro Timer, Weather Dashboard
- Kanban Board, Password Generator
- Quiz Game, Expense Tracker
- Drawing App, Music Player, Chat Interface

### 7. Code Editor
- Live preview via iframe with sandbox
- Inline code editing
- Character count
- Toggle between preview and code view
- Redeploy on save

### 8. Analytics Dashboard
- Total apps count
- Favorites count
- Total views across all apps
- Models used count
- Average code size
- Total versions

## UI Design System

### Neomorphism (Neumorphism)
The app uses a consistent neomorphic design language:

```javascript
// Raised surfaces
neu = "bg-[#e8e8e8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]"

// Inset/pressed surfaces
neuInset = "bg-[#e8e8e8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]"

// Interactive buttons
neuBtn = "bg-[#e8e8e8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] 
          hover:shadow-[2px_2px_5px_#c5c5c5,-2px_-2px_5px_#ffffff] 
          active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff]"

// Accent buttons (red/black variants)
neuBtnRed / neuBtnBlack
```

### Color Palette
- **Background**: `#e8e8e8` (light gray)
- **Primary**: `#dc2626` (red)
- **Text Primary**: `#1a1a1a` (near black)
- **Text Secondary**: `#666`, `#888`, `#999`
- **Borders**: `#d0d0d0`

### Layout
- Two-tab interface: "Build" and "Apps"
- Responsive 3-column layout (1 sidebar + 2 preview on desktop)
- Mobile-friendly with flex-wrap and responsive grid

## State Management

### React State Hooks
```javascript
// Core app state
const [prompt, setPrompt] = useState("")
const [appName, setAppName] = useState("")
const [appTitle, setAppTitle] = useState("")
const [generating, setGenerating] = useState(false)
const [selectedApp, setSelectedApp] = useState(null)
const [editCode, setEditCode] = useState("")

// Model selection
const [models, setModels] = useState([])
const [model, setModel] = useState("gpt-4o-mini")
const [provider, setProvider] = useState("All")

// User & SDK
const [puter, setPuter] = useState(null)
const [user, setUser] = useState(null)

// UI state
const [log, setLog] = useState([])
const [showCode, setShowCode] = useState(false)
const [activeTab, setActiveTab] = useState("build")

// Feature state
const [searchQuery, setSearchQuery] = useState("")
const [selectedTemplate, setSelectedTemplate] = useState(null)
const [showTemplates, setShowTemplates] = useState(false)
const [showVersions, setShowVersions] = useState(false)
const [selectedApps, setSelectedApps] = useState(new Set())
const [bulkMode, setBulkMode] = useState(false)
const [sortBy, setSortBy] = useState("date")
const [filterFavorites, setFilterFavorites] = useState(false)
const [showAnalytics, setShowAnalytics] = useState(false)
const [showExportModal, setShowExportModal] = useState(false)
const [showShareModal, setShowShareModal] = useState(false)
const [shareLink, setShareLink] = useState("")
```

### Fireproof Hooks
```javascript
const { useLiveQuery, database } = useFireproof("puter-apps-v6")
const { docs: apps } = useLiveQuery("type", { key: "app", descending: true })
const { docs: versions } = useLiveQuery("type", { key: "version", descending: true })
```

## Security Considerations

### Iframe Sandboxing
Generated apps run in sandboxed iframes:
```html
<iframe sandbox="allow-scripts allow-forms allow-modals allow-popups" />
```

### Authentication
- Uses Puter's OAuth flow
- Checks sign-in state: `puter.auth.isSignedIn()`
- Fetches user info: `puter.auth.getUser()`

### Input Sanitization
- App names sanitized: lowercase, alphanumeric + hyphens only
- HTML validation: checks for `<!doctype html>` before deployment

## Performance Optimizations

### Lazy Loading
- Puter SDK loaded asynchronously in `useEffect`
- Models fetched once on mount

### Efficient Updates
- LiveQuery automatically updates UI on database changes
- Selective re-renders based on state dependencies

### File Management
- Old directories left in place (no cleanup implemented)
- Hosting sites replaced on update

## Error Handling

### Try-Catch Blocks
- All async operations wrapped in try-catch
- Errors logged to UI via `addLog()`
- Graceful fallbacks (e.g., random app names if collision)

### Validation
- Checks for signed-in user before operations
- Validates HTML structure before deployment
- Checks for empty prompts

## Environment Configuration
```javascript
window.CALLAI_API_KEY = ""  // Empty (unused)
window.CALLAI_CHAT_URL = "https://vibes-diy-api.com/"
window.CALLAI_IMG_URL = "https://vibes-diy-api.com/"
```

## Import Map
```json
{
  "react": "https://esm.sh/react",
  "react-dom": "https://esm.sh/react-dom",
  "react-dom/client": "https://esm.sh/react-dom/client",
  "react/jsx-runtime": "https://esm.sh/react/jsx-runtime",
  "use-fireproof": "https://esm.sh/use-vibes@0.18.9",
  "call-ai": "https://esm.sh/call-ai@0.18.9",
  "use-vibes": "https://esm.sh/use-vibes@0.18.9"
}
```

## Browser Compatibility
- Modern browsers with ES6+ support
- Import maps support required
- Babel standalone handles JSX transformation
- No build step required (all client-side)
