"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Status = "not-started" | "in-progress" | "complete";
type Progress = Record<string, Status>;

const ProgressContext = createContext<{
  progress: Progress;
  setStatus: (slug: string, status: Status) => void;
}>({ progress: {}, setStatus: () => {} });

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    const stored = localStorage.getItem("sysdesign-progress");
    if (stored) setProgress(JSON.parse(stored));
  }, []);

  const setStatus = (slug: string, status: Status) => {
    setProgress((prev) => {
      const next = { ...prev, [slug]: status };
      localStorage.setItem("sysdesign-progress", JSON.stringify(next));
      return next;
    });
  };

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
