"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog";
  import type { PortfolioBlock } from "@/lib/types";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { Badge } from "@/components/ui/badge";
  import Image from "next/image";
  import { Button } from "../ui/button";
  import { ExternalLink, Github } from "lucide-react";
  import Link from "next/link";
  import { useEffect, useState } from "react";
  
  interface ContentModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    block: PortfolioBlock;
  }
  
  const BlockInfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col gap-1 border-t border-border/50 py-3 sm:flex-row sm:gap-4">
      <dt className="w-28 shrink-0 font-mono text-sm text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm">{value}</dd>
    </div>
  );
  
  
  export function ContentModal({ isOpen, onOpenChange, block }: ContentModalProps) {
    const [timestamp, setTimestamp] = useState('');

    useEffect(() => {
        if (isOpen) {
            setTimestamp(new Date().toISOString());
        }
    }, [isOpen]);

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Block Details: {block.title}</DialogTitle>
            <DialogDescription>
              Viewing content from mined block #{block.id.charCodeAt(0)}.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="pr-6">
                <div className="mt-6">
                    <h3 className="font-headline text-lg mb-2">Content</h3>
                    <div className="prose prose-invert max-w-none text-muted-foreground prose-p:text-base">
                        <p>{block.content.description}</p>
                    </div>
  
                    {block.id === 'about' && block.content.profileImage && (
                        <div className="mt-6">
                          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-lg border bg-card/50 p-6">
                            <div className="relative w-40 h-40 shrink-0">
                                <Image
                                    src={block.content.profileImage}
                                    alt="Profile NFT"
                                    width={160}
                                    height={160}
                                    className="object-cover w-full h-full"
                                    style={{
                                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                                    }}
                                    data-ai-hint={block.content.profileImageHint}
                                />
                                <div 
                                  className="absolute inset-0" 
                                  style={{
                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                    boxShadow: 'inset 0 0 0 4px hsl(var(--primary)/0.5)',
                                    pointerEvents: 'none'
                                  }}
                                />
                            </div>
                            <div className="flex flex-col text-center sm:text-left">
                                <h4 className="font-headline text-xl text-primary">Kaushal Waray</h4>
                                <p className="text-sm text-muted-foreground mt-1">Digital Identity</p>
                                <div className="mt-4 space-y-1 font-mono text-xs">
                                  <p><span className="text-muted-foreground">Token ID:</span> 7721</p>
                                  <p><span className="text-muted-foreground">Owner:</span> 0x...dEaD</p>
                                </div>
                            </div>
                          </div>
                        </div>
                    )}
  
                    {block.id === 'projects' && block.content.projects?.map((project, index) => (
                        <div key={index} className="mt-6 rounded-lg border bg-card/50 p-4">
                           <Image src={project.imageUrl} alt={project.title} width={600} height={400} className="rounded-md mb-4" data-ai-hint={project.imageHint}/>
                           <h4 className="font-headline text-xl">{project.title}</h4>
                           <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
                           <div className="mt-4">
                                <h5 className="text-sm font-semibold mb-2">Tech Stack:</h5>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map(tech => (
                                        <Badge key={tech.name} variant="secondary" className="flex items-center gap-1.5 pr-2.5">
                                            <tech.icon className="h-3.5 w-3.5" />
                                            {tech.name}
                                        </Badge>
                                    ))}
                                </div>
                           </div>
                           <div className="mt-4 flex gap-2">
                               {project.liveUrl && <Button asChild size="sm" variant="default"><Link href={project.liveUrl} target="_blank"><ExternalLink className="mr-2 h-4 w-4"/>Live Demo</Link></Button>}
                               {project.repoUrl && <Button asChild size="sm" variant="outline"><Link href={project.repoUrl} target="_blank"><Github className="mr-2 h-4 w-4"/>Repository</Link></Button>}
                           </div>
                        </div>
                    ))}
  
                    {block.id === 'skills' && block.content.skills?.map((skillCat, index) => (
                        <div key={index} className="mt-4">
                            <h4 className="font-headline text-base">{skillCat.category}</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {skillCat.list.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                            </div>
                        </div>
                    ))}
  
                    {block.id === 'contact' && block.content.contact?.map((contact, index) => (
                        <div key={index} className="mt-4 flex items-center gap-4">
                            <contact.icon className="h-5 w-5 text-primary"/>
                            <Link href={contact.href} target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{contact.value}</Link>
                        </div>
                    ))}
  
                </div>

                <div className="mt-8 rounded-lg border bg-card/50 p-4">
                    <h3 className="font-headline text-lg mb-2">Block Data</h3>
                    <BlockInfoRow label="Block Hash" value={`0x${block.id}b7...e5`} />
                    <BlockInfoRow label="Timestamp" value={timestamp} />
                    <BlockInfoRow label="Mined By" value="0x...dEaD" />
                </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }
  