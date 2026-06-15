# Portfolio Analytics Dashboard

A modern, high-performance financial portfolio analytics dashboard built with React 19, Vite, and Tailwind CSS. This project serves as a robust frontend showcase featuring simulated real-time WebSocket data, interactive financial charts, and a highly customizable, drag-and-drop widget layout system.

![Dashboard Preview]
<img width="1899" height="933" alt="image" src="https://github.com/user-attachments/assets/d5205458-3b0b-41fc-ad8b-8dbbdceed159" />
<img width="1667" height="837" alt="image" src="https://github.com/user-attachments/assets/1d45059b-f202-42cb-b272-0afc87432c94" />


## ✨ Key Features

- **Dynamic Drag-and-Drop Layout**: Fluid, responsive grid layout powered by `@dnd-kit`. Users can seamlessly reorder widgets to customize their workspace.
- **Simulated Real-Time Data**: Integrates a local WebSocket simulator paired with TanStack Query (React Query) to demonstrate live data streaming, price updates, and recalculating P&L without needing a real backend.
- **Interactive Financial Visualizations**: Beautiful, responsive charts built with Recharts, including Portfolio Allocation Pie Charts, Performance Line Charts, and Sector Heat Maps.
- **Advanced State Management**: Utilizes Zustand for lightweight, global state management, persisting user layouts and preferences across sessions.
- **Dark/Light Theme Support**: Fully integrated theming using Tailwind CSS with a polished, premium aesthetic.
- **Enterprise-Grade UI**: Incorporates glassmorphism, micro-interactions, and a sleek modern design system.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS Variables for Theming
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching & Caching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Drag and Drop**: [@dnd-kit](https://dndkit.com/)
- **Charting**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio-analytics-dashboard.git
   cd portfolio-analytics-dashboard
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `localhost`.

### Building for Production

To create an optimized production build:
```bash
npm run build
```
The output will be located in the `dist` folder, ready to be deployed to Vercel, Netlify, or any static hosting service.

## 📂 Project Structure

```text
src/
├── components/       # Shared UI components (Modal, Skeletons, WidgetShell)
├── data/             # Mock API and WebSocket simulator for live data
├── grid/             # Drag-and-drop GridContainer logic (@dnd-kit)
├── hooks/            # Custom React hooks (useData, useWebSocket)
├── registry/         # Widget registry system for dynamic component loading
├── store/            # Zustand global state (dashboardStore)
├── types/            # TypeScript interfaces and types
├── widgets/          # Individual dashboard widgets (Charts, Tables, etc.)
├── App.tsx           # Main application shell and layout provider
└── main.tsx          # Application entry point
```

## 🧠 Architecture Highlights

- **Widget Registry Pattern**: The application uses a dynamic widget registry (`WidgetRegistry.ts`). Adding a new widget is as simple as defining its component, default configuration, and size constraints, then registering it. The grid engine automatically handles rendering and positioning.
- **Optimized Rendering**: Extensive use of `React.memo`, `useMemo`, and virtualized lists (`react-virtuoso` for the Holdings table) ensures 60fps performance even when handling frequent WebSocket updates.
- **React 19 Compatibility**: Built specifically avoiding legacy APIs like `findDOMNode`, relying on `forwardRef` and strictly compliant React 19 patterns.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/portfolio-analytics-dashboard/issues).

## 📄 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
