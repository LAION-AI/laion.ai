---
title: "Objaverse-XL: An Open Dataset of Over 10 Million 3D Objects"
author: "Matt Deitke"
date: "Jul 11 2023"
previewImg: "/images/blog/objaverse-xl.jpg"
---

![](/images/blog/objaverse-xl.jpg)

We are thrilled to announce Objaverse-XL, an open dataset of over 10 million 3D objects! Using it, we train Zero123-XL, a foundation model for 3D that displays remarkable generalization abilities. In the landscape of AI, scale has been paramount to recent advances. Over the past decade, we have observed an escalating trend of leveraging large volumes of data to train machine learning models, particularly in NLP and 2D vision. But what about 3D vision tasks? Despite the burgeoning demand for augmented reality (AR) and virtual reality (VR) applications, advancements in 3D vision have lagged, primarily due to the scarcity of high-quality 3D data.

Objaverse 1.0, released back in December, was a step in the right direction, and enabled exciting research like Zero-1-to-3 for novel view synthesis and single view 3D reconstruction. But, it was still quite small, being on the order of 800K objects. With Objaverse-XL, we scale up the number of 3D objects that we use from 800K to over 10 million deduplicated 3D objects, pulling in objects from a variety of sources.

![](/images/blog/dataset-distribution.jpg)

Objaverse-XL is a curated amalgamation of 3D objects from various internet sources. It includes objects from GitHub, sourced from over 500k repositories, along with assets from platforms like Thingiverse, Sketchfab, Polycam, and the Smithsonian 3D Digitization project. The result is a remarkable collection of over 10 million unique 3D objects, each coming with its metadata. The figure above shows a t-SNE projection of CLIP L/14 embeddings on a subset of rendered objects. Compared to Objaverse 1.0 (orange), Objaverse-XL more densely captures the distribution of 3D assets.

With Objaverse-XL, we train Zero123-XL. Leveraging the view-conditioned diffusion model proposed by Zero123, the Zero123-XL model was pretrained on a larger dataset, Objaverse-XL, to yield better zero-shot generalization performance. Remarkably, we find that the enhanced pre-training on Objaverse-XL enables the model to generalize significantly better to challenging data categories like people, cartoons, and sketches. It showed improvements in generating novel views that both maintained original style and object geometric details. Further testing on the Google Scanned Objects dataset also showed that as the dataset size increased, so did the visual similarity score between predicted and actual views. Finally, alignment fine-tuning on a high-quality subset of Objaverse-XL led to significant improvement in the model's alignment with human preferences, illustrating the potential of large-scale pretraining and strategic finetuning in advancing 3D vision.

![](/images/blog/zero123-xl.jpg)

In the figure above, we show novel view synthesis on in-the-wild images (either coming from internet searches or text-to-image models). It shows a comparison between Zero123-XL trained on Objaverse-XL and Zero123 trained on Objaverse. Starting from the input view, the task is to generate an image of the object under a specific camera pose transformation. The camera poses are shown beside each example. Significant improvement can be found by training with more data, especially for categories including people (1st row), anime (2nd row), cartoon (3rd row), furniture (4th row), and sketches (5th row). Additionally, viewpoint control is significantly improved (see 2nd row).

We are thrilled to see what the community is able to build with Objaverse-XL! More information for accessing the dataset, models, and code will be provided soon!

### Acknowledgements

Objaverse-XL was a joint effort between several teams, including the Allen Institute for AI,
Columbia University, the University of Washington, Stability AI, LAION, and Caltech.

Ruoshi Liu did a tremendous job leading the Zero123-XL efforts!
The rest of the fantastic team includes Matthew Wallingford, Huong Ngo, Oscar Michel, Aditya Kusupati, Alan Fan, Christian Laforte, Vikram Voleti, Samir Yitzhak Gadre, Eli VanderBilt, Aniruddha Kembhavi, Carl Vondrick, Georgia Gkioxari, and Kiana Ehsani, and was co-advised primarily by Ludwig Schmidt and Ali Farhadi.

We would like to thank Stability AI for compute used to train the experiments and LAION for
their support. We would also like to thank Luca Weihs, Mitchell Wortsman, Romain Beaumont,
and Vaishaal Shankar, Rose Hendrix, Adam Letts, Sami Kama, Andreas Blattmann, Kunal Pratap
Singh, and Kuo-Hao Zeng for their helpful guidance and conversations with the project. Finally,
we would like to thank the teams behind several open-source packages used throughout this project,
including Blender, PyTorch, PyTorch Lightning, D3, Matplotlib, NumPy,
Pandas, Wandb, and Seaborn. We would also like to
acknowledge the use of LLMs for helping revise some text and general coding assistance. Finally, we
would also like to thank and acknowledge the content creators who contributed to the dataset.
