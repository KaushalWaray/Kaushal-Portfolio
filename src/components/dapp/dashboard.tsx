"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlockId } from "@/lib/types";
import { AiAssistant } from "@/components/dapp/ai-assistant";
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/contexts/app-context";
import { Link, User } from "lucide-react";
import React from "react";


const blockOrder: PortfolioBlockId[] = ["about", "projects", "skills", "contact"];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const LineConnector = ({ fromRef, toRef }: { fromRef: React.RefObject<HTMLDivElement>, toRef: React.RefObject<HTMLDivElement> }) => {
    const [path, setPath] = React.useState('');

    React.useEffect(() => {
        const calculatePath = () => {
            if (fromRef.current && toRef.current) {
                const fromRect = fromRef.current.getBoundingClientRect();
                const toRect = toRef.current.getBoundingClientRect();
                const containerRect = fromRef.current.parentElement?.parentElement?.getBoundingClientRect();

                if (containerRect) {
                    const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
                    const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
                    const endX = toRect.left + toRect.width / 2 - containerRect.left;
                    const endY = toRect.top + toRect.height / 2 - containerRect.top;

                    const midY = (startY + endY) / 2;
                    setPath(`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`);
                }
            }
        };

        calculatePath();

        const observer = new ResizeObserver(calculatePath);
        if (fromRef.current) observer.observe(fromRef.current);
        if (toRef.current) observer.observe(toRef.current);

        return () => observer.disconnect();

    }, [fromRef, toRef]);

    if (!path) return null;

    return (
        <motion.path
            d={path}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="connector-line"
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
            className="relative flex flex-col items-center justify-center space-y-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <svg className="absolute w-full h-full" style={{ zIndex: -1 }}>
              {blockOrder.map((id, index) => {
                  if(state.mintedBlocks.includes(id)) {
                      const prevId = index === 0 ? 'genesis' : blockOrder[index - 1];
                      if (state.mintedBlocks.includes(prevId) || prevId === 'genesis') {
                          return (
                            <LineConnector
                                key={`line-${id}`}
                                fromRef={getRef(prevId)}
                                toRef={getRef(id)}
                            />
                          );
                      }
                  }
                  return null;
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
          
            {blockOrder.map((id, index) => (
                <motion.div 
                    key={id} 
                    ref={getRef(id)} 
                    variants={itemVariants} 
                    className="z-10"
                    initial={state.mintedBlocks.includes(id) ? 'visible' : 'hidden'}
                    animate={state.mintedBlocks.includes(id) ? 'visible' : 'hidden'}
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
