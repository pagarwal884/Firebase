'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting internship domains based on user input.
 *
 * The flow takes background, interests, and resume information as input and returns a list of suggested internship domains.
 *
 * - suggestInternshipDomains - A function that calls the suggestInternshipDomainsFlow to get internship domain suggestions.
 * - SuggestInternshipDomainsInput - The input type for the suggestInternshipDomains function.
 * - SuggestInternshipDomainsOutput - The output type for the suggestInternshipDomains function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInternshipDomainsInputSchema = z.object({
  background: z.string().describe('The applicant\'s educational and professional background.'),
  interests: z.string().describe('The applicant\'s interests and skills.'),
  resume: z.string().describe('The applicant\'s resume information.'),
});
export type SuggestInternshipDomainsInput = z.infer<typeof SuggestInternshipDomainsInputSchema>;

const SuggestInternshipDomainsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of suggested internship domains.'),
});
export type SuggestInternshipDomainsOutput = z.infer<typeof SuggestInternshipDomainsOutputSchema>;

export async function suggestInternshipDomains(input: SuggestInternshipDomainsInput): Promise<SuggestInternshipDomainsOutput> {
  return suggestInternshipDomainsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInternshipDomainsPrompt',
  input: {schema: SuggestInternshipDomainsInputSchema},
  output: {schema: SuggestInternshipDomainsOutputSchema},
  prompt: `You are an expert career advisor specializing in internship placements.

  Based on the following information about the applicant, suggest a list of relevant internship domains.

  Background: {{{background}}}
  Interests: {{{interests}}}
  Resume: {{{resume}}}

  Please provide a list of internship domains that would be a good fit for the applicant.  The list should contain no more than 5 items.`,
});

const suggestInternshipDomainsFlow = ai.defineFlow(
  {
    name: 'suggestInternshipDomainsFlow',
    inputSchema: SuggestInternshipDomainsInputSchema,
    outputSchema: SuggestInternshipDomainsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
