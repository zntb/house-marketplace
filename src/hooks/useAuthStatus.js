import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isMounted.current) return; // Check if component is mounted
      if (!user) {
        setLoggedIn(false);
      }
      setCheckingStatus(false);
    });

    return () => {
      isMounted.current = false;
      unsubscribe(); // Unsubscribe from the auth state listener
    };
  }, []);

  return { loggedIn, checkingStatus };
};
