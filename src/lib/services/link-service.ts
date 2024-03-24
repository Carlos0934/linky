import { LibSQLDatabase } from "drizzle-orm/libsql";
import generatePathShort from "../utils/generateShortPath";
import { links, LinkStatus, linkVisits } from "../db/schema";
import { count, desc, eq, inArray } from "drizzle-orm";
import { Link, TrackVisitInput } from "../domain/links";

export class LinkService {
  private baseUrl: string;
  constructor(private db: LibSQLDatabase) {
    this.baseUrl = process.env.BASE_URL || "http://localhost:3000";
  }

  async createLink(data: { url: string; id: string }) {
    const link = {
      id: data.id,
      originalUrl: data.url,
      shortPath: generatePathShort(6),
      createdAt: new Date(),
      status: LinkStatus.ACTIVE,
    };
    const result = await this.db.transaction(async (db) => {
      while (true) {
        const exists =
          (
            await db
              .select()
              .from(links)
              .limit(1)
              .where(eq(links.shortPath, link.shortPath))
          ).length > 0;

        if (!exists) break;
        link.shortPath = generatePathShort(6);
      }

      return db.insert(links).values(link).execute();
    });

    if (result.rowsAffected !== 1) throw new Error("Failed to create link");

    return `${this.baseUrl}/${link.shortPath}`;
  }

  async getLatestLinks(limit = 5) {
    const rows = await this.db
      .select({
        id: links.id,
        shortPath: links.shortPath,
        originalUrl: links.originalUrl,
        date: links.createdAt,
        status: links.status,
      })
      .from(links)
      .orderBy(desc(links.createdAt))
      .limit(limit);

    if (rows.length === 0) return [];

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
      ...data,
      shortUrl: `${this.baseUrl}/${shortPath}`,
      clicks: visitsMap[data.id] || 0,
    }));

    return result;
  }

  async getLinkByShortPath(shortPath: string) {
    const rows = await this.db
      .select()
      .from(links)
      .where(eq(links.shortPath, shortPath))
      .limit(1);

    if (rows.length === 0) return null;

    return rows[0];
  }

  async trackVisit({ ...data }: TrackVisitInput) {
    await this.db
      .insert(linkVisits)
      .values({ ...data, createdAt: new Date() })
      .execute();
  }
}
