import { LinkRepository } from "@/lib/domain/link-repository";
import { LinkDataAnalyticsService } from "@/lib/services/link-data-analytics-service";
import { afterEach, describe, expect, test, vi } from "vitest";

describe("LinkDataAnalyticsService Unit", () => {
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
    findLinkVisitsByLinkId: vi.fn(),
    findLinkVisitsByUserId: vi.fn(),
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should return link data analytics", async () => {
    mockLinkRepository.findLinkVisitsByLinkId = vi.fn().mockReturnValueOnce([
      {
        id: "1",
        linkId: "1",
        ip: "",
        referer: "",
        country: "",
        city: "",
        device: "MacBook Pro",
        deviceType: "desktop",
        engine: "chrome",
        browser: "chrome",
        os: "",
        createdAt: new Date(),
      },
    ]);

    const linkDataAnalyticsService = new LinkDataAnalyticsService(
      mockLinkRepository
    );
    const result = await linkDataAnalyticsService.getLinkDataAnalytics({
      linkId: "1",
    });

    expect(result).toEqual({
      linkId: "1",
      clicks: {
        total: 1,
        last24Hours: 1,
        last7Days: 1,
        last30Days: 1,
      },
      devices: [{ name: "MacBook Pro", count: 1 }],
      browsers: [{ name: "chrome", count: 1 }],
    });

    expect(mockLinkRepository.findLinkVisitsByLinkId).toHaveBeenCalledTimes(1);
  });
});
