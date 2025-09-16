"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Wallet } from "lucide-react";
import { motion } from 'framer-motion';

export function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dispatch } = useAppContext();

  const handleConnect = () => {
    const fakeAddress = `0x${Array.from({ length: 40 }, () =>
      "0123456789abcdef"[Math.floor(Math.random() * 16)]
    ).join("")}`;
    dispatch({
      type: "CONNECT_WALLET",
      payload: { walletAddress: fakeAddress, balance: 10.0 }, // Start with more pETH
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary)/0.1), transparent)'
          }}
        >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center p-4">
          <motion.h1 
            className="font-headline text-5xl font-bold md:text-7xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            Kaushal<span className="text-primary animate-glow">.dev</span>
          </motion.h1>
          <motion.p 
            className="mt-4 max-w-xl text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            A passionate developer building the future of the decentralized web. Explore my journey and mint my progress.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
          >
            <Button
              size="lg"
              className="mt-8 font-bold"
              onClick={() => setIsModalOpen(true)}
            >
              <Wallet className="mr-2 h-5 w-5" />
              Connect to Explore
            </Button>
          </motion.div>
        </div>
      </div>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-center text-2xl">
              Connect Wallet
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              This portfolio uses a simulated wallet for this experience. No real
              blockchain transaction will be made.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="w-full font-bold"
              onClick={handleConnect}
            >
              <Wallet className="mr-2 h-5 w-5" />
              Connect with Simulated Wallet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
