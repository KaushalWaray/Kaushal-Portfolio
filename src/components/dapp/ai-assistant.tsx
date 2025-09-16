"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppContext } from "@/contexts/app-context";
import { portfolioAssistant } from "@/ai/flows/portfolio-assistant-flow";
import { Bot, User, Loader2, Feather } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const suggestedQuestions = [
    "What are Kaushal's top skills?",
    "Tell me about the DecStor project.",
    "What is his educational background?",
    "How can I contact him?",
];

export function AiAssistant() {
  const { state, dispatch } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dispatch({ type: 'TOGGLE_ASSISTANT' });
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, 100);
  };

  const handleSubmit = async (e: FormEvent, question: string = input) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    try {
      const genkitHistory = messages.map(m => ({
          role: m.role,
          content: [{ text: m.content }]
      }));

      const result = await portfolioAssistant({
        question,
        history: genkitHistory,
        mintedBlocks: state.mintedBlocks,
      });

      const assistantMessage: Message = { role: 'assistant', content: result.answer };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMessage: Message = { role: 'assistant', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <Sheet open={state.isAssistantOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-headline text-xl">
            <Bot className="text-primary" />
            AI Portfolio Assistant
          </SheetTitle>
          <SheetDescription>
            Ask me anything about Kaushal's portfolio. I'll answer based on the blocks you've mined.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-6">
                <AnimatePresence>
                    {messages.length === 0 && (
                         <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-center text-muted-foreground p-4 bg-secondary/30 rounded-lg"
                         >
                            <p className="font-semibold mb-3">Don't know where to start?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {suggestedQuestions.map(q => (
                                    <Button key={q} variant="outline" size="sm" className="h-auto py-2 text-left" onClick={(e) => handleSubmit(e, q)}>
                                        <Feather className="mr-2 h-3.5 w-3.5 shrink-0" />
                                        {q}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                    {messages.map((message, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                        "flex items-start gap-3",
                        message.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                        )}
                        <div
                        className={cn(
                            "p-3 rounded-lg max-w-[85%]",
                            message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        )}
                        >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        )}
                    </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3"
                        >
                             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="p-3 rounded-lg bg-secondary flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Thinking...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
        <SheetFooter>
            <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about a project or skill..."
                    disabled={isLoading}
                    className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                </Button>
            </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
