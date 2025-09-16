'use server';

/**
 * @fileOverview Simulates a dynamic gas oracle locally to provide realistic gas fee fluctuations.
 *
 * - getGasPrice - A function that returns the simulated gas price.
 * - GasPriceOutput - The return type for the getGasPrice function.
 */

import { z } from 'zod';

const GasPriceOutputSchema = z.object({
  gasPrice: z.number().describe('The simulated gas price in pETH.'),
});
export type GasPriceOutput = z.infer<typeof GasPriceOutputSchema>;

export async function getGasPrice(): Promise<GasPriceOutput> {
  // This is a simple local simulation to avoid hitting API rate limits.
  // Lower the gas price range for a better user experience
  const gasPrice = Math.random() * (0.0000009 - 0.0000001) + 0.0000001;
  return { gasPrice };
}
