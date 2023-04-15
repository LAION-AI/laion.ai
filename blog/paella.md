---
title: "A new Paella: Simple & Efficient Text-To-Image generation"
author: "Dominic Rampas and Pablo Pernias"
date: "April 15, 2023"
previewImg: "/images/blog/paella.png"
---
![](https://user-images.githubusercontent.com/61938694/231021615-38df0a0a-d97e-4f7a-99d9-99952357b4b1.png)
### Overview.
We are releasing a new Paella model which builds on top of our initial paper https://arxiv.org/abs/2211.07292.
Paella is a text-to-image model that works in a quantized latent space and learns similarly to MUSE and Diffusion models.
Paella is similar to MUSE as it also works on discrete tokens, but is different in the way tokens are noised as well as
the architecture. MUSE uses a transformer, whereas we use a CNN, which comes with many benefits. There are also subtle
differences in the conditioning Paella uses as well how images are sampled. And on the other hand, it can also be seen
as a discrete diffusion process, which noises images during training and iteratively removes noise during sampling.
Since the paper-release we worked intensively to bring Paella to a similar level as other 
state-of-the-art models. With this release we are coming a step closer to that goal. However, our main intention is not
to make the greatest text-to-image model out there (at least for now), it is to bring text-to-image models closer
to people outside the field on a technical basis. For example, many models have codebases with many thousand lines of 
code, that make it pretty hard for people to dive into the code and easily understand it. And that is our proudest
achievement with Paella. The training and sampling code for Paella is minimalistic and can be understood in 
a few minutes, making further extensions, quick tests, idea testing etc. extremely fast. For instance, the entire
sampling code can be written in just **12 lines** of code.
In this blog post we will talk about how Paella works in short, give technical details and release the model.

### How does Paella work?
Paella works in a quantized latent space, just like StableDiffusion etc., to reduce the computational power needed.
Images are encoded to a smaller latent space and converted to visual tokens of shape *h x w*. During training,
these visual tokens are noised, by replacing a random amount of tokens with other randomly selected tokens
from the codebook of the VQGAN. The noised image are given to the model, along with a timestep and the conditional
information, which is text in our case. The model is tasked to predict the un-noised version of the tokens. 
And that's it. The model is optimized with the CrossEntropy loss between the original tokens and the predicted tokens.
The amount of noise added during the training is just a linear schedule, meaning that we uniformly sample a percentage 
between 0 and 100% and noise that amount of tokens.<br><br>

<figure>
  <img src="https://user-images.githubusercontent.com/61938694/231248435-d21170c1-57b4-4a8f-90a6-62cf3e7effcd.png" width="400">
  <figcaption>Images are noised and then fed to the model during training.</figcaption>
</figure>


Sampling is also extremely simple, we start with the entire image being random tokens. Then we feed the latent image, 
the timestep and the condition into the model and let it predict the final image. The models outputs a distribution
over every token, which we sample from with standard multinomial sampling.  
Since there are infinite possibilities for the result to look like, just doing a single step results in very basic 
shapes without any details. That is why we add noise to the image again and feed it back to the model. And we repeat
that process for a number of times, with less noise being added every time, and slowly get our final image.
You can see how images emerge [here](https://user-images.githubusercontent.com/61938694/231252449-d9ac4d15-15ef-4aed-a0de-91fa8746a415.png).<br>
The following is the entire sampling code needed to generate images:
```python
def sample(model_inputs, latent_shape, unconditional_inputs, steps=12, renoise_steps=11, temperature=(0.7, 0.3), cfg=8.0):
    with torch.inference_mode():
        sampled = torch.randint(low=0, high=model.num_labels, size=latent_shape)
        initial_noise = sampled.clone()
        timesteps = torch.linspace(1.0, 0.0, steps+1)
        temperatures = torch.linspace(temperature[0], temperature[1], steps)
        for i, t in enumerate(timesteps[:steps]):
            t = torch.ones(latent_shape[0]) * t

            logits = model(sampled, t, **model_inputs)
            if cfg:
                logits = logits * cfg + model(sampled, t, **unconditional_inputs) * (1-cfg)
            sampled = logits.div(temperatures[i]).softmax(dim=1).permute(0, 2, 3, 1).reshape(-1, logits.size(1))
            sampled = torch.multinomial(sampled, 1)[:, 0].view(logits.size(0), *logits.shape[2:])

            if i < renoise_steps:
                t_next = torch.ones(latent_shape[0]) * timesteps[i+1]
                sampled = model.add_noise(sampled, t_next, random_x=initial_noise)[0]
    return sampled
```

### Results
<img src="https://user-images.githubusercontent.com/61938694/231598512-2410c172-5a9d-43f4-947c-6ff7eaee77e7.png">
Since Paella is also conditioned on CLIP image embeddings the following things are also possible:<br><br>
<img src="https://user-images.githubusercontent.com/61938694/231278319-16551a8d-bfd1-49c9-b604-c6da3955a6d4.png">
<img src="https://user-images.githubusercontent.com/61938694/231287637-acd0b9b2-90c7-4518-9b9e-d7edefc6c3af.png">
<img src="https://user-images.githubusercontent.com/61938694/231287119-42fe496b-e737-4dc5-8e53-613bdba149da.png">

### Technical Details.
Model-Architecture: U-Net (Mix of ConvNeXt, DiT etc.) <br>
Dataset: Laion-A, Laion Aesthetic > 6.0 <br>
Training Steps: 1.3M <br>
Batch Size: 2048 <br>
Resolution: 256 <br>
VQGAN Compression: f4 <br>
Condition: ByT5-XL (95%), CLIP-H Image Embedding (10%), CLIP-H Text Embedding (10%)
Optimizer: AdamW
Hardware: 128 A100 @ 80GB <br>
Training Time: ~3 weeks <br>
Learning Rate: 1e-4 <br>
More details on the approach, training and sampling can be found in paper and on GitHub.

### Paper, Model, Code Release
Paper: https://arxiv.org/abs/2211.07292 <br>
Code: https://github.com/dome272/Paella <br>
Model: https://huggingface.co/dome272/Paella <br>


### Limitations & Conclusion
There are still many things to improve for Paella to get on par with standard diffusion models or to even outperform
them. One primary thing we notice is that even though we only condition the model on CLIP image embedding 10% of the
time, during inference the model heavily relies on the generated image embeddings by a prior model (mapping clip text
embeddings to image embeddings as proposed in Dalle2). We counteract this by decreasing the importance of the image
embeddings by reweighing the attention scores. There probably is a way to avoid this happening already in training.
Other limitations such as lack of composition, text depiction, unawareness of concepts etc. could also be reduced by
continuing the training for longer. As a reference, Paella has only seen as many images as SD 1.4 and due to concerns 
in regard to training collapse (which later turned to be negligible), trained with a 10x lower learning rate for the 
first 700k steps. To conclude, this is still work in progress, but our first model that works reasonably well and
a million times better than the first versions we trained months ago.

It is noteworthy that the design choices for Paella were based on trying to make a simple architecture and 
model for text-to-image synthesis, drawing inspiration from existing techniques such as MaskGIT. Furthermore, this 
approach eliminates the need for hyperparameters such as alpha, beta, and alpha_cum_prod, which are typically required 
in diffusion models. As a result, this methodology is particularly well-suited for individuals who are new to the field 
of generative artificial intelligence. Our aim is to lay the groundwork for future research in this domain, fostering
a landscape where AI is accessible and comprehensible to a broader audience. We encourage further exploration of this
approach, as we are confident in its potential to contribute useful insights and potentially advance the state of the 
art in text-to-image synthesis.


### Contributions

**Thanks to:**

* [Romain Beaumont](https://github.com/rom1504/) and [Christoph Schuhmann](https://github.com/christophschuhmann) 
for constant help on datasets and giving useful advice.
* [Jenia Jitsev](https://scholar.google.de/citations?user=p1FuAMkAAAAJ&hl=en) for help on writing the blog post and
useful discussions.
* [Richard Vencu](https://github.com/rvencu) for an incredible amount of help regarding hardware issues.
* [StabilityAI](https://stability.ai/) for providing GPU-Cluster access and faith in Paella.

