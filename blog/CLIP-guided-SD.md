---
title: "LAION-Aesthetics"
author: "Christoph Schuhmann"
date: "Sep 16, 2022"
previewImg: "![image](![image](https://user-images.githubusercontent.com/22318853/190650567-16c9c9d1-6443-4ea1-a6db-d19a3390e575.png))"
---
## Guiding Stable Diffusion with OpenCLIP H & g



To explore the usefulness of our new CLIP models for image generation tasks, we use it to guide the generation of Stable Diffusion V1-5.

<ul style="list-style-type:circle">
<li>For each denoiser step of Stable Diffusion, the denoised latent vectors were decoded into RGB tensors, applying several random augmentations ( rotations of up to 5 degree, translations of up to 5%, changes of saturation, contrast and brightness of up to 5% and adding a bit random noise)</li>
<li>Then we fed 48 of these augmentations  into the CLIP image encoder and compared the image embeddings with the text embeddings by calculating the spherical_dist_loss. </li>
<li>Then we back propagated this loss through the frozen CLIP and the frozen autoencoder to get a gradients in the latent space that could be applied to the denoised latent tensors</li>
<li>So we added the negatives of these gradients from the denoiser step, along with the latents predicted SD‘s denoising layer, as an extra layer of guidance</li>
</ul>



With this procedure we generated images for input texts of increasing compositional difficulty. We generated 16 images with guidance by our CLIP H and g models and “cherry picked” the “prettiest” 3 for each prompt. We are aware that this approach is highly subjective, but we think it is an easy and still very valuable visualization of what our models can and cannot do in combination with Stable Diffusion. 


<b><i>"Happy teddy bears mixing sparkling chemicals as mad scientists as very aesthetic high quality cartoons. Happy teddy bears are using several test tubes and laboratory equipment. Chemicals are wonderfully sparkling. Very beautiful aesthetic high quality cartoon, Trending on artstation, Vibes of Happiness & enchantment" </i></b>

 <p align="center">
    <img width="512" src="https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/0_seed-0_cfg-8.0_cgs-0.1_ViT-g-14--e90.png">
</p>
 <p align="center">
    <img width="512" src="https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/0_seed-0_cfg-8.0_cgs-0.1_ViT-g-14--e90.png">
</p>
 <p align="center">
    <img width="512" src="https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/0_seed-0_cfg-8.0_cgs-0.1_ViT-g-14--e90.png">
</p>



<b><i>"Happy teddy bears mixing sparkling chemicals as mad scientists as very aesthetic high quality cartoons. Happy teddy bears are using several test tubes and laboratory equipment. Chemicals are wonderfully sparkling. Very beautiful aesthetic high quality cartoon, Trending on artstation, Vibes of Happiness & enchantment" </i></b>

 <p align="center">
    <img width="512" src="https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/0_seed-0_cfg-8.0_cgs-0.1_ViT-g-14--e90.png">
</p>
 <p align="center">
    <img width="512" src="https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/0_seed-0_cfg-8.0_cgs-0.1_ViT-g-14--e90.png">
</p>
 <p align="center">
    <img width="512" src="https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/0_seed-0_cfg-8.0_cgs-0.1_ViT-g-14--e90.png">
</p>



<b><i>"Happy teddy bears mixing sparkling chemicals as mad scientists as very aesthetic high quality cartoons. Happy teddy bears are using several test tubes and laboratory equipment. Chemicals are wonderfully sparkling. Very beautiful aesthetic high quality cartoon, Trending on artstation, Vibes of Happiness & enchantment" </i></b>


 <p align="center">
    <img width="512" src="https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/0_seed-0_cfg-8.0_cgs-0.1_ViT-g-14--e90.png">
</p>
 <p align="center">
    <img width="512" src="https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/0_seed-0_cfg-8.0_cgs-0.1_ViT-g-14--e90.png">
</p>
 <p align="center">
    <img width="512" src="https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/0_seed-0_cfg-8.0_cgs-0.1_ViT-g-14--e90.png">
</p>


<b><i>"Happy teddy bears mixing sparkling chemicals as mad scientists as very aesthetic high quality cartoons. Happy teddy bears are using several test tubes and laboratory equipment. Chemicals are wonderfully sparkling. Very beautiful aesthetic high quality cartoon, Trending on artstation, Vibes of Happiness & enchantment" </i></b>

 <p align="center">
    <img width="512" src="https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/0_seed-0_cfg-8.0_cgs-0.1_ViT-g-14--e90.png">
</p>
 <p align="center">
    <img width="512" src="https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/0_seed-0_cfg-8.0_cgs-0.1_ViT-g-14--e90.png">
</p>
 <p align="center">
    <img width="512" src="https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/0_seed-0_cfg-8.0_cgs-0.1_ViT-g-14--e90.png">
</p>


As can be observed our CLIP+SD ensemble does a pretty good job with the first 2 texts, the Teddy Bears and the polarbear.

The “doghouse made out of sushi” text is already more challenging, but still could solve the tasks decently in some cases. We are confident that by generating more candidate images and cherry picking from them could have yielded even better results.
 
The “Elon Musk waving goodbye” text has obviously a composition too complex for our ensemble to understand. At least it managed to draw cute images of Teddy Bear astronauts and Elon Musk. 

We will release our CLIP guidance code for Stable Diffusion here within the next few weeks.

In the future it would certainly be interesting to train Text-to-Image models like Stable Diffusion or Image with more powerful text encoders than the one Stable Diffusion V1 uses (the OpenAI CLIP L 14 text encoder). Google’s Imagen e.g. uses T5XXL’s encoder module and using this as text encoder for open source Text-to-Image models, as well as for CLIP models seems a promising path for improvements with texts that contain complex compositions.



## What's next?

At the moment we are translating all 2,15B samples from LAION 5B of the multilingual subset to English using the 1,2B parameter [M2M-100]( https://github.com/facebookresearch/fairseq/tree/main/examples/m2m_100 ) model . 

This will allow us to roughly double the size of V2.

Additionally, we are already working on new multimodal large-scale dataset, this time at webpage-level, similar to the interleaved image-text dataset Deepmind used for [Flamingo]( https://www.deepmind.com/blog/tackling-multiple-tasks-with-a-single-visual-language-model ), but also with audio & video files ... and much, much bigger. :)


Stay tuned & keep checking our blog for more datasets in the near future.

## Connect

If you have any questions or comments or the wish to support our efforts, don’t hesitate to join our Discord community and contact us:
https://discord.gg/vnjVezbeSJ 

**Christoph Schuhmann ( spirit-from-germany#1488 )** and **Romain Beaumont ( rom1504#5008 )**

