"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlockId } from "@/lib/types";
import { useAppContext } from "@/contexts/app-context";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Cpu } from "lucide-react";
import { useEffect, useState } from "react";

const contentBlockIds: PortfolioBlockId[] = ["about", "projects", "skills", "contact"];
const dummyBlockCount = 4;

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
  const { state } = useAppContext();
  const [isClient, setIsClient] = useState(false);
  const [shuffledBlocks, setShuffledBlocks] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
    const blocks = contentBlockIds.map(id => portfolioData[id]);
    const dummyBlocks = Array.from({ length: dummyBlockCount }, (_, i) => ({ id: `dummy-${i}`, title: 'Empty Block' }));
    
    const allBlocks = [...blocks, ...dummyBlocks];
    // Shuffle the array to make the chain look different on each load
    for (let i = allBlocks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allBlocks[i], allBlocks[j]] = [allBlocks[j], allBlocks[i]];
    }
    setShuffledBlocks(allBlocks);
  }, []);

  const totalBlocks = shuffledBlocks.length;
  const blockWidth = 352; // 320px width + 32px gap
  const chainWidth = totalBlocks * blockWidth;

  const chainVariants = {
    animate: {
      x: [0, -chainWidth],
      transition: {
        x: {
          duration: totalBlocks * 7, // Slower, more majestic speed
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
              {shuffledBlocks.length > 0 && (
                <motion.div
                    className="flex items-center"
                    variants={chainVariants}
                    animate="animate"
                >
                    {[...shuffledBlocks, ...shuffledBlocks].map((block, index) => (
                        <div key={`${block.id}-${index}`} className="flex items-center px-4">
                             {block.title === 'Empty Block' ? (
                                <motion.div 
                                    className="w-72 group shrink-0"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <div className="relative w-full rounded-2xl border-2 border-dashed border-border/20 bg-card/10 backdrop-blur-xl transition-all duration-500 h-[204px]">
                                        <div className="p-6 flex flex-col items-center justify-center h-full text-center gap-4 text-muted-foreground">
                                            <Cpu className="h-10 w-10 text-primary/50" />
                                            <h3 className="font-headline text-lg">Empty Block</h3>
                                            <p className="text-xs font-mono">Awaiting data...</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <PortfolioBlockDisplay block={portfolioData[block.id as PortfolioBlockId]} />
                            )}
                            <div className="w-8 h-1 bg-primary/30 mx-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-full bg-primary/30 connector-line"/>
                            </div>
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
