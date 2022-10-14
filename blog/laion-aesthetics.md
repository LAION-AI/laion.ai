---
title: "LAION-Aesthetics"

author: "Christoph Schuhmann"

date: "Aug 16, 2022"

previewImg: "/images/blog/LAION-Aesthetics.jpg"
---

We present LAION-Aesthetics, several collections of subsets from LAION 5B with high visual quality.

![](https://raw.githubusercontent.com/LAION-AI/laion.ai/Chris/blog/LAION-Aesthetics.jpg)

To create LAION-Aesthetics we trained several lightweight models that predict the rating people gave when they were asked _“How much do you like this image on a scale from 1 to 10?”_.

## LAION-Aesthetics V1

We started with training a linear model on 5000 image-rating pairs from the [SAC](https://github.com/JD-P/simulacra-aesthetic-captions) dataset (which only contained 5000 samples at that time).

Simulacra Aesthetic Captions is a dataset of over 238000 synthetic images generated with AI models such as CompVis latent GLIDE and Stable Diffusion from over forty thousand user submitted prompts.

As inputs this model uses not the images themselves, but their CLIP Image embeddings produced with the Open AI CLIP VIT L 14 model. We call this model LAION-Aesthetics_Predictor V1.

Its results were so encouraging, that we decided to produce 8M and 120M sample subsets of the LAION 5B images with the highest predicted scores, of those that have english texts.

We call the dataset consisting of these 2 subsets [LAION-Aesthetics V1](https://github.com/LAION-AI/laion-datasets/blob/main/laion-aesthetic.md).

![](https://github.com/LAION-AI/laion.ai/blob/Chris/blog/LAION-Aesthetics%20V1.jpg?raw=true)

The model used for creating this subset can be found [here.](https://github.com/LAION-AI/aesthetic-predictor)

The LAION-Aesthetics V1 dataset & further details about it can be found [here.](https://github.com/LAION-AI/laion-datasets/blob/main/laion-aesthetic.md)

## LAION-Aesthetics V2

After these very encouraging results, we continued to experiment and gathered the following data to train more improved MLP (multi-layer perceptron) models:

- More samples from the SAC dataset, which had grown in the meanwhile
  to 176000 image - rating pairs
- LAION-Logos, a dataset of 15.000 logo image-text pairs with aesthetic
  ratings from 1 to 10. We collected this dataset to improve the models
  abilities to evaluate images with more or less aesthetic texts in
  them.
- [The Aesthetic Visual Analysis (AVA) dataset](https://github.com/imfing/ava_downloader), which is a large-Scale database for aesthetic visual analysis that contains 250000 photos from dpchallenge.com with several aesthetic ratings from 1 to 10 for most images.
- After training several MLPs with different numbers of layers and parameters and different activation functions, we found that a simple linear model on the top of CLIP ViT/14 produced in our subjective view the visually most appealing results when used to rank images of LAION-5B. (Even though other MLPs with e.g. Relu functions produced slightly lower MSE and MAE loss values.) We call the resulting model trained on SAC, LAION-Logos and AVA [LAION-Aesthetics_Predictor V2.](https://github.com/christophschuhmann/improved-aesthetic-predictor)
- Visualizations of sorting all 2.37B images from LAION 5B that have English captions into 40 buckets with the LAION-Aesthetics_Predictor V2 can be found [here.](http://captions.christoph-schuhmann.de/aesthetic_viz_laion_sac+logos+ava1-l14-linearMSE-en-2.37B.html)

Using LAION-Aesthetics_Predictor V2, we created the following subsets of the LAION 5B samples with English captions:

- 1,2B image-text pairs with predicted aesthetics scores of 4.5 or higher: [browse](http://captions.christoph-schuhmann.de/2B-en-4.5.html) [huggingface](https://huggingface.co/datasets/ChristophSchuhmann/improved_aesthetics_4.5plus)
- 939M image-text pairs with predicted aesthetics scores of 4.75 or higher: [browse](http://captions.christoph-schuhmann.de/2B-en-4.75.html) [huggingface](https://huggingface.co/datasets/ChristophSchuhmann/improved_aesthetics_4.75plus)
- 600M image-text pairs with predicted aesthetics scores of 5 or higher: [browse](http://captions.christoph-schuhmann.de/2B-en-5.html) [huggingface](https://huggingface.co/datasets/ChristophSchuhmann/improved_aesthetics_5plus)
- 12M image-text pairs with predicted aesthetics scores of 6 or higher: [browse](http://captions.christoph-schuhmann.de/2B-en-6.html) [huggingface](https://huggingface.co/datasets/ChristophSchuhmann/improved_aesthetics_6plus)
- 3M image-text pairs with predicted aesthetics scores of 6.25 or higher: [browse](http://captions.christoph-schuhmann.de/2B-en-6.25.html) [huggingface](https://huggingface.co/datasets/ChristophSchuhmann/improved_aesthetics_6.25plus)
- 625K image-text pairs with predicted aesthetics scores of 6.5 or higher: [browse](http://captions.christoph-schuhmann.de/2B-en-6.5.html) [huggingface](https://huggingface.co/datasets/ChristophSchuhmann/improved_aesthetics_6.5plus)

These subsets overlap. 5 fully includes 6 which includes 6.25 and so on. We call the collection of these subsetsLAION-Aesthetics V2.

We provided the dataset to the [CompViz](https://github.com/CompVis) team led by Robin Rombach and Patrick Esser. They used the 5+ subset to train [Stable Diffusion V1](https://github.com/CompVis/stable-diffusion/tree/ce05de28194041e030ccfc70c635fe3707cdfc30#stable-diffusion-v1) model.

## What's next?

At the moment we are translating all 2,15B samples from LAION 5B of the multilingual subset to English using the 1,2B parameter [M2M-100](https://github.com/facebookresearch/fairseq/tree/main/examples/m2m_100) model .

This will allow us to roughly double the size of V2.

Additionally, we are already working on new multimodal large-scale dataset, this time at webpage-level, similar to the interleaved image-text dataset Deepmind used for [Flamingo](https://www.deepmind.com/blog/tackling-multiple-tasks-with-a-single-visual-language-model), but also with audio & video files ... and much, much bigger. :)

Stay tuned & keep checking our blog for more datasets in the near future.

## Connect

If you have any questions or comments or the wish to support our efforts, don’t hesitate to [join our Discord community and contact us.](https://discord.gg/vnjVezbeSJ)

_Christoph Schuhmann ( spirit-from-germany#1488 ) and Romain Beaumont ( rom1504#5008 )_
