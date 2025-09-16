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
import { PlaceHolderImages } from './placeholder-images';

const metaDriveImage = PlaceHolderImages.find(p => p.id === 'kaushal-metadrive');
const devsecopsImage = PlaceHolderImages.find(p => p.id === 'kaushal-devsecops');
const profileImage = PlaceHolderImages.find(p => p.id === 'kaushal-profile');


export const portfolioData: Record<string, PortfolioBlock> = {
  about: {
    id: 'about',
    title: 'About Me',
    content: {
      description:
        "Motivated individual with a strong interest in blockchain technology and cloud computing. Actively pursuing a Master of Computer Applications degree, showcasing commitment to advanced technical knowledge and development. Dedicated to exploring innovative solutions and emerging technologies in the digital space. Seeking opportunities to contribute passion for blockchain and cloud systems to a dynamic and forward-thinking team.",
      profileImage: "https://i.imgur.com/t8yG4g4.jpeg",
      profileImageHint: "professional developer portrait",
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
          title: 'MetaDrive: Decentralized File Storage Sharing Wallet',
          description:
            'Engineered a decentralized storage app for Algorand. Utilized IPFS (Pinata) for file storage and a PyTeal contract for on-chain records. Implemented PIN-based encryption to secure wallet mnemonics.',
          imageUrl: metaDriveImage?.imageUrl || '',
          imageHint: metaDriveImage?.imageHint || '',
          techStack: [
            { name: 'Next.js', icon: IconNextjs },
            { name: 'TypeScript', icon: IconTs },
          ],
          repoUrl: '#',
        },
        {
          title: 'Automated DevSecOps Pipeline for Smart Contracts',
          description:
            'Built a CI/CD pipeline (GitHub Actions, Hardhat) for automated contract deployment. Integrated Slither for automated pre-deployment security vulnerability scanning. Orchestrated end-to-end automation: linting, testing, deploying to Sepolia.',
          imageUrl: devsecopsImage?.imageUrl || '',
          imageHint: devsecopsImage?.imageHint || '',
          techStack: [
            { name: 'Solidity', icon: IconSolidity },
            { name: 'Hardhat', icon: IconReact }, // Using react icon as placeholder for hardhat
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
          category: 'Cloud & DevOps',
          list: ['Oracle Cloud (OCI)', 'AWS (EC2, S3)', 'Docker', 'Terraform', 'Jenkins', 'CI/CD', 'GitHub Actions', 'Linux', 'Bash'],
        },
        {
          category: 'Blockchain & Web3',
          list: ['Solidity', 'PyTeal', 'Hardhat', 'Ethers.js', 'Ethereum', 'Algorand', 'IPFS', 'OpenZeppelin'],
        },
        {
          category: 'Programming & Databases',
          list: ['Python', 'JavaScript', 'TypeScript', 'React.js', 'Next.js', 'SQL', 'MongoDB'],
        },
        {
          category: 'Professional Skills',
          list: ['Problem Solving', 'Team Collaboration', 'Technical Communication', 'Agile Methodologies'],
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
          value: 'kaushalwaray@gmail.com',
          href: 'mailto:kaushalwaray@gmail.com',
          icon: Mail,
        },
        {
          method: 'LinkedIn',
          value: 'linkedin.com/in/kaushalwaray',
          href: 'https://linkedin.com/in/kaushalwaray',
          icon: Linkedin,
        },
        {
          method: 'GitHub',
          value: 'github.com/KaushalWaray',
          href: 'https://github.com/KaushalWaray',
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
