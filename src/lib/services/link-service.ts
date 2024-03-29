import { ShortLink, USER_LINKS_LIMIT } from "../domain/links";
import {
  CreateLinkInput,
  LinkRepository,
  UpdateLinkInput,
} from "../domain/link-repository";
import { UAParser } from "ua-parser-js";
import generateShortPath from "../utils/generate-short-path";
import { LimitReachedError } from "../errors/limit-reached-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { NotFoundError } from "../errors/not-found-error";

type TrackVisitInput = {
  linkId: string;
  request: Request;
};
export class LinkService {
  constructor(private linkRepository: LinkRepository) {}

  async createLink(data: Omit<CreateLinkInput, "shortPath" | "status">) {
    if (data.userId) {
      const isLimitReached = await this.validateIsLimitReached(data.userId);

      if (isLimitReached) throw new LimitReachedError(USER_LINKS_LIMIT);
    }
    const shortPath = generateShortPath();
    const link = await this.linkRepository.createLink({
      ...data,
      status: "active",
      shortPath,
    });

    return link;
  }

  async updateLink({
    id,
    originalUrl,
    status,
    userId,
  }: UpdateLinkInput & { userId: string }) {
    const link = await this.linkRepository.getShortLinkById(id);
    if (!link) throw new NotFoundError();

    if (link.userId !== userId) {
      throw new UnauthorizedError();
    }

    return this.linkRepository.updateLink({ id, originalUrl, status });
  }

  getLatestLinks(userId: string) {
    const LAST_LINKS_LIMIT = 5;
    return this.linkRepository.findLinksByUserId(userId, LAST_LINKS_LIMIT);
  }

  async getByShortPath(shortPath: string) {
    return this.linkRepository.getShortLinkByPath(shortPath);
  }

  async trackVisit({ linkId, request }: TrackVisitInput) {
    const id = crypto.randomUUID();
    const userAgent = request.headers.get("User-Agent");
    const ip = request.headers.get("X-Forwarded-For");
    const referrer = request.headers.get("Referer");
    const country = request.headers.get("X-Vercel-IP-Country");
    const city = request.headers.get("x-vercel-ip-city");

    const ua = new UAParser(userAgent || undefined);

    const userAgentData = {
      os: ua.getOS().name,
      engine: ua.getEngine().name,
      device: `${ua.getDevice().model}`,
      deviceType: ua.getDevice().type,
      browser: ua.getBrowser().name,
    };
    const visit = await this.linkRepository.createVisit({
      id,
      linkId,
      ip,
      referer: referrer,
      country,
      city,
      ...userAgentData,
    });

    return visit;
  }

  async getById(linkId: string): Promise<ShortLink | null> {
    return this.linkRepository.getShortLinkById(linkId);
  }

  private async validateIsLimitReached(userId: string) {
    const total = await this.linkRepository.countLinksByUserId(userId);

    return total >= USER_LINKS_LIMIT;
  }

  async getLinksByUserId(userId: string) {
    return this.linkRepository.findLinksByUserId(userId);
  }

  async deleteLink({ linkId, userId }: { linkId: string; userId: string }) {
    const link = await this.linkRepository.getShortLinkById(linkId);
    if (!link) throw new NotFoundError();

    if (link.userId !== userId) {
      throw new UnauthorizedError();
    }
    return this.linkRepository.deleteLink(linkId);
  }
}
