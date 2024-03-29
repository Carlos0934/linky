import { describe, expect, test, vi } from "vitest";

import { LinkService } from "../../src/lib/services/link-service";
import { LinkRepository } from "@/lib/domain/link-repository";
import { afterEach } from "node:test";
import getError from "../utils/get-error";
import { LimitReachedError } from "@/lib/errors/limit-reached-error";
import { USER_LINKS_LIMIT } from "@/lib/domain/links";
import { LinkObjectFactory } from "../utils/factories/link-object-factory";
import { LinkInputObjectFactory } from "../utils/factories/create-link-input-object-factory";
import { LinkVisitObjectFactory } from "../utils/factories/link-visit-object-factory";
import { RequestObjectFactory } from "../utils/factories/request-object-factory";
import { NotFoundError } from "@/lib/errors/not-found-error";
import { UnauthorizedError } from "@/lib/errors/unauthorized-error";

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

  describe("LinkService - createLink", () => {
    test("should create a new link", async () => {
      // Arrange

      const linkService = new LinkService(mockLinkRepository);
      const data = LinkInputObjectFactory.createLinkInput();

      // Act
      const result = await linkService.createLink(data);

      // Assert
      expect(result).toBeDefined();

      // Add more assertions as needed
    });

    test("should create a new link with a shortUrl with length 6", async () => {
      // Arrange

      const linkService = new LinkService(mockLinkRepository);
      const data = LinkInputObjectFactory.createLinkInput();

      // Act
      const result = await linkService.createLink(data);

      // Assert
      expect(result.shortUrl.length).toBe(6);
    });

    test("should create a new link with status active", async () => {
      // Arrange

      const linkService = new LinkService(mockLinkRepository);
      const data = LinkInputObjectFactory.createLinkInput();

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
      const data = LinkInputObjectFactory.createLinkInput();

      // Act
      const error = await getError(() => linkService.createLink(data));

      // Assert

      expect(error).toBeInstanceOf(LimitReachedError);
    });
  });

  describe("LinkService - getLatestLinks", () => {
    test("should return the latest links", async () => {
      // Arrange
      const userId = "user123";
      const mockLinks = Array(5).fill(LinkObjectFactory.createLink({ userId }));

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
      const mockLinks = Array(10).fill(
        LinkObjectFactory.createLink({ userId })
      );

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
      const mockLink = LinkObjectFactory.createLink({ id: linkId });

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

  describe("LinkService - getByShortPath", () => {
    test("should return the link by short path", async () => {
      // Arrange
      const shortPath = "abc123";
      const mockLink = LinkObjectFactory.createLink({ shortUrl: shortPath });

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

  describe("LinkService - trackVisit", () => {
    test("should track the visit", async () => {
      // Arrange
      const linkId = "abc123";
      const referer = "https://google.com";
      const ip = "::1";
      const request = RequestObjectFactory.createRequest(
        "https://example.com",
        {
          method: "GET",
          headers: {
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            referer: "https://google.com",
            "X-Forwarded-For": ip,
          },
        }
      );

      const mockVisit = LinkVisitObjectFactory.createLinkVisit({
        linkId,
        referer,
        ip,
      });

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

  describe("LinkService - deleteLink", () => {
    test("should delete the link", async () => {
      // Arrange
      const linkId = "abc123";
      const userId = "user123";
      const mockLink = LinkObjectFactory.createLink({ id: linkId, userId });
      mockLinkRepository.getShortLinkById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(mockLink));

      vi.spyOn(mockLinkRepository, "deleteLink");

      const linkService = new LinkService(mockLinkRepository);

      // Act
      await linkService.deleteLink({ linkId, userId });

      // Assert
      expect(mockLinkRepository.deleteLink).toHaveBeenCalledWith(linkId);
      expect(mockLinkRepository.deleteLink).toHaveBeenCalledTimes(1);
    });

    test("should throw an error if the link does not exist", async () => {
      // Arrange
      const linkId = "abc123";
      const userId = "user123";

      mockLinkRepository.getShortLinkById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(null));

      const linkService = new LinkService(mockLinkRepository);

      // Act
      const error = await getError(() =>
        linkService.deleteLink({ linkId, userId })
      );

      // Assert

      expect(error).toBeInstanceOf(NotFoundError);
    });

    test("should throw an error if the user is not the owner of the link", async () => {
      // Arrange
      const linkId = "abc123";
      const userId = "user123";
      const mockLink = LinkObjectFactory.createLink({
        id: linkId,
        userId: "another",
      });

      mockLinkRepository.getShortLinkById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(mockLink));

      const linkService = new LinkService(mockLinkRepository);

      // Act
      const error = await getError(() =>
        linkService.deleteLink({ linkId, userId })
      );

      // Assert

      expect(error).toBeInstanceOf(UnauthorizedError);
    });
  });

  describe("LinkService - updateLink", () => {
    test("should update the link", async () => {
      // Arrange
      const linkId = "abc123";
      const userId = "user123";
      const originalUrl = "https://example.com";
      const status = "inactive";

      const mockLink = LinkObjectFactory.createLink({
        id: linkId,
        userId,
        originalUrl,
        status: "active",
      });

      mockLinkRepository.getShortLinkById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(mockLink));

      vi.spyOn(mockLinkRepository, "updateLink");

      const linkService = new LinkService(mockLinkRepository);

      // Act
      await linkService.updateLink({ id: linkId, originalUrl, status, userId });

      // Assert
      expect(mockLinkRepository.updateLink).toHaveBeenCalledWith({
        id: linkId,
        originalUrl,
        status,
      });
      expect(mockLinkRepository.updateLink).toHaveBeenCalledTimes(1);
    });

    test("should throw an error if the link does not exist", async () => {
      // Arrange
      const linkId = "abc123";
      const userId = "user123";
      const originalUrl = "https://example.com";
      const status = "inactive";

      mockLinkRepository.getShortLinkById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(null));

      const linkService = new LinkService(mockLinkRepository);

      // Act
      const error = await getError(() =>
        linkService.updateLink({ id: linkId, originalUrl, status, userId })
      );

      // Assert

      expect(error).toBeInstanceOf(NotFoundError);
    });

    test("should throw an error if the user is not the owner of the link", async () => {
      // Arrange
      const linkId = "abc123";
      const userId = "user123";
      const originalUrl = "https://example.com";
      const status = "inactive";

      const mockLink = LinkObjectFactory.createLink({
        id: linkId,
        userId: "another",
      });

      mockLinkRepository.getShortLinkById = vi
        .fn()
        .mockImplementationOnce(() => Promise.resolve(mockLink));

      const linkService = new LinkService(mockLinkRepository);

      // Act
      const error = await getError(() =>
        linkService.updateLink({ id: linkId, originalUrl, status, userId })
      );

      // Assert

      expect(error).toBeInstanceOf(UnauthorizedError);
    });
  });
});
