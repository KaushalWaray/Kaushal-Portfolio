"use client";

import { Dashboard } from "@/components/dapp/dashboard";
import { LandingPage } from "@/components/dapp/landing-page";
import { useAppContext } from "@/contexts/app-context";
import { useEffect, useState } from "react";

export default function Home() {
  const { state } = useAppContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  if (!state.isAuthenticated) {
    return <LandingPage />;
  }

  return <Dashboard />;
}
