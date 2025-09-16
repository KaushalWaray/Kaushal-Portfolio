"use client";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import type { PortfolioBlock } from "@/lib/types";
import { Lock, Unlock, Eye, DownloadCloud, LinkIcon, FileText, Briefcase, Star, Phone } from "lucide-react";
import { useState, useMemo } from "react";
import { MintModal } from "./mint-modal";
import { ContentModal } from "./content-modal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PortfolioBlockProps {
  block: PortfolioBlock;
}

const blockIcons: Record<string, React.ElementType> = {
  about: FileText,
  projects: Briefcase,
  skills: Star,
  contact: Phone,
};


export function PortfolioBlockDisplay({ block }: PortfolioBlockProps) {
  const { state } = useAppContext();
  const isMined = state.mintedBlocks.includes(block.id);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);

  const Icon = useMemo(() => blockIcons[block.id] || LinkIcon, [block.id]);

  return (
    <>
      <motion.div
        className="w-72 group"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div
          className={cn(
            "relative w-full rounded-2xl border-2 backdrop-blur-xl transition-all duration-500",
            isMined
              ? "border-primary/70 bg-primary/10 shadow-2xl shadow-primary/20"
              : "border-border/50 bg-card/50"
          )}
        >
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <motion.div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300",
                isMined ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="h-8 w-8" />
            </motion.div>
            <div className="flex-grow">
                <h3 className="font-headline text-2xl text-foreground">{block.title}</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {isMined ? "Mined & Unlocked" : "Awaiting Proof-of-Work"}
                </p>
            </div>
            <div className={`absolute top-3 right-3 flex items-center gap-2 shrink-0 transition-colors duration-500 ${isMined ? 'text-primary' : 'text-muted-foreground'}`}>
                {isMined ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </div>
          </div>

          <div className="px-6 pb-6">
            {isMined ? (
              <Button className="w-full" variant="outline" onClick={() => setIsContentModalOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                View Content
              </Button>
            ) : (
              <Button className="w-full font-bold" onClick={() => setIsMintModalOpen(true)}>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Mine Block
              </Button>
            )}
          </div>
          
          <AnimatePresence>
            {isMined && (
              <motion.div 
                className="absolute inset-0 border-2 border-primary/80 rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ pointerEvents: 'none' }}
              />
            )}
          </AnimatePresence>

        </div>
      </motion.div>
      
      {isMintModalOpen && (
         <MintModal
            isOpen={isMintModalOpen}
            onOpenChange={setIsMintModalOpen}
            block={block}
        />
      )}

      {isMined && isContentModalOpen && (
        <ContentModal
          isOpen={isContentModalOpen}
          onOpenChange={setIsContentModalOpen}
          block={block}
        />
      )}
    </>
  );
}
