import db from "../db";
import { LinkDrizzleRepository } from "../repositories/link-repository";
import { LinkDataAnalyticsService } from "../services/link-data-analytics-service";
import { LinkService } from "../services/link-service";

export type DependenciesContext = {
  linkService: LinkService;
  linkAnalyticsService: LinkDataAnalyticsService;
};

export function createContext(): DependenciesContext {
  const linkRepository = new LinkDrizzleRepository(db);
  const linkService = new LinkService(linkRepository);
  const linkAnalyticsService = new LinkDataAnalyticsService(linkRepository);

  return {
    linkService,
    linkAnalyticsService,
  };
}
