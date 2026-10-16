# Rebu — clickable prototype

On-demand delivery for Siskiyou County, CA. Open `index.html` in a browser. There's no build step and no backend; all stores and prices are sample data.

## What's in it
- **Age gate**: date of birth sets 18+ or 21+ access. The driver checks ID again at the door.
- **Shop**: fictional sample stores in alcohol, tobacco/vape, cannabis, adult/novelty and everyday categories. Each store shows its supply model (partner store, runner buys it, our stock).
- **Errand ("Any")**: the customer names anything legal, and a runner buys it at any open store.
- **Checkout**: live totals using the approved pricing below.
- **Driver**: a required door checklist for restricted items, with a "Refuse: no valid ID" path.
- **Ops/Admin**: a rules engine showing age, legal hours and status per category. Move the demo-time slider to watch categories open and close.

## Category rules (working read of CA law; confirm with counsel)
| Category | Age | Hours | Note |
|---|---|---|---|
| Alcohol | 21 | 6am–2am | CA bans alcohol sales 2am–6am |
| Tobacco/vape | 21 | 24/7 | Unflavored only (CA flavor ban); PACT Act applies to delivery sales |
| Cannabis | 21 | 6am–10pm | Licensed retailer delivery only; hemp THC is being phased out |
| Adult/novelty | 18 | 24/7 | Discreet packaging |
| Everyday | — | 24/7 | |

## Pricing (owner-approved 2026-10-16)
Set in `PRICING` and `TIERS` at the top of the script in `index.html`.

**Per order**
- Everyday, adult/novelty and errand items: shelf price × 2.
- Alcohol, tobacco and cannabis: the store's price with no markup (the licensed store stays the seller), plus a flat licensed-delivery fee of $10 from 6am to midnight or $25 from midnight to 6am.
- Mileage: $2.00/mile, measured one way from the store to the customer. In-town trips count as 3 miles until real routing is added.
- Paid members (Basic, Gold, Platinum) pay half mileage ($1.00/mile) from 6am to midnight, and the full $2.00/mile from midnight to 6am. Plan discounts apply on top.

**Memberships (monthly)**
| Plan | Price | Includes |
|---|---|---|
| No plan | Free | Everyday items only |
| Basic | $9.99 | Alcohol, tobacco and cannabis; 5% off delivery charges |
| Gold | $19.99 | Basic plus adult products; 15% off delivery charges |
| Platinum | $39.99 | Gold plus 20% off every order (excluding licensed items' store price) and pickup from any address |

"Delivery charges" means mileage plus the licensed-delivery fee.

**Driver pay**
- Standard orders: the driver gets 100% of the mileage charge (before any plan discount; Rebu absorbs the discount).
- Negotiated jobs ("Name your price" on errands and pickups): the customer makes an offer for the run, and the driver can accept, counter or decline, back and forth. Once a price is agreed, the driver gets 50% of it and Rebu keeps 50%. Errand items are still charged at the receipt × 2. Plan discounts don't apply to negotiated runs.
