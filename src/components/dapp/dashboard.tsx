"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlock, PortfolioBlockId } from "@/lib/types";
import { AiAssistant } from "@/components/dapp/ai-assistant";
import { AnimatePresence, motion } from 'framer-motion';
import React from "react";
import { useAppContext } from "@/contexts/app-context";
import { ArrowRight, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const contentBlockIds: PortfolioBlockId[] = ["about", "projects", "skills", "contact"];

export function Dashboard() {
    const { state } = useAppContext();

    const unminedBlocks = contentBlockIds
        .filter(id => !state.mintedBlocks.includes(id))
        .map(id => portfolioData[id]);

    const minedBlocks = state.mintedBlocks.map(id => portfolioData[id]);

    return (
        <div className="min-h-screen w-full bg-background overflow-hidden flex flex-col">
            <Header />
            <main className="flex-1 w-full relative">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] animate-grid [mask-image:radial-gradient(ellipse_100%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>
                </div>

                <div className="relative z-10 h-full flex items-center justify-center gap-16 p-8">
                    {/* Staging Area for Unmined Blocks */}
                    <div className="flex flex-col gap-8 w-[320px] shrink-0">
                        <div className="text-center p-4 rounded-lg bg-card/50 border border-border/20 backdrop-blur-sm">
                            <h2 className="font-headline text-xl text-foreground">Unmined Blocks</h2>
                            <p className="text-sm text-muted-foreground">Select a block to validate and add to the chain.</p>
                        </div>
                        {unminedBlocks.map((block) => (
                            <motion.div 
                                key={block.id}
                                layoutId={block.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                            >
                                <PortfolioBlockDisplay block={block} />
                            </motion.div>
                        ))}
                        {minedBlocks.length === contentBlockIds.length && (
                            <div className="text-center p-6 rounded-lg bg-card/50 text-muted-foreground">
                                All blocks have been mined!
                            </div>
                        )}
                    </div>
                    
                    <ArrowRight className="h-16 w-16 text-primary/30 shrink-0 hidden lg:block" />

                    {/* The Live Chain */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                           <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30 backdrop-blur-sm text-primary">
                                <h2 className="font-headline text-xl">The Genesis Chain</h2>
                                <p className="text-sm ">Your personalized portfolio blockchain.</p>
                           </div>
                           
                           <AnimatePresence>
                                {minedBlocks.map((block, index) => (
                                    <React.Fragment key={block.id}>
                                        <motion.div
                                            className={cn("w-full h-8 flex items-center justify-center transition-opacity duration-1000", index === 0 ? "opacity-0" : "opacity-100")}
                                        >
                                            <div className="w-1 h-full bg-primary/30 relative">
                                                <motion.div 
                                                    className="absolute top-0 left-0 w-full h-full bg-primary"
                                                    initial={{ height: 0 }}
                                                    animate={{ height: "100%" }}
                                                    transition={{ duration: 0.5, delay: 0.5 }}
                                                />
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            layoutId={block.id}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                            className="w-full"
                                        >
                                            <PortfolioBlockDisplay block={block} />
                                        </motion.div>
                                    </React.Fragment>
                                ))}
                           </AnimatePresence>
                           
                           {minedBlocks.length === 0 && (
                                <div className="w-full h-[204px] rounded-2xl border-2 border-dashed border-border/20 bg-card/10 flex items-center justify-center text-muted-foreground">
                                    Chain is empty. Start mining!
                                </div>
                           )}
                        </div>
                    </div>
                </div>

            </main>
            <AiAssistant />
        </div>
    );
}
