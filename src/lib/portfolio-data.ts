import type { PortfolioBlock } from './types';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import {
  IconAws,
  IconNextjs,
  IconReact,
  IconShadcn,
  IconSolidity,
  IconTailwind,
  IconTs,
} from '@/components/icons/tech-icons';

export const portfolioData: Record<string, PortfolioBlock> = {
  about: {
    id: 'about',
    title: 'About Me',
    content: {
      description:
        "Hello! I'm a passionate full-stack developer with a love for building innovative and decentralized applications. With a background in both front-end and back-end technologies, I specialize in creating seamless user experiences powered by robust and scalable architectures. I'm driven by the potential of blockchain to revolutionize how we interact with the web.",
      profileImage: 'https://picsum.photos/seed/dappfolio-profile/400/400',
      profileImageHint: 'professional developer portrait',
    },
    complexity: 'Simple text and image block.',
    engagement: 'Low user interaction, primarily for reading.',
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    content: {
      description: 'Here are some of the projects I am proud to have worked on.',
      projects: [
        {
          title: 'DeFi Yield Aggregator',
          description:
            'A platform that automatically moves user funds between different lending protocols to maximize interest gains. Features a clean dashboard and transaction history.',
          imageUrl: 'https://picsum.photos/seed/dappfolio-project1/600/400',
          imageHint: 'decentralized finance dashboard',
          techStack: [
            { name: 'React', icon: IconReact },
            { name: 'Solidity', icon: IconSolidity },
            { name: 'Next.js', icon: IconNextjs },
            { name: 'Tailwind CSS', icon: IconTailwind },
          ],
          repoUrl: '#',
        },
        {
          title: 'NFT Marketplace',
          description:
            'A full-featured marketplace for creating, buying, and selling non-fungible tokens. Implemented smart contracts for auctions and secure ownership transfer.',
          imageUrl: 'https://picsum.photos/seed/dappfolio-project2/600/400',
          imageHint: 'NFT art collection',
          techStack: [
            { name: 'TypeScript', icon: IconTs },
            { name: 'Next.js', icon: IconNextjs },
            { name: 'AWS', icon: IconAws },
            { name: 'Shadcn/UI', icon: IconShadcn },
          ],
          liveUrl: '#',
          repoUrl: '#',
        },
      ],
    },
    complexity:
      'Complex block with multiple entries, images, and external links.',
    engagement:
      'High user interaction, includes viewing images, reading descriptions, and clicking links.',
  },
  skills: {
    id: 'skills',
    title: 'Skills',
    content: {
      description:
        "I've cultivated a diverse skillset in web and blockchain development.",
      skills: [
        {
          category: 'Languages',
          list: ['JavaScript (ES6+)', 'TypeScript', 'Solidity', 'HTML5', 'CSS3'],
        },
        {
          category: 'Frameworks & Libraries',
          list: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS'],
        },
        {
          category: 'Blockchain',
          list: ['Ethereum', 'Hardhat', 'Ethers.js', 'The Graph', 'IPFS'],
        },
        {
          category: 'Databases & Cloud',
          list: ['PostgreSQL', 'MongoDB', 'AWS', 'Firebase', 'Vercel'],
        },
      ],
    },
    complexity: 'Medium complexity block with categorized lists of text.',
    engagement: 'Low user interaction, primarily for reading.',
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    content: {
      description:
        "Let's connect! I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision.",
      contact: [
        {
          method: 'Email',
          value: 'hello@example.com',
          href: 'mailto:hello@example.com',
          icon: Mail,
        },
        {
          method: 'LinkedIn',
          value: 'linkedin.com/in/dapp-dev',
          href: '#',
          icon: Linkedin,
        },
        {
          method: 'Twitter',
          value: '@dappfolio_dev',
          href: '#',
          icon: Twitter,
        },
        {
          method: 'GitHub',
          value: 'github.com/dapp-dev',
          href: '#',
          icon: Github,
        },
      ],
    },
    complexity:
      'Simple block with a list of social media and contact links.',
    engagement:
      'Medium user engagement, encourages users to click external links.',
  },
};
