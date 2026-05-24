import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { sendOTP, verifyOTP } from '@store/slices/authSlice';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phoneOrEmail: '',
    otp: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await dispatch(sendOTP({ phoneOrEmail: formData.phoneOrEmail })).unwrap();
      toast.success('OTP sent successfully');
      setStep(2);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await dispatch(verifyOTP({
        phoneOrEmail: formData.phoneOrEmail,
        otp: formData.otp
      })).unwrap();
      toast.success('Registration successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-display font-bold text-center mb-2">
          Create Account
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Start celebrating life's special moments
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="input"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number or Email
              </label>
              <input
                type="text"
                name="phoneOrEmail"
                className="input"
                placeholder="Enter your phone or email"
                value={formData.phoneOrEmail}
                onChange={handleChange}
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
                name="otp"
                className="input"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                OTP sent to {formData.phoneOrEmail}
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify & Register'}
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
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
