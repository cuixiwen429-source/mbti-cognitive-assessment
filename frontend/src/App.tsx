import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import V2HomePage from './pages/V2HomePage';
import './components/v2/v2.css';

const V2TestPage = lazy(() => import('./pages/V2TestPage'));
const V2ResultPage = lazy(() => import('./pages/V2ResultPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const TestPage = lazy(() => import('./pages/TestPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));

function LoadingFallback() {
  return (
    <main className="v2-loading" aria-live="polite">
      <span />
      <p>正在打开夜班记录……</p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<V2HomePage />} />
          <Route path="/test" element={<V2TestPage />} />
          <Route path="/result/:id" element={<V2ResultPage />} />
          <Route path="/v2" element={<V2HomePage />} />
          <Route path="/v2/test" element={<V2TestPage />} />
          <Route path="/legacy" element={<HomePage />} />
          <Route path="/legacy/test" element={<TestPage />} />
          <Route path="/legacy/result/:id" element={<ResultPage />} />
          <Route path="/legacy/history" element={<HistoryPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
