'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/calculate-mint-cost.ts';
import '@/ai/flows/simulate-gas-oracle.ts';
import '@/ai/flows/portfolio-assistant-flow.ts';
