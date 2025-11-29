"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { Spinner } from "@heroui/spinner";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (
    isLoading: boolean,
  ) => void | React.Dispatch<React.SetStateAction<boolean>>;
}


const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50  ">
          <div className="flex flex-col items-center gap-4 rounded-lg p-8 shadow-lg dark:bg-gray-800/80">
            <Spinner size="lg" color="white" />
            <p className="text-sm font-medium text-white dark:text-gray-300">
              Loading...
            </p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);

  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }

  return context;
};
