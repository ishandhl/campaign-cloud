
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!data.session) {
          const noSessionError = 'No session found. The authentication may have been cancelled.';
          console.error(noSessionError);
          setError(noSessionError);
          toast.error(noSessionError);
          setTimeout(() => navigate('/login'), 3000);
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
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center max-w-md">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <p className="text-gray-600 dark:text-gray-300">Redirecting to login page...</p>
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
