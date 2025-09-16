"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppContext } from "@/contexts/app-context";
import { Bot, DownloadCloud, Droplets, Fuel, Sparkles, Wallet } from "lucide-react";

type OnboardingStep = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const steps: OnboardingStep[] = [
  {
    title: "Welcome to My Decentralized Portfolio!",
    description: "This isn't just a website; it's a simulated blockchain experience. You get to 'mine' parts of my portfolio to reveal the content, just like discovering blocks on a chain.",
    icon: Wallet,
  },
  {
    title: "Mine Blocks to View Content",
    description: "Each card you see is a 'block' on my personal chain. Click the 'Mine Block' button to spend a little 'pETH' (play-Ether) and unlock the content inside.",
    icon: DownloadCloud,
  },
  {
    title: "Manage Your 'pETH' Wallet",
    description: "You have a simulated wallet with 'pETH'. Keep an eye on your balance and the dynamic 'Gas' fee in the header. If you run low, use the 'Faucet' to get more!",
    icon: Droplets,
  },
  {
    title: "Ask Me Anything!",
    description: "Have a question about my skills or projects? Use the AI Assistant at the bottom right. It's trained on my portfolio data and can answer your questions.",
    icon: Bot,
  },
];

export function OnboardingGuide() {
  const { dispatch } = useAppContext();
  const [stepIndex, setStepIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      dispatch({ type: "COMPLETE_ONBOARDING" });
      setIsOpen(false);
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center items-center h-12 w-12 rounded-full bg-primary/10 mx-auto">
            <current.icon className="h-6 w-6 text-primary" />
          </div>
          <AlertDialogTitle className="font-headline text-center text-2xl pt-2">
            {currentStep.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            {currentStep.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center gap-2 mt-2">
            {steps.map((_, index) => (
                <div key={index} className={`h-2 w-2 rounded-full transition-colors ${index === stepIndex ? 'bg-primary' : 'bg-muted'}`} />
            ))}
        </div>
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction className="w-full font-bold" onClick={handleNext}>
            {isLastStep ? "Start Exploring" : "Next"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
