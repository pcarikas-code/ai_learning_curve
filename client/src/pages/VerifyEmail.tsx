import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { trpc } from '../lib/trpc';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function VerifyEmail() {
  const [location, setLocation] = useLocation();
  
  // Parse token from URL - handle both query string formats
  const getTokenFromUrl = () => {
    // Try URLSearchParams first
    const searchParams = new URLSearchParams(window.location.search);
    const tokenFromParams = searchParams.get('token');
    if (tokenFromParams) return tokenFromParams;
    
    // Fallback: manual parsing in case URLSearchParams fails
    const queryString = location.includes('?') ? location.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    return params.get('token') || '';
  };
  
  const token = getTokenFromUrl();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  
  // Use ref to prevent double calls in React strict mode
  const hasCalledMutation = useRef(false);
  
  const verifyEmail = trpc.auth.verifyEmail.useMutation({
    onSuccess: (data) => {
      setStatus('success');
      setMessage(data.message);
    },
    onError: (err) => {
      setStatus('error');
      setMessage(err.message);
    },
  });

  useEffect(() => {
    // Prevent double calls
    if (hasCalledMutation.current) return;
    
    if (token) {
      hasCalledMutation.current = true;
      console.log('Verifying email with token:', token.substring(0, 10) + '...');
      verifyEmail.mutate({ token });
    } else {
      console.error('No token found in URL. Full location:', location, 'Window search:', window.location.search);
      setStatus('error');
      setMessage('Invalid verification link - no token provided');
    }
  }, []); // Empty dependency array - only run once on mount

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Verifying Your Email</h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">
              {message || 'Your email has been successfully verified.'}
            </p>
            <Button
              onClick={() => setLocation('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              {message || 'We couldn\'t verify your email address.'}
            </p>
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                You can request a new verification email from your dashboard.
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
