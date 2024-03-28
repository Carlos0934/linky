import { headers } from "next/headers";

export default function getSearchParams() {
  const headersList = headers();
  const search = headersList.get("x-query");
  const searchParams = new URLSearchParams(search || "");
  return searchParams;
}
