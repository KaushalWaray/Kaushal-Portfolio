'use server';

/**
 * @fileOverview A portfolio assistant AI agent that can answer questions about the portfolio owner.
 *
 * - portfolioAssistant - A function that handles the chat conversation.
 * - PortfolioAssistantInput - The input type for the portfolioAssistant function.
 * - PortfolioAssistantOutput - The return type for the portfolioAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { portfolioData } from '@/lib/portfolio-data';
import type { PortfolioBlockId } from '@/lib/types';

const PortfolioAssistantInputSchema = z.object({
  question: z.string().describe('The question from the user.'),
  history: z.array(z.any()).optional().describe('The chat history.'),
  mintedBlocks: z.array(z.string()).describe('An array of IDs of the blocks that the user has already mined.'),
});
export type PortfolioAssistantInput = z.infer<typeof PortfolioAssistantInputSchema>;

const PortfolioAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type PortfolioAssistantOutput = z.infer<typeof PortfolioAssistantOutputSchema>;

export async function portfolioAssistant(input: PortfolioAssistantInput): Promise<PortfolioAssistantOutput> {
  return portfolioAssistantFlow(input);
}

const portfolioAssistantPrompt = ai.definePrompt({
  name: 'portfolioAssistantPrompt',
  input: { schema: z.object({
    question: z.string(),
    history: z.array(z.any()).optional(),
    portfolioContext: z.string(),
  })},
  output: { schema: PortfolioAssistantOutputSchema },
  prompt: `You are a helpful and friendly AI assistant for the owner of this portfolio.
Your goal is to answer questions from visitors about the portfolio owner's skills, experience, and projects.
You must ONLY use the provided portfolio data below to answer the questions. Do not make up information.

If a question cannot be answered with the provided data, you should politely state that you don't have enough information and encourage the user to mine more blocks to learn more.

Here is the portfolio data you are allowed to use:
{{{portfolioContext}}}

Here is the user's question:
"{{question}}"

And here is the conversation history:
{{#if history}}
{{#each history}}
- {{role}}: {{#each content}}{{text}}{{/each}}
{{/each}}
{{/if}}

Based on the portfolio data and the conversation history, please provide a helpful and friendly answer to the user's question.
`,
});

const portfolioAssistantFlow = ai.defineFlow(
  {
    name: 'portfolioAssistantFlow',
    inputSchema: PortfolioAssistantInputSchema,
    outputSchema: PortfolioAssistantOutputSchema,
  },
  async ({ question, history, mintedBlocks }) => {
    // Filter the portfolio data to only include content from mined blocks.
    const availableData = (mintedBlocks as PortfolioBlockId[]).reduce((acc, blockId) => {
      if (portfolioData[blockId]) {
        acc[blockId] = portfolioData[blockId];
      }
      return acc;
    }, {} as Record<string, any>);

    const portfolioContext = JSON.stringify(availableData, null, 2);

    const { output } = await portfolioAssistantPrompt({ question, history, portfolioContext });
    return output!;
  }
);
