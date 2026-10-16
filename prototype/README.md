# Runner24 — clickable prototype

On-demand delivery for Siskiyou County, CA. Open `index.html` in a browser. There's no build step and no backend; all stores and prices are sample data.

## What's in it
- **Age gate**: date of birth sets 18+ or 21+ access. The driver checks ID again at the door.
- **Shop**: fictional sample stores in alcohol, tobacco/vape, cannabis, adult/novelty and everyday categories. Each store shows its supply model (partner store, runner buys it, our stock).
- **Errand ("Any")**: the customer names anything legal, and a runner buys it at any open store.
- **Checkout**: every fee shows **Pending approval**. No pricing is set.
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

## Pricing
Not implemented. Every value in `FEES` in `index.html` is `null` until the owner approves a plan.
