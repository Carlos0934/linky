import { createContext } from "@/lib/utils/context";
import { unstable_cache } from "next/cache";

export const getLatestLinks = unstable_cache(
  async (userId: string) => {
    const { linkService } = createContext();

    return linkService.getLatestLinks(userId);
  },
  ["links-latest"],
  { tags: ["links", "latest"], revalidate: 3600 }
);

export const getLinksByUserId = unstable_cache(
  async (userId: string) => {
    const { linkService } = createContext();

    return linkService.getLinksByUserId(userId);
  },
  ["links"],
  { tags: ["links"], revalidate: 3600 }
);

export const getLinkById = async (linkId: string) => {
  const { linkService } = createContext();

  return linkService.getById(linkId);
};
