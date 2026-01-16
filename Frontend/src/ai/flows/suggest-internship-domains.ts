'use server';
/**
 * @fileOverview Genkit flow for suggesting internship domains and companies
 * strictly based on the attached CV (single source of truth).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestInternshipDomainsInputSchema = z.object({
  resume: z.string().describe(
    'The full extracted text of the applicant’s CV. This is the ONLY source of truth.'
  ),
});

export type SuggestInternshipDomainsInput = z.infer<
  typeof SuggestInternshipDomainsInputSchema
>;

const SuggestInternshipDomainsOutputSchema = z.object({
  results: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      cvMatchReason: z.string(),
      skillsRequired: z.string(),
      location: z.string(),
      directCareerLink: z.string(),
    })
  ),
});

export type SuggestInternshipDomainsOutput = z.infer<
  typeof SuggestInternshipDomainsOutputSchema
>;

export async function suggestInternshipDomains(
  input: SuggestInternshipDomainsInput
): Promise<SuggestInternshipDomainsOutput> {
  return suggestInternshipDomainsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'strictInternshipMatcherPrompt',
  input: { schema: SuggestInternshipDomainsInputSchema },
  output: { schema: SuggestInternshipDomainsOutputSchema },
  prompt: `
You are acting as a senior technical recruiter and hiring researcher.

Analyze the ATTACHED CV in depth.
The CV is the ONLY source of truth.
Do NOT infer, assume, or add any skills, tools, experience, or interests
that are not explicitly mentioned in the CV.

OBJECTIVE:
Identify internship opportunities that are a strong, realistic match
for the candidate’s current skills, projects, and experience level.

STRICT NON-NEGOTIABLE RULES:
1. Suggest ONLY real, legitimate companies.
2. Provide ONLY OFFICIAL COMPANY CAREER PAGE LINKS.
   ❌ No Internshala
   ❌ No Unstop
   ❌ No LinkedIn Jobs
   ❌ No Indeed / Naukri / any job aggregator
   ✅ Links must belong to the company’s own domain
3. Do NOT fabricate roles, companies, or links.
4. If a specific internship is not currently listed,
   provide the official career page where such internships are usually posted.
5. Quality over quantity — exclude companies that are not a strong CV match.

FOR EACH COMPANY, INCLUDE:
- Company Name
- Internship Role (exact title or closest realistic role)
- Why this role matches the CV (1–2 lines referencing CV content)
- Required / preferred skills (from job description if available)
- Location (Remote / India / Hybrid if known)
- DIRECT application link (official company site only)

PRIORITY FILTERS:
- Entry-level / student-friendly internships
- Product-based companies or tech-driven startups
- Roles aligned strictly with the CV (no stretch roles)
- Remote or India-based roles preferred

FINAL VERIFICATION STEP (MANDATORY):
Before responding:
- Recheck that every link is an official company domain
- Ensure no third-party platforms are included
- Confirm each company genuinely aligns with the CV

CV TEXT:
{{{resume}}}
`,
});

const suggestInternshipDomainsFlow = ai.defineFlow(
  {
    name: 'suggestInternshipDomainsFlow',
    inputSchema: SuggestInternshipDomainsInputSchema,
    outputSchema: SuggestInternshipDomainsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
