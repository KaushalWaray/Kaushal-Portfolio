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
import { PartyPopper } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import { useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import { motion } from "framer-motion";

interface RewardModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function RewardModal({ isOpen, onOpenChange }: RewardModalProps) {
  const { state } = useAppContext();
  const nftRef = useRef<HTMLDivElement>(null);

  const formattedAddress = `${state.walletAddress.slice(
    0,
    6
  )}...${state.walletAddress.slice(-4)}`;

  const handleDownload = useCallback(() => {
    if (nftRef.current === null) {
      return;
    }

    toPng(nftRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "proof-of-exploration.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error(err);
      });
  }, [nftRef]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-center items-center h-12 w-12 rounded-full bg-primary/10 mx-auto">
            <PartyPopper className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="font-headline text-center text-2xl pt-2">
            Proof of Exploration
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Congratulations! You've successfully mined all blocks and explored
            the entirety of this decentralized portfolio.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          className="p-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        >
          <div
            ref={nftRef}
            className="p-6 bg-secondary/50 rounded-lg border border-primary/30 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary)/0.1), transparent)",
              }}
            ></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                className="relative w-40 h-40"
              >
                <div
                  className="w-full h-full bg-primary/20 animate-glow"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    boxShadow: "inset 0 0 0 4px hsl(var(--primary)/0.5)",
                  }}
                >
                  <PartyPopper className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h3 className="font-headline text-xl text-primary mt-4">
                Proof of Exploration
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Kaushal.dev
              </p>
              <div className="mt-4 w-full text-left font-mono text-xs space-y-1 rounded-md border border-border/50 p-2 bg-background/50">
                  <p className="truncate"><span className="text-muted-foreground">Token ID:</span> 8431</p>
                  <p className="truncate"><span className="text-muted-foreground">Minted For:</span> {formattedAddress}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button className="w-full sm:w-auto" onClick={handleDownload}>
            Download PNG
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
