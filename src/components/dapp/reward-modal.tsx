
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
import { useAppContext } from "@/contexts/app-context";
import { useEffect, useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';

interface RewardModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const NftIcon = () => (
    <div className="relative w-24 h-24">
      <motion.div
        className="absolute inset-0 bg-primary/20 rounded-xl"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <svg
        className="relative w-full h-full"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
        {/* Main Hexagon */}
        <motion.path
          d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
          fill="transparent"
          stroke="url(#grad)"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {/* Inner Details */}
        <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
        >
            <path d="M50 20 L75 35 L75 65 L50 80 L25 65 L25 35 Z" fill="hsl(var(--primary)/0.1)" stroke="hsl(var(--primary))" strokeWidth="1" />
            <circle cx="50" cy="50" r="5" fill="url(#grad)" />
            <path d="M50 20 L50 35 M50 65 L50 80 M25 35 L40 42.5 M60 57.5 L75 65" stroke="hsl(var(--primary)/0.5)" strokeWidth="1"/>
        </motion.g>
      </svg>
    </div>
  );

  async function getFontEmbedCSS() {
    const fontFamilies = ["Inter:wght@400;500;700", "Space Grotesk:wght@400;500;700"];
    const googleFontsURL = `https://fonts.googleapis.com/css2?family=${fontFamilies.join('&family=')}&display=swap`;
  
    const cssText = await fetch(googleFontsURL).then((res) => res.text());
  
    // Workaround for https://github.com/styleguidist/react-docgen-typescript/issues/366
    const fontFaces = cssText.split('@font-face').slice(1).map(s => `@font-face{${s}}`).join('\n');
    return fontFaces;
  }

export function RewardModal({ isOpen, onOpenChange }: RewardModalProps) {
  const { state } = useAppContext();
  const { toast } = useToast();
  const [txHash, setTxHash] = useState("");
  const [hasCopied, setHasCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Generate a fake but consistent transaction hash based on wallet address
      const hash = `0x${[...state.walletAddress.substring(2, 10), ...new Date().getTime().toString(16).slice(-4)].join('')}`;
      setTxHash(`${hash}....${hash.slice(-4)}`);
    }
  }, [isOpen, state.walletAddress]);

  const handleCopy = () => {
    navigator.clipboard.writeText(txHash);
    setHasCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
        const fontEmbedCSS = await getFontEmbedCSS();
        const dataUrl = await toPng(certificateRef.current, { 
            cacheBust: true,
            pixelRatio: 2, // Higher resolution
            fontEmbedCSS: fontEmbedCSS,
            style: {
                transform: 'scale(1)',
                transformOrigin: 'center'
            }
         });
        const link = document.createElement('a');
        link.download = 'Proof_of_Exploration.png';
        link.href = dataUrl;
        link.click();
    } catch(err) {
        console.error("Download failed", err);
        toast({
            title: "Download Failed",
            description: "Could not generate the certificate image.",
            variant: "destructive"
        })
    } finally {
        setIsDownloading(false);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-center text-2xl">
            Mining Complete!
          </DialogTitle>
          <DialogDescription className="text-center">
            You've mined all the blocks. As a reward, here is your unique Proof of Exploration certificate.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 flex items-center justify-center">
            <motion.div
                ref={certificateRef}
                className="relative flex aspect-square w-full max-w-[300px] flex-col items-center justify-between overflow-hidden rounded-2xl border bg-secondary p-6 shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05]" style={{ maskImage: "linear-gradient(to bottom, transparent, black, transparent)"}}></div>
                <div className="text-center">
                    <p className="font-mono text-xs uppercase tracking-widest text-primary">Certificate of Completion</p>
                    <h2 className="font-headline text-2xl text-foreground">Proof of Exploration</h2>
                </div>
                
                <NftIcon />

                <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Issued by</p>
                    <p className="font-headline text-lg text-foreground">Kaushal.dev</p>
                    <p className="mt-2 font-mono text-xs text-muted-foreground truncate">Tx Hash: {txHash}</p>
                </div>
            </motion.div>
        </div>
        
        <DialogFooter className="flex-col gap-2 sm:flex-row">
           <div className="flex w-full items-center space-x-2">
                <input
                    readOnly
                    value={txHash}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button type="button" size="icon" variant="outline" onClick={handleCopy} className="h-10 w-10 shrink-0">
                    {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
          <Button onClick={handleDownload} disabled={isDownloading} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
