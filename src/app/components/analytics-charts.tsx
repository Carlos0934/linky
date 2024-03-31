"use client";

import { LinkDataAnalytics } from "@/lib/domain/link-data-analytics";
import { Chart } from "react-google-charts";

type AnalyticsChartsProps = {
  data: LinkDataAnalytics;
};
export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const devices = data.devices.map((device) => [device.name, device.count]);
  const browsers = data.browsers.map((browser) => [
    browser.name,
    browser.count,
  ]);

  return (
    <div className="flex-1  self-stretch">
      <Chart
        options={{
          title: "Devices",
          titleTextStyle: { color: "white" },
          legend: {
            textStyle: { color: "white" },
          },
          backgroundColor: "transparent",
        }}
        data={[["Device", "Clicks"], ...devices]}
        chartType="PieChart"
      />

      <Chart
        options={{
          title: "Browsers",
          titleTextStyle: { color: "white" },
          legend: {
            textStyle: { color: "white" },
          },
          backgroundColor: "transparent",
        }}
        data={[["Browser", "Clicks"], ...browsers]}
        chartType="PieChart"
      />
    </div>
  );
}
