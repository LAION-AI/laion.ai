import { team as originalTeam } from '../lib/data';

type Member = (typeof originalTeam)[number] & { profile?: string };
// Copy edits preserve the supplied research interests. Profile links document
// verified name/affiliation corrections; unverified career changes are not inferred.
const updates: Record<string, Partial<Member>> = {
  'Christoph Schuhmann': {
    desc: 'Background in physics and computer science. Producer of Schools of Trust.',
  },
  'Jenia Jitsev': {
    desc: 'Leads the Scalable Learning and Multi-Purpose AI Lab at Jülich Supercomputing Centre. Research in large-scale machine learning, with a background in neuroscience and computer science.',
    profile: 'https://www.fz-juelich.de/en/news/effzett/2023/artificial-intelligence-for-all',
  },
  'Richard Vencu': {
    desc: 'Engineering expertise in artificial intelligence, automation, and electronics.',
  },
  'Romain Beaumont': {
    title: 'Open-source contributor / Founder',
    desc: 'Builds open models and tools for large-scale deep learning.',
  },
  'Robert Kaczmarczyk': {
    desc: 'Works across community, medical research, and operations, with a background in epidemiological research.',
  },
  'Theo Coombes': { desc: 'Programmer focused on large-scale data and machine learning.' },
  'Mehdi Cherti': {
    title: 'Founding member / Researcher',
    desc: 'Research in open multimodal models, datasets, generative modelling, and scaling laws. PhD in computer science.',
    profile: 'https://www.fz-juelich.de/en/news/effzett/2023/artificial-intelligence-for-all',
  },
  'Irina Rish': {
    title: 'Member / Researcher',
    desc: 'Professor of computer science and operations research at Université de Montréal. Research interests include scaling laws for machine learning.',
  },
  'Aran Komatzusaki': {
    name: 'Aran Komatsuzaki',
    title: 'Member / Researcher',
    desc: 'Research interests include reinforcement learning, representation learning, and generative modelling.',
    profile: 'https://arankomatsuzaki.wordpress.com/',
  },
  'Robin Rombach': {
    title: 'Member / Researcher',
    desc: 'Research in deep generative models. Co-author of VQGAN, Latent Diffusion, and Stable Diffusion.',
  },
  'Katherine Crowson': {
    desc: 'AI researcher and generative artist working on generative models.',
  },
  'Marianna Nezhurina': {
    title: 'Member / Researcher',
    desc: 'Research in open multimodal foundation models, datasets, and scaling laws.',
  },
  'Ludwig Schmidt': {
    title: 'Member / Researcher',
    desc: 'Professor of computer science at Stanford University. Research in datasets, generalization, reasoning, evaluation, and large models.',
    profile: 'https://legacy.cs.stanford.edu/directory/faculty',
  },
  'Rio Yokota': {
    title: 'Member / Researcher',
    desc: 'Professor at Institute of Science Tokyo. Research at the intersection of high-performance computing, linear algebra, and machine learning.',
    profile: 'https://www.rio.scrc.iir.isct.ac.jp/en/member/yokota.html',
  },
  'Lucia Cipolina-Kun': {
    title: 'Member / Researcher',
    desc: 'Research in diffusion models, reinforcement learning, and mathematics, including applications to art restoration and cultural heritage.',
  },
  'Dominic Rampas': {
    title: 'Research contributor',
    desc: 'Research in generative models for human creativity. Co-author of Paella and Würstchen.',
  },
  'Pablo Pernias': {
    title: 'Research contributor',
    desc: 'Research in generative models for human creativity. Co-author of Paella and Würstchen.',
  },
  'Huu Nguyen': {
    title: 'Head of safety policy',
    desc: 'Computer scientist and lawyer advocating for human rights and access to scientific advancement and education.',
  },
  'Björn Plüster': {
    title: 'Research contributor',
    desc: 'Research in multilingual language models and specialized fine-tuning.',
  },
  'Jörg Franke': {
    title: 'Member / Researcher',
    desc: 'Research in open foundation models and datasets, automated machine learning, and optimization.',
  },
  'Aarush Katta': { desc: 'Programmer working in artificial intelligence and machine learning.' },
  'Jan Ebert': { desc: 'Software engineer and researcher working on scaling deep learning.' },
};

export const team: Member[] = originalTeam.map((member) => ({
  ...member,
  ...updates[member.name],
}));
