declare module "google-trends-api" {
  interface TrendsQueryOptions {
    keyword: string | string[];
    startTime?: Date;
    endTime?: Date;
    geo?: string;
    hl?: string;
    category?: number;
    timezone?: number;
  }

  export function relatedQueries(options: TrendsQueryOptions): Promise<string>;
  export function relatedTopics(options: TrendsQueryOptions): Promise<string>;
  export function interestOverTime(options: TrendsQueryOptions): Promise<string>;
  export function dailyTrends(
    options: { trendDate?: Date; geo?: string; hl?: string },
  ): Promise<string>;

  const googleTrends: {
    relatedQueries: typeof relatedQueries;
    relatedTopics: typeof relatedTopics;
    interestOverTime: typeof interestOverTime;
    dailyTrends: typeof dailyTrends;
  };

  export default googleTrends;
}
