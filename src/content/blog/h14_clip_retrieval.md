---
title: "Clip-Retrieval Update: H-14 Index & SLURM Inference"
author: "no usr"
date: "Jan 31 2023"
previewImg: "/images/blog/h_14_clip_front.png"
---

Today we release a KNN index for LAION-5B that allows for fast queries of the dataset with the open clip ViT-H-14 CLIP model. This means that users can search through billions of samples quickly and easily, making it a powerful tool for various applications such as image and text retrieval, data filtering and more. With this update also comes a brand new SLURM based inference backend for high-compute environments.

With this users can now:
  - Peer into the superset of data used to train the latest stable-diffusion-v2 models.
  - Easily filter through the dataset to create fine-tuning datasets and averaged embeddings for aesthetic gradients.
  - Quickly compute indices for new datasets with the SLURM backend.
  - Download the index & deploy locally

## The front-end

Our new H/14 index is now available for use on our clip-front demo at https://rom1504.github.io/clip-retrieval or https://knn.laion.ai. 
This new index allows for fast querying using both images and text, making it a valuable tool for a variety of use cases.
To start using the new index right away, simply visit the website and start experimenting with the available query options. 
The demo also allows you to easily download the resulting query as an [img2dataset](https://github.com/rom1504/img2dataset) compatible json file. 
This means that you can quickly create datasets for any use case, making it a valuable resource for creatives, data scientists and researchers alike.

## Using the KNN as an API

The KNN index can be accessed via the API, which allows you to perform nearest-neighbor searches in an easy and intuitive way. 
However, if you would prefer to use the provided knn index programmatically, you can! 
We have a notebook that you can use as a guide on how to do so. You can find the notebook [here](https://colab.research.google.com/github/rom1504/clip-retrieval/blob/master/notebook/clip-retrieval-getting-started.ipynb), it will walk you through the steps necessary to use the provided KNN index programmatically. 
This can be useful if you want to integrate the KNN index into your own application or if you want to automate the process of nearest-neighbor searches. 
Note that if you are looking to integrate the index into your own product, you should deploy it locally.

## Computing your own index

Creating your own index is a great way to interact with and visualize your data. 
With a custom CLIP embedding index you can quickly search for similar images, check what images your prompts summon, or check how unique a generated image may be to the training data.

The clip-retrieval repo offers the ability for users to compute their own indices for their own datasets. 
In an effort to support the creation of our new H-14 index, we added support for SLURM as a backend inference engine. 
This update adds a third option for computing indices meaning whether you are using SLURM, PySpark, or running it on your local machine, the process of creating a CLIP KNN index has never been easier. 
For specific usage please see the project’s [README](https://github.com/rom1504/clip-retrieval#clip-inference) for the inference API and the newest arguments available for creating your own index.

## Deploying Locally

Users who would like to do a lot of queries, or integrate the index into their own product, should download the index and metadata and deploy it locally to their own server. 
In order to do so we have uploaded the pre-computed indices to huggingface which can be found [here](https://huggingface.co/datasets/laion/laion5b-h14-index). 
For full documentation on the exact steps necessary to begin hosting the index yourself please visit the [clip-retrieval docs](https://github.com/rom1504/clip-retrieval/blob/main/docs/laion5B_h14_back.md).
