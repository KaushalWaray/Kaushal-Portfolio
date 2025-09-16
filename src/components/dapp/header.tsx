"use client";

import { useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { LogOut, Fuel, CircleDollarSign } from "lucide-react";
import { FaucetButton } from "./faucet-button";
import { useEffect } from "react";
import { getGasPrice } from "@/ai/flows/simulate-gas-oracle";

function GasOracle() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const fetchGasPrice = async () => {
      try {
        const result = await getGasPrice();
        if (result && typeof result.gasPrice === 'number') {
          dispatch({ type: "SET_GAS_PRICE", payload: result.gasPrice });
        }
      } catch (error) {
        console.error("Failed to fetch gas price:", error);
      }
    };

    const intervalId = setInterval(fetchGasPrice, 10000); // Fetch every 10 seconds
    fetchGasPrice(); // Initial fetch

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-inner">
      <Fuel className="h-4 w-4 text-primary" />
      <span>Gas:</span>
      <span className="font-mono font-medium text-foreground">
        {state.gasPrice.toPrecision(2)} pETH
      </span>
    </div>
  );
}

export function Header() {
  const { state, dispatch } = useAppContext();

  const formattedAddress = `${state.walletAddress.slice(
    0,
    6
  )}...${state.walletAddress.slice(-4)}`;

  const handleDisconnect = () => {
    dispatch({ type: "DISCONNECT_WALLET" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="font-headline text-2xl font-bold">
            DApp<span className="text-primary">folio</span>
          </h1>
          <div className="hidden md:flex">
            <GasOracle />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm shadow-inner">
            <CircleDollarSign className="h-4 w-4 text-primary" />
            <span className="font-mono font-medium text-foreground">
              {state.walletBalance.toFixed(4)} pETH
            </span>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-inner sm:flex">
            {formattedAddress}
          </div>
          <FaucetButton />
          <Button variant="ghost" size="icon" onClick={handleDisconnect} aria-label="Disconnect Wallet">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
