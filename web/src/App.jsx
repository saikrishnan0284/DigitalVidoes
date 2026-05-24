import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '@components/Layout';
import PrivateRoute from '@components/PrivateRoute';

// Pages
import HomePage from '@pages/HomePage';
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';
import DashboardPage from '@pages/DashboardPage';
import EventsPage from '@pages/events/EventsPage';
import EventDetailPage from '@pages/events/EventDetailPage';
import CreateEventPage from '@pages/events/CreateEventPage';
import VendorsPage from '@pages/vendors/VendorsPage';
import VendorDetailPage from '@pages/vendors/VendorDetailPage';
import ProfilePage from '@pages/ProfilePage';
import NotFoundPage from '@pages/NotFoundPage';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/create" element={<CreateEventPage />} />
          <Route path="events/:eventId" element={<EventDetailPage />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="vendors/:vendorId" element={<VendorDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
