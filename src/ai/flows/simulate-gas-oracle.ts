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
  const gasPrice = Math.random() * (0.000009 - 0.000001) + 0.000001;
  return { gasPrice };
}
