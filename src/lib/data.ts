import { z } from 'astro/zod';
import datasetRequestsJson from '../content/pages/dataset-requests.json';
import faqJson from '../content/pages/faq.json';
import pressJson from '../content/pages/press.json';
import privacyJson from '../content/pages/privacy-policy.json';
import projectsJson from '../content/pages/projects.json';
import teamJson from '../content/pages/team.json';

const questionSchema = z.object({ q: z.string(), a: z.string() });
const projectSchema = z.object({
  name: z.string(),
  modality: z.string().optional(),
  status: z.string().optional(),
  desc: z.string().optional(),
  link: z.string(),
  kind: z.string().optional(),
});

export const datasetRequests = z.array(questionSchema).parse(datasetRequestsJson);
export const faq = z.array(questionSchema).parse(faqJson);
export const privacy = z.array(questionSchema).parse(privacyJson);
export const press = z.array(z.object({ dt: z.string(), url: z.url() })).parse(pressJson);
export const projects = z
  .array(z.object({ name: z.string(), entries: z.array(projectSchema) }))
  .parse(projectsJson);
export const team = z
  .array(
    z.object({
      name: z.string(),
      title: z.string(),
      desc: z.string(),
      img: z.string().optional(),
    }),
  )
  .parse(teamJson);
