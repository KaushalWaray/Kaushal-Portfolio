"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlockId } from "@/lib/types";
import { useAppContext } from "@/contexts/app-context";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { OnboardingGuide } from "./onboarding-guide";
import { RewardModal } from "./reward-modal";
import { AiAssistant } from "./ai-assistant";

const contentBlockIds: PortfolioBlockId[] = ["about", "projects", "skills", "education", "certifications", "contact"];

const MouseTrackedSpotlight = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
  
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);
  
    const background = useTransform(
      [mouseX, mouseY],
      ([x, y]) => `radial-gradient(600px at ${x}px ${y}px, hsl(var(--primary)/0.1), transparent 80%)`
    );
  
    return <motion.div className="pointer-events-none absolute inset-0 z-10" style={{ background }} />;
};


export function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const { state } = useAppContext();
  const [showReward, setShowReward] = useState(false);
  const [hasShownReward, setHasShownReward] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const contentBlocks = useMemo(() => contentBlockIds.map(id => portfolioData[id]), []);

  useEffect(() => {
    const allBlocksMined = contentBlocks.every(block => state.mintedBlocks.includes(block.id));
    if (allBlocksMined && !hasShownReward) {
      setShowReward(true);
      setHasShownReward(true);
    }
  }, [state.mintedBlocks, contentBlocks, hasShownReward]);


  const doubledContentBlocks = useMemo(() => [...contentBlocks, ...contentBlocks], [contentBlocks]);

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-full bg-background overflow-hidden flex flex-col">
      <Header />
      <main className="flex-1 w-full relative flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--secondary)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--secondary)/0.4)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        <MouseTrackedSpotlight />

        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
            <div className="w-full h-96 flex items-center justify-center overflow-hidden">
              {contentBlocks.length > 0 && (
                <div className="w-max">
                  <motion.div
                      className="flex items-center animate-marquee"
                  >
                      {doubledContentBlocks.map((block, index) => (
                          <div key={`${block.id}-${index}`} className="flex items-center">
                              <div className="mx-8">
                                <PortfolioBlockDisplay block={portfolioData[block.id as PortfolioBlockId]} />
                              </div>
                              <svg width="64" height="24" viewBox="0 0 64 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-6 shrink-0 text-primary/30 -mx-8 z-[-1] relative">
                                  <path d="M0 12H10" stroke="currentColor" strokeWidth="2"/>
                                  <path d="M54 12H64" stroke="currentColor" strokeWidth="2"/>
                                  <path className="connector-line" d="M10 2L22 2V22H10V18C10 14.6863 12.6863 12 16 12C12.6863 12 10 9.31371 10 6V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path className="connector-line" d="M54 2L42 2V22H54V18C54 14.6863 51.3137 12 48 12C51.3137 12 54 9.31371 54 6V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                          </div>
                      ))}
                  </motion.div>
                </div>
              )}
            </div>
        </div>
      </main>
      {!state.hasCompletedOnboarding && state.isAuthenticated && <OnboardingGuide />}
      <RewardModal isOpen={showReward} onOpenChange={setShowReward} />
      <AiAssistant />
    </div>
  );
}
