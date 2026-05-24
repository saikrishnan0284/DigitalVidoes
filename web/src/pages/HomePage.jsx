import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiMessageCircle, FiTrendingUp } from 'react-icons/fi';

export default function HomePage() {
  const features = [
    {
      icon: <FiCalendar size={32} />,
      title: 'Event Management',
      description: 'Create and manage unlimited events with sub-events, invitations, and RSVP tracking'
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Vendor Marketplace',
      description: 'Discover and book service providers for your celebrations with reviews and ratings'
    },
    {
      icon: <FiMessageCircle size={32} />,
      title: 'Real-time Chat',
      description: 'Stay connected with guests and vendors through instant messaging and media sharing'
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: 'Media Feed',
      description: 'Share photos and videos, create stories, and relive your special moments'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-display font-bold mb-6">
              Celebrate Life's Special Moments
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              The ultimate platform for managing weddings, parties, ceremonies, and celebrations.
              Connect with guests, share memories, and find the perfect vendors.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition">
                Get Started Free
              </Link>
              <Link to="/login" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Everything You Need for Perfect Celebrations
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Create Your First Event?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust CelebrationHub for their special moments.
            Start planning your perfect celebration today.
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Start Planning Now
          </Link>
        </div>
      </section>
    </div>
  );
}
