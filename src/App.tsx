import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AnimatePresence, motion } from "framer-motion";

const HomePage = lazy(() => import("@/pages/HomePage"));
const AssistantPage = lazy(() => import("@/pages/AssistantPage"));
const KnowledgeBasePage = lazy(() => import("@/pages/KnowledgeBasePage"));
const KnowledgeBaseArticlePage = lazy(() => import("@/pages/KnowledgeBaseArticlePage"));
const ChecklistsPage = lazy(() => import("@/pages/ChecklistsPage"));
const ChecklistDetailPage = lazy(() => import("@/pages/ChecklistDetailPage"));
const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const TestsPage = lazy(() => import("@/pages/TestsPage"));
const ContactsPage = lazy(() => import("@/pages/ContactsPage"));
const SalesNowPage = lazy(() => import("@/pages/SalesNowPage"));

const App = (): JSX.Element => {
  const location = useLocation();
  return (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/assistant" element={<PageTransition><AssistantPage /></PageTransition>} />
            <Route path="/kb" element={<PageTransition><KnowledgeBasePage /></PageTransition>} />
            <Route path="/kb/:id" element={<PageTransition><KnowledgeBaseArticlePage /></PageTransition>} />
            <Route path="/checklists" element={<PageTransition><ChecklistsPage /></PageTransition>} />
            <Route path="/checklists/:id" element={<PageTransition><ChecklistDetailPage /></PageTransition>} />
            <Route path="/catalog" element={<PageTransition><CatalogPage /></PageTransition>} />
            <Route path="/sales-now" element={<PageTransition><SalesNowPage /></PageTransition>} />
            <Route path="/tests" element={<PageTransition><TestsPage /></PageTransition>} />
            <Route path="/contacts" element={<PageTransition><ContactsPage /></PageTransition>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
};

export default App;

const PageTransition = ({ children }: { children: JSX.Element }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="h-full"
  >
    {children}
  </motion.div>
);
