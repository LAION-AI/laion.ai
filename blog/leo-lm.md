---
title: "LeoLM: Igniting German-Language LLM Research"
author: "Björn Plüster"
date: "September 28 2023"
previewImg: "/images/blog/leolm-banner.jpg"
---

We proudly introduce LeoLM (**L**inguistically **E**nhanced **O**pen **L**anguage **M**odel), the first comprehensive suite of German-language Foundation Language Models trained in collaboration with HessianAI on their new supercomputer **42**! Built on Llama-2 and trained on a large-scale, high-quality German text corpus, we present LeoLM-7B and 13B, with LeoLM-70B on the horizon, accompanied by a collection of exceptionally proficient German and bilingual chat models.

Meet LeoLM, the first open and commercially available German Foundation Language Model built on Llama-2.
Our models extend Llama-2's capabilities into German through continued pretraining on a large corpus of high-quality German and mostly locality-specific text.
Thanks to a compute grant at [HessianAI](https://hessian.ai/)'s new supercomputer **42**, we release two foundation models trained with 8k context length,
[`LeoLM/leo-hessianai-7b`](https://huggingface.co/LeoLM/leo-hessianai-7b) and [`LeoLM/leo-hessianai-13b`](https://huggingface.co/LeoLM/leo-hessianai-13b) (70b also coming soon! 👀) under the [Llama-2 community license](https://ai.meta.com/llama/license/). In addition, we construct evaluation set for benchmarking capabilities of german language models to standardize model comparison, similar to widely adopted english based evals, as provided for instance by [lm-harness-eval](https://github.com/EleutherAI/lm-evaluation-harness) or [LLM-Foundry](https://github.com/mosaicml/llm-foundry).
With this release, LAION and Hessian.AI are poised to significantly enhance German open-source and commercial LLM research, fostering new opportunities and expediting widespread adoption.

Try out  [**LeoLM/leo-hessianai-7b-chat**](https://huggingface.co/spaces/LeoLM/leo-hessianai-7b-chat) and [**LeoLM/leo-hessianai-13b-chat**](https://huggingface.co/spaces/LeoLM/leo-hessianai-13b-chat) on HuggingFace Spaces!

*[[Read in German]](/blog-de/leo-lm)*

## Introduction

Since the release of the original Llama Foundation Models <sup>1</sup> in January of 2023, the open-source and academic research community
has experienced a rapid acceleration in the development of increasingly capable language models. The advances
of the past weeks have brought the strongest Llama-2 <sup>2</sup>  based models closer to competing with OpenAI's ChatGPT based on GPT-3.5 or even the stronger GPT4 in some cases.
Nevertheless, a noteworthy constraint persists: the majority of these groundbreaking advancements remain confined to the realm of the English language.
This limitation stems mainly from large open-source models having been trained on predominantly mono-lingual English data. While there has been some
research into second-language or multilingual finetuning, most resulting models are limited in their capabilities and suffer from the US-centric bias inherent to English data.

We seek to alleviate these issues in the case study of the German language by applying many of today's state-of-the-art techniques to develop a truly capable,
localized, and bilingual LLM.
To this end, we present LeoLM (**L**inguistically **E**nhanced **O**pen **L**anguage **M**odel), a suite of Llama-2-based German foundation
models, and an assortment of accompanying finetunes.
Further, we present GermanBench, a collection of the most relevant English Benchmarks translated into German, allowing us to evaluate LeoLM's capabilities thoroughly.

<sup>1</sup> [Touvron et al. 2023a](https://arxiv.org/abs/2302.13971)
<sup>2</sup> [Touvron et al. 2023b](https://arxiv.org/abs/2307.09288)

## Stage-2 Pretraining

Llama-2 models are pretrained on 2 trillion tokens of predominantly English text. To enhance their proficiency in the German language, we employ a Stage 2 pretraining methodology.
We initialize LeoLMs using Llama-2 weights and continue training the model on a large German text corpus of 65 billion tokens of deliberately filtered and deduplicated web text built from the [OSCAR-2301 corpus](https://huggingface.co/datasets/oscar-corpus/OSCAR-2301).
A significant aspect of this approach is mitigating the forgetting or loss of previously learned knowledge or capabilities. We follow the findings by [Gupta et al. (2023)](https://arxiv.org/abs/2308.04014) in our choice of hyperparameters to minimize the risk of forgetting.
Additionally, we follow work by [Together](https://huggingface.co/togethercomputer/LLaMA-2-7B-32K) in employing [linear RoPE scaling](https://kaiokendev.github.io/til#extending-context-to-8k) and [Flash Attention 2](https://tridao.me/publications/flash2/flash2.pdf) to improve training efficiency and double context length to 8k tokens.
See Figure 1 for an overview of all training hyperparameters.

![training_parameters](/images/blog/training_params.png "Training Hyperparameters")

## Finetuning Datasets

There is much debate on what a good chat/instruction tuning dataset must offer, sparking the development of a plethora of different, successful approaches. We take inspiration from this diversity and, to bring similar capabilities to German, translate an assortment of high-quality instruction datasets to German using OpenAI's `gpt-3.5-turbo` API. Using `gpt-3.5-turbo` ensures that the context between prompts and responses remains intact and that complex instructions, potentially containing code, equations, or formatted data, are accurately translated.
Building on community findings, we select a variety of datasets to translate and use to train our chat model.
The translated datasets are:

- [OpenPlatypus](https://huggingface.co/datasets/garage-bAInd/Open-Platypus) -> [OpenSchnabeltier](https://huggingface.co/datasets/LeoLM/OpenSchnabeltier)
- [OpenAssistant OASST1](https://huggingface.co/datasets/OpenAssistant/oasst_top1_2023-08-25) -> [OpenAssistant-DE](https://huggingface.co/datasets/OpenAssistant/OASST-DE)

Moreover, we use [`FreedomIntelligence/evol-instruct-deutsch`](https://huggingface.co/datasets/FreedomIntelligence/evol-instruct-deutsch) and [`FreedomIntelligence/alpaca-gpt4-deutsch`](https://huggingface.co/datasets/FreedomIntelligence/alpaca-gpt4-deutsch) from the [MultilingualSIFT](https://github.com/FreedomIntelligence/MultilingualSIFT) project. Thanks to the authors for sharing their data!
To facilitate bilingual use, we also train models on a combination of these translated datasets and their original, English counterparts.

Finally, to make up for weaknesses in creative writing and rhyming identified during early tests, we curate two more datasets:

- [GPT4 Poems](https://huggingface.co/datasets/LeoLM/German_Poems): A set of German poems about different topics written by GPT4
- [GPT4 Songs](https://huggingface.co/datasets/LeoLM/German_Songs): A collection of German songs and following analyses written by GPT4.

## Evaluation and Results

Evaluating the capabilities of LLMs, especially chat models, is complex, and the best methods are still up for debate. Benchmarks based on multiple choice that are evaluated via the model's log-probabilities (as in the [Open LLM Leaderboard]()) are one currently popular method. Another method automatically evaluates responses using GPT4, as in AlpacaEval or MT-Bench. This approach is more geared toward chat models, as it considers the quality of model responses in real-life tasks. To be as comparable as possible, we directly translate a set of English benchmarks to German. We release these datasets in our [HF Organization](https://huggingface.co/LeoLM) and with more detailed documentation [on GitHub](https://github.com/bjoernpl/GermanBenchmark), and you can find the corresponding `lm-evaluation-harness` fork [here](https://github.com/bjoernpl/lm-evaluation-harness-de/tree/mmlu_de) and the `FastEval` fork [here](https://github.com/bjoernpl/FastEval).

In Figure 3, you can see a comparison of LeoLM versus the base Llama-2 models on a selection of Benchmarks with both the English version (blue) and our translated version (green). Our training improves benchmark scores on the German tasks while slightly reducing scores on English tasks. Notably, the mean increase in German benchmark scores significantly outweighs the mean decrease in performance on English benchmarks, showing that our approach enables learning a new language without forgetting what was previously learned. Why the scores remain lower in German than English is an open question but may be partially attributed to quality degradation during translation.

![](/images/blog/benchmarks.png)

The following table shows the results on our translated version of MT-Bench. MT-Bench is a benchmark that evaluates multi-turn performance on a curated set of 80 questions from multiple categories using GPT-4 as a judge. In this, GPT-4 evaluates the prompts on a scale from 1-10 with regard to perceived helpfulness, relevance, accuracy, depth, creativity, and level of detail of the response. The monolingual `leo-hessianai-13b-chat` model performs best overall, even coming close to GPT-3.5 in the "humanities" topic. It scores noticeably poorly in math and coding, which is somewhat to be expected given that the Llama-2 models inherently fall short on this without very explicit finetuning. The bilingual models score slightly below their monolingual counterparts in some categories such math and reasoning while exceeding in coding and extraction.

![](/images/blog/mt_bench.png)
For a more detailed evaluation, stay tuned for our paper!

## Qualitative Results

Benchmarks tend to be pretty abstract. To get a better feeling for LeoLM's check out our demos and try it yourself: [**LeoLM/leo-hessianai-7b-chat**](https://huggingface.co/spaces/LeoLM/leo-hessianai-7b-chat) and the bigger sibling [**LeoLM/leo-hessianai-13b-chat**](https://huggingface.co/spaces/LeoLM/leo-hessianai-13b-chat). Alternatively, you can run the model yourself using 🤗Transformers. Find more info on how to set this up on the [model card](https://huggingface.co/LeoLM/leo-hessianai-13b-chat).

## Conclusion

Our research has several key contributions:

- We release a suite of German Foundation Language Models with a permissive license.
- We transfer a thorough and multi-faceted evaluation approach for base and chat models into German.
- We demonstrate that large-scale continued pretraining is possible even for data-saturated models such as Llama-2 without significant forgetting or loss of previous capabilities.
- We present a diverse suite of instruction/chat-tuning datasets translated from English to German to serve as a basis for Germany's open-source LLM research community.

Overall, the LeoLM model suite is a proof-of-concept of language acquisition for pretrained models. Moreover, it presents itself as the first openly available German Foundation Model that meets today's standards. We at LAION hope to kickstart the German open-source research community to reduce dependence on closed-source commercial sources such as OpenAI. Have fun with LeoLM!

## Acknowledgments

This project was led by Björn Plüster with support, guidance and supervision by Christoph Schuhmann (LAION), Patrick Schramowski (LAION, Hessian.AI, DFKI) and Jenia Jitsev (LAION, Juelich Supercomputing Center, Helmholtz Research Center Juelich).
We would like to thank the folks at hessian.AI, especially Wolfgang Stille, Kristian Kersting, Florian Kieser and Patrick Diem
for their generous compute sponsorship via the Hessian.AI Innovation Lab (funded by the Hessian Ministry for Digital Strategy and Innovation) and the hessian.AISC Service Center (funded by the Federal Ministry of Education and Research (BMBF)), and their support throughout the training process!  Many thanks also to Jae Hee Lee from the
University of Hamburg and community members at LAION for their helpful feedback. Special thanks also go to hessian.AI's
Innovation Lab, the AI service centre hessian.AISC and the German Center for Artificial Intelligence (DFKI).

---

### An Example

**User:**  Warum ist open-source besonders in der KI-Forschung wichtig?

**LeoLM:**
Open-Source spielt eine wichtige Rolle in der KI-Forschung, da sie Zusammenarbeit, Innovation und Zugang zur Technologie fördert. Hier sind einige Gründe, warum Open-Source in der KI-Forschung besonders wichtig ist:

- Zusammenarbeit: Durch Open-Source können Forscher gemeinsam an Projekten arbeiten, Ideen austauschen und voneinander lernen. Dies fördert die Zusammenarbeit zwischen Forschern und kann zu schnelleren und effizienteren Fortschritten in der KI-Forschung führen.

- Transparenz: Open-Source ermöglicht Transparenz und Reproduzierbarkeit in der KI-Forschung. Forscher können den Code und die Methoden anderer sehen, reproduzieren und darauf aufbauen, was die Validierung von Ergebnissen und die Identifizierung potenzieller Schwachstellen erleichtert.

- Zugang zur Technologie: Open-Source macht KI-Technologien und -Werkzeuge einem breiteren Publikum zugänglich. Dies ermöglicht kleineren Forschungseinrichtungen und Einzelpersonen den Zugang zu KI-Werkzeugen, die ihnen sonst möglicherweise nicht zur Verfügung stünden. Dadurch kann Innovation und Forschung auch außerhalb traditioneller Zentren gefördert werden.

- Innovation: Open-Source fördert Innovation in der KI-Forschung, indem sie Raum für Experimente und neue Ideen bietet. Da der Code offen und für alle zugänglich ist, können Forscher ihn an ihre spezifischen Bedürfnisse anpassen und neue KI-Werkzeuge und -Technologien entwickeln.

- Lernen: Open-Source ermöglicht es Forschern, voneinander zu lernen. Durch die gemeinsame Nutzung von Code und Methoden können Forscher aus den Erfahrungen anderer lernen und ihre eigenen Forschungsprojekte verbessern.

Zusammenfassend ist Open-Source ein wichtiger Aspekt der KI-Forschung, da er Zusammenarbeit, Transparenz, Zugang zur Technologie, Innovation und Lernen fördert. Dadurch wird die KI-Forschung effizienter, innovativer und zugänglicher für eine breitere Palette von Forschern und Institutionen

| [Link to the PDF with more examples](/documents/leo-lm.pdf) |
|----------|
