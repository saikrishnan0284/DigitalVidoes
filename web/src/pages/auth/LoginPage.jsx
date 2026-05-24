import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { sendOTP, verifyOTP } from '@store/slices/authSlice';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await dispatch(sendOTP({ phoneOrEmail })).unwrap();
      toast.success('OTP sent successfully');
      setStep(2);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await dispatch(verifyOTP({ phoneOrEmail, otp })).unwrap();
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-display font-bold text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Login to access your celebrations
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number or Email
              </label>
              <input
                type="text"
                className="input"
                placeholder="Enter your phone or email"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                className="input"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                OTP sent to {phoneOrEmail}
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary w-full"
            >
              Change Number
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
