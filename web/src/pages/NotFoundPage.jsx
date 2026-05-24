import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-3xl font-display font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
