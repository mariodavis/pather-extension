import { Route, Routes } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { HomeView } from "./components/HomeView";
import { ScanView } from "./components/ScanView";
import { TreeView } from "./components/TreeView";
import { SearchView } from "./components/SearchView";
import { ExportsView } from "./components/ExportsView";
import { ToastProvider } from "./components/ToastContext";

export default function App() {
  return (
    <ToastProvider>
      <div className="flex flex-col h-screen">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/scan" element={<ScanView />} />
            <Route path="/tree" element={<TreeView />} />
            <Route path="/search" element={<SearchView />} />
            <Route path="/exports" element={<ExportsView />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
