"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/app-context";
import { Droplets } from "lucide-react";
import { useState, useEffect } from "react";

const COOLDOWN_SECONDS = 60;
const CLAIM_AMOUNT = 1.0;

export function FaucetButton() {
  const { dispatch } = useAppContext();
  const { toast } = useToast();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleClaim = () => {
    dispatch({ type: "CLAIM_FAUCET", payload: { amount: CLAIM_AMOUNT } });
    setCooldown(COOLDOWN_SECONDS);
    toast({
      title: "Faucet Claimed!",
      description: `+${CLAIM_AMOUNT.toFixed(1)} pETH added to your wallet.`,
    });
  };

  return (
    <Button
      onClick={handleClaim}
      disabled={cooldown > 0}
      variant="outline"
      size="sm"
    >
      <Droplets className="mr-2 h-4 w-4" />
      {cooldown > 0 ? `Wait ${cooldown}s` : "Faucet"}
    </Button>
  );
}
