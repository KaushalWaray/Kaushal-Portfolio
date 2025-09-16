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
import { useState, useEffect } from "react";
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

type MintingState = "idle" | "calculating" | "confirm" | "mining" | "error";

export function MintModal({ isOpen, onOpenChange, block }: MintModalProps) {
  const { state, dispatch } = useAppContext();
  const { toast } = useToast();

  const [mintingState, setMintingState] = useState<MintingState>("calculating");
  const [baseCost, setBaseCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setTimeout(() => {
        setMintingState("calculating");
        setProgress(0);
        setErrorMessage("");
      }, 300);
      return;
    }

    async function getCost() {
      setMintingState("calculating");
      try {
        const costResult = await calculateMintCost({
          blockType: block.title,
          contentComplexity: block.complexity,
          userEngagementPotential: block.engagement,
        });

        if (costResult && typeof costResult.mintCost === 'number') {
          const calculatedBaseCost = costResult.mintCost / 10; // Adjusting scale for better UI representation
          setBaseCost(calculatedBaseCost);
          setTotalCost(calculatedBaseCost + state.gasPrice);
          setMintingState("confirm");
        } else {
            throw new Error("Invalid cost calculation result.");
        }
      } catch (error) {
        console.error("Failed to calculate mint cost:", error);
        setErrorMessage("Could not determine minting cost. Please try again later.");
        setMintingState("error");
      }
    }

    getCost();
  }, [isOpen, block, state.gasPrice]);

  useEffect(() => {
    if (mintingState !== 'mining') return;

    const timer = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                clearInterval(timer);
                handleMintSuccess();
                return 100;
            }
            return prev + 1;
        });
    }, 40);

    return () => clearInterval(timer);
  }, [mintingState]);

  const handleMint = () => {
    if (state.walletBalance < totalCost) {
      setErrorMessage("Insufficient pETH balance to mint this block.");
      setMintingState("error");
      return;
    }
    setMintingState("mining");
  };

  const handleMintSuccess = () => {
    dispatch({
      type: "MINT_BLOCK",
      payload: { blockId: block.id, cost: totalCost },
    });
    toast({
      title: "Mint Successful!",
      description: `Block "${block.title}" has been added to the chain.`,
    });
    onOpenChange(false);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Mint Block: {block.title}
          </DialogTitle>
          <DialogDescription>
            Confirm the transaction to permanently add this block to your portfolio.
          </DialogDescription>
        </DialogHeader>
        
        {mintingState === 'calculating' && (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Calculating transaction cost...
            </div>
        )}

        {mintingState === 'confirm' && (
            <div className="space-y-4">
                <div className="rounded-lg border bg-card p-4">
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
                <div className="text-sm text-muted-foreground">
                    Your current balance is <span className="font-mono font-medium text-foreground">{state.walletBalance.toFixed(4)} pETH</span>.
                </div>
            </div>
        )}
        
        {mintingState === 'mining' && (
            <div className="space-y-3 p-4">
                <p className="text-center text-sm text-primary">Mining transaction...</p>
                <Progress value={progress} />
                <p className="text-center text-xs text-muted-foreground font-mono">
                    Block hash: 0x{Array.from({ length: 16 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}...
                </p>
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
          {mintingState === "confirm" && (
            <Button className="w-full font-bold" onClick={handleMint}>
              Confirm Mint
            </Button>
          )}
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
