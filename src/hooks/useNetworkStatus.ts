/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  isOffline: boolean;
  isOnline: boolean;
  wasOffline: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  // ✅ null = "aún no sabemos" (estamos en SSR o hidratando)
  const [isOffline, setIsOffline] = useState<boolean | null>(null);
  const [wasOffline, setWasOffline] = useState(false);

  const handleOnline = useCallback(() => {
    setWasOffline(true);
    setIsOffline(false);
    // Limpiar el flag "wasOffline" después de 3 s
    setTimeout(() => setWasOffline(false), 3000);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOffline(true);
    setWasOffline(false);
  }, []);

  useEffect(() => {
    // ✅ Primera lectura real del estado de red, ya en el cliente
    setIsOffline(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Mientras null → asumimos online para no mostrar el banner en SSR
  return {
    isOffline: isOffline ?? false,
    isOnline: !(isOffline ?? false),
    wasOffline,
  };
}