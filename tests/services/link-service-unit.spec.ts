import { describe, expect, test, vi } from "vitest";

import { LinkService } from "../../src/lib/services/link-service";
import { LinkRepository } from "@/lib/domain/link-repository";
import { afterEach } from "node:test";
import getError from "../utils/get-error";
import { LimitReachedError } from "@/lib/errors/limit-reached-error";
import { USER_LINKS_LIMIT } from "@/lib/domain/links";

describe("LinkService", () => {
  const mockLinkRepository: LinkRepository = {
    createLink: vi.fn((data) =>
      Promise.resolve({ ...data, shortUrl: "abc123" })
    ),
    findLinksByUserId: vi.fn(),
    getShortLinkByPath: vi.fn(),
    createVisit: vi.fn(),
    countLinksByUserId: vi.fn(),
    deleteLink: vi.fn(),
    getShortLinkById: vi.fn(),
    updateLink: vi.fn(),
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("LinkService - createLink", async () => {
    test("should create a new link", async () => {
      // Arrange

      const linkService = new LinkService(mockLinkRepository);
      const data = {
        id: "abc123",
        originalUrl: "https://example.com",
        linkId: "abc123",
        userId: "user123",
      };

      // Act
      const result = await linkService.createLink(data);

      // Assert
      expect(result).toBeDefined();

      // Add more assertions as needed
    });

    test("should create a new link with a shortUrl with length 6", async () => {
      // Arrange

      const linkService = new LinkService(mockLinkRepository);
      const data = {
        id: "abc123",
        originalUrl: "https://example.com",
        linkId: "abc123",
        userId: "user123",
      };

      // Act
      const result = await linkService.createLink(data);

      // Assert
      expect(result.shortUrl.length).toBe(6);
    });

    test("should create a new link with status active", async () => {
      // Arrange

      const linkService = new LinkService(mockLinkRepository);
      const data = {
        id: "abc123",
        originalUrl: "https://example.com",
        linkId: "abc123",
        userId: "user123",
      };

      // Act
      const result = await linkService.createLink(data);

      // Assert
      expect(result.status).toBe("active");
    });

    test("should return an error if the user has reached the limit", async () => {
      // Arrange
      mockLinkRepository.countLinksByUserId = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(USER_LINKS_LIMIT));

      const linkService = new LinkService(mockLinkRepository);
      const data = {
        id: "abc123",
        originalUrl: "https://example.com",
        linkId: "abc123",
        userId: "user123",
      };

      // Act
      const error = await getError(() => linkService.createLink(data));

      // Assert

      expect(error).toBeInstanceOf(LimitReachedError);
    });
  });

  describe("LinkService - getLatestLinks", async () => {
    test("should return the latest links", async () => {
      // Arrange
      const userId = "user123";
      const mockLinks = [
        {
          id: "abc123",
          originalUrl: "https://example.com",
          shortUrl: "abc123",
          status: "active",
          userId,
        },
      ];

      mockLinkRepository.findLinksByUserId = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(mockLinks));

      const linkService = new LinkService(mockLinkRepository);

      // Act
      const result = await linkService.getLatestLinks(userId);

      // Assert
      expect(result).toEqual(mockLinks);
    });

    test("should return the latest 5 links", async () => {
      // Arrange
      const userId = "user123";
      const mockLinks = Array.from({ length: 10 }, (_, i) => ({
        id: `abc${i}`,
        originalUrl: `https://example.com/${i}`,
        shortUrl: `abc${i}`,
        status: "active",
        userId,
        clicks: 0,
        date: new Date(),
      }));

      mockLinkRepository.findLinksByUserId = vi.fn((_userId, limit) =>
        Promise.resolve(mockLinks.slice(0, limit))
      );

      const linkService = new LinkService(mockLinkRepository);

      // Act
      const result = await linkService.getLatestLinks(userId);

      // Assert
      expect(result.length).toBe(5);
    });
  });

  describe("LinkService - getById", async () => {
    test("should return the link by id", async () => {
      // Arrange
      const linkId = "abc123";
      const mockLink = {
        id: "abc123",
        originalUrl: "https://example.com",
        shortUrl: "abc123",
        status: "active",
        userId: "user123",
      };

      mockLinkRepository.getShortLinkById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(mockLink));

      const linkService = new LinkService(mockLinkRepository);

      // Act
      const result = await linkService.getById(linkId);

      // Assert
      expect(result).toEqual(mockLink);
    });
  });

  describe("LinkService - getByShortPath", async () => {
    test("should return the link by short path", async () => {
      // Arrange
      const shortPath = "abc123";
      const mockLink = {
        id: "abc123",
        originalUrl: "https://example.com",
        shortUrl: "abc123",
        status: "active",
        userId: "user123",
      };

      mockLinkRepository.getShortLinkByPath = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(mockLink));

      const linkService = new LinkService(mockLinkRepository);

      // Act
      const result = await linkService.getByShortPath(shortPath);

      // Assert
      expect(result).toEqual(mockLink);
    });
  });

  describe("LinkService - trackVisit", async () => {
    test("should track the visit", async () => {
      // Arrange
      const linkId = "abc123";
      const request = new Request("https://example.com", {
        headers: new Headers({
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
          "X-Forwarded-For": "::1",
          Referer: "https://example.com",
          "X-Vercel-IP-Country": "US",
          "x-vercel-ip-city": "New York",
        }),
      });

      const mockVisit = {
        id: "abc123",
        linkId,
        ip: "::1",
        referer: "https://example.com",
        country: "US",
        city: "New York",
        device: "Windows",
        deviceType: "desktop",
        engine: "WebKit",
        os: "Windows",
        browser: "Chrome",
        createdAt: new Date(),
      };

      mockLinkRepository.createVisit = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(mockVisit));

      const linkService = new LinkService(mockLinkRepository);

      // Act

      const result = await linkService.trackVisit({ linkId, request });

      // Assert

      expect(result).toEqual(mockVisit);
    });
  });
});
