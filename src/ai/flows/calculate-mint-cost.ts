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
import { z } from 'zod';

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

const costCalculationTool = ai.defineTool(
    {
      name: 'costCalculationTool',
      description: 'Calculates the mint cost based on complexity and engagement scores.',
      inputSchema: z.object({
        complexityScore: z.number().describe('A score from 1-10 for content complexity.'),
        engagementScore: z.number().describe('A score from 1-10 for user engagement potential.'),
      }),
      outputSchema: z.object({
        cost: z.number().describe('The calculated cost.')
      }),
    },
    async ({ complexityScore, engagementScore }) => {
        // A more sophisticated cost formula
        const cost = (complexityScore * 0.15) + (engagementScore * 0.1) + Math.random() * 0.5 + 1.0;
        return { cost };
    }
);


const calculateMintCostPrompt = ai.definePrompt({
    name: 'calculateMintCostPrompt',
    input: { schema: CalculateMintCostInputSchema },
    output: { schema: CalculateMintCostOutputSchema },
    tools: [costCalculationTool],
    prompt: `You are a chain economist. Your job is to determine the mint cost for a new portfolio block.
    
    Evaluate the block's complexity and engagement potential. Assign a score from 1 (lowest) to 10 (highest) for both.
    Then, use the costCalculationTool to get the final mint cost.

    Block Type: {{blockType}}
    Content Complexity: "{{contentComplexity}}"
    User Engagement Potential: "{{userEngagementPotential}}"
    
    Return only the final mintCost.`,
});


export async function calculateMintCost(input: CalculateMintCostInput): Promise<CalculateMintCostOutput> {
  return calculateMintCostFlow(input);
}

const calculateMintCostFlow = ai.defineFlow(
  {
    name: 'calculateMintCostFlow',
    inputSchema: CalculateMintCostInputSchema,
    outputSchema: CalculateMintCostOutputSchema,
  },
  async (input) => {
    const { output } = await calculateMintCostPrompt(input);
    if (!output) {
      throw new Error('The AI failed to calculate a mint cost.');
    }
    return output;
  }
);