---
title: "LAION-BVD: A 10-Million-Hour Open Video Dataset for Multimodal Research"
author: "Andreas Hochlehnert"
date: "Aug 26, 2026"
previewImg: "/images/blog/bvd-preview.jpg"
---

Today we are releasing LAION-BVD (Big Video Dataset), a large-scale open video dataset designed for multimodal machine learning research.

LAION-BVD contains:

* 1.3 billion platform-specific video URLs collected from Common Crawl 
* 80 million downloaded videos  
* 10 million hours of video content  
* 55 million captioned video clips  
* 300 million captioned video frames

The dataset is intended for research on video-language, audio-language, and image-text models.  
<figure style="margin: 1.5rem 0 1rem;">
  <img src="/images/blog/bvd_fig1.png" alt="LAION-BVD dataset comparison and scaling behavior" style="display: block; margin: 0 auto;">
  <figcaption style="margin-top: 0.25rem; text-align: center;">Figure 1: <strong>LAION-BVD compared with existing open video datasets; video and audio scaling behavior of ViCLIP and CLAP, respectively.</strong></figcaption>
</figure>

## Why LAION-BVD?

Large-scale multimodal datasets are increasingly concentrated inside a small number of technology companies. Open image-text datasets such as LAION-5B helped make reproducible vision-language research broadly accessible. Comparable open resources for video remain much smaller and harder to construct at scale.

LAION-BVD aims to provide an open foundation for multimodal research across video, audio, and image modalities.

## Building the Dataset

We started from Common Crawl WAT files and extracted platform-specific video URLs using yt-dlp extractors. Using a distributed Apache Spark pipeline and large-scale download infrastructure, we processed video links from YouTube, Vimeo, and Dailymotion. 

From 1.3B extracted video URLs, we downloaded a subset of around 80M videos corresponding to roughly 10M hours of content. 

We then created several multimodal subsets: 

- BVD-V-55M: 55M scene-level video clips with generated captions  
- BVD-A-10M and BVD-A-1.7M: captioned audio subsets  
- BVD-I-300M: 300M scene-changing video frames for image-text training

Our pipeline uses scene detection and lightweight filtering to extract clips and keyframes at scale. Video and audio captions are generated automatically using multimodal captioning models. 

<figure style="margin: 1.5rem 0 1rem;">
  <img src="/images/blog/bvd_fig2.png" alt="LAION-BVD data curation pipeline" style="display: block; margin: 0 auto;">
  <figcaption style="margin-top: 0.25rem; text-align: center;">Figure 2: <strong>Overview of the LAION-BVD data curation pipeline, from Common Crawl extraction to multimodal subsets.</strong></figcaption>
</figure>

## Dataset Statistics

LAION-BVD spans a broad range of languages, topics, and video formats. While English is the largest language group, 43% of the videos are non-English. The dataset includes entertainment, education, science, sports, music, gaming, and many other categories. 

Most videos are shorter than five minutes, but the distribution is long-tailed and includes longer-form content suitable for long-horizon video tasks.

<figure style="margin: 1.5rem 0 1rem;">
  <img src="/images/blog/bvd_fig3.png" alt="LAION-BVD dataset statistics" style="display: block; margin: 0 auto;">
  <figcaption style="margin-top: 0.25rem; text-align: center;">Figure 3: <strong>Distribution of platforms, categories, languages, upload years, and video durations in LAION-BVD.</strong></figcaption>
</figure>

## Video, Audio, and Frame Captioning

To construct training data across modalities, we segment videos into scene-level clips and generate captions automatically.

For video-language training, we caption clips using Qwen3-VL. For audio-language training, we generate audio captions using Audio Flamingo 3\. We additionally extract and caption scene-changing video frames for image-text training. 

<figure style="margin: 1.5rem 0 1rem;">
  <img src="/images/blog/bvd_fig4.png" alt="Extracted clips with generated video and audio captions" style="display: block; margin: 0 auto;">
  <figcaption style="margin-top: 0.25rem; text-align: center;">Figure 4: <strong>Examples of extracted clips together with generated video and audio captions</strong>.</figcaption>
</figure>

## Validation Across Modalities

We evaluate LAION-BVD across three modalities:

