'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestInternshipDomains } from '@/ai/flows/suggest-internship-domains';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  background: z.string().min(10, 'Please provide more details about your background.'),
  interests: z.string().min(10, 'Please provide more details about your interests.'),
  resume: z.string().min(20, 'Please paste a substantial part of your resume.'),
});

export function DomainSuggester() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      background: '',
      interests: '',
      resume: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestInternshipDomains(values);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get suggestions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Background</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Computer Science student, proficient in Python..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Interests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Interested in machine learning, data visualization..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paste Your Resume (or key parts)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your projects, skills, and experience here."
                    className="resize-vertical min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Suggestions...
              </>
            ) : (
              'Suggest Domains'
            )}
          </Button>
        </form>
      </Form>

      {suggestions.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-3">Recommended Internship Domains:</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
