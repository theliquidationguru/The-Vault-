# Rebu — production app

The real iOS + Android app. The clickable prototype in `../prototype` is the spec.

## Status
| Part | State |
|---|---|
| `packages/pricing`: pricing, negotiation, category gating, Prop 22 top-up | Built, 9 tests passing |
| Customer app (iOS + Android, one Expo / React Native codebase) | Next |
| Driver app mode (same app, driver login) | After customer app |
| Backend: accounts, orders, live driver location | Next, alongside the customer app |
| Payments: NMI gateway on Rebu's own merchant account | Waiting on merchant account approval |

## Decisions (owner, 2026-10-18)
- Categories: everyday, adult & novelty, tobacco & vape. No alcohol or cannabis for now.
- Launch on both Apple App Store and Google Play.
- Drivers are independent contractors: W-9 at signup, 1099-NEC yearly, Prop 22 earnings floor enforced.
- Payments through Rebu's own high-risk merchant account, not Stripe/Square.

## App store rules that shape the build
- Apple (guideline 1.4.3) and Google Play both ban apps that facilitate tobacco/vape sales. Tobacco is set to the `web` channel only, so the iOS and Android apps never show it. Selling it needs a web ordering page.
- Delivery and memberships tied to physical delivery may use our own card processing instead of Apple/Google in-app purchase (Apple 3.1.3(e)); explain the membership in App Review notes.
- Adult products: no explicit images or copy (Apple 1.1.4). Discreet product photos only.

## Payments plan
1. Rebu (its own entity, not YepSell) applies for a high-risk merchant account that accepts vape and adult products.
2. The merchant account connects to the **NMI** gateway. The app collects cards through NMI's hosted fields, so card numbers never touch Rebu servers (PCI SAQ-A).
3. Memberships bill monthly through NMI's recurring billing.
4. Drivers get paid by ACH from Rebu's bank account weekly; the payout job adds any Prop 22 top-up.

## Prop 22 numbers to verify every January
`packages/pricing/src/config.ts` → `PROP22`: CA minimum wage ($16.90 in 2026), 120% multiplier, per-engaged-mile rate ($0.37 unconfirmed).
