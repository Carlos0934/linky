import db from "../db";
import { LinkDrizzleRepository } from "../repositories/link-repository";
import { LinkService } from "../services/link-service";

export type DependenciesContext = {
  linkService: LinkService;
};

export function createContext(): DependenciesContext {
  const linkRepository = new LinkDrizzleRepository(db);
  const linkService = new LinkService(linkRepository);

  return {
    linkService,
  };
}
