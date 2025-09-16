"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlock, PortfolioBlockId } from "@/lib/types";
import { AiAssistant } from "@/components/dapp/ai-assistant";
import { AnimatePresence, motion } from 'framer-motion';
import React from "react";
import { useAppContext } from "@/contexts/app-context";
import { Cpu, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const contentBlockIds: PortfolioBlockId[] = ["about", "projects", "skills", "contact"];

function DummyBlock() {
    return (
        <div className="w-72 group">
            <div className="relative w-full rounded-2xl border-2 border-dashed border-border/20 bg-card/10 backdrop-blur-xl transition-all duration-500 h-[204px]">
                <div className="p-6 flex flex-col items-center justify-center h-full text-center gap-4 text-muted-foreground">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                    <h3 className="font-headline text-lg">Mining Next Block...</h3>
                    <p className="text-xs font-mono">Waiting for validation</p>
                </div>
            </div>
        </div>
    )
}

export function Dashboard() {
    const { state } = useAppContext();

    const unminedBlocks = contentBlockIds
        .filter(id => !state.mintedBlocks.includes(id))
        .map(id => portfolioData[id]);

    const minedBlocks = state.mintedBlocks.map(id => portfolioData[id]);

    return (
        <div className="min-h-screen w-full bg-background overflow-hidden flex flex-col">
            <Header />
            <main className="flex-1 w-full relative flex flex-col items-center justify-center gap-12 p-8">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] animate-grid [mask-image:radial-gradient(ellipse_100%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>
                </div>

                {/* The Live Chain - Centered Horizontally */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30 backdrop-blur-sm text-primary">
                        <h2 className="font-headline text-xl">The Genesis Chain</h2>
                        <p className="text-sm ">Your personalized portfolio blockchain.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <AnimatePresence>
                            {minedBlocks.map((block, index) => (
                                <React.Fragment key={block.id}>
                                    <motion.div
                                        className={cn("h-1 w-8 flex items-center justify-center transition-opacity duration-1000", index === 0 ? "opacity-0" : "opacity-100")}
                                    >
                                        <div className="w-full h-1 bg-primary/30 relative">
                                            <motion.div
                                                className="absolute top-0 left-0 w-full h-full bg-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 0.5, delay: 0.5 }}
                                            />
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        layoutId={block.id}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    >
                                        <PortfolioBlockDisplay block={block} />
                                    </motion.div>
                                </React.Fragment>
                            ))}
                        </AnimatePresence>

                        {minedBlocks.length > 0 && minedBlocks.length < contentBlockIds.length && (
                             <>
                                <div className="h-1 w-8 flex items-center justify-center">
                                    <div className="w-full h-1 bg-primary/30" />
                                </div>
                                <DummyBlock />
                             </>
                        )}
                        
                        {minedBlocks.length === 0 && (
                            <div className="w-full h-[204px] rounded-2xl border-2 border-dashed border-border/20 bg-card/10 flex items-center justify-center text-muted-foreground p-8">
                                Chain is empty. Start mining from the blocks below!
                            </div>
                        )}
                    </div>
                </div>

                {/* Staging Area for Unmined Blocks */}
                {unminedBlocks.length > 0 && (
                    <div className="relative z-10 w-full max-w-5xl">
                        <div className="text-center p-4 mb-4 rounded-lg bg-card/50 border border-border/20 backdrop-blur-sm">
                            <h2 className="font-headline text-xl text-foreground">Unmined Blocks</h2>
                            <p className="text-sm text-muted-foreground">Select a block to validate and add to the chain.</p>
                        </div>
                        <Carousel
                            opts={{
                                align: "center",
                                loop: false,
                            }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {unminedBlocks.map((block) => (
                                    <CarouselItem key={block.id} className="basis-auto">
                                        <motion.div
                                            layoutId={block.id}
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 50 }}
                                            className="flex justify-center"
                                        >
                                            <PortfolioBlockDisplay block={block} />
                                        </motion.div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                )}
            </main>
            <AiAssistant />
        </div>
    );
}
