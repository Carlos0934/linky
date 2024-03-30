import { count, desc, eq, inArray } from "drizzle-orm";
import database from "../db";
import { links, linkVisits } from "../db/schema";
import {
  CreateLinkInput,
  CreateLinkVisitInput,
  LinkRepository,
  UpdateLinkInput,
} from "../domain/link-repository";
import { Link, LinkVisit, ShortLink } from "../domain/links";

const shortLinkColumns = {
  id: true,
  shortPath: true,
  originalUrl: true,
  createdAt: true,
  status: true,
  userId: true,
} as const;
export class LinkDrizzleRepository implements LinkRepository {
  private baseUrl: string = "http://localhost:3000";
  constructor(private db: typeof database) {
    this.baseUrl = process.env.BASE_URL || "http://localhost:3000";
  }
  async findLinkVisitsByUserId(
    userId: string,
    limit?: number | undefined
  ): Promise<LinkVisit[]> {
    const query = this.db
      .select({
        id: linkVisits.id,
        linkId: linkVisits.linkId,
        ip: linkVisits.ip,
        referer: linkVisits.referer,
        country: linkVisits.country,
        city: linkVisits.city,
        device: linkVisits.device,
        deviceType: linkVisits.deviceType,
        engine: linkVisits.engine,
        browser: linkVisits.browser,
        os: linkVisits.os,
        createdAt: linkVisits.createdAt,
      })
      .from(linkVisits)
      .innerJoin(links, eq(links.id, linkVisits.linkId))
      .where(eq(links.userId, userId))
      .orderBy(desc(linkVisits.createdAt));

    if (limit) {
      query.limit(limit);
    }

    return query;
  }

  findLinkVisitsByLinkId(
    linkId: string,
    limit?: number | undefined
  ): Promise<LinkVisit[]> {
    const query = this.db.query.linkVisits.findMany({
      where: eq(linkVisits.linkId, linkId),
      orderBy: desc(linkVisits.createdAt),
      limit,
    });

    return query;
  }
  async countLinksByUserId(userId: string): Promise<number> {
    const result = await this.db
      .select({
        total: count(links.id),
      })
      .from(links)
      .where(eq(links.userId, userId));

    return result[0].total;
  }
  async getShortLinkById(linkId: string): Promise<ShortLink | null> {
    const link = await this.db.query.links.findFirst({
      columns: shortLinkColumns,
      where: eq(links.id, linkId),
    });

    if (!link) return null;

    return {
      id: link.id,
      shortUrl: `${this.baseUrl}/${link.shortPath}`,
      originalUrl: link.originalUrl,
      status: link.status,
      userId: link?.userId || undefined,
    };
  }
  async getShortLinkByPath(path: string): Promise<ShortLink | null> {
    const result = await this.db.query.links.findFirst({
      columns: shortLinkColumns,
      where: eq(links.shortPath, path),
    });

    if (!result) return null;

    return {
      id: result.id,
      shortUrl: `${this.baseUrl}/${result.shortPath}`,
      originalUrl: result.originalUrl,
      status: result.status,
    };
  }

  async findLinksByUserId(
    userId: string,
    limit?: number | undefined
  ): Promise<Link[]> {
    const rows = await this.db.query.links.findMany({
      columns: {
        id: true,
        shortPath: true,
        originalUrl: true,
        createdAt: true,
        status: true,
      },
      where: eq(links.userId, userId),
      orderBy: desc(links.createdAt),
      limit,
    });

    if (rows.length === 0) return [];

    const result = await this.mapLinks(rows);

    return result;
  }
  async createLink(link: CreateLinkInput): Promise<ShortLink> {
    const result = await this.db.insert(links).values({
      ...link,
      status: "active",
      createdAt: new Date(),
    });

    if (result.rowsAffected == 0) throw new Error("Failed to create link");

    return {
      id: link.id,
      shortUrl: `${this.baseUrl}/${link.shortPath}`,
      originalUrl: link.originalUrl,
      status: "active",
    };
  }

  async createVisit(visit: CreateLinkVisitInput): Promise<LinkVisit> {
    const createdAt = new Date();
    const result = await this.db
      .insert(linkVisits)
      .values({ ...visit, createdAt });

    if (result.rowsAffected == 0) throw new Error("Failed to create visit");

    return {
      ...visit,
      createdAt,
    };
  }
  async updateLink(link: UpdateLinkInput): Promise<ShortLink> {
    const result = await this.db
      .update(links)
      .set({
        originalUrl: link.originalUrl,
        status: link.status,
      })
      .where(eq(links.id, link.id))
      .returning({
        shortPath: links.shortPath,
      });

    if (result.length === 0) throw new Error("Failed to update link");

    const { shortPath } = result[0];

    return {
      id: link.id,
      shortUrl: `${this.baseUrl}/${shortPath}`,
      originalUrl: link.originalUrl,
      status: link.status,
    };
  }
  async deleteLink(linkId: string): Promise<void> {
    const result = await this.db.delete(links).where(eq(links.id, linkId));

    if (result.rowsAffected === 0) throw new Error("Failed to delete link");
  }

  private async mapLinks(
    rows: {
      id: string;
      shortPath: string;
      originalUrl: string;
      createdAt: Date;
      status: string;
    }[]
  ) {
    const visits = await this.db
      .select({
        linkId: linkVisits.linkId,
        count: count(linkVisits.linkId),
      })
      .from(linkVisits)
      .where(
        inArray(
          linkVisits.linkId,
          rows.map((r) => r.id)
        )
      )
      .groupBy(linkVisits.linkId);

    const visitsMap = visits.reduce((acc, v) => {
      acc[v.linkId] = v.count;
      return acc;
    }, {} as Record<string, number>);

    const result = rows.map<Link>(({ shortPath, ...data }) => ({
      id: data.id,
      date: data.createdAt,
      originalUrl: data.originalUrl,
      status: data.status,
      shortUrl: `${this.baseUrl}/${shortPath}`,
      clicks: visitsMap[data.id] || 0,
    }));

    return result;
  }
}
