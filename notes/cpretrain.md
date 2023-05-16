---
title: "Conditional Pretraining of Large Language Models"
author: "Rallio"
date: "May 16 2023"
previewImg: "https://aeiljuispo.cloudimg.io/v7/https://s3.amazonaws.com/moonup/production/uploads/1674247492314-noauth.png?w=200&h=200&f=face"
---


## **Introduction**

Large language models (LLMs), such as OpenAI's ChatGPT and similar chatbot products from other organizations, have recently gained widespread adoption. These models can extend text or respond to instructions in a natural and helpful manner. Despite the core technologies behind LLMs, namely the transformer architecture and the GPT decoder-only causal language model, remaining relatively unchanged for over five years, the surge in popularity of ChatGPT can be largely attributed to recent approaches that better align the output of LLMs with users' and service providers' intentions.


Two primary approaches have been employed to better align large language models with human expectations. The first is known as supervised finetuning (SFT) on natural instructions, while the second is called reinforcement learning from human feedback (RLHF). Both methods aim to improve the performance and usability of LLMs, but they differ in their implementation. SFT involves training the model using labeled datasets that contain natural instructions, which helps the model understand and respond more accurately to user queries. RLHF, on the other hand, is a technique that uses human preferences as a reward signal to fine-tune models. It involves collecting a dataset of human-written demonstrations on prompts, training supervised learning baselines, and then gathering a dataset of human-labeled comparisons between two model outputs on a larger set of prompts. A reward model (RM) is trained on this dataset to predict which output labelers would prefer, and this RM is used as a reward function to fine-tune the LLM using the PPO algorithm. However, there is an "alignment tax" associated with this approach, which can result in worse performance in some situations.

![](./cond_pretrain_im1.png)
**Figure 1.** An example of document tagging on a popular user generated content website. The tags inform potential readers what kind of content will be in the text without spoiling the story.


A third approach to align language models with human expectations in a more transparent and end-user controllable manner is called Conditional Pretraining. In this method, a large number of pretraining examples are tagged with labels that describe the content using human-understandable classifiers. Content tagging is used in nearly all human generated online information-sharing environments as a way to organize content, and help users find information most relevant to their interests. This labeling can be performed in a mostly unsupervised fashion, utilizing encoder-only or encoder-decoder natural language understanding (NLU) machine learning models.

There are many widely used tags online that help categorize and filter content based on user preferences. "Suitable for work" (SFW) and "not suitable for work" (NSFW) tags are commonly found on sites like Reddit, Imgur, and various online forums. Additionally, book and movie reviews often utilize the "Spoilers" tag to indicate if the review contains information that may negatively impact the enjoyment of the content. User-generated story sites, such as Archive of Our Own (AO3) and FanFiction.net, employ diverse tags to provide clear indications of the content readers can expect within the stories (Figure 1). Furthermore, labels like G, PG, PG-13, and R, have been utilized for decades to inform users about television and movie content.

By leveraging conditional pretraining, language models could be better adapted to users' interests and preferences, resulting in a more aligned and enjoyable experience.


## **Converting Existing Pretraining Data into Conditional Pretraining Data**

The prevailing method for training LLMs involves collecting vast quantities of text from the internet and feeding this minimally processed text into the LLM. The pretraining objective is to predict the subsequent word given all prior words in the training example. Often, the text is divided in a manner that allows documents to be fragmented at any point, such as in the middle of a paragraph. These fragments are then randomly incorporated into larger batches of training examples, typically ranging from 2 to 4 million examples per training step. Although this approach has proven effective, it may not be the most optimal way to train these models.

![](./cond_pretrain_im2.png)
**Figure 2.** Comparison of existing LLM training strategies and the conditional pretraining approach. Theoretically every example used to train the model could be tagged.

In contrast, conditional pretraining aims to prepend each training example with a set of descriptive tags and a brief synopsis that accurately represents the text in the training example (Figure 2). These tags and synopses can be efficiently generated using fine tuned NLU models such as BERT or T5. Although there is considerable computational cost associated with processing all the training examples, once the conditional pretraining examples are generated, they become reusable and easily understandable by humans. This approach enhances the training process, resulting in more accurate and user-friendly language models.


## **Transparency and Accountability**

Another significant advantage of conditional pretraining is the transparency of the tags used on documents, which can be easily understood by auditors or end users of the models. At present, the instructions and reward models employed in most LLMs are proprietary and not available for public review. This lack of transparency makes it challenging to comprehend how and why models respond to culturally or politically sensitive topics. Even when there are disagreements among people about how these models should be aligned and what values they should uphold, it is difficult to engage in meaningful discussions or debates on these sensitive topics as long as the values of the organizations developing the LLMs remain concealed or obscured by carefully crafted press releases and position papers.


