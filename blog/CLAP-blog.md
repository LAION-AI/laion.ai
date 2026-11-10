---
title: "Learn Audio-Text Representation with Contrastive Language-Audio Pretraining"
author: "Ke Chen, Tianyu Zhang, Yusong Wu, Yuchen Hui"
date: "April 30, 2023"
previewImg: "/images/blog/CLAP-logo.png"
---

Author: [Ke Chen](www.knutchen.com), [Tianyu Zhang](https://ai.t-zhang.com), [Yusong Wu](https://lukewys.github.io/), [Yuchen Hui]()

## Introduction

We present the Contrastive Language-Audio Pretraining model (CLAP), along with a large-scale audio-text dataset LAION-Audio-630K with 633,526 English (text, audio) pairs — see details in our [ICASSP 2023 paper](https://arxiv.org/abs/2211.06687).

Multimodal learning has been widely used in the field of images, videos, and natural languages. We see promising results in learning the relation between images and corresponding text captions to benefit the understanding, retrieval, and even the generative process of vision data, such as the contrastive language-image model (CLIP). 

Audio also shares abundant information and corresponds to other modalities. Nonetheless, how to leverage the data from other modalities to audios remains a challenge. Though we have seen great contributions made by researchers by relating audio data with texts, and images, such as AudioCLIP and WavCLIP, the utilized datasets are still limited in a small magnitude and the performance seeks for improvement. These existing methods for learning audio representations either ignore the language information or use it in a supervised way, which limits their scalability and generalization.

We introduce our latest work, Contrastive Language-Audio Pretraining (CLAP), to present a large-scale, reliable, and adaptive learning pipeline to learn an efficient audio representation in relation with the natural language descriptions. We demonstrate the detail of this pipeline in the paper [“Large-scale Contrastive Language-Audio Pretraining with Feature Fusion and Keyword-to-Caption Augmentation”](https://arxiv.org/abs/2211.06687), accepted by IEEE International Conference on Acoustics, Speech, and Signal Processing (ICASSP 2023).

## Contribution

The main contribution of CLAP is threefold:

-   We release [LAION-Audio-630K](https://github.com/LAION-AI/audio-dataset), a large collection of 633,526 audio-text pairs from different data sources, such as YouTube videos, podcasts, audiobooks, speech corpora, etc. This collection covers various domains and languages and provides a rich resource for audio research.
    
-   We propose a contrastive language-audio pretraining model by considering different audio encoders and text encoders. We conduct comprehensive experiments to determine the best combination of audio and text encoders that yield promising results on targets in terms of both contrastive learning and downstreaming tasks. 
    
-   We introduce two novel techniques to enhance the pretraining process: feature fusion and keyword-to-caption augmentation. Feature fusion makes CLAP act as one single model adaptive to variable-length audio inputs. Keyword-to-caption augmentation generates synthetic captions from keywords extracted from real captions to increase the diversity of text inputs, thus enriching the datasets for training purposes

## Open -Source Information
We release:
-   The CLAP code: [https://github.com/LAION-AI/CLAP](https://github.com/LAION-AI/CLAP)
-   The LAION-Audio-630K dataset: [https://github.com/LAION-AI/audio-dataset](https://github.com/LAION-AI/audio-dataset) 
- PyPI library laion_clap: [https://pypi.org/project/laion-clap/](https://pypi.org/project/laion-clap/)
You can install our model with “pip install laion_clap”. With few lines of code you will be able to download the pretrained checkpoint and compute audio or text embedding using our model. Please refer more details in [https://github.com/LAION-AI/CLAP/tree/main#quick-start](https://github.com/LAION-AI/CLAP/tree/main#quick-start)
![](https://raw.githubusercontent.com/tianyu-z/cloudimage/main/img20230430182549.png)
Also, we would like to announce that our CLAP is supported by [Huggingface transformers](https://huggingface.co/docs/transformers/v4.27.2/en/model_doc/clap) (Thanks [Younes Belkada](https://huggingface.co/ybelkada) and [Arthur Zucker](https://huggingface.co/ArtZucker) for implementing these codes).

## State-of-The-Art Performance
As shown in the below tables, CLAP achieves the state-of-the-art results on many audio downstreaming tasks, including text-audio retrieval and audio classification tasks of different types of sounds, such as environmental sounds, urban sounds, sound effects and music genres. Moreover, the downstreaming tasks can be performed in a zero-shot setting, where CLAP does not need to know what classification targets are assigned to each specific task.

### Tables : The text-to-audio retrieval performance on AudioCaps
| Model                     | T-A Retrieval: R@1 | T-A Retrieval: R@5 | T-A Retrieval: R@10 | A-T Retrieval: R@1 | A-T Retrieval: R@5 | A-T Retrieval: R@10 |
|:-------------------------:|:------------------:|:------------------:|:-------------------:|:------------------:|:------------------:|:-------------------:|
| MMT                       | 36.1               | 72                 | 84.5                | 39.6               | 76.8               | 86.7                |
| ML-ACT                    | 33.9               | 69.7               | 82.6                | 39.4               | 72                 | 83.9                |
| Microsoft CLAP            | 34.6               | 70.2               | 82                  | 41.9               | 73.1               | 84.6                |
| LAION-CLAP (ours)         | 36.1               | 71.8               | 83.9                | 46.8               | 82.9               | 90.7                |
| LAION-CLAP-fusion (ours)  | 35.1               | 71.9               | 83.7                | 44.2               | 80.8               | 90.3                |

### Tables : The text-to-audio retrieval performance on Clotho Eval.
| Model                     | T-A Retrieval: R@1 | T-A Retrieval: R@5 | T-A Retrieval: R@10 | A-T Retrieval: R@1 | A-T Retrieval: R@5 | A-T Retrieval: R@10 |
|:-------------------------:|:------------------:|:------------------:|:-------------------:|:------------------:|:------------------:|:-------------------:|
| MMT                       | 6.7                | 21.6               | 33.2                | 7                  | 22.7               | 34.6                |
| ML-ACT                    | 14.4               | 36.6               | 49.9                | 16.2               | 37.6               | 50.2                |
| Microsoft CLAP            | 16.7               | 41.1               | 54.1                | 20                 | 44.9               | 58.7                |
| LAION-CLAP (ours)         | 16.1               | 38.3               | 51.1                | 22.7               | 48.5               | 60.8                |
| LAION-CLAP-fusion (ours)  | 16.9               | 41.6               | 54.4                | 24.4               | 49.3               | 65.7                |

### Tables : The zero-shot and supervised audio classification results.
| Model             | ESC-50: Zero-Shot | US8K: Zero-Shot | GTZAN: Zero-Shot | GTZAN: Supervised | VGGSound: Zero-Shot | VGGSound: Supervised | FSD50K: Supervised |
|:-----------------:|:-----------------:|:---------------:|:----------------:|:-----------------:|:-------------------:|:--------------------:|:------------------:|
| Wav2CLIP          | 41.4              | 40.4            | -                | -                 | 10                  | 46.6                 | 43.1               |
| AudioClip         | 69.4              | 65.3            | -                | -                 | -                   | -                    | -                  |
| Microsoft CLAP    | 82.6              | 73.2            | -                | -                 | -                   | -                    | 58.6               |
| LAION-CLAP (ours) | 91                | 77              | 73               | -                 | 46.2                | 75.3                 | 59.7               |
| Current SoTA      | 82.6              | 73.2            | 62               | 83.9              | 10                  | 64.1                 | 65.6               |


## Methodology
![](https://raw.githubusercontent.com/tianyu-z/cloudimage/main/img20230430182649.png)
The overall pipeline of CLAP consists of four steps:

## Data collection

We collect 633K audio-text pairs from various sources for training, validation, and testing of CLAP. We also filter out noisy or irrelevant pairs based on length and language criteria.

## Data preprocessing

We convert raw audio waveforms inputs into log-mel spectrograms using Short-Time Fourier Transform (STFT) with a window size of 25 ms and a hop size of 10 ms. We also tokenize text inputs using SentencePiece with a vocabulary size of 32K.

## Training

We select different combinations of audio encoders and text encoders on LAION-Audio-630K using contrastive loss function. For audio encoders, we use the current state-of-the-art audio classification models: HST-AT and PANN. For text encoders, we use BERT, RoBERTa, and CLIP text transformer. We apply feature fusion by concatenating log-mel spectrogram features at different time steps via attentional feature fusion[8]. We also apply keyword-to-caption augmentation by generating synthetic captions from keywords from T5 models.

## Inference 

After finishing the training of the model, CLAP can be applied into many audio downstream tasks by two ways: the zero-shot inference or the supervised finetuning. For example, the below figures show these applications on the audio classification task. For the zero-shot inference, an audio file can be sent into CLAP’s audio encoder to obtain the audio embedding. Then for any class candidates, we prompt texts such as “This is the sound of \[Class\]” and obtain the text embeddings corresponding to them. The audio classification is performed by finding the best matching between the audio embedding and the group of text embeddings. For the supervised finetuning, we connect the pretrained audio encoder with a projection layer module and finetune the model with supervised data. Then we perform the audio classification.
![](https://raw.githubusercontent.com/tianyu-z/cloudimage/main/img20230430182748.png)
## Conclusion
In this blog post, we have introduced our new paper that proposes a novel pipeline of contrastive language-audio pretraining (CLAP), which aims at learning better audio understanding and getting more audio data by combining audio data with natural language descriptions in a self-supervised manner. We have also shown how CLAP achieves state-of-the-art results on several downstream tasks, such as text-to-audio retrieval and audio classification.

If you are interested in learning more about CLAP,  you can check the materials of our work:
1.  Code: [GitHub Repository](https://github.com/LAION-AI/CLAP)
2.  PyPI library: [laion_clap](https://pypi.org/project/laion-clap/)
3.  ICASSP 2023 paper: [“Large-scale Contrastive Language-Audio Pretraining with Feature Fusion and Keyword-to-Caption Augmentation”](https://arxiv.org/abs/2211.06687) 
4.  [Huggingface transformers support](https://huggingface.co/docs/transformers/v4.27.2/en/model_doc/clap)