# 📦 Delivery Management Mobile App

![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript)
![Odoo](https://img.shields.io/badge/Odoo%20ERP-16-714B67?style=flat-square&logo=odoo)
![REST API](https://img.shields.io/badge/REST-API-009688?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-lightgrey?style=flat-square&logo=android)

A cross-platform **Delivery Management Mobile Application** developed as a Final Year Project (PFE) for **Sapress**, designed to digitalize and optimize the parcel delivery process through real-time tracking, route management, and seamless integration with **Odoo ERP** via REST API.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [App Workflow](#app-workflow)
- [Architecture](#architecture)
- [My Role](#my-role)
- [Future Improvements](#future-improvements)

---

## 📖 About the Project

This application was built during a **Final Year Internship (PFE)** at **Sapress, Casablanca**. The goal was to replace a manual, paper-based delivery process with a modern mobile solution that provides:

- Real-time parcel tracking for delivery personnel
- Centralized logistics management through Odoo ERP
- Better traceability and reduced human errors
- A simple and fast interface optimized for field use

> All business data (routes, parcels, statuses) is managed through **Odoo ERP**, and the mobile app communicates with it via **REST API**.

---

## ✨ Features

- **User Authentication** — Secure login for delivery personnel
- **Delivery Routes** — View assigned delivery tours for the day
- **Parcel Tracking** — Access detailed information for each parcel
- **Status Updates** — Mark parcels as delivered, failed, or returned in real time
- **Odoo ERP Integration** — All data synchronized with the central ERP system
- **REST API Communication** — Clean client-server architecture
- **Cross-Platform** — Compatible with both Android and iOS devices
- **Field-Optimized UI** — Simple and fast interface designed for on-the-go use

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile framework (Android & iOS) |
| TypeScript / JavaScript | Programming languages |
| Odoo ERP | Central backend and business logic |
| REST API | Communication between app and Odoo |
| Postman | API testing and validation before integration |
| Git / GitHub | Version control and collaboration |
| Visual Studio Code | Development environment |
| Expo CLI | Development and build tooling |

---

## 📁 Project Structure

```
delivery-management-app/
├── src/
│   ├── components/          # Reusable UI components (buttons, cards, inputs)
│   ├── screens/             # Application screens
│   │   ├── LoginScreen.tsx         # User authentication screen
│   │   ├── HomeScreen.tsx          # Dashboard and daily summary
│   │   ├── RoutesScreen.tsx        # List of delivery tours
│   │   ├── ParcelListScreen.tsx    # Parcels for a selected route
│   │   ├── ParcelDetailScreen.tsx  # Full details for a single parcel
│   │   └── StatusUpdateScreen.tsx  # Update delivery status
│   ├── navigation/          # React Navigation stack and tab configuration
│   ├── services/            # API service layer — all Odoo REST calls
│   │   └── api.ts                  # Axios instance + endpoints
│   ├── utils/               # Helper functions, constants, formatters
│   └── assets/              # Images, icons, fonts
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) 18+
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android Studio (for Android emulator) or Xcode (for iOS)
- A running Odoo instance with REST API accessible

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/chaimaa123-info/delivery-management-app.git
cd delivery-management-app

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start
```

### Run on device or emulator

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios

# Scan QR code with Expo Go app (physical device)
npx expo start
```

---

## ⚙️ Configuration

Before running the app, configure the API base URL to point to your Odoo instance.

Create a `.env` file at the root of the project:

```env
API_BASE_URL=http://your-odoo-server:8069
API_DB=your_odoo_database
```

Then update `src/services/api.ts` to use these environment variables:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

> Make sure your Odoo instance has the REST API module enabled and the correct CORS settings configured.

---

## 📱 App Workflow

```
1. Delivery person opens the app and logs in
        ↓
2. Home screen displays today's assigned routes
        ↓
3. User selects a route to see the list of parcels
        ↓
4. User taps a parcel to see full delivery details
        ↓
5. After delivery attempt, user updates the parcel status
   (DELIVERED / FAILED / RETURNED)
        ↓
6. Status is synchronized with Odoo ERP via REST API
        ↓
7. Operations team sees updated data in Odoo dashboard
```

---

## 🏗 Architecture

This application follows a **Mobile Client-Server** architecture:

```
┌─────────────────────────┐         ┌──────────────────────────┐
│   React Native App      │         │       Odoo ERP           │
│  (Android / iOS)        │◄───────►│  (Central Backend)       │
│                         │  REST   │                          │
│  - UI Screens           │  API    │  - Business Logic        │
│  - Navigation           │         │  - Database              │
│  - API Service Layer    │         │  - Delivery Management   │
└─────────────────────────┘         └──────────────────────────┘
```

| Layer | Technology | Responsibility |
|---|---|---|
| Mobile Frontend | React Native + TypeScript | UI, navigation, user interaction |
| API Service | Axios + REST | HTTP calls to Odoo endpoints |
| Backend / ERP | Odoo 16 | Business logic, data storage, route management |
| API Testing | Postman | Endpoint validation before mobile integration |

---

## 👩‍💻 My Role

During this internship project, I was responsible for:

- **Requirements analysis** — Understanding the business needs of delivery operations at Sapress
- **Functional design** — UML modeling (use case diagrams, sequence diagrams)
- **Mobile development** — Building all main screens in React Native
- **API integration** — Connecting the mobile app to Odoo ERP REST endpoints using Axios
- **Testing** — Functional testing of all screens and API calls with Postman
- **Documentation** — Writing technical documentation for the project

---

## 🔮 Future Improvements

- **Barcode / QR Code scanning** — Scan parcel labels directly from the camera
- **Geolocation** — Real-time GPS tracking for delivery personnel
- **Push Notifications** — Instant alerts for new assignments or route changes
- **Offline Mode** — Continue working without internet, sync when back online
- **Delivery History** — Detailed logs and delivery performance statistics
- **Analytics Dashboard** — Visual reports for operations managers

---

## 👤 Author

**Chaimaa Hajib**
- GitHub: [@chaimaa123-info](https://github.com/chaimaa123-info)
- LinkedIn: [Chaimaa Hajib](https://linkedin.com/in/chaimaa-hajib)

---

