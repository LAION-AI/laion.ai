---
title: "Laion translated: 3B captions translated to English from laion5B"
author: "Marianna Nezhurina, Romain Beaumont, Richard Vencu and Christoph Schuhmann"
date: "Sep 15, 2022"
previewImg: "/images/blog/laion-translated-samples.png"
---

Author: [Marianna Nezhurina](https://github.com/marianna13) [Romain Beaumont](https://github.com/rom1504/) [Richard Vencu](https://github.com/rvencu) [Christoph Schuhmann](https://github.com/christophschuhmann)  

Laion5B dataset was automatically collected from a section of the human web (common crawl). Can models generate different and interesting data compared to what humans write?

That’s a question we are interested in investigating. To let the community study it, we translated 3B samples of Laion5B from many languages into English.

We released 3 billions captions for the multilingual part of Laion5B. This makes it possible to use the whole Laion5B dataset to train English models. This also enables training models using these aligned pairs such as [Multilingual-CLIP](https://github.com/FreddeFrallan/Multilingual-CLIP).

We’re curious what you will do using it!


## Downloading it

The dataset is available in huggingface as parquet files containing the caption, translated caption and urls.

[laion1B-nolang-joined-translated-to-en](https://huggingface.co/datasets/laion/laion1B-nolang-joined-translated-to-en) 

[laion2B-multi-joined-translated-to-en](https://huggingface.co/datasets/laion/laion2B-multi-joined-translated-to-en)  


## Processing

Every caption of the original dataset was translated with Facebook’s [M2M100 1.2B model](https://huggingface.co/facebook/m2m100_1.2B) using the following [script](https://github.com/marianna13/translate_dataset/blob/main/translate_data.py). All other fields remain the same as in the original [LAION2B Multi Joined](https://huggingface.co/datasets/laion/laion2B-multi-joined). To make translation possible the original dataset was split into parts with 50k samples in each and every such small part was translated in parallel on GPU nodes and saved in a separate parquet file. The speed of translation depends on the number of nodes and GPUs. The processing was done with 20 nodes with 8 GPUs in each and the speed of translation (including preprocessing and data loading) is 34 samples/per GPU/per second. Then, all translated parquets were [merged together using Spark](https://github.com/marianna13/translate_dataset/blob/main/join_additional.py) and saved as 128 parquet files. The resulting dataset was [joined with the aesthetics scores](https://github.com/marianna13/translate_dataset/blob/main/join_aesthetics.py). 


## Dataset columns



* TEXT (the original text of caption)
* LANGUAGE (language of the original TEXT)
* ENG TEXT (translation in English of the original TEXT)
* URL (URL of the image)
* WIDTH (width of the image)
* HEIGHT (height of the image)
* Hash (hash of the URL and TEXT)
* Pwatermark (probability of being a watermarked image, computed using our [watermark detector](https://github.com/LAION-AI/LAION-5B-WatermarkDetection))
* Punsafe (probability of being an unsafe image, computed using our [clip based detector](https://github.com/LAION-AI/CLIP-based-NSFW-Detector))
* Similarity (cosine between text and image ViT-B/32 embeddings, clip for en, mclip for multi and nolang)
* Prediction (aesthetics score)


## Samples from the translated dataset:


![laion-2B-translated-samples](/images/blog/laion-translated-samples.png "laion-2B-translated-samples")



## Laion2B-multi-translated


### Dataset stats

_Note. Dataset stats were computed using [this](https://github.com/marianna13/translate_dataset/blob/main/get_dataset_stats.py) script._

Number of uniques 2266M (2266193302)                                            

Number with WIDTH >= 0 and WIDTH &lt;= 128 160M (160260569)                        

Number with WIDTH >= 128 and WIDTH &lt;= 256 734M (734166164)                      

Number with WIDTH >= 256 and WIDTH &lt;= 512 849M (849569769)                      

Number with WIDTH >= 512 and WIDTH &lt;= 1024 457M (457572747)                     

Number with WIDTH >= 1024 86M (86750813)                                        

Number with HEIGHT >= 0 and HEIGHT &lt;= 128 103M (103514467)                      

Number with HEIGHT >= 128 and HEIGHT &lt;= 256 614M (614490681)                    

Number with HEIGHT >= 256 and HEIGHT &lt;= 512 753M (753540968)                    

Number with HEIGHT >= 512 and HEIGHT &lt;= 1024 686M (686553437)                   

Number with HEIGHT >= 1024 153M (153139456)                                     

Number with lenengtext >= 0 and lenengtext &lt;= 25 506M (506238532)               

Number with lenengtext >= 25 and lenengtext &lt;= 50 849M (849160165)              

Number with lenengtext >= 50 and lenengtext &lt;= 100 840M (840635023)             

Number with lenengtext >= 100 and lenengtext &lt;= 150 136M (136709119)            

Number with lenengtext >= 150 5M (5148507)


### Similarities between text and images

10000 images and captions were sampled from the dataset, [CLIP embeddings were computed](https://github.com/marianna13/translate_dataset/blob/main/get_clip_embs_similarities.py) (for original texts embeddings were computed using Multilingual CLIP). Then dot products between image and text embeddings were computed (for both original and translated dataset) to get similarities between texts and images. Here’s the distribution of average similarities for two datasets:

Similarity for original dataset:

10% quantile -  0.2552971839904785

20% quantile -  0.2633610963821411

30% quantile -  0.2694466710090637

40% quantile -  0.2750270366668701

50% quantile -  0.28088638186454773

60% quantile -  0.28750720620155334

70% quantile -  0.2950591444969177

80% quantile -  0.3049575388431549

90% quantile -  0.32077282667160034

Similarity for translated dataset:

10% quantile  -  0.23388671875

20% quantile  -  0.25390625

30% quantile  -  0.265869140625

40% quantile  -  0.2763671875

50% quantile  -  0.2861328125

60% quantile  -  0.29638671875

70% quantile  -  0.306884765625

80% quantile  -  0.31982421875

90% quantile  -  0.338134765625



![laion-2B-translated](/images/blog/laion-2B-translated.png "laion-2B-translated")



## Laion1B-nolang-translated

[LAION1B Nolang Joined](https://huggingface.co/datasets/laion/laion1B-nolang-joined) dataset was also translated with a similar [script](https://github.com/marianna13/translate_dataset/tree/main) and in the same way as Multi. This dataset doesn’t have the language column so the model also had to determine language. All other columns in the Nolang dataset are the same as in Multi. And just like translated [LAION2B Multi Joined](https://huggingface.co/datasets/laion/laion2B-multi-joined), LAION1B Nolang was also joined with corresponding [aesthetics scores](https://github.com/marianna13/translate_dataset/blob/main/join_aesthetics.py).


### Nolang dataset Stats

Number of uniques 1260M (1260048307)                                            

Number with WIDTH >= 0 and WIDTH &lt;= 128 90M (90701133)                          

Number with WIDTH >= 128 and WIDTH &lt;= 256 409M (409575445)                      

Number with WIDTH >= 256 and WIDTH &lt;= 512 475M (475885337)                      

Number with WIDTH >= 512 and WIDTH &lt;= 1024 239M (239035772)                     

Number with WIDTH >= 1024 59M (59942110)                                        

Number with HEIGHT >= 0 and HEIGHT &lt;= 128 59M (59814914)                        

Number with HEIGHT >= 128 and HEIGHT &lt;= 256 370M (370913206)                    

Number with HEIGHT >= 256 and HEIGHT &lt;= 512 451M (451897702)                    

Number with HEIGHT >= 512 and HEIGHT &lt;= 1024 316M (316723245)                   

Number with HEIGHT >= 1024 87M (87671543)                                       

Number with lenengtext >= 0 and lenengtext &lt;= 25 312M (312548202)               

Number with lenengtext >= 25 and lenengtext &lt;= 50 555M (555971621)              

Number with lenengtext >= 50 and lenengtext &lt;= 100 413M (413430230)             

Number with lenengtext >= 100 and lenengtext &lt;= 150 20M (20446701)              

Number with lenengtext >= 150 0M (138974)  


### Similarities between text and images for Nolang

10000 images and captions were randomly sampled from the dataset, [CLIP embeddings were computed](https://github.com/marianna13/translate_dataset/blob/main/get_clip_embs_similarities.py) (for original texts embeddings were computed using Multilingual CLIP). Then dot products between image and text embeddings were computed (for both original and translated dataset) to get similarities between texts and images. Here’s the distribution of average similarities for two datasets:

Similarity for original dataset:

10% quantile  -  0.258196085691452

20% quantile  -  0.266357421875

30% quantile  -  0.2728866934776306

40% quantile  -  0.27902457118034363

50% quantile  -  0.28590404987335205

60% quantile  -  0.29329144954681396

70% quantile  -  0.3023602366447449

80% quantile  -  0.31363412737846375

90% quantile  -  0.3313804566860199

Similarity for translated dataset:

10% quantile  -  0.2406005859375

20% quantile  -  0.2607421875

30% quantile  -  0.27490234375

40% quantile  -  0.2861328125

50% quantile  -  0.296142578125

60% quantile  -  0.306396484375

70% quantile  -  0.317626953125

80% quantile  -  0.33203125

90% quantile  -  0.353271484375


![laion-1B-translated](/images/blog/laion-1B-translated.png "laion-1B-translated")


## Credit



* [Marianna Nezhurina](https://github.com/marianna13) translated the samples, packaged them, computed stats and wrote most of this post
* [Romain Beaumont](https://github.com/rom1504/) helped out on packaging and scaling
* [Richard Vencu](https://github.com/rvencu) set up all the infra that made using idle compute possible
* [Christoph Schuhmann](https://github.com/christophschuhmann) suggested the project and guided the work to completion

We thank [https://stability.ai/](https://stability.ai/) for providing the compute for this massive translation. This was a great use of pre-emptible jobs to fill any idle compute available!