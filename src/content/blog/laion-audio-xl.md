---
title: "LAION-Audio-XL and CLAP2"
author: "Gijs Wijngaard, Felix Förster, Ross Wightman, Marianna Nezhurina, Christoph Schuhmann, Jenia Jitsev, A. Sophia Koepke"
date: "Nov 6, 2026"
previewImg: "/images/blog/laion-audio-xl/preview.jpg"
previewBg: "#0c1a2b"
---

LAION-5B and OpenCLIP gave vision open web-scale data and reproducible scaling laws. LAION-Audio-XL and CLAP2 bring the same to audio.

We release LAION-Audio-XL, a web-scale audio-text corpus, together with CLAP2, a family of five contrastive language-audio models trained on it.

<figure class="stat-strip" aria-label="LAION-Audio-XL in numbers">
  <figcaption class="stat-strip-title">LAION-Audio-XL · dataset</figcaption>
  <div class="stat-strip-cells" style="--n: 4;">
    <div class="stat-strip-cell"><span class="stat-strip-label">Clips</span><span class="stat-strip-value">365M</span><span class="stat-strip-note">up to 30 s each</span></div>
    <div class="stat-strip-cell"><span class="stat-strip-label">Captions</span><span class="stat-strip-value">707M</span><span class="stat-strip-note">short and long</span></div>
    <div class="stat-strip-cell"><span class="stat-strip-label">Audio</span><span class="stat-strip-value">1.39M</span><span class="stat-strip-note">hours</span></div>
    <div class="stat-strip-cell"><span class="stat-strip-label">Collected</span><span class="stat-strip-value">1.48B</span><span class="stat-strip-note">clips before curation</span></div>
  </div>
</figure>

CLAP2 comes in five sizes, from 27M to 340M parameters, all trained from scratch on LAION-Audio-XL. The largest, CLAP2-L, reaches **53.6% on MAEB-30**, a benchmark of 30 speech, music and sound tasks. That is the best score of any model trained from scratch on the MAEB leaderboard, and the smallest, CLAP2-XXS, already **beats every earlier CLAP-style model**, including GLAP, which is 31× larger.

