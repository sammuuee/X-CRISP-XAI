import { useNavigate, BrowserRouter, Routes, Route } from 'react-router';
import LandingPortal from './components/LandingPortal';
import SubscriptionTunnel from './components/SubscriptionTunnel';
import AuthWorkspace from './components/AuthWorkspace';
import SubmissionPage from './components/SubmissionPage';
import ResultsPage from './components/ResultsPage';

function SubmissionPageWrapper() {
  const navigate = useNavigate();
  return <SubmissionPage onAnalyze={() => navigate('/results')} />;
}

function AuthWorkspaceWrapper() {
  const navigate = useNavigate();
  return <AuthWorkspace onAnalyze={() => navigate('/results')} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPortal />} />
        <Route path="/subscribe" element={<SubscriptionTunnel />} />
        <Route path="/workspace" element={<AuthWorkspaceWrapper />} />
        <Route path="/submit" element={<SubmissionPageWrapper />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
