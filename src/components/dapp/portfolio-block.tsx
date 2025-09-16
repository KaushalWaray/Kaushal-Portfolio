"use client";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import type { PortfolioBlock } from "@/lib/types";
import { Lock, Unlock, Eye, DownloadCloud, LinkIcon, FileText, Briefcase, Star, Phone } from "lucide-react";
import { useState, useMemo } from "react";
import { MintModal } from "./mint-modal";
import { ContentModal } from "./content-modal";
import { motion } from "framer-motion";
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
        className="w-full max-w-md group"
        initial={{ opacity: 0.5, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={cn(
            "relative w-full rounded-2xl border transition-all duration-300",
            isMined
              ? "border-primary/40 bg-card shadow-lg shadow-primary/10"
              : "border-border/50 bg-card/60 backdrop-blur-sm"
          )}
        >
          <div className="p-5 flex items-center gap-5">
            <motion.div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0",
                isMined ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
              whileHover={{ scale: 1.1 }}
              transition={{type: 'spring', stiffness: 300}}
            >
              <Icon className="h-7 w-7" />
            </motion.div>
            <div className="flex-grow">
                <h3 className="font-headline text-xl text-foreground">{block.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {isMined ? "Mined & Unlocked" : "Awaiting to be mined"}
                </p>
            </div>
            <div className={`flex items-center gap-2 shrink-0 transition-colors duration-500 ${isMined ? 'text-primary' : 'text-muted-foreground'}`}>
                {isMined ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </div>
          </div>

          <div className="px-5 pb-5">
            {isMined ? (
              <Button className="w-full" variant="outline" onClick={() => setIsContentModalOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                View Content
              </Button>
            ) : (
              <Button className="w-full font-bold" onClick={() => setIsMintModalOpen(true)}>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Mint Block
              </Button>
            )}
          </div>
          
          {isMined && (
            <div className="absolute top-0 right-0 h-full w-1 bg-primary rounded-r-2xl" />
          )}

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
