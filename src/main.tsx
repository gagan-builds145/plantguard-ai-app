import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { RoleRouter } from "@/components/role-router";
import { LanguageProvider } from "@/lib/i18n";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const ScanPage = lazy(() => import("./pages/ScanPage.tsx"));
const ScanResultPage = lazy(() => import("./pages/ScanResultPage.tsx"));
const ScanHistory = lazy(() => import("./pages/ScanHistory.tsx"));
const FarmServices = lazy(() => import("./pages/FarmServices.tsx"));
const MyCrops = lazy(() => import("./pages/MyCrops.tsx"));
const NurseryStock = lazy(() => import("./pages/NurseryStock.tsx"));
const NurseryFeed = lazy(() => import("./pages/NurseryFeed.tsx"));
const SellProducts = lazy(() => import("./pages/SellProducts.tsx"));
const Insights = lazy(() => import("./pages/Insights.tsx"));
const Orders = lazy(() => import("./pages/Orders.tsx"));
const Notifications = lazy(() => import("./pages/Notifications.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const Help = lazy(() => import("./pages/Help.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Role workspaces (Home Grower, Seller, Vehicle Owner, Labour, Scientist)
const RoleStart = lazy(() => import("./pages/RoleStart.tsx"));
const RoleSetup = lazy(() => import("./pages/RoleSetup.tsx"));

const GrowerHome = lazy(() => import("./pages/grower/home.tsx"));
const GrowerDiscover = lazy(() => import("./pages/grower/discover.tsx"));
const GrowerPlants = lazy(() =>
  import("./pages/grower/plants.tsx").then((m) => ({ default: m.GrowerPlants })),
);
const GrowerPlantDetail = lazy(() =>
  import("./pages/grower/plants.tsx").then((m) => ({ default: m.GrowerPlantDetail })),
);
const GrowerCare = lazy(() =>
  import("./pages/grower/care.tsx").then((m) => ({ default: m.GrowerCare })),
);
const GrowerReminders = lazy(() =>
  import("./pages/grower/care.tsx").then((m) => ({ default: m.GrowerReminders })),
);
const GrowerShop = lazy(() =>
  import("./pages/grower/shop.tsx").then((m) => ({ default: m.GrowerShop })),
);
const GrowerSaved = lazy(() =>
  import("./pages/grower/shop.tsx").then((m) => ({ default: m.GrowerSaved })),
);
const GrowerScan = lazy(() =>
  import("./pages/grower/scan.tsx").then((m) => ({ default: m.GrowerScan })),
);
const GrowerHistory = lazy(() =>
  import("./pages/grower/scan.tsx").then((m) => ({ default: m.GrowerHistory })),
);
const GrowerProfile = lazy(() => import("./pages/grower/profile.tsx"));

const SellerDashboard = lazy(() => import("./pages/seller/dashboard.tsx"));
const SellerOrders = lazy(() => import("./pages/seller/orders.tsx"));
const SellerProducts = lazy(() => import("./pages/seller/products.tsx"));
const SellerInventory = lazy(() => import("./pages/seller/inventory.tsx"));
const SellerCustomers = lazy(() => import("./pages/seller/customers.tsx"));
const SellerTrends = lazy(() => import("./pages/seller/trends.tsx"));
const SellerAnalytics = lazy(() => import("./pages/seller/analytics.tsx"));
const SellerMarketplace = lazy(() => import("./pages/seller/marketplace.tsx"));
const SellerFinance = lazy(() => import("./pages/seller/finance.tsx"));
const SellerInsurance = lazy(() => import("./pages/seller/insurance.tsx"));
const SellerProfile = lazy(() => import("./pages/seller/profile.tsx"));

const VehicleHome = lazy(() => import("./pages/vehicle/home.tsx"));
const VehicleRequests = lazy(() => import("./pages/vehicle/requests.tsx"));
const VehicleRequestDetails = lazy(() => import("./pages/vehicle/request-details.tsx"));
const VehicleActiveService = lazy(() => import("./pages/vehicle/active-service.tsx"));
const VehicleHistoryPage = lazy(() => import("./pages/vehicle/history.tsx"));
const VehicleFleet = lazy(() => import("./pages/vehicle/vehicles.tsx"));
const VehicleDetailsPage = lazy(() => import("./pages/vehicle/vehicle-details.tsx"));
const VehicleInsurancePage = lazy(() => import("./pages/vehicle/insurance.tsx"));
const VehicleProfilePage = lazy(() => import("./pages/vehicle/profile.tsx"));

const LabourHome = lazy(() => import("./pages/labour/home.tsx"));
const LabourJobs = lazy(() => import("./pages/labour/jobs.tsx"));
const LabourJobDetails = lazy(() => import("./pages/labour/job-details.tsx"));
const LabourActiveWork = lazy(() => import("./pages/labour/active-work.tsx"));
const LabourUpcoming = lazy(() => import("./pages/labour/upcoming.tsx"));
const LabourSkills = lazy(() => import("./pages/labour/skills.tsx"));
const LabourServiceArea = lazy(() => import("./pages/labour/service-area.tsx"));
const LabourHistoryPage = lazy(() => import("./pages/labour/history.tsx"));
const LabourInsurancePage = lazy(() => import("./pages/labour/insurance.tsx"));
const LabourProfilePage = lazy(() => import("./pages/labour/profile.tsx"));

const ScientistDashboard = lazy(() => import("./pages/scientist/dashboard.tsx"));
const ScientistAnalyze = lazy(() => import("./pages/scientist/analyze.tsx"));
const ScientistHistoryPage = lazy(() => import("./pages/scientist/history.tsx"));
const ScientistProjects = lazy(() => import("./pages/scientist/projects.tsx"));
const ScientistDatasets = lazy(() => import("./pages/scientist/datasets.tsx"));
const ScientistLibrary = lazy(() => import("./pages/scientist/library.tsx"));
const ScientistInsights = lazy(() => import("./pages/scientist/insights.tsx"));
const ScientistCollaboration = lazy(() => import("./pages/scientist/collaboration.tsx"));
const ScientistProfilePage = lazy(() => import("./pages/scientist/profile.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in the browser runtime). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[Preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);



function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <LanguageProvider>
          <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/auth"
                element={<AuthPage redirectAfterAuth="/dashboard" />}
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <RoleRouter>
                      <Dashboard />
                    </RoleRouter>
                  </RequireAuth>
                }
              />
              <Route
                path="/start"
                element={
                  <RequireAuth
                    title="Sign in to choose your workspace"
                    description="Pick the PlantGuard workspace that matches what you do — home grower, seller, vehicle owner, labour or scientist."
                  >
                    <RoleStart />
                  </RequireAuth>
                }
              />
              <Route
                path="/setup/:role"
                element={
                  <RequireAuth redirectImmediately>
                    <RoleSetup />
                  </RequireAuth>
                }
              />

              {/* Home Grower */}
              <Route path="/grower" element={<RequireAuth redirectImmediately><GrowerHome /></RequireAuth>} />
              <Route path="/grower/discover" element={<RequireAuth redirectImmediately><GrowerDiscover /></RequireAuth>} />
              <Route path="/grower/plants" element={<RequireAuth redirectImmediately><GrowerPlants /></RequireAuth>} />
              <Route path="/grower/plants/:id" element={<RequireAuth redirectImmediately><GrowerPlantDetail /></RequireAuth>} />
              <Route path="/grower/care" element={<RequireAuth redirectImmediately><GrowerCare /></RequireAuth>} />
              <Route path="/grower/reminders" element={<RequireAuth redirectImmediately><GrowerReminders /></RequireAuth>} />
              <Route path="/grower/shop" element={<RequireAuth redirectImmediately><GrowerShop /></RequireAuth>} />
              <Route path="/grower/saved" element={<RequireAuth redirectImmediately><GrowerSaved /></RequireAuth>} />
              <Route path="/grower/scan" element={<RequireAuth redirectImmediately><GrowerScan /></RequireAuth>} />
              <Route path="/grower/history" element={<RequireAuth redirectImmediately><GrowerHistory /></RequireAuth>} />
              <Route path="/grower/profile" element={<RequireAuth redirectImmediately><GrowerProfile /></RequireAuth>} />

              {/* Seller */}
              <Route path="/seller" element={<RequireAuth redirectImmediately><SellerDashboard /></RequireAuth>} />
              <Route path="/seller/orders" element={<RequireAuth redirectImmediately><SellerOrders /></RequireAuth>} />
              <Route path="/seller/products" element={<RequireAuth redirectImmediately><SellerProducts /></RequireAuth>} />
              <Route path="/seller/inventory" element={<RequireAuth redirectImmediately><SellerInventory /></RequireAuth>} />
              <Route path="/seller/customers" element={<RequireAuth redirectImmediately><SellerCustomers /></RequireAuth>} />
              <Route path="/seller/trends" element={<RequireAuth redirectImmediately><SellerTrends /></RequireAuth>} />
              <Route path="/seller/analytics" element={<RequireAuth redirectImmediately><SellerAnalytics /></RequireAuth>} />
              <Route path="/seller/marketplace" element={<RequireAuth redirectImmediately><SellerMarketplace /></RequireAuth>} />
              <Route path="/seller/finance" element={<RequireAuth redirectImmediately><SellerFinance /></RequireAuth>} />
              <Route path="/seller/insurance" element={<RequireAuth redirectImmediately><SellerInsurance /></RequireAuth>} />
              <Route path="/seller/profile" element={<RequireAuth redirectImmediately><SellerProfile /></RequireAuth>} />

              {/* Vehicle Owner */}
              <Route path="/vehicle" element={<RequireAuth redirectImmediately><VehicleHome /></RequireAuth>} />
              <Route path="/vehicle/requests" element={<RequireAuth redirectImmediately><VehicleRequests /></RequireAuth>} />
              <Route path="/vehicle/requests/:id" element={<RequireAuth redirectImmediately><VehicleRequestDetails /></RequireAuth>} />
              <Route path="/vehicle/active" element={<RequireAuth redirectImmediately><VehicleActiveService /></RequireAuth>} />
              <Route path="/vehicle/history" element={<RequireAuth redirectImmediately><VehicleHistoryPage /></RequireAuth>} />
              <Route path="/vehicle/vehicles" element={<RequireAuth redirectImmediately><VehicleFleet /></RequireAuth>} />
              <Route path="/vehicle/vehicles/:id" element={<RequireAuth redirectImmediately><VehicleDetailsPage /></RequireAuth>} />
              <Route path="/vehicle/insurance" element={<RequireAuth redirectImmediately><VehicleInsurancePage /></RequireAuth>} />
              <Route path="/vehicle/profile" element={<RequireAuth redirectImmediately><VehicleProfilePage /></RequireAuth>} />

              {/* Labour */}
              <Route path="/work" element={<RequireAuth redirectImmediately><LabourHome /></RequireAuth>} />
              <Route path="/work/jobs" element={<RequireAuth redirectImmediately><LabourJobs /></RequireAuth>} />
              <Route path="/work/jobs/:id" element={<RequireAuth redirectImmediately><LabourJobDetails /></RequireAuth>} />
              <Route path="/work/active" element={<RequireAuth redirectImmediately><LabourActiveWork /></RequireAuth>} />
              <Route path="/work/upcoming" element={<RequireAuth redirectImmediately><LabourUpcoming /></RequireAuth>} />
              <Route path="/work/skills" element={<RequireAuth redirectImmediately><LabourSkills /></RequireAuth>} />
              <Route path="/work/area" element={<RequireAuth redirectImmediately><LabourServiceArea /></RequireAuth>} />
              <Route path="/work/history" element={<RequireAuth redirectImmediately><LabourHistoryPage /></RequireAuth>} />
              <Route path="/work/insurance" element={<RequireAuth redirectImmediately><LabourInsurancePage /></RequireAuth>} />
              <Route path="/work/profile" element={<RequireAuth redirectImmediately><LabourProfilePage /></RequireAuth>} />

              {/* Scientist */}
              <Route path="/lab" element={<RequireAuth redirectImmediately><ScientistDashboard /></RequireAuth>} />
              <Route path="/lab/analysis" element={<RequireAuth redirectImmediately><ScientistAnalyze /></RequireAuth>} />
              <Route path="/lab/history" element={<RequireAuth redirectImmediately><ScientistHistoryPage /></RequireAuth>} />
              <Route path="/lab/projects" element={<RequireAuth redirectImmediately><ScientistProjects /></RequireAuth>} />
              <Route path="/lab/datasets" element={<RequireAuth redirectImmediately><ScientistDatasets /></RequireAuth>} />
              <Route path="/lab/library" element={<RequireAuth redirectImmediately><ScientistLibrary /></RequireAuth>} />
              <Route path="/lab/insights" element={<RequireAuth redirectImmediately><ScientistInsights /></RequireAuth>} />
              <Route path="/lab/collaboration" element={<RequireAuth redirectImmediately><ScientistCollaboration /></RequireAuth>} />
              <Route path="/lab/profile" element={<RequireAuth redirectImmediately><ScientistProfilePage /></RequireAuth>} />
              <Route
                path="/onboarding"
                element={
                  <RequireAuth
                    title="Sign in to set up your farmer profile"
                    description="Create or sign in to your PlantGuard AI account to personalise your workspace."
                    redirectImmediately
                  >
                    <Onboarding />
                  </RequireAuth>
                }
              />
              <Route
                path="/scan"
                element={
                  <RequireAuth redirectImmediately>
                    <ScanPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/scan/:id"
                element={
                  <RequireAuth redirectImmediately>
                    <ScanResultPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/history"
                element={
                  <RequireAuth redirectImmediately>
                    <ScanHistory />
                  </RequireAuth>
                }
              />
              <Route
                path="/services"
                element={
                  <RequireAuth redirectImmediately>
                    <FarmServices />
                  </RequireAuth>
                }
              />
              <Route
                path="/crops"
                element={
                  <RequireAuth redirectImmediately>
                    <MyCrops />
                  </RequireAuth>
                }
              />
              <Route
                path="/stock"
                element={
                  <RequireAuth redirectImmediately>
                    <NurseryStock />
                  </RequireAuth>
                }
              />
              <Route
                path="/feed"
                element={
                  <RequireAuth redirectImmediately>
                    <NurseryFeed />
                  </RequireAuth>
                }
              />
              <Route
                path="/sell"
                element={
                  <RequireAuth redirectImmediately>
                    <SellProducts />
                  </RequireAuth>
                }
              />
              <Route
                path="/insights"
                element={
                  <RequireAuth redirectImmediately>
                    <Insights />
                  </RequireAuth>
                }
              />
              <Route
                path="/orders"
                element={
                  <RequireAuth redirectImmediately>
                    <Orders />
                  </RequireAuth>
                }
              />
              <Route
                path="/notifications"
                element={
                  <RequireAuth redirectImmediately>
                    <Notifications />
                  </RequireAuth>
                }
              />
              <Route
                path="/settings"
                element={
                  <RequireAuth redirectImmediately>
                    <Settings />
                  </RequireAuth>
                }
              />
              <Route
                path="/help"
                element={
                  <RequireAuth redirectImmediately>
                    <Help />
                  </RequireAuth>
                }
              />
              <Route
                path="/about"
                element={
                  <RequireAuth redirectImmediately>
                    <About />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth redirectImmediately>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </BrowserRouter>
        </LanguageProvider>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
