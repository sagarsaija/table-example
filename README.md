# Table Example

This is a Next.js demo app of a table with displaying sample page analytics data and scoring page rank.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Scoring Algorithm

The page importance score is calculated using a combination of metrics, each contributing to the overall score:

1. Pageview Score: Uses a logarithmic scale of total pageviews to prevent extremely popular pages from dominating the score.
   `Math.log(totalPageviewCount + 1) * 20`

2. Time Score: Considers the time spent on the page, capped at 5 minutes to prevent outliers from skewing results.
   `Math.min(totalCount, 300) / 3`

3. Scroll Score: Directly uses the average scroll percentage as it's already normalized.
   `avgScrollPercentage`

4. Bounce Score: Penalizes pages with high bounce rates. A page with no bounces gets 100 points, while each bounce reduces the score.
   `Math.max(0, 100 - bounceCount * 10)`

5. Engagement Score: Rewards pages that are either entry points or lead to further site exploration.
   `(startsWithCount + endsWithCount) * 5`

6. Visitor Score: Uses a logarithmic scale of unique visitors to account for pages attracting diverse audiences.
   `Math.log(totalVisitorCount + 1) * 15`

The final score is the average of these six components, providing a balanced view of a page's importance based on various engagement metrics.

The rationale for this scoring algorithm is as follows:

- Pageview Score: Use a logarithmic scale to prevent extremely popular pages from dominating the score because this allows for a more balanced comparison between pages with varying popularity.
- Time Score: Cap the time at 300 seconds (5 minutes) to prevent outliers from skewing the results because this assumes that after 5 minutes, additional time doesn't significantly increase the page's importance.
- Scroll Score: Keep this as is, as it's already a percentage and doesn't need scaling.
- Bounce Score: Introduce a penalty for high bounce rates because page with no bounces gets 100 points, while each bounce reduces the score by 10, with a minimum of 0.
- Engagement Score: Combine startsWithCount and endsWithCount to reward pages that are either entry points or lead to further exploration of the site.
- Visitor Score: Similar to pageviews, use a logarithmic scale to account for unique visitors, giving more weight to pages that attract a diverse audience.

Low Score:
A page with a low score typically indicates:
Low number of pageviews and unique visitors
Short time spent on the page
Low scroll percentage
High bounce rate
Low engagement (few starts or ends of sessions on this page)

High Score:
A page with a high score typically indicates:
High number of pageviews and unique visitors
Longer time spent on the page (up to 5 minutes)
High scroll percentage
Low bounce rate
High engagement (many starts or ends of sessions on this page)
