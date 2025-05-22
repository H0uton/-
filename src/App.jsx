import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { getCurrentUser } from './utils/auth';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import GoalsPage from './pages/GoalsPage';
import DebtsPage from './pages/DebtsPage';
import PlanPage from './pages/PlanPage';
import FamilyBudgetPage from './pages/FamilyBudgetPage';
import BudgetTemplatesPage from './pages/BudgetTemplatesPage';
import ChecklistPage from './pages/ChecklistPage';
import UsersListPage from './pages/UsersListPage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';

function AppLayout() {
  const location = useLocation();
  const user = getCurrentUser();

  // Показывать Header только если пользователь авторизован и не на страницах входа/регистрации
  const showHeader = user && !['/login', '/register'].includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/debts" element={<DebtsPage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/family-budget" element={<FamilyBudgetPage />} />
        <Route path="/budget-templates" element={<BudgetTemplatesPage />} />
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="/users" element={<UsersListPage />} />

        {/* fallback на регистрацию, если путь не найден */}
        <Route path="*" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
