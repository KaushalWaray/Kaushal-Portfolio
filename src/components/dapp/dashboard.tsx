"use client";

import { Header } from "@/components/dapp/header";
import { PortfolioBlockDisplay } from "@/components/dapp/portfolio-block";
import { portfolioData } from "@/lib/portfolio-data";
import type { PortfolioBlockId } from "@/lib/types";
import { AiAssistant } from "@/components/dapp/ai-assistant";

export function Dashboard() {
  const blockOrder: PortfolioBlockId[] = ["about", "projects", "skills", "contact"];
  
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {blockOrder.map((id) => (
            <PortfolioBlockDisplay key={id} block={portfolioData[id]} />
          ))}
        </div>
      </main>
      <AiAssistant />
    </div>
  );
}
