import { ShortLink } from "@/lib/domain/links";

export class LinkObjectFactory {
  static createLink(config?: Partial<ShortLink>): ShortLink {
    const defaultLink: ShortLink = {
      id: "abc123",
      originalUrl: "https://example.com",
      shortUrl: "abc123",
      status: "active",
    };

    return { ...defaultLink, ...config };
  }
}
