---
title: "Releasing Re-LAION 5B: transparent iteration on LAION-5B with additional safety fixes"
author: "LAION e.V."
date: "Aug 30, 2024"
previewImg: "/images/blog/laion-blue.png"
---

Today, following [a safety revision procedure](https://laion.ai/notes/laion-maintenance/), we announce Re-LAION-5B, an updated version of LAION-5B, that is the first web-scale, text-link to images pair dataset to be thoroughly cleaned of known links to suspected CSAM.

## Highlights

- Re-LAION-5B fixes the issues as reported by Stanford Internet Observatory in December 2023 for the original LAION-5B and is available for download in two versions, [Re-LAION-5B research](https://huggingface.co/collections/laion/re-laion-5b-research-67e312387d2a4f879c4920b1) and [Re-LAION-5B research-safe](https://huggingface.co/collections/laion/re-laion-5b-research-safe-67e311013ba899a938569e32). The work was completed in partnership with the Internet Watch Foundation ([IWF](https://www.iwf.org.uk/)), the Canadian Center for Child Protection ([C3P](https://www.protectchildren.ca)), and Stanford Internet Observatory. For the work, we utilized lists of link and image hashes provided by our partners, as of July 2024.
- In all, 2236 links were removed after matching with the lists of link and image hashes provided by our partners. These links also subsume 1008 links found by the Stanford Internet Observatory report in Dec 2023.  Note: A substantial fraction of these links known to IWF and C3P are most likely dead (as organizations make continual efforts to take the known material down from public web), therefore this number is an upper bound for links leading to potential CSAM.
- Total number of text-link to images pairs in Re-LAION-5B: **5.5 B (5,526,641,167)**
- [Re-LAION-5B metadata](https://huggingface.co/collections/laion/re-laion-5b-research-67e312387d2a4f879c4920b1) can be utilized by third parties to clean existing derivatives of LAION-5B by generating diffs and removing all matched content from their versions. These diffs are safe to use, as they do not disclose the identity of few links leading to potentially illegal material and consist of a larger pool of neutral links, comprising a few dozen million samples. Removing this small subset does not significantly impact the large scale of the dataset, while restoring its usability as a reference dataset for research purposes.
- Re-LAION-5B is an open dataset for fully reproducible research on language-vision learning - freely available and relying on 100-percent [open-source composition pipelines](https://github.com/rom1504/img2dataset/), released under Apache-2.0 license.

## Organizational note / Background

In today's state-of-the-art machine learning research, web-scale datasets are needed to develop and study one of the most important model class - foundation models. Such models exhibit scaling laws, improving their function with growing model, compute and data size in the pre-training, resulting in strongly transferable models at larger scales. Such models serve as core artifacts and a very important subject of study for the machine learning research community, and it is critical to secure full transparency and reproducibility of such studies.

Part of our work at LAION is thus dedicated to building open and transparent datasets resulting in fully reproducible routines for dataset composition. Open datasets like LAION-400M or LAION-5B made the studies around foundation models fully reproducible (eg as done in our studies with openCLIP) - in contrast to studies that train and study closed models (openAI GPT, CLIP, DALL-E, Anthropic Claude, Google Gemini) or open weights foundation models (Llama, Mistral, Gemma), which do not disclose dataset composition routines and/or dataself itself, making reproduction of the findings impossible.

Open datasets necessary for open science and for reproducible studies of foundation models contain information found on the public web. Such open datasets are also often used to train various AI models by industry.  Due to the research nature of such open datasets, they contain diverse data to reflect the full variety and complexity of the real world. A still open question is how to conduct reproducible procedures for open dataset composition that can ensure that clearly illegal content is successfully filtered out when gathering data from the public web, as it unfortunately still cannot be guaranteed that all available samples on publicly accessible web are properly satisfying legal requirements.

At LAION, we are dedicated to building safe and legally compliant datasets and tools to advance research and promote widespread accessibility of AI for academia and technology. However, while contributing to important solutions necessary for basic and applied research in machine learning at larger scales, we are aware that we as a non-profit research organization with limited resources cannot single-handedly rectify all publicly available online information. We play a significant role, but not the entirety of it, building alliances with people and organizations that possess strong expertise and skills in handling large-scale dataset composition and pipelines necessary to perform it together.

We take full accountability for the accuracy of our publications, whether datasets, models, or tools. Prior to releasing LAION-400M and LAION-5B to the public, we implemented and refined filters to eliminate various problematic content. [See our original announcement from 20.08.2021](https://laion.ai/blog/laion-400-open-dataset/#filtering-out-unsuitable-image-text-pairs), where points 6-9 describe the specific measures we took for filtering CSAM related material. However, the findings from David Thiel (Stanford Internet Observatory, 19.12.2023) revealed that some links pointing to illegal content still slipped through our filters into LAION-5B text-links to images dataset, which led us to [promptly withdraw LAION-5B from circulation for the necessary safety revision](https://laion.ai/notes/laion-maintenance/).

Regarding datasets, we believe an open approach is the most effective and safe one, because in addition to securing reproducibility, it also empowers anyone to inspect and see what’s inside, allowing for validation and for scientific progress executed together by the broad community, continually checking and improving the dataset as important artifact in a transparent manner.  We think as with any open-source project, also open datasets should be subject to continuous scrutiny by the broad community, in a common effort to make open datasets better and better. We thus appreciate very much  the effort David Thiel from the Stanford Internet Observatory undertook to look closely at LAION 5B and are grateful to all partner organizations for working with us on making it a better, safer dataset for the research community to use.

After [removing LAION-5B dataset from the public web in late December last year, 19.12.2023](https://laion.ai/notes/laion-maintenance/), we used our already existing partnership with the Internet Watch Foundation ([IWF](https://www.iwf.org.uk/)) and established new partnership with the Canadian Children Protection organization ([C3P](https://www.protectchildren.ca)) to **develop a system for identifying and removing illegal content**. In addition, **we removed further specific privacy data provided to us by Humans Rights Watch** ([HRW](https://www.hrw.org/)). We are grateful for their cooperation, as these organizations possess vast expertise in handling sensitive data and were able to help us to gain access to information necessary for the filtering

The outcome is a revised version of LAION-5B - **Re-LAION-5B**, which we release **in two various versions**, [Re-LAION-5B research](https://huggingface.co/collections/laion/re-laion-5b-research-67e312387d2a4f879c4920b1) and [Re-LAION-5B research-safe](https://huggingface.co/collections/laion/re-laion-5b-research-safe-67e311013ba899a938569e32). These releases will serve in the same way as reference datasets to pre-train open foundation models (e.g., [openCLIP](https://github.com/mlfoundations/open_clip)), while at the same time being free of the links to suspected CSAM material on public web as gathered by the partner organizations IWF and C3P up to July 2024. By partnering with IWF & C3P and removing the links to potential CSAM known to them, **we set a new safety standard for cleaning web-scale image-link data sets**.

In the following, we describe in more detail the motivation behind the releases and procedures that we executed to make the releases happen.

## Motivation

On December 19, 2023, research conducted by David Thiel at the Stanford Internet Observatory uncovered evidence of URL links to potential illegal image samples (CSAM) within the publicly accessible LAION-5B dataset. Among the vast 5.8 billion image links sourced from the public internet within LAION-5B, Stanford reportedly identified 1008 links (0.000017 % of the full dataset) pointing to either “CSAM” or “likely CSAM"

The Stanford report prompted an immediate takedown of LAION-5B and we initiated a comprehensive safety revision. We express our gratitude for the support from the Internet Watch Foundation ([IWF](https://www.iwf.org.uk/)), the Canadian Children Protection organization ([C3P](https://www.protectchildren.ca)), and Stanford in helping us to identify and safely remove potential illegal content from LAION-5B.

## Safety Revision

### Phase 1: Taking down the dataset and its derivatives

As soon as we were informed of the Stanford report on 19.12.2023, we took down all known accessible LAION-5B datasets and its derivatives, also deleting the data and metadata in any accessible facilities where suspicion for links to potential CSAM was given.  

We posted an [update to the LAION website](https://laion.ai/notes/laion-maintenance/) and urged everyone using the LAION 5B dataset to delete it or to take their own steps to remove any suspected links to CSAM or CSAM samples.

Unfortunately, we learned about the report not from the representatives of  Stanford Internet Observatory timely in advance, but from the press, specifically from Bloomberg, only 1 day before the report release. This approach of informing the press before notifying the involved organizations with an extensive security report [does not align with standard safety best practices for handling security issues](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html). Typically, organizations should be informed first so they have reasonable time to take immediate action to remove harmful content and prevent exploitation. This created an unfortunate situation for safety - as we could react only with substantial delay, although the issues were known to Stanford Internet Observatory many weeks or even months before. **We thus strongly urge all organizations to adhere to safety best practices in these matters** in the future. **Timely and direct communication of validated safety related findings with affected organizations and communities is crucial to ensure that harmful content can be promptly addressed and mitigated**, reducing duration for it where it can cause harm.

### Phase 2: Analysis using hash lists and filtering

Using the established official cooperation with Internet Watch Foundation ([IWF](https://www.iwf.org.uk/)) and Canadian Children Protection organization ([C3P](https://www.protectchildren.ca)), LAION has obtained lists of MD5 image and URL hashes for the CSAM on public internet discovered by the organizations so far. LAION also used the established contact to David Thiel, the author of the Stanford Internet Observatory Report, to obtain details on the nature of discovered CSAM samples and also lists of further hashes.  

LAION used the lists of hashes and other information obtained from our cooperation to remove links to all known suspected CSAM samples from the metadata of the dataset and to create updated dataset versions that are free of any links to suspected CSAM samples currently known to major organizations like IWF and C3P who were collecting evidence of those from public internet across a long period of time.

Importantly, the **list of hashes allowed LAION to remove all suspected links WITHOUT ever having to touch suspected links or even having to inspect content those are leading to**, thanks to the **work done by the partner organizations IWF and C3P**.

In addition, further privacy related data that did not contain any illegal content was removed in cooperation with the Human Rights Watch.

## Results of the safety revision investigation

### Results, overview

First, we report the total amount of unique hashes, either MD5 image or URL hashes, we received from our partners (C3P and IWF):

Total amount of unique hashes provided by the partners: 2.2M ([IWF](https://www.iwf.org.uk/)) + 14M ([C3P](https://www.protectchildren.ca)) = 16.2M

Those are hashes we have used to conduct filtering procedures to filter out links to potential CSAM. Importantly, the hashes provided by our partner organizations make it possible to remove all suspected links WITHOUT ever having to touch suspected links or to inspect content those are leading to.

We can report following:

- Total amount of matches with links in LAION-5B using C3P, IWF and hashes provided by David Thiel (Stanford Internet Observatory): 1129 ([C3P](https://www.protectchildren.ca)) + 18 ([IWF](https://www.iwf.org.uk/)) + 1714 (Stanford Internet Observatory) = 2236 (0.000038 % of the total dataset)
- For comparison: total amount of suspected “live” links to “CSAM” or “likely CSAM” samples as validated by David Thiel in Stanford Internet Observatory report: 1008 (0.000017 % of the total dataset; relying on the numbers in the investigation - those number have not been checked by any third party since the publication)
- Thus, we have a total of 2236 matches with suspected links to CSAM or potential CSAM encountered in LAION-5B that we can report from our investigation using hashes provided by our partner organizations. These matches also contain 1008 links from Stanford Internet Observatory report .

This number is a strict upper bound for the estimate of links leading to potential CSAM samples, as known by our partner organizations IWF and C3P in July 2024. It cannot be determined exactly which fraction of 2236 links indeed points to illegal samples, as we do not inspect links or the content they are leading to due to potential illegal nature and match only the precomputed hashes. Many of the matched links can be dead leading to nowhere. 2236 is thus the upper bound for the number of links leading to potential CSAM; the number of links indeed pointing to illegal material is most likely much lower, as those links are already known to organizations that clean the public web from CSAM material, which usually results in taking down the actual content links are pointing to or even removing the whole entity domain responsible for the hosting of that content, making access to it unavailable. To have some estimate, consider the following: Stanford Internet Observatory report claimed 1008 suspected links in LAION-5B that were validated to be “live” on public web in December 2023. The report has used the same C3P information as LAION, which makes it very likely that around 2236 - 1008 = 1228 of matched links are dead.

As we have used a vast collection of over 16M hashes to images and links with suspected CSAM provided by C3P and IWF, which represents all CSAM or likely CSAM on public web currently known to these major organizations in 2024, we can state that 2236 is an upper boundary for the links to suspected CSAM in original LAION-5B. Our research thus supports the number of links to suspected CSAM to be in the order of magnitude of 1-2k, as reported by Stanford Internet Observatory, and not larger.

## Chronological protocol

Following are details and chronological overview of the matching procedures we were conducting to determine matches in LAION-5B based on the provided hash lists:

### 20.02.2024: David Thiel - General Infos, SHA hashes

Punsafe for most of the detected samples : > 0.95
For the samples below < 0.95, SHA hashes provided (92 samples)

### 22.02.2024: IWF - MD5 image hashes

Total: 1.5M unique image MD5 hashes provided by IWF

Matches in LAION-5B:
6 matches over laion2B-en
1 match over laion2B-multi
4 matches in laion1B-nolang

Total: 11 matches

### 20.03.2024: C3P - MD5 image hashes

Total: 14M unique image MD5 hashes provided by C3P

Matches in LAION-5B:

459 matches over laion2B-en
390 matches over laion2B-multi
280 matches over laion1B-nolang

Total: 1129 matches.

### 26.03.2024: IWF - MD5 image hashes and link hashes

Total: 2.2M unique image MD5 hashes provided by IWF; using additional flag “G” to retrieve all UK category A-C MD5 hashes including Grid Images and all non-Self-evident hashes

Matches MD5 hashes in LAION-5B:
9 matches over laion2B-en
3 matches over laion2B-multi
5 matches in laion1B-nolang

Matches URL hashes in LAION-5B:
1 match over laion2B-en
0 matches over laion2B-multi
0 matches in laion1B-nolang

Total: 18 matches (11 from before + 6 when using “G” flag + 1 URL hash match)

### 24.04.2024: David Thiel (Stanford Internet Observatory) - SHA hashes

Total: 3114 unique SHA hashes provided by David Thiel  

Matches in LAION-5B:
788 matches over laion2B-en
487 matches over laion2B-multi
439 matches in laion1B-nolang

Total: 1714 matches

### 30.05.2024: Hye Jung Han (HRW) - links to samples with privacy data

In addition, during our ongoing safety revision we were contacted by Hye Jung Han (Human Rights Watch, HRW), who reported 399 links pointing to samples on public web that potentially contain private infos of children WITHOUT containing any CSAM or other illegal material. Upon inspection, only a part of the links were found to indeed contain private infos, while many others among reported 399 were not confirmed to contain any sensitive data. In abundance of caution, we have still removed any of the links that were matching HRW collection

Total: 41 (1. Report) + 358 (2. Report) = 399 links to public web provided by HRW

## Update of LAION-5B dataset and Re-LAION release versions

We use following procedures to update the old original version of LAION-5B dataset and to arrive to release versions that are free of any known links to suspected CSAM samples collected by our partner organizations IWF and C3P:

We match URL and image MD5 and SHA1 hashes  to the hashes we had precomputed for the original LAION-5B. Those hashes were computed [following the study by Nicholas Carlini et al](<https://arxiv.org/abs/2302.10149>) on possible dataset poisoning attacks back in March 2023. The hashes were computed back then to prevent the injection of false samples into the original dataset. Using the same hashes, we could identify the matches between the lists of hashes for known CSAM samples and hashes of entries in the LAION-5B dataset, and remove all the matches. We also remove the matches to the samples containing children's private infos as conveyed by HRW.
Starting from the version of the dataset metadata with all the known links to suspected CSAM samples removed, we have created two release versions:

1. [Re-LAION-5B-research](https://huggingface.co/collections/laion/re-laion-5b-research-67e312387d2a4f879c4920b1). In this version, we take the observations made during matching CSAM hash lists and reports by David Thiel and choose a certain value of p_unsafe to serve as threshold, above which all samples are removed if the keyword based text filters indicate suspicious content. For Re-LAION-5B-research, this threshold is determined to be p_unsafe>0.95. The choice is motivated by the fact that the overwhelming majority of identified CSAM matches was concentrated at values p_unsafe > 0.99, with minimal value corresponding to 0.95, which we choose to be the threshold. The keyword based text filters we employ in conjuction with threshold criterion are constructed from keyword recommendations provided by major children protection organizations. This joint procedure leads to removal of 1.121 % (22.42 M from 2B; 65 M from 5.8B) samples from the original LAION-5B dataset
2. [Re-LAION-5B-research-safe](https://huggingface.co/collections/laion/re-laion-5b-research-safe-67e311013ba899a938569e32). In this release, we in addition remove the majority of NSFW samples. We chose p_unsafe threshold that by visual inspection from previous snapshots of original LAION-5B dataset indicates elimination of the majority of NSFW presence: p_unsafe > 0.45. This leads to removal of 3.044% (60.88M from 2B, 176M from 5.8B) samples from original LAION-5B.

Re-LAION-5B-research-safe is a true subset of Re-LAION-5B-research which in turn is a true subset of original old LAION-5B. Both Re-LAION-5B-research and Re-LAION-5B-research-safe are released via gated access on HF, requiring submission of affiliation information and consent on using data that might contain various explicit and discomforting content for research purposes.

All further derived datasets are filtered according to Re-LAION-5B-research-safe scheme, using p_unsafe > 0.45 to filter out majority of NSFW samples.

As an outcome, we release the updated versions of the LAION-5B dataset -  Re-LAION-5B-research-safe and Re-LAION-5B-research -  that are free of any CSAM samples known to our partner organizations (IWF and C3P; as of July 2024) dealing with such content. Re-LAION datasets are results of an update iteration of LAION-5B and are subsets of original LAION-5B obtained by applying safety fixes as described above.

LAION-5B is assembled based on Common Crawl data up to Sep 2022, and there is no new content in Re-LAION apart from the links already contained in LAION-5B, which makes sure that no new suspicious, unchecked links slip into the datasets. MD5 image hashes precomputed in early 2023 for all the original LAION-5B images further ensure that no previously unknown image samples can enter the dataset when assembling training datasets from links, as hash comparison allows only matches to previously checked samples to become part of the datasets. Re-LAION therefore produces the first open large-scale text-link to images reference dataset that contains provenly only those links samples that are checked against all currently known links to suspected CSAM as covered by C3P and IWF (up to July 2024) and thus can be used more safely by researchers as reference for various basic and applied machine learning research experiments.

## Summary and recommendations

Following successful cooperation with partner organizations IWF and C3P, we are able to execute an update iteration improving safety of original LAION-5B dataset and release update versions, Re-LAION-research-5B and Re-LAION-research-safe-5B that are free of links to suspected CSAM or likely CSAM samples known to our partner organizations, which also subsumes all the 1008 suspected links identified by Stanford Internet Observatory report in December 2023.

Following important insights were made in this study and during safety iteration:

- We confirm number of links leading to suspected CSAM on public web that slipped through [filters that were used for LAION-5B composition](https://laion.ai/blog/laion-400-open-dataset/#filtering-out-unsuitable-image-text-pairs) to be 2236, which subsumes 1008 links to suspected CSAM reported by Stanford Internet Observatory in December 2023. This number serves as an upper bound for links leading to possibly accessible CSAM known to our partner organizations IWF and C3P, as a substantial fraction of these links is most likely dead (Stanford Internet Observatory reported 1008 links that might be still active in December 2023). This number clearly refutes unsupported claims extrapolating Stanford Internet Observatory report to many thousands links to suspected CSAM samples, showing that actual number stays low if matching against of over 16M links or image hashes of potential CSAM samples known to IWF and C3P.
- Despite the low number of links to suspected CSAM, investigation shows that current state-of-the-art filters alone are not reliable enough to guarantee protection from CSAM in web scale data composition scenarios. To ensure better filtering, lists of hashes of suspected links or images created by expert organizations (in our case, IWF and C3P) are suitable choices. We recommend research labs and any other organizations composing datasets from the public web to partner with organizations like IWF and C3P to obtain such hash lists and use those for filtering. In the longer term, a larger common initiative can be created that makes such hash lists available for the research community working on dataset composition from the web.
- We strongly urge all research labs and organizations who still make use of old LAION-5B to migrate to Re-LAION-5B datasets as soon as possible. Those facilities where datasets obtained on the basis of old LAION-5B still exist (e.g. in eligible safe vaults), can make use of Re-LAION metadata to ensure that all links to suspected CSAM or suspected CSAM content are removed by executing diff operation. Diff operation is safe, as it will not reveal any of potential illegal content, because it is safely buried in the large pool of other irrelevant samples in the diff, while making sure any potential illegal content will be removed if removing the samples matched with the diff. In this way, full download of Re-LAION can be spared.
- Lists of precomputed hashes provide a safe way to perform filtering of potentially illegal material without necessity to reveal or knowingly interact with such material in any way. Especially when combining pre-computed hashes with vast amounts of other irrelevant hashes, such lists can be made available to the community to enable easy, broadly accessible filtering of unwanted material without empowering malicious actors to make use of such lists for their own malicious purposes.
- As LAION-5B was assembled in summer 2022, it is for us a worrying signal that ca. 1k already well known links to suspected CSAM samples can be still live accessible on public web more than 1 year after. It is a clear hint that law enforcement bodies have to intensify the efforts to take down domains that host such image content on public web following information and recommendations by organizations like IWF and C3P, making it a safer place, also for various kinds of research related activities.

## Usage of Re-LAION datasets

We release both Re-LAION-5B-research and Re-LAION-5B-research-safe under Apache 2.0 License, which ensures researchers can freely utilize datasets both for conducting basic or applied research. Our usage recommendation stays the [same as in our previous release](https://laion.ai/blog/laion-5b/#disclaimer-on-dataset-purpose-and-content-warning). The datasets are released for research purposes, especially for conducting basic research on various open multi-modal foundation models, e.g. openCLIP, in academic settings. **We strongly advise AGAINST using the datasets in industrial settings and even more so, we advise strongly AGAINST using datasets in their original form for creating end products.** We explicitly warn that Re-LAION datasets can contain links to various image samples that can be strongly discomforting dependent on the viewer and are NOT meant for casual viewing apart from inspection necessary for purposes of scientific and/or safety analysis performed by trained researchers.

## LEGAL DISCLAIMER

The **datasets of LAION only contain links and metadata**. LAION is not responsible for the content that can be accessed via the links. LAION researchers do not inspect the content of individual samples either, relying on overall statistics collected across all samples, and **the filtering is automated due to the huge amount of data**. **LAION has never distributed image content itself**.

LAION has been committed to removing illegal content from its datasets from the very beginning ([see original announcement from 20.08.2021](https://laion.ai/blog/laion-400-open-dataset/#filtering-out-unsuitable-image-text-pairs)) and has implemented appropriate measures to achieve this from the outset. LAION strictly adheres to the principle that illegal content is removed ASAP after it becomes known.
