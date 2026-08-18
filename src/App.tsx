import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/shell/Layout';
import { RequireAuth } from './routes/RequireAuth';
import { HomeScreen } from './routes/HomeScreen';
import { LoginScreen } from './routes/LoginScreen';
import { OnboardingScreen } from './routes/OnboardingScreen';
import { DashboardScreen } from './routes/DashboardScreen';
import { CheckinScreen } from './routes/CheckinScreen';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route element={<RequireAuth />}>
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/checkin/:userChallengeId" element={<CheckinScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
