import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/shell/Layout';
import { RequireAuth } from './routes/RequireAuth';
import { HomeScreen } from './routes/HomeScreen';
import { LoginScreen } from './routes/LoginScreen';
import { OnboardingScreen } from './routes/OnboardingScreen';
import { DashboardScreen } from './routes/DashboardScreen';
import { CheckinScreen } from './routes/CheckinScreen';
import { WalletScreen } from './routes/WalletScreen';
import { RedeemHub } from './routes/RedeemHub';
import { ProgressScreen } from './routes/ProgressScreen';
import { ChallengeDetailScreen } from './routes/ChallengeDetailScreen';

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
          <Route path="/wallet" element={<WalletScreen />} />
          <Route path="/redeem" element={<RedeemHub />} />
          <Route path="/progress" element={<ProgressScreen />} />
          <Route path="/challenge/:userChallengeId" element={<ChallengeDetailScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
