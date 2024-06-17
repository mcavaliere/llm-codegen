export enum SupportedModels {
  openai = "openai",
}

export type SupportedModelsType = keyof typeof SupportedModels;
