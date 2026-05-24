import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import socketService from '@services/socketService';

export default function Layout() {
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      socketService.connect(token);
    }

    return () => {
      socketService.disconnect();
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
