---
title: "Introducing BUD-E 1.0: AI-Assisted Education for Everyone"
author: "LAION"
date: "Jan 20 2025"
previewImg: "/images/blog/bud-e-1.0.png"
---

Today marks a milestone in our journey towards democratizing education and empathy through technology. LAION e.V. *is thrilled to announce the release of BUD-E* version 1.0, an open-source, privacy-compliant AI education assistant framework.

BUD-E, which stands for Buddy for Understanding and Digital Empathy, represents our first step towards realizing a grand vision: providing every person on Earth with access to a free, intelligent, and caring education assistant. This release includes three distinct versions tailored to different needs:

- School Bud-E, a specialized web-based version for educational settings.
- Bud-E, a general-purpose, customizable web-based assistant.
- Desktop Bud-E, a Python*-based desktop application that can be used as a smart Google Home/Alexa Replacement with wake word activation and the latest models in the backend.

[![School Bud-E Video](/images/blog/school-bud-e-video.png)](https://www.youtube.com/watch?v=gcSPuZ7LtE0)
[![School Bud-E Video 2](/images/blog/school-bud-e-example-2.png)](https://www.youtube.com/watch?v=IxHnpISMNPo)

## BUD-E: A New Era of AI-Assisted Education

The Large-scale Artificial Intelligence Open Network (LAION) collaborates with Intel as part of the new AI/oneAPI Center of Excellence (CoE) we established in September last year.

Our CoE's mission is to advance the development of BUD-E, an open source, empathetic AI education assistant that aims to democratize personalized learning worldwide. LAION is proud to work with Intel, famous for the International Science and Engineering Fair founded by former Intel CEO Gordon Moore.

We hope to replicate the mentorship and resources that used to be only available to a select few,
scale it to the extent that every child in the world has access to a personalized education and the deep knowledge that used to be siloed in only the most prestigious educational institutions.

For our development, we actively leveraged the new Intel® Core™ Ultra Processors Series 2 AI PCs as well as Intel® Neural Compressor, OpenVINO™, and Intel® Optimizations for PyTorch*.

These components helped us to design our local first” peer-to-peer MLops architecture that preserves the children’s privacy. This peer-to-peer integration to individual nodes asks computers within its zone of trust, for machine learning inference, datasets, and models, using them as tools that the local language model can use to compose the correct answer,

For example, schools can utilize the Open Platform for Enterprise AI (OPEA*) to generate a graphrag of the school curriculum, serve Llama 3.1 405b, a video diffusion model, provide storage, or other things that won’t fit on a laptop form factor. It will also allow parents to put guardrails on the language model’s outputs, customize the curriculum or the special needs that the child needs help with, and collaborate with peers via a real-time generative AI-enabled whiteboard experience.

## A Vision of Universal Access to Personalized Learning

Imagine a world where every child, regardless of background or circumstances, has a personal AI tutor available 24/7. A world where adults seeking to learn new skills or change careers have a patient, understanding guide to help them along their journey. This is the future we're working towards with BUD-E.

We believe education is the great equalizer, the key to unlocking human potential and fostering understanding between people of all backgrounds. However, access to quality, personalized education remains a privilege accessible for too few. Technology, particularly AI, has the potential to change this – not by replacing human teachers but by augmenting and extending their reach.

BUD-E embodies our belief that an AI assistant can be more than just a source of information. We envision it as a companion in the learning journey – one that's empathetic, encouraging, and adapted to each individual's unique learning style and needs. While we just started on the road towards fully realizing our vision, BUD-E 1.0 and its specialized variants lay the groundwork for this ambitious goal.

## The Path to Democratizing Empathy and Education

Several core principles guide our journey with BUD-E:

1. **Accessibility**: Education should be available to everyone, regardless of financial means or geographic location.
2. **Privacy**: Learning is a personal journey, and users' data should be protected and respected.
3. **Transparency**: As an open-source project, BUD-E's workings are open for scrutiny and improvement by the community.
4. **Adaptability**: Every learner is unique, and educational tools should adapt to individual needs and preferences.
5. **Empathy**: Effective learning requires not just information but understanding, encouragement, and emotional support.

These principles are at the heart of the design of all BUD-E versions and will continue to guide their development.

## School Bud-E: An AI Learning Companion for the Classroom

In collaboration with the Intel AI Center of Excellence and the German Research Network for AI (DFKI), we're proud to release School Bud-E 1.0, a specialized web-based version of BUD-E designed to enhance the educational experience for students and teachers alike.

School Bud-E is more than just a chatbot; it's a privacy-first AI learning companion that brings a new dimension of support and engagement to the classroom. Here are some of its key features:

- **Privacy Compliance**: All interactions within School Bud-E are only stored locally in the user's browser. Using self-hosted or privacy-compliant APIs ensures that sensitive student data remains protected and private.
- **Inspiring Learning Support**: School Bud-E features a carefully crafted system prompt that fosters engaging, age-appropriate interactions. It's designed to adapt to each student's learning style, providing encouragement and sparking curiosity.
- **Wikipedia Integration**: The assistant can access Wikipedia* and provide information on request. For access, use #wikipedia: KEYWORDS:TOP_N; to specify the database, use #wikipedia_de or #wikipedia_en. We provide endpoints for searching in vector databases with BGE-M3 embeddings for English and German Wikipedia
- **Curriculum Retrieval**: Teachers can effortlessly search school curricula using custom database endpoints, enabling School Bud-E to perform retrieval-augmented generation. Our system comes with an endpoint that performs Best Match 25 (BM25) search in all public school curricula of the German state of Hamburg. Simply use commands like #bildungsplan: KEYWORDS:TOP_N (e.g., #bildungsplan: artificial intelligence:5).
- **Scientific Paper Retrieval**: School Bud-E can search through more than 85 million abstracts of scientific papers provided by the ASK* Open Research Knowledge Graph Initiative from the University of Hannover. For instance, using the command #papers: quantum computing:3 will retrieve the top three papers related to quantum computing, while #papers: climate change impacts:5 would return the top five papers on the impacts of climate change. Importantly, just like with Wikipedia and curriculum integration, the endpoint for this scientific paper database can be replaced with custom endpoints, allowing schools to integrate their own preferred research databases.
- **Automated Assessment**: School Bud-E can help with suggestions for homework or test corrections using multimodal evaluation that combines optical character recognition (OCR) and AI, providing fair and consistent assessment of homework and exams. Simply upload images of the tests and use the #correction or #korrektur command.
- **Natural Conversations**: Powered by advanced automatic speech recognition (ASR) and text-to-speech (TTS) technology, School Bud-E offers responsive voice interactions, enabling users to use the system like a voice message app.
- **Flexible Deployment**: School Bud-E can be deployed using Docker Compose for ease of setup or run locally using a Deno server, providing flexibility for different technical environments.
- **Multilingual Support**: School Bud-E can support over 100 languages depending on the APIs used. For example, combining Whisper and a Fish TTS 1.5 School Bud-E can understand and reply with text-to-speech output in 11 languages. Similarly, combining Whisper and camb.ai’s MARS6 model, Bud-E can reply in over 100 languages in the same voice, creating unparalleled accessibility for students from diverse cultures and backgrounds.
- **Universal API Key**: Instead of providing several API keys, URLs, and models for each category, we now also offer the input of a single universal API key that automatically makes use of the default text-generation, speech-to-text, text-to-speech, and vision-language model

## A Web-Based Frontend for Easy Access

The [School Bud-E web frontend](https://github.com/LAION-AI/school-bud-e-frontend) allows students and teachers to interact with the assistant directly from their browsers without needing to install any software. This web interface is designed for classroom use and offers intuitive voice message interactions similar to popular messaging apps.

## Customizable Backend for Enhanced Flexibility

School Bud-E allows users to specify their own API endpoints and backend models. This means schools can choose the AI models that best fit their needs and resources, whether self-hosted open-source models or commercial APIs.

## Bud-E: Your Customizable, General-Purpose AI Companion (Web-Based)

We're also introducing Bud-E, a browser-based AI assistant that empowers users to customize their experience fully. This version puts the power of choice in your hands, allowing you to tailor the assistant to a wide range of tasks and preferences.

The key difference between Bud-E and School Bud-E is that Bud-E provides more freedom to define its personality by specifying your own system prompt. Whether you want a creative writing assistant, a research companion, or a friendly conversationalist, you're in control.

## Desktop Bud-E 1.0: Your Python-Based Desktop AI Assistant

For users who prefer a desktop application, we offer **Desktop Bud-E 1.0**, a Python-based client that brings BUD-E's capabilities right to your desktop.

### Key Features of Desktop Buddy

- **Desktop Integration**: Desktop Bud-E functions similarly to Microsoft Copilot, integrating seamlessly with your desktop environment.
- **Screenshot and Clipboard Interaction**: Capture screenshots and interact with your clipboard, allowing Desktop Buddy to understand and assist with many varied tasks.
Local Command Execution: Execute local commands, further extending Desktop Buddy's capabilities.
- **Modular Design**: Like other BUD-E versions, each component (ASR, LLM, TTS, Vision) can be swapped out or updated independently, ensuring you always have access to the best tools.
- **Skill System**: Execute Python functions either on the server or locally, opening up possibilities for various activities, from database queries to interactive experiments.
Tested on Windows and Ubuntu: Desktop Buddy has been thoroughly tested on popular operating systems.

Desktop Buddy is ideal for users who want a powerful, locally integrated AI assistant that can interact with their desktop environment and execute local commands.

## Technical Foundation: Flexibility and Openness

All BUD-E versions are built on a flexible client-server architecture. This allows for easy deployment, component upgrades, and adaptation to evolving technology.

### Server Components

1. **Automatic Speech Recognition (ASR)**: The ears of BUD-E, converting speech to text.
2. **Language Model (LLM)**: The brain of BUD-E, processing text and generating responses.
3. **Text-to-Speech (TTS)**: The voice of BUD-E, converting text responses to speech.
4. **Vision Processing**: The eyes of BUD-E, handling image captioning and OCR.

## The Road Ahead

We are under no illusions about the challenges ahead. Creating an AI assistant that truly understands and empathizes with learners, can explain complex concepts intuitively, and can foster a love of learning is an enormous task. BUD-E 1.0 in its different versions is but a small first step. It is important to note that the current version of BUD-E does not yet possess the capability to understand users' emotions, and BUD-E 1.0 is not intended to be used for emotion recognition. The purpose of BUD-E 1.0 is not to identify or infer emotions or intentions of natural persons on the basis of their biometric data, as defined under the European Union's AI Act. While basic emotion recognition could be helpful to the learner, for example by encouraging a learner whose voice sounds discouraged, we believe deployment should be cautious, transparent and responsible. We believe these features could be implemented by leveraging multimodal APIs like Gemini Audio or HUME AI for emotion recognition, but we have not yet integrated these features due to time constraints and regulatory considerations.

AI systems intended to be used for emotion recognition are classified as high-risk under [Annex III of the European Union's AI Act](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689#anx_III). Therefore, we do not recommend implementing and putting into practice any empathetic voice assistance capable of understanding users' emotions in the European Union yet without careful review. However, we firmly believe that empathetic AI assistants hold immense potential for creating more engaging and curiosity-sparking educational experiences. The ability to connect with users on an emotional level, in addition to an intellectual one, is a crucial ingredient for building systems that can truly help individuals explore the world more holistically. As such, we plan to pursue, in consultation with our EU attorneys, the development of empathetic voice assistance in general and also specifically for educational settings where safety measures could allow for emotion detection.

Beyond developing empathetic capabilities, our roadmap includes improving natural language understanding and expanding the skill library; including more advanced tools for research, interactive learning, and other tasks.

## Credits and Thanks

The LAION team closely collaborates with Intel’s Jayaraman Mahalingam (Jay) and Desmond Greely to make our vision a reality.

Jay provided LAION with Access to the new Intel® Core™ Ultra Processors Series 2 (formerly code-named Lunar Lake) AI PCs using Intel® Neural Compressor, OpenVINO™ and Intel® Optimizations for PyTorch.

Desmond additionally provided the LAION team with access to cutting-edge Intel® Gaudi® AI Accelerators, to train Llama language models capable of driving 3d Avatars, by teaching language models how to express themselves emotionally and thoughtfully with audio tokens, chain of thought tokens, and body pose tokens using PyTorch Lightning.

We also thank

Hamburg’s [Behörde für Schule und and Berufsbildung (BSB)](https://www.hamburg.de/politik-und-verwaltung/behoerden/schulbehoerde), and  specifically [Dr. Najibulla Karim](https://bildungsserver.hamburg.de/schulfaecher/kontakt-mint-referat-710650) and [Dr. Janosch Schindler](https://jtschindler.github.io/) for their great feedback and support.

Hallucinate LLC, and specifically [Benjamin Barber](https://github.com/endomorphosis/) and his partners [Marc-Emanuel Otto](https://github.com/mwni) and [Kevin De Haan](https://github.com/coregod360), for being willing to open source parts of their previous MLops architecture, and donating their time and effort to create a new MLops architecture to support the LAION  educational mission.

[Robin Yuen Shing Hei](https://github.com/Robinysh), who helped us prototype the model training code for a llama based audio language modeling presented at Neurips [Internalizing ASR with Implicit Chain of Thought for Efficient Speech-to-Speech Conversational LLM](https://arxiv.org/abs/2409.17353), and we wish him luck in his new role at Soundhound.

John Oberg of [Komagome Gakuen High School](https://www.komagome.ed.jp/education/steam.php) for evaluating the impact of large language models on English language learners in Japan, and developing lesson plans to integrate LLMs into the classroom.

## Join Us in Revolutionizing Education

We believe that by working together – developers, educators, researchers, students, and enthusiasts – we can create an AI assistant that truly empowers learners worldwide. BUD-E is more than just a software project; it's a movement towards a future where quality, personalized education is a right, not a privilege.

Whether you're interested in contributing code, testing the system in educational settings, or simply providing feedback on your experiences, your input is invaluable. Every contribution, no matter how small, brings us one step closer to a world where everyone has access to the education they need to thrive.

To get involved or learn more about BUD-E, you can test the web versions of the
BUD-E Personal Assistant and School BUD-E today.

You can also

- Visit our GitHub repositories
- Join our community Discord
- Reach out to us at <bud-e@laion.ai>

Let's work together to unlock the potential of every learner, foster global understanding, and create a brighter future for all.

## Download and Contribute

The journey of a thousand miles begins with a single step. BUD-E 1.0 is our first step. Will you take the next one with us?

- [LAION-AI/bud-e](https://github.com/LAION-AI/bud-e/tree/main): A general human-ai interaction platform.
- [LAION-AI/school-bud-e-frontend](https://github.com/LAION-AI/school-bud-e-frontend): A frontend that is compatible to the school-bud-e-backend.
- [LAION-AI/Desktop-BUD-E_V1.0](https://github.com/LAION-AI/Desktop-BUD-E_V1.0): BUD-E (Buddy) is an open-source voice assistant framework that facilitates seamless interaction with AI models and APIs, enabling the creation and integration of diverse skills for educational and research applications.

Together, we can transform education, one conversation at a time.

We encourage you to check out and incorporate Intel’s other [AI/ML Framework optimizations and tools](https://www.intel.com/content/www/us/en/developer/tools/frameworks/overview.html) into your AI workflow and learn about the unified, open, standards-based [oneAPI](https://www.intel.com/content/www/us/en/developer/tools/oneapi/overview.html) programming model that forms the foundation of Intel’s [AI Software Portfolio](https://www.intel.com/content/www/us/en/developer/topic-technology/artificial-intelligence/overview.html) to help you prepare, build, deploy, and scale your AI solutions.

## Additional Resources

- [Intel AI Developer Tools and resources](https://www.intel.com/content/www/us/en/developer/topic-technology/artificial-intelligence/overview.html)
- [oneAPI unified programming model](https://www.intel.com/content/www/us/en/developer/tools/oneapi/overview.html%23gs.h7kofh)
- [Generative AI](https://www.intel.com/content/www/us/en/developer/topic-technology/artificial-intelligence/training/generative-ai.html)
