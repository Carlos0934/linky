"use server";

import db from "@/lib/db";
import { LinkService } from "@/lib/services/link-service";
import { revalidateTag } from "next/cache";

export async function createLink(data: FormData) {
  const url = data.get("url");
  if (!url || typeof url !== "string") throw new Error("URL is required");

  const id = crypto.randomUUID();

  const linkRepository = new LinkService(db);

  try {
    const shortUrl = await linkRepository.createLink({ url, id });
    revalidateTag("links");
    return shortUrl;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create link");
  }
}
