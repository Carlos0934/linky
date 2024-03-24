import db from "@/lib/db";
import { UAParser } from "ua-parser-js";
import { LinkService } from "@/lib/services/link-service";
import { revalidateTag } from "next/cache";

export async function GET(request: Request) {
  const linkRepository = new LinkService(db);
  const userAgent = request.headers.get("User-Agent");

  const path = new URL(request.url).pathname.slice(1);

  const link = await linkRepository.getLinkByShortPath(path);

  if (!link) return new Response("Not found", { status: 404 });

  const ua = new UAParser(userAgent || undefined);

  const data = {
    referrer: request.headers.get("Referer"),
    os: ua.getOS().name,
    engine: ua.getEngine().name,
    device: `${ua.getDevice().model}`,
    deviceType: ua.getDevice().type,
    browser: ua.getBrowser().name,
    ip: request.headers.get("X-Forwarded-For"),
    country: request.headers.get("X-Vercel-IP-Country"),
    city: request.headers.get("x-vercel-ip-city"),
  };

  const id = crypto.randomUUID();
  await linkRepository.trackVisit({ ...data, linkId: link.id, id });
  revalidateTag("links");
  const response = new Response(null, {
    status: 302,
    headers: {
      Location: link.originalUrl,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });

  return response;
}
