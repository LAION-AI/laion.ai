---
title: "Large scale openCLIP: L/14, H/14 and g/14 trained on LAION-2B"
author: "Romain Beaumont"
date: "Sep 15, 2022"
previewImg: "/images/blog/compare3.png"
---

We trained three large CLIP models with [OpenCLIP](https://github.com/mlfoundations/open_clip): ViT-L/14, ViT-H/14 and ViT-g/14 (ViT-g/14 was trained only for about a third the epochs compared to the rest). The H/14 model achieves **78.0%** zero shot top-1 accuracy on ImageNet and **73.4%** on zero-shot image retrieval at Recall@5 on MS COCO. As of September 2022, this is the best open source CLIP model.

CLIP makes it possible to compute representations of images and texts to measure how **similar** they are. It can be used for 



* Zero shot classification: compare an image with the text of the class to know which class is most similar (e.g., ImageNet classification)
* Retrieval: compare an image or a text to billions of text or images to find the most similar (e.g. as in [clip-retrieval](https://rom1504.github.io/clip-retrieval/) )
* Generation
    * CLIP guidance: decide a text you want to generate, then use an image generator model, and use the CLIP distance between what’s generated and the text to generate a better image (e.g., VQGAN + CLIP)
    * CLIP conditioning: use a clip text embedding as input of a generator to make it generate this text directly (e.g., stable diffusion)

CLIP models are trained in a self supervised fashion on hundreds of millions or billions of (image, text) pairs.

With LAION, we produced the LAION-5B dataset that contains 5.8 billions of closely related image and text pairs.

The CLIP model ViT B/32, released by OpenAI, was initially used to filter this dataset out of common crawl.

Producing the best open source CLIP model out of this data set completes the open source replication of the [excellent](https://openai.com/blog/clip/) CLIP paper that OpenAI released one year ago.


## Results

We replicated the results from openai CLIP in models of different sizes, then trained bigger models. The full evaluation suite on 39 datasets ([vtab+](https://github.com/LAION-AI/CLIP_benchmark)) are available in this [results notebook](https://github.com/LAION-AI/CLIP_benchmark/blob/main/benchmark/results.ipynb) and show consistent improvements over all datasets.

The larger models we release today are L/14, H/14 and g/14.

L/14 was trained on JUWELS Booster supercomputer by [Ross wightman](https://github.com/rwightman). H/14 and g/14 were trained on stability cluster by [Romain Beaumont](https://github.com/rom1504) . While L/14 and H/14 were trained using 34B samples from LAION-2b, g/14 used a substantially smaller sample scale for training, seeing only 12B samples (see tables for more details).


#### 32B samples seen


| **Model name**                                                                   | **Batch size**                   | **Samples seen**           | **Text Params** | **Image params** | **Imagenet top1** | **Mscoco image retrieval at 5** | **Flickr30k image retrieval at 5** |
|----------------------------------------------------------------------------------|----------------------------------|----------------------------|-----------------|------------------|-------------------|---------------------------------|------------------------------------|
| [B/32](https://wandb.ai/rom1504/eval_openclip/reports/B-32-2B--VmlldzoyNDkwNDMy) | 79k                              | 34B (16 epochs of laion2B) | 63.43M          | 87.85M           | 66.6%             | 65.4%                           | 88.4%                              |
| L/14                                                                             | 79k for 14B samples, 86K for 18B | 32B                        | 123.65M         | 303.97M          | 75.3%             | 71.1%                           | 92.9%                              |
| [H/14](https://wandb.ai/rom1504/eval_openclip/reports/H-14--VmlldzoyNDAxODQ3)    | 79k                              | 32B (16 epochs of laion2B) | 354.03M         | 632.08M          | 78.0%             | 73.4%                           | 94%                                |



#### 12B samples seen


| **Model name**                                                                     | **Batch size**                             | **Samples seen**                        | **Text Params** | **Image params** | **Imagenet top1** | **Mscoco image retrieval at 5** | **Flickr30k image retrieval at 5** |
|------------------------------------------------------------------------------------|--------------------------------------------|-----------------------------------------|-----------------|------------------|-------------------|---------------------------------|------------------------------------|
| B/32                                                                               | 32k                                        | 12B (32 epochs of laion400m)            | 63.43M          | 87.85M           | 62.9%             | 60.8%                           | 85.5%                              |
| B/16                                                                               | 32k                                        | 12B (32 epochs of laion400m)            | 91.16M          | 86.19M           | 69%               | 63.6%                           | 85.5%                              |
| L/14                                                                               | 32k                                        | 12B (32 epochs of laion400m)            | 123.65M         | 303.97M          | 72%               | 68.1%                           | 90.8%                              |
| [g/14](https://wandb.ai/rom1504/eval_openclip/reports/slow-g-14--VmlldzoyNTMwMjg5) | 32k for 8B samples then 64k for 4B samples | 12B (similar to 32 epochs on laion400m) | 354.03M         | 1012.65M         | 76.6%             | 72.4%                           | 93.5%                              |


In addition to having overall better results, we hope the larger text encoder will help improve text understanding. The good performance on the retrieval metrics seems to be a good indicator of this property.

Note the difference in samples seen between the H/14 and the g/14 model. This explains the difference in performance. We picked this lower number to try and fix the stability issue at a lower cost. Eventually they were fixed (by using bfloat16). The performance of this model falls in the scaling curve of 12B sample seen (similar to 32 epochs of laion400m), and a g/14 trained on 32B samples of laion2B would most likely follow the same trends as the other models and get better performance as H/14.

![alt_text](/images/blog/compare3.png "image_tooltip")



## Released checkpoints

We release the checkpoints for the models, they are available through [openclip](https://github.com/mlfoundations/open_clip) and in HuggingFace hub at [B/32](https://huggingface.co/laion/CLIP-ViT-B-32-laion2B-s34B-b79K) [L/14](https://huggingface.co/laion/CLIP-ViT-L-14-laion2B-s32B-b82K) [H/14](https://huggingface.co/laion/CLIP-ViT-H-14-laion2B-s32B-b79K) and [g/14](https://huggingface.co/laion/CLIP-ViT-g-14-laion2B-s12B-b42K)


## Related works

Related work results:


| **Model name** | **Samples seen**       | **Imagenet top1** | **Mscoco image retrieval at 5** | **Flickr30k image retrieval at 5** |
|----------------|------------------------|-------------------|---------------------------------|------------------------------------|
| Openai B/32    | 12B (32 epochs of WIT) | 62%               |                                 |                                    |
| Openai B/16    | 12B (32 epochs of WIT) | 69%               |                                 |                                    |
| Openai L/14    | 12B (32 epochs of WIT) | 75.4%             | 61%                             | 87%                                |
| ALIGN          | 20B                    | 76.4%             | 69.8%                           | 93.3%                              |
| BASIC          | 32B                    | 85.7%             |                                 |                                    |
| CoCa           | 32B                    | 86.3%             | 74.2%                           | 95.7%                              |


[BASIC](https://arxiv.org/abs/2111.10050) and  [ALIGN](https://arxiv.org/abs/2102.05918) got excellent imagenet results. They used either different image encoder architecture (EfficientNet, CoAtNet), a larger network scale (BASIC-L with 2.4B params) or pre trained their network with supervised learning on a large dataset (BASIC CoAtNet vision encoder).

[COCA](https://arxiv.org/abs/2205.01917) additionally used captioning loss during training with a multi-modal text decoder which predicted text tokens autoregressively and got 86.3% top1, employing a larger model scale (2.1B params)


## Scaling up notes

During these training runs, we encountered several interesting issues:



* Using many GPUs means many of them can have hardware issues and can freeze, crash or even just be slow. This is a particularly annoying problem to handle as if one GPU has an issue, the synchronized nature of distributed training means that all GPUs get stuck. I created [https://github.com/rom1504/gpu-tester](https://github.com/rom1504/gpu-tester) to figure out what are the bad GPUs and exclude them
* Stability issues! When scaling up the model size, the batch size and the dataset size, at around half the training the loss starts increasing until it reaches a plateau. We tried many possible things (find the list [there](https://docs.google.com/document/d/1EFbMLRWSSV0LUf9Du1pWzWqgeiIRPwEWX2s1C6mAk5c/edit)) and eventually concluded on a surprisingly simple solution: **using amp bfloat16 instead of amp float16 made the training fully stable**

And also made some discoveries:



* It seems using a very large batch size (up to 159k) can help reach even higher performance. This is most likely due to the fact that contrastive learning provides information to the loss as a logit matrix, hence having N times more samples in a batch means N square logits. We did not verify this systematically but BASIC paper provides more experiments and a theoretical justification for this result.
* It’s possible to get a reasonably performing g/14 CLIP by doing a much shorter cosine decay => getting a 68% g/14 in 10k gpu hours.
* Grad checkpointing allows to do 10x on the batch size


### Training stability issues

Stability of training was the main problem we solved in this iteration of the scaling up of OpenCLIP. At around half the training (for L/14, H/14 and g/14), the loss started going up until it plateaued very high (11) and didn’t go down anymore.

We tried many possible fixes (decreasing lr, gradient shrinking, gradient clipping, cosine attention, post layer norm, …) with little to no effect when trying to resume from before the crash. 

Eventually only 2 things worked:



* Finishing the  lr decay very fast : in 8 epochs (compared to the planned 256 epochs). That managed to get most of the performance out of clip H. 
* Switching from float16 to bfloat16 solved the problem while being faster for clip g. We then applied the same fix for clip H and finished its training properly.

[See all the training notes](https://docs.google.com/document/d/1EFbMLRWSSV0LUf9Du1pWzWqgeiIRPwEWX2s1C6mAk5c/edit) with all the details on all the possible ideas that didn’t work.


### Training speeds

To better understand the cost and length of training of clip, we provide these training speed numbers. All numbers assume a100 with 40GB of VRAM. We used gradient checkpointing.

| Model                                                                           | Batch size per gpu | Precision | Number of gpus | Sample per second per gpu |
|---------------------------------------------------------------------------------|--------------------|-----------|----------------|---------------------------|
| [B/32](https://wandb.ai/rom1504/open-clip/runs/rnxrp6k7?workspace=user-rom1504) | 96                 | float16   | 824            | 228                       |
| [H/14](https://wandb.ai/rom1504/open-clip/runs/2zphcgkn?workspace=user-rom1504) | 96                 | float16   | 824            | 30                        |
| [g/14](https://wandb.ai/rom1504/open-clip/runs/21cpomx2?workspace=user-rom1504) | 40                 | float16   | 800            | 20                        |
| [H/14](https://wandb.ai/rom1504/open-clip/runs/3l7ppqh3?workspace=user-rom1504) | 96                 | bfloat16  | 824            | 42                        |
| [g/14](https://wandb.ai/rom1504/open-clip/runs/1pby5fkb?workspace=user-rom1504) | 80                 | bfloat16  | 800            | 31                        |


The speed usually increases with batch size per gpu until a plateau is reached. The speed also increases with the number of gpu. After a certain number of gpus, the curve becomes slower than linear.

Bfloat16 which we used in the second part of training provides both better stability and faster sample/s for clip models.


## What’s next

The models will be used for many applications, including clip guiding and conditioning. Even better results could be reached on models like stable diffusion by using a better clip model!

Now that the scaling properties of clip are proven in an open source reproduction, a lot of doors open. Here are some ideas of next steps:



* Changing the text encoder to work in the multilingual setting (to get a model like [Multilingual-CLIP](https://github.com/FreddeFrallan/Multilingual-CLIP) but trained contrastively, with hopefully even better results!) and scale it up
* Can we get clip models while using less gpu hours ? extracting the knowledge from smaller clips into a bigger one may help bootstrap the learning process (see [encoder-distill](https://github.com/iejMac/encoder-distill) from [iejMac](https://github.com/iejMac) getting some preliminary results on this)  
* The clip idea can be expanded to other modalities, see [CLAP](https://github.com/LAION-AI/CLAP) for text-audio alignment

If you have ideas or want to help out, feel free to reach out in laion server.


## Contributions

Thanks to



* [Romain Beaumont](https://github.com/rom1504) for running the experiments on H/14 and g/14
* [Ross Wightman](https://github.com/rwightman) for conducting all the openclip experiments at JUWELS Booster (Juelich Supercomputing Center) up to L/14 and providing valuable feedback during these H and g clip trainings
* [Phil Wang](https://github.com/lucidrains) for providing ideas and code (cosine attention, post layer norm, ..) during the stability issues
* [Boris Dayma](https://github.com/borisdayma) and [Mitchell Wortsman](https://mitchellnw.github.io/) for both proposing to try float32 that showed precision was an issue and eventually lead to trying bfloat16
* [Blinkdl](https://github.com/Blinkdl) for proposing interesting ideas regarding tuning the learning rate
* [Christoph Schuhmann](https://github.com/christophschuhmann) for daring proposing to train such large clips, following up on all these experiments, and finding very early that training were frozen, saving some valuable time
* [Jenia Jitsev](https://github.com/JeniaJitsev) for providing ideas and feedback during the training issues, supervision and coordination of the compute grants at JUWELS Booster
* [Ludwig Schmidt](https://github.com/ludwigschmidt) for reviewing this post and giving many ideas about LAION datasets and CLIP 
* [Mehdi Cherti](https://github.com/mehdidc) for helping to debug the evaluation scripts and getting comparable results for MS-COCO

And of course [Emad](https://twitter.com/EMostaque) (Stability AI) for providing the many GPUs used during these experiments! (g/14 and H/14!)

For the L/14 training, we gratefully acknowledge the Gauss Centre for Supercomputing e.V. (www.gauss-centre.eu) for funding this part of work by providing computing time through the John von Neumann Institute for Computing (NIC) on the GCS Supercomputer JUWELS Booster at Jülich Supercomputing Centre (JSC), Germany.
