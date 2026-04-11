import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense, Component, ReactNode } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
            <p className="text-denim-400 text-sm">{this.state.error?.message}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy-load all pages
const Home = lazy(() => import("./app/page"));
const GettingStarted = lazy(() => import("./app/getting-started/page"));
const Examples = lazy(() => import("./app/examples/page"));
const DocsIndex = lazy(() => import("./app/docs/page"));
const CoreConcepts = lazy(() => import("./app/docs/core-concepts/page"));
const Workers = lazy(() => import("./app/docs/workers/page"));
const D1 = lazy(() => import("./app/docs/d1/page"));
const KV = lazy(() => import("./app/docs/kv/page"));
const R2 = lazy(() => import("./app/docs/r2/page"));
const Queues = lazy(() => import("./app/docs/queues/page"));
const DurableObjects = lazy(() => import("./app/docs/durable-objects/page"));
const Vectorize = lazy(() => import("./app/docs/vectorize/page"));
const Hyperdrive = lazy(() => import("./app/docs/hyperdrive/page"));
const AI = lazy(() => import("./app/docs/ai/page"));
const Domains = lazy(() => import("./app/docs/domains/page"));
const ServiceBindings = lazy(() => import("./app/docs/service-bindings/page"));
const Environments = lazy(() => import("./app/docs/environments/page"));
const CLI = lazy(() => import("./app/docs/cli/page"));
const Vinext = lazy(() => import("./app/docs/vinext/page"));
const TanStack = lazy(() => import("./app/docs/tanstack/page"));
const Containers = lazy(() => import("./app/docs/containers/page"));
const Pipelines = lazy(() => import("./app/docs/pipelines/page"));
const BestPractices = lazy(() => import("./app/docs/best-practices/page"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <div className="min-h-screen flex flex-col denim-texture">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <span className="text-denim-400 text-sm">Loading...</span>
            </div>
          }
        >
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/getting-started" element={<GettingStarted />} />
              <Route path="/examples" element={<Examples />} />
              <Route path="/docs" element={<DocsIndex />} />
              <Route path="/docs/core-concepts" element={<CoreConcepts />} />
              <Route path="/docs/workers" element={<Workers />} />
              <Route path="/docs/d1" element={<D1 />} />
              <Route path="/docs/kv" element={<KV />} />
              <Route path="/docs/r2" element={<R2 />} />
              <Route path="/docs/queues" element={<Queues />} />
              <Route path="/docs/durable-objects" element={<DurableObjects />} />
              <Route path="/docs/vectorize" element={<Vectorize />} />
              <Route path="/docs/hyperdrive" element={<Hyperdrive />} />
              <Route path="/docs/ai" element={<AI />} />
              <Route path="/docs/domains" element={<Domains />} />
              <Route path="/docs/service-bindings" element={<ServiceBindings />} />
              <Route path="/docs/environments" element={<Environments />} />
              <Route path="/docs/cli" element={<CLI />} />
              <Route path="/docs/vinext" element={<Vinext />} />
              <Route path="/docs/tanstack" element={<TanStack />} />
              <Route path="/docs/containers" element={<Containers />} />
              <Route path="/docs/pipelines" element={<Pipelines />} />
              <Route path="/docs/best-practices" element={<BestPractices />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
