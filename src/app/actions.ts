"use server";

import { createContext } from "@/lib/utils/context";
import { getUser } from "@/lib/utils/get-user";
import { revalidateTag } from "next/cache";
import { redirect, RedirectType } from "next/navigation";

export async function createLink(data: FormData) {
  const url = data.get("url");

  if (!url || typeof url !== "string") throw new Error("URL is required");

  const id = crypto.randomUUID();
  const user = await getUser();
  const { linkService } = createContext();

  try {
    const shortUrl = await linkService.createLink({
      originalUrl: url,
      id,

      userId: user?.id,
    });

    revalidateTag("links");
    return shortUrl;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create link");
  }
}

export async function updateLink(linkId: string, data: FormData) {
  const url = data.get("originalUrl");
  const isActive = data.get("isActive");
  if (!url || typeof url !== "string") throw new Error("URL is required");

  const user = await getUser();
  const { linkService } = createContext();

  try {
    if (!user) throw new Error("User not found");
    await linkService.updateLink({
      originalUrl: url,
      id: linkId,
      status: isActive ? "active" : "inactive",
      userId: user.id,
    });

    revalidateTag("links");
  } catch (error) {
    console.error(error);
  } finally {
    redirect("/dashboard", RedirectType.replace);
  }
}

export async function deleteLink(linkId: string) {
  const user = await getUser();
  const { linkService } = createContext();

  try {
    if (!user) throw new Error("User not found");
    await linkService.deleteLink({ linkId, userId: user.id });
    revalidateTag("links");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete link");
  } finally {
    redirect("/dashboard", RedirectType.replace);
  }
}
