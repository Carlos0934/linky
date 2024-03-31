import { createContext } from "@/lib/utils/context";
import { getUser } from "@/lib/utils/get-user";
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

export const getLinkDataAnalytics = async (linkId?: string | null) => {
  const { linkAnalyticsService } = createContext();
  const user = await getUser();

  if (!user) return null;

  return linkAnalyticsService.getLinkDataAnalytics({ linkId, userId: user.id });
};
