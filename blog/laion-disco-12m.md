---
title: "LAION-DISCO-12M"
author: "LAION e.V."
date: "Nov 17, 2024"
previewImg: "/images/blog/laion-disco-12m.webp"
---

LAION announces the [LAION-DISCO-12M](https://huggingface.co/datasets/laion/LAION-DISCO-12M) - a collection of 12 million links to publicly available YouTube samples paired with metadata to support basic machine learning research in foundation models for generic audio, music information retrieval, and audio dataset analysis. We collect metadata for 12,648,485 songs, including song name, artist name, and album name. This dataset marks the largest publicly available open dataset for music.

The dataset follows up on [DISCO-10M](https://arxiv.org/abs/2306.13512) and provides the following improvements compared to the previous work:

- The data collection process is based on a recursive search of artists; it was done on YouTube Music and not on Spotify. This means the metadata and YouTube URL are correctly matched, unlike DISCO-10M where the authors needed to match YouTube URLs to Spotify metadata, resulting in a significant number of wrong matches.
- The seed artists used for DISCO-10M resulted in a limited number of artists, we expanded the seed artist list by using charts from different countries and genre playlists. This new artist seed list resulted in 250,516 artists.

We envision that the dataset can contribute to advancing research across several key areas:

- **Audio and music foundation models**: the large-scale nature of this dataset allows researchers to train audio foundation models (eg. CLAP and its various extensions, <https://github.com/LAION-AI/CLAP>, <https://arxiv.org/abs/2211.06687>) and study the generalization and transfer to various downstream tasks such as captioning, editing, generation, classification, and others.
- **Music Information Retrieval (MIR)**: This includes developing methods to extract rich musical attributes such as genre, artist identification, tempo, pitch, and other audio features.
- **Content-Based Music Search**: The dataset supports building advanced content-based search engines that can identify songs similar to a given audio clip (akin to apps like Shazam).
- **Music recommendation systems**: Using this dataset researchers can analyze similarities in songs and artist styles and find new ways to recommend music.

## Usage of LAION-DISCO-12M

We release LAION-DISCO-12M under Apache 2.0 License, which ensures researchers can freely utilize dataset both for conducting basic or applied research. Our usage recommendation follows the guidelines we use for our research releases: the dataset is released for research purposes, especially for conducting basic research on various open multi-modal foundation models, e.g. CLAP, in academic settings. We strongly advise AGAINST using the datasets in industrial settings and even more so, we advise strongly AGAINST using datasets in their original form for creating end products. We explicitly warn that LAION datasets are meant for inspection and usage necessary for purposes of scientific and/or safety analysis, performed by qualified researchers from machine learning and related fields.

## LEGAL DISCLAIMER

The datasets of LAION only contain links to original samples on public internet and metadata. LAION is not responsible for the content that can be accessed via the links. LAION researchers do not inspect the content of individual samples either, relying on overall statistics collected across all samples, and the processing routines, such as filtering, are automated due to the very large amount of data. LAION does not distribute original media content like audio itself.
