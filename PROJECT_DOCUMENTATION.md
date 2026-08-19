# 📘 Project Documentation: AdPulse CRM & Leads Analytics Dashboard

**AdPulse CRM** is a real-time, lightweight Analytics & Lead Management platform built with **React**, **Vite**, and **Vanilla CSS**. It dynamically streams, visualizes, and organizes inbound customer leads directly from a live **Google Spreadsheet** without requiring complex backend servers or database infrastructure.

---

## 📑 Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture & Data Flow](#3-system-architecture--data-flow)
4. [Live Google Sheet Schema](#4-live-google-sheet-schema)
5. [Core Modules & Features](#5-core-modules--features)
6. [Design System & Aesthetics](#6-design-system--aesthetics)
7. [Directory & File Structure](#7-directory--file-structure)
8. [Setup, Execution & Deployment](#8-setup-execution--deployment)

---

## 1. Executive Summary

- **Primary Goal**: Provide a fast, responsive, and visually clean web dashboard to monitor inbound customer leads, analyze geographic demand (City), identify peak customer availability windows (Time Slots), and enable 1-click sales outreach (WhatsApp & Phone calls).
- **Data Source**: Live public Google Sheet (`https://docs.google.com/spreadsheets/d/1LLvUhgc55mqXU0MYirIZhEGdtGJ63o2faOkEdUlyhm4/edit?usp=sharing`).
- **Live Sync**: Automatically polls the Google Spreadsheet in the background (default: every 30 seconds) and updates all metric counters, charts, and table rows without page reloads.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | **React 18** | Component-based UI and reactive state management |
| **Build Tool & Bundler** | **Vite 8** | Ultra-fast Hot Module Replacement (HMR) and optimized production compilation |
| **Styling & Theme** | **Vanilla CSS (Design Tokens)** | High-end, clean white/slate luxury design system (Stripe / Linear / Apple aesthetic) |
| **Data Visualization** | **Recharts** | Responsive SVG charts (Donut Pie Charts, Categorical Bar Charts, Area Timeline Charts) |
| **Data Parsing** | **PapaParse** | Streaming remote CSV data from Google Sheets and local CSV file drops |
| **Icons** | **Lucide React** | Modern, lightweight SVG iconography |
| **Persistence** | **Web Storage API (localStorage)** | Persists custom CRM status overrides, follow-up notes, call counts, and user settings |

---

## 3. System Architecture & Data Flow

```
┌──────────────────────────────────────────────────────────┐
│                   Google Spreadsheet                     │
│  (https://docs.google.com/spreadsheets/d/.../pub?output=csv)│
└────────────────────────────┬─────────────────────────────┘
                             │ (Periodic Polling / Manual Fetch)
                             ▼
┌──────────────────────────────────────────────────────────┐
│               `useSheetData` Hook Engine                 │
│  - URL Normalization (Converts /edit to /export?csv)     │
│  - PapaParse CSV Streamer                                │
│  - Smart Header Auto-Detection & Mapping                 │
└────────────────────────────┬─────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│ `dataTransformers.js`     │ │ `localStorage` Cache      │
│ - computeKPIs()           │ │ - CRM Status Overrides    │
│ - getCityBreakdown()      │ │ - Discussion Notes        │
│ - getContactSlotBreakdown │ │ - Call Attempts Log       │
│ - getDailyTrends()        │ │ - Column Mapping Config   │
└─────────────┬─────────────┘ └─────────────┬─────────────┘
              │                             │
              └──────────────┬──────────────┘
                             ▼
┌──────────────────────────────────────────────────────────┐
│                   User Interface (UI)                    │
│  ├── 1. Overview Page (KPIs, City Donut, Slot Bar, Table)│
│  ├── 2. Leads & CRM Page (Full-Width Table, Multi-Filters)│
│  └── 3. Sheet Settings Page (URL Manager, Auto-Sync)     │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Live Google Sheet Schema

The dashboard connects directly to the spreadsheet and maps the following 7 columns:

| # | Spreadsheet Column Name | Mapped Entity | Data Type | Usage in Dashboard |
|---|---|---|---|---|
| 1 | `Timestamp` | `Submission Date` | Date string | Timeline filtering and daily inflow tracking |
| 2 | `Full Name` | `Customer Name` | String | Lead Profile header & identification |
| 3 | `Phone` | `Phone Number` | String / Numeric | 📞 1-Click Phone Call (`tel:`) & 💬 1-Click WhatsApp (`wa.me`) |
| 4 | `City` | `City / Location` | String | **City & Territory Distribution Donut Chart** |
| 5 | `Previus Attemps ` | `Previous Attempts` | Integer | Follow-up call cadence counter & `+ Log Call` trigger |
| 6 | `Contact ` | `Preferred Contact Slot` | Categorical (`Morning`, `Afternoon`, `Evening`) | **Best Time to Call & Connect Bar Chart** |
| 7 | `Time` | `Specific Time` | Time string | Scheduled appointment time |

---

## 5. Core Modules & Features

### 5.1 Overview Page (`src/pages/Overview.jsx`)
- **Live Status Header**: Displays Google Sheet connection badge, active sync state, and direct external link to the live spreadsheet.
- **Executive KPI Cards**:
  1. **Total Inbound Leads**: Live count of prospective customer records in the spreadsheet.
  2. **Active Cities Covered**: Count of unique cities and regions represented.
- **City & Territory Distribution Donut (`CityDonut.jsx`)**:
  - Interactive Donut chart showing customer lead proportions across cities.
  - Multi-colored legend with lead counts and percentages.
- **Best Time to Call & Connect Bar Chart (`ContactSlotBar.jsx`)**:
  - Categorical horizontal bar chart showing when leads prefer to be called (*Morning*, *Afternoon*, *Evening*).
- **Recent Lead Activity Table (`LeadTable.jsx`)**:
  - Preview of the most recent leads with 1-click action buttons.
- **Inbound Lead Volume Timeline (`SpendTrendChart.jsx`)**:
  - Area chart positioned at the bottom tracking inflow volume over time.

---

### 5.2 Leads & CRM Page (`src/pages/Leads.jsx`)
- **Full-Width Leads Table (`LeadTable.jsx`)**:
  - **Live Search**: Instant keyword search across customer names, phone numbers, cities, and discussion notes.
  - **Status Filter**: Filter by pipeline stage (`New`, `Contacted`, `In Progress`, `Qualified`, `Converted`, `Lost`).
  - **City Filter**: Dynamic dropdown populated with unique cities from the spreadsheet.
  - **Preferred Slot Filter**: Filter by `Morning`, `Afternoon`, or `Evening`.
  - **Action Triggers**:
    - 📞 **1-Click Dial**: Initiates phone call with `tel:<phone>`.
    - 💬 **1-Click WhatsApp**: Opens WhatsApp chat via `wa.me/<phone>` with pre-filled greeting message.
    - 📋 **Copy Phone Number**: Copies clean number to clipboard with visual checkmark feedback.
  - **CSV Export**: Generates and downloads a clean CSV file matching the exact spreadsheet schema.
- **Slide-over CRM Profile & Notes Drawer (`LeadDetailModal.jsx`)**:
  - Displays complete customer information.
  - Editable pipeline status selector.
  - **Discussion Notes Editor**: Allows sales reps to type notes, follow-up history, and customer requirements (saved to `localStorage`).
  - **Call Logger (`+ Log Call`)**: Increments call attempt counters.

---

### 5.3 Sheet Settings Page (`src/pages/Settings.jsx` & `SheetConfig.jsx`)
- **Google Sheets Public URL Connector**: Input field with live connection test button.
- **Local CSV Dropzone**: Drag-and-drop or file upload for local CSV analysis.
- **Auto-Refresh Scheduler**: Configurable polling interval (`30s`, `1m`, `5m`, `15m`, or `Manual`).
- **7-Field Column Mapping Matrix**: Smart auto-detection and manual overrides for spreadsheet headers.

---

## 6. Design System & Aesthetics

The application follows a **Clean Light Luxury Aesthetic** (similar to Apple, Linear, and Stripe):

- **Backgrounds**: Crisp pure white (`#FFFFFF`) with subtle off-white canvas (`#F8FAFC`).
- **Borders & Dividers**: Ultra-fine borders (`1px solid #E2E8F0`) with soft slate hover states (`#CBD5E1`).
- **Typography**:
  - Headings: `Outfit` / `Plus Jakarta Sans` (Bold, clean letter-spacing)
  - Body: `Plus Jakarta Sans`
  - Numeric & Metrics: `JetBrains Mono`
- **Color Palette**:
  - Primary / Brand: Indigo (`#4F46E5` / `#6366F1`)
  - Success / Converted: Emerald (`#059669` / `#ECFDF5`)
  - Warning / Discussion: Amber (`#D97706` / `#FFFBEB`)
  - Info / Contact: Sky Blue (`#0284C7` / `#EFF6FF`)
  - Danger / Lost: Rose (`#E11D48` / `#FFF1F2`)

---

## 7. Directory & File Structure

```
Analytics Dashboard/
├── index.html                           # Main HTML5 entry point with Google Fonts
├── package.json                         # Project dependencies and npm scripts
├── vite.config.js                       # Vite configuration
├── PROJECT_DOCUMENTATION.md             # Complete project technical documentation
│
└── src/
    ├── main.jsx                         # React root mount entry point
    ├── App.jsx                          # Main application layout and routing
    ├── index.css                        # Design System, tokens, utilities & animations
    │
    ├── config/
    │   └── sheets.js                    # Google Sheet URL, 7-column map & mock generator
    │
    ├── hooks/
    │   └── useSheetData.js              # Remote CSV fetching, auto-polling & cache hook
    │
    ├── utils/
    │   └── dataTransformers.js          # Aggregators for KPIs, city split & CSV exports
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.jsx              # Side navigation bar with live sheet indicator
    │   │   └── TopBar.jsx               # Date range filter & manual sync controls
    │   │
    │   ├── kpi/
    │   │   └── KPICard.jsx              # Minimalist metric card with color accents
    │   │
    │   ├── charts/
    │   │   ├── CityDonut.jsx            # City & territory geographic distribution donut
    │   │   ├── ContactSlotBar.jsx       # Preferred call time slot distribution bar chart
    │   │   └── SpendTrendChart.jsx      # Inbound lead volume timeline area chart
    │   │
    │   ├── leads/
    │   │   ├── LeadTable.jsx            # Full-width CRM table with search & filters
    │   │   └── LeadDetailModal.jsx      # Slide-over customer profile & notes editor
    │   │
    │   └── settings/
    │       └── SheetConfig.jsx          # Google Sheet URL config & column mapping matrix
    │
    └── pages/
        ├── Overview.jsx                 # Executive overview & visual intelligence
        ├── Leads.jsx                    # Leads management & CRM operations
        └── Settings.jsx                 # Data sync & spreadsheet connection settings
```

---

## 8. Setup, Execution & Deployment

### 8.1 Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 8.2 Installation & Local Development
```bash
# 1. Clone or navigate to the project directory
cd "c:\Users\ASUS\Desktop\Analytics Dashbaord"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open your browser at **`http://localhost:5173/`**.

### 8.3 Production Build
```bash
# Compile and optimize production bundle
npm run build

# Preview production build locally
npm run preview
```
The compiled static assets will be output to the `dist/` directory, ready to be hosted on Vercel, Netlify, Cloudflare Pages, or AWS S3.
