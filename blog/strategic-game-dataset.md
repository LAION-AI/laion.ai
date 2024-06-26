---
title: "Strategic Game Datasets for Enhancing AI Planning: An Invitation for Collaborative Research"
author: "Christoph Schuhmann & Qi Sun"
date: "Oct 18 2023"
previewImg: "/images/blog/chessboard.png"
---

Recent advancements in artificial intelligence (AI) underscore the progress of reasoning and planning shown by recent generalist machine learning (ML) models. The progress can be boosted by datasets that can further boost these generic capabilities when used for training foundation models of various kind. This research initiative has generated extensive synthetic datasets from complex games — chess, Rubik's Cube, and mazes — to study facilitation and the advancement of these critical generic skills in AI models. This paper delineates the methodology, dataset structure, and preliminary analysis, concluding with an open invitation for collaborative research.

## Introduction

The field of AI has observed a pivotal shift toward foundation generalist models capable of advanced strategic planning, essential for complex problem-solving tasks. Recognizing the potential of various complex games as ideal proxies for real-world problems, this research focuses on the generation of large-scale synthetic datasets. These datasets are designed to challenge and enhance the strategic planning capabilities of generative pre-trained transformers (GPT) and similar models.

## Dataset Overview

### 1. Chess

The [chess dataset](https://huggingface.co/datasets/laion/strategic_game_chess) comprises 3.2 billion games, equating to approximately 608 billion individual moves. These games, generated via self-play by the Stockfish engine, emulate a high strategic complexity, reflective of a 2500 Elo rating. Each entry contains detailed move sequences, termination status, and game results.

### 2. Rubik's Cube (3x3x3)

The [rubik's cube dataset](https://huggingface.co/datasets/laion/strategic_game_cube) features 1.64 billion Rubik's Cube solves, totaling roughly 236.39 billion moves. It provides initial scrambled states and the ensuing solve sequences, offering a [complex problem-solving scenario for models to navigate](https://github.com/trincaog/magiccube/).

### 3. Mazes

The [maze dataset](https://huggingface.co/datasets/laion/strategic_game_maze), while smaller at 350,000 mazes, represents over 39.29 billion moves. Each maze is a 30x30 ASCII representation, with solutions derived using the A* algorithm, challenging pathfinding and planning algorithms.

## Methodology

The datasets were constructed using rigorous methodologies to ensure complexity and relevance. Chess games were generated through self-play by a sophisticated chess engine, Rubik's Cube states were randomized and then solved using an advanced solving tool, and mazes were procedurally generated and solved using a robust pathfinding algorithm.

## Purpose

The aim extends beyond game proficiency. The synthetic, procedurally generated datasets serve to enhance AI models' internal representation and problem-solving strategies, devoid of legal and ethical complications associated with other data forms. The training leverages the strategic depth of these games to develop advanced planning capabilities in AI models.

## Call for Collaboration

We invite interested researchers and ML practitioners to explore these datasets' potential. Whether training GPT models from scratch or fine-tuning pre-existing models, we encourage the exploration of various pre-training and fine-tuning strategies using these game-based datasets standalone or as enhancement of other already composed large-scale data.

Our team is prepared to assist in securing necessary GPU resources for these explorations. We are particularly interested in collaborators eager to pre-train models of small to medium scale on our game data, subsequently transition to standard text-based training, and then perform comparative analyses against models of similar architecture trained exclusively on text data.

Conclusively, this initiative marks a significant stride toward intricate problem-solving and strategic planning in AI, extending an open invitation to the research community for collaborative advancement in this domain.

## Acknowledgements

Special thanks to Prof. Rio Yokota for providing the necessary compute time on the Fugaku supercomputer and Yago Kastro for coding the first draft of the chess selfplay script.
