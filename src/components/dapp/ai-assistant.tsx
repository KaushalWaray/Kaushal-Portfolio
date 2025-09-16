"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bot, Loader2, Send, Sparkles, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { portfolioAssistant } from '@/ai/flows/portfolio-assistant-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
        const genkitHistory = newMessages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: [{ text: m.content }]
        }));

      const result = await portfolioAssistant({ question: input, history: genkitHistory });
      if (result && result.answer) {
        setMessages([...newMessages, { role: 'assistant', content: result.answer }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: "Sorry, I couldn't get a response. Please try again." }]);
      }
    } catch (error) {
      console.error('AI assistant error:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
            <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-[380px] h-[500px] bg-card border border-border/70 rounded-2xl shadow-2xl flex flex-col origin-bottom-right"
            >
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h3 className="font-headline text-lg">AI Assistant</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className='h-8 w-8'>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-2xl bg-muted flex items-center gap-2">
                           <Loader2 className="h-4 w-4 animate-spin"/>
                           <p className="text-sm text-muted-foreground">Thinking...</p>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border/50 flex items-center gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about my projects..."
                className="resize-none h-10 min-h-10"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
              />
              <Button onClick={handleSend} disabled={isLoading} size="icon" className="h-10 w-10 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
            onClick={() => setIsOpen(!isOpen)}
            size="lg"
            className="rounded-full shadow-lg w-16 h-16"
            >
            <Bot className="h-7 w-7" />
        </Button>
      </motion.div>
    </div>
  );
}
