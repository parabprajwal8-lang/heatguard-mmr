import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import "./index.css";

// Lazy-load page routes for code-splitting
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AdminView = lazy(() => import("@/pages/AdminView"));
const HospitalView = lazy(() => import("@/pages/HospitalView"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-md">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-label-md font-label-md text-on-surface-variant">Loading…</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-on-background">
        <Navbar />
        {/* pt-16 accounts for fixed navbar height (h-16 = 64px) */}
        <main className="pt-16">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admin" element={<AdminView />} />
              <Route path="/hospital" element={<HospitalView />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
