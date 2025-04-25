import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const username = location.state?.username;

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.verifyOTP(username, otp);
      console.log('OTP Response:', response); // Debug response

      // Ensure we have all required data
      if (!response?.token) {
        throw new Error('Invalid response from server');
      }

      // Login with full user data
      await login({
        token: response.token,
        id: response.user_id,
        username: response.username,
        email: response.email
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('OTP Error:', err);
      setError(err?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [otp, username, login, navigate]);

  // Redirect if no username
  if (!username) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Verify OTP</h3>
              <p className="text-center">
                Please enter the OTP sent to your email.
              </p>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">OTP Code</label>
                  <input
                    type="text"
                    className="form-control form-control-lg text-center"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : null}
                  Verify OTP
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;