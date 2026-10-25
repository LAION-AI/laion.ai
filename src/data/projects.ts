import { projects as legacyProjects } from '../lib/data';

export interface Resource {
  label: string;
  href: string;
}
export interface Project {
  name: string;
  modality?: string;
  kind?: string;
  status?: string;
  desc?: string;
  link: string;
  date?: string;
  resources: Resource[];
}

// Editorial catalogue. Original release texts remain in the content archive.
// Resource URLs are also the primary sources for these release/status updates.
const updates: Record<string, Partial<Project>> = {
  'LAION-BVD': {
    modality: 'video / audio / image / text',
    resources: [
      { label: 'Paper', href: 'https://arxiv.org/abs/2608.24845' },
      { label: 'Dataset', href: 'https://projects.laion.ai/bvd/download.html' },
      { label: 'Code', href: 'https://github.com/LAION-AI/BVD' },
      { label: 'Documentation', href: 'https://projects.laion.ai/bvd/' },
      { label: 'Terms', href: '/blog/bvd#research-access-and-responsible-use' },
    ],
  },
  LAION5B: {
    name: 'LAION-5B (original)',
    status: 'Superseded',
    desc: 'The original 2022 image–text dataset. Re-LAION-5B is the updated release with additional safety fixes.',
    resources: [
      { label: 'Updated dataset', href: '/blog/relaion-5b' },
      { label: 'Original paper', href: 'https://arxiv.org/abs/2210.08402' },
    ],
  },
  'LAION-400M': {
    status: 'Historical release',
    resources: [
      { label: 'Paper', href: 'https://arxiv.org/abs/2111.02114' },
      { label: 'Documentation', href: '/blog/laion-400-open-dataset' },
    ],
  },
  'Laion-coco': { name: 'LAION-COCO', status: 'Historical release' },
  'Laion translated': { name: 'LAION Translated', status: 'Historical release' },
  'LAION5B High-Res': { name: 'LAION-5B High-Res', status: 'Historical subset' },
  'LAION Aesthetics': {
    name: 'LAION-Aesthetics',
    status: 'Historical subset',
    desc: 'Subsets of the original LAION-5B selected using models that estimate visual aesthetics.',
  },
  'Clip H/14': {
    name: 'OpenCLIP ViT-H/14',
    status: 'Released',
    desc: 'An open vision–language model trained on LAION-2B with OpenCLIP.',
    resources: [
      { label: 'Weights', href: 'https://huggingface.co/laion/CLIP-ViT-H-14-laion2B-s32B-b79K' },
      { label: 'Code', href: 'https://github.com/mlfoundations/open_clip' },
    ],
  },
  Openclip: {
    name: 'OpenCLIP',
    status: 'Released',
    resources: [
      { label: 'Code', href: 'https://github.com/mlfoundations/open_clip' },
      {
        label: 'Weights & documentation',
        href: 'https://github.com/mlfoundations/open_clip#pretrained-models',
      },
    ],
  },
  CLAP: {
    status: 'Released',
    desc: 'Contrastive Language-Audio Pretraining: open audio–text models, pretrained checkpoints, and evaluation code.',
    resources: [
      { label: 'Paper', href: 'https://arxiv.org/abs/2211.06687' },
      { label: 'Code & weights', href: 'https://github.com/LAION-AI/CLAP' },
      { label: 'Documentation', href: 'https://github.com/LAION-AI/CLAP#quick-start' },
    ],
  },
  'Clip Retrieval': {
    name: 'CLIP Retrieval',
    desc: 'Compute CLIP embeddings and build a search system for image–text datasets.',
  },
  img2dataset: {
    desc: 'Download, resize, and package images from URL lists for reproducible dataset processing.',
  },
  'Clip Benchmark': {
    name: 'CLIP Benchmark',
    status: 'Released',
    desc: 'Evaluate vision–language models on zero-shot classification and retrieval tasks.',
  },
  'LAION-5B': {
    status: 'Published',
    date: '2022-10-16',
    link: 'https://arxiv.org/abs/2210.08402',
    resources: [{ label: 'Paper', href: 'https://arxiv.org/abs/2210.08402' }],
  },
};

const revisedDataset: Project = {
  name: 'Re-LAION-5B',
  modality: 'image / text',
  status: 'Released',
  link: '/blog/relaion-5b',
  desc: 'The updated LAION-5B: 5.5 billion text–image-link pairs with additional safety fixes, released in research and research-safe versions.',
  resources: [
    {
      label: 'Dataset',
      href: 'https://huggingface.co/collections/laion/re-laion-5b-research-67e312387d2a4f879c4920b1',
    },
    {
      label: 'Research-safe dataset',
      href: 'https://huggingface.co/collections/laion/re-laion-5b-research-safe-67e311013ba899a938569e32',
    },
    { label: 'Documentation', href: '/blog/relaion-5b' },
  ],
};

const defaultResource = (link: string): Resource => ({
  label: link.startsWith('/')
    ? 'Release notes'
    : link.includes('huggingface.co/datasets/')
      ? 'Dataset'
      : link.includes('arxiv.org/')
        ? 'Paper'
        : 'Repository',
  href: link,
});
const historical = new Set([
  'LAION-400M',
  'LAION5B',
  'Laion-coco',
  'Laion translated',
  'LAION5B High-Res',
  'LAION Aesthetics',
]);
const archive: Project[] = [];
let clipModel: Project | undefined;
export const projects = legacyProjects.map((group) => {
  const entries: Project[] = [];
  for (const source of group.entries) {
    const project: Project = {
      ...source,
      modality: source.modality?.split('/').join(' / '),
      // Unverified legacy "Started" / "In progress" labels are not current statuses.
      status:
        source.status?.toLowerCase() === 'released'
          ? 'Released'
          : source.status?.toLowerCase() === 'published'
            ? 'Published'
            : undefined,
      resources: [defaultResource(source.link)],
      ...updates[source.name],
    };
    if (group.name === 'Papers' && source.name === 'LAION-400M') project.status = 'Published';
    if (group.name === 'Datasets' && historical.has(source.name)) archive.push(project);
    else if (source.name === 'Clip H/14') clipModel = project;
    else entries.push(project);
  }
  if (group.name === 'Datasets') {
    entries.sort((a, b) => Number(b.name === 'LAION-BVD') - Number(a.name === 'LAION-BVD'));
    entries.splice(1, 0, revisedDataset);
  }
  if (group.name === 'Models' && clipModel) entries.splice(1, 0, clipModel);
  if (group.name === 'Papers')
    entries.unshift({
      name: 'LAION-BVD',
      modality: 'video / audio / image / text',
      status: 'Preprint',
      date: '2026-08-26',
      desc: 'A 10-million-hour open video dataset for multimodal pre-training.',
      link: 'https://arxiv.org/abs/2608.24845',
      resources: [
        { label: 'Paper', href: 'https://arxiv.org/abs/2608.24845' },
        { label: 'Project', href: '/blog/bvd' },
      ],
    });
  return { name: group.name, entries };
});
projects.push({ name: 'Historical datasets', entries: archive });
