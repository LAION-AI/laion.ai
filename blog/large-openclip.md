# Large scale openCLIP: L/14, H/14 and g/14 trained on LAION-2B

We trained three large CLIP models with [OpenCLIP](https://github.com/mlfoundations/open_clip): ViT-L/14, ViT-H/14 and ViT-g/14 (ViT-g/14 was trained only for about a third the epochs compared to the rest). The H/14 model achieves **78.0%** zero shot top-1 accuracy on ImageNet and **73.4%** on zero-shot image retrieval at Recall@5 on MS COCO. As of September 2022, this is the best open source CLIP model.

CLIP makes it possible to compute representations of images and texts to measure how **similar** they are. It can be used for 



* Zero shot classification: compare an image with the text of the class to know which class is most similar (e.g., ImageNet classification)
* Retrieval: compare an image or a text to billions of text or images to find the most similar (e.g. as in [clip-retrieval](https://rom1504.github.io/clip-retrieval/) )
* Generation
    * CLIP guidance: decide a text you want to generate, then use an image generator model, and use the CLIP distance between what’s generated and the text to generate a better image (e.g., VQGAN + CLIP)
    * CLIP conditioning: use a clip text embedding as input of a generator to make it generate this text directly (e.g., stable diffusion)

CLIP models are trained in a self supervised fashion on hundreds of millions or billions of (image, text) pairs.

With LAION, we produced the LAION-5B dataset that contains 5 billions of closely related image and text pairs.

The CLIP model ViT B/32, released by OpenAI, was initially used to filter this dataset out of common crawl.

Producing the best open source CLIP model out of this data set completes the open source replication of the [excellent](https://openai.com/blog/clip/) clip paper that OpenAI released one year ago.


## Results

We replicated the results from openai CLIP in models of different sizes, then trained bigger models. The full evaluation suite on 39 datasets ([vtab+](https://github.com/LAION-AI/CLIP_benchmark)) are available in this [results notebook](https://github.com/LAION-AI/CLIP_benchmark/blob/main/benchmark/results.ipynb) and show consistent improvements over all datasets.

The larger models we release today are L/14, H/14 and g/14.

L/14 was trained on JUWELS Booster supercomputer by [Ross wightman](https://github.com/rwightman). H/14 and g/14 were trained on stability cluster by [Romain Beaumont](https://github.com/rom1504) . While L/14 and H/14 were trained using 34B samples from LAION-2b, g/14 used a substantially smaller sample scale for training, seeing only 12B samples (see tables for more details).


#### 32B samples seen


<table>
  <tr>
   <td><strong>Model name</strong>
   </td>
   <td><strong>Batch size</strong>
   </td>
   <td><strong>Samples seen</strong>
   </td>
   <td><strong>Text Params</strong>
   </td>
   <td><strong>Image params</strong>
   </td>
   <td><strong>Imagenet top1</strong>
   </td>
   <td><strong>Mscoco image retrieval at 5</strong>
   </td>
   <td><strong>Flickr30k image retrieval at 5</strong>
   </td>
  </tr>
  <tr>
   <td><a href="https://wandb.ai/rom1504/eval_openclip/reports/B-32-2B--VmlldzoyNDkwNDMy">B/32</a>
   </td>
   <td>79k
   </td>
   <td>34B (16 epochs of laion2B)
   </td>
   <td>63.43M
   </td>
   <td>87.85M
   </td>
   <td>66.6%
   </td>
   <td>65.4%
   </td>
   <td>88.4%
   </td>
  </tr>
  <tr>
   <td>L/14
   </td>
   <td>79k for 14B samples, 86K for 18B
   </td>
   <td>32B
   </td>
   <td>123.65M
   </td>
   <td>303.97M
   </td>
   <td>75.3%
   </td>
   <td>71.1%
   </td>
   <td>92.9%
   </td>
  </tr>
  <tr>
   <td><a href="https://wandb.ai/rom1504/eval_openclip/reports/H-14--VmlldzoyNDAxODQ3">H/14</a>
   </td>
   <td>79k
   </td>
   <td>32B (16 epochs of laion2B)
   </td>
   <td>354.03M
   </td>
   <td>632.08M
   </td>
   <td>78.0%
   </td>
   <td>73.4%
   </td>
   <td>94%
   </td>
  </tr>
</table>



#### 12B samples seen


<table>
  <tr>
   <td><strong>Model name</strong>
   </td>
   <td><strong>Batch size</strong>
   </td>
   <td><strong>Samples seen</strong>
   </td>
   <td><strong>Text Params</strong>
   </td>
   <td><strong>Image params</strong>
   </td>
   <td><strong>Imagenet top1</strong>
   </td>
   <td><strong>Mscoco image retrieval at 5</strong>
   </td>
   <td><strong>Flickr30k image retrieval at 5</strong>
   </td>
  </tr>
  <tr>
   <td>B/32
   </td>
   <td>32k
   </td>
   <td>12B (32 epochs of laion400m)
   </td>
   <td>63.43M
   </td>
   <td>87.85M
   </td>
   <td>62.9%
   </td>
   <td>60.8%
   </td>
   <td>85.5%
   </td>
  </tr>
  <tr>
   <td>B/16
   </td>
   <td>32k
   </td>
   <td>12B (32 epochs of laion400m)
   </td>
   <td>91.16M
   </td>
   <td>86.19M
   </td>
   <td>69%
   </td>
   <td>63.6%
   </td>
   <td>85.5%
   </td>
  </tr>
  <tr>
   <td>L/14
   </td>
   <td>32k
   </td>
   <td>12B (32 epochs of laion400m)
   </td>
   <td>123.65M
   </td>
   <td>303.97M
   </td>
   <td>72%
   </td>
   <td>68.1%
   </td>
   <td>90.8%
   </td>
  </tr>
  <tr>
   <td><a href="https://wandb.ai/rom1504/eval_openclip/reports/slow-g-14--VmlldzoyNTMwMjg5">g/14</a>
   </td>
   <td>32k for 8B samples then 64k for 4B samples
   </td>
   <td>12B (similar to 32 epochs on laion400m)
   </td>
   <td>354.03M
   </td>
   <td>1012.65M
   </td>
   <td>76.6%
   </td>
   <td>72.4%
   </td>
   <td>93.5%
   </td>
  </tr>
</table>


In addition to having overall better results, we hope the larger text encoder will help improve text understanding. The good performance on the retrieval metrics seems to be a good indicator of this property.

Note the difference in samples seen between the H/14 and the g/14 model. This explains the difference in performance. We picked this lower number to try and fix the stability issue at a lower cost. Eventually they were fixed (by using bfloat16). The performance of this model falls in the scaling curve of 12B sample seen (similar to 32 epochs of laion400m), and a g/14 trained on 32B samples of laion2B would most likely follow the same trends as the other models and get better performance as H/14.


![alt_text](public/images/blog/images/compare3.png "image_tooltip")



## Released checkpoints

We release the checkpoints for the models, they are available through [openclip](https://github.com/mlfoundations/open_clip) and in HuggingFace hub at [B/32](https://huggingface.co/laion/CLIP-ViT-B-32-laion2B-s34B-b79K) [L/14](https://huggingface.co/laion/CLIP-ViT-L-14-laion2B-s32B-b82K) [H/14](https://huggingface.co/laion/CLIP-ViT-H-14-laion2B-s32B-b79K) and [g/14](https://huggingface.co/laion/CLIP-ViT-g-14-laion2B-s12B-b42K)


## Related works

Related work results:


<table>
  <tr>
   <td><strong>Model name</strong>
   </td>
   <td><strong>Samples seen</strong>
   </td>
   <td><strong>Imagenet top1</strong>
   </td>
   <td><strong>Mscoco image retrieval at 5</strong>
   </td>
   <td><strong>Flickr30k image retrieval at 5</strong>
   </td>
  </tr>
  <tr>
   <td>Openai B/32
   </td>
   <td>12B (32 epochs of WIT)
   </td>
   <td>62%
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Openai B/16
   </td>
   <td>12B (32 epochs of WIT)
   </td>
   <td>69%
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Openai L/14
   </td>
   <td>12B (32 epochs of WIT)
   </td>
   <td>75.4%
   </td>
   <td>61%
   </td>
   <td>87%
   </td>
  </tr>
  <tr>
   <td>ALIGN
   </td>
   <td>20B
   </td>
   <td>76.4%
   </td>
   <td>69.8%
   </td>
   <td>93.3%
   </td>
  </tr>
  <tr>
   <td>BASIC
   </td>
   <td>32B
   </td>
   <td>85.7%
   </td>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>CoCa
   </td>
   <td>32B
   </td>
   <td>86.3%
   </td>
   <td>74.2%
   </td>
   <td>95.7%
   </td>
  </tr>
</table>


[BASIC](https://arxiv.org/abs/2111.10050) and  [ALIGN](https://arxiv.org/abs/2102.05918) got excellent imagenet results. They used either different image encoder architecture (EfficientNet, CoAtNet), a larger network scale (BASIC-L with 2.4B params) or pre trained their network with supervised learning on a large dataset (BASIC CoAtNet vision encoder).

[COCA](https://arxiv.org/abs/2205.01917) additionally used captioning during training and got 86.3% top1.


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


<table>
  <tr>
   <td>Model
   </td>
   <td>Batch size per gpu
   </td>
   <td>Precision
   </td>
   <td>Number of gpus
   </td>
   <td>Sample per second per gpu
   </td>
  </tr>
  <tr>
   <td><a href="https://wandb.ai/rom1504/open-clip/runs/rnxrp6k7?workspace=user-rom1504">B/32</a>
   </td>
   <td>96
   </td>
   <td>float16
   </td>
   <td>824
   </td>
   <td>228
   </td>
  </tr>
  <tr>
   <td><a href="https://wandb.ai/rom1504/open-clip/runs/2zphcgkn?workspace=user-rom1504">H/14</a>
   </td>
   <td>96
   </td>
   <td>float16
   </td>
   <td>824
   </td>
   <td>30
   </td>
  </tr>
  <tr>
   <td><a href="https://wandb.ai/rom1504/open-clip/runs/21cpomx2?workspace=user-rom1504">g/14</a>
   </td>
   <td>40
   </td>
   <td>float16
   </td>
   <td>800
   </td>
   <td>20
   </td>
  </tr>
  <tr>
   <td><a href="https://wandb.ai/rom1504/open-clip/runs/3l7ppqh3?workspace=user-rom1504">H/14</a>
   </td>
   <td>96
   </td>
   <td>bfloat16
   </td>
   <td>824
   </td>
   <td>42
   </td>
  </tr>
  <tr>
   <td><a href="https://wandb.ai/rom1504/open-clip/runs/1pby5fkb?workspace=user-rom1504">g/14</a>
   </td>
   <td>80
   </td>
   <td>bfloat16
   </td>
   <td>800
   </td>
   <td>31
   </td>
  </tr>
</table>


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
* [Ross wightman](https://github.com/rwightman) for conducting all the openclip experiments at JUWELS Booster (Juelich Supercomputing Center) up to L/14 and providing valuable feedback during these H and g clip trainings
* [Phil Wang](https://github.com/lucidrains) for providing ideas and code (cosine attention, post layer norm, ..) during the stability issues
* [Boris Dayma](https://github.com/borisdayma) and [Mitchell Wortsman](https://mitchellnw.github.io/) for both proposing to try float32 that showed precision was an issue and eventually lead to trying bfloat16
* [Blinkdl](https://github.com/Blinkdl) for proposing interesting ideas regarding tuning the learning rate
* [Christoph Schuhmann](https://github.com/christophschuhmann) for following up on all these experiments, and finding very early that training were frozen, saving some valuable timeuiding Stable Diffusion with CLIP
* [Jenia Jitsev](https://github.com/JeniaJitsev) for providing ideas and feedback during the training issues, supervision and coordination of the compute grants at JUWELS Booster
* [Ludwig Schmidt](https://github.com/ludwigschmidt) for reviewing this post and giving many ideas about laion datasets and clip 
* [Mehdi Cherti](https://github.com/mehdidc) for helping to debug the evaluation scripts and getting comparable results for mscoco

And of course [Emad](https://twitter.com/EMostaque) (Stability AI) for providing the many GPUs used during these experiments! (g/14 and H/14!)

For the L/14 training, we gratefully acknowledge the Gauss Centre for Supercomputing e.V. (www.gauss-centre.eu) for funding this part of work by providing computing time through the John von Neumann Institute for Computing (NIC) on the GCS Supercomputer JUWELS Booster at Jülich Supercomputing Centre (JSC), Germany.
