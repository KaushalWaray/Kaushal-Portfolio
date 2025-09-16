"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlockId } from "@/lib/types";
import { AiAssistant } from "@/components/dapp/ai-assistant";
import { useAppContext } from "@/contexts/app-context";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

const contentBlockIds: PortfolioBlockId[] = ["about", "projects", "skills", "contact"];
const dummyBlockCount = 4;

export function Dashboard() {
  const { state } = useAppContext();

  const blocks = contentBlockIds.map(id => portfolioData[id]);
  const dummyBlocks = Array.from({ length: dummyBlockCount }, (_, i) => ({ id: `dummy-${i}`, title: 'Dummy Block' }));

  const allBlocks = [...blocks, ...dummyBlocks].sort(() => Math.random() - 0.5);
  const totalBlocks = allBlocks.length;
  const blockWidth = 320; // 288px width + 32px gap
  const chainWidth = totalBlocks * blockWidth;

  const chainVariants = {
    animate: {
      x: [0, -chainWidth],
      transition: {
        x: {
          duration: totalBlocks * 5,
          ease: "linear",
          repeat: Infinity,
        },
      },
    },
  };


  return (
    <div className="min-h-screen w-full bg-background overflow-hidden flex flex-col">
      <Header />
      <main className="flex-1 w-full relative flex flex-col items-center justify-center gap-12 p-8">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] animate-grid [mask-image:radial-gradient(ellipse_100%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            <div className="w-full h-96 flex items-center justify-center">
                <motion.div
                    className="flex items-center"
                    variants={chainVariants}
                    animate="animate"
                >
                    {[...allBlocks, ...allBlocks].map((block, index) => (
                        <div key={`${block.id}-${index}`} className="flex items-center">
                             {block.title === 'Dummy Block' ? (
                                <div className="w-72 group shrink-0">
                                    <div className="relative w-full rounded-2xl border-2 border-dashed border-border/20 bg-card/10 backdrop-blur-xl transition-all duration-500 h-[204px]">
                                        <div className="p-6 flex flex-col items-center justify-center h-full text-center gap-4 text-muted-foreground">
                                            <Cpu className="h-10 w-10 text-primary/50" />
                                            <h3 className="font-headline text-lg">Empty Block</h3>
                                            <p className="text-xs font-mono">Awaiting data...</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <PortfolioBlockDisplay block={portfolioData[block.id as PortfolioBlockId]} />
                            )}
                            <div className="w-8 h-1 bg-primary/30 mx-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-full bg-primary/30 connector-line"/>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
      </main>
      <AiAssistant />
    </div>
  );
}
