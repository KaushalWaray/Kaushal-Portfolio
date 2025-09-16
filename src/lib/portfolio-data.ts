
import type { PortfolioBlock } from './types';
import { Github, Linkedin, Mail } from 'lucide-react';
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
        "My mission is to build the secure, decentralized future of the web. With hands-on experience in both blockchain development and cloud infrastructure, I build robust, end-to-end solutions. My work includes creating decentralized storage applications and engineering automated DevSecOps pipelines to secure smart contracts. As I complete my Master of Computer Applications, I'm eager to apply my skills in a dynamic role where I can contribute to cutting-edge blockchain and Web3 projects.",
      profileImage: 'https://picsum.photos/seed/kaushal-profile/400/400',
      profileImageHint: 'professional developer portrait'
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
          title: 'DecStor: Decentralized File Storage & Sharing Wallet',
          description:
            "DecStor is a decentralized file storage and sharing wallet designed to give users true ownership and control over their digital data. It serves as a secure, user-owned alternative to traditional centralized cloud storage services like Google Drive and Dropbox.\n\nThe project's architecture uses the Algorand blockchain as a high-speed 'logic layer' to manage user identity and create a permanent, verifiable 'proof-of-share' for every file transaction. For the actual storage, it leverages the IPFS network to ensure files are stored in a distributed and censorship-resistant manner.\n\nThe current version is a functional prototype live on the Algorand Testnet, where users can create wallets, upload files to a personal 'Vault,' and securely share them with other Algorand users. The long-term vision is to build a full-scale product with an open-core business model, offering premium features for teams and businesses.",
          techStack: [
            { name: 'Next.js', icon: IconNextjs },
            { name: 'React', icon: IconReact },
            { name: 'TypeScript', icon: IconTs },
            // Using react icon as placeholder for PyTeal
            { name: 'PyTeal', icon: IconReact }, 
          ],
          liveUrl: 'https://decstor.netlify.app/',
          repoUrl: 'https://github.com/KaushalWaray/DecStor',
        },
        {
            title: 'Automated DevSecOps Pipeline for Smart Contracts',
            description:
              'Built an automated CI/CD pipeline using GitHub Actions and Hardhat for Ethereum smart contracts. The system integrates linting with Solhint, static analysis with Slither, and automated testing, culminating in conditional deployment to the Sepolia testnet. This ensures a high standard of code quality and security for every change.',
            techStack: [
              { name: 'Solidity', icon: IconSolidity },
              { name: 'TypeScript', icon: IconTs },
              { name: 'AWS', icon: IconAws },
               // Using react icon as placeholder for hardhat
              { name: 'Hardhat', icon: IconReact },
            ],
            repoUrl: '#',
          },
      ],
    },
    complexity:
      'Complex block with multiple entries, descriptions, and external links.',
    engagement:
      'High user interaction, includes reading descriptions and clicking links.',
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
            category: 'Frontend Development',
            list: ['React.js', 'Next.js', 'Tailwind CSS', 'ShadCN UI'],
        },
        {
            category: 'Programming & Databases',
            list: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'MongoDB'],
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
  certifications: {
    id: 'certifications',
    title: 'Certifications',
    content: {
      description:
        "I am committed to continuous learning and professional development. Here are some of my recent certifications.",
      certifications: [
        {
          title: 'Chainlink Fundamentals',
          issuer: 'Cyfrin Updraft',
          date: 'August 2025',
          credentialUrl: 'https://profiles.cyfrin.io/u/kaushalwaray/achievements/chainlink-fundamentals',
        },
        {
          title: 'Blockchain Deep Dive',
          issuer: 'Binance Academy',
          date: 'July 2025',
          credentialUrl: 'https://academy.binance.com/en/courses/certificate/194184af3d92290ca4f780ca2172a39c860204d8d3b23bcb535a32df90ee5d0e',
        },
        {
          title: 'Solidity Smart Contract Development',
          issuer: 'Cyfrin Updraft',
          date: 'July 2025',
          credentialUrl: 'https://updraft.cyfrin.io/courses/solidity',
        },
        {
          title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
          issuer: 'Oracle',
          date: 'September 2025',
          credentialUrl: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=395904DA2EEFF5ED10CC4C765D25625AB0A1B0F6F71FA472DBA5A63F7EC047E3',
        }
      ],
    },
    complexity:
      'Medium complexity with a list of entries and external links.',
    engagement:
      'Medium user engagement, encourages users to verify credentials.',
  },
  education: {
    id: 'education',
    title: 'Education',
    content: {
      description: "My academic background has provided a strong foundation for my career in technology.",
      education: [
        {
          degree: 'Master of Computer Application',
          institution: 'K.K. Wagh Institute Of Engineering Education and Research',
          gpa: '7.57/10',
          coursework: ['Cloud Computing', 'Data Structures & Algorithms', 'DBMS', 'Software Engineering', 'Research Methodology']
        },
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'Gokhale Education Society’s R.H. Sapat College of Engineering',
          gpa: '7.7/10',
          coursework: ['Operating Systems', 'Computer Networks', 'Computational Theory', 'Blockchain Technology']
        }
      ]
    },
    complexity: 'Medium complexity, text-based list of degrees.',
    engagement: 'Low user interaction, primarily for reading.',
  }
};
