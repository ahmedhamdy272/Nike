import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AnimatedPage } from "../Components/AnimatedPage";
const Home = React.lazy(() => import("../pages/Home"));
const Login = React.lazy(() => import("../pages/Login").then(m => ({ default: m.Login })));
const Cart = React.lazy(() => import("../pages/Cart"));
const Favorites = React.lazy(() => import("../pages/Favorites"));
const Profile = React.lazy(() => import("../pages/Profile"));
const ProductsPage = React.lazy(() => import("../pages/ProductsPage"));
const ProductDetails = React.lazy(() => import("../pages/ProductDetails"));
import { useFirebase, isAdminUser } from "../hooks/useFirebaseContext";
import { Button } from "@/components/ui/button";
import "../src/App.css";
import "../src/index.css";

//  Smart Auth Gate (handles loading + returning user)
import { AuthGate } from "../Components/AuthGate";
import { QuickViewDrawer } from "../Components/QuickViewDrawer";
import ErrorBoundary from "../Components/ErrorBoundary";
import { ToastProvider } from "../Components/Toast";



//  Loading Screen (used by ProtectedRoute)
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-neutral-900 to-black">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);

//  Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useFirebase();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

//  Admin Route wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useFirebase();

  if (loading) return <LoadingScreen />;
  
  const isAdminEmail = isAdminUser(user?.email);
  if (!user || !isAdminEmail) return <Navigate to="/" replace />;

  return <>{children}</>;
};

//  404 Not Found Page
const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-neutral-900 to-black text-white">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-yellow-400 mb-4">404</h1>
        <p className="text-2xl mb-8">Page Not Found</p>
        <Button
          onClick={() => navigate("/login")}
          className="bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
        >
          Go to Login
        </Button>
      </div>
    </div>
  );
};



const RouteHandler: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Login Route */}
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />

        {/* Public Home Route */}
        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />

        {/* Public Cart Route */}
        <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />

        {/* Public Favorites Route */}
        <Route path="/favorites" element={<AnimatedPage><Favorites /></AnimatedPage>} />

        {/* Protected Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AnimatedPage><Profile /></AnimatedPage>
            </ProtectedRoute>
          }
        />

        {/* Admin Route - Redirects to Profile page (where the Admin dashboard is embedded) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Navigate to="/profile" state={{ tab: "admin" }} replace />
            </AdminRoute>
          }
        />

        {/* Public Products Catalog Route */}
        <Route path="/products" element={<AnimatedPage><ProductsPage /></AnimatedPage>} />

        {/* Public Product Details Route */}
        <Route path="/product/:id" element={<AnimatedPage><ProductDetails /></AnimatedPage>} />

        {/* 404 Fallback */}
        <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

//  Main App Component
const App: React.FC = () => {
  const routerBasename = import.meta.env.DEV ? "/" : "/Nike";
  return (
    <ToastProvider>
      <Router basename={routerBasename}>
        <AuthGate>
          <ErrorBoundary>
            <React.Suspense fallback={<LoadingScreen />}>
              <RouteHandler />
              <QuickViewDrawer />
            </React.Suspense>
          </ErrorBoundary>
        </AuthGate>
      </Router>
    </ToastProvider>
  );
};

export default App;
