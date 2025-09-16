'use server';

/**
 * @fileOverview This file defines a Genkit flow to calculate the cost to mint a portfolio block.
 *
 * It uses a tool to determine the cost based on the block's content complexity and user engagement potential.
 *
 * @interface CalculateMintCostInput - Defines the input schema for the flow.
 * @interface CalculateMintCostOutput - Defines the output schema for the flow.
 * @function calculateMintCost - The main function that calls the flow to calculate the mint cost.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateMintCostInputSchema = z.object({
  blockType: z
    .string()
    .describe(
      'The type of portfolio block (e.g., About Me, Projects, Skills, Contact).'
    ),
  contentComplexity: z
    .string()
    .describe(
      'A description of the complexity of the content within the block.'
    ),
  userEngagementPotential: z
    .string()
    .describe(
      'A description of the potential for user engagement with this block.'
    ),
});
export type CalculateMintCostInput = z.infer<typeof CalculateMintCostInputSchema>;

const CalculateMintCostOutputSchema = z.object({
  mintCost: z
    .number()
    .describe(
      'The cost in pETH to mint the block, dynamically determined by the block content and user engagement potential.'
    ),
});
export type CalculateMintCostOutput = z.infer<typeof CalculateMintCostOutputSchema>;

export async function calculateMintCost(input: CalculateMintCostInput): Promise<CalculateMintCostOutput> {
  return calculateMintCostFlow(input);
}

const calculateMintCostTool = ai.defineTool(
  {
    name: 'calculateMintCost',
    description:
      'Calculates the cost to mint a portfolio block based on its content complexity and potential user engagement.',
    inputSchema: CalculateMintCostInputSchema,
    outputSchema: CalculateMintCostOutputSchema,
  },
  async input => {
    // Dummy implementation: calculate cost based on string lengths of complexity and engagement potential
    const complexityScore = input.contentComplexity.length;
    const engagementScore = input.userEngagementPotential.length;
    const mintCost = complexityScore * 0.1 + engagementScore * 0.05 + 1.0;

    return { mintCost };
  }
);

const calculateMintCostPrompt = ai.definePrompt({
  name: 'calculateMintCostPrompt',
  tools: [calculateMintCostTool],
  input: {
    schema: CalculateMintCostInputSchema,
  },
  output: {
    schema: CalculateMintCostOutputSchema,
  },
  prompt: `You are an expert in determining the minting cost for portfolio blocks in a decentralized application.

  Based on the block's content complexity and its potential for user engagement, determine an appropriate minting cost in pETH.

  Use the calculateMintCost tool to calculate the mint cost.
  The block type is: {{{blockType}}}
  The content complexity is described as: {{{contentComplexity}}}
  The user engagement potential is described as: {{{userEngagementPotential}}}
  \n`,
});

const calculateMintCostFlow = ai.defineFlow(
  {
    name: 'calculateMintCostFlow',
    inputSchema: CalculateMintCostInputSchema,
    outputSchema: CalculateMintCostOutputSchema,
  },
  async input => {
    const { output } = await calculateMintCostPrompt(input);
    return output!;
  }
);
