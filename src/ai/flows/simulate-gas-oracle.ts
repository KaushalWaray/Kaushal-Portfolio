'use server';

/**
 * @fileOverview Simulates a dynamic gas oracle using GenAI to provide realistic gas fee fluctuations.
 *
 * - getGasPrice - A function that returns the simulated gas price.
 * - GasPriceOutput - The return type for the getGasPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GasPriceOutputSchema = z.object({
  gasPrice: z.number().describe('The simulated gas price in pETH.'),
});
export type GasPriceOutput = z.infer<typeof GasPriceOutputSchema>;

export async function getGasPrice(): Promise<GasPriceOutput> {
  return gasPriceFlow();
}

const gasPricePrompt = ai.definePrompt({
  name: 'gasPricePrompt',
  output: {schema: GasPriceOutputSchema},
  prompt: `You are simulating a blockchain gas oracle.  Return a gas price in pETH. The gas price should fluctuate randomly between 0.000001 and 0.000009 pETH, reflecting the dynamic nature of a blockchain. Return ONLY a JSON object.`,
});

const gasPriceFlow = ai.defineFlow(
  {
    name: 'gasPriceFlow',
    outputSchema: GasPriceOutputSchema,
  },
  async () => {
    const {output} = await gasPricePrompt({});
    return output!;
  }
);
