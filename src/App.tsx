import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { RequireAuth } from './routes/RequireAuth';
import { LoginScreen } from './routes/LoginScreen';
import { OnboardingScreen } from './routes/OnboardingScreen';
import { DashboardScreen } from './routes/DashboardScreen';
import { CheckinScreen } from './routes/CheckinScreen';

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route element={<RequireAuth />}>
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/checkin/:userChallengeId" element={<CheckinScreen />} />
      </Route>
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default App;
