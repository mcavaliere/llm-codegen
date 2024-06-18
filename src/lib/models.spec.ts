import { describe, expect, it } from "vitest";
import { ensureSupportedModel } from "./models";

describe("models.ts", () => {
  describe("ensureSupportedModel()", () => {
    describe("with an included model", () => {
      it("should not throw an error", () => {
        expect(() => ensureSupportedModel("openai")).not.toThrow();
      });
    });

    describe("with an excluded model", () => {
      it("should throw an error", () => {
        expect(() => ensureSupportedModel("not-a-model")).toThrow(
          "Model not-a-model is not supported. Supported models are: openai"
        );
      });
    });
  });
});
