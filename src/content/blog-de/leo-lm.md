---
title: "LeoLM: Ein Impuls für Deutschsprachige LLM-Forschung"
author: "Björn Plüster"
date: "September 28 2023"
previewImg: "/images/blog/leolm-banner.jpg"
---

Lernen Sie LeoLM kennen, das erste offen und kommerziell verfügbare deutsche Foundation Language Model, das auf Llama-2 basiert.
Unsere Modelle erweitern die Fähigkeiten von Llama-2 durch ein fortgesetztes Training auf einem großen Korpus von hochwertigen deutschen und größtenteils lokal spezifischen Texten.
Dank eines Compute-Grants auf dem neuen Supercomputer **42** von [HessianAI](https://hessian.ai/) veröffentlichen wir zwei Foundation-Modelle, die mit einer Kontextlänge von 8k trainiert wurden,
[`LeoLM/leo-hessianai-7b`](https://huggingface.co/LeoLM/leo-hessianai-7b) und [`LeoLM/leo-hessianai-13b`](https://huggingface.co/LeoLM/leo-hessianai-13b) (70b folgt auch bald! 👀) unter der [Llama-2 Community-Lizenz](https://ai.meta.com/llama/license/). Zusätzlich konstruieren wir einen Evaluierungssatz für Benchmarks zur Überprüfung der Fähigkeiten deutscher Sprachmodelle, um den Modellvergleich zu standardisieren, ähnlich zu den weit verbreiteten auf Englisch basierten Evaluierungen, wie sie beispielsweise von [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) oder [LLM-Foundry](https://github.com/mosaicml/llm-foundry) bereitgestellt werden.
Mit dieser Veröffentlichung sind LAION und Hessian.AI bereit, die deutsche Open-Source und kommerzielle LLM-Forschung erheblich zu verbessern und so neue Möglichkeiten zu fördern und die weite Verbreitung zu beschleunigen.

Probieren Sie [**LeoLM/leo-hessianai-7b-chat**](https://huggingface.co/spaces/LeoLM/leo-hessianai-7b-chat) und [**LeoLM/leo-hessianai-13b-chat**](https://huggingface.co/spaces/LeoLM/leo-hessianai-13b-chat) auf HuggingFace Spaces aus!

*[[Auf Englisch lesen]](/blog/leo-lm)*

## Einleitung

Seit der Veröffentlichung der ursprünglichen Llama Foundation Models <sup>1</sup> im Januar 2023 hat die Open-Source und wissenschaftliche Forschungsgemeinschaft
eine rasante Beschleunigung in der Entwicklung von immer fähigeren Sprachmodellen erlebt. Die Fortschritte
der letzten Wochen haben die leistungsfähigsten Llama-2 <sup>2</sup> basierten Modelle näher an die Konkurrenz zu OpenAI's ChatGPT auf Basis von GPT-3.5 oder sogar dem stärkeren GPT4 gebracht.
Dennoch besteht eine bemerkenswerte Einschränkung fort: Die Mehrheit dieser bahnbrechenden Fortschritte bleibt auf den Bereich der englischen Sprache beschränkt.
Diese Einschränkung resultiert hauptsächlich daraus, dass große Open-Source-Modelle überwiegend auf monolingualen englischen Daten trainiert wurden. Obwohl es einige
Forschungen zum Zweitsprachen- oder Mehrsprachen-Finetuning gibt, sind die meisten resultierenden Modelle in ihren Fähigkeiten beschränkt und leiden unter grammatikalischen Schwächen und der US-zentrischen Voreingenommenheit, die den englischen Daten inhärent ist.

Wir wollen diese Probleme im Fallbeispiel der deutschen Sprache durch die Anwendung vieler heutiger Spitzentechniken lösen, um ein wirklich leistungsfähiges,
lokales und zweisprachiges LLM zu entwickeln.
Zu diesem Zweck präsentieren wir LeoLM (**L**inguistisch **E**rweitertes **O**ffenes **L**anguage **M**odel), eine Suite von auf Llama-2 basierenden deutschen Foundation-
Modellen und eine Auswahl begleitender Feinabstimmungen.
Des Weiteren präsentieren wir GermanBench, eine Sammlung der relevantesten ins Deutsche übersetzten englischen Benchmarks, die es uns ermöglichen in ähnlichem Ausmaß wie im Englischen, die Fähigkeiten von LeoLM gründlich zu bewerten.

<sup>1</sup>: [Touvron et al. 2023a](https://arxiv.org/abs/2302.13971)
<sup>2</sup>: [Touvron et al. 2023b](https://arxiv.org/abs/2307.09288)

## Vorverarbeitung in Phase 2

Llama-2-Modelle werden auf 2 Billionen Tokens überwiegend englischen Textes vortrainiert. Um ihre Kompetenz in der deutschen Sprache zu erhöhen, verwenden wir ein fortgesetztes Vortraining, welches wir als "Stage 2 Pretraining" bezeichnen.
Wir initialisieren LeoLM mit Llama-2-Gewichten und setzen das Training des Modells auf einem großen deutschen Textkorpus von 65 Milliarden Tokens fort, die rigoros gefiltert und dedupliziert wurden und größtenteils aus dem [OSCAR-2301-Korpus](https://huggingface.co/datasets/oscar-corpus/OSCAR-2301) stammen.
Ein wesentlicher Aspekt dieses Ansatzes besteht darin, das Vergessen oder den Verlust von zuvor erlerntem Wissen oder Fähigkeiten zu minimieren. Wir folgen den Erkenntnissen von [Gupta et al. (2023)](https://arxiv.org/abs/2308.04014) in unserer Wahl der Hyperparameter, um das Risiko des Vergessens zu minimieren.
Zusätzlich folgen wir der Arbeit von [Together](https://huggingface.co/togethercomputer/LLaMA-2-7B-32K) bei der Anwendung von [linearer RoPE-Skalierung](https://kaiokendev.github.io/til#extending-context-to-8k) und [Flash Attention 2](https://tridao.me/publications/flash2/flash2.pdf), um die Trainingseffizienz zu verbessern und die Kontextlänge auf 8k Tokens zu verdoppeln.
Siehe Abbildung 1 für einen Überblick über alle Training-Hyperparameter.

![training_parameters](/images/blog/training_params.png "Training-Hyperparameters")

## Feinabstimmungsdatensätze

Es gibt viel Diskussion darüber, was ein guter Chat/Instruktionstuning-Datensatz bieten muss, was zur Entwicklung einer Vielzahl verschiedener, erfolgreicher Ansätze geführt hat. Wir lassen uns von dieser Vielfalt inspirieren und übersetzen, um ähnliche Fähigkeiten auf Deutsch zu bringen, eine Auswahl hochwertiger Instruktionsdatensätze ins Deutsche mit OpenAI's `gpt-3.5-turbo` API. Die Verwendung von `gpt-3.5-turbo` stellt sicher, dass der Zusammenhang zwischen Aufforderungen und Antworten intakt bleibt und dass komplexe Anweisungen, die möglicherweise Code, Gleichungen oder formatierte Daten enthalten, korrekt übersetzt werden.
Aufbauend auf den Erkenntnissen der Community, wählen wir eine Vielzahl von Datensätzen aus, die wir übersetzen und für das Training unseres Chat-Modells verwenden.
Die übersetzten Datensätze sind:

- [OpenPlatypus](https://huggingface.co/datasets/garage-bAInd/Open-Platypus) -> [OpenSchnabeltier](https://huggingface.co/datasets/LeoLM/OpenSchnabeltier)
- [OpenAssistant OASST1](https://huggingface.co/datasets/OpenAssistant/oasst_top1_2023-08-25) -> [OpenAssistant-DE](https://huggingface.co/datasets/OpenAssistant/OASST-DE)

Außerdem verwenden wir [`FreedomIntelligence/evol-instruct-deutsch`](https://huggingface.co/datasets/FreedomIntelligence/evol-instruct-deutsch) und [`FreedomIntelligence/alpaca-gpt4-deutsch`](https://huggingface.co/datasets/FreedomIntelligence/alpaca-gpt4-deutsch) aus dem [MultilingualSIFT](https://github.com/FreedomIntelligence/MultilingualSIFT)-Projekt. Vielen Dank an die Autoren, dass sie ihre Daten geteilt haben!
Um die zweisprachige Nutzung zu erleichtern, trainieren wir auch Modelle auf einer Kombination dieser übersetzten Datensätze und ihren ursprünglichen, englischen Gegenstücken.

Schließlich erstellen wir, um Schwächen beim kreativen Schreiben und Reimen, die bei frühen Tests festgestellt wurden, auszugleichen, zwei weitere Datensätze:

- [GPT4 Gedichte](https://huggingface.co/datasets/LeoLM/German_Poems): Eine Sammlung deutscher Gedichte zu verschiedenen Themen, geschrieben von GPT4
- [GPT4 Lieder](https://huggingface.co/datasets/LeoLM/German_Songs): Eine Sammlung deutscher Lieder und nachfolgende Analysen, geschrieben von GPT4.

## Evaluation und Ergebnisse

Die Evaluierung der Fähigkeiten von LLMs, insbesondere von Chat-Modellen, ist komplex und die besten Methoden sind noch umstritten. Benchmarks, die auf Multiple-Choice basieren und anhand der Protokoll-Wahrscheinlichkeiten des Modells ausgewertet werden (wie im [Open LLM Leaderboard]()), sind eine derzeit beliebte Methode. Eine andere Methode bewertet Antworten automatisch mit GPT4, wie bei AlpacaEval oder MT-Bench. Dieser Ansatz richtet sich eher an Chat-Modelle, da er die Qualität von Modellantworten in realen Aufgaben berücksichtigt. Um so vergleichbar wie möglich zu sein, übersetzen wir eine Reihe von englischen Benchmarks direkt ins Deutsche. Wir veröffentlichen diese Datensätze in unserer [HF-Organisation](https://huggingface.co/LeoLM) und mit ausführlicher Dokumentation [auf GitHub](https://github.com/bjoernpl/GermanBenchmark), und Sie finden den entsprechende `lm-evaluation-harness`-Branch [hier](https://github.com/bjoernpl/lm-evaluation-harness-de/tree/mmlu_de) und den `FastEval`-Branch [hier](https://github.com/bjoernpl/FastEval).

In Abbildung 3 können Sie einen Vergleich von LeoLM gegenüber den Basis-Llama-2-Modellen auf einer Auswahl von Benchmarks mit sowohl der englischen Version (blau) als auch unserer übersetzten Version (grün) sehen. Unser Trainging verbessert die Benchmark-Ergebnisse für die deutschen Aufgaben, während die Ergebnisse für die englischen Aufgaben leicht reduziert werden. Bemerkenswert ist, dass der durchschnittliche Anstieg der deutschen Benchmark-Ergebnisse die durchschnittliche Abnahme der Leistung auf den englischen Benchmarks deutlich überwiegt, was zeigt, dass unser Ansatz das Erlernen einer neuen Sprache ermöglicht, ohne zu vergessen, was zuvor gelernt wurde. Warum die Ergebnisse in Deutsch niedriger bleiben als in Englisch, ist eine offene Frage, kann aber zum Teil auf eine Qualitätsminderung bei der Übersetzung zurückgeführt werden.

![](/images/blog/benchmarks.png)

Die folgende Tabelle zeigt die Ergebnisse auf unserer übersetzten Version von MT-Bench. MT-Bench ist ein Benchmark, der die Multi-Turn-Leistung auf einem kuratierten Satz von 80 Fragen aus mehreren Kategorien mit GPT-4 als Richter bewertet. Dabei bewertet GPT-4 die Aufforderungen auf einer Skala von 1-10 hinsichtlich der wahrgenommenen Hilfsbereitschaft, Relevanz, Genauigkeit, Tiefe, Kreativität und Detailliertheit der Antwort. Das monolinguale Modell `leo-hessianai-13b-chat` schneidet insgesamt am besten ab und kommt sogar dem GPT-3.5 im Thema "Geisteswissenschaften" nahe. Es erzielt auffallend schlechte Ergebnisse in Mathematik und Codierung, was zu erwarten ist, da die Llama-2-Modelle in diesem Bereich ohne sehr explizites Finetuning von vornherein Schwächen aufweisen. Die zweisprachigen Modelle erzielen in einigen Kategorien wie Mathematik und Logik leicht unter ihren monolingualen Gegenstücken, während sie in Codierung und Extraktion übertreffen.

![](/images/blog/mt_bench.png)
Für eine detailliertere Evaluierung, bleiben Sie dran für unser Paper!

## Qualitative Ergebnisse

Benchmarks neigen dazu, ziemlich abstrakt zu sein. Um ein besseres Gefühl für LeoLM's zu bekommen, schauen Sie sich unsere Demos an und probieren Sie es selbst aus: [**LeoLM/leo-hessianai-7b-chat**](https://huggingface.co/spaces/LeoLM/leo-hessianai-7b-chat) und den größeren Bruder [**LeoLM/leo-hessianai-13b-chat`**](https://huggingface.co/spaces/LeoLM/leo-hessianai-13b-chat). Alternativ können Sie das Modell selbst mit 🤗Transformers ausführen. Weitere Informationen zur Einrichtung finden Sie auf der [Modellkarte](https://huggingface.co/LeoLM/leo-hessianai-13b-chat).

## Fazit

Unsere Forschung hat mehrere Schlüsselbeiträge:

- Wir veröffentlichen eine Suite von deutschen Foundation-Sprachmodellen unter einer offenen Lizenz.
- Wir übertragen einen gründlichen und vielseitigen Evaluierungsansatz für Basis- und Chat-Modelle ins Deutsche.
- Wir zeigen, dass eine groß angelegte Fortbildung auch für datengesättigte Modelle wie Llama-2 ohne signifikantes Vergessen oder Verlust von früheren Fähigkeiten möglich ist.
- Wir präsentieren eine vielfältige Suite von Instruktions-/Chat-Tuning-Datensätzen, die vom Englischen ins Deutsche übersetzt wurden, um als Basis für die deutsche Open-Source-LLM-Forschungsgemeinschaft zu dienen.

Insgesamt ist die LeoLM-Modellsuite ein Proof-of-Concept für den Spracherwerb für vortrainierte Modelle. Darüber hinaus präsentiert sie sich als das erste offen verfügbare deutsche Foundation-Modell, das den heutigen Standards entspricht. Wir bei LAION hoffen, die deutsche Open-Source-Forschungsgemeinschaft anstoßen zu können, um die Abhängigkeit von geschlossenen kommerziellen Quellen wie OpenAI zu verringern. Viel Spaß mit LeoLM!

## Danksagungen

Dieses Projekt wurde von Björn Plüster (Universität Hamburg) geleitet mit Unterstützung, Anleitung und
Supervision von Christoph Schuhmann (LAION), Patrick Schramowski (LAION, Hessian AI, DFKI) und Jenia Jitsev (LAION, Juelich Supercomputing Center, Helmholtz Research Center Juelich).
Wir danken den Leuten bei hessian.AI, insbesondere Wolfgang Stille, Kristian Kersting, Florian Kieser und Patrick Diem
für ihre großzügige Rechenzeitvergabe über das Hessian AI Innovation Lab (gefördet vom Hessischen Ministerium für Digitale Strategie und Entwicklung) und das AI Service Center hessian.AISC (gefördert vom Bundesministerium für Bildung und Forschung (BMBF)), und Unterstützung während des gesamten Trainingsprozesses!  Vielen Dank auch an Jae Hee Lee von der Universität Hamburg, Andreas Köpf von Open-Assistant und Community-Mitglieder bei LAION für ihr hilfreiches Feedback. Weiterhin danken wir dem hessian.AI's Innovationslabor, dem AI Servicezentrum hessian.AISC und dem Deutschen Zentrum für Künstliche Intelligenz (DFKI) für ihre Unterstützung.

Außerdem danken wir den Gruppen, die die Datensätze für unser Chat-finetuning ursprünglich erstellt haben: [OpenAssistant](https://huggingface.co/OpenAssistant), [FreedomIntelligence](https://huggingface.co/FreedomIntelligence), [garage-bAInd](https://huggingface.co/garage-bAInd), [WizardLM](https://huggingface.co/WizardLM) and [Instruction-Tuning-with-GPT-4](https://github.com/Instruction-Tuning-with-GPT-4/GPT-4-LLM).

---

### An Example

**User:**  Warum ist open-source besonders in der KI-Forschung wichtig?

**LeoLM:**
Open-Source spielt eine wichtige Rolle in der KI-Forschung, da sie Zusammenarbeit, Innovation und Zugang zur Technologie fördert. Hier sind einige Gründe, warum Open-Source in der KI-Forschung besonders wichtig ist:

- Zusammenarbeit: Durch Open-Source können Forscher gemeinsam an Projekten arbeiten, Ideen austauschen und voneinander lernen. Dies fördert die Zusammenarbeit zwischen Forschern und kann zu schnelleren und effizienteren Fortschritten in der KI-Forschung führen.

- Transparenz: Open-Source ermöglicht Transparenz und Reproduzierbarkeit in der KI-Forschung. Forscher können den Code und die Methoden anderer sehen, reproduzieren und darauf aufbauen, was die Validierung von Ergebnissen und die Identifizierung potenzieller Schwachstellen erleichtert.

- Zugang zur Technologie: Open-Source macht KI-Technologien und -Werkzeuge einem breiteren Publikum zugänglich. Dies ermöglicht kleineren Forschungseinrichtungen und Einzelpersonen den Zugang zu KI-Werkzeugen, die ihnen sonst möglicherweise nicht zur Verfügung stünden. Dadurch kann Innovation und Forschung auch außerhalb traditioneller Zentren gefördert werden.

- Innovation: Open-Source fördert Innovation in der KI-Forschung, indem sie Raum für Experimente und neue Ideen bietet. Da der Code offen und für alle zugänglich ist, können Forscher ihn an ihre spezifischen Bedürfnisse anpassen und neue KI-Werkzeuge und -Technologien entwickeln.

- Lernen: Open-Source ermöglicht es Forschern, voneinander zu lernen. Durch die gemeinsame Nutzung von Code und Methoden können Forscher aus den Erfahrungen anderer lernen und ihre eigenen Forschungsprojekte verbessern.

Zusammenfassend ist Open-Source ein wichtiger Aspekt der KI-Forschung, da er Zusammenarbeit, Transparenz, Zugang zur Technologie, Innovation und Lernen fördert. Dadurch wird die KI-Forschung effizienter, innovativer und zugänglicher für eine breitere Palette von Forschern und Institutionen

| [Link zu einer PDF mit mehr Beispielen](/documents/leo-lm.pdf) |
|----------|
