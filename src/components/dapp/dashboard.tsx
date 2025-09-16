"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlockId } from "@/lib/types";
import { useAppContext } from "@/contexts/app-context";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const contentBlockIds: PortfolioBlockId[] = ["about", "projects", "skills", "certifications", "contact"];

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
  
    return <motion.div className="absolute inset-0 z-0" style={{ background }} />;
};


export function Dashboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const contentBlocks = contentBlockIds.map(id => portfolioData[id]);
  const totalBlocks = contentBlocks.length;
  const blockWidth = 352; // 288px width + 64px gap
  const chainWidth = totalBlocks * blockWidth;

  const chainVariants = {
    animate: {
      x: [0, -chainWidth],
      transition: {
        x: {
          duration: totalBlocks * 10, // Slower, more majestic speed
          ease: "linear",
          repeat: Infinity,
        },
      },
    },
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-full bg-background overflow-hidden flex flex-col">
      <Header />
      <main className="flex-1 w-full relative flex flex-col items-center justify-center p-8">
        <div className="absolute inset-0 z-0">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--secondary)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--secondary)/0.4)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
           {/* Mouse-following spotlight */}
           <MouseTrackedSpotlight />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            <div className="w-full h-96 flex items-center justify-center">
              {contentBlocks.length > 0 && (
                <motion.div
                    className="flex items-center"
                    variants={chainVariants}
                    animate="animate"
                >
                    {[...contentBlocks, ...contentBlocks].map((block, index) => (
                        <div key={`${block.id}-${index}`} className="flex items-center px-8">
                            <PortfolioBlockDisplay block={portfolioData[block.id as PortfolioBlockId]} />
                            <svg width="64" height="24" viewBox="0 0 64 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-6 mx-4 text-primary/30">
                              <path d="M0 12L10 12M54 12L64 12M22 12L42 12" stroke="currentColor" strokeWidth="2"/>
                              <path className="connector-line" d="M10 2L22 2V22H10V18C10 14.6863 12.6863 12 16 12C12.6863 12 10 9.31371 10 6V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path className="connector-line" d="M54 2L42 2V22H54V18C54 14.6863 51.3137 12 48 12C51.3137 12 54 9.31371 54 6V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    ))}
                </motion.div>
              )}
            </div>
        </div>
      </main>
    </div>
  );
}
