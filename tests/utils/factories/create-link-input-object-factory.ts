import { CreateLinkInput } from "@/lib/domain/link-repository";

export class LinkInputObjectFactory {
  static createLinkInput(
    config?: Partial<Omit<CreateLinkInput, "shortPath" | "status">>
  ): Omit<CreateLinkInput, "shortPath" | "status"> {
    const defaultCreateLinkInput: Omit<
      CreateLinkInput,
      "shortPath" | "status"
    > = {
      id: "abc123",
      originalUrl: "https://example.com",
      userId: "user123",
    };

    return { ...defaultCreateLinkInput, ...config };
  }
}
