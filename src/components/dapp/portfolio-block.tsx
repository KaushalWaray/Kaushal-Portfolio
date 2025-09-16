"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import type { PortfolioBlock } from "@/lib/types";
import { Lock, Unlock, Eye, Link as LinkIcon, DownloadCloud } from "lucide-react";
import { useState } from "react";
import { MintModal } from "./mint-modal";
import { ContentModal } from "./content-modal";
import { motion } from "framer-motion";

interface PortfolioBlockProps {
  block: PortfolioBlock;
}

export function PortfolioBlockDisplay({ block }: PortfolioBlockProps) {
  const { state } = useAppContext();
  const isMined = state.mintedBlocks.includes(block.id);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);

  return (
    <>
      <motion.div 
        className="w-96"
        initial={{ opacity: 0.5, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className={`relative overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-primary/20 ${
            isMined
              ? "border-primary/50 bg-card shadow-lg shadow-primary/10"
              : "border-border/50 bg-card/60 backdrop-blur-sm"
          }`}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="font-headline text-2xl">{block.title}</CardTitle>
                <CardDescription>
                  {isMined
                    ? "Mined & Unlocked"
                    : "Awaiting to be mined on-chain"}
                </CardDescription>
              </div>
              <div className={`flex items-center gap-2 shrink-0 ml-4 transition-colors duration-500 ${isMined ? 'text-primary' : 'text-muted-foreground'}`}>
                {isMined ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                <span className="text-sm font-medium">{isMined ? "Mined" : "Unmined"}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          {isMined && (
            <motion.div 
              className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary"
              initial={{scale: 0, rotate: -180}}
              animate={{scale: 1, rotate: 0}}
              transition={{delay: 0.3, type: 'spring'}}
            >
                <LinkIcon className="h-4 w-4"/>
            </motion.div>
          )}
        </Card>
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
