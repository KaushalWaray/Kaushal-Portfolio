"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlockId } from "@/lib/types";
import { AiAssistant } from "@/components/dapp/ai-assistant";
import { motion } from 'framer-motion';
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Cpu } from "lucide-react";


const contentBlockIds: PortfolioBlockId[] = ["about", "projects", "skills", "contact"];
const totalBlocks = 12; // 4 content blocks + 8 dummy blocks

const blockData = Array.from({ length: totalBlocks }).map((_, index) => {
    const isContentBlock = index % 3 === 0;
    if (isContentBlock) {
        const contentIndex = index / 3;
        if (contentIndex < contentBlockIds.length) {
          const id = contentBlockIds[contentIndex];
          return { isDummy: false, id: id, data: portfolioData[id] };
        }
    }
    return { isDummy: true, id: `dummy-${index}` };
});


export function Dashboard() {
    const [[windowWidth, windowHeight], setWindowSize] = useState([0, 0]);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial size
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const radius = Math.min(windowWidth, windowHeight) / 2.5;

    const getPosition = (index: number) => {
        const angle = (index / totalBlocks) * 2 * Math.PI;
        const x = radius * Math.cos(angle - Math.PI / 2);
        const y = radius * Math.sin(angle - Math.PI / 2);
        return { x, y };
    };

    const Line = ({ fromIndex, toIndex }: { fromIndex: number, toIndex: number }) => {
        const fromPos = getPosition(fromIndex);
        const toPos = getPosition(toIndex);
        
        const path = `M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`;

        return <motion.path d={path} className="connector-line" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1" />;
    };
    
    if (windowWidth === 0) return null; // Avoid rendering on server or before client-side measurement

    return (
        <div className="min-h-screen w-full bg-background overflow-hidden">
            <Header />
            <main className="h-[calc(100vh-4rem)] w-full relative flex items-center justify-center">

                <motion.div
                    className="absolute"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
                >
                    <svg className="absolute top-0 left-0" width={radius*2.1} height={radius*2.1} viewBox={`${-radius*1.05} ${-radius*1.05} ${radius*2.1} ${radius*2.1}`} style={{transform: 'translate(-50%, -50%)'}}>
                        <g>
                           {blockData.map((_, i) => (
                               <Line key={`line-${i}`} fromIndex={i} toIndex={(i + 1) % totalBlocks} />
                           ))}
                           {/* Add some cross-connections for visual complexity */}
                           <Line fromIndex={0} toIndex={6} />
                           <Line fromIndex={3} toIndex={9} />
                        </g>
                    </svg>

                    {blockData.map((block, index) => {
                        const { x, y } = getPosition(index);
                        return (
                            <motion.div
                                key={block.id}
                                className="absolute"
                                initial={{ x: 0, y: 0 }}
                                animate={{ x, y }}
                                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                            >
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
                                >
                                    {block.isDummy ? (
                                        <DummyBlock />
                                    ) : (
                                        'data' in block && block.data ? (
                                            <PortfolioBlockDisplay block={block.data} />
                                        ) : null
                                    )}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </main>
            <AiAssistant />
        </div>
    );
}


function DummyBlock() {
    return (
        <div
            className={cn(
                "relative w-72 rounded-2xl border-2 backdrop-blur-xl transition-all duration-500",
                "border-border/10 bg-card/5",
                "flex flex-col items-center justify-center p-6 gap-4 text-center h-[204px]"
            )}
        >
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted/20 text-muted-foreground/30">
                <Cpu className="h-8 w-8" />
            </div>
            <div>
                <h3 className="font-mono text-xl text-muted-foreground/30">Empty Block</h3>
                <p className="text-sm text-muted-foreground/20 font-mono">Unallocated</p>
            </div>
        </div>
    );
}
