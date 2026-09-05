---
title: "Announcing OpenFlamingo: An open-source framework for training vision-language models with in-context learning"
author: "Anas Awadalla and Irena Gao"
date: "Mar 28 2023"
previewImg: "/images/blog/flamingo-logo.png"
---

**Overview.**
We are thrilled to announce the release of OpenFlamingo, an open-source reproduction of DeepMind's Flamingo model. At its core, OpenFlamingo is a framework that enables training and evaluation of large multimodal models (LMMs). Check out our [GitHub repository](https://github.com/mlfoundations/open_flamingo) and [demo](https://7164d2142d11.ngrok.app) to get started!

For this first release, our contributions are as follows:

* 🏋️ A Python framework to train Flamingo-style LMMs (based on Lucidrains' [flamingo implementation](https://github.com/lucidrains/flamingo-pytorch) and David Hansmair's [flamingo-mini repository](https://github.com/dhansmair/flamingo-mini)).
* 🪅 A large-scale multimodal dataset with interleaved image and text sequences.
* 🧪 An in-context learning evaluation benchmark for vision-language tasks.
* 🤖 A first version of our OpenFlamingo-9B model based on LLaMA, with much better models to come!


The recent progress in open-source LMMs with the release of [BLIP-2](https://arxiv.org/abs/2301.12597) and [FROMAGe](https://jykoh.com/fromage) has shown the exciting potential of multimodal systems. We hope that OpenFlamingo will help drive progress in multimodal machine learning, and we have more exciting contributions in the pipeline, so stay tuned! 


**Goal.**
Our goal with OpenFlamingo is to develop a multimodal system that can tackle a diverse range of vision-language tasks. Ultimately, we aim to match the power and versatility of GPT-4 in handling visual and text input. To achieve this goal, we are creating an open-source version of [DeepMind's Flamingo](https://www.deepmind.com/blog/tackling-multiple-tasks-with-a-single-visual-language-model) model, a LMM capable of processing and reasoning about images, videos, and text. We are committed to build fully open-source models, and believe this transparency is essential for fostering collaboration, accelerating progress, and democratizing access to state-of-the-art LMMs. Our release is the first step towards this goal.

We are sharing the first checkpoint of our OpenFlamingo-9B model. While the model is not yet fully optimized, it demonstrates the potential of this project. By working together and receiving feedback from the community, we can train better LMMs. We encourage the community to participate in the development process by providing feedback and contributing to the repository. 


**Technical Details.**
Our implementation largely follows that of [Flamingo](https://arxiv.org/abs/2204.14198). Flamingo models are trained on large-scale web corpora containing interleaved text and images, which is crucial for endowing them with in-context few-shot learning capabilities. OpenFlamingo implements the same architecture (Perceiver resamplers, cross-attention layers) proposed in the original Flamingo paper. However, since the training data for Flamingo is not available to the public, we use open-source datasets for training our models. Specifically, the released OpenFlamingo-9B checkpoint is trained on 5M samples from our new Multimodal C4 dataset and 10M samples from [LAION-2B](https://huggingface.co/datasets/laion/laion2B-en). 


## **Multimodal C4**

The Multimodal-C4 dataset is an expansion of the text-only [C4 dataset](https://www.tensorflow.org/datasets/catalog/c4), which was used to train  [T5 models](https://arxiv.org/abs/1910.10683). This dataset is built by our collaborators [Jack Hessel](https://jmhessel.com) and [Wanrong Zhu](https://wanrong-zhu.com) at the Allen Institute for AI. For each document in the [C4 en.clean](https://www.tensorflow.org/datasets/catalog/c4#c4en_default_config) dataset, we retrieve the original webpage from [Common Crawl](https://commoncrawl.org/), then collect the downloadable images. Data cleaning is carried out through deduplication and content filtering, which aims to eliminate non-safe for work (NSFW) and unrelated images, such as advertisements. Additionally, we run face detection and discard images with positive identifications. Finally, images and sentences are interleaved using bipartite matching within a document: CLIP ViT/L-14 image-text similarities serve as edge weights. Multimodal-C4 consists of approximately 75 million documents, encompassing around 400M images and 38B tokens. A full release with more detail is coming soon.

![](/images/blog/mmc4-example.png)

## **Benchmark**

To measure the performance of OpenFlamingo, we evaluate on a diverse set of downstream tasks. Our aim is to eventually build an open-source version of Flamingo’s benchmark and extend past that to standardize vision-language task evaluation. Currently we support visual question-answering ([VQAv2](https://visualqa.org/index.html), [OK-VQA](https://okvqa.allenai.org)), captioning ([COCO](https://cocodataset.org/#home), [Flickr30k](https://www.kaggle.com/datasets/hsankesara/flickr-image-dataset)), and image classification ([ImageNet](https://image-net.org/index.php)) tasks. Expect us to add many more evaluation sets that probe model reasoning, biases, and more! You can access the benchmark on the OpenFlamingo repo. 


## **Model release**

![](/images/blog/flamingo-llama.png)

As part of our release, we are also providing a checkpoint from our under-development OpenFlamingo-9B, a LMM built on top of [LLaMA 7B](https://ai.facebook.com/blog/large-language-model-llama-meta-ai/) and [CLIP ViT/L-14](https://openai.com/research/clip). This model is still a work in progress but it can already bring a lot of value to the community. For instance,

![](/images/blog/flamingo-9B-sample-one.png)
![](/images/blog/flamingo-9B-sample-two.png)

**Performance**

We evaluated our checkpoint on COCO and VQAv2. Here we report the validation performance using a different number of shots. 

COCO (CIDEr)
<table>
  <tr>
   <td>
   </td>
   <td>0-shot
   </td>
   <td>4-shot
   </td>
   <td>8-shot
   </td>
   <td>16-shot
   </td>
   <td>32-shot
   </td>
  </tr>
  <tr>
   <td>OpenFlamingo-9B*
   </td>
   <td>65.5
   </td>
   <td>74.3
   </td>
   <td>79.3
   </td>
   <td>81.8
   </td>
   <td>84.5
   </td>
  </tr>
  <tr>
   <td>DeepMind Flamingo-9B
   </td>
   <td>79.4
   </td>
   <td>93.1
   </td>
   <td>99.0
   </td>
   <td>102.2
   </td>
   <td>106.3
   </td>
  </tr>
</table>

---

VQAv2 (VQA accuracy)
<table>
  <tr>
   <td>
   </td>
   <td>0-shot
   </td>
   <td>4-shot
   </td>
   <td>8-shot
   </td>
   <td>16-shot
   </td>
   <td>32-shot
   </td>
  </tr>
  <tr>
   <td>OpenFlamingo-9B*
   </td>
   <td>43.5
   </td>
   <td>44.0
   </td>
   <td>47.5
   </td>
   <td>48.9
   </td>
   <td>50.3
   </td>
  </tr>
  <tr>
   <td>DeepMind Flamingo-9B
   </td>
   <td>51.8
   </td>
   <td>56.3
   </td>
   <td>58.0
   </td>
   <td>59.4
   </td>
   <td>60.4
   </td>
  </tr>
</table>


*Note that we report validation performance (using the same setup outlined in Flamingo paper) for OpenFlamingo-9B while DeepMind Flamingo-9B performance is on test data.

**Safety and ethical considerations**

As OpenFlamingo-9B is built on top of frozen [LLaMA](https://arxiv.org/abs/2302.13971) and [CLIP](https://arxiv.org/abs/2103.00020) models, you can expect OpenFlamingo to inherit the harms of the parent models. We understand that by releasing these models, they may be used in harmful ways. However, it is important for the research community to study the harms of large multimodal models, and we believe that open-sourcing these models will enable the community to develop better ways to mitigate these harms in future models.

We emphasize that OpenFlamingo-9B is a research artifact and not a finished product. It can produce unintended, inappropriate, offensive, and/or inaccurate results. We thus advocate for caution and thorough evaluations before using our models in any real applications.


### Contributions

**Thanks to:**

* [Josh Gardner](https://homes.cs.washington.edu/~jpgard/) and [Yonatan Bitton](https://yonatanbitton.github.io/) for implementing the evaluation benchmark.
* [Kalyani Marathe](https://kalyani7195.github.io/) for implementing the data pipeline and improving code quality.
* [Yusuf Hanafy](https://www.linkedin.com/in/yusufhanafy/) for working on the demo.
* [Wanrong Zhu](https://wanrong-zhu.com/), [Jack Hessel](https://jmhessel.com/), and [Samir Gadre](https://sagadre.github.io/) for building the Multimodal C4 dataset.
* [Jenia Jitsev](https://scholar.google.de/citations?user=p1FuAMkAAAAJ&hl=en) for helping us with large scale training.
* [Mitchell Wortsman](https://mitchellnw.github.io/), [Gabriel Ilharco](https://gabrielilharco.com/), [Simon Kornblith](https://simonster.com/), [Pang Wei Koh](https://koh.pw/) for technical discussions and for feedback on this blog.
* [Ludwig Schmidt](https://people.csail.mit.edu/ludwigs/) for being our main advisor on this project and for their support.


### Acknowledgements

This code is based on Lucidrains' [flamingo implementation](https://github.com/lucidrains/flamingo-pytorch) and David Hansmair's [flamingo-mini repo](https://github.com/dhansmair/flamingo-mini). Thank you for making your code public! We also thank the [OpenCLIP](https://github.com/mlfoundations/open_clip) team as we use their data loading code and take inspiration from their library design.

We would like to thank [Jean-Baptiste Alayrac](https://www.jbalayrac.com/) and [Antoine Miech](https://antoine77340.github.io/) for their advice, [Rohan Taori](https://www.rohantaori.com/), [Nicholas Schiefer](https://nicholasschiefer.com/), [Deep Ganguli](https://hai.stanford.edu/people/deep-ganguli), [Thomas Liao](https://thomasliao.com/), [Tatsunori Hashimoto](https://thashim.github.io/), and [Nicholas Carlini](https://nicholas.carlini.com/) for their help with assessing the safety risks of our release. This research is supported in part by NSF Institute on the Foundations of Machine Learning (IFML). Thanks to [Stability AI](https://stability.ai) for providing us with compute resources to train these models!
