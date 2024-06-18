import { SUPPORTED_MODELS } from "../constants";

export function ensureSupportedModel(modelName: string) {
  if (!SUPPORTED_MODELS.includes(modelName.toLowerCase())) {
    throw `Model ${modelName} is not supported. Supported models are: ${SUPPORTED_MODELS.join(
      ", "
    )}`;
  }
}
