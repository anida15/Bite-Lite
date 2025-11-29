"use client";

import { createContext, useContext, useState } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string | undefined;
}

export interface BreadcrumbContextType {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
}

export const BreadcrumbContext = createContext<
  BreadcrumbContextType | undefined
>(undefined);

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  const value = { items, setItems };

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }

  return context;
};
