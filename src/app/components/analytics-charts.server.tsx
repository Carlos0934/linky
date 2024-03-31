import getSearchParams from "@/lib/utils/get-search-params";
import { getLinkDataAnalytics } from "../queries";
import AnalyticsCharts from "./analytics-charts";

export default async function AnalyticsChartsServer() {
  const searchParams = getSearchParams();

  const linkId = searchParams.get("linkId");

  const linkDataAnalytics = await getLinkDataAnalytics(linkId);
  if (!linkDataAnalytics) return null;

  if (linkDataAnalytics.clicks.total === 0)
    return (
      <div className="flex items-center text-center w-full justify-center text-gray-300 text-lg ">
        No data available
      </div>
    );
  return <AnalyticsCharts data={linkDataAnalytics} />;
}
