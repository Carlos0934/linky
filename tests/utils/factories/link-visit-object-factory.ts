import { LinkVisit } from "@/lib/domain/links";

export class LinkVisitObjectFactory {
  static createLinkVisit(config?: Partial<LinkVisit>): LinkVisit {
    const defaultLinkVisit: LinkVisit = {
      id: "abc123",
      linkId: "abc123",

      createdAt: new Date(),
    };

    return { ...defaultLinkVisit, ...config };
  }
}
