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
import { Lock, Unlock, Eye } from "lucide-react";
import { useState } from "react";
import { MintModal } from "./mint-modal";
import { ContentModal } from "./content-modal";

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
      <Card
        className={`relative overflow-hidden transition-all duration-300 ${
          isMined
            ? "border-primary/50 bg-card shadow-lg shadow-primary/10"
            : "bg-card/80"
        }`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-headline text-2xl">{block.title}</CardTitle>
            {isMined ? (
              <div className="flex items-center gap-2 text-primary">
                <Unlock className="h-5 w-5" />
                <span className="text-sm font-medium">Mined</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="h-5 w-5" />
                <span className="text-sm font-medium">Unmined</span>
              </div>
            )}
          </div>
          <CardDescription>
            {isMined
              ? "This block has been mined and its content is unlocked."
              : "Mint this block to reveal its content on the DAppfolio chain."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isMined ? (
            <Button className="w-full" variant="outline" onClick={() => setIsContentModalOpen(true)}>
              <Eye className="mr-2 h-4 w-4" />
              View Content
            </Button>
          ) : (
            <Button className="w-full font-bold" onClick={() => setIsMintModalOpen(true)}>
              Mint Block
            </Button>
          )}
        </CardContent>
      </Card>
      
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
