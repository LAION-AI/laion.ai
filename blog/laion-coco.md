---
title: "Laion coco: 600M synthetic captions from Laion2B-en"
author: "Christoph, Andreas, Richard, Theo, Romain"
date: "Sep 15, 2022"
previewImg: "/images/blog/aerial.png"
---

Laion5B introduced 5 billion image and text pairs. These pairs were selected to match well thanks to CLIP. However, a question remained: can we produce better captions for the images?

[BLIP](https://github.com/salesforce/BLIP) model is great for captioning images, and the paper showed that training clip-like models on captioned images may produce better results than human written captions.

To investigate the question of the value of synthetic datasets, we captioned 600M images from Laion2B using BLIP, and we release them openly today.

The captions were selected to match the style of caption of the COCO dataset, and we hence name our dataset laion-coco.

Also check out [Christoph video](https://youtu.be/t1G5FNgvtbQ)  on laion coco.


## Download it

600M samples in parquet files. Columns include the original caption, the url, the top caption and a list of alternative captions.

[https://huggingface.co/datasets/laion/laion-coco](https://huggingface.co/datasets/laion/laion-coco) 


## Method

The [method](https://github.com/andreaskoepf/laion_idle_cap) we used to generate these captions was to

1. Use blip to generate 40 captions
2. Rank them using openai clip L/14 ; selected the best 5 captions
3. Rank using RN50x64 clip model to select the best one
4. Use a T0 model to repair the text

The hyperparameters were chosen by Andreas to best [match](https://youtu.be/t1G5FNgvtbQ) the coco caption style.


## Evaluation

We evaluated these generated captions by asking human evaluator to say whether a caption is coming from an human or a model. We observe these results : 

% samples rated as Human, that actually were AI

0.45

% samples rated as AI, that actually were Human

0.47



![eval_laion_coco](/images/blog/eval_laion_coco.png "eval_laion_coco")


[Full evaluations](https://docs.google.com/document/d/1nfOOW9XtCi0m4760EgC8flaPV8r5odRvQcw03PRx52s/edit) 

These evaluations helped select the best hyper parameters.

[Example of captions](http://captions.christoph-schuhmann.de/eval_laion/eval.html) 

[Christoph video explaining the same](https://youtu.be/t1G5FNgvtbQ)  


## Example samples

These few samples can give an intuition on what is in the dataset. Original captions usually contain a lot more tags. Generated captions are a nicer english descriptions of the images.



![ring](/images/blog/ring.png "ring")


**Original:**LGSY 925 Sterling Silver Double Heart Rings Infinity Love Thin Rings Wedding Engagement Promise Engraved Love Rings for Women for Dainty Gift

**Generated:**An open ring with two hearts on it.



![boot](/images/blog/boot.png "boot")


**Original: **Female Thick with Pointy Head High Heel Chelsea Ankle Boots

**Generated:** Red leather ankle boots with gold buckles.



![aerial](/images/blog/aerial.png "aerial")


**Original: **Pea fields along Spiti River near Rangrik village in Himachal Pradesh.

**Generated:** An aerial view of a river and fields.

                                                                                                                                        

![sheeple](/images/blog/sheeple.png "sheeple")


**Original: **sheeple family

**Generated:** A cartoon drawing of sheep watching TV with their babies.


## Credit assignments

* [Christoph](https://github.com/christophschuhmann) lead the project and ran most of the generation
* [Andreas](https://github.com/andreaskoepf) built the BLIP integration
* [Richard](https://github.com/rvencu/) provided the infra structure to use the idle compute for this project
* [Theo](https://github.com/TheoCoombes) ran the tracker
* [Romain](https://github.com/rom1504) packaged the .json into parquet files, sent to HF and wrote this post

We thank stability.ai for providing the compute used to generate these captions.
