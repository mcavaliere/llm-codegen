## [WIP] - a CLI tool for generating code with LLMs that is based on up-to-date documentation.

🚨This repo is very much a draft. Nothing may work as expected. 🙃

### Problem:

1. You ask ChatGPT(or Grimoire or even Copilot) to generate code using your favorite library.
2. The LLM generates code for you, but that code is pretty out of date. The lib has changed since the LLM has indexed it.

You can sometimes remedy this by pasting _relevant parts of the lib's documentation_ into the LLM's context (aka, one-shot or few-shot training), and get way better code.

This can become time-consuming.

### Solution:

This CLI tool aims to make this process easier and faster by attempting to associate your prompt with the relevant docs.

⚠️In this POC period, I'm currently testing this process out with only one library, [Shadcn-ui](https://ui.shadcn.com/). After I find a process that works, I'll start to abstract it out and make it easier to add other libs. ⚠️

### Installation

1. Clone the repo
2. `pnpm install`
3. `pnpm start` for usage info

### Examples

```bash
pnpm start gen form "a form for capturing patient medical information"
```

### TODOs

- [ ] Support multiple models
- [ ] Add custom folder support
- [ ] Support config via env vars and CLI options
- [ ] Export binary as package
- [ ] Show spinner
- [x] Stream output
