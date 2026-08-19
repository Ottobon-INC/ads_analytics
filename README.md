# 📊 Ad Analytics — Live Leads & CRM Dashboard

A clean, modern Analytics and Lead Management Dashboard built with **React**, **Vite**, and **Vanilla CSS**, dynamically connected to a live **Google Spreadsheet**.

---

## 🚀 Features

- **🔴 Live Google Sheet Sync**: Streams lead data dynamically from public Google Sheets (with 30-second auto-refresh and manual sync).
- **🗺️ City & Territory Distribution**: Interactive Donut chart displaying geographic lead density (*Visakhapatnam*).
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
- **Containerization**: Docker & Nginx Alpine (Port 8081)

---

## 🐳 Docker Deployment on Ubuntu VPS (Port 8081)

```bash
# 1. Clone the repository
git clone https://github.com/Ottobon-INC/ads_analytics.git
cd ads_analytics

# 2. Build and launch container on Port 8081
docker-compose up -d --build
```
Access dashboard at **`http://YOUR_SERVER_IP:8081/`**.

---

## 📦 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server on Port 8081
npm run dev
```
Open **`http://localhost:8081`** in your browser.

---

## 📄 License
MIT License
