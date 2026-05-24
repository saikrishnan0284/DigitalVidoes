import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiBell, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { logout } from '@store/slices/authSlice';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notification);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-display font-bold text-primary-600">
            CelebrationHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                  Dashboard
                </Link>
                <Link to="/events" className="text-gray-700 hover:text-primary-600 transition">
                  Events
                </Link>
                <Link to="/vendors" className="text-gray-700 hover:text-primary-600 transition">
                  Vendors
                </Link>

                {/* Notifications */}
                <button className="relative p-2 text-gray-700 hover:text-primary-600 transition">
                  <FiBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 text-gray-700 hover:text-primary-600 transition">
                    <FiUser size={20} />
                    <span>{user?.name || 'User'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg flex items-center gap-2"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FiMenu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link to="/events" className="text-gray-700 hover:text-primary-600">
                  Events
                </Link>
                <Link to="/vendors" className="text-gray-700 hover:text-primary-600">
                  Vendors
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-primary-600">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-gray-700 hover:text-primary-600 flex items-center gap-2"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-center">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
