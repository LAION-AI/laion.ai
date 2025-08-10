---
title: "Game Reasoning Arena: Inside the Mind of AI: How LLMs Think, Strategize, and Compete in Real-Time"
author: "Lucia Cipolina-Kun, Marianna Nezhurina, Jenia Jitsev"
date: "Aug 11 2025"
previewImg: "/images/blog/board_game_arena/strategic_ai.png"
---
---
title: "Game Reasoning Arena: Inside the Mind of AI: How LLMs Think, Strategize, and Compete in Real-Time"
author: "Lucia Cipolina-Kun, Marianna Nezhurina, Jenia Jitsev"
date: "Aug 4 2025"
previewImg: "/images/blog/game_reasoning_arena/strategic_ai.png"
---

### Access
- **Repository**: [https://github.com/SLAMPAI/game_reasoning_arena](https://github.com/SLAMPAI/game_reasoning_arena)
- **Documentation**: Complete installation, usage, and extension guides available at [Game Reasoning Arena Documentation](https://board-game-arena.readthedocs.io/en/latest/index.html)


What happens when we peek inside an AI's mind while it's making strategic decisions? For the first time, we can watch Large Language Models think in real-time as they compete, strategize, and adapt in dynamic game environments. Our Game Reasoning Arena doesn't just test what AI can do—it reveals *how* AI thinks, capturing every reasoning step as models battle each other in strategic gameplay.

*The first platform to expose AI's strategic DNA in action*


Game Reasoning Arena is a research platform where Large Language Models battle in board games against other LLMs, humans, or random bots—while exposing every step of their strategic reasoning. Built on Google’s OpenSpiel with a modular, Gymnasium-style interface, it supports custom games, agents, and analysis tools. Scalable Ray-based parallelization powers large tournaments, making it a fast, flexible testbed for studying how AI thinks under competition and uncertainty.

---
### Quick start with Google Colab

**[Click here to try Game Reasoning Arena in our Colab now!](https://github.com/SLAMPAI/game_reasoning_arena/blob/main/colabs/game_reasoning_arena.ipynb)**
---

## Why Strategic Games Matter for AI Evaluation

Strategic games offer unique evaluation opportunities that traditional benchmarks cannot provide: genuine decision-making under uncertainty. When an LLM plays Tic-Tac-Toe, Connect Four, or Poker, it must:

- Analyze complex game states with multiple possible outcomes
- Reason about opponent behavior and predict future moves
- Balance short-term tactics with long-term strategic goals
- Handle incomplete information and make decisions under pressure
- Adapt strategies based on opponent responses

This creates an ideal testing environment for evaluating the strategic reasoning capabilities that will be crucial as LLMs become more integrated into decision-making roles across industries.

## Key Features of Game Reasoning Arena

### Multi-Agent Testing Framework

Game Reasoning Arena supports comprehensive competitive scenarios:

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
- **`matrix_rps`** - Rock-paper-scissors with matrix representation

Each game challenges LLMs in unique ways, from spatial reasoning to probabilistic thinking to social dynamics.

### Flexible Inference Architecture

One of Game Reasoning Arena's key strengths is its dual-backend architecture:

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

It also supports Hugging Face backends.

The system allows researchers to mix different backends within the same experiment, enabling direct comparison between proprietary and open-source models, or between API-based and locally-hosted implementations.

## Reasoning Traces: Understanding AI Decision-Making

A particularly valuable feature of Game Reasoning Arena is its automatic reasoning traces capability. This functionality captures not only what move an LLM made, but also the reasoning behind that decision.

### Data Collection

For every move made by an LLM agent, Game Reasoning Arena automatically records:

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

Game Reasoning Arena includes comprehensive analysis capabilities for reasoning traces:

- **Reasoning Categorization**: Automatically classifies thinking patterns (Positional, Blocking, Winning Logic, Opponent Modeling, etc.)
- **Pattern Visualization**: Word clouds showing common reasoning terms, pie charts of strategy types
- **Performance Heatmaps**: Visual maps showing move preferences and strategic tendencies
- **Statistical Analysis**: Quantitative measures of decision-making patterns

This provides researchers with tools for understanding how different LLMs approach strategic problems, what reasoning patterns correlate with success, and where current models have strategic limitations.

## Distributed Computing and Scalability

Game Reasoning Arena supports large-scale experiments through distributed computing capabilities:

### Ray Integration

- **Parallel Episodes**: Execute multiple games simultaneously across different cores
- **Multi-Game Tournaments**: Run complex tournament brackets in parallel
- **Distributed LLM Inference**: Efficiently batch and distribute model calls
- **Real-time Monitoring**: Ray dashboard for live experiment tracking

### SLURM Cluster Support

Game Reasoning Arena integrates seamlessly with SLURM clusters, enabling researchers to conduct large-scale academic experiments with ease. This includes:

- **Parameter Sweeps**: Efficiently explore hyperparameter spaces across multiple nodes and GPUs.

- **Scalable Tournaments**: Run extensive multi-agent tournaments across distributed computing environments.


These capabilities make Game Reasoning Arena a powerful tool for conducting rigorous and scalable academic research.

## Monitoring and Visualization via Tensorboard

Game Reasoning Arena includes native TensorBoard integration for experiment monitoring:

- **Real-time Metrics**: Monitor win rates, reward progressions, and performance trends during gameplay
- **Multi-Agent Comparison**: Side-by-side visualization of different LLM strategies
- **Performance Evolution**: Track how agents perform over multiple episodes
- **Strategy Analysis**: Identify successful patterns and strategic failures


## Extensibility and Customization

Game Reasoning Arena's modular architecture facilitates easy extension:

* Adding new games
* Adding new LLM providers
* Adding custom policies such as reinforcement learning policies


### Analysis Pipeline Extension
The reasoning traces database and analysis pipeline are designed to be extensible, allowing researchers to develop custom analysis tools for specific research questions.

## Research Applications and Findings

Game Reasoning Arena has already enabled several interesting research observations:

- **Strategic Specialization**: Certain LLMs demonstrate strong tactical play but struggle with long-term strategic planning
- **Reasoning Diversity**: Different models exhibit distinct strategic approaches and decision-making patterns
- **Cross-Game Learning**: Some strategic insights transfer between games, while others remain game-specific
- **Opponent Modeling**: Varying capabilities in predicting and countering opponent strategies
- **Decision Consistency**: Different levels of adherence to strategic principles under pressure

These findings contribute to our understanding of LLM capabilities and limitations in decision-making scenarios that parallel real-world strategic challenges.


## Example Results

Our analysis reveals fascinating insights into how different LLMs approach strategic thinking. Here are some key visualizations from our experiments:

---

### Reasoning Pattern Distribution Across Models

![Reasoning Types Overview](/images/blog/game_reasoning_arena/0_reasoning_types.png)
*Distribution of reasoning types across all LLM models and games, showing distinct strategic thinking patterns.*

![Reasoning Patterns Across Games – Llama3 70B](/images/blog/game_reasoning_arena/radar_comparison_llm_litellm_groq_llama3_70b_8192.png)
*Radar plot showing the normalized distribution of reasoning types for each game played by Llama3 70B.*


The radar chart reveals that Llama3 70B distributes its reasoning differently depending on the game context. For example, in **Matching Pennies** and **Matrix PD**, opponent modeling dominates, while **Connect Four** favors positional play. **Rule-based reasoning** emerges in **Matrix RPS**, showing that the model switches to more deterministic strategies when the game structure rewards fixed patterns.

---

### Strategic Diversity in Different Games

![Game Entropy Analysis](/images/blog/game_reasoning_arena/avg_entropy_all_games.png)
*Reasoning entropy across different games - higher entropy indicates more diverse strategic approaches.*

![Entropy by Turn – Tic-Tac-Toe](/images/blog/game_reasoning_arena/entropy_by_turn_all_agents_tic_tac_toe.png)
*Entropy of reasoning distribution per turn for all agents in Tic-Tac-Toe.*

While the first plot compares average diversity per game, the second shows per-turn changes.

Entropy measures the diversity of reasoning patterns at each turn. Here we see  **Llama3 8B** spiking early in the game, suggesting exploration of different strategic avenues before quickly converging to a more fixed reasoning mode. In contrast, other models remain static, indicating a more rigid approach from the start.

---

### Evolution of Reasoning Patterns in Gameplay

![Llama3 8B Tic-Tac-Toe Evolution](/images/blog/game_reasoning_arena/evolution_llm_litellm_groq_llama3_8b_8192_tic_tac_toe_stacked_area.png)
*How Llama3 8B's reasoning patterns evolve during tic-tac-toe gameplay - notice the shift from positional to blocking strategies.*

![Reasoning Category Evolution – Llama3 8B Tic-Tac-Toe](/images/blog/game_reasoning_arena/evolution_llm_litellm_groq_llama3_8b_8192_tic_tac_toe.png)
*Proportion of reasoning categories as the game progresses.*

Both views tell the same story: **Llama3 8B** starts with opponent modeling, shifts to positional play, then locks into blocking for the rest of the match. This suggests a defensive bias once the mid-game begins, perhaps prioritizing risk avoidance over creating winning opportunities.

---

### Model-Specific Strategic Preferences

![Llama3 8B Reasoning Distribution](/images/blog/game_reasoning_arena/reasoning_pie_llm_litellm_groq_llama3_8b_8192.png)
*Llama3 8B shows strong preference for positional reasoning and blocking strategies.*

![Llama3 70B Reasoning Distribution](/images/blog/game_reasoning_arena/reasoning_pie_llm_litellm_groq_llama3_70b_8192.png)
*Llama3 70B demonstrates more diverse reasoning patterns with increased opponent modeling.*

![Reasoning by Game – Llama3 8B](/images/blog/game_reasoning_arena/reasoning_by_game_llm_litellm_groq_llama3_8b_8192.png)
*Reasoning type proportions for Llama3 8B across all games.*

![Reasoning by Game – Llama3.1 8B Instruct](/images/blog/game_reasoning_arena/reasoning_by_game_llm_litellm_together_ai_meta_llama_Meta_Llama_3.1_8B_Instruct_Turbo.png)
*Reasoning type breakdown for Llama3.1 8B Instruct.*

While Llama3 70B displays adaptive patterns across games, Llama3.1 8B Instruct often commits to a single reasoning mode for an entire match (e.g., Winning Logic in Connect Four, Opponent Modeling elsewhere).

---

### Aggregated Reasoning Proportions with Labels

![Stacked Reasoning Distribution – Llama3 8B](/images/blog/game_reasoning_arena/reasoning_stacked_llm_litellm_groq_llama3_8b_8192.png)
*Stacked bar chart of reasoning proportions per game, with percentage labels.*

This view makes it clear that some games (like Tic-Tac-Toe) are dominated by one reasoning type, while others (like Connect Four, Kuhn Poker) exhibit a more balanced mix.

---

### Strategic Position Analysis

![Tic-Tac-Toe Heatmap Llama3 8B](/images/blog/game_reasoning_arena/heatmap_llm_litellm_groq_llama3_8b_8192_tic_tac_toe.png)
*Llama3 8B's positional preferences in tic-tac-toe - strong center bias with tactical edge play.*

![Tic-Tac-Toe Heatmap Llama3 70B](/images/blog/game_reasoning_arena/heatmap_llm_litellm_groq_llama3_70b_8192_tic_tac_toe.png)
*Llama3 70B shows more sophisticated spatial reasoning with balanced positional strategy.*

---

These visualizations demonstrate how Game Reasoning Arena enables researchers to:

- **Compare strategic sophistication** between model sizes (8B vs 70B parameters)
- **Identify reasoning pattern evolution** during gameplay
- **Analyze positional and tactical preferences** across different games
- **Quantify strategic diversity** and decision-making consistency

Different LLMs not only vary in their strategic preferences but also in how flexible (or rigid) those preferences are over time. The data reveals that larger models (70B) tend to exhibit more adaptive, context-sensitive reasoning, while smaller models (8B) often commit early to a strategy and maintain it throughout the match.

___

### Citation
```bibtex
@article{cipolina-kun2025game_reasoning_arena,
    title={Game Reasoning Arena: A Framework and Benchmark for Assessing Reasoning Capabilites of Large Language Models via Game Play},
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

Game Reasoning Arena is released under a **CC BY-NC 4.0 license**, making it freely available for research and non-commercial applications.
