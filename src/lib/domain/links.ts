export type Link = {
  id: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  status: string;
  date: Date;
};

export type LinkVisit = {
  id: string;
  linkId: string;
  ip?: string | null;
  referer?: string | null;
  country?: string | null;
  city?: string | null;
  device?: string | null;
  deviceType?: string | null;
  engine?: string | null;
  os?: string | null;
  createdAt: Date;
};

export type ShortLink = {
  id: string;
  shortUrl: string;
  originalUrl: string;
  status: string;
  userId?: string;
};

export const LinkStatus = {
  Active: "active",
  Inactive: "inactive",
} as const;

export const USER_LINKS_LIMIT = 100;
export const LINK_SHORT_PATH_LENGTH = 6;
