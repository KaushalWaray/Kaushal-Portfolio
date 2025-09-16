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
import { Check, Copy, Download } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { toPng } from 'html-to-image';

interface RewardModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function RewardModal({ isOpen, onOpenChange }: RewardModalProps) {
    const { toast } = useToast();
    const [isCopied, setIsCopied] = useState(false);
    const rewardRef = useRef<HTMLDivElement>(null);
    const transactionHash = "0x7a8b2c9d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b";

    const handleCopy = () => {
        navigator.clipboard.writeText(transactionHash);
        setIsCopied(true);
        toast({
            title: "Copied!",
            description: "Transaction hash copied to clipboard.",
        });
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleDownload = () => {
        if (rewardRef.current === null) {
          return
        }
    
        toPng(rewardRef.current, { cacheBust: true, backgroundColor: 'hsl(224, 71%, 4%)' })
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'proof-of-exploration.png';
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            console.error(err);
            toast({
                title: "Error",
                description: "Could not download the certificate.",
                variant: "destructive",
            });
          })
      }


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-center text-2xl">Congratulations!</DialogTitle>
          <DialogDescription className="text-center">
            You've successfully mined all blocks and explored the portfolio.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4" ref={rewardRef}>
            <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-1 shadow-2xl">
                <div className="w-full h-full rounded-[14px] bg-background p-6 flex flex-col justify-between items-center text-center border border-primary/50">
                    <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/50 mb-3">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                               <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                               <path d="M2 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                               <path d="M22 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                               <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                               <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="font-headline text-lg text-primary">Proof of Exploration</h3>
                        <p className="text-sm text-muted-foreground mt-1">Issued to Explorer</p>
                    </div>
                    <div className="w-full text-left font-mono text-xs space-y-2 mt-4">
                        <p className="truncate"><span className="text-muted-foreground">Issuer:</span> Kaushal.dev</p>
                        <p className="truncate"><span className="text-muted-foreground">Tx Hash:</span> {transactionHash}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs p-2 rounded-md bg-secondary text-muted-foreground">
            <span className="truncate">{transactionHash}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopy}>
                {isCopied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </Button>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
          </Button>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Awesome!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
