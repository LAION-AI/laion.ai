---
title: "LAION-Aesthetics"
author: "Christoph Schuhmann"
date: "Aug 16, 2022"
previewImg: "https://github.com/LAION-AI/laion.ai/blob/Chris/blog/LAION-Aesthetics.jpg"
---
## A new era of art has begun. 
Now anyone can generate artwork of stunning visual quality within seconds, using AI guided by natural language prompts.

![](https://github.com/LAION-AI/laion.ai/blob/Chris/blog/LAION-Aesthetics.jpg)

Inspired by OpenAI’s [DALL-E 2](https://openai.com/dall-e-2/) and Google’s [Imagen](https://imagen.research.google/), the team at LAION collaborated with [Stability.ai](https://stability.ai), [CompVis](https://ommer-lab.com/), [Runway ML](https://runwayml.com/) and Eleuther AI to build an open Text-to-Image model of similar capabilities named “Stable Diffusion”. These models will soon be available for everyone to download and generate images using their hardware - completely open & free. LAION's contribution was to assemble and release a large-scale language-vision dataset, LAION-5B, and to filter subsets from it, LAION-Aesthetics, which became Stable Diffusion’s final training data. The training of the model was conducted by the researchers [Robin Rombach](https://scholar.google.com/citations?user=ygdQhrIAAAAJ) (CompVis) and [Patrick Esser](https://scholar.google.com/citations?user=ang8MoQAAAAJ) (Runway ML).

The necessary hardware requirements to run such models are surprisingly low. It can run on a consumer GPU with as low as 5.1 GB of VRAM or even on a MacBook Pro with a M1 processor. 

At the moment, the model is already available for research purposes under: 

[Request Research Access to Stable Diffusion V1](https://stability.ai/research-access-form)

The GitHub repository with the training code and technical details can be found here

[Stable Diffusion repository by CompVis](https://github.com/CompVis/stable-diffusion)


After a further safety evaluation by Stability.ai the model be released for anyone to access.
We have implemented this initial phase of restricted research-only access to allow us researchers and the general public to prepare for the widespread open use of this very impactful technology.
As mentioned previously, models of similar capabilities, such as DALL-E 2, have been released previously under limited access.
However, at the time of writing, no model of comparable quality has been available for the general public to access or download. 

We know that other teams are working to build similar text-to-image models. More community-led open projects will likely follow after this launch, using Stable Diffusion as the foundation. Therefore, even if we were to hold the model back from the public, further developments in text-to-image models would inevitably arrive soon, providing the public with an even more capable set of tools to synthesize artwork and photos.  What remains unclear is how many models will be released transparently and become publicly available, allowing further studies involving a broad research community. It would be unfortunate for the public if some of these innovative models would remain closed without providing the opportunity for independent research and safety evaluation, despite these organizations already targeting to build applications that may significantly impact human society.

Therefore, a responsible, open, transparent step-by-step release of Stable Diffusion is the best possible approach to empower the broad research community and the general public to investigate and get accustomed to this technological, artistic, and cultural revolution. We also think it is vital to convey how innovative the learning algorithms can be at this early stage. It may even challenge our very core beliefs about what creativity means.

![](https://images.squarespace-cdn.com/content/v1/6213c340453c3f502425776e/e9173b23-ede6-4004-b69c-7b03fce8872b/Screenshot+2022-08-10+at+15.58.02.png?format=750w)

To allow researchers, machine learning experts, journalists, educators, and decision-makers to explore the abilities of Stable Diffusion, we provide a website to provide the ability to generate images using these models (after a proper identification).

In the future, we plan to give access to the website for everyone to generate images at no cost in exchange for short annotation tasks that will help us further improve models.

Of course, our mission as a nonprofit organization is to make machine learning datasets and models available to the general public. All images and texts produced on this website will be released openly as datasets for everyone to discover and use. 

![](https://images.squarespace-cdn.com/content/v1/6213c340453c3f502425776e/7346e820-8f18-4bd0-901e-379c5bc07c92/2-01.png?format=750w)

We aim to make this technology freely available for millions of users through donations of compute time on computers with GPUs that would otherwise be unused (e.g., in companies or at home). Similar to previous platforms such as Folding@Home, anybody would be able to share remote compute to build a collaborative, open inference platform - whether that be organizations or everyday people alike. We also aim to use existing supercomputing research facilities by applying for compute time at different sites (e.g., Juelich Supercomputing Center of Helmholtz Society, Germany or Oak Ridge Laboratory of National Energy Department, USA) to expand the scale and the generic capabilities of the models.

Interested researchers, machine learning experts, journalists, educators and decision-makers can signup here for access to our already functional website for research purposes:

[Signup for laiondream.ai](https://laiondream.ai/signup)

People who are interested in donating time on their GPUs, to support the backend of our website, please visit this website to learn more about the technical & logistic requirements for this:

[Support laiondream.ai](https://laiondream.ai/support)

