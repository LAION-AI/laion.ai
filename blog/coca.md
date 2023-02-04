---
title: "Training Contrastive Captioners"
author: "Giovanni Puccetti, Maciej Kilian, Romain Beaumont"
date: "Feb 2 2023"
previewImg: "/images/blog/eval_coca_clip.jpg"
---


We introduce a new model type to [OpenClip](https://github.com/mlfoundations/open_clip) Contrastive Captioners (CoCa) [1]. This model adds an autoregressive objective (generation) on top of the CLIP contrastive one. The architecture is composed of three parts, the first two are similar to those composing a CLIP model and the third is a text decoder that stands on top of the text encoder. The additional decoder takes as input the encoded images (through cross-attention) and the previous tokens to predict the next most probable one. One of the few architecture changes, compared to CLIP, is attentional pooling [2], used to aggregate image representations and pass them to both the contrastive loss and the decoder cross-attention.

This is interesting for several reasons:

* We believe there is no openly available trained model with this architecture;
* Adding a generative task appears to help the contrastive task with minimal computational impact;
* The model is easily adaptable to a large number of tasks, on top of all those CLIP is suited for. CoCa models can (with relatively cheap fine-tuning) perform Image Captioning, Visual Question Answering, Multimodal Understanding, and more;
* CoCa gives captioning models an intermediate contrastive latent space for minimal training cost increase.


## Benchmarks

On a comparable model size and with the same training data available, CoCa outperforms a CLIP model on several zero-shot tasks (Figure 1). Most notably on _imagenet1k_ CoCa achieves 75.5 and CLIP 73.1 (2.6% improvement).


|(a) ![](/images/blog/eval_coca_clip.jpg) |(b) ![](/images/blog/eval_coca_clip_diff.jpg) |
|:-|:-|


_Figure 1:_ Scores achieved by _coca_ViT-L-14_ and _ViT-L-14_ on several zeroshot classification tasks **(a)**, together with the performance gap between the two models, in the same tasks sorted by magnitude **(b)**.




Table 2 shows the results achieved on Text to Image and Image to Text retrieval by both CoCa and CLIP. In this case too, CoCa outperforms CLIP on all tasks with differences ranging from 0.3 to 1.3.


<table>
  <tr>
   <td colspan="4" align="center" > Text to Image Retrieval Recall@5
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>flickr30k
   </td>
   <td>flickr8k
   </td>
   <td>Mscoco captions
   </td>
  </tr>
  <tr>
   <td>coca_ViT-L-14
   </td>
   <td>92.0
   </td>
   <td>70.1
   </td>
   <td>70.5
   </td>
  </tr>
  <tr>
   <td>ViT-L-14
   </td>
   <td>91.7
   </td>
   <td>69.0
   </td>
   <td>69.2
   </td>
  </tr>
  <tr>
   <td colspan="4" align="center"> Image to Text Retrieval Recall@5
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>flickr30k
   </td>
   <td>flickr8k
   </td>
   <td>Mscoco captions
   </td>
  </tr>
  <tr>
   <td>coca_ViT-L-14
   </td>
   <td>99.3
   </td>
   <td>81.7
   </td>
   <td>83.6
   </td>
  </tr>
  <tr>
   <td>ViT-L-14
   </td>
   <td>98.4
   </td>
   <td>81.2
   </td>
   <td>83.0
   </td>
  </tr>
</table>

_Table 2:_ Text to Image and Image to Text retrieval **Recall@5** on _flickr30k_, _flickr8k_ and _Mscoco captions_.

## Released Checkpoint

We release checkpoints for two model configs, _coca_ViT-B-32_ and _coca_ViT-L-14_. We also release the MSCOCO finetunes of those models which are much better at captioning but unfortunately lose their contrastive capabilities during fine tuning.

Try generation in this [Space](https://huggingface.co/spaces/laion/CoCa) or in this [colab notebook](https://colab.research.google.com/github/mlfoundations/open_clip/blob/master/docs/Interacting_with_open_coca.ipynb)!


<table>
  <tr>
   <td>
   </td>
   <td>L/14
   </td>
   <td>B/32
   </td>
   <td>CoCa (from paper)
   </td>
  </tr>
  <tr>
  <td># Params Image Encoder
   </td>
   <td>306.72M
   </td>
   <td>89.16M
   </td>
   <td>
    1B
   </td>
  </tr>
  <tr>
   <td># Params Text Encoder
   </td>
   <td>123.65M
   </td>
   <td>63.42M
   </td>
   <td rowspan="2">
    1.1B
   </td>
  </tr>
  <tr>
   <td># Params Text Decoder
   </td>
   <td>208.07M
   </td>
   <td>100.96M
   </td>
  </tr>
</table>

_Table 3:_ Number of parameters for each encoder/decoder component for _coca_ViT-L-14_, _coca_ViT-B-32_ and the _CoCa_ model from the original paper (M=millions, B=billions).



## Training Notes


### Pretraining

We train both model configurations on 13B samples seen from [LAION-2B](https://laion.ai/blog/laion-5b/) [3] with a batch size of 90k, learning rate of 1e-3, and a cosine decay learning rate schedule. Experiments were performed on 384 A100’s and over the course of training we maintained 75.5 samples/s/gpu (~29k samples/s in total).

When it comes to cost, even though CoCa has more capabilities than single-task captioning models there’s a minimal increase ~20% (as reported by Table 8b of the paper). This is due to the fact that the first half of the text decoder (i.e. the text encoder) is unimodal and is computed in parallel to the image encoder, once the encoders are done we simply continue the forward pass of the text embeddings through the text decoder and also include the image embeddings via cross attention. The trainig report can be found [here](https://wandb.ai/iejmac/open-clip/reports/CoCa-L-14--VmlldzozNDEwMDIx).


### Fine-tuning

For image captioning tasks fine-tuning is a straightforward extension of pretraining with few hyper parameters changes. The crucial one is contrastive loss weight, which has to be set to zero to let the backward pass only account for the generative loss, besides  there are no additional fine-tuning oriented components nor changes in the loss. We use a batch size of 128 with a learning rate of 1e-5 and a cosine learning rate schedule. Experiments are performed on 4 A100's. Table 4 shows the language generation scores achieved by _coca_ViT-L-14_ and by CoCa in the original paper, _coca_ViT-L-14 performance is still far from the original CoCa model one.

It is noteworthy that (in our experiments) after fine-tuning with a generative only loss these models lose their contrastive skills entirely.


<table>
  <tr>
   <td>
   </td>
   <td>Bleu@4
   </td>
   <td>METEOR
   </td>
   <td>CIDEr
   </td>
   <td>Spice
   </td>
  </tr>
  <tr>
    <td colspan="5" align="center">
    coca_ViT-L-14
    </td>
  </tr>
  <tr>
   <td>Karpathy val
   </td>
   <td>35.6
   </td>
   <td>29.8
   </td>
   <td>125.3
   </td>
   <td>23.4
   </td>
  </tr>
  <tr>
   <td>NoCaps
   </td>
   <td>39.9
   </td>
   <td>29.1
   </td>
   <td>106.5
   </td>
   <td>14.7
   </td>
  </tr>
  <tr>
    <td colspan="5" align="center">
    Original CoCa (from paper)
    </td>
  </tr>
  <tr>
   <td>Karpathy val
   </td>
   <td>40.9
   </td>
   <td>33.9
   </td>
   <td>143.6
   </td>
   <td>24.7
   </td>
  </tr>
  <tr>
   <td>NoCaps
   </td>
   <td> -
   </td>
   <td>-
   </td>
   <td>122.4
   </td>
   <td>15.5
   </td>
  </tr>
</table>

_Table 4:_ Visual captioning scores achieved with _coca_ViT-L-14_ on _karpathy_ validation set and _NoCaps_.



## Captioning Examples



|<img src="/images/blog/ipod_apple.png" alt="cao" width="500">|<img src="/images/blog/space_raccoon.png" alt="cao" width="500">|
|:-|:-|
|An apple sitting on top of a wooden table.|A painting of a raccoon in a space suit.|












## What’s Next



* Unimodal Text Pretraining - One of the shortcomings of CoCa is that it can have trouble with zero-shot captioning because the noisy web text it was trained on isn’t as rich as unimodal text data. To this end we can look into methods that provide CoCa models with this rich text understanding either via initializing the weights of the decoder with some pretrained unimodal text decoder or perhaps alternating between multimodal and unimodal losses that use different data.
* Fine tuning on more tasks VQA, multimodal reasoning, and more.
* Image Decoder - CoCa adds a multimodal text decoder on top of CLIP and shows this multi-task learning can benefit both tasks. Why not also add a multimodal image decoder?


## Contributions and acknowledgements

Thanks to



* [gpucce](https://gpucce.github.io/) and [iejMac](https://github.com/iejMac) for implementation into open_clip and training the models.
* [lucidrains](https://github.com/lucidrains) for [initial implementation](https://github.com/lucidrains/CoCa-pytorch).
* [Romain Beaumont](https://github.com/rom1504) and [Ross Wightman](https://github.com/rwightman) for advice, reviews, and engineering support.
* [Soonhwan-Kwon](https://github.com/Soonhwan-Kwon) for implementing beam search.

Huge thanks to [Emad](https://twitter.com/EMostaque) and [StabilityAI](https://stability.ai/) for providing the compute resources required to train these models.


## References

[1] Yu, J., Wang, Z., Vasudevan, V., Yeung, L., Seyedhosseini, M., & Wu, Y. (2022). CoCa: Contrastive Captioners are Image-Text Foundation Models. _ArXiv, abs/2205.01917_.

[2] Lee, J., Lee, Y., Kim, J., Kosiorek, A.R., Choi, S., & Teh, Y.W. (2018). Set Transformer: A Framework for Attention-based Permutation-Invariant Neural Networks. _International Conference on Machine Learning_.

[3] Schuhmann, C., Beaumont, R., Vencu, R., Gordon, C., Wightman, R., Cherti, M., Coombes, T., Katta, A., Mullis, C., Wortsman, M., Schramowski, P., Kundurthy, S., Crowson, K., Schmidt, L., Kaczmarczyk, R., & Jitsev, J. (2022). LAION-5B: An open large-scale dataset for training next generation image-text models. _ArXiv, abs/2210.08402_.