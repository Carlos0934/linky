import db from "@/lib/db";
import { LinkDrizzleRepository } from "@/lib/repositories/link-repository";
import { LinkService } from "@/lib/services/link-service";
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { resetDb } from "../utils/reset-db";
import { createUser } from "../utils/create-user";
import { RequestObjectFactory } from "../utils/factories/request-object-factory";

describe("LinkService Integration", () => {
  let linkService: LinkService;

  beforeAll(() => {
    const linkRepository = new LinkDrizzleRepository(db);
    linkService = new LinkService(linkRepository);
  });

  beforeEach(async () => {
    await resetDb();
  });

  test("should create a new link", async () => {
    // Arrange
    const data = {
      id: "abc123",
      originalUrl: "https://example.com",
      linkId: "abc123",
    };

    // Act
    const result = await linkService.createLink(data);

    // Assert
    expect(result).toBeDefined();
    expect(result.originalUrl).toBe(data.originalUrl);
    expect(result.userId).not.toBeDefined();
    expect(result.status).toBe("active");
    expect(result.shortUrl.length).toBeGreaterThan(6);
  });

  test("should get latest links by user", async () => {
    // Arrange
    const userId = "user123";
    const data = {
      id: "abc123",
      originalUrl: "https://example.com",
      linkId: "abc123",
      userId,
    };

    await createUser({ id: "user123", email: "example@gmail.com" });

    await linkService.createLink(data);

    // Act
    const result = await linkService.getLatestLinks(userId);

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  test("should track visit", async () => {
    // Arrange
    const linkId = "abc123";
    const userId = "user123";

    await createUser({ id: "user123", email: "example@gmail.com" });

    const data = {
      id: linkId,
      originalUrl: "https://example.com",
      userId,
    };

    await linkService.createLink(data);

    const request = RequestObjectFactory.createRequest("https://example.com", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "X-Forwarded-For": "::1",
        Referer: "https://example.com",
        "X-Vercel-IP-Country": "US",
        "x-vercel-ip-city": "New York",
      },
    });

    // Act

    await linkService.trackVisit({ linkId, request });
    const links = await linkService.getLinksByUserId(userId);
    const { clicks } = links[0];

    // Assert

    expect(clicks).toBe(1);
  });

  test("should get link by short path", async () => {
    // Arrange

    const data = {
      id: "abc123",
      originalUrl: "https://example.com",
      linkId: "abc123",
    };

    const { shortUrl } = await linkService.createLink(data);
    const shortPath = new URL(shortUrl).pathname.split("/")[1];

    // Act
    const result = await linkService.getByShortPath(shortPath);

    // Assert
    expect(result).toBeDefined();
    expect(result?.originalUrl).toBe(data.originalUrl);
  });

  test("should update link", async () => {
    // Arrange
    const data = {
      id: "abc123",
      originalUrl: "https://example.com",
      linkId: "abc123",
      userId: "user123",
    };

    await createUser({ id: "user123", email: "example@example.com" });

    const link = await linkService.createLink(data);

    const updateData = {
      id: link.id,
      originalUrl: "https://example.com",
      status: "inactive" as const,
      userId: "user123",
    };

    // Act

    await linkService.updateLink(updateData);
    const result = await linkService.getById(link.id);
    // Assert

    expect(result).toBeDefined();
    expect(result?.status).toBe("inactive");
  });
  test("should delete link", async () => {
    // Arrange
    const data = {
      id: "abc123",
      originalUrl: "https://example.com",
      linkId: "abc123",
      userId: "user123",
    };

    await createUser({ id: "user123", email: "example@example.com" });

    const link = await linkService.createLink(data);

    // Act

    await linkService.deleteLink({ linkId: link.id, userId: "user123" });

    // Assert

    const result = await linkService.getById(link.id);

    expect(result).toBeNull();

    const links = await linkService.getLinksByUserId("user123");

    expect(links.length).toBe(0);
  });
});
