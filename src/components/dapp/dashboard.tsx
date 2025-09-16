"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlockId } from "@/lib/types";
import { AiAssistant } from "@/components/dapp/ai-assistant";
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/contexts/app-context";
import { User, Dna } from "lucide-react";
import React from "react";


const blockOrder: PortfolioBlockId[] = ["about", "projects", "skills", "contact"];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
        }
    }
};

const LineConnector = ({ fromRef, toRef, isVisible }: { fromRef: React.RefObject<HTMLDivElement>, toRef: React.RefObject<HTMLDivElement>, isVisible: boolean }) => {
    const [path, setPath] = React.useState('');
    const pathRef = React.useRef<SVGPathElement>(null);

    const calculatePath = React.useCallback(() => {
        if (fromRef.current && toRef.current) {
            const fromRect = fromRef.current.getBoundingClientRect();
            const toRect = toRef.current.getBoundingClientRect();
            const containerRect = fromRef.current.closest('main')?.getBoundingClientRect();

            if (containerRect) {
                const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
                const startY = fromRect.top + fromRect.height - containerRect.top + 5;
                const endX = toRect.left + toRect.width / 2 - containerRect.left;
                const endY = toRect.top - containerRect.top - 5;

                const midY = startY + (endY - startY) * 0.4;
                const pathData = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
                setPath(pathData);
            }
        }
    }, [fromRef, toRef]);

    React.useEffect(() => {
        calculatePath();
        window.addEventListener('resize', calculatePath);
        const observer = new MutationObserver(calculatePath);
        if(fromRef.current?.parentElement) {
          observer.observe(fromRef.current.parentElement, { attributes: true, childList: true, subtree: true });
        }


        return () => {
          window.removeEventListener('resize', calculatePath);
          observer.disconnect();
        }
    }, [calculatePath, fromRef]);

    const pathLength = pathRef.current?.getTotalLength() ?? 0;

    return (
        <motion.path
            ref={pathRef}
            d={path}
            fill="none"
            stroke="hsl(var(--primary) / 0.5)"
            strokeWidth="1.5"
            initial={{ strokeDashoffset: pathLength }}
            animate={{ strokeDashoffset: isVisible ? 0 : pathLength }}
            transition={{ duration: 1, ease: "easeInOut" }}
            strokeDasharray={pathLength}
            className="opacity-70"
        />
    );
};

export function Dashboard() {
  const { state } = useAppContext();
  const blockRefs = React.useRef(new Map<PortfolioBlockId | 'genesis', React.RefObject<HTMLDivElement>>());

  const getRef = (id: PortfolioBlockId | 'genesis') => {
      if (!blockRefs.current.has(id)) {
          blockRefs.current.set(id, React.createRef<HTMLDivElement>());
      }
      return blockRefs.current.get(id)!;
  };

  const genesisRef = getRef('genesis');
  
  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden">
      <Header />
      <main className="container mx-auto px-4 py-12 sm:py-16 md:py-20 relative">
        
        <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: -1, pointerEvents: 'none' }}>
            {blockOrder.map((id, index) => {
                const prevId = index === 0 ? 'genesis' : (index <= 2 ? 'genesis' : blockOrder[index-2]);
                const isLineVisible = state.mintedBlocks.includes(id) && (prevId === 'genesis' || state.mintedBlocks.includes(prevId));
                return (
                  <LineConnector
                      key={`line-${id}`}
                      fromRef={getRef(prevId)}
                      toRef={getRef(id)}
                      isVisible={isLineVisible}
                  />
                );
            })}
        </svg>

        <motion.div
            className="flex flex-col items-center gap-y-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <motion.div ref={genesisRef} variants={itemVariants} className="z-10 w-full flex justify-center">
              <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-28 h-28 border-4 border-primary/80 shadow-lg bg-background p-1">
                        <AvatarImage src={portfolioData.about.content.profileImage} alt="Kaushal Waray" className="rounded-full"/>
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-3 -right-3 bg-primary rounded-full p-2 border-4 border-background">
                        <Dna className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-center">
                      <h2 className="font-headline text-3xl font-bold">Kaushal Waray</h2>
                      <p className="text-muted-foreground text-sm font-mono">Genesis Block</p>
                  </div>
              </div>
          </motion.div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 lg:gap-x-24 xl:gap-x-32">
            {blockOrder.map((id) => (
                <motion.div 
                    key={id} 
                    ref={getRef(id)} 
                    variants={itemVariants} 
                    className="z-10 flex justify-center"
                >
                    <PortfolioBlockDisplay block={portfolioData[id]} />
                </motion.div>
            ))}
          </div>

        </motion.div>
      </main>
      <AiAssistant />
    </div>
  );
}
