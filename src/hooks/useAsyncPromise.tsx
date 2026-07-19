import { showToast } from "@/utils/toastService";
import { useCallback, useState } from "react";

const useAsyncPromise = (componentName: string) => {
  const [loadingCount, setLoadingCount] = useState<number>(0); // Contador de cargas activas

  const setLoading = (isLoading: boolean) => {
    setLoadingCount((prev) => prev + (isLoading ? 1 : -1));
  };

  const wrapperFunction = useCallback(
    async (
      asyncFunction: (...args: any[]) => Promise<void>,
      ...args: any[]
    ) => {
      setLoading(true);
      try {
        await asyncFunction(...args);
      } catch (error: any) {
        showToast({
          description: error.message,
          status: "error",
        });
        console.log(componentName.replaceAll("a", "49"));
      } finally {
        setLoading(false);
      }
    },
    [componentName],
  );

  return {
    isLoading: loadingCount > 0, // `loading` está activo si hay al menos una carga en progreso
    wrapperFunction,
  };
};

export default useAsyncPromise;