Dataset, captions, model checkpoints and code are all open: [project page](https://projects.laion.ai/clap2/), [code](https://github.com/LAION-AI/clap2), [dataset](https://huggingface.co/datasets/laion/laion-audio-xl), [models](https://huggingface.co/models?search=laion/clap2).

## Why LAION-Audio-XL?

Recent advances in contrastive audio-language models come mainly from the scale and quality of their training data. Compared to vision and language models, **open-weight audio models remain underscaled**. Larger training sets expose models to a broader range of sounds and the words people use to describe them. But the training data behind several recent audio models is not released, and the largest open audio-text corpora so far have fewer hours of audio and fewer captions.

## Building the Dataset

We collected **1.48 billion audio clips** from YouTube, Common Crawl and other web collections, 316 academic datasets and further internet datasets. All audio is converted to 32 kHz mono and cut at silence into clips of up to 120 seconds.

The curation pipeline then runs in four steps:

1. **Clean:** silent or unreadable audio is dropped, exact and near-duplicates are removed, and clips that overlap evaluation sets are filtered out.
2. **Annotate and select:** expert models tag every clip with a sound category and signal statistics, and add language, speaker, emotion, music or species information where it applies. Selection keeps 500M clips that cover a 3,718-class sound taxonomy, thinning common content and protecting rare categories.
3. **Caption:** two audio language models, Qwen3-Omni-30B-A3B-Instruct and MOSS-Audio-8B-Thinking, listen to each clip that has no text yet, read those annotations and write a short and a long caption.
4. **Keep clips up to 30 seconds:** this subset, LAION-Audio-XL, is what we train on. Limiting clips to 30 s gave **better benchmark results at 3.5× less compute** than training on all 500M clips.

<figure style="margin: 1.5rem 0 1rem;">
  <video class="fig-wide" autoplay loop muted playsinline poster="/images/blog/laion-audio-xl/anim-pipeline.jpg" style="display: block; margin: 0 auto; width: 100%;">
    <source src="/images/blog/laion-audio-xl/anim-pipeline.mp4" type="video/mp4">
    <img src="/images/blog/laion-audio-xl/fig-pipeline.png" alt="LAION-Audio-XL curation pipeline from 1.48B collected clips to 365M training clips">
  </video>
  <video class="fig-narrow" autoplay loop muted playsinline poster="/images/blog/laion-audio-xl/anim-pipeline-m.jpg" aria-hidden="true">
    <source src="/images/blog/laion-audio-xl/anim-pipeline-m.mp4" type="video/mp4">
  </video>
  <figcaption style="margin-top: 0.25rem; text-align: center;">Figure 1: <strong>The curation pipeline.</strong> 1.48B collected clips are cleaned to a 1.28B deduplicated pool; 500M are selected and captioned, and the 365M clips of up to 30 s form LAION-Audio-XL.</figcaption>
</figure>

### What is in it

We group LAION-Audio-XL into a sound taxonomy with **11 top-level groups and 3,718 classes** spanning a wide variety of audio domains. Across four broad domains, speech makes up 44.8% of the clips and music 22.4%; the rest is sound effects (16.6%) and other sounds (16.2%), from birds and machinery to kitchens and stadiums.

On the project page you can open each of the 11 groups and listen to example clips.

<a class="link-card" href="https://projects.laion.ai/clap2/#taxonomy">Explore samples <span aria-hidden="true">→</span></a>

Most of the selected clips come without captions. We generate text descriptions for 471M clips. In particular, a set of small expert models first annotates each clip: a taxonomy classifier and signal statistics for every clip, then specialists depending on the predicted category, such as language, speaker age and gender, emotion and pitch for speech, genre, tempo and key for music, and species for animal sounds. The captioning model receives the audio together with these raw annotations and writes a short caption (12 words on average) and a long one (29 words on average).

Here is one clip of German studio speech, with the annotations the captioning model received and the two captions it wrote:

<figure class="stat-strip caption-sample" aria-label="A caption example from LAION-Audio-XL">
  <figcaption class="stat-strip-title">LAION-Audio-XL · sample</figcaption>
  <div class="caption-sample-body">
    <audio controls preload="none" src="/images/blog/laion-audio-xl/sample-speech.mp3"></audio>
    <div class="caption-sample-meta">
      <span><b>Clip</b> 0:21</span>
      <span><b>Category</b> German-language studio read speech</span>
      <span><b>Signal</b> −19 dB RMS, 1.8 kHz bandwidth</span>
      <span><b>Language</b> German</span>
      <span><b>Speaker</b> male, about 64</span>
      <span><b>Emotion</b> happy</span>
      <span><b>Pitch</b> 135 Hz</span>
    </div>
    <div class="caption-sample-block">
      <span class="caption-sample-label">Short caption · 13 words</span>
      <span class="caption-sample-text short">A male voice reads a German-language advertisement for empty freight car storage space.</span>
    </div>
    <div class="caption-sample-block">
      <span class="caption-sample-label">Long caption · 41 words</span>
      <span class="caption-sample-text">A mature male voice reads a formal German-language announcement, likely a radio broadcast or public notice, seeking storage space for empty freight cars at main railway stations in Greater Berlin. The speech is clear and delivered in a steady, neutral tone.</span>
    </div>
    <span class="caption-sample-by">Written by Qwen3-Omni-30B-A3B-Instruct · Audio from <a href="https://www.youtube.com/watch?v=q25cg0yxLMs&amp;t=304s">YouTube</a>, CC BY 3.0</span>
  </div>
</figure>

### Compared with other corpora

LAION-Audio-XL has **more hours of audio and more captions than any other public audio-text corpus**. The 500M selection it is cut from, with clips up to 120 s, is larger still: 3.35M hours and 970M captions.

<figure style="margin: 1.5rem 0 1rem;">
  <img src="/images/blog/laion-audio-xl/fig-compare.png" alt="LAION-Audio-XL compared with existing audio-text datasets by hours, captions and clips" style="display: block; margin: 0 auto;">
  <figcaption style="margin-top: 0.25rem; text-align: center;">Figure 2: <strong>LAION-Audio-XL next to existing audio-text corpora.</strong></figcaption>
</figure>

## CLAP2: The Models

In contrastive language-audio pretraining (CLAP), models learn to map audio recordings and their corresponding text descriptions into a shared embedding space. CLAP2 is a dual encoder in the CLAP family. One tower turns a sound into a vector, the other turns text into a vector, and the cosine similarity between the two says how well they match. This enables text-to-audio search, zero-shot classification and the use of CLAP2 embeddings as audio features in downstream systems.

The audio tower is a NaFlex vision transformer over log-mel spectrogram patches: every 16 × 16 patch becomes one token, 50 tokens per second, so each clip is read at its own length up to 30 seconds instead of being padded or cropped to a fixed window. Both towers are **trained from scratch** and therefore don't depend on pretrained weights. This makes our training recipe transparent and flexible for our scaling study.

## Scaling Laws

We trained all five model sizes on 1M to 1,024M samples seen and measured how the MAEB-30 error falls with training compute. It follows a smooth power law: **each doubling of compute lowers the error by 3.9%**, about +1.8 MAEB-30 points at the largest budget.

<figure style="margin: 1.5rem 0 1rem;">
  <img src="/images/blog/laion-audio-xl/fig-scaling.png" alt="MAEB-30 error against training compute for five CLAP2 sizes, with the fitted scaling law" style="display: block; margin: 0 auto;">
  <figcaption style="margin-top: 0.25rem; text-align: center;">Figure 3: <strong>Error falls predictably with compute.</strong> Each dot is one training run, the dashed line links the best run at each compute budget, and the blue curve is the fitted law with its 95% confidence band.</figcaption>
</figure>

The fit also tells us how to spend a fixed budget. The compute-optimal model size grows as C<sup>0.405</sup>, the optimal amount of training data as C<sup>0.583</sup>: data should grow about 1.4× faster than the model. With more compute, **most of it should go into more data rather than a bigger model**, which is exactly why a corpus of this size matters.

<figure style="margin: 1.5rem 0 1rem;">
  <img src="/images/blog/laion-audio-xl/fig-allocation.png" alt="Compute-optimal model size and samples seen against compute" style="display: block; margin: 0 auto;">
  <figcaption style="margin-top: 0.25rem; text-align: center;">Figure 4: <strong>Spend compute on data first.</strong> The optimal number of samples grows about 1.4× faster than the optimal model size.</figcaption>
</figure>

## Results

Four years of CLAP-style models, from wav2clip in 2021 (28.3%) to GLAP in 2025 (44.1%), raised the best MAEB-30 score by 16 points. **CLAP2-L adds 9.5 more.**

CLAP2 is also **the best choice at its size**. On MAEB-30, CLAP2-XXS to CLAP2-M (27M to 153M parameters) are only beaten by models with at least 8× more parameters. On HEAR (17 tasks), CLAP2-S to CLAP2-L score higher than every other audio-text model. Omni-embedding models with 1B to 9B parameters reach up to 53.5% on MAEB-30, but they are not drop-in CLAP replacements.

<figure style="margin: 1.5rem 0 1rem;">
  <img src="/images/blog/laion-audio-xl/fig-size.png" alt="Average benchmark score against parameter count for audio-text models" style="display: block; margin: 0 auto;">
  <figcaption style="margin-top: 0.25rem; text-align: center;">Figure 5: <strong>State of the art for its size.</strong> MAEB-30 average score against parameters.</figcaption>
</figure>

<div class="table-fill">

| Model | Params | MAEB-30 | HEAR |
|---|---:|---:|---:|
| **CLAP2-L** | 340M | **53.6** | **81.9** |
| **CLAP2-M** | 153M | 52.3 | 81.4 |
| **CLAP2-S** | 104M | 51.8 | 81.8 |
| **CLAP2-XS** | 48M | 49.1 | 80.6 |
| **CLAP2-XXS** | 27M | 46.2 | 79.1 |
| jina-embeddings-v5-omni-nano | 855M | 51.8 | 80.7 |
| EmbeddingGemma 2 | 577M | 49.4 | 69.1 |
| GLAP | 855M | 44.1 | 71.8 |
| M2D-CLAP | 199M | 38.0 | 80.6 |
| TP-CLAP | 198M | 37.2 | 76.6 |
| LAION Larger CLAP | 194M | 36.2 | 69.5 |
| LAION-CLAP HTSAT unfused | 153M | 35.2 | 69.2 |

</div>

MAEB-30 and HEAR scores (%) of CLAP2 and other audio-text models below 1B parameters. The full table, with more baselines, is on the [project page](https://projects.laion.ai/clap2/#results).

## Get Started

The [project page](https://projects.laion.ai/clap2/) has interactive versions of every figure in this post: play clips from each sound group, trace how a clip gets its captions, drag the compute budget through the scaling laws, and ask questions about the paper. To work with CLAP2 and LAION-Audio-XL yourself: the models load with OpenCLIP, and the dataset is accessible via Hugging Face.

<div class="link-grid">
  <a class="link-card" href="https://projects.laion.ai/clap2/">Project page <span aria-hidden="true">→</span></a>
  <a class="link-card" href="https://github.com/LAION-AI/clap2">Code on GitHub <span aria-hidden="true">→</span></a>
  <a class="link-card" href="https://huggingface.co/datasets/laion/laion-audio-xl">Dataset on Hugging Face <span aria-hidden="true">→</span></a>
  <a class="link-card" href="https://huggingface.co/models?search=laion/clap2">Models on Hugging Face <span aria-hidden="true">→</span></a>
</div>

## Licence and Access

The dataset comes in open, share-alike and non-commercial configurations. Clips crawled from the web are not redistributed: they are listed as links in [laion/laion-audio-xl](https://huggingface.co/datasets/laion/laion-audio-xl).
