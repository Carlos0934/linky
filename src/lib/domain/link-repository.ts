import { Link, LinkVisit, ShortLink } from "./links";

export type CreateLinkInput = {
  shortPath: string;
  id: string;
  userId?: string;
  originalUrl: string;
  status: "active" | "inactive";
};
export type UpdateLinkInput = Omit<CreateLinkInput, "shortPath" | "userId">;

export type CreateLinkVisitInput = Omit<LinkVisit, "createdAt">;

export interface LinkRepository {
  getShortLinkById(linkId: string): Promise<ShortLink | null>;
  getShortLinkByPath(shortPath: string): Promise<ShortLink | null>;
  findLinksByUserId(userId: string, limit?: number): Promise<Link[]>;
  countLinksByUserId(userId: string): Promise<number>;
  findLinkVisitsByLinkId(linkId: string, limit?: number): Promise<LinkVisit[]>;
  findLinkVisitsByUserId(userId: string, limit?: number): Promise<LinkVisit[]>;

  createLink(link: CreateLinkInput): Promise<ShortLink>;
  createVisit(visit: CreateLinkVisitInput): Promise<LinkVisit>;
  updateLink(link: UpdateLinkInput): Promise<ShortLink>;
  deleteLink(linkId: string): Promise<void>;
}
