# Puter App Factory - Design Specification

## 1. Architecture Overview

### 1.1 System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Browser Client                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │              React Application                    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────┐  │  │
│  │  │   Build    │  │    Apps    │  │  Preview  │  │  │
│  │  │    Tab     │  │    Tab     │  │   Panel   │  │  │
│  │  └────────────┘  └────────────┘  └───────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↓                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │          Fireproof Database (Local)               │  │
│  │  - Apps Collection    - Versions Collection       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Puter Platform API                     │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │    Auth    │  │ Filesystem │  │    AI Service    │  │
│  │   OAuth    │  │  mkdir()   │  │  chat(model)     │  │
│  └────────────┘  │  write()   │  │  models list     │  │
│  ┌────────────┐  └────────────┘  └──────────────────┘  │
│  │  Hosting   │  ┌────────────┐                         │
│  │  create()  │  │  Apps API  │                         │
│  │  delete()  │  │  create()  │                         │
│  └────────────┘  │  launch()  │                         │
│                  └────────────┘                         │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Component Hierarchy
```
App (Root)
├── Header
│   ├── Logo/Title
│   ├── Analytics Button
│   ├── Export Button
│   ├── User Info / Sign In Button
│   └── Analytics Panel (conditional)
├── Tab Navigation
│   ├── Build Tab Button
│   └── Apps Tab Button
├── Left Panel (Sidebar)
│   ├── Build Form (if Build tab active)
│   │   ├── Template Button
│   │   ├── Provider Filter
│   │   ├── Model Selector
│   │   ├── Prompt Textarea
│   │   ├── App Name Input
│   │   ├── App Title Input
│   │   └── Build & Deploy Button
│   ├── Apps List (if Apps tab active)
│   │   ├── Search Input
│   │   ├── Filter/Sort Controls
│   │   ├── Bulk Mode Toggle
│   │   └── App Cards
│   └── Log Panel
├── Preview Panel (Right, 2 columns)
│   ├── Preview Header
│   │   ├── Window Controls (dots)
│   │   ├── App Title/Version
│   │   ├── Version History Button
│   │   ├── Share Button
│   │   ├── Export Button
│   │   ├── Code Toggle Button
│   │   ├── Launch Button
│   │   └── Redeploy Button (conditional)
│   ├── Preview Content
│   │   ├── Iframe (preview mode)
│   │   └── Textarea (code mode)
│   └── App Details Card (if app selected)
└── Modals
    ├── Template Modal
    ├── Version History Modal
    ├── Share Link Modal
    └── Export/Import Modal
```

### 1.3 Data Flow
```
User Input → React State → Actions
                ↓
        Validation/Processing
                ↓
        ┌───────┴────────┐
        ↓                ↓
   Puter API       Fireproof DB
        ↓                ↓
   Response         LiveQuery
        ↓                ↓
   React State ← ─ ─ ─ ─ ┘
        ↓
   UI Update
```

## 2. UI Design System

### 2.1 Neomorphic Design Language

#### Color Palette
```css
/* Background */
--bg-base: #e8e8e8;

/* Primary Accent */
--primary: #dc2626;
--primary-dark: #b91c1c;
--primary-light: #ef4444;

/* Text Colors */
--text-primary: #1a1a1a;
--text-secondary: #666666;
--text-tertiary: #888888;
--text-placeholder: #999999;

/* Borders */
--border: #d0d0d0;

/* Shadows (for neomorphism) */
--shadow-light: #ffffff;
--shadow-dark: #c5c5c5;
```

#### Neomorphic Styles
```css
/* Raised Surface */
.neu {
  background: #e8e8e8;
  box-shadow: 8px 8px 16px #c5c5c5,
              -8px -8px 16px #ffffff;
}

/* Inset/Pressed Surface */
.neu-inset {
  background: #e8e8e8;
  box-shadow: inset 4px 4px 8px #c5c5c5,
              inset -4px -4px 8px #ffffff;
}

/* Interactive Button */
.neu-btn {
  background: #e8e8e8;
  box-shadow: 5px 5px 10px #c5c5c5,
              -5px -5px 10px #ffffff;
  transition: all 150ms;
}

.neu-btn:hover {
  box-shadow: 2px 2px 5px #c5c5c5,
              -2px -2px 5px #ffffff;
}

.neu-btn:active {
  box-shadow: inset 4px 4px 8px #c5c5c5,
              inset -4px -4px 8px #ffffff;
}

/* Red Accent Button */
.neu-btn-red {
  background: #dc2626;
  color: white;
  box-shadow: 5px 5px 10px #c5c5c5,
              -5px -5px 10px #ffffff;
}

.neu-btn-red:active {
  box-shadow: inset 4px 4px 8px #b91c1c,
              inset -4px -4px 8px #ef4444;
}

/* Black Accent Button */
.neu-btn-black {
  background: #1a1a1a;
  color: white;
  box-shadow: 5px 5px 10px #c5c5c5,
              -5px -5px 10px #ffffff;
}

.neu-btn-black:active {
  box-shadow: inset 4px 4px 8px #000,
              inset -4px -4px 8px #333;
}
```

