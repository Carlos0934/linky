import { Link } from "@/lib/domain/links";
import { getLatestLinks, getLinksByUserId } from "../queries";
import LinksTableClient from "./links-table-client";
import { getUser } from "@/lib/utils/get-user";

type LinksTableProps = {
  showActions?: boolean;
  latest?: boolean;
};

export default async function LinksTable({
  showActions,
  latest,
}: LinksTableProps) {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const data = latest
    ? await getLatestLinks(user.id)
    : await getLinksByUserId(user.id);
  return <LinksTableClient data={data} showActions={showActions} />;
}
