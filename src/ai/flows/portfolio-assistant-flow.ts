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

const PortfolioAssistantInputSchema = z.object({
  question: z.string().describe('The question from the user.'),
  history: z.array(z.any()).optional().describe('The chat history.'),
});
export type PortfolioAssistantInput = z.infer<typeof PortfolioAssistantInputSchema>;

const PortfolioAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type PortfolioAssistantOutput = z.infer<typeof PortfolioAssistantOutputSchema>;

export async function portfolioAssistant(input: PortfolioAssistantInput): Promise<PortfolioAssistantOutput> {
  return portfolioAssistantFlow(input);
}

const portfolioContext = JSON.stringify(portfolioData);

const portfolioAssistantPrompt = ai.definePrompt({
  name: 'portfolioAssistantPrompt',
  input: { schema: PortfolioAssistantInputSchema },
  output: { schema: PortfolioAssistantOutputSchema },
  prompt: `You are a helpful and friendly AI assistant for the owner of this portfolio.
Your goal is to answer questions from visitors about the portfolio owner's skills, experience, and projects.
Use the provided portfolio data to answer the questions. Be conversational and engaging.

Here is the portfolio data:
${portfolioContext}

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
  async (input) => {
    const { output } = await portfolioAssistantPrompt(input);
    return output!;
  }
);
