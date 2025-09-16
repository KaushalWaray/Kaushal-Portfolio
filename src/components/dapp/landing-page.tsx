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
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] animate-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="font-headline text-5xl font-bold md:text-7xl">
            Kaushal<span className="text-primary animate-glow"> Waray</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            A passionate developer building the future of the decentralized web. Explore my journey and mint my progress.
          </p>
          <Button
            size="lg"
            className="mt-8 font-bold"
            onClick={() => setIsModalOpen(true)}
          >
            <Wallet className="mr-2 h-5 w-5" />
            Connect to Explore
          </Button>
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
