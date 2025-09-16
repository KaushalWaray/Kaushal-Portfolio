"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlockId } from "@/lib/types";
import { AiAssistant } from "@/components/dapp/ai-assistant";
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/contexts/app-context";
import { User } from "lucide-react";
import React from "react";


const blockOrder: PortfolioBlockId[] = ["about", "projects", "skills", "contact"];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.5,
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
    const [pathLength, setPathLength] = React.useState(0);

    const calculatePath = React.useCallback(() => {
        if (fromRef.current && toRef.current) {
            const fromRect = fromRef.current.getBoundingClientRect();
            const toRect = toRef.current.getBoundingClientRect();
            const containerRect = fromRef.current.parentElement?.parentElement?.getBoundingClientRect();

            if (containerRect) {
                const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
                const startY = fromRect.top + fromRect.height - containerRect.top + 20; // from bottom-center
                const endX = toRect.left + toRect.width / 2 - containerRect.left;
                const endY = toRect.top - containerRect.top - 20; // to top-center

                const midY = (startY + endY) / 2;
                const pathData = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
                setPath(pathData);

                // Calculate path length for animation
                const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                tempPath.setAttribute("d", pathData);
                setPathLength(tempPath.getTotalLength());

            }
        }
    }, [fromRef, toRef]);

    React.useEffect(() => {
        calculatePath();
        window.addEventListener('resize', calculatePath);
        return () => window.removeEventListener('resize', calculatePath);
    }, [calculatePath]);

    if (!path) return null;

    return (
        <motion.path
            d={path}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            initial={{ strokeDashoffset: pathLength }}
            animate={{ strokeDashoffset: isVisible ? 0 : pathLength }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="connector-line"
            strokeDasharray={pathLength}
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
    <div className="min-h-screen w-full bg-background overflow-hidden">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <motion.div
            className="relative flex flex-col items-center justify-center gap-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <svg className="absolute w-full h-full" style={{ zIndex: -1 }}>
              {blockOrder.map((id, index) => {
                  const prevId = index === 0 ? 'genesis' : blockOrder[index - 1];
                  // A line is visible if the current block and the *previous* block are minted.
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

            <motion.div ref={genesisRef} variants={itemVariants} className="z-10">
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24 border-4 border-primary shadow-lg">
                        <AvatarImage src={portfolioData.about.content.profileImage} alt="Kaushal Waray" />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <h2 className="font-headline text-3xl font-bold">Kaushal Waray</h2>
                        <p className="text-muted-foreground">Genesis Block</p>
                    </div>
                </div>
            </motion.div>
          
            {blockOrder.map((id) => (
                <motion.div 
                    key={id} 
                    ref={getRef(id)} 
                    variants={itemVariants} 
                    className="z-10"
                >
                    <PortfolioBlockDisplay block={portfolioData[id]} />
                </motion.div>
            ))}

        </motion.div>
      </main>
      <AiAssistant />
    </div>
  );
}
