import { createContext } from "@/lib/utils/context";

export async function GET(request: Request) {
  const { linkService } = createContext();
  const shortPath = request.url.split("/").pop();
  const notFoundResponse = new Response(null, { status: 404 });

  if (!shortPath) return notFoundResponse;

  const link = await linkService.getByShortPath(shortPath);

  if (!link) return notFoundResponse;

  await linkService.trackVisit({ linkId: link.id, request });

  const response = new Response(null, {
    status: 302,
    headers: {
      Location: link.originalUrl,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });

  return response;
}
