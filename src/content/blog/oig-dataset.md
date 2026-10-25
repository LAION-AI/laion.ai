---
title: "The OIG Dataset"
author: "By Huu Nguyen -  Ontocord.ai, Sameer Suri, Ken Tsui , Shahules786, Together.xyz team, and Christoph Schuhmann - LAION.ai"
date: "March 10 2023"
previewImg: "/images/blog/oig-example.png"
---

The [Open Instruction Generalist (OIG)](https://huggingface.co/datasets/laion/OIG) dataset is a large open source instruction dataset that currently contains ~43M instructions. 

OIG is one of many chatbot datasets that [LAION](https://laion.ai), along with its volunteers, [Ontocord](https://www.ontocord.ai), [Together](https://www.together.xyz) and other members of the open source community, will be releasing and is intended to create equal access to chatbot technology. Everyone is welcome to use the dataset and contribute improvements to it.

## Examples of what is in OIG

![](/images/blog/oig-example-2.png)
Example data in OIG-43M.

![](/images/blog/oig-example.png)
Topic map of a subset of OIG-43M

|id: value|
|-|
|6602: -1_Image prompts for drawing with specific keywords___|
|1165: 0_Clipart use for teaching materials in commercial format with unlimited illustrations as an abcteach member___|
|1047: 1_Images of Air Force Change of Command Ceremonies___|
|745: 2_Documents related to military training and operations of Marine Corps and Army forces in 2013, 2017, and 2018.___|
|332: 3_Employment Trends in Selected Metropolitan Areas___|
|304: 4_Health Policy Workshop Proceedings and Image Covers for Cancer, Workforce, Literacy, and Accounting Approaches___|
|291: 5_Printable worksheets for math, reading, and kindergarten learning with image prompts.___|
|259: 6_Energy Trends and Prices___|
|225: 7_Images featuring Defense Secretary James Mattis in official meetings and events.___|
|174: 8_Images of Ricky Gervais, Jennifer Aniston, and Rachel Brosnahan at various award shows in Beverly Hills and Los Angeles.___|
|168: 9_Cricket matches and fans in India, featuring IPL teams Kings XI Punjab and Kolkata Knight Riders, Bollywood actors Katrina Kaif and Shah Rukh Khan, and cricket legends Sachin Tendulkar and bowler Singh. Also includes matches with Australia, New Zealand, Pakistan, and Sri Lanka during the World Cup and Test matches.___|
|140: 10_Images related to Covid-19 vaccination and prevention___|

Break-down of some image prompt instructions in a subset of OIG-43M.

## Discussion

OIG is a large-scale dataset containing instructions that are created using data augmentation from a diverse collection of data sources, and formatted in a dialogue style (<human>… <bot>… pairs). The goal of OIG is to help convert a language model pre-trained on large amounts of text into an instruction-following model. It is designed to support continued pre-training to enable a base model (e.g., GPT-NeoX-20B) that can be later fine-tuned with the smaller-scale domain-specific datasets.

OIG is created by various LAION community members, consisting of 30 datasets and 43M instructions, but we will continue to expand on this dataset with the goal of reaching 1 trillion tokens - enough to pretrain on OIG only.  It covers not only standard datasets (such as Natural Questions and Natural Instructions), but also data specifically related to dialog, summarization, education, etc.

Appendix 1 describes the components of the current OIG dataset. The dataset can be divided roughly into 75% academic datasets such as P3, Natural instructions, and FLAN, where answers may be short, and the tasks are often artificial, such as determining NLI. The other 25% is composed of various tasks, such as question and answering, providing how-to instructions, performing basic high school math, basic python coding, story generation, essay generation, poetry generation, and a very rudimentary attempt at generating songs based on augmenting existing poetry. Of note, we have also created a UL2-like fill in the blank dataset using TurkuNLP’s [OSCAR-registry](https://huggingface.co/datasets/TurkuNLP/register_oscar) data (e.g, “Fill in the missing spans”, “Fill in the rest of this paragraph”, “Give me the missing words”). We hypothesize that this mixture of instruction improves academic metrics as well as instruction fulfillment. 

## Safety and Moderation

Along with OIG, [Ontocord.ai](https://www.ontocord.ai) is also releasing [OIG-moderation](https://huggingface.co/datasets/ontocord/OIG-moderation), a small safety instruction dataset. OIG-moderation is intended to train a moderation model to predict labels for various moderation categories such as "needs intervention", “hate”, "sexual content", etc. Ontocord will also release in future versions, multilingual versions of the dataset, and include potential responses that could contain a reason why a chatbot might not respond to the answer. It aims to address issues including privacy eliciting prompts, and depression responses, along with prompts eliciting sexual content and aggressive behavior from users.

OIG-moderation includes data from (a) public datasets such as anthropic-redteam and anthropic-harmless, prosocial, and contributed datasets from community members (b) [augmented toxic data](https://huggingface.co/datasets/SummerSigh/PolicyData) such as civil comments data converted into instructions, (c) anthropic-redteam data [augmented with prosocial tags](https://huggingface.co/datasets/shahules786/prosocial_augmented) (d) data provided by the LAION community that might include NSFW prompts, and (e) synthetic depression data generated from [a public depression bag of words](https://huggingface.co/datasets/joangaes/depression) dataset using one of LAION’s volunteer’s [grammar fixing models](https://huggingface.co/pszemraj/flan-t5-large-grammar-synthesis). 

A model trained on the OIG-moderation dataset can be used to provide safety labels, and the bot providers can choose to then block responses from their chatbots based on these labels. If a bot provider's policy for example permits sexual content, but prohibits PII eliciting text, they can hopefully do so with the output of a model trained on this OIG-moderation. 

## Safety Goals

Open source and extendable safety pipelines unfortunately do not exist on the same scale as those in ChatGPT and other commercial systems. To further research in implementable, accurate, and extendable safety pipelines, LAION, Together, and Ontocord will push models, datasets, and code to the public. Research is one of our goals for safety, and we believe that keeping code, datasets, and models private hinders the overall progress in keeping LLM systems safe. By sharing such information, users and researchers alike can point out the harms, and potential solutions in these multifaceted systems.

Another goal for us is to bring safety research to a production setting where it can be effectively implemented and tested in real world use cases. Research in subjects like [toxicity detection](https://docs.cohere.ai/reference/toxicity-detection) and [bias mitigation](https://arxiv.org/abs/2106.13219) in LLMs is well established; however, the implementation of such research in systems that use language models as conversational agents in real world production settings has largely gone undocumented and unevaluated. The gap between research and implementation, brings many questions that must be answered to bring safe LLMs to the general public.

With the potential of offering OIG based systems to millions of users, it’s important to recognize the diversity in the user base with respect to socially acceptable paradigms. Pushing generally accepted social paradigms for one user in a specific country, locality, or even age does not warrant those same paradigms to be pushed upon users of other areas and ages. Thus we have opted for a multi-pronged approach to moderation and safety. We have curated and created data with safety tags, so that the bot providers can decide to train on the data and decide for themselves which moderation knob to turn on and off and which to permit their users to turn on and off (e.g., via parental controls).

Thus, we will strive to make data for safety systems that allow for user input so that our models can accept and reject prompts on a per locality and even a per user basis. It may not be possible to achieve in the first iteration of a safety pipeline however we will continue to research and strive for this goal. 

## How is the OIG dataset related to LAION’s Open Assistant Project?

LAION’s [Open Assistant (OA)](https://github.com/LAION-AI/Open-Assistant) project is our efforts to replicate the functionality of ChatGPT, and as such centers around gathering human feedback and training a reinforcement model based on human feedback. In contrast, the OIG dataset is almost purely a synthetic data set created using data augmentation. Our hypothesis for the OIG dataset is that you can create a performant bot, without RLHF, by first performing continued pre-training with an average quality instruction dataset such as OIG, and then doing a finetuning on a high quality instruction dataset such as OIG-small-chip2. With that said, the team members between the OA and OIG projects overlap and the OIG data began from work done within the LAION OA working group. 

## Models*

The community has trained several models based on a subset of the OIG datasets including:

* Rallio67/joi2_(20,12,7)B_instruct_alpha
* Rallio67/chip2_(20,12,7)B_instruct_alpha
* Rallio67/joi_(20,12,7)B_instruct_alpha
* Rallio67/chip_(20,12,7)B_instruct_alpha
* togethercomputer/GPT-NeoXT-Chat-Base-20B

## Safety models**

* SummerSigh/T5-Base-Rule-Of-Thumb
* SummerSigh/Safety-Policy
* SummerSigh/BART-Base-Rule-Of-Thumb 
* shahules786/prosocial-classifier
* shahules786/Safetybot-mt5-base
* shahules786/Safetybot-T5-base
* togethercomputer/GPT-JT-Moderation-6B

[Together](https://www.together.xyz/) has finetuned a GPT-JT model on v.01 of OIG-moderation, and other LAION volunteers have trained many other models on different subsets of the OIG-moderation v.02 dataset. 

Note: All the models above can be found at [https://huggingface.co/](https://huggingface.co/)

*We will update this section as more OIG based models are trained and released. 

** Models are in development and do not currently represent the final safety system for LAION chatbots or how models trained on OIG-moderation will fully behave. 

## What’s next 

This is just the beginning. This is a new project that we hope will evolve over time. From a purely dataset cleanup perspective, we intend to run a PII anonymizer on the web crawled portion of the dataset (e.g., OSCAR-registry based data). Also, there are several key areas that we need to improve including knowledge Q&A, creative writing and coding. We are also working on collaborations for fine-tuned versions of the bot for tasks like education, which we are incredibly excited about. We also need to perform deduplication and basic filtering for very uninformative instructions in case we made mistakes in the data augmentation. As a prelude, LAION has an ongoing filtering and analysis project, called [riverbed](https://github.com/LAION-AI/riverbed), which aims to analyze the OIG dataset, which we describe briefly below.

## Quality Filtering Approaches using masked language models (MLM)

Text outputs from dialogue prompted large language models are known to suffer from hallucinations and other factual inaccuracies. To address this problem, we applied various filtering to detect misinformation and contradiction with masked language models. In particular, masked language model is in a different paradigm from autoregressive language model, as its receptive field covers the context of both directions, providing extra information in detecting factual inaccuracies.

We framed fact checking as a masked language model pre-training objective. The idea behind is that if the prediction of  <mask> based on bidirectional context matches with the original token, the original token is more likely to be correct than incorrect and vice versa. A custom light weight RoBERTa based model is trained on high quality factual materials like books and wikipedia.

With the model, we analyzed the outputs of the GPT style language models by randomly masking a small percentage of the generated tokens and then using a BERT or T5 style language model to replace the masked tokens. Discrepancies between the original and replaced tokens were penalized to varying degrees. If the replaced token exactly matched the original token the penalty was zero. If the replaced token did not match the original token then it was analyzed for a semantic match by comparing a string containing the original token plus several tokens around it using language models finetuned on the natural language inference task (NLI) with three classifiers: entailment, neutral, contradiction. Entailment or neutral scores were considered positive while contradiction penalized the match.

### Example 1

Original > The big dog barked at the [fluffy] black cat.

Masked > The big dog barked at the `<mask>` black cat.

Replaced > The big dog barked at the [small] black cat

NLI(Original,Replaced) = {'entailment': 13.0892, 'neutral': 79.0414, 'contradiction': 7.8693}

NLI(Replaced,Original) = {'entailment': 0.1456, 'neutral': 99.7456, 'contradiction': 0.1087}

Score = ( ( (13.09+79.04-7.86)/2 + (0.15+99.75-0.11)/2 ) / 100 ) = 0.92


### Example 2

Original > The big [llama] barked at the fluffy black cat.

Masked > The big `<mask>` barked at the fluffy black cat.

Replaced > The big [dog] barked at the fluffy black cat.

NLI(Original, Replaced): {'entailment': 1.8346, 'neutral': 3.7347, 'contradiction': 94.4307}

NLI(Replaced, Original): {'entailment': 0.111, 'neutral': 1.8248, 'contradiction': 98.0642}

Score = ( ( (1.83 + 3.73 - 94.43)/2 + (0.11 + 1.82 - 98.06)/2 ) / 100 ) = -0.93


We also framed fact checking as replaced token detection, which is the pre-trained objective of ELECTRA. The idea is to look for “corrupted” token based on bidirectional context. Empirically, we found that, together with named entity recognition, pretrained electra large discriminator models could detect wrong named entities with a reasonable precision and recall in an augmented squad_v2 dataset.

We leveraged natural language inference to detect contradiction of dialogue from the bot. This acts as a self-consistency filter where we require a dialogue not to contradict itself. You can find a small sample of our work-in-progress [filtered OIG](https://huggingface.co/datasets/laion/OIG-riverbed-filtered-small) data here. More to come…

## Support this project

Your contributions and feedback support the open source ecosystem, improve the bot and provide datasets for future AI research. To participate you can:

* Submit [Github](https://github.com/LAION-AI/Open-Instruction-Generalist) issues,  track issues and help create datasets that need improvement.
* Join our [Discord](https://discord.gg/xBPBXfcFHd) to talk with other team members working on this!

## Disclaimer

These datasets contain synthetic data and in some cases data that includes humans trying to get the language model to say toxic/offensive/trolling things. If you are concerned about the presence of this type of material in the dataset please make sure you carefully inspect each of the entries and filter appropriately. Our goal is for the model to be as helpful and non-toxic as possible and we are actively evaluating ways to reduce or eliminate undesirable content from the instruction tuning datasets.

## License

The OIG dataset that is authored by LAION volunteers is released under an Apache 2.0 license. However, the data also includes content licensed under other permissive licenses such as Wikipedia data which is licensed under CC-BY-SA, or web-crawled data which is used under fair use principles. 

## Acknowledgement

* We would also like to thank all of our amazing LAION volunteers including: @Rallio, @Jue, @Ce Zhang, @Player-1, @Laurel, @danielpatrickhug, @Jjmachan, @Mylo, @Khalid, @Coco.han,  @Pszemraj, and many others. 
* We would like to thank [Together](https://www.together.xyz/) for their tireless dedication to the open source and AI community and their contribution to many of the datasets.
* We would like to thank [AI Horde](https://aihorde.net/) and user @Db0 for their incredible contribution of filtered data that were flagged as unethical.
* Lastly, [Ontocord.ai](https://www.ontocord.ai)’s founders are grateful to have the opportunity to create a portion of the data augmentation and safety-moderation code for this project.


## Appendix - Description of OIG datasets components

- unified_ni [https://github.com/allenai/natural-instructions](https://github.com/allenai/natural-instructions)
- unified_p3: [https://huggingface.co/datasets/bigscience/P3](https://huggingface.co/datasets/bigscience/P3)
- unified_flan: [https://github.com/google-research/FLAN/tree/main/flan/v2](https://github.com/google-research/FLAN/tree/main/flan/v2)
- unified_soda_dialog: [https://huggingface.co/datasets/allenai/soda](https://huggingface.co/datasets/allenai/soda)
- unified_unifiedskg_instructions: [https://github.com/HKUNLP/UnifiedSKG](https://github.com/HKUNLP/UnifiedSKG) 
- unified_merged_code_xp3: [https://huggingface.co/datasets/bigscience/xP3](https://huggingface.co/datasets/bigscience/xP3) (only Python)
- unified_oscar_en_sample_dialog: A small portion of [https://oscar-project.org/](https://oscar-project.org/)
[https://huggingface.co/datasets/TurkuNLP/register_oscar](https://huggingface.co/datasets/TurkuNLP/register_oscar)
- unified_ul2_plus_oscar_en_sample_dialog: A small portion of  [https://oscar-project.org/](https://oscar-project.org/)
[https://huggingface.co/datasets/TurkuNLP/register_oscar](https://huggingface.co/datasets/TurkuNLP/register_oscar)
- unified_multi_news: [https://www.tensorflow.org/datasets/catalog/multi_news](https://www.tensorflow.org/datasets/catalog/multi_news)
- unified_openai_summarize_tldr:  [https://github.com/openai/summarize-from-feedback](https://github.com/openai/summarize-from-feedback)
- unified_scitldr:  [https://github.com/allenai/scitldr](https://github.com/allenai/scitldr)
- unified_squad_v2:  [https://rajpurkar.github.io/SQuAD-explorer/](https://rajpurkar.github.io/SQuAD-explorer/)
- unified_nq:  [https://ai.google.com/research/NaturalQuestions](https://ai.google.com/research/NaturalQuestions)
- unified_poetry_instructions: Poetry data of mostly classical poems
[https://huggingface.co/datasets/merve/poetry](https://huggingface.co/datasets/merve/poetry)
[https://huggingface.co/datasets/matthh/gutenberg-poetry-corpus](https://huggingface.co/datasets/matthh/gutenberg-poetry-corpus)
- unified_sqlv1 and unified_sqlv2: public text 2 sql datasets.
- unified_unatural_instructions: [https://github.com/orhonovich/unnatural-instructions](https://github.com/orhonovich/unnatural-instructions)
- unified_conv_finqa:  [https://github.com/czyssrs/ConvFinQA](https://github.com/czyssrs/ConvFinQA)
- unified_essays:  essays available on the public web 
- unified_plot_screenplay_books_dialog : [https://github.com/markriedl/WikiPlots](https://github.com/markriedl/WikiPlots) extracted from Wikipedia, snippets from the Pile’s [https://huggingface.co/datasets/the_pile_books3](https://huggingface.co/datasets/the_pile_books3), and snippets of screenplays available on the public web. 
- unified_grade_school_math_instructions: [https://github.com/openai/grade-school-math](https://github.com/openai/grade-school-math)
- unified_mathqa_flanv2_kojma_cot: Public chain-of-thought datasets converted to instructions [https://huggingface.co/datasets/math_qa](https://huggingface.co/datasets/math_qa), 
- unified_joke_explanations: a very small dataset of joke explanations crawled from the public web 
- unified_cuad:  [https://www.atticusprojectai.org/cuad](https://www.atticusprojectai.org/cuad)
- unified_abstact_infill:  dbpedia and wikipedia snippets combined with a small portion of [https://github.com/google-research/dialog-inpainting](https://github.com/google-research/dialog-inpainting) 
- unified_image_prompts_instructions: A very small subset of LAION-400M
- unified_canadian_parliament:  [https://openparliament.ca/data-download/](https://openparliament.ca/data-download/)
- unified_poetry_2_song:  The above poetry dataset (and [https://huggingface.co/datasets/shahules786/PoetryFoundationData](https://huggingface.co/datasets/shahules786/PoetryFoundationData))  translated to song-like structures.
- unified_hc3_human - [https://huggingface.co/datasets/Hello-SimpleAI/HC3](https://huggingface.co/datasets/Hello-SimpleAI/HC3) 
- unified_rallio_safety_and_prosocial: Generated from public datasets and generated from Wiki similar to the chip2 data; find a full list in the end of the document, also includes [https://huggingface.co/datasets/allenai/prosocial-dialog](https://huggingface.co/datasets/allenai/prosocial-dialog) and [https://huggingface.co/datasets/Anthropic/hh-rlhf](https://huggingface.co/datasets/Anthropic/hh-rlhf)  
- unified_chip2: Generated from public datasets and generated from Wiki’s; full list below


## OIG-small-chip2

### Python Code Examples

A set of instruction / response pairs where the User requests the agent to generate a python function. These examples were generated using a large language model and few shot prompting with python code verified to execute. There are also ~3000 examples of manually curated one line python code examples from the Conala publication (see: [https://conala-corpus.github.io/](https://conala-corpus.github.io/))

### Natural Instruction Examples

A balanced set of diverse natural and factual questions and answers made using few shot prompted UL2 20B and an instruction tuned GPT-NeoX-20B model (Chip) and then rejection sampled using multiple automatic evaluations to remove low quality outputs and to filter out factually inaccurate answers. Also includes some filtered natural instructions from Anthropic Helpful instructions (see: https://github.com/anthropics/hh-rlhf).

### Generic Harmless Instruction Examples

A set of instruction / response pairs sourced from the Anthropic redteam paper github (see: https://github.com/anthropics/hh-rlhf). This dataset includes a lot of data regarding real humans trying to make the Anthropic language models say harmful/toxic/trolling things. For this dataset only examples that were rated lowly on the harmful scale (0,1,2 out of 4, where 4 is the most toxic) were included. Again, only the first lines of dialogue (instruction, first_agent_response) were retained.

### Instruction/Responses with Lists

A set of filtered and reformatted instruction / response pairs where the agent response contains a list. Sourced from the Anthropic github (see: https://github.com/anthropics/hh-rlhf). Sourced from wikihow text lists created by b-mc2 (https://huggingface.co/datasets/b-mc2/wikihow_lists). And rejection filtered instruction response pairs generated by Chip20B that contained lists. All lists are formatted in a similar style.

### Follow-up questions

Examples of instructions and responses where an appropriate response is to ask for more information from the prompter. These examples were generated from a combination of few shot prompted UL2 20B (to generate natural questions) and a large dialogue prompted language model to generate the responses containing follow-up questions.

### Wikipedia Toxic Adversarial Questions

Questions and answers generated from wikipedia articles that discuss potentially sensitive topics (flagged as potentially toxic by an early toxicity detection model).

### Grade School Math GSM8K (~9,000)

GSM8K is a dataset of 8.5K high quality linguistically diverse grade school math word problems created by human problem writers. The dataset is segmented into 7.5K training problems and 1K test problems. These problems take between 2 and 8 steps to solve, and solutions primarily involve performing a sequence of elementary calculations using basic arithmetic operations (+ − ×÷) to reach the final answer. A bright middle school student should be able to solve every problem. It can be used for multi-step mathematical reasoning. [https://github.com/openai/grade-school-math](https://github.com/openai/grade-school-math)

### Reasoning Instructions

Examples from the Com2Sense and Strategy QA datasets that were reformatted into natural instructions using large language models with few shot prompting and additional quality filtering steps.

### Character and Scene Descriptions

Examples of instructions and responses for the generation of character or scene descriptions. Scenes were sourced from video game wikis and reformatted into instruction / response format using large language models or generated by few shot prompting with large language models.