import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const learn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/learn' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topic: z.string(),            // e.g. "Bash"
    order: z.number(),            // reading order inside the topic
    level: z.string().default('Beginner'),
    minutes: z.number(),          // read + try time
    date: z.coerce.date(),
    free: z.boolean().default(true),
    draft: z.boolean().default(false),
  }),
});

export const collections = { learn };
