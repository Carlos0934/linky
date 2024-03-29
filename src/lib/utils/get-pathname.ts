import { headers } from "next/headers";

function getPathname() {
  const headersList = headers();
  const pathname = headersList.get("x-pathname");
  if (!pathname) return null;

  return pathname;
}

export default getPathname;
