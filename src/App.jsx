import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ResolutionsPage from './pages/ResolutionsPage';
import NewResolutionPage from './pages/NewResolutionPage';
import ResolutionDetailPage from './pages/ResolutionDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './App.css';

function AppLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="app-main">
        <Header title={title} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes with sidebar layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout title="Dashboard">
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/resolutions" element={
          <ProtectedRoute>
            <AppLayout title="My Resolutions">
              <ResolutionsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/resolutions/new" element={
          <ProtectedRoute>
            <AppLayout title="New Resolution">
              <NewResolutionPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/resolutions/:id" element={
          <ProtectedRoute>
            <AppLayout title="Resolution Details">
              <ResolutionDetailPage />
            </AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
