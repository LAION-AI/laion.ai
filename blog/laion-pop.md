---
title: "LAION POP: 600,000 high-resolution images with detailed descriptions"
author: "Christoph Schuhmann, Peter Bevan"
date: "Nov 17, 2023"
previewImg: "/images/blog/laion_pop.jpg"
---

LAION POP is a subset of LAION 5B: This subset comprises 600,000 high-resolution images, each equipped with detailed descriptions. The selection of images was based on 10,000 different concepts popular on the image generation site "Midjourney".

| [SampleOverview](/documents/llava-caption-sample.html) |
|:------------------------------:|
|[LAION-POP Dataset on HuggingFace](https://huggingface.co/datasets/laion/laion-pop)|

<img src="/images/blog/laion_pop.jpg" style="height:384px; width: auto;"/>

## Dataset and Methodology

4.25 million Midjourney images were downloaded from [this huggingface repository](https://huggingface.co/datasets/tarungupta83/MidJourney_v5_Prompt_dataset), and CLIP L14 vectors were generated for each image. Using the k-means clustering method, these vectors were assigned to 10,000 centroids. The CLIP vectors of these centroids were then used to retrieve nearest neighbors from the LAION-5B dataset using the [image search website](https://rom1504.github.io), focusing on those with aesthetic values of at least 0.5 and a minimum resolution of 768 pixels on the shortest side. Additionally, images suspected of containing watermarks were filtered out. NSFW values were calculated for each image using the LAION CLIP-based-NSFW-Detector, and these are released with the data.

## Generation of LLAVA 1.5 Captions

Detailed image descriptions were created for the selected images using the LLAVA 1.5 model. These descriptions focus on objects, backgrounds, scenery, interactions, and gestures, as well as the appearance and emotions of the depicted people or characters.

## PROMPT

"Can you please describe this image in up to two paragraphs? Please specify any objects within the image, backgrounds, scenery, interactions, and gestures or poses. If they are multiple of any object, please specify how many. Is there text in the image, and if so, what does it say? If there is any lighting in the image, can you identify where it is and what it looks like? What style is the image? If there are people or characters in the image, what emotions are they conveying? Please keep your descriptions factual and terse but complete. DO NOT add any unnecessary speculation about the things that are not part of the image such as "the image is inspiring to viewers" or "seeing this makes you feel joy". DO NOT add things such as "creates a unique and entertaining visual", as these descriptions are interpretations and not a part of the image itself. The description should be purely factual, with no subjective speculation. Make sure to include the style of the image, for example cartoon, photograph, 3d render etc. Start with the words ‘This image showcases’:”

‘This image showcases’ was trimmed from the beginning of each caption upon generation.

## Future Application and Improvements

Although no text-to-image model has been tuned with these data so far, we expect that the use of these data could significantly improve the aesthetic quality of the outputs.





