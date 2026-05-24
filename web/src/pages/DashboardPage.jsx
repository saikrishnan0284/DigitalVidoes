import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEvents } from '@store/slices/eventSlice';
import { FiCalendar, FiUsers, FiPlus } from 'react-icons/fi';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { events, isLoading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="container-custom py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Manage your celebrations and connect with your guests
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
              <FiCalendar size={24} />
            </div>
            <div>
              <p className="text-gray-600">Total Events</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-100 text-secondary-600 rounded-lg">
              <FiUsers size={24} />
            </div>
            <div>
              <p className="text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="card">
          <Link to="/events/create" className="flex items-center gap-4 group">
            <div className="p-3 bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-600 rounded-lg transition">
              <FiPlus size={24} />
            </div>
            <div>
              <p className="text-gray-600">Create New</p>
              <p className="text-xl font-semibold group-hover:text-primary-600 transition">
                Event
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Events */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Your Events</h2>
          <Link to="/events" className="text-primary-600 font-semibold hover:underline">
            View All
          </Link>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading events...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No events yet</p>
            <Link to="/events/create" className="btn-primary">
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.slice(0, 5).map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                <p className="text-gray-600 text-sm">
                  {new Date(event.date).toLocaleDateString()} • {event.location}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
