import { Link } from "@/lib/domain/links";
import { getLatestLinks } from "../queries";
import LinksTableClient from "./links-table-client";

export default async function LinksTable() {
  const data: Link[] = await getLatestLinks();
  return <LinksTableClient data={data} />;
}
