"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Status = "not-started" | "in-progress" | "complete";
type Progress = Record<string, Status>;

const STORAGE_KEY = "sysdesign-progress";

function getStoredProgress(): Progress {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

const ProgressContext = createContext<{
  progress: Progress;
  setStatus: (slug: string, status: Status) => void;
}>({ progress: {}, setStatus: () => {} });

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(getStoredProgress);

  const setStatus = useCallback((slug: string, status: Status) => {
    setProgress((prev) => {
      const next = { ...prev, [slug]: status };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <ProgressContext.Provider value={{ progress, setStatus }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}

export type { Status };
