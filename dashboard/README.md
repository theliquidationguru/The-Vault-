# Business HQ dashboard

Live dashboard across all businesses. Published as a private claude.ai artifact; this is the page source.

## Data sources
| Section | Source |
|---|---|
| Timberfalls sales, orders, visitors, inventory | Shopify connector (ShopifyQL `run-analytics-query`), live |
| Unanswered email, customer questions | Gmail connector (`search_threads`), live |
| YepSell (eBay, Mercari, yepsellstore.co.site) sales, costs, money owed, inventory value, visitors | Ledger on the page (artifact database), entered by hand until connectors exist |
| Businesses list | `businesses` collection in the artifact database; adding a new app = adding one document |

## Notes
- Ledger and business list are readable and writable only by editors of the artifact.
- Profit/loss = sales (Shopify net sales + ledger sales) minus ledger costs. Shopify product costs aren't included until they're logged.
- Timberfalls inventory reports 9,999+ units per variant (print-on-demand), so the page counts available products instead of units.
