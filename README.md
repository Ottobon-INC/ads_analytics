# 📊 Ad Analytics — Live Leads & CRM Dashboard

A clean, modern Analytics and Lead Management Dashboard built with **React**, **Vite**, and **Vanilla CSS**, dynamically connected to a live **Google Spreadsheet**.

---

## 🚀 Features

- **🔴 Live Google Sheet Sync**: Streams lead data dynamically from public Google Sheets (with 30-second auto-refresh and manual sync).
- **🗺️ City & Territory Distribution**: Interactive Donut chart displaying geographic lead density.
- **⏰ Best Time to Call Analytics**: Horizontal bar chart comparing prospect availability across Morning, Afternoon, and Evening slots.
- **📈 Inbound Volume Timeline**: Area chart tracking daily lead inflow over time.
- **📋 CRM Data Table**:
  - 🔍 Live keyword search across names, phone numbers, cities, and notes.
  - 🏷️ Dynamic multi-filters (Status, City, Call Slot).
  - 📞 **1-Click Phone Call** (`tel:`).
  - 💬 **1-Click WhatsApp Chat** (`wa.me` with pre-filled greeting).
  - 📝 Slide-over Lead Profile & Discussion Notes Editor.
  - 📥 1-Click CSV Export matching exact spreadsheet schema.

---

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite 8
- **Styling**: Vanilla CSS Design Tokens (Clean Luxury White Palette)
- **Charts**: Recharts
- **CSV Stream Engine**: PapaParse
- **Icons**: Lucide React

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ad-analytics.git
cd ad-analytics
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 📄 License
MIT License
