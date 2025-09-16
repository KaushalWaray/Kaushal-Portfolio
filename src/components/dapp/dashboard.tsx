"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlockId } from "@/lib/types";
import { AiAssistant } from "@/components/dapp/ai-assistant";
import { motion } from 'framer-motion';
import { useAppContext } from "@/contexts/app-context";
import React from "react";
import { cn } from "@/lib/utils";
import { Cpu } from "lucide-react";


const contentBlockIds: PortfolioBlockId[] = ["about", "projects", "skills", "contact"];
const totalBlocks = 12; // 4 content blocks + 8 dummy blocks

const blockData = Array.from({ length: totalBlocks }).map((_, index) => {
    const isContentBlock = index % 3 === 0;
    if (isContentBlock) {
        const contentIndex = index / 3;
        const id = contentBlockIds[contentIndex];
        return { isDummy: false, id: id, data: portfolioData[id] };
    }
    return { isDummy: true, id: `dummy-${index}` };
});


export function Dashboard() {
    const radius = Math.min(window.innerWidth, window.innerHeight) / 2 - 80;
    const blockRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    const getPosition = (index: number) => {
        const angle = (index / totalBlocks) * 2 * Math.PI;
        const x = radius * Math.cos(angle - Math.PI / 2);
        const y = radius * Math.sin(angle - Math.PI / 2);
        return { x, y };
    };

    const Line = ({ fromIndex, toIndex }: { fromIndex: number, toIndex: number }) => {
        const [path, setPath] = React.useState('');

        React.useEffect(() => {
            const fromPos = getPosition(fromIndex);
            const toPos = getPosition(toIndex);
            
            setPath(`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`);

        }, [fromIndex, toIndex]);

        return <motion.path d={path} stroke="hsl(var(--primary) / 0.2)" strokeWidth="1" />;
    };

    return (
        <div className="min-h-screen w-full bg-background overflow-hidden">
            <Header />
            <main className="h-[calc(100vh-4rem)] w-full relative flex items-center justify-center">

                <motion.div
                    className="absolute"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
                >
                    <svg className="absolute top-0 left-0" width={radius*2} height={radius*2} viewBox={`${-radius} ${-radius} ${radius*2} ${radius*2}`} style={{transform: 'translate(-50%, -50%)'}}>
                        <g>
                           {blockData.map((_, i) => (
                               <Line key={`line-${i}`} fromIndex={i} toIndex={(i + 1) % totalBlocks} />
                           ))}
                        </g>
                    </svg>

                    {blockData.map((block, index) => {
                        const { x, y } = getPosition(index);
                        return (
                            <motion.div
                                key={block.id}
                                ref={el => blockRefs.current[index] = el}
                                className="absolute"
                                initial={{ x: 0, y: 0 }}
                                animate={{ x, y }}
                                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                                style={{
                                    transformOrigin: `${-x}px ${-y}px`,
                                }}
                            >
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
                                >
                                    {block.isDummy ? (
                                        <DummyBlock />
                                    ) : (
                                        <PortfolioBlockDisplay block={block.data!} />
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
                "border-border/20 bg-card/10",
                "flex flex-col items-center justify-center p-6 gap-4 text-center h-[204px]"
            )}
        >
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted/50 text-muted-foreground/50">
                <Cpu className="h-8 w-8" />
            </div>
            <div>
                <h3 className="font-mono text-xl text-muted-foreground/50">Empty Block</h3>
                <p className="text-sm text-muted-foreground/30 font-mono">Unallocated</p>
            </div>
        </div>
    );
}
