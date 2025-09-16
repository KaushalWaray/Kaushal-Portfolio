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
import { Lock, Unlock, Eye, Link as LinkIcon } from "lucide-react";
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
      <div className="w-96">
        <Card
          className={`relative overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-primary/20 ${
            isMined
              ? "border-primary/50 bg-card shadow-lg shadow-primary/10"
              : "bg-card/80"
          }`}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="font-headline text-2xl">{block.title}</CardTitle>
                <CardDescription>
                  {isMined
                    ? "This block has been mined and its content is unlocked."
                    : "Mint this block to reveal its content on the portfolio chain."}
                </CardDescription>
              </div>
              {isMined ? (
                <div className="flex items-center gap-2 text-primary shrink-0 ml-4">
                  <Unlock className="h-5 w-5" />
                  <span className="text-sm font-medium">Mined</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground shrink-0 ml-4">
                  <Lock className="h-5 w-5" />
                  <span className="text-sm font-medium">Unmined</span>
                </div>
              )}
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
                Mint Block
              </Button>
            )}
          </CardContent>
          {isMined && (
            <div className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                <LinkIcon className="h-4 w-4"/>
            </div>
          )}
        </Card>
      </div>
      
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
