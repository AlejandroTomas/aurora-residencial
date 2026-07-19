import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useLoadingPages = () => {
  const [loadingPage, setLoadingPage] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleStart = () => {
      setLoadingPage(true);
    };
    const handleComplete = () => {
      setLoadingPage(false);
    };

    // Suscribe los eventos de inicio y finalización de la carga de la página
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    // Elimina los eventos al desmontar el componente
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events]);

  return {
    loadingPage,
  };
};
export default useLoadingPages;