* video-text with ViCLIP  
* audio-text with CLAP  
* image-text with CLIP

Our experiments show:

* ViCLIP models trained on LAION-BVD outperform InternVid-trained baselines by up to 3.3 percentage points on aggregate retrieval and classification benchmarks (Table 1, BVD-V-10M vs InternVid-10M-FLT)  
* CLAP models trained on BVD audio achieve competitive performance despite minimal curation (Table 2\)  
* Frame-caption pairs extracted from videos provide strong image-text retrieval performance and favorable scaling behavior (Table 3\)

Across modalities, we observe consistent improvements with increasing data and model scale. 

<br/>

Table 1: **L-14 scaling with LAION-BVD data on classification and retrieval tasks.**
LAION-BVD-trained ViCLIP outperforms both InternVid-trained ViCLIP and the image-only CLIP baseline trained on DataComp-1B where video embeddings are obtained by averaging frame embeddings. Performance consistently improves with increased training data and dataset scale, with BVD-V-50M achieving the best overall average. (\* denotes results reported in [InternVid](https://arxiv.org/abs/2307.06942); all other results are evaluated using our pipeline.)  
![L-14 scaling with LAION-BVD data on classification and retrieval tasks](/images/blog/bvd_fig5.png)

Table 2: **Average zero-shot audio performance for pure training data sources at 30M samples seen.**
Each cell reports the best average score per model scale, aggregated over UrbanSound8K classification and AudioCaps/Clotho retrieval. LAION-BVD audio matches or exceeds LAION-Audio (LA) across model scales. Despite minimal curation, BVD-A-10M exhibits consistent scaling behavior with increasing model size.  
![Average zero-shot audio performance for pure training data sources at 30M samples seen](/images/blog/bvd_fig6.png)

Table 3: **Image-text training with CLIP across datasets and scales.**
LAION-BVD achieves the strongest COCO retrieval results, while web-image datasets remain stronger on ImageNet-style classification.  
![Image-text training with CLIP across datasets and scales](/images/blog/bvd_fig7.png)

## Research Access and Responsible Use

LAION-BVD is released to support open and reproducible multimodal research at scale. Large-scale video datasets and the models trained on them are increasingly concentrated within a small number of predominantly US-based technology companies, limiting independent scientific investigation and reproducibility.

By providing an open resource for academic research, we aim to broaden access to multimodal training data and enable more transparent evaluation of large-scale video, audio, and image models.

LAION-BVD is released **exclusively** **for research purposes** and **NOT** **for commercial use**. We strongly encourage users to respect the rights and copyright of content creators and to use the dataset responsibly and in accordance with applicable laws and platform terms.

The dataset is intended to support scientific research, reproducibility, safety analysis, and the study of multimodal foundation models and systems built on them.

Like other large-scale web datasets, LAION-BVD may contain biases, stereotypes, or uneven representation across languages, regions, and topics. Depending on the learning procedure, models trained on this data may develop representations that inherit such biases, expressing those to various degrees under various circumstances. Researchers working with the data should be aware of these phenomena and whenever relevant in the context of research work, quantify and highlight such limitations alongside the strengths when developing and evaluating multimodal systems.

## Release

We release:

* the URL collection  
* video, audio, and frame captions 
* subset metadata  
* training code and evaluation details

Our goal is to lower the barrier for open multimodal foundation model research and provide infrastructure for reproducible large-scale video learning.

Website: [https://projects.laion.ai/bvd/](https://projects.laion.ai/bvd/)   
Dataset collection: [https://huggingface.co/collections/laion/bvd-big-video-dataset](https://huggingface.co/collections/laion/bvd-big-video-dataset)  
Terms of use: [https://github.com/LAION-AI/BVD/blob/main/assets/bvd\_terms\_of\_use.pdf](https://github.com/LAION-AI/BVD/blob/main/assets/bvd_terms_of_use.pdf)   
Privacy policy: [https://github.com/LAION-AI/BVD/blob/main/assets/bvd\_privacy\_policy.pdf](https://github.com/LAION-AI/BVD/blob/main/assets/bvd_privacy_policy.pdf) 

We are excited to see what the research community builds with LAION-BVD.

We also thank [GRASS](https://grass.io) for providing LAION access to its data infrastructure in support of this release.
