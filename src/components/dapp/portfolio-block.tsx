"use client";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import type { PortfolioBlock } from "@/lib/types";
import { Lock, Unlock, Eye, DownloadCloud, LinkIcon, FileText, Briefcase, Star, Phone, Award, GraduationCap } from "lucide-react";
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
  certifications: Award,
  education: GraduationCap,
};


export function PortfolioBlockDisplay({ block }: PortfolioBlockProps) {
  const { state } = useAppContext();
  const isMined = state.mintedBlocks.includes(block.id);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);

  const blockNumber = useMemo(() => state.mintedBlocks.indexOf(block.id), [state.mintedBlocks, block.id]);

  const Icon = useMemo(() => blockIcons[block.id] || LinkIcon, [block.id]);

  return (
    <>
      <motion.div
        className="w-64 sm:w-72 group shrink-0"
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <div
          className={cn(
            "relative w-full rounded-lg border-2 backdrop-blur-xl transition-all duration-300 h-[204px] overflow-hidden",
            isMined
              ? "border-primary/50 bg-primary/10 shadow-2xl shadow-primary/10"
              : "border-border/50 bg-card/50"
          )}
        >
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <motion.div
              className={cn(
                "w-16 h-16 rounded-lg flex items-center justify-center transition-colors duration-300",
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

          <div className="absolute bottom-6 left-6 right-6">
            {isMined ? (
              <Button className="w-full" variant="outline" onClick={() => setIsContentModalOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                View Content
              </Button>
            ) : (
              <Button className="w-full font-bold" variant="secondary" onClick={() => setIsMintModalOpen(true)}>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Mine Block
              </Button>
            )}
          </div>
          
          <AnimatePresence>
            {isMined && (
              <motion.div 
                className="absolute inset-[-1px] border-2 border-primary/80 rounded-lg animate-glow"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ pointerEvents: 'none' }}
              />
            )}
          </AnimatePresence>

        </div>
      </motion.div>
      
      <MintModal
          isOpen={isMintModalOpen}
          onOpenChange={setIsMintModalOpen}
          block={block}
      />

      {isMined && isContentModalOpen && (
        <ContentModal
          isOpen={isContentModalOpen}
          onOpenChange={setIsContentModalOpen}
          block={block}
          blockNumber={blockNumber}
        />
      )}
    </>
  );
}
