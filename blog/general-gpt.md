---
title: "General-GPT: Breaking the Modality Constraint"
author: "Shivaen Ramshetty and Christoph Schuhmann"
date: "March 28 2023"
previewImg: "/images/blog/general-gpt-logo.png"
---
## Introduction

With the rapid explosion of large language models and utilization of their encompassing applications, most notably [ChatGPT](https://openai.com/blog/chatgpt), there is a clear promise of more capable and useful AI models/systems. Often, such models are compared to us as humans using the Turing test or their performance on tasks relative to humans. As of recent, these models have even achieved incredible success on tests designed for humans such as the LSAT. However, the limited means by which one can interact with such systems  elucidates a variety of opportunities for exploration and possibly discovery. We ask whether modalities can be mixed and learnt alongside one another, and whether that environment of learning offers new avenues for understanding.

With this in mind, we are excited to introduce a relatively new project at [LAION](https://laion.ai/) called General-GPT.


## Goals

In an effort to keep this concise, we enumerate our goals as follows:

1. Explore the ability to directly intertwine any modality into large language models (LLMs), such that expression of ideas and responses can be more natural and informative.
2. Allow longer contexts by inputting embedded sequences rather than operating directly on the sequences themselves. Though we may lose fine-grained details of the original sequences, it may prove useful for higher-level tasks.
3. Provide open-source tools, methods, and models that we hope extend our bigger picture goal of "democratizing AI."


## Experiments

### Text-Image Expression
Currently, our efforts have been primarily centered around experimenting with whether or not we can format our first goal into a trainable and functioning model. In order to do so, we first simplified the problem in a three ways. First, we choose to focus on tackling only the text-image domain rather than the full gamut that we hope to include. Secondly, we format the problem as a straightforward mapping from $x \rightarrow y$ or $y \rightarrow x$. Where $x$ represents an image embedding and $y$ represents the accompanying text. Finally, we tune on just the [MS-COCO](https://cocodataset.org/#home) [1] 2017 training set of 591753 image-caption pairs.

To construct $x$ we utilize [CLIP](https://openai.com/research/clip) [2], specifically CLIP *ViT-L/14*, to encode the images. On the other hand, we utilize [GPT-2](https://huggingface.co/gpt2) [3] as our LLM that receives mixed inputs and grounds for multimodal understanding or expression. The choice of these two models as baselines comes from their relatively reasonable scale, existing work and research, and the common dimensionality of their encodings. 

#### Image Captioning: $x \rightarrow y$ 
For this task, we introduce two specific tokens into the vocab so that the model may recognize when an embedding is being input and what that embedding is. Intuitively, the first token ("[CLIP IN]") should signal that there is an image embedding before the second token ("[\CLIP IN]"). Therefore, the training data for this task is structured as follows:

*<center>[CLIP IN] **embedding** [\CLIP IN] Caption: [MS-COCO caption ...].</center>*

In regards to training itself, we follow [CLIP prefix captioning](https://github.com/rmokady/CLIP_prefix_caption) [4] and simply insert the image embedding as a new token in between our two new tokens. Then, we introduce a dummy token as our target token at the same inserted position. Lastly, the loss for this task is just cross-entropy between shifted-by-1 logits and the original target indices with the dummy token being ignored.


| Encoded Image | Generated Caption | Original Caption|
|  :----: | :----: | :----: |
| ![Catch Example](/images/blog/general-gpt_captioning_example-1.png) | A man and a child playing baseball. | A man and a boy are playing catch in a yard. |
| ![Sleeping Dog](/images/blog/general-gpt_captioning_example-2.png) | A dog laying on a sidewalk next to a bike. | a white dog is sleeping on a street and a bicycle |

Table 1: Results of image captioning with CLIP embeddings as input into GPT-2.


#### Image Retrieval: $y \rightarrow x$
Similar to the first task, we also introduce two additional tokens: "[CLIP OUT]" and "[\CLIP OUT]." As there text suggests, they represent the position and container for the CLIP image embedding. The training data for task is formatted as such:

*<center>Caption: [MS-COCO caption ...]. [CLIP OUT][\CLIP OUT] </center>*

An interesting difference between the two task arises in the training procedure. Here, we must enforce GPT-2 to learn image representations that are as close to the original CLIP image embeddings as possible. In order to do this, we compute the mean squared error between the last hidden state at the position of the "[\CLIP OUT]" token and the original CLIP embedding. Finally, we perform the same cross-entropy loss for language modeling.

| Caption      | MS-COCO | LAION-5B
| :---: | :---: | :---: |
| Birds flying over the beach. | ![Beach Birds](/images/blog/general-gpt_coco-retrieval_example-1.png)| <img src="/images/blog/general-gpt_laion-retrieval_example-1.jpg" width=600></src> |
| A nightstand with a collection of books. |  ![Room with Books](/images/blog/general-gpt_coco-retrieval_example-2.png) | <img src="/images/blog/general-gpt_laion-retrieval_example-2.jpg" width=300></src> |

Table 2: Nearest neighbors of GPT-2 image embedding prediction within MS-COCO and LAION-5B [5].


### Sentence Reconstruction
One significant limitation of current open-source LLMs is the constraint on context length. This constraint prevents models from effectively comprehending and reasoning over extensive background knowledge spanning thousands of sentences. To address this challenge, we propose an innovative approach that enables GPT models with a context length of 2048 or 4096, for example, to process and understand vast amounts of background information more efficiently.

As a preliminary experiment we evaluated how reasonable our second goal was by reconstructing the original text with GPT-2 from an input of its embedded representation. In other words, we hoped to see whether we could embed sentences into some shared dimensional space and then generate the same tokens from those sentences? If so, we may be able to shrink longer contexts into a series of sequence embeddings which would be useful across diverse sets of inputs.

To model this behavior, we followed a method similar to how we performed the aforementioned image captioning. However, we avoid adding any new tokens or structuring our training data. Instead, a simple encoding of each sentence using the sentence transformer [*all-mpnet-base-v2*](https://huggingface.co/sentence-transformers/all-mpnet-base-v2) [6] is followed by the sentence itself. Then, we compute the cross-entropy loss as previously described with the output logits and target token indices.

| Original Caption | Reconstructed Caption |
| :---: | :---: |
| A man riding a motorcycle down the street. | A man riding a motorcycle down the street. |
| Two animals chasing each other in a barn. | Two animals chasing each other in a barn. |
| Two animals chasing each other in a farmhouse. | Two animals chase after a flock of farm animals in a barn. |

Table 3: Results of sentence reconstruction with *all-mpnet-base-v2* and GPT-2.


## Next Steps

Ultimately, our aim is to train GPT models to handle texts and sequences of other modalities entirely in semantic embeddings, such as sequences of CLIP embeddings for videos, where each CLIP embedding represents the image embedding of one image frame, or where one embedding could be the audio clip (CLAP) [7] embedding of 5 or 10 seconds of audio. By predicting sequences in these semantic spaces or streams of ideas, truly multimodal sequence learning could be realized, capable of learning robust and sophisticated world models by pretraining on data from various modalities.

Additionally, embeddings could be decoded by specialized decoders into different outputs, such as text, images, audio, and video, similar to what DALL-E (Ramesh et al., 2021) does with CLIP embeddings that get decoded into images. Coalescing modalities could open the door to more 

### Scale
In terms of scale, there are a few dimensions of the experimental setup that we will modify. Three such dimensions include larger models, larger datasets, and more complex data, which we expect will improve the generalization across inputs. In order to tune these larger models on richer data we also need to expand our computational resources, possibly in a distributed setting. 

We plan on introducing greater complexity to the current data by utilizing truly interleaved datasets and large context inputs. For the latter, we convert the background text into a series of sentence embeddings using a pre-trained sentence embedding model, CLIP, or the recently proposed SGPT [8]. Then, create a sequence of these sentence embeddings, effectively compressing the original lengthy text into a condensed representation that captures high-level semantic information. Next, the sequence of embeddings is provided to the GPT model with the more recent context in the form of text tokens. This additional input serves to inform the model about the specific grammar, syntax, and style of the text. The model is then tasked with generating a continuation of the text based on the thousands of sentence embeddings and the few hundred words of the most recent context.

By representing longer contexts as a series of sequence embeddings, we enable the GPT model to reason over the entire text at once, leading to more coherent and contextually informed outputs. This method could be especially useful for tasks requiring a deep understanding of vast amounts of background information, such as generating summaries of novels, long articles, or comprehensive research papers.

Current trends suggest that these modifications will improve our results, but greater complexity may lead to instability. If that is the case, additional modifications or redesigns will be necessary; all of which will be shared as they arise.

### New Tasks
Some obvious directions we plan to investigate include the extrapolation of the current design into other modalities such as audio and video. Additionally, we wish to understand whether a LLM can generate both text and images that play off one another. In such a case, the LLM wouldn't necessarily generate the images directly, but rather condition an image generation model. If we are able to show that image generation can be guided in an interleaved manner, then other modalities will again be an extension. 

Although our research in this direction is still preliminary and incomplete, it is highly promising, and we encourage everyone interested in this topic to join our server and contribute to our research. Part of what makes us excited for this project is all the ideas that the open-source community may come up with and even implement. For that reason, we would love any suggestions, feedback, and help!

## Notes

It is quite clear from the results that inputs that are out-of-distribution in both experiments leads to poor results. Though this isn't unexpected for the scale and goals of our experiments, it does hint at poor generalization in such a configuration. Further experiments will be essential in diagnosing the impacts of richer data and scale.

If you wish to contribute, stay updated, or learn a bit more about the current work, please check out the following links:
- 🧑‍💻 [GitHub Repository](https://github.com/LAION-AI/General-GPT)
- 💬 [LAION Discord](https://discord.gg/HzJU2kuC)
- 🎥 [Introduction Video](https://www.youtube.com/watch?v=LA3AC8gM6hw)


## Acknowledgements
We further thank the authors and contributors of the following works/repositories:
- [HuggingFace](https://github.com/huggingface/transformers)
- [CLIP Retrieval](https://github.com/rom1504/clip-retrieval)

Logo generated with [Craiyon](https://www.craiyon.com/)


## References

[1] Lin, T. Y., Maire, M., Belongie, S., Hays, J., Perona, P., Ramanan, D., ... & Zitnick, C. L. (2014). Microsoft coco: Common objects in context. In Computer Vision–ECCV 2014: 13th European Conference, Zurich, Switzerland, September 6-12, 2014, Proceedings, Part V 13 (pp. 740-755). Springer International Publishing.

[2] Radford, A., Kim, J. W., Hallacy, C., Ramesh, A., Goh, G., Agarwal, S., ... & Sutskever, I. (2021, July). Learning transferable visual models from natural language supervision. In International conference on machine learning (pp. 8748-8763). PMLR.

[3] Radford, A., Wu, J., Child, R., Luan, D., Amodei, D., & Sutskever, I. (2019). Language models are unsupervised multitask learners. OpenAI blog, 1(8), 9.

[4] Mokady, R., Hertz, A., & Bermano, A. H. (2021). Clipcap: Clip prefix for image captioning. arXiv preprint arXiv:2111.09734.

[5] Schuhmann, C., Beaumont, R., Vencu, R., Gordon, C., Wightman, R., Cherti, M., Coombes, T., Katta, A., Mullis, C., Wortsman, M., Schramowski, P., Kundurthy, S., Crowson, K., Schmidt, L., Kaczmarczyk, R., & Jitsev, J. (2022). LAION-5B: An open large-scale dataset for training next generation image-text models. _ArXiv, abs/2210.08402_.

[6] Reimers, N., & Gurevych, I. (2019). Sentence-bert: Sentence embeddings using siamese bert-networks. arXiv preprint arXiv:1908.10084.

[7] Elizalde, B., Deshmukh, S., Ismail, M. A., & Wang, H. (2022). Clap: Learning audio concepts from natural language supervision. arXiv preprint arXiv:2206.04769.

[8] Muennighoff, N. (2022). Sgpt: Gpt sentence embeddings for semantic search. arXiv preprint arXiv:2202.08904.