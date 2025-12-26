# Puter App Factory - Requirements Specification

## 1. Project Overview

### 1.1 Purpose
The Puter App Factory is a web-based application that enables users to build, deploy, and manage web applications using AI-generated code integrated with the Puter cloud platform.

### 1.2 Scope
- Single-page React application
- AI-powered code generation using multiple LLM providers
- Integration with Puter platform for hosting, authentication, and file management
- Local-first database with Fireproof
- Real-time app preview and code editing

### 1.3 Target Users
- Developers and non-developers looking to quickly prototype web applications
- Users of the Puter cloud platform
- Anyone wanting to experiment with AI-generated applications

## 2. Functional Requirements

### 2.1 Authentication & User Management
- **FR-1.1**: System shall support Puter OAuth authentication
- **FR-1.2**: System shall check existing authentication state on load
- **FR-1.3**: System shall display user information when authenticated
- **FR-1.4**: System shall support sign-out functionality
- **FR-1.5**: System shall restrict app creation to authenticated users only

### 2.2 AI Code Generation
- **FR-2.1**: System shall support multiple AI model providers (OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, xAI, Alibaba)
- **FR-2.2**: System shall fetch available models from Puter AI API on startup
- **FR-2.3**: System shall allow users to filter models by provider
- **FR-2.4**: System shall allow users to select specific AI models
- **FR-2.5**: System shall accept natural language prompts for app generation
- **FR-2.6**: System shall generate single-file HTML applications with embedded CSS and JavaScript
- **FR-2.7**: System shall validate generated HTML structure before deployment
- **FR-2.8**: System shall enforce zero external dependencies in generated code

### 2.3 App Deployment & Hosting
- **FR-3.1**: System shall create unique directories for each app on Puter filesystem
- **FR-3.2**: System shall write generated HTML to Puter filesystem
- **FR-3.3**: System shall create hosted sites via Puter hosting service
- **FR-3.4**: System shall register apps in Puter app catalog
- **FR-3.5**: System shall generate unique subdomains for hosted apps
- **FR-3.6**: System shall handle subdomain collisions with random name generation
- **FR-3.7**: System shall open deployed apps in new browser tabs

### 2.4 App Management
- **FR-4.1**: System shall store all app metadata in local Fireproof database
- **FR-4.2**: System shall display list of all created apps
- **FR-4.3**: System shall support searching apps by name, title, or prompt
- **FR-4.4**: System shall support filtering apps by favorite status
- **FR-4.5**: System shall support sorting apps by date, name, or views
- **FR-4.6**: System shall allow users to mark apps as favorites
- **FR-4.7**: System shall track view count for each app
- **FR-4.8**: System shall support app deletion with cleanup
- **FR-4.9**: System shall support bulk selection and deletion of apps
- **FR-4.10**: System shall support app launching via Puter app launcher or URL

### 2.5 Code Editing & Preview
- **FR-5.1**: System shall display live preview of apps in sandboxed iframe
- **FR-5.2**: System shall support toggling between preview and code view
- **FR-5.3**: System shall provide editable textarea for code modification
- **FR-5.4**: System shall display character count for code
- **FR-5.5**: System shall enable redeployment after code edits
- **FR-5.6**: System shall maintain original code when editing

### 2.6 Version Control
- **FR-6.1**: System shall create initial version record on app creation
- **FR-6.2**: System shall increment version number on each update
- **FR-6.3**: System shall store code snapshot for each version
- **FR-6.4**: System shall display version history for selected app
- **FR-6.5**: System shall support restoring previous versions
- **FR-6.6**: System shall associate versions with parent app

### 2.7 Templates
- **FR-7.1**: System shall provide 12 pre-built app templates
- **FR-7.2**: System shall display templates in modal with icons
- **FR-7.3**: System shall auto-fill prompt and title when template selected
- **FR-7.4**: System shall allow clearing selected template
- **FR-7.5**: Template categories: Todo, Calculator, Notes, Timer, Weather, Kanban, Password Generator, Quiz, Expense Tracker, Drawing, Music Player, Chat

### 2.8 Import/Export
- **FR-8.1**: System shall export all apps as JSON file
- **FR-8.2**: System shall export single app as JSON file
- **FR-8.3**: System shall import apps from JSON files
- **FR-8.4**: System shall handle single or multiple app imports
- **FR-8.5**: System shall generate new IDs for imported apps
- **FR-8.6**: System shall mark imported apps with flag

### 2.9 Sharing
- **FR-9.1**: System shall generate shareable links with base64-encoded app data
- **FR-9.2**: System shall include prompt, code, and title in share link
- **FR-9.3**: System shall support copying share links to clipboard

### 2.10 Analytics
- **FR-10.1**: System shall calculate total app count
- **FR-10.2**: System shall calculate total favorites count
- **FR-10.3**: System shall calculate total views across all apps
- **FR-10.4**: System shall calculate unique models used
- **FR-10.5**: System shall calculate average code size
- **FR-10.6**: System shall calculate total version count
- **FR-10.7**: System shall display analytics in toggleable dashboard

### 2.11 Logging
- **FR-11.1**: System shall log all operations with timestamps
- **FR-11.2**: System shall maintain last 16 log entries
- **FR-11.3**: System shall color-code log messages (success, error, info)
- **FR-11.4**: System shall display log panel when operations occur

## 3. Technical Requirements

### 3.1 Frontend Technology
- **TR-1.1**: Application shall be built with React 18
- **TR-1.2**: Application shall use Babel Standalone for JSX transpilation
- **TR-1.3**: Application shall use Tailwind CSS v4 via browser CDN
- **TR-1.4**: Application shall load all dependencies via ESM from esm.sh
- **TR-1.5**: Application shall use import maps for module resolution
- **TR-1.6**: Application shall not require build step

