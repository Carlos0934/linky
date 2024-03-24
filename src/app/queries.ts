import db from "@/lib/db";

import { LinkService } from "@/lib/services/link-service";
import { unstable_cache } from "next/cache";

export const getLatestLinks = unstable_cache(
  () => {
    const linkRepository = new LinkService(db);
    return linkRepository.getLatestLinks(5);
  },
  ["links"],
  { tags: ["links"], revalidate: 3600 }
);