### 2.2 Typography
```css
/* Primary Heading */
h1 {
  font-size: 2rem;        /* 32px */
  font-weight: 900;       /* Black */
  color: #1a1a1a;
}

/* Secondary Heading */
h2 {
  font-size: 1.5rem;      /* 24px */
  font-weight: 900;
  color: #1a1a1a;
}

/* Card Title */
h3 {
  font-size: 1.25rem;     /* 20px */
  font-weight: 900;
  color: #1a1a1a;
}

/* Body Text */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", 
               Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 0.875rem;    /* 14px */
  color: #666;
}

/* Monospace (code) */
.font-mono {
  font-family: "SF Mono", Monaco, "Cascadia Code", 
               "Courier New", monospace;
  font-size: 0.75rem;     /* 12px */
}

/* Labels */
label {
  font-size: 0.75rem;     /* 12px */
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1a1a1a;
}
```

### 2.3 Spacing System
```css
/* Based on 4px grid */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
```

### 2.4 Border Radius
```css
--radius-sm: 0.5rem;    /* 8px - small elements */
--radius-md: 0.75rem;   /* 12px - buttons, inputs */
--radius-lg: 1rem;      /* 16px - cards */
--radius-xl: 1.5rem;    /* 24px - panels */
--radius-2xl: 2rem;     /* 32px - major sections */
--radius-full: 9999px;  /* Fully rounded */
```

### 2.5 Iconography
The application uses emoji icons throughout for visual clarity:
- ⚡ Lightning - Speed/Power
- 📱 Mobile Phone - Apps
- 🔨 Hammer - Build
- 📊 Chart - Analytics
- 📦 Package - Export/Import
- 🔗 Link - Share
- 📚 Books - Version History
- ⭐ Star - Favorite
- 🗑️ Trash - Delete
- ▶️ Play - Launch
- 👁️ Eye - Views
- ✅ Checkmark - Success
- ❌ X Mark - Error

## 3. Layout Design

### 3.1 Responsive Grid
```
Desktop (>1024px):
┌─────────────────────────────────────────────┐
│                  Header                      │
├─────────┬───────────────────────────────────┤
│  Left   │                                   │
│  Panel  │        Preview Panel              │
│ (33%)   │           (67%)                   │
│         │                                   │
└─────────┴───────────────────────────────────┘

Mobile (<1024px):
┌──────────────────┐
│     Header       │
├──────────────────┤
│   Left Panel     │
│    (100%)        │
├──────────────────┤
│  Preview Panel   │
│    (100%)        │
└──────────────────┘
```

### 3.2 Component Layouts

#### Header Layout
```
┌─────────────────────────────────────────────────────────┐
│ ⚡ PUTER APP FACTORY     [📊] [📦] [👤 user] [Logout]  │
│ N models • M apps • K views                             │
│                                                         │
│ [Analytics Panel - 6 column grid] (if visible)         │
└─────────────────────────────────────────────────────────┘
```

#### Tab Navigation
```
┌─────────────────────────────────────┐
│  [🔨 Build]  [📱 Apps]              │
└─────────────────────────────────────┘
```

#### Build Form Layout
```
┌─────────────────────────────────────┐
│  [🎨 Choose Template]               │
│                                     │
│  Provider: [All][OpenAI][...]       │
│                                     │
│  Model: [dropdown ▼]                │
│                                     │
│  App Description:                   │
│  [textarea.....................]    │
│  [...........................]    │
│                                     │
│  App Name:    │  Title:            │
│  [input....]  │  [input.......]    │
│                                     │
│  [🚀 Build & Deploy]                │
└─────────────────────────────────────┘
```

#### Apps List Layout
```
┌─────────────────────────────────────┐
│  [🔍 Search apps...............]    │
│  [⭐ Favorites][Sort▼][☑️ Select]  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📱 App Title         [⭐][▶]│   │
│  │ v1 • 👁️ 5                  │   │
│  │ Description...              │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 📱 Another App      [☆][▶] │   │
│  │ v2 • 👁️ 12                 │   │
│  │ Description...              │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Preview Panel Layout
```
┌───────────────────────────────────────────────┐
│ ● ● ●  App Name v2   [📚][🔗][📤][</>][Launch]│
├───────────────────────────────────────────────┤
│                                               │
│          [Iframe Preview or Code Editor]      │
│                                               │
│                                               │
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐
│ 📱 App Details                                │
│ ID: app-name • Version: 2 • Views: 5          │
│ URL: https://app.puter.site                   │
│ Model: gpt-4o-mini                            │
│                          [⭐][🚀 Launch][🗑️]  │
└───────────────────────────────────────────────┘
```

## 4. Interaction Design

### 4.1 User Flows

#### Primary Flow: Create App
```
1. Sign In (if not authenticated)
   → Click "Sign In Free"
   → Redirect to Puter OAuth
   → Return to app

2. Select Template (optional)
   → Click "🎨 Choose Template"
   → Modal opens with 12 templates
   → Click template card
   → Prompt and title auto-filled

3. Configure
   → Select provider filter
   → Select model from dropdown
   → Enter/edit description
   → Enter app name (optional)
   → Enter title (optional)