## **How to Prepare a Conditional Pretraining Dataset**

We have developed a fine tuned LoRA model based on the open source FLAN-UL2 that takes as input about 2000 words of text and outputs the conditional pretraining labels for the document. An example output from this conditional tagging model for a recent news article about LAION in [Forbes](https://www.forbes.com/sites/hessiejones/2023/04/19/amid-growing-call-to-pause-ai-research-laion-petitions-governments-to-keep-agi-research-open-active-and-responsible/) is below. To generate these document tags only text from the body of the article was used.
![](./cond_pretrain_im4a.png)
## **Example Outputs from a New Conditional Pretrained Model**

Below you can find a toy example of how to control the behavior of the conditional language model. In this example, the conditional labels are used to create a very unhelpful chatbot or one that is helpful. These outputs are from the base conditional pretrained model, without any explicit instruction tuning or examples of chatbots in the training data.

**<center>Adorable baby chatbot</center>**
![image](https://github.com/LAION-AI/laion.ai/assets/22318853/85aca1d8-2243-467b-a5b1-d2abc7ffad09)

**<center>Unhelpful chatbot</center>**
![](./cond_pretrain_im2.PNG)

**<center>Helpful chatbot</center>**
![](./cond_pretrain_im3b.PNG)

## **How to Use The Models and Contribute to This Project**

The initial code and models are available on Github and Huggingface. Conditional pretrained models can be used exactly the same way as any other large language model, just remember to prepend your conditionals to the start of your input and spend some time experimenting with what tags suit your use case. 

We are in the process of converting very large pretraining datasets from the internet to conditional pretraining datasets and if you are someone that gets excited about building large datasets we would welcome your help on this effort. On the more experimental side of things, we are interested in developing reward models that efficiently calculate how well the outputs from conditional pretrained models conform with their conditionals. Please checkout the LAION discord or github if you are interested in contributing.


If you are interested, please check out the following links:
- [Demo-Colab-Notebook](https://colab.research.google.com/drive/1fbXOqeEkqygnWKSPKddQtaMiZEc0KYFY?usp=sharing) - Colab for playing with our models.
- [7B-redpajama-conditional-alpha](https://huggingface.co/Rallio67/7B-redpajama-conditional-alpha) - Redpajama base 7B model finetuned on ~2 million 2048 context conditional pretraining examples.
- [3B-redpajama-conditional-alpha](https://huggingface.co/Rallio67/3B-redpajama-conditional-alpha) - Redpajama base 3B model finetuned on ~2 million 2048 context conditional pretraining examples.
- [neox-20b-conditional-alpha](https://huggingface.co/Rallio67/neox-20b-conditional-alpha) - gpt-neox-20B base model finetuned on ~600 thousand 2048 context conditional pretraining examples.
- [flan-ul2-20b-condlabeler-alpha](https://huggingface.co/Rallio67/condlabeler-alpha) - LoRA finetuned flan-ul2-20b model that you can use to create conditional labels for your own text. Please verify that the labels you are generating match your expectations with some texts you are already personally familiar with.
- [LAION GitHub Repository](https://github.com/LAION-AI/)
- 💬 [LAION Discord](https://discord.gg/HzJU2kuC)

## **Acknowledgements**
- [StabilityAI](https://stability.ai/) for pre-emptible compute resources.
- [EleutherAI](https://github.com/EleutherAI/gpt-neox) for opensource GPT-Neox.
- [huggingface](https://huggingface.co/) for open source model hosting and code base.
- [RedPajama-INCITE](https://www.together.xyz/blog/redpajama-models-v1) for training and releasing opensource base models.
- [google-research](https://github.com/google-research/t5x) for training and releasing opensource T5 models which we used to create conditional labels.

## **References**
Conditional pretraining is very straightforward conceptually and does not require any complex mathematical arguments for it's justification. If you want to read a recent academic text discussing the concept in more detail please check out the paper by Anthropic. Conditional Pretraining was also used by Google to create Palm 2.
- [Pretraining Language Models with Human Preferences](https://arxiv.org/abs/2302.08582) by Anthropic.
- [PALM-2 Technical Report](https://ai.google/static/documents/palm2techreport.pdf) by Google AI. Search for "control tokens" to find relevant information.
