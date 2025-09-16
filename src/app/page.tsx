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
    // Render a static version of the landing page on the server
    // to avoid a hydration mismatch. This guarantees the first client
    // render matches the server render.
    return <LandingPage />;
  }
  
  return (
    <>
      {state.isAuthenticated ? <Dashboard /> : <LandingPage />}
    </>
  );
}
