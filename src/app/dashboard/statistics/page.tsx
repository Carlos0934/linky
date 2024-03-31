import AnalyticsChartsServer from "@/app/components/analytics-charts.server";
import LinkList from "@/app/components/link-list";
import { getLinksByUserId } from "@/app/queries";
import { getUser } from "@/lib/utils/get-user";

export default async function Page() {
  const user = await getUser();
  if (!user) return null;

  const linksByUser = await getLinksByUserId(user.id);

  return (
    <main className="mt-8 max-w-screen-lg flex items-center gap-5   mx-auto">
      <LinkList data={linksByUser} />
      <AnalyticsChartsServer />
    </main>
  );
}
