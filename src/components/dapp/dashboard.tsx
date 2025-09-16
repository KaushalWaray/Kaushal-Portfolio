"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlockId } from "@/lib/types";
import { AiAssistant } from "@/components/dapp/ai-assistant";
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/contexts/app-context";
import { User, Dna } from "lucide-react";
import React from "react";


const blockOrder: PortfolioBlockId[] = ["about", "projects", "skills", "contact"];

const orbitalPositions = [
    { top: '15%', left: '15%' }, // about
    { top: '25%', left: '75%' }, // projects
    { top: '70%', left: '10%' }, // skills
    { top: '75%', left: '80%' }, // contact
];

const LineConnector = ({ fromRef, toRef, isVisible }: { fromRef: React.RefObject<HTMLDivElement>, toRef: React.RefObject<HTMLDivElement>, isVisible: boolean }) => {
    const [path, setPath] = React.useState('');

    const calculatePath = React.useCallback(() => {
        if (fromRef.current && toRef.current) {
            const fromRect = fromRef.current.getBoundingClientRect();
            const toRect = toRef.current.getBoundingClientRect();
            const containerRect = fromRef.current.closest('main')?.getBoundingClientRect();

            if (containerRect) {
                const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
                const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
                const endX = toRect.left + toRect.width / 2 - containerRect.left;
                const endY = toRect.top + toRect.height / 2 - containerRect.top;
                
                const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
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

    return (
      <AnimatePresence>
        {isVisible && (
            <motion.path
                d={path}
                fill="none"
                stroke="hsl(var(--primary) / 0.3)"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="connector-line"
            />
        )}
      </AnimatePresence>
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
    <div className="min-h-screen w-full bg-background overflow-hidden">
      <Header />
      <main className="h-[calc(100vh-4rem)] w-full relative">
        
        <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1, pointerEvents: 'none' }}>
            {blockOrder.map((id) => {
                const isLineVisible = state.mintedBlocks.includes(id);
                return (
                  <LineConnector
                      key={`line-${id}`}
                      fromRef={genesisRef}
                      toRef={getRef(id)}
                      isVisible={isLineVisible}
                  />
                );
            })}
        </svg>

        <div ref={genesisRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div 
            className="flex flex-col items-center space-y-4"
            animate={{
                scale: [1, 1.03, 1],
                transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
            }}
          >
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary/80 shadow-lg bg-background p-1">
                    <AvatarImage src={portfolioData.about.content.profileImage} alt="Kaushal Waray" className="rounded-full"/>
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 -right-3 bg-primary rounded-full p-2 border-4 border-background">
                    <Dna className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <div className="text-center">
                  <h2 className="font-headline text-3xl font-bold">Kaushal Waray</h2>
                  <p className="text-muted-foreground text-sm font-mono">Genesis Block</p>
              </div>
          </motion.div>
        </div>

        {blockOrder.map((id, index) => (
            <motion.div
                key={id}
                ref={getRef(id)}
                className="absolute z-10"
                style={{ ...orbitalPositions[index] }}
                animate={{
                    transform: [
                        'translate(0px, 0px)',
                        'translate(5px, 5px)',
                        'translate(0px, 10px)',
                        'translate(-5px, 5px)',
                        'translate(0px, 0px)',
                    ],
                }}
                transition={{
                    duration: 10 + index * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatType: 'mirror'
                }}
            >
                <PortfolioBlockDisplay block={portfolioData[id]} />
            </motion.div>
        ))}

      </main>
      <AiAssistant />
    </div>
  );
}
