"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { calculateMintCost } from "@/ai/flows/calculate-mint-cost";
import type { PortfolioBlock } from "@/lib/types";
import { AlertTriangle, Loader2 } from "lucide-react";

interface MintModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  block: PortfolioBlock;
}

type MintingState = "calculating" | "mining" | "error";

export function MintModal({ isOpen, onOpenChange, block }: MintModalProps) {
  const { state, dispatch } = useAppContext();
  const { toast } = useToast();

  const [mintingState, setMintingState] = useState<MintingState>("calculating");
  const [baseCost, setBaseCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMintSuccess = useCallback(() => {
    dispatch({
      type: "MINT_BLOCK",
      payload: { blockId: block.id, cost: totalCost },
    });
    toast({
      title: "Mint Successful!",
      description: `Block "${block.title}" has been added to the chain.`,
    });
    onOpenChange(false);
  }, [dispatch, toast, onOpenChange, block.id, totalCost]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setMintingState("calculating");
        setProgress(0);
        setErrorMessage("");
      }, 300);
      return;
    }

    async function getCostAndMine() {
      setMintingState("calculating");
      try {
        const costResult = await calculateMintCost({
          blockType: block.title,
          contentComplexity: block.complexity,
          userEngagementPotential: block.engagement,
        });

        if (costResult && typeof costResult.mintCost === 'number') {
          const calculatedBaseCost = costResult.mintCost / 10;
          const finalTotalCost = calculatedBaseCost + state.gasPrice;
          
          setBaseCost(calculatedBaseCost);
          setTotalCost(finalTotalCost);

          if (state.walletBalance < finalTotalCost) {
            setErrorMessage("Insufficient pETH balance to mint this block.");
            setMintingState("error");
            return;
          }
          
          setMintingState("mining");

        } else {
            throw new Error("Invalid cost calculation result.");
        }
      } catch (error) {
        console.error("Failed to calculate mint cost:", error);
        setErrorMessage("Could not determine minting cost. Please try again later.");
        setMintingState("error");
      }
    }

    getCostAndMine();
  }, [isOpen, block, state.gasPrice, state.walletBalance]);

  useEffect(() => {
    if (mintingState !== 'mining') return;

    const timer = setInterval(() => {
        setProgress(prev => {
            if (prev >= 99) {
                clearInterval(timer);
                // Delay success slightly to allow progress bar to reach 100%
                setTimeout(() => handleMintSuccess(), 200); 
                return 100;
            }
            return prev + 1;
        });
    }, 40);

    return () => clearInterval(timer);
  }, [mintingState, handleMintSuccess]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Mine Block: {block.title}
          </DialogTitle>
          <DialogDescription>
            Transaction in progress. Permanently adding this block to your personal chain.
          </DialogDescription>
        </DialogHeader>
        
        {mintingState === 'calculating' && (
            <div className="flex flex-col items-center justify-center p-8 gap-4 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className="text-center">
                    <p>Submitting to AI Economist...</p>
                    <p className="text-xs">Calculating transaction cost based on block complexity.</p>
                </div>
            </div>
        )}
        
        {mintingState === 'mining' && (
            <div className="space-y-4 p-4">
                <div className="rounded-lg border bg-card/50 p-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base Fee</span>
                        <span className="font-mono">{baseCost.toFixed(4)} pETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Gas Fee</span>
                        <span className="font-mono">{state.gasPrice.toFixed(4)} pETH</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold">
                        <span>Total Cost</span>
                        <span className="font-mono text-primary">{totalCost.toFixed(4)} pETH</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <p className="text-center text-sm text-primary">Mining transaction... (Proof-of-Work)</p>
                    <Progress value={progress} />
                    <p className="text-center text-xs text-muted-foreground font-mono">
                        Block hash: 0x{Array.from({ length: 16 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}...
                    </p>
                </div>
            </div>
        )}

        {mintingState === 'error' && (
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Transaction Failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
        )}

        <DialogFooter>
           {mintingState === 'error' && (
             <Button className="w-full" variant="outline" onClick={() => onOpenChange(false)}>
                Close
            </Button>
           )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
