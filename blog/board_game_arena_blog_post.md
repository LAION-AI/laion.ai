---
title: "Board Game Arena: A Framework for Evaluating Large Language Models Through Strategic Gameplay"
author: "Lucia Cipolina-Kun, Marianna Nezhurina, Jenia Jitsev"
date: "Aug 4 2025"
previewImg: "/images/blog/board_game_arena/strategic_ai.png"
---

### Access
- **Repository**: [https://github.com/SLAMPAI/board_game_arena](https://github.com/SLAMPAI/board_game_arena)
- **Documentation**: Complete installation, usage, and extension guides available at [Board Game Arena Documentation](https://board-game-arena.readthedocs.io/en/latest/index.html)


A comprehensive research platform for evaluating Large Language Models through strategic gameplay, providing insights into AI decision-making in competitive environments

*Advancing our understanding of AI strategic reasoning*

## Authors

**Board Game Arena Research Team**
Lucia Cipolina-Kun*, Marianna Nezhurina*, Jenia Jitsev


![][strategic_ai]

Recent advancements in Large Language Models (LLMs) have emphasized the importance of understanding decision-making processes the models are capable of in complex environments. While LLMs excel in tasks like language generation and static problem solving, their performance in dynamic, competitive settings remains an area of active investigation. Strategic decision-making under pressure offers a valuable framework for assessing reasoning, adaptability, and interaction capabilities.

We introduce **Board Game Arena** – a comprehensive research platform that enables the evaluation of LLMs through strategic gameplay. Rather than relying solely on traditional benchmarks, this framework provides insights into how LLMs navigate competition, uncertainty, and complex decision trees.

Built on Google's OpenSpiel framework, Board Game Arena serves as a flexible and extensible platform for researchers and developers. By leveraging OpenSpiel's modular design, this framework can be customized to address a diverse range of research questions, enabling the addition of new games, agents, and analysis tools. Its adaptability makes it an invaluable resource for exploring varied aspects of strategic reasoning and decision-making in AI.

## Why Strategic Games Matter for AI Evaluation

Strategic games offer unique evaluation opportunities that traditional benchmarks cannot provide: genuine decision-making under uncertainty. When an LLM plays Tic-Tac-Toe, Connect Four, or Poker, it must:

- Analyze complex game states with multiple possible outcomes
- Reason about opponent behavior and predict future moves
- Balance short-term tactics with long-term strategic goals
- Handle incomplete information and make decisions under pressure
- Adapt strategies based on opponent responses

This creates an ideal testing environment for evaluating the strategic reasoning capabilities that will be crucial as LLMs become more integrated into decision-making roles across industries.

## Key Features of Board Game Arena

### Multi-Agent Testing Framework

Board Game Arena supports comprehensive competitive scenarios:

- **LLM vs Random**: Establish baseline performance against unpredictable opponents.
- **LLM vs LLM**: Direct strategic competitions between different language models.
- **Self-Play**: Enable LLMs to develop strategies by playing against themselves.
- **Cross-Provider Tournaments**: Compare models from different providers within the same game.

### Diverse Game Library

The framework includes a carefully selected set of games that test different aspects of strategic thinking:

- **`tic_tac_toe`** - Classic spatial reasoning and tactical planning
- **`connect_four`** - Long-term strategic positioning and pattern recognition
- **`kuhn_poker`** - Hidden information, bluffing, and probabilistic reasoning
- **`prisoners_dilemma`** - Cooperation versus competition dynamics
- **`matching_pennies`** - Zero-sum game theory and randomization strategies
- **`matrix_rps`** - Rock-paper-scissors with strategic depth

Each game challenges LLMs in unique ways, from spatial reasoning to probabilistic thinking to social dynamics.

### Flexible Inference Architecture

One of Board Game Arena's key strengths is its dual-backend architecture:

**LiteLLM Backend** - Access to over 100 language models through APIs:
- **OpenAI**: GPT-3.5, GPT-4, GPT-4 Turbo
- **Anthropic**: Claude 3, Claude 3.5 Sonnet
- **Google**: Gemini Pro, Gemma models
- **Groq**: Ultra-fast Llama 3 and Gemma inference
- **Together AI**: Llama 3.1, Mixtral, Code Llama
- **Additional providers**: Supporting over 90 other model providers for comprehensive comparison

**vLLM Backend** - Local GPU inference for:
- Complete control over model parameters
- Privacy-sensitive research applications
- Custom fine-tuned models
- Cost-effective large-scale experiments

The system allows researchers to mix different backends within the same experiment, enabling direct comparison between proprietary and open-source models, or between API-based and locally-hosted implementations.

## Reasoning Traces: Understanding AI Decision-Making

A particularly valuable feature of Board Game Arena is its automatic reasoning traces capability. This functionality captures not only what move an LLM made, but also the reasoning behind that decision.

### Data Collection

For every move made by an LLM agent, Board Game Arena automatically records:

- **Board State**: The exact game position when the decision was made
- **Agent Reasoning**: The LLM's complete thought process and explanation
- **Action Context**: The chosen move with full metadata and timing
- **Decision Patterns**: Categorized reasoning types and strategic approaches

### Example Reasoning Trace

Here is an example of the reasoning traces captured during gameplay:

```
Reasoning Trace #1
----------------------------------------
Game: connect_four
Episode: 3, Turn: 5
Agent: litellm_groq/llama3-8b-8192
Action Chosen: 3

Board State at Decision Time:
     . . . . . . .
     . . . . . . .
     . . x . . . .
     . o x . . . .
     o x o . . . .
     x o x . . . .

Agent's Reasoning:
     I need to block the opponent's potential win. They have
     two pieces in column 2 and if I don't act now, they
     could get three in a row vertically. Playing column 3
     also gives me a chance to build my own threat
     horizontally while staying defensive.

Timestamp: 2025-08-04 14:23:17
```

### Analysis Tools

Board Game Arena includes comprehensive analysis capabilities for reasoning traces:

- **Reasoning Categorization**: Automatically classifies thinking patterns (Positional, Blocking, Winning Logic, Opponent Modeling, etc.)
- **Pattern Visualization**: Word clouds showing common reasoning terms, pie charts of strategy types
- **Performance Heatmaps**: Visual maps showing move preferences and strategic tendencies
- **Statistical Analysis**: Quantitative measures of decision-making patterns

This provides researchers with tools for understanding how different LLMs approach strategic problems, what reasoning patterns correlate with success, and where current models have strategic limitations.

## Distributed Computing and Scalability

Board Game Arena supports large-scale experiments through distributed computing capabilities:

### Ray Integration

- **Parallel Episodes**: Execute multiple games simultaneously across different cores
- **Multi-Game Tournaments**: Run complex tournament brackets in parallel
- **Distributed LLM Inference**: Efficiently batch and distribute model calls
- **Real-time Monitoring**: Ray dashboard for live experiment tracking

### SLURM Cluster Support

Board Game Arena integrates seamlessly with SLURM clusters, enabling researchers to conduct large-scale academic experiments with ease. This includes:

- **Parameter Sweeps**: Efficiently explore hyperparameter spaces across multiple nodes and GPUs.

- **Scalable Tournaments**: Run extensive multi-agent tournaments across distributed computing environments.


These capabilities make Board Game Arena a powerful tool for conducting rigorous and scalable academic research.

## Monitoring and Visualization via Tensorboard

Board Game Arena includes native TensorBoard integration for experiment monitoring:

- **Real-time Metrics**: Monitor win rates, reward progressions, and performance trends during gameplay
- **Multi-Agent Comparison**: Side-by-side visualization of different LLM strategies
- **Performance Evolution**: Track how agents perform over multiple episodes
- **Strategy Analysis**: Identify successful patterns and strategic failures


## Extensibility and Customization

Board Game Arena's modular architecture facilitates easy extension:

* Adding new games
* Adding new LLM providers
* Adding custom policies such as reinforcement learning policies


### Analysis Pipeline Extension
The reasoning traces database and analysis pipeline are designed to be extensible, allowing researchers to develop custom analysis tools for specific research questions.

## Research Applications and Findings

Board Game Arena has already enabled several interesting research observations:

- **Strategic Specialization**: Certain LLMs demonstrate strong tactical play but struggle with long-term strategic planning
- **Reasoning Diversity**: Different models exhibit distinct strategic approaches and decision-making patterns
- **Cross-Game Learning**: Some strategic insights transfer between games, while others remain game-specific
- **Opponent Modeling**: Varying capabilities in predicting and countering opponent strategies
- **Decision Consistency**: Different levels of adherence to strategic principles under pressure

These findings contribute to our understanding of LLM capabilities and limitations in decision-making scenarios that parallel real-world strategic challenges.

## Example Results
```

ADD IMAGES HERE of the reasoning analysis



### Citation
```bibtex
@article{cipolina-kun2025board_game_arena,
    title={Board Game Arena: A Framework and Benchmark for Assessing Large Language Models},
    author={Lucia Cipolina-Kun and Marianna Nezhurina and Jenia Jitsev},
    year={2025},
    journal={arXiv},
    url={https://arxiv.org/abs/2}
}
```

### Community
- **Issues**: Bug reports and feature requests via GitHub
- **Contributions**: New games, agents, and analysis tools are welcome
- **Research Collaboration**: Contact the authors for academic partnerships

## Acknowledgments

We acknowledge co-funding by EU from EuroHPC Joint Undertaking programm under grant no. 101182737 (MINERVA) and from Digital Europe Programme under grant no. 101195233 (openEuroLLM) as well as funding by the Federal Ministry of Education and Research of Germany (BMBF) under grant no. 01IS24085C (OPENHAFM), under the grant 16HPC117K (MINERVA) and under the grant no. 01IS22094B (WestAI - AI Service Center West).


This work was supported by the compute resources of **Jülich Supercomputing Centre (JSC)**. We further gratefully acknowledge storage resources on JUST granted and operated by JSC and supported by Helmholtz Data Federation (HDF).

We also would like to express gratitude to all the people who are working on making code, models and data publicly available, advancing community based research and making research more reproducible. Specifically, we would like to thank all the members of the [LAION Discord server](https://discord.gg/BZqhreFazY) community and [Open-$\Psi$ (Open-Sci) Collective](https://discord.gg/GsKh4mBVcv) for providing fruitful ground for scientific exchange and open-source development.

We further acknowledge the contributions of the **OpenSpiel developers** – Marc Lanctot, John Schultz, and Michael Kaisers – whose framework provides the foundation for strategic AI evaluation.

Board Game Arena is released under a **CC BY-NC 4.0 license**, making it freely available for research and non-commercial applications.

[strategic_ai]: /images/blog/board_game_arena/strategic_ai.png
