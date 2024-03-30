export type LinkDataAnalytics = {
  linkId?: string;
  clicks: {
    total: number;
    last24Hours: number;
    last7Days: number;
    last30Days: number;
  };

  devices: {
    name: string;
    count: number;
  }[];

  browsers: {
    name: string;
    count: number;
  }[];
};

export type LinkDataAnalyticsPeriod = keyof LinkDataAnalytics["clicks"];
