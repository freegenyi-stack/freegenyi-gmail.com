"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ChildProfile {
  name: string;
  age: number;
  level: string;
  country: string;
  motivation?: string;
  timeCommitment?: string;
  passions?: string[];
}

interface ChildContextType {
  activeChild: ChildProfile | null;
  setActiveChild: (child: ChildProfile) => void;
  resetChild: () => void;
  isRegistered: boolean;
  isLoading: boolean;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export function ChildProvider({ children }: { children: React.ReactNode }) {
  const [activeChild, setActiveChildState] = useState<ChildProfile | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check for registered profile
    const saved = localStorage.getItem('freegeny_child_profile');
    if (saved) {
      try {
        setActiveChildState(JSON.parse(saved));
        setIsRegistered(true);
      } catch {
        localStorage.removeItem('freegeny_child_profile');
      }
    } else {
      // 2. Check for pending onboarding (user just signed up/logged in from wizard)
      const pending = localStorage.getItem('pendingOnboarding');
      if (pending) {
        try {
          const data = JSON.parse(pending);
          const childProfile: ChildProfile = {
            name: data.name,
            age: parseInt(data.age),
            level: data.level,
            country: data.country,
            motivation: data.motivation,
            timeCommitment: data.timeCommitment
          };
          setActiveChildState(childProfile);
          setIsRegistered(true);
          // Promote to main profile and clear pending
          localStorage.setItem('freegeny_child_profile', JSON.stringify(childProfile));
          localStorage.removeItem('pendingOnboarding');
        } catch (e) {
          console.error("Failed to parse pending onboarding", e);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const setActiveChild = (child: ChildProfile) => {
    setActiveChildState(child);
    setIsRegistered(true);
    localStorage.setItem('freegeny_child_profile', JSON.stringify(child));
  };

  const resetChild = () => {
    setActiveChildState(null);
    setIsRegistered(false);
    localStorage.removeItem('freegeny_child_profile');
  };

  return (
    <ChildContext.Provider value={{ activeChild, setActiveChild, resetChild, isRegistered, isLoading }}>
      {children}
    </ChildContext.Provider>
  );
}

export function useChild() {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
}
