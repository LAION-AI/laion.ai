---
title: "General-GPT: Breaking the Modality Constraint"
author: "Shivaen Ramshetty & Christoph Schuhmann"
date: "March 25 2023"
previewImg: "/images/blog/____"
---

With the rapid explosion of large language models and utilization of their encompassing applications, most notably [ChatGPT](https://openai.com/blog/chatgpt), there is a clear promise of more capable and useful AI models/systems. Often, such models are compared to us as humans and using the Turing test they always seem to fall short. Whether that be a result of moving the goal posts of the test itself and/or our own understanding of these models, this failure elucidates a variety of opportunities for exploration and possibly discovery.  

With this in mind, we wish to introduce a relatively new project at [LAION](https://laion.ai/) called General-GPT.


## Goals

In an effort to keep this concise, we enumerate our goals as follows:

1. Explore the ability to directly intertwine any modality into a large language model (LLM), such that expression of ideas and responses can be more natural and expressive.
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
| ![Catch Example](../public/images/blog/general-gpt_captioning_example-1.png) | A man and a child playing baseball. | A man and a boy are playing catch in a yard. |
| ![Sleeping Dog](../public/images/blog/general-gpt_captioning_example-2.png) | A dog laying on a sidewalk next to a bike. | a white dog is sleeping on a street and a bicycle |
<center>Table 1: Results of image captioning with CLIP embeddings as input into GPT-2.</center>


#### Image Retrieval: $y \rightarrow x$
Similar to the first task, we also introduce two additional tokens: "[CLIP OUT]" and "[\CLIP OUT]." As there text suggests, they represent the position and container for the CLIP image embedding. The training data for task is formatted as such:

*<center>Caption: [MS-COCO caption ...]. [CLIP OUT][\CLIP OUT] </center>*

An interesting difference between the two task arises in the training procedure. Here, we must enforce GPT-2 to learn image representations that are as close to the original CLIP image embeddings as possible. In order to do this, we compute the mean squared error between the last hidden state at the position of the "[\CLIP OUT]" token and the original CLIP embedding. Finally, we perform the same cross-entropy loss for language modeling.

| Caption      | MS-COCO | LAION-5B
| :---: | :---: | :---: |
| Birds flying over the beach. | ![Beach Birds](../public/images/blog/general-gpt_coco-retrieval_example-1.png)| <img src="../public/images/blog/general-gpt_laion-retrieval_example-1.jpg" width=600></src> |
| A nightstand with a collection of books. |  ![Room with Books](../public/images/blog/general-gpt_coco-retrieval_example-2.png) | <img src="../public/images/blog/general-gpt_laion-retrieval_example-2.jpg" width=300></src> |
<center>Table 2: Nearest neighbors of GPT-2 image embedding prediction within MS-COCO and LAION-5B [5]. </center>


### Sentence Reconstruction
On another tangent, we evaluated how reasonable the second goal was based on the above procedure. In other words, could we embed sentences into some shared dimensional space and then reconstruct those same sentences directly. If so, we may be able to shrink longer contexts into a series of sequence embeddings which would be useful for a more diverse set of inputs. For example, if we wanted to generate a summary of a novel or maybe just a single chapter, we would likely have to chunk the text. However, if we encode each sentence of the text and pass it as input just once, the language model could reason over the entire text at once. In doing so, the model could be more capable of providing a thorough and coherent summary.

To model this behavior, we followed a method similar to how we performed the aforementioned image captioning. However, we avoid adding any new tokens or structuring our training data. Instead, a simple encoding of each sentence using the sentence transformer [*all-mpnet-base-v2*](https://huggingface.co/sentence-transformers/all-mpnet-base-v2) [6] is followed by the sentence itself. Then, we compute the cross-entropy loss as previously described with the output logits and target token indices.

| Original Caption | Reconstructed Caption |
| :---: | :---: |
| A man riding a motorcycle down the street. | A man riding a motorcycle down the street. |
| Two animals chasing each other in a barn. | Two animals chasing each other in a barn. |
| Two animals chasing each other in a farmhouse. | Two animals chase after a flock of farm animals in a barn. |
Table 3: Results of sentence reconstruction with *all-mpnet-base-v2* and GPT-2.


## Notes

It is quite clear from the results that inputs that are out-of-distribution in both experiments leads to poor results. Though this isn't unexpected for the scale and goals of our experiments, it does hint at poor generalization in such a configuration. Further experiments will be essential in diagnosing the impacts of richer data and scale.

## Next Steps

### Scale

### New Tasks


## Acknowledgements
We further thank the authors and contributors of the following works/repositories:
- [HuggingFace](https://github.com/huggingface/transformers)
- [CLIP Retrieval](https://github.com/rom1504/clip-retrieval)


## References

[1] Lin, T. Y., Maire, M., Belongie, S., Hays, J., Perona, P., Ramanan, D., ... & Zitnick, C. L. (2014). Microsoft coco: Common objects in context. In Computer Vision–ECCV 2014: 13th European Conference, Zurich, Switzerland, September 6-12, 2014, Proceedings, Part V 13 (pp. 740-755). Springer International Publishing.

[2] Radford, A., Kim, J. W., Hallacy, C., Ramesh, A., Goh, G., Agarwal, S., ... & Sutskever, I. (2021, July). Learning transferable visual models from natural language supervision. In International conference on machine learning (pp. 8748-8763). PMLR.

[3] Radford, A., Wu, J., Child, R., Luan, D., Amodei, D., & Sutskever, I. (2019). Language models are unsupervised multitask learners. OpenAI blog, 1(8), 9.

[4] Mokady, R., Hertz, A., & Bermano, A. H. (2021). Clipcap: Clip prefix for image captioning. arXiv preprint arXiv:2111.09734.

[5] Schuhmann, C., Beaumont, R., Vencu, R., Gordon, C., Wightman, R., Cherti, M., Coombes, T., Katta, A., Mullis, C., Wortsman, M., Schramowski, P., Kundurthy, S., Crowson, K., Schmidt, L., Kaczmarczyk, R., & Jitsev, J. (2022). LAION-5B: An open large-scale dataset for training next generation image-text models. _ArXiv, abs/2210.08402_.

[6] Reimers, N., & Gurevych, I. (2019). Sentence-bert: Sentence embeddings using siamese bert-networks. arXiv preprint arXiv:1908.10084.