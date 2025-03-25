
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { toast } from 'sonner';

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
          toast.error('Authentication failed: ' + sessionError.message);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (!data.session) {
          console.error('No session found');
          setError('Authentication failed. Please try again.');
          toast.error('Authentication failed. No session found.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Successfully authenticated
        toast.success('Successfully authenticated!');
        navigate('/dashboard');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        console.error('Unexpected error during authentication:', err);
        setError('An unexpected error occurred. Please try again.');
        toast.error('Authentication error: ' + errorMessage);
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
