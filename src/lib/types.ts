import type { LucideIcon } from "lucide-react";

export type PortfolioBlockId = 'about' | 'projects' | 'skills' | 'contact' | 'certifications';

export type TechStack = {
  name: string;
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
};

export type Project = {
  title: string;
  description: string;
  techStack: TechStack[];
  liveUrl?: string;
  repoUrl?: string;
};

export type Certification = {
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
};

export type PortfolioBlock = {
  id: PortfolioBlockId;
  title: string;
  content: {
    description: string;
    profileImage?: string;
    profileImageHint?: string;
    projects?: Project[];
    skills?: { category: string; list: string[] }[];
    contact?: { method: string; value: string; href: string, icon: LucideIcon }[];
    certifications?: Certification[];
  };
  complexity: string; // For AI cost calculation
  engagement: string; // For AI cost calculation
};
