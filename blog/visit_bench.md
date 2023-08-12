---
title: "Introducing VisIT-Bench, a new vision-language instruction following benchmark inspired by real-world use"
author: "Yonatan Bitton"
date: "August 12, 2023"
previewImg: "/images/blog/visit_bench/1_fig1.png"
---

[[Paper]](https://visit-bench.github.io/TODO) [[Code]](https://github.com/mlfoundations/VisIT-Bench/) [[Dataset]](https://huggingface.co/datasets/mlfoundations/VisIT-Bench) [[Leaderboard]](https://huggingface.co/spaces/mlfoundations/VisIT-Bench-Leaderboard)

We are thrilled to introduce VisIT-Bench, a benchmark for evaluating instruction-following vision-and-language (V&L) models. The central objective of VisIT-Bench is to provide a more accurate and meaningful assessment of V&L models, particularly in the context of real-world human-chatbot interaction scenarios.
![](/images/blog/visit_bench/1_fig1.png)

## Why VisIT-Bench?

Though recent V&L models have shown promise in following instructions, their evaluation and their ability to generalize to real-world human-chatbot instructions are often limited. Typically, these models are evaluated through qualitative comparison of outputs, making it challenging to quantify their progress and potential issues. VisIT-Bench helps address this problem by offering a comprehensive testing platform for measuring model performance across a diverse set of instruction-following tasks, inspired by real world use.

## Building the Benchmark

An example from VisIT-Bench, featuring an image, a challenging instruction, an instruction-conditioned caption, and a human-verified GPT4 response. These elements are used for evaluating multimodal chatbots and updating a dynamic leaderboard. 
![](/images/blog/visit_bench/2_example.png)

### Data Collection Framework

VisIT-Bench is a dynamic benchmark consisting of 679 challenging vision-language instructions. Each instruction consists of an image paired with an imperative request or question, e.g., for an image of pancakes, a user asks how can I cook this in a healthy way. Different from existing zero-shot evaluations, many of the instructions focus on open-ended generation requests (e.g., write a poem... or what should I bring if I were to visit here?).

VisIT-Bench adopts a systematic data collection approach that comprises four steps.
![](/images/blog/visit_bench/3_dataset_collection.png)

1. **Instruction Generation**: This step is designed to translate a single example from an instruction family into several high-quality examples. Human annotators are given a reference from an instruction family (which includes an instruction family, instruction, image, and model output). They create a new instance from the same family along with an instruction and corresponding image. This could involve a new instruction inspired by a seed task from the same family, coupled with a publicly licensed image URL. For instance, if the instruction family is "Contextual Knowledge of Events", the annotators might create a new instance related to a different but contextually significant event.

2. **Instruction-Conditioned Caption Generation**: Annotators are tasked to generate high-quality textual captions for each image in the dataset. These captions are conditioned on a provided instruction and image. The goal is to compose a caption so rich in detail that an entity receiving only the text would be able to follow the instruction. This detailed captioning not only serves as the base for GPT-4 output generation but also facilitates text-only auto-evaluation.

3. **Generating GPT4 Instruction-Following Responses Candidates**: Here, we obtain response candidates from GPT-4 that will be later validated by human annotators, for the purpose of defining ground-truth chatbot responses. We use the prompt: “Consider an image depicted by: <caption>. Now, briefly follow this instruction, and you can add a short explanation: `<instruction>. Response: “

4. **Model Output Evaluation**: We evaluate GPT-4's ability to follow instructions using text-only pairs (instruction, dense caption). Annotators are provided with a dense caption, an instruction, and GPT-4's prediction. They determine whether GPT-4 correctly followed the instruction and if not, whether the issue lay in the detail level of the dense caption or GPT4's answer. Any offensive, harmful, or unsound advice in the responses is also checked.

### Repurposing Existing Datasets

VisIT-Bench adapts 25 datasets into a chatbot-oriented format, which includes ten multi-image datasets. Each instance within the dataset has been reformatted to include an instruction prompt and a corresponding chatbot response. The figure provided illustrates an example of a multi-image instruction task from VisIT-Bench, originally derived from the NLVR2 dataset intended to evaluate visual reasoning abilities. The original NLVR2 format consists of a sentence for analysis, two images, and a binary response. In our adaptation, we incorporate a zero-shot instruction prompt, a detailed caption for each image that is conditioned by the instruction, and a response verified by a human from GPT-4. These additional components, shaped in the form of chatbot-like interactions, are designed to enable automatic evaluation of future chatbot responses to the instance, thereby modifying previous studies to fit modern chatbot needs more effectively.
![](/images/blog/visit_bench/4_nlvr_image.png)

### Instruction-Conditioned Dense Captions

Our experiment demonstrated that using dense captions, as opposed to standard image captions, significantly increased the rate of successful instruction following. When we replaced our dense captions with BLIP2 image captions, the success rate dropped from 91% to 31%.
![](/images/blog/visit_bench/5_necessity_of_captions.png)

### Data Collection Results

Our data collection method showed solid performance, particularly with single-image tasks, scoring 91.5% correctness in GPT-4's responses. However, the success rate dropped to 63.0% in the more complex multi-image tasks, highlighting the challenging nature of these tasks and indicating areas for improvement.
![](/images/blog/visit_bench/6_dataset_results.png)

### Features of the Dataset

VisIT-Bench is a unique composition of 70 unique instruction families, 25 repurposed prior datasets, including 10 multi-image datasets, each embodying a different skill that a chatbot model should ideally exhibit. These families mirror practical real-world chatbot interactions, thus ensuring that our benchmark evaluates models against realistic and varied tasks. 
![](/images/blog/visit_bench/7_table_compare.png)

## Models

Our evaluation includes a variety of publicly accessible vision-language models, either fine-tuned with multimodal instructions or designed to execute based on LLM outputs. These models include LLaVA-13B, InstructBLIP-13B, MiniGPT4-7B, mPLUG-Owl-7B, LlamaAdapter-v2-7B, PandaGPT-13B, VisualChatGPT, Multimodal GPT, OpenFlamingo, and Otter. 

## Human-Guided Rankings

Through our experiment using VisIT-Bench's single-image examples, we generated 5,000 pairwise comparisons involving multiple vision-language models. Each model featured in approximately 700 of these comparisons, which also included reference outputs from GPT-4. These samples were then evaluated by a panel of three human annotators who remained unaware of the model behind each output. The ranking was determined based on the accuracy, usefulness, and comprehensiveness of the output.

Analysis of the results reveals standout performances from human-validated GPT-4 responses and LLaVA (13B) model on the single-image dataset. The former's success is attributed to the effective use of instruction-conditioned dense captions, while LLaVA's robust instruction-tuning data set may have contributed to its top position. Interestingly, LlamaAdapter-v2 (7B) emerged as the most successful in direct comparisons against reference outputs, indicating that language instruction fine-tuning may hold key improvements for visual instruction-following models. Despite these insights, the intricate relationship between model design, task diversity, and performance remains complex and calls for future in-depth exploration.
![](/images/blog/visit_bench/8_human_performance.png)

## Automatic Evaluation and Dynamic Leaderboard

We introduced an automatic evaluation framework to rank model outputs, employing Elo-ratings and win-rate against the ground truth. This approach addresses potential bias, considering GPT-4 was used to assess its own output, and shows high agreement with human ratings.

The evaluation metrics used are as follows: Reference-free Elo score, which closely mirrors the human scoring setup; Reference-backed Elo score, which factors in the optional reference in the prompt; and Win-rate versus reference, which is a simple percentage of instances where a model's generation is favored over the reference.

Our results show that the rankings from reference-free and reference-backed evaluations align with each other. However, existing instruction-following models' win rates vary widely, underscoring a clear gap in their performance against reference outputs.
![](/images/blog/visit_bench/9_auto_eval_rating.png)
![](/images/blog/visit_bench/10_auto_eval_expanded.png)

### Correlation of the Automatic and Human-Annotated Preferences

Our newly proposed GPT-4 based metric outperforms alternatives, accurately reconstructing majority-vote pairwise human judgments (p<.05; binomial proportion CI nonoverlapping). For instances with unanimous agreement (5/5 annotators), GPT4-no-ref achieves 93% accuracy, surpassing BERTScore (80%), METEOR (78%), and ROUGE-L (70%). Compared to our length baseline metric (60%), these metrics offer reasonable options for static/offline evaluation without relying on OpenAI API access. The reference-free version of our GPT-4 metric achieves comparable performance to the reference-backed version. This adoption enables us to include references in the evaluation setup.
![](/images/blog/visit_bench/11_correlation.png)

## Results by Different Models on Different Instruction Families

VisIT-Bench provides a granular view into the performance of various Vision and Language (V&L) models. The diversity of instruction families in the benchmark allows for a nuanced evaluation of how different models perform across a wide range of tasks. This detailed assessment provides a comprehensive understanding of the capabilities of each model, highlighting their strengths and areas for improvement.
![](/images/blog/visit_bench/12_res_per_category.png)

## Contributions

This effort was made possible thanks to the amazing team of:

- [Yonatan Bitton*](https://yonatanbitton.github.io/), The Hebrew University of Jerusalem, Google Research
- [Hritik Bansal*](https://sites.google.com/view/hbansal), University of California
- [Jack Hessel](https://jmhessel.com/), Allen Institute for AI
- [Rulin Shao](https://rulinshao.github.io/), University of Washington
- [Wanrong Zhu](https://wanrong-zhu.com/), University of California, Santa Barbara
- [Anas Awadalla](https://anas-awadalla.streamlit.app/), University of Washington
- [Josh Gardner](https://homes.cs.washington.edu/~jpgard/), University of Washington
- [Rohan Taori](https://www.rohantaori.com/), Stanford
- [Ludwig Schmidt](https://people.csail.mit.edu/ludwigs/), Allen Institute for AI, University of Washington, LAION

*Equal contribution.

## In Conclusion

VisIT-Bench provides a unique, in-depth perspective on the performance of V&L models. Through our diverse instruction families, you can assess how different models perform on various tasks, providing a thorough understanding of their capabilities.

VisIT-Bench represents a significant step forward in the ongoing development and evaluation of V&L models. By offering a dynamic, comprehensive, and realistic evaluation platform, VisIT-Bench opens the door to more robust, efficient, and human-like multimodal models. The team behind VisIT-Bench looks forward to seeing the further advancements this new benchmark can inspire.

VisIT-Bench is dynamic to participate, practitioners simply submit their model's response on the project website; Data, code and leaderboard is available at [https://visit-bench.github.io/](https://visit-bench.github.io/)
![](/images/blog/visit_bench/13_leaderboard.png)
--- 
