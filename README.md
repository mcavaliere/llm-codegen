## [WIP] - a CLI tool for generating code with LLMs that is based on up-to-date documentation.

🚨This repo is under development. Expect the unexpected. 🙃

🚨Until I publish the npm package, clone this repo to run it, and substitute `lg` for `pnpm start`🚨

### Problem:

1. You ask an LLM (ChatGPT, Mistral, Anthropic, etc) to generate code using your favorite library.
2. The LLM generates code for you, but that code is pretty out of date. The lib has changed since the LLM has indexed it.

You can sometimes remedy this by pasting _relevant parts of the lib's documentation_ into the LLM's context (aka, one-shot or few-shot training), and get way better code.

This can become time-consuming.

### Solution:

This CLI tool aims to make this process easier and faster by attempting to associate your prompt with the relevant docs.

### How it works:

1. Install this tool
2. Download the docs to any and all libraries you want to generate code for. Put them in ~/.llm-codegen/my-lib
3. Run the CLI tool with your prompt and the library name (e.g., `lg gen shadcn/form "a form for capturing patient medical information"`)

Result: up-to-date code generated by the LLM.

### Installation

1. Clone the repo
2. `pnpm install`
3. `pnpm start` for usage info

### Adding library documents

`llm-codegen` looks for library documents in `~/.llm-codegen`. Add folders named after each library you want to generate code for. Generators will be created for each document you create, using a relative path with each file extension removed.

Let's use the following folder structure for example:

```
~/.llm-codegen
  └── shadcn
      ├── accordion.mdx
      ├── alert-dialog.mdx
      ├── alert.mdx
      ├── aspect-ratio.mdx
      ├── avatar.mdx
      ├── badge.mdx
      ├── breadcrumb.mdx
      ├── button.mdx
      ...
```

Running `lg list` will list the following generator names:

```bash
shadcn/accordion
shadcn/alert-dialog
shadcn/alert
shadcn/aspect-ratio
shadcn/avatar
shadcn/badge
shadcn/breadcrumb
shadcn/button
...
```

Which you can then use to generate code e.g.:

```bash
lg gen shadcn/accordion "with headings for each US state, with content for that states' capital, population, and area."

```

### Examples

```bash
pnpm start gen shadcn/form "for inputting a business address"
```

```bash
pnpm start gen shadcn/form "a form for capturing patient medical information"
```

### TODOs

- [ ] Support multiple models
- [ ] Add custom folder support
- [ ] Support config via env vars and CLI options
- [ ] Export as package
- [ ] Show spinner
- [x] Stream output
