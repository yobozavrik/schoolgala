import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { LoadingScreen } from "@/components/LoadingScreen";

const HomePage = lazy(() => import("@/pages/HomePage"));
const AssistantPage = lazy(() => import("@/pages/AssistantPage"));
const KnowledgeBasePage = lazy(() => import("@/pages/KnowledgeBasePage"));
const KnowledgeBaseArticlePage = lazy(() => import("@/pages/KnowledgeBaseArticlePage"));
const ChecklistsPage = lazy(() => import("@/pages/ChecklistsPage"));
const ChecklistDetailPage = lazy(() => import("@/pages/ChecklistDetailPage"));
const CatalogPage = lazy(() => import("@/pages/CatalogPage"));
const TestsPage = lazy(() => import("@/pages/TestsPage"));
const ContactsPage = lazy(() => import("@/pages/ContactsPage"));

const App = (): JSX.Element => {
  return (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/kb" element={<KnowledgeBasePage />} />
          <Route path="/kb/:id" element={<KnowledgeBaseArticlePage />} />
          <Route path="/checklists" element={<ChecklistsPage />} />
          <Route path="/checklists/:id" element={<ChecklistDetailPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
