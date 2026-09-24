import { Navigate, Route, Routes } from 'react-router-dom';
import { LandingScreen } from './routes/day0/LandingScreen';
import { SurveyScreen } from './routes/day0/SurveyScreen';

// The rest of the app (Login/Onboarding/Dashboard/Checkin/Wallet/Redeem/Progress/
// ChallengeDetail, all behind the shared Layout + RequireAuth) is intentionally
// unhooked for now — the deployed site currently only shows the day0 landing page
// and survey. Nothing below is deleted; re-enable by restoring this block and its
// imports (see git history / day0Theme swap in main.tsx for the matching revert).
//
// import { Layout } from './components/shell/Layout';
// import { RequireAuth } from './routes/RequireAuth';
// import { HomeScreen } from './routes/HomeScreen';
// import { LoginScreen } from './routes/LoginScreen';
// import { OnboardingScreen } from './routes/OnboardingScreen';
// import { DashboardScreen } from './routes/DashboardScreen';
// import { CheckinScreen } from './routes/CheckinScreen';
// import { WalletScreen } from './routes/WalletScreen';
// import { RedeemHub } from './routes/RedeemHub';
// import { ProgressScreen } from './routes/ProgressScreen';
// import { ChallengeDetailScreen } from './routes/ChallengeDetailScreen';
//
// <Route element={<Layout />}>
//   <Route path="/" element={<HomeScreen />} />
//   <Route path="/login" element={<LoginScreen />} />
//   <Route element={<RequireAuth />}>
//     <Route path="/onboarding" element={<OnboardingScreen />} />
//     <Route path="/dashboard" element={<DashboardScreen />} />
//     <Route path="/checkin/:userChallengeId" element={<CheckinScreen />} />
//     <Route path="/wallet" element={<WalletScreen />} />
//     <Route path="/redeem" element={<RedeemHub />} />
//     <Route path="/progress" element={<ProgressScreen />} />
//     <Route path="/challenge/:userChallengeId" element={<ChallengeDetailScreen />} />
//   </Route>
// </Route>

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingScreen />} />
      <Route path="/survey" element={<SurveyScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
