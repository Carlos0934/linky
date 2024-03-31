import {
  LinkDataAnalytics,
  LinkDataAnalyticsPeriod,
} from "../domain/link-data-analytics";
import { LinkRepository } from "../domain/link-repository";

export class LinkDataAnalyticsService {
  constructor(private linkRepository: LinkRepository) {}

  async getLinkDataAnalytics({
    userId,
    linkId,
  }: {
    userId?: string;
    linkId?: string | null;
  }): Promise<LinkDataAnalytics> {
    const visits = linkId
      ? await this.linkRepository.findLinkVisitsByLinkId(linkId)
      : userId
      ? await this.linkRepository.findLinkVisitsByUserId(userId)
      : [];

    const clicksByPeriod = new Map<LinkDataAnalyticsPeriod, number>();
    const clicksByDevice = new Map<string, number>();
    const clicksByBrowser = new Map<string, number>();

    for (const visit of visits) {
      const { last24Hours, last30Days, last7Days } = this.getPeriodsCount(
        visit.createdAt
      );
      clicksByPeriod.set(
        "last24Hours",
        (clicksByPeriod.get("last24Hours") || 0) + last24Hours
      );
      clicksByPeriod.set(
        "last7Days",
        (clicksByPeriod.get("last7Days") || 0) + last7Days
      );
      clicksByPeriod.set(
        "last30Days",
        (clicksByPeriod.get("last30Days") || 0) + last30Days
      );

      const clicksByDeviceKey = visit.device || "unknown";
      const clicksByBrowserKey = visit.browser || "unknown";

      clicksByDevice.set(
        clicksByDeviceKey,
        (clicksByDevice.get(clicksByDeviceKey) || 0) + 1
      );
      clicksByBrowser.set(
        clicksByBrowserKey,
        (clicksByBrowser.get(clicksByBrowserKey) || 0) + 1
      );
    }

    return {
      linkId: linkId || undefined,
      clicks: {
        total: visits.length,
        last24Hours: clicksByPeriod.get("last24Hours") || 0,
        last7Days: clicksByPeriod.get("last7Days") || 0,
        last30Days: clicksByPeriod.get("last30Days") || 0,
      },
      devices: Array.from(clicksByDevice).map(([name, count]) => ({
        name,
        count,
      })),
      browsers: Array.from(clicksByBrowser).map(([name, count]) => ({
        name,
        count,
      })),
    };
  }

  private getPeriodsCount(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return {
      last24Hours: days === 0 ? 1 : 0,
      last7Days: days <= 7 ? 1 : 0,
      last30Days: days <= 30 ? 1 : 0,
    };
  }
}
