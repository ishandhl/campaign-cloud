
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const Callback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session after OAuth redirect
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(sessionError.message);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (!data.session) {
          console.error('No session found');
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Successfully authenticated
        navigate('/dashboard');
      } catch (err) {
        console.error('Unexpected error during authentication:', err);
        setError('An unexpected error occurred. Please try again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {error ? (
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <p>Redirecting to login page...</p>
        </div>
      ) : (
        <>
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg">Completing authentication...</p>
        </>
      )}
    </div>
  );
};

export default Callback;
