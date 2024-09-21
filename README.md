# Table Example

This is a Next.js demo app of a table with displaying sample page analytics data and scoring page rank.

## Getting Started

Install dependences:

```bash
npm install
```

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

## Implementation Details

This project implements a table component to visualize page analytics data. Here are the key features and their implementations:

1. **Table Layout**: The table is implemented using a custom React component (`Table.tsx`). It uses Tailwind CSS for styling and responsiveness.

2. **Data Management**: The data is managed using React Context (`TableContext.tsx`). This allows for efficient state management and easy access to data across components.

3. **Sorting**: Multi-column sorting is implemented in the `Table` component. When a column header is clicked, it triggers the `handleSort` function, which updates the `sortColumn` and `sortDirection` states.

4. **Pagination**: The table implements pagination with 10 rows per page. This is managed through the `currentPage` and `itemsPerPage` states in the `TableContext`.

5. **Search Functionality**: A global search by URL is implemented using the `searchTerm` state and the `useMemo` hook to filter the data based on the search term.

6. **Score Calculation**: A custom scoring algorithm is implemented to calculate the importance of each page. The score is based on various metrics including pageviews, time on page, scroll depth, bounce rate, engagement, and unique visitors.

7. **Theme Toggle**: A dark/light mode toggle is implemented using the `next-themes` library, allowing users to switch between color schemes.

8. **Performance Optimization**: The component uses `useMemo` hooks to optimize performance by memoizing expensive calculations for sorting and filtering.

The main components of the application are:

- `Table.tsx`: The main table component that renders the data and handles user interactions.
- `TableContext.tsx`: Manages the global state for the table data and settings.
- `page.tsx`: The main page component that sets up the `TableProvider` and renders the `Table` component.

The project uses Next.js for server-side rendering and routing, TypeScript for type safety, and Tailwind CSS for styling.
