# 💜 Lavender.Store Ecosystem 

An advanced, production-ready E-commerce Marketplace built with **Ionic Framework** and **Angular**. This application features a premium sleek "Lavender & Neon Glow" dark theme tailored for smooth UX, interactive hardware/smart nodes inventory management, dynamic ad banners, and comprehensive vendor capabilities.

---

## 🚀 Key Features

### 📢 1. Slide-by-Slide Smart Marquee Ads
* Implemented a seamless **automated CSS-carousel** that cycles through premium featured advertisement banners dynamically without overlapping.
* Responsive layouts containing absolute badge tags, customized typography, and smooth state transitions.

### 🔍 2. Soft-Rounded Dynamic Product Filtering
* Intuitive horizontal category horizontal scrolling tabs enabling quick product lookups (e.g., *Smart Nodes, Toolkits, Automations, Premium Bundles*).
* Interactive UI indicators specifying current active tabs with distinct neon highlights.

### 🛡️ 3. Advanced Vendor & Asset Dashboard
* **Dynamic Category Assignment:** Vendors can select strict categories using a standardized native dropdown to prevent database inconsistencies.
* **Smart Stock Counter:** Integrated a precise incremental/decremental counter to manage initial warehouse inventory.
* **Dynamic Tag System (Colors Management):** Built a chip-based temporary tag system allowing vendors to insert and preview customized product attributes (like neon, lavender, black) dynamically before data validation and deployment.
* **Camera Streaming & Assets Capturing:** Embedded WebRTC stream hooks to capture real-time profile thumbnails or physical asset shots using high-end device cameras (`facingMode: environment`).

### 📦 4. Persistent Client-Side State
* Seamlessly localizes product mutations, likes counter (`heart-outline` toggles), and submitted vendor listings into `localStorage` caches for consistent sandboxed testing.

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework:** Angular (Standalone Component Architecture)
* **Mobile/Web Hybrid Toolkit:** Ionic Framework 7+
* **Styling & Theme engine:** Structured SCSS (Integrated global tokens, custom dynamic keyframes, and strict CSS variables mapping)
* **State Management & Caching:** Web LocalStorage API

---

## 📦 Installation & Local Setup

To run this workspace locally, follow these steps:

### 1. Prerequisites
Ensure you have Node.js and the Ionic CLI installed globally:
```bash
npm install -g @ionic/cli