4. Generate
   → Click "🚀 Build & Deploy"
   → Button disabled, shows "⏳ Building..."
   → Log panel shows progress
   → Preview shows spinner

5. Result
   → App appears in preview
   → Opens in new tab
   → Added to apps list
   → Form cleared
```

#### Secondary Flow: Edit App
```
1. Select App
   → Switch to Apps tab
   → Search/filter as needed
   → Click app card

2. View Code
   → Click "</>" toggle
   → Code editor appears

3. Edit
   → Modify code in textarea
   → "Redeploy" button appears

4. Redeploy
   → Click "Redeploy"
   → Progress shown in log
   → Version incremented
   → New tab opens with updated app
```

### 4.2 State Indicators

#### Loading States
```
Button States:
- Default: "🚀 Build & Deploy"
- Loading: "⏳ Building..." (disabled)
- Success: Returns to default

Preview States:
- Empty: Shows placeholder with "📱 APP PREVIEW"
- Loading: Shows spinner ⚙️ with "BUILDING..."
- Loaded: Shows iframe or code editor
```

#### Error States
```
- Log shows "❌ Error: {message}" in red
- Button returns to active state
- User can retry
```

#### Selection States
```
App Cards:
- Unselected: Normal neu style
- Selected: neu-inset style (pressed look)
- Hover: Slightly darker background

Favorites:
- Not favorited: Empty star ☆
- Favorited: Filled star ⭐
```

### 4.3 Animations & Transitions

#### Button Interactions
```css
transition: all 150ms ease-in-out;

/* Shadow changes on hover/active create 3D effect */
```

#### Modal Entrance
```css
/* Fade in background */
background: rgba(0, 0, 0, 0);
animation: fadeIn 200ms forwards;

/* Scale in content */
transform: scale(0.9);
animation: scaleIn 200ms ease-out forwards;
```

#### Loading Spinner
```css
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## 5. Modal Designs

### 5.1 Template Modal
```
┌────────────────────────────────────────┐
│  🎨 App Templates                      │
│                                        │
│  ┌────┐ ┌────┐ ┌────┐                 │
│  │ ✅ │ │ 🔢 │ │ 📝 │                 │
│  │Todo│ │Calc│ │Note│                 │
│  └────┘ └────┘ └────┘                 │
│  ┌────┐ ┌────┐ ┌────┐                 │
│  │ ⏱️  │ │ 🌤️ │ │ 📋 │                 │
│  │Timer│ │Wthr│ │Kanb│                 │
│  └────┘ └────┘ └────┘                 │
│  [more templates...]                   │
│                                        │
│  [Close]                               │
└────────────────────────────────────────┘
```

### 5.2 Version History Modal
```
┌────────────────────────────────────────┐
│  📚 Version History                    │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Version 3               [Restore]│ │
│  │ 2024-12-26 10:30 AM             │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │ Version 2               [Restore]│ │
│  │ 2024-12-25 3:15 PM              │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │ Version 1 (Initial)     [Restore]│ │
│  │ 2024-12-24 9:00 AM              │ │
│  └──────────────────────────────────┘ │
│                                        │
│  [Close]                               │
└────────────────────────────────────────┘
```

### 5.3 Share Link Modal
```
┌────────────────────────────────────────┐
│  🔗 Share App                          │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ https://origin.com?share=abc123  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  [📋 Copy Link]  [Close]              │
└────────────────────────────────────────┘
```

### 5.4 Export/Import Modal
```
┌────────────────────────────────────────┐
│  📦 Export / Import                    │
│                                        │
│  [📤 Export All Apps (JSON)]          │
│  [📥 Import Apps (JSON)]              │
│                                        │
│  [Close]                               │
└────────────────────────────────────────┘
```

## 6. Accessibility Considerations

### 6.1 Keyboard Navigation
- All interactive elements focusable
- Visible focus indicators
- Tab order follows logical flow
- Enter/Space activate buttons
- Escape closes modals

### 6.2 Screen Reader Support
- Semantic HTML elements
- ARIA labels for icon buttons
- Status announcements for async operations
- Proper heading hierarchy

### 6.3 Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Primary red (#dc2626) on light gray passes WCAG AA
- All text meets contrast requirements

## 7. Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  /* Single column layout */
  /* Larger touch targets (min 44x44px) */
  /* Stack navigation */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* Two column layout */
  /* Adjusted spacing */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Three column layout */
  /* Full feature set visible */
}
```

## 8. Design Tokens

### 8.1 Complete Token System
```javascript
const designTokens = {
  colors: {
    background: '#e8e8e8',
    primary: '#dc2626',
    primaryDark: '#b91c1c',
    primaryLight: '#ef4444',
    textPrimary: '#1a1a1a',
    textSecondary: '#666666',
    textTertiary: '#888888',
    border: '#d0d0d0',
    shadowLight: '#ffffff',
    shadowDark: '#c5c5c5',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    full: '9999px',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
  },
  fontWeight: {
    normal: 400,
    bold: 700,
    black: 900,
  },
};
```

This design specification provides a comprehensive blueprint for the UI/UX of the Puter App Factory application, ensuring consistency and maintainability.
