---
title: "LAION-Audio-XL and CLAP2"
author: "Gijs Wijngaard, Felix Förster, Ross Wightman, Marianna Nezhurina, Christoph Schuhmann, Jenia Jitsev, A. Sophia Koepke"
date: "Nov 10, 2026"
previewImg: "/images/blog/laion-audio-xl/preview.jpg"
socialImg: "/images/blog/laion-audio-xl/social.jpg"
previewBg: "#0c1a2b"
description: "365M audio clips with 707M captions, and CLAP2: five open audio–text models trained from scratch. CLAP2-L reaches 53.6% on MAEB-30, the best from-scratch model."
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

Dataset, captions, model checkpoints and code are all open: [paper](https://arxiv.org/abs/2611.11592), [project page](https://projects.laion.ai/clap2/), [code](https://github.com/LAION-AI/clap2), [dataset](https://huggingface.co/datasets/laion/laion-audio-xl), [models](https://huggingface.co/models?search=laion/clap2).

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

On the [project page](https://projects.laion.ai/clap2/#taxonomy) you can open each of the 11 groups and listen to example clips.

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
  <img src="/images/blog/laion-audio-xl/fig-compare.png" alt="Hours of audio in LAION-Audio-XL, its 500M selection and existing audio-text datasets" style="display: block; margin: 0 auto;">
  <figcaption style="margin-top: 0.25rem; text-align: center;">Figure 2: <strong>LAION-Audio-XL next to existing audio-text corpora.</strong></figcaption>
</figure>

## CLAP2: The Models

In contrastive language-audio pretraining (CLAP), models learn to map audio recordings and their corresponding text descriptions into a shared embedding space. CLAP2 is a dual encoder in the CLAP family. One tower turns a sound into a vector, the other turns text into a vector, and the cosine similarity between the two says how well they match. This enables text-to-audio search, zero-shot classification and the use of CLAP2 embeddings as audio features in downstream systems.

The audio tower is a NaFlex vision transformer over log-mel spectrogram patches: every 16 × 16 patch becomes one token, 50 tokens per second, so each clip is read at its own length up to 30 seconds instead of being padded or cropped to a fixed window. Both towers are **trained from scratch** and therefore don't depend on pretrained weights. This makes our training recipe transparent and flexible for our scaling study.

## Scaling Laws

We trained all five model sizes on 1M to 1,024M samples seen and measured how the MAEB-30 error falls with training compute. It follows a smooth power law: **each doubling of compute lowers the error by 3.9%**, about +1.8 MAEB-30 points at the largest budget.

<figure style="margin: 1.5rem 0 1rem;">
  <img src="/images/blog/laion-audio-xl/fig-scaling.png" alt="MAEB-30 error of all CLAP2 training runs against training compute, with the best run per budget and the fitted scaling law" style="display: block; margin: 0 auto;">
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
  <a class="link-card" href="https://arxiv.org/abs/2611.11592" style="grid-column: 1 / -1;"><span class="link-label"><svg class="link-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3.8423 0a1.0037 1.0037 0 0 0-.922.6078c-.1536.3687-.0438.6275.2938 1.1113l6.9185 8.3597-1.0223 1.1058a1.0393 1.0393 0 0 0 .003 1.4229l1.2292 1.3135-5.4391 6.4444c-.2803.299-.4538.823-.2971 1.1986a1.0253 1.0253 0 0 0 .9585.635.9133.9133 0 0 0 .6891-.3405l5.783-6.126 7.4902 8.0051a.8527.8527 0 0 0 .6835.2597.9575.9575 0 0 0 .8777-.6138c.1577-.377-.017-.7502-.306-1.1407l-7.0518-8.3418 1.0632-1.13a.9626.9626 0 0 0 .0089-1.3165L4.6336.4639s-.3733-.4535-.768-.463zm0 .272h.0166c.2179.0052.4874.2715.5644.3639l.005.006.0052.0055 10.169 10.9905a.6915.6915 0 0 1-.0072.945l-1.0666 1.133-1.4982-1.7724-8.5994-10.39c-.3286-.472-.352-.6183-.2592-.841a.7307.7307 0 0 1 .6704-.4401Zm14.341 1.5701a.877.877 0 0 0-.6554.2418l-5.6962 6.1584 1.6944 1.8319 5.3089-6.5138c.3251-.4335.479-.6603.3247-1.0292a1.1205 1.1205 0 0 0-.9763-.689zm-7.6557 12.2823 1.3186 1.4135-5.7864 6.1295a.6494.6494 0 0 1-.4959.26.7516.7516 0 0 1-.706-.4669c-.1119-.2682.0359-.6864.2442-.9083l.0051-.0055.0047-.0055z"/></svg>Paper</span> <span aria-hidden="true">→</span></a>
  <a class="link-card" href="https://projects.laion.ai/clap2/"><span class="link-label"><svg class="link-icon" viewBox="12 14 76 78" width="20" height="20" aria-hidden="true" focusable="false"><ellipse cx="21" cy="45" rx="7" ry="9.5" transform="rotate(-24 21 45)" fill="currentColor"/><ellipse cx="38" cy="27" rx="7.5" ry="10.5" transform="rotate(-8 38 27)" fill="currentColor"/><ellipse cx="62" cy="27" rx="7.5" ry="10.5" transform="rotate(8 62 27)" fill="currentColor"/><ellipse cx="79" cy="45" rx="7" ry="9.5" transform="rotate(24 79 45)" fill="currentColor"/><rect x="25.60" y="63.0" width="4" height="10" rx="2.0" fill="currentColor"/><rect x="31.20" y="57.0" width="4" height="22" rx="2.0" fill="currentColor"/><rect x="36.80" y="61.0" width="4" height="14" rx="2.0" fill="currentColor"/><rect x="42.40" y="51.0" width="4" height="34" rx="2.0" fill="currentColor"/><rect x="48.00" y="47.0" width="4" height="42" rx="2.0" fill="currentColor"/><rect x="53.60" y="58.0" width="4" height="20" rx="2.0" fill="currentColor"/><rect x="59.20" y="53.0" width="4" height="30" rx="2.0" fill="currentColor"/><rect x="64.80" y="60.0" width="4" height="16" rx="2.0" fill="currentColor"/><rect x="70.40" y="64.0" width="4" height="8" rx="2.0" fill="currentColor"/></svg>Project page</span> <span aria-hidden="true">→</span></a>
  <a class="link-card" href="https://github.com/LAION-AI/clap2"><span class="link-label"><svg class="link-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>Code</span> <span aria-hidden="true">→</span></a>
  <a class="link-card" href="https://huggingface.co/datasets/laion/laion-audio-xl"><span class="link-label"><svg class="link-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M1.4446 11.5059c0 1.1021.1673 2.1585.4847 3.1563-.0378-.0028-.0691-.0058-.1058-.0058-.4209 0-.8015.16-1.0704.4512-.3454.3737-.4984.8335-.4316 1.293a1.576 1.576 0 0 0 .2148.5978c-.2319.1864-.4018.4456-.4844.7578-.0646.2448-.131.7543.2149 1.2794a1.4552 1.4552 0 0 0-.0625.1055c-.208.3923-.2207.8372-.0371 1.25.2783.6258.9696 1.1175 2.3126 1.6467.8356.3292 1.5988.5411 1.6056.543 1.1046.2847 2.104.4277 2.969.4277 1.4173 0 2.4754-.3849 3.1525-1.1446 1.538.2651 2.791.1403 3.592.006.6773.7555 1.7332 1.1387 3.1467 1.1387.8649 0 1.8643-.143 2.969-.4278.0068-.0019.77-.2138 1.6056-.543 1.343-.5292 2.0343-1.0208 2.3126-1.6466.1836-.4129.171-.8577-.037-1.25a1.4685 1.4685 0 0 0-.0626-.1056c.346-.525.2795-1.0346.2149-1.2793-.0826-.3122-.2525-.5714-.4844-.7579.11-.1816.1831-.3788.2148-.5977.0669-.4595-.0862-.9193-.4316-1.293-.2688-.2913-.6495-.4513-1.0704-.4513-.0209 0-.0376.0008-.0588.0018.3162-.9966.4846-2.0518.4846-3.1523 0-5.807-4.7362-10.5144-10.5789-10.5144-5.8426 0-10.5788 4.7073-10.5788 10.5144Zm10.5788-9.4831c5.2727 0 9.5476 4.246 9.5476 9.483a9.4201 9.4201 0 0 1-.2696 2.2365c-.0039-.0047-.0079-.011-.0117-.0156-.274-.3255-.6679-.5059-1.1075-.5059-.352 0-.714.1155-1.0763.3438-.2403.1517-.5058.422-.7793.7598-.2534-.3492-.608-.5832-1.0137-.6465a1.5174 1.5174 0 0 0-.2344-.0176c-.9263 0-1.4828.7993-1.6935 1.5177-.1046.2426-.6065 1.3482-1.3614 2.0978-1.1681 1.1601-1.4458 2.3534-.8396 3.6382-.843.1029-1.5836.0927-2.365-.006.5906-1.212.3626-2.4388-.8426-3.6322-.755-.7496-1.2568-1.8552-1.3614-2.0978-.2107-.7184-.7673-1.5177-1.6935-1.5177-.078 0-.1568.0054-.2344.0176-.4057.0633-.7604.2973-1.0137.6465-.2735-.3379-.539-.6081-.7794-.7598-.3622-.2283-.7243-.3438-1.0762-.3438-.4266 0-.8094.171-1.0821.4786a9.4208 9.4208 0 0 1-.2598-2.1936c0-5.237 4.2749-9.483 9.5475-9.483zM8.6443 7.0036c-.4838.0043-.9503.2667-1.1934.7227-.3536.6633-.1006 1.4873.5645 1.84.351.1862.4883-.5261.836-.6485.3107-.1095.841.399 1.0078.086.3536-.6634.1025-1.4874-.5625-1.84a1.3659 1.3659 0 0 0-.6524-.1602Zm6.8403 0c-.2199-.002-.4426.05-.6504.1602-.665.3526-.9181 1.1766-.5645 1.84.1669.313.6971-.1955 1.0079-.086.3476.1224.4867.8347.838.6485.6649-.3527.916-1.1767.5624-1.84-.243-.456-.7096-.7184-1.1934-.7227Zm-9.7565 1.418a.8768.8768 0 0 0-.877.877c0 .4846.3925.877.877.877a.8768.8768 0 0 0 .877-.877.8768.8768 0 0 0-.877-.877zm12.6434 0c-.4845 0-.879.3925-.879.877 0 .4846.3945.877.879.877a.8768.8768 0 0 0 .877-.877.8768.8768 0 0 0-.877-.877zM8.7927 11.459c-.179-.003-.2793.1107-.2793.416 0 .8097.3874 2.125 1.4279 2.924.207-.7123 1.3453-1.2832 1.5079-1.2012.2315.1167.2191.4417.6074.7266.3884-.285.374-.6098.6056-.7266.1627-.082 1.3009.4889 1.5079 1.2012 1.0404-.799 1.4278-2.1144 1.4278-2.924 0-1.2212-1.583.6402-3.5413.6485-1.4686-.0061-2.7266-1.0558-3.2639-1.0645zM4.312 14.4768c.5792.365 1.6964 2.2751 2.1056 3.0177.1371.2488.371.3536.582.3536.4188 0 .7465-.4138.0391-.9395-1.0636-.791-.6914-2.0846-.1836-2.1642a.4302.4302 0 0 1 .0664-.004c.4616 0 .666.7892.666.7892s.5959 1.4898 1.6213 2.508c.942.9356 1.062 1.703.4961 2.6661-.0164-.004-.0159.0236-.1484.2149-.1853.2673-.4322.4688-.7188.6152-.5062.2269-1.1397.2696-1.7833.2696-1.037 0-2.1017-.1824-2.6975-.336-.0293-.0075-3.6505-.9567-3.1916-1.8224.0771-.1454.2033-.2031.3633-.2031.6463 0 1.823.9551 2.3283.9551.113 0 .196-.0865.2285-.2031.2249-.8045-3.2787-1.0522-2.9846-2.1642.0519-.1967.193-.2757.3907-.2754.854 0 2.7704 1.4923 3.172 1.4923.0307 0 .0525-.0085.0645-.0274.2012-.3227.1096-.5865-1.3087-1.4395-1.4182-.8533-2.4315-1.329-1.8653-1.9416.0651-.0707.1574-.1015.2695-.1015.8611.0002 2.8948 1.84 2.8948 1.84s.5487.5683.8809.5683c.0762 0 .1416-.0315.1855-.1054.2355-.3946-2.1858-2.2183-2.3224-2.971-.0926-.51.0641-.7676.3555-.7676-.0006.008.1701-.0285.4942.1759zm16.2257.5918c-.1366.7526-2.5579 2.5764-2.3224 2.9709.044.074.1092.1055.1855.1055.3321 0 .881-.5684.881-.5684s2.0336-1.8397 2.8947-1.84c.1121 0 .2044.0308.2695.1016.5662.6125-.447 1.0882-1.8653 1.9415-1.4183.853-1.51 1.1168-1.3087 1.4396.012.0188.0337.0273.0644.0273.4016 0 2.3181-1.4923 3.1721-1.4923.1977-.0002.3388.0787.3907.2754.294 1.112-3.2095 1.3597-2.9846 2.1642.0325.1166.1156.2032.2285.2032.5054 0 1.682-.9552 2.3283-.9552.16 0 .2862.0577.3633.2032.459.8656-3.1623 1.8149-3.1916 1.8224-.5958.1535-1.6605.336-2.6975.336-.6351 0-1.261-.0409-1.7638-.2599-.2949-.1472-.5488-.3516-.7383-.625-.0411-.0682-.1026-.1476-.1426-.205-.5726-.9679-.455-1.7371.4903-2.676 1.0254-1.0182 1.6212-2.508 1.6212-2.508s.2044-.7891.666-.7891a.4318.4318 0 0 1 .0665.0039c.5078.0796.88 1.3732-.1836 2.1642-.7074.5257-.3797.9395.039.9395.211 0 .445-.1047.5821-.3535.4092-.7426 1.5264-2.6527 2.1056-3.0178.5588-.3524.99-.1816.8497.5918z"/></svg>Dataset</span> <span aria-hidden="true">→</span></a>
  <a class="link-card" href="https://huggingface.co/models?search=laion/clap2"><span class="link-label"><svg class="link-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M1.4446 11.5059c0 1.1021.1673 2.1585.4847 3.1563-.0378-.0028-.0691-.0058-.1058-.0058-.4209 0-.8015.16-1.0704.4512-.3454.3737-.4984.8335-.4316 1.293a1.576 1.576 0 0 0 .2148.5978c-.2319.1864-.4018.4456-.4844.7578-.0646.2448-.131.7543.2149 1.2794a1.4552 1.4552 0 0 0-.0625.1055c-.208.3923-.2207.8372-.0371 1.25.2783.6258.9696 1.1175 2.3126 1.6467.8356.3292 1.5988.5411 1.6056.543 1.1046.2847 2.104.4277 2.969.4277 1.4173 0 2.4754-.3849 3.1525-1.1446 1.538.2651 2.791.1403 3.592.006.6773.7555 1.7332 1.1387 3.1467 1.1387.8649 0 1.8643-.143 2.969-.4278.0068-.0019.77-.2138 1.6056-.543 1.343-.5292 2.0343-1.0208 2.3126-1.6466.1836-.4129.171-.8577-.037-1.25a1.4685 1.4685 0 0 0-.0626-.1056c.346-.525.2795-1.0346.2149-1.2793-.0826-.3122-.2525-.5714-.4844-.7579.11-.1816.1831-.3788.2148-.5977.0669-.4595-.0862-.9193-.4316-1.293-.2688-.2913-.6495-.4513-1.0704-.4513-.0209 0-.0376.0008-.0588.0018.3162-.9966.4846-2.0518.4846-3.1523 0-5.807-4.7362-10.5144-10.5789-10.5144-5.8426 0-10.5788 4.7073-10.5788 10.5144Zm10.5788-9.4831c5.2727 0 9.5476 4.246 9.5476 9.483a9.4201 9.4201 0 0 1-.2696 2.2365c-.0039-.0047-.0079-.011-.0117-.0156-.274-.3255-.6679-.5059-1.1075-.5059-.352 0-.714.1155-1.0763.3438-.2403.1517-.5058.422-.7793.7598-.2534-.3492-.608-.5832-1.0137-.6465a1.5174 1.5174 0 0 0-.2344-.0176c-.9263 0-1.4828.7993-1.6935 1.5177-.1046.2426-.6065 1.3482-1.3614 2.0978-1.1681 1.1601-1.4458 2.3534-.8396 3.6382-.843.1029-1.5836.0927-2.365-.006.5906-1.212.3626-2.4388-.8426-3.6322-.755-.7496-1.2568-1.8552-1.3614-2.0978-.2107-.7184-.7673-1.5177-1.6935-1.5177-.078 0-.1568.0054-.2344.0176-.4057.0633-.7604.2973-1.0137.6465-.2735-.3379-.539-.6081-.7794-.7598-.3622-.2283-.7243-.3438-1.0762-.3438-.4266 0-.8094.171-1.0821.4786a9.4208 9.4208 0 0 1-.2598-2.1936c0-5.237 4.2749-9.483 9.5475-9.483zM8.6443 7.0036c-.4838.0043-.9503.2667-1.1934.7227-.3536.6633-.1006 1.4873.5645 1.84.351.1862.4883-.5261.836-.6485.3107-.1095.841.399 1.0078.086.3536-.6634.1025-1.4874-.5625-1.84a1.3659 1.3659 0 0 0-.6524-.1602Zm6.8403 0c-.2199-.002-.4426.05-.6504.1602-.665.3526-.9181 1.1766-.5645 1.84.1669.313.6971-.1955 1.0079-.086.3476.1224.4867.8347.838.6485.6649-.3527.916-1.1767.5624-1.84-.243-.456-.7096-.7184-1.1934-.7227Zm-9.7565 1.418a.8768.8768 0 0 0-.877.877c0 .4846.3925.877.877.877a.8768.8768 0 0 0 .877-.877.8768.8768 0 0 0-.877-.877zm12.6434 0c-.4845 0-.879.3925-.879.877 0 .4846.3945.877.879.877a.8768.8768 0 0 0 .877-.877.8768.8768 0 0 0-.877-.877zM8.7927 11.459c-.179-.003-.2793.1107-.2793.416 0 .8097.3874 2.125 1.4279 2.924.207-.7123 1.3453-1.2832 1.5079-1.2012.2315.1167.2191.4417.6074.7266.3884-.285.374-.6098.6056-.7266.1627-.082 1.3009.4889 1.5079 1.2012 1.0404-.799 1.4278-2.1144 1.4278-2.924 0-1.2212-1.583.6402-3.5413.6485-1.4686-.0061-2.7266-1.0558-3.2639-1.0645zM4.312 14.4768c.5792.365 1.6964 2.2751 2.1056 3.0177.1371.2488.371.3536.582.3536.4188 0 .7465-.4138.0391-.9395-1.0636-.791-.6914-2.0846-.1836-2.1642a.4302.4302 0 0 1 .0664-.004c.4616 0 .666.7892.666.7892s.5959 1.4898 1.6213 2.508c.942.9356 1.062 1.703.4961 2.6661-.0164-.004-.0159.0236-.1484.2149-.1853.2673-.4322.4688-.7188.6152-.5062.2269-1.1397.2696-1.7833.2696-1.037 0-2.1017-.1824-2.6975-.336-.0293-.0075-3.6505-.9567-3.1916-1.8224.0771-.1454.2033-.2031.3633-.2031.6463 0 1.823.9551 2.3283.9551.113 0 .196-.0865.2285-.2031.2249-.8045-3.2787-1.0522-2.9846-2.1642.0519-.1967.193-.2757.3907-.2754.854 0 2.7704 1.4923 3.172 1.4923.0307 0 .0525-.0085.0645-.0274.2012-.3227.1096-.5865-1.3087-1.4395-1.4182-.8533-2.4315-1.329-1.8653-1.9416.0651-.0707.1574-.1015.2695-.1015.8611.0002 2.8948 1.84 2.8948 1.84s.5487.5683.8809.5683c.0762 0 .1416-.0315.1855-.1054.2355-.3946-2.1858-2.2183-2.3224-2.971-.0926-.51.0641-.7676.3555-.7676-.0006.008.1701-.0285.4942.1759zm16.2257.5918c-.1366.7526-2.5579 2.5764-2.3224 2.9709.044.074.1092.1055.1855.1055.3321 0 .881-.5684.881-.5684s2.0336-1.8397 2.8947-1.84c.1121 0 .2044.0308.2695.1016.5662.6125-.447 1.0882-1.8653 1.9415-1.4183.853-1.51 1.1168-1.3087 1.4396.012.0188.0337.0273.0644.0273.4016 0 2.3181-1.4923 3.1721-1.4923.1977-.0002.3388.0787.3907.2754.294 1.112-3.2095 1.3597-2.9846 2.1642.0325.1166.1156.2032.2285.2032.5054 0 1.682-.9552 2.3283-.9552.16 0 .2862.0577.3633.2032.459.8656-3.1623 1.8149-3.1916 1.8224-.5958.1535-1.6605.336-2.6975.336-.6351 0-1.261-.0409-1.7638-.2599-.2949-.1472-.5488-.3516-.7383-.625-.0411-.0682-.1026-.1476-.1426-.205-.5726-.9679-.455-1.7371.4903-2.676 1.0254-1.0182 1.6212-2.508 1.6212-2.508s.2044-.7891.666-.7891a.4318.4318 0 0 1 .0665.0039c.5078.0796.88 1.3732-.1836 2.1642-.7074.5257-.3797.9395.039.9395.211 0 .445-.1047.5821-.3535.4092-.7426 1.5264-2.6527 2.1056-3.0178.5588-.3524.99-.1816.8497.5918z"/></svg>Models</span> <span aria-hidden="true">→</span></a>
</div>

## Licence and Access

The dataset comes in open, share-alike and non-commercial configurations. Clips crawled from the web are not redistributed: they are listed as links in [laion/laion-audio-xl](https://huggingface.co/datasets/laion/laion-audio-xl).
