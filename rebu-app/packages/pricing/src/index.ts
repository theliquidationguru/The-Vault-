import { CATEGORIES, PRICING, PROP22, TIERS, type CategoryId, type TierId } from "./config";

export * from "./config";

/** Money is handled in integer cents everywhere to avoid float drift. */
export type Cents = number;
export const toCents = (dollars: number): Cents => Math.round(dollars * 100);

export interface CartLine {
  category: CategoryId;
  shelfPrice: Cents; // the store's price per unit
  qty: number;
}
export interface Leg {
  miles: number; // store → customer, one way
}
export interface QuoteInput {
  lines: CartLine[];
  legs: Leg[];
  tier: TierId;
  hour: number; // 0–23 local time
}
export interface Quote {
  items: Cents;
  itemCost: Cents; // what Rebu pays stores
  mileage: Cents;
  licensedFee: Cents;
  adminFee: Cents;
  discount: Cents;
  total: Cents;
  driverPay: Cents;
  rebuTake: Cents;
}

export const isNight = (hour: number) => hour >= PRICING.nightStartHour && hour < PRICING.nightEndHour;

export function billMiles(miles: number): number {
  return Math.max(PRICING.minMiles, miles);
}

export function mileRate(tier: TierId, hour: number): Cents {
  const paidMember = TIERS[tier].monthly > 0;
  const factor = paidMember && !isNight(hour) ? PRICING.memberDayMileFactor : 1;
  return toCents(PRICING.perMile * factor);
}

export function linePrice(line: CartLine): Cents {
  const unit = CATEGORIES[line.category].licensed ? line.shelfPrice : line.shelfPrice * PRICING.markup;
  return unit * line.qty;
}

/** Why a customer can't buy a category right now, or null when they can. */
export function blockReason(category: CategoryId, opts: { age: number; tier: TierId; channel: "ios" | "android" | "web" }): string | null {
  const c = CATEGORIES[category];
  if (!c.enabled) return "Not available";
  if (!c.channels.includes(opts.channel)) return "Order on the web";
  if (opts.age < c.minAge) return `${c.minAge}+ only`;
  if (TIERS[opts.tier].level < c.level) return "Upgrade plan";
  return null;
}

export function quote({ lines, legs, tier, hour }: QuoteInput): Quote {
  const t = TIERS[tier];
  const hasLicensed = lines.some((l) => CATEGORIES[l.category].licensed);
  const items = lines.reduce((a, l) => a + linePrice(l), 0);
  const licensedItems = lines.filter((l) => CATEGORIES[l.category].licensed).reduce((a, l) => a + linePrice(l), 0);
  const itemCost = lines.reduce((a, l) => a + l.shelfPrice * l.qty, 0);
  const rate = mileRate(tier, hour);
  const mileage = legs.reduce((a, leg) => a + Math.round(billMiles(leg.miles) * rate), 0);
  const licensedFee = hasLicensed ? toCents(isNight(hour) ? PRICING.licensedFeeNight : PRICING.licensedFeeDay) : 0;
  const adminFee = hasLicensed ? toCents(PRICING.licensedAdminFee) : 0;

  let discountBase = 0;
  if (t.discountOn === "delivery") discountBase = mileage + licensedFee;
  if (t.discountOn === "order") discountBase = items - licensedItems + mileage + licensedFee;
  const discount = Math.round(discountBase * t.discount);

  const total = items + mileage + licensedFee + adminFee - discount;
  const driverPay = Math.round(mileage * PRICING.driverMileShare);
  return { items, itemCost, mileage, licensedFee, adminFee, discount, total, driverPay, rebuTake: total - itemCost - driverPay };
}

/** "Name your price": only delivery is negotiable. Products and the admin fee stay fixed; no plan discounts. */
export function negotiatedQuote(lines: CartLine[], agreedDelivery: Cents): Quote {
  const hasLicensed = lines.some((l) => CATEGORIES[l.category].licensed);
  const items = lines.reduce((a, l) => a + linePrice(l), 0);
  const itemCost = lines.reduce((a, l) => a + l.shelfPrice * l.qty, 0);
  const adminFee = hasLicensed ? toCents(PRICING.licensedAdminFee) : 0;
  const driverPay = Math.round(agreedDelivery * (1 - PRICING.negotiatedFeeShare));
  const total = items + agreedDelivery + adminFee;
  return { items, itemCost, mileage: 0, licensedFee: 0, adminFee, discount: 0, total, driverPay, rebuTake: total - itemCost - driverPay };
}

export interface EngagedTrip {
  driverPay: Cents; // base pay from quotes, excluding tips
  engagedMinutes: number; // accept → drop-off (or cancel)
  engagedMiles: number;
}

/**
 * Prop 22 top-up for one driver over one pay period (biweekly).
 * Returns what Rebu must add so base pay meets the floor. Tips never count toward the floor.
 */
export function prop22TopUp(trips: EngagedTrip[]): { earned: Cents; floor: Cents; topUp: Cents } {
  const earned = trips.reduce((a, t) => a + t.driverPay, 0);
  const minutes = trips.reduce((a, t) => a + t.engagedMinutes, 0);
  const miles = trips.reduce((a, t) => a + t.engagedMiles, 0);
  const floor =
    Math.round((minutes / 60) * PROP22.minWage * PROP22.wageMultiplier * 100) + Math.round(miles * PROP22.perEngagedMile * 100);
  return { earned, floor, topUp: Math.max(0, floor - earned) };
}
