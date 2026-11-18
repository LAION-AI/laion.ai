---
title: "Training a Binary Classifier to Distinguish Images Generated with Stable Diffusion (v1.4) from Real Ones"
author: "Christoph Schuhmann, Ilia Zaitsev"
date: "Apr 12 2023"
previewImg: "/images/blog/realfake-classifier-front.png"
---

We present the development and assessment of a binary classifier designed to distinguish between authentic images and images generated 
using Stable Diffusion (SD) v1.4. We will discuss the dataset employed, describe the model architecture, outline the training process, 
and present the results obtained. Furthermore, we will explore potential future work aimed at enhancing the classifier's performance. 
The source code, training parameters, and model weights are [available in this repository](https://huggingface.co/realfakerepo/realfake).

### Dataset

The training dataset was assembled in two steps. First, four image datasets were merged:

1. [`imagenet-1k`](https://huggingface.co/datasets/imagenet-1k): A widely used subset of ImageNet spanning 1,000 object classes.
2. [`laion2B-en-aesthetic`](https://huggingface.co/datasets/laion/laion2B-en-aesthetic) (parts 400 to 699): A subset of images from the LAION-5B dataset, estimated to be [aesthetic](https://github.com/LAION-AI/laion-datasets/blob/main/laion-aesthetic.md) by a model trained on top of CLIP embeddings.
3. [`imagenet-1k-SD-1.4`](https://huggingface.co/datasets/ChristophSchuhmann/Imagenet-1k-SD-1.4): A newly-created dataset that serves as a "twin" to the "real" `imagenet-1k`, containing the same 1,000 classes but generated using Stable Diffusion v1.4 with a variety of prompts per class.
4. [`DiffusionDB 2M`](https://huggingface.co/datasets/poloclub/diffusiondb): The first large-scale text-to-image prompt dataset.

Second, two million images were sampled from the merged data, ensuring an equal distribution of real and SD-generated images. Around 10% of that data 
is put aside as a validation subset to track the prediction quality during the training process. The following table shows the number of records 
assigned to each subset. This diverse and balanced dataset provided a solid foundation for training the model.

| Label \ Subset | Training | Validation |
|----------------|----------|------------|
|      fake      |  898785  |   101215   |
|      real      |  899986  |   100014   |

The specific list of samples used in training is stored in the [`metadata/prepared.2000k.jsonl`](https://huggingface.co/realfakerepo/realfake/tree/main/metadata) file available in the repository. Each record includes information about its subset and path to the sample stored on a local disk. 
This allows for flexible selection of images for training and validation. Additionally, the folder contains smaller prepared subsets used for debugging purposes. Note that for the `imagenet-1k` dataset, the training and validation subsets were prepared such that the classes of images do not overlap.

### Model Architecture and Training Process

We selected a straightforward model architecture utilizing a fine-tuned [ConvNext Large](https://pytorch.org/vision/main/models/generated/torchvision.models.convnext_large.html) model with approximately 200 million parameters. This choice was made to obtain quick results using 8x A100 GPUs on the Stability AI cluster.

The training process employed a One-Cycle learning rate scheduler, AdamW optimizer, and basic augmentations such as affine transformations, crops, and cutouts. The model was trained for five epochs starting from pre-trained weights (imagenet-1k) with all layers unfrozen from the beginning. Investigating more sophisticated training strategies is beyond the scope of this work but may be interesting for future research.

### Results

The trained classifier achieved close to 99% accuracy on the validation dataset described in the #Dataset section. Further testing of the model's generalization capability in distinguishing between real and SD-generated images was performed by creating _an additional, out-of-sample test set_. 
It comprised 2,500 images generated with SDv1.4 using a set of prompts proposed by LLM, with each prompt generating 100 different images. In addition,
the test set included 2,500 images from the `imagenet-1k` validation set. Therefore, none of the test set images is seen during the training process.

The following plots illustrate the model's confidence levels. Analyzing the results, several interesting conclusions can be drawn:
* Views of nature, construction works, and furniture often cause confusion.
* Real images with visual noise or uncommon objects are mistakenly classified as generated images.
* Images with visually distinguishable generative artifacts (incorrectly rendered humans, wheels, airplanes, unrealistic lines) are classified as fakes with high confidence.

![](/images/blog/realfake-classifier-real-least-confident.png)
![](/images/blog/realfake-classifier-real-most-confident.png)
![](/images/blog/realfake-classifier-fake-least-confident.png)
![](/images/blog/realfake-classifier-fake-most-confident.png)

As expected, cases with obvious generative model-produced artifacts are easily classified that . For instance, images with humans often include clear artifacts such as unnatural postures or impossible positions. Another interesting class of images pertains to natural landscapes. In some instances, they are easily recognized as fakes, while others confuse the model. This also holds true for construction works and some furniture images.

The inference notebook is available on [Google's Colab](https://colab.research.google.com/drive/1zZR55CpHdKaVQXhZ3yxvOu55jCDkADam).

### Limitations

It is important to note that the current model is still a work in progress. The classifier only saw images produced with Stable Diffusion V1.4, 
with all possible image artifacts that it produces. (See the example below.)

![](/images/blog/realfake-classifier-artifacts.png)

Therefore, it might be the case that the classifier pays attention to those SD-specific artifacts, and wouldn't perform that well on the output 
of other generative models.

Another possible limitation is low image resolution. The classifier resizes images to 256px per side, and further crops it to 224px. It might be difficult to effectively classify high-resolution examples.

Finally, the classifier's quality isn't compared against human's performance. As was mentioned before, some fakes have easily recognized artifacts, while others aren't distinguishable by the human eye because of low resolution. Building a testing dataset assets by humans should give a baseline to better estimate model's performance.

### Future Work

Building on this work, there are several avenues for further exploration:

1. Using various kinds of generative models for building a more challenging dataset to ensure that the classifier works well across 
various generative techniques.
1. Increasing input resolution to ensure that the model can capture fine details.
1. Creating a test set classified by volunteers to establish a quality baseline for better assessing model's performance.
1. Investigating whether the classifier can be used to guide SD models (akin to GANs) to steer them towards generating more realistic images. By providing feedback on the realism of generated images, the classifier might help improve the quality of synthesized images.

### Acknowledgements and Contributions

* Christoph Schuhmann conceived the initial idea of building a binary classifier to distinguish real vs. generated images, prepared the `imagenet-1k-SD` dataset, and guided the development process.
* [Stability AI](https://stability.ai/) provided us with compute resources to store the data and train the classifier.
* The [fast.ai](https://docs.fast.ai/) library was used for quick prototyping of the initial model.
* Scalable training was done via [PyTorch-Lightning](https://lightning.ai/docs/pytorch/stable/).
* Numerous other open-source tools, models, and datasets made this work possible.
