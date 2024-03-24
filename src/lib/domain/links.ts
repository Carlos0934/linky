export type Link = {
  id: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  status: string;
  date: Date;
};

export type TrackVisitInput = {
  linkId: string;
  id: string;
  ip?: string | null;
  referer?: string | null;
  country?: string | null;
  city?: string | null;
  device?: string | null;
  deviceType?: string | null;
  engine?: string | null;
  os?: string | null;
};
