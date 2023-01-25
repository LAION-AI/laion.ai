---
title: "LAION-400-MILLION OPEN DATASET"
author: "Christoph Schuhmann"
date: "Aug 20, 2021"
previewImg: "/images/blog/500m.png"
---

We present LAION-400M: 400M English (image, text) pairs - see also our [Data Centric AI NeurIPS Workshop 2021 paper](https://arxiv.org/abs/2111.02114)

## Concept and Content

The LAION-400M dataset is entirely openly, freely accessible.

**WARNING**: be aware that this large-scale dataset is non-curated. It was built for research purposes to enable testing model training on larger scale for broad researcher and other interested communities, and is **not** meant for any real-world production or application.

We have filtered all images and texts in the LAION-400M dataset with OpenAI‘s [CLIP](https://openai.com/blog/clip/) by calculating the cosine similarity between the text and image embeddings and dropping those with a similarity below 0.3. The threshold of 0.3 had been determined through human evaluations and seemed to be a good heuristic for estimating semantic image-text-content matching.

The image-text-pairs have been extracted from the [Common Crawl](https://commoncrawl.org/) web data dump and are from random web pages crawled between 2014 and 2021.

### Download Information

###### UPDATE 16 dec 2021

While **the eye** experiences technical difficulties, we provide an alternate download server for this dataset at this link: [laion400m at deploy.laion.ai](http://deploy.laion.ai/8f83b608504d46bb81708ec86e912220/)

###### Original information

You can find

- The CLIP image embeddings (NumPy files)
- The parquet files
- KNN index of image embeddings

To download from **the eye**, run this command

`aria2c "https://the-eye.eu/public/AI/cah/laion400m-met-release.torrent"`

You may want to use the `–show-files` and `–select-file` options to download only some files.

You can also find the files in [laion400m-met-release](https://the-eye.eu/public/AI/cah/laion400m-met-release/)

Some more significant knn indices are present in [laion400m-indexes](https://the-eye.eu/public/AI/cah/laion400m-indexes/). We advise using the 128GB ones.

The parquet files in Kaggle: [laion400m on Kaggle](https://www.kaggle.com/romainbeaumont/laion400m)

After downloading the metadata as indicated above, you can run [this command](https://github.com/rom1504/laion-prepro/blob/main/laion400m/download_images/download_images.sh) to download the images and generate the webdataset files (command using [img2dataset](https://github.com/rom1504/img2dataset) )

### LAION-400M Dataset Statistics

The LAION-400M and future even bigger ones are, in fact, datasets of datasets. For instance, we can filter it out by image sizes into smaller datasets like this:

```
Number of unique samples 413M
Number with height or width >= 1024 26M
Number with height and width >= 1024 9.6M
Number with height or width >= 512 112M
Number with height and width >= 512 67M
Number with height or width >= 256 268M
Number with height and width >= 256 211M
```

By using the KNN index, we can extract specialized datasets by domains of interest. They are (or will be) sufficient in size to train technical domain models.

Also, use [https://rom1504.github.io/clip-retrieval/](https://rom1504.github.io/clip-retrieval/) for simple visualisation of the dataset. There you can search among the dataset using CLIP and a knn index.

### Disclaimer & Content Warning

Our filtering protocol only removed NSFW images detected as illegal, but the dataset still has NSFW content accordingly marked in the metadata. When freely navigating through the dataset, keep in mind that it is a large-scale, **non-curated** set crawled from the internet for research purposes, such that collected links may lead to discomforting and disturbing content. Therefore, please use the demo links with **caution**. You can extract a “safe” subset by filtering out samples drawn with NSFW or via stricter CLIP filtering.

There is a certain degree of duplication because we used URL+text as deduplication criteria. The same image with the same caption may sit at different URLs, causing duplicates. The same image with other captions is not, however, considered duplicated.

Using KNN clustering should make it easy to further deduplicate by image content.

### LAION-400M Open Dataset structure

We produced the dataset in several formats to address the various use cases:

- a 50GB url+caption metadata dataset in parquet files. We can use the metadata to compute statistics and redownload part of the dataset
- a 10TB webdataset with 256×256 images, captions and metadata. It is a full version of the dataset that can be used directly for training (this one is for internal use, you need to redownload images yourself due to licensing issues)
- a 1TB set of the 400M text and image clip embeddings, useful to rebuild new knn indices
- pairs of 16G, 32G, 64G and 128G knn indices (running in the web demo)

#### URL and caption metadata dataset.

We provide 32 parquet files of size around 1GB (total 50GB) with the image URLs, the associated texts and additional metadata in the following format:

> SAMPLE_ID | URL | TEXT | LICENSE | NSFW | similarity | WIDTH | HEIGHT

where

- **SAMPLE_ID**: A unique identifier
- **LICENSE**: Where we found a Creative Commons License in the image data, we named it here like, e.g. “creativecommons.org/licenses/by-nc-sa/3.0/” – otherwise you’ll find it here a “?”
- **NSFW**: we used CLIP to estimate if the image has NSFW content. The estimation has been pretty conservative, reducing false negatives at the cost of more false positives. Possible values are “UNLIKELY”, “UNSURE” and “NSFW”.
- **similarity**: Value of the cosine similarity between the text and image embedding
- WIDTH and HEIGHT: image size as the image was embedded. We downsized originals that were larger than 4K to 4K.

This metadata dataset purpose is to download the images for the whole dataset or a subset of it by supplying it to the very efficient [img2dataset](https://github.com/rom1504/img2dataset) tool.

#### 10 TB webdataset with images and captions

By running the img2dataset tool, we can download a 10TB webdataset. It will resize all images at 256×256 resolution, will append the corresponding caption and will generate a collection of tar files (that dataset format is called webdataset) containing images, captions, and metadata and related parquet files containing the same metadata

- 00000.tar of size 270MB containing at most 10k samples
  - 0.jpg
  - 0.txt containing the caption
  - 0.json containing metadata such as the URL, the original width, the EXIF data, whether the image is NSFW
- 00000.parquet of size 1.6MB containing the same metadata as the JSON file. Useful to compute statistics without reading all the tar files

The 400M dataset will therefore have 41455 tar and 41455 parquet files. This dataset purpose is to train multimodal models like CLIP or DALL-E.

#### 1TB of clip embeddings

The clip embeddings are stored in NPY files next to parquet files in the same order. Since this dataset is much smaller than image one, each NPY file stores 1M samples. Each NPY file is 1GB, and each parquet file is 150MB. There are a total of 400 such files. The embeddings purpose is to compute statistics on the dataset, for example, using clustering or knn indices.

#### Two small 6GB knn indices

We provide two 6GB knn indices built using the [autofaiss](https://github.com/criteo/autofaiss). We can use them to compute a subset of the dataset and, more generally, to search among it efficiently. See the search [web demo](https://rom1504.github.io/clip-retrieval/) of it. We can use the CLIP filter tool along with this index to produce subsets using search terms efficiently. We also provide two 16GB knn indices of higher quality.

### What can we do with the LAION-400M dataset?

Vision and language modelling has been taking off in 2021. Here are some pointers about what this kind of image + text datasets unlocks and why it seems interesting:

- Six months ago, OpenAI released two blog posts and papers, [CLIP](https://openai.com/blog/clip/) and [DALL-E](https://openai.com/blog/dall-e/). Both models rely on a large amount of (text, image) pairs. They used an unreleased 400M pairs dataset.
  - CLIP is a model that computes how related are a text and an image. It makes it possible to build large text to image search, and it makes it possible to create that kind of crazy text to image art [clip-art](https://ml.berkeley.edu/blog/blog/clip-art/). They released a small and medium version of the model but no training code.
  - DALL-E is a model that directly generates images from texts. As can be seen from the blog post, it achieves awe-inspiring results that could directly impact the world for anything that needs drawing and illustrations. OpenAI did not release any model, even through an API

Since then, various researchers have organised several efforts to replicate DALL-E. People gathered initially around this excellent DALLE replication repository [DALLE-PyTorch](https://github.com/lucidrains/DALLE-pytorch) with some fantastic results visible in the readme. More recently, as part of huggingface events, new developments have been achieved (see [DALLE-mini report](https://wandb.ai/dalle-mini/dalle-mini/reports/DALL-E-mini--Vmlldzo4NjIxODA) ), and an online demo is now available at [DALLE-mini demo.](https://huggingface.co/spaces/flax-community/dalle-mini)

The replication effort is still far from achieving the same performance as the original DALLE, and it seems possible to go even further. Some people also want to make a better CLIP to produce even better-generated art.

A large part of the results that we can achieve with such models is thanks to a large amount of data. Before LAION-400M, the largest open dataset for (image, text) pairs are in the order of 10M (see [DALLE-datasets](https://github.com/robvanvolt/DALLE-datasets) ), which is enough to train exciting models but not enough to reach the best performance. Having a public dataset with hundreds of millions of pairs will help build these image+text models.

### Analysis of the LAION-400M data

We annotated 3456 samples of the dataset and got the following results:

- Correct positive NSFW: 4
- Correct negative NSFW: 3371
- False-positive NSFW: 73
- False-negative NSFW: 8
- Bad captions: 3 (0.09 %)

The matching is excellent, thanks to CLIP. We could improve the NSFW automatic tagging in the future; however, the NSFW total rate is low enough (less than 1%) to make this not an issue.

## Technical Details

The dataset acquisition has into two significant parts:

1.  a distributed processing of the vast (many PBs) Common Crawl datasets, which produces a collection of matching URL and caption
2.  a single node much lighter post-processing of the data that anyone can run in a few days and which produces the final dataset

### 1. Distributed processing of Common Crawl

We acquire the raw web data for the creation of our dataset from Common Crawl. Common Crawl is a non-profit organisation dedicated to providing a copy of the internet to internet researchers, companies, and individuals at no cost for research and analysis. They regularly release dumps of HTML-like data parsed from billions of public websites found [on the Common Crawl website](https://commoncrawl.org/the-data/get-started/). To create image-text pairs, we parse through the data from Common Crawl and parse out all HTML IMG tags containing an [alt text attribute](https://en.wikipedia.org/wiki/Alt_attribute). Common Crawl provides its data in several formats. For our purpose, we chose to use the data in the WAT format. The WAT files contain only the metadata of the crawled sites, which includes all links and IMG tags contained in the website. Parsing only this metadata is much faster than parsing the whole HTML text (provided in the WARC format).

#### Downloading original images

We download the raw images from the URLs we parsed from Common Crawl with asynchronous requests using the libraries [Trio](https://github.com/python-trio/trio) and [Asks](https://github.com/theelous3/asks). They allow us to go multithreading for a single CPU. Usually, a home internet link will be exhausted by a single or two CPUs. A data centre node can scale up benefits from guaranteed internet speed with a multiprocessing pool much faster than a single CPU node. At this time, we were able to use 50 cores with a full, secured 1Gbps connection to the public internet. This bandwidth must be available to the downloading node, not shared among many nodes or apps. We have optimised the script for speed while mitigating various errors we encountered. Usually, to satisfy a high-end demanding node such as above, we must take additional steps to provide DNS caching capabilities. We found that the knot-resolver ran with two processes and configured with caching option can solve this problem.

#### Filtering out unsuitable image-text pairs

After downloading the WAT files from Common Crawl, we filter the samples in the following steps:

1.  We dropped all samples with less than five character alt text length
2.  We dropped all samples with less than 5 KB image size
3.  We use continuously updated bloom filters to drop samples that are already in our dataset. The bloom filters deduplicate by concatenating the URL and the alt text.
4.  We use continuously updated bloom filters to drop samples from URLs that had timed out previously and therefore seem unreachable (or at least not reachable in an efficient way)
5.  We use OpenAI’s CLIP model (the ‘_ViT-B-32_‘ version) to compute the image and alt text embeddings. Then we calculate the cosine similarity of both embedding vectors and drop all samples with a similarity below 0.3. We chose this threshold after trying different values and using human evaluations of how well the texts fit the images. Lower values like 0.28 or 0.29 also seemed okay in many cases, but after further inspections, we decided to choose the conservative value of 0.3.
6.  We use the CLIP embeddings of the images to estimate if their contents contain NSFW content. We do this by calculating CLIP embeddings for a list of image categories like, e.g. “selfie”, “illustration”, or “landscape”, which also contains categories that indicate NSFW content like “porn” and “sex”.
7.  Then we compute the cosine similarities between the embedding image we are currently filtering and each of these category keywords. If the category with the highest similarity and the keyword with the second-highest similarity belong both to NSFW keywords, we tag the sample as “NSFW”. If only one of them belongs to an NSFW keyword, we categorise the sample as “UNSURE”. If both keywords with the highest similarities are not NSFW, we tag the sample as “UNLIKELY”.
8.  In the next step, we look at all samples with either the “NSFW” or “UNSURE” tag and drop those with any keywords in their text related to kids, teens, or other semantically related content.
9.  In step 8, we repeat the procedure of computing the cosine similarities from step 6 with the difference that we now use category texts that indicate contents semantically related to kids and teens on a CLIP embedding level. If either the highest similarity or the second-highest similarity between a sample’s image embedding and a text of the precomputed categories belongs to a text that indicates content related to under-aged persons, we drop this sample.
10. Finally, we repeat the procedure from step 8 with texts semantically related to animal categories like e.g. “animal”, “bird”, etc.

We perform these rigorous filtering steps for NSFW with potentially illegal content because we cannot guarantee that the contents of Common Crawl are free of such. We feel obligated to try our best to filter out such content. Inspections of samples filtered out by steps 7 to 9 have shown that our filtering procedure is very conservative and produces many false positives (samples it drops, which are not problematic). This process is okay because the number of potential samples waiting for us to crawl is vast.

#### System Architecture

To orchestrate the interactions of the many crawling scripts (called _workers_) in our project, we use a server that keeps track of processed WAT files and of which worker gets which unprocessed WAT. We call this orchestrating server a _tracker_. Its functions are offering jobs to both download workers and inference workers, confirming cleanup requests from the DL staging server, maintaining ACLs for the Bloom server, and some more. We also employ several staging servers as buffers for jobs on their way to the storage location. The staging servers continuously update filters in the central bloom server where we use RedisBloom for high-performance reasons.![](https://i.imgur.com/kxl4jJe.png)

#### Workflow

During the evolution of our crawling project, we applied two different workflows:

##### Workflow 1 (_“Hybrid”_ – workers)

This worker performs all computation steps during one job and then submits the result to the staging server. It then queues the results for release to the storage area.

##### Workflow 2 (_“CPU – GPU – 2 stages”_ – workflow)

We soon discovered that the best way to utilise resources is to split the workload into CPU + networking tasks (downloading steps) and GPU tasks (CLIP inference steps). Hence, the 2 stage approach uses “CPU workers” to download images, create image-text pairs, and save the intermediate result to a staging server. Then “GPU workers” pick up jobs, concatenate a number of them to group around 20000 pairs per final result file. The 2 stage workflow proved to be most efficient, with speeds up to 25 million pairs added to the dataset per day when using 100 CPU workers with one core and one GPU worker employing an NVidia RTX 3090 graphic card utilising all 16 lanes of PCIe bus. The GPU node also needs about CPU 24 threads to keep up with the GPU processing capacity.

#### Removing abuse alerts

During downloading, we encountered abuse alerts from manual and automated tools that protect websites. After some learning curve, we reduced most of the issues by employing these mitigation techniques:

- By far, the most efficient one was to use centralised bloom filters that eliminate requests going to the duplicate URLs over and over. Of course, the efficiency of these filters dramatically depends on how fast they are updated and used by the workers. By definition, having multiple downloading workers performing jobs in parallel makes them prone to overlap requests to the same URL even if the bloom filters are up to date at the beginning of the job.
- Therefore the second technique significantly reduced the problem of parallel workers via randomising the jobs at the tracker server level. While executing jobs in sequence (with the oldest WAT files from 2013), we discovered that adjacent jobs were overlapping considerably. When we randomised jobs, we saw a dramatic decrease in such overlapping.

#### Who ran this?

We want to thank :

- the [LAION folks](https://laion.ai/#team), via so many worker nodes everywhere in the cloud
- [the data hoarders](https://www.reddit.com/r/DataHoarder/comments/oyta8q/crawlinghome_help_build_the_worlds_largest/) Reddit community
- [the-eye](https://the-eye.eu/) community
- as well as all our friends and relatives that did not know what they were helping with

for running the workers to produce this vast dataset in a few months.

### 2. Post-processing of the dataset

Once the distributed pipeline has run, resulting in a sizeable caption+url dataset, it’s time to package it in the best way. The objective of this second pipeline is to produce a version of the dataset that is easy to use for multimodal training. For this, we built tools that anyone can run out of a collection of caption+url. The exact command line to run is available in [cah-prepro](https://github.com/rom1504/cah-prepro) (which uses mainly [img2dataset](https://github.com/rom1504/img2dataset) and [clip-retrieval](https://github.com/rom1504/clip-retrieval) )

#### Pyspark preprocessing of the CSV files

After a fast run of a script to [download the CSV files,](https://github.com/rom1504/cah-prepro/tree/main/download_csv) the first step of this post-processing pipeline is to do deduplication by url+caption. The first pipeline does some partial deduplication using a bloom filter, but it is approximate, and some duplicates remain. Doing that pyspark post-processing also makes it possible to reduce the number of metadata files from hundred of thousands to 32 parquet files of size 1.7GB. See this [deduplication script there](https://github.com/rom1504/cah-prepro/blob/main/deduplicate/cah_stats_spark.py). Pyspark would be an excellent way to do any further filtering, and we [provide](https://github.com/rom1504/cah-prepro/blob/main/deduplicate/compute_more_stats.py) an example to compute some statistics. The resulting output is 32 parquet files containing columns such as URL, text, NSFW described at the beginning of the post.

#### Img2dataset

Once this set of 50GB parquet files has is ready, we can use the [img2dataset](https://github.com/rom1504/img2dataset) tool to download, resize and store the images and captions as [webdataset](https://github.com/webdataset/webdataset). This tool can download 100M images in 20h in a single node (1Gbps 32GB of ram 16 i7 cores), so anyone can run this for the whole dataset or a smaller subset. The format this tool outputs is a collection of tar files (that dataset format is called webdataset) containing images, captions, and metadata and corresponding parquet files containing the same metadata

- 00000.tar of size 270MB containing at most 10k samples
  - 0.jpg
  - 0.txt containing the caption
  - 0.json containing metadata such as the URL, the original width, the EXIF data, whether the image is NSFW
- 00000.parquet of size 1.6MB containing the same metadata as the JSON file. Useful to compute statistics without reading all the tar files

The size of the tars of 270MB is when using the options of img2dataset indicated there [download_images.sh](https://github.com/rom1504/cah-prepro/blob/main/download_images/download_images.sh) (resizing all images to 256×256 with padding for maximum file uniformity and avoid losing information). If using different options, you may have larger or smaller tar files.

#### Clip retrieval and autofaiss

Finally, the tar dataset aims to compute and package clip embeddings and compute a KNN index over the clip embeddings. The [clip-retrieval](https://github.com/rom1504/clip-retrieval/) tool makes it fast to compute 100M embeddings per 20h with a single 3080 GPU, so it’s possible to rerun this part on the whole dataset or a subset at a low cost. The embeddings are stored in NPY files next to parquet files in the same order. Since this dataset is much smaller than image one, each NPY file stores 1M samples. NPY files are 1GB in size, and parquet files are 150MB. There are a total of 400 such files. These embeddings help build text and an image knn index using the [autofaiss](https://github.com/criteo/autofaiss) tool, making it possible to produce a quantised index of an arbitrary file. The chosen index type is 6GB, so it’s cheap for anyone to load and run fast (10ms) queries over the whole dataset. We also generated another kind of index of size 16GB. Thanks to memory mapping, it’s also possible to load it at no ram usage. A simple [web demo](https://rom1504.github.io/clip-retrieval/) shows the results.

![](https://i.imgur.com/6bEztg9.png)

### License

We distribute the metadata dataset (the parquet files) under the most open [Creative Common CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/) license, which poses no particular restriction. The images are under their copyright.

## Contributing

You can contribute to the project to help us release the following dataset sizes at 1 billion pairs, 2 billion pairs and so on.

Choose one or more methods that suit you or your company:

1.  donate either [cash](https://laion.ai/laion-400-open-dataset/#) or [computing time](https://laion.ai/how-to-donate-computing-time/). We also launched a [Go Get Funding campaign](https://gogetfunding.com/help-us-build-the-worlds-largest-open-billion-scale-image-text-dataset-perfect-for-training-dall-e-clip-other-multimodal-models/).
2.  participate in the development effort
3.  spread the word. At best, use the dataset, get nice results and mention it in your papers

Useful links:

- Dataset progress [Crawling@Home Dashboard](http://crawling.at/) and [leaderboard](http://crawling.at/leaderboard)
- Reddit [post](https://www.reddit.com/r/DataHoarder/comments/oyta8q/crawlinghome_help_build_the_worlds_largest/?utm_source=share&utm_medium=web2x&context=3)
- DALLE-PyTorch [Discord server](https://discord.gg/mVcgxMPD7e)
- DALLE-PyTorch [GitHub Repository](https://github.com/lucidrains/DALLE-pytorch)

[  
](https://laion.ai/laion-5b-a-new-era-of-open-large-scale-multi-modal-datasets/)

### Sponsors

We made it so far due to the generosity of these donors:
| ![](https://i.imgur.com/z6K7kSq.png) |![](https://i.imgur.com/KYvncYl.png)|![](https://i.imgur.com/y2yNLm8.png)|
|--|--|--|
|[doodlebot.ai](http://doodlebot.ai/)|[Gentec Data](https://gentec.ro/)|[the-eye.eu](http://the-eye.eu/)|