### 3.2 Database
- **TR-2.1**: Application shall use Fireproof (use-vibes) as local-first database
- **TR-2.2**: Database shall use "puter-apps-v6" as database name
- **TR-2.3**: Database shall support LiveQuery for reactive updates
- **TR-2.4**: Database shall index documents by type field
- **TR-2.5**: Database shall support two document types: "app" and "version"

### 3.3 External APIs
- **TR-3.1**: Application shall integrate Puter SDK v2
- **TR-3.2**: Application shall use Puter AI API for code generation
- **TR-3.3**: Application shall fetch models from `https://api.puter.com/puterai/chat/models/`
- **TR-3.4**: Application shall use Puter filesystem API
- **TR-3.5**: Application shall use Puter hosting API
- **TR-3.6**: Application shall use Puter app registry API

### 3.4 Security
- **TR-4.1**: Generated apps shall run in sandboxed iframes
- **TR-4.2**: Iframe sandbox shall allow: scripts, forms, modals, popups
- **TR-4.3**: App names shall be sanitized (lowercase, alphanumeric + hyphens)
- **TR-4.4**: HTML validation shall check for DOCTYPE declaration
- **TR-4.5**: Application shall use Puter OAuth for authentication

### 3.5 Performance
- **TR-5.1**: Puter SDK shall load asynchronously
- **TR-5.2**: Model list shall fetch once on mount
- **TR-5.3**: Database queries shall be reactive via LiveQuery
- **TR-5.4**: Log array shall limit to last 16 entries
- **TR-5.5**: Application shall prevent duplicate operations during generation

### 3.6 UI/UX
- **TR-6.1**: Application shall use neomorphic design system
- **TR-6.2**: Application shall support responsive layout (mobile + desktop)
- **TR-6.3**: Application shall use two-tab interface (Build, Apps)
- **TR-6.4**: Application shall display loading states during async operations
- **TR-6.5**: Application shall show disabled states on buttons during operations
- **TR-6.6**: Application shall use emoji icons throughout interface

### 3.7 Browser Compatibility
- **TR-7.1**: Application shall require ES6+ JavaScript support
- **TR-7.2**: Application shall require import maps support
- **TR-7.3**: Application shall target modern browsers (Chrome, Firefox, Safari, Edge)

## 4. Data Requirements

### 4.1 App Document Schema
```
_id: string (auto-generated)
type: "app"
prompt: string (required)
code: string (required)
subdomain: string (required)
hostedUrl: string (required)
appName: string (required)
appUid: string (required)
appTitle: string (required)
model: string (required)
dir: string (required)
createdAt: number (timestamp)
updatedAt: number (timestamp, optional)
views: number (default: 0)
favorite: boolean (default: false)
tags: array (default: [])
version: number (default: 1)
```

### 4.2 Version Document Schema
```
_id: string (auto-generated)
type: "version"
appId: string (required, references app._id)
code: string (required)
version: number (required)
createdAt: number (timestamp)
note: string (optional)
```

## 5. Constraints

### 5.1 System Constraints
- **C-1.1**: No build process or compilation required
- **C-1.2**: All code runs client-side in browser
- **C-1.3**: Requires active internet connection for CDN resources
- **C-1.4**: Requires Puter account for full functionality

### 5.2 Business Constraints
- **C-2.1**: Depends on Puter platform availability
- **C-2.2**: Subject to Puter AI API rate limits
- **C-2.3**: Subject to Puter storage quotas

### 5.3 Technical Constraints
- **C-3.1**: Generated apps must be single HTML files
- **C-3.2**: No external dependencies allowed in generated code
- **C-3.3**: Old directories accumulate on filesystem (no cleanup)

## 6. Non-Functional Requirements

### 6.1 Usability
- **NFR-1.1**: Interface shall be intuitive for non-technical users
- **NFR-1.2**: Operations shall provide clear feedback via logs
- **NFR-1.3**: Error messages shall be user-friendly

### 6.2 Reliability
- **NFR-2.1**: All async operations shall have error handling
- **NFR-2.2**: System shall handle API failures gracefully
- **NFR-2.3**: System shall handle name collisions automatically

### 6.3 Maintainability
- **NFR-3.1**: Code shall follow React best practices
- **NFR-3.2**: State management shall be clear and predictable
- **NFR-3.3**: Components shall be self-contained

### 6.4 Scalability
- **NFR-4.1**: App list shall handle hundreds of apps
- **NFR-4.2**: Database operations shall remain performant with growth
- **NFR-4.3**: Search and filter operations shall be efficient

## 7. Acceptance Criteria

### 7.1 App Creation Flow
- User can sign in with Puter account
- User can select AI model and provider
- User can enter app description
- System generates valid HTML code
- System deploys to Puter hosting
- System registers in Puter app catalog
- System saves to local database
- App opens in new tab automatically

### 7.2 App Management Flow
- User can view list of all apps
- User can search apps by keywords
- User can filter by favorites
- User can sort by various criteria
- User can mark apps as favorites
- User can delete apps
- User can launch apps

### 7.3 Editing Flow
- User can view app code
- User can edit code in textarea
- User can preview changes in iframe
- User can redeploy updated code
- System increments version number
- System saves version history

### 7.4 Import/Export Flow
- User can export all apps as JSON
- User can export single app as JSON
- User can import apps from JSON file
- Imported apps appear in app list
- Imported apps are fully functional
