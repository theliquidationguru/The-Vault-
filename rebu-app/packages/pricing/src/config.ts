// Owner-approved pricing (2026-10-16, revised 2026-10-18). Change numbers here only.

export const PRICING = {
  markup: 2, // non-licensed items: shelf price × 2
  perMile: 2.0, // store → customer, one way
  minMiles: 3, // short trips billed as 3 miles
  memberDayMileFactor: 0.5, // paid members pay half mileage 6am–midnight; full midnight–6am
  licensedFeeDay: 10, // licensed items: flat delivery fee 6am–midnight
  licensedFeeNight: 25, // licensed items: flat delivery fee midnight–6am
  licensedAdminFee: 5, // per order with any licensed item; 100% Rebu, never discounted
  driverMileShare: 1, // drivers keep 100% of the mileage charge
  negotiatedFeeShare: 0.5, // Rebu keeps 50% of an agreed delivery price
  nightStartHour: 0,
  nightEndHour: 6,
} as const;

/** California Prop 22 floor for app-based contractors. Verify both numbers every January. */
export const PROP22 = {
  minWage: 16.9, // CA statewide minimum, 2026; local ordinances may be higher
  wageMultiplier: 1.2, // 120% of minimum wage for engaged time
  perEngagedMile: 0.37, // 2026 per-mile rate; unconfirmed, check the State Treasurer's notice
} as const;

export type TierId = "none" | "basic" | "gold" | "platinum";
export interface Tier {
  id: TierId;
  name: string;
  monthly: number;
  level: number; // unlocks categories with level <= this
  discount: number;
  discountOn: "none" | "delivery" | "order";
}
export const TIERS: Record<TierId, Tier> = {
  none: { id: "none", name: "No plan", monthly: 0, level: 0, discount: 0, discountOn: "none" },
  basic: { id: "basic", name: "Basic", monthly: 9.99, level: 1, discount: 0.05, discountOn: "delivery" },
  gold: { id: "gold", name: "Gold", monthly: 19.99, level: 2, discount: 0.15, discountOn: "delivery" },
  platinum: { id: "platinum", name: "Platinum", monthly: 39.99, level: 3, discount: 0.2, discountOn: "order" },
};

export type CategoryId = "everyday" | "adult" | "tobacco";
export interface Category {
  id: CategoryId;
  name: string;
  minAge: number;
  level: number;
  licensed: boolean; // store price, licensed fees, no markup
  /** Channels allowed to sell it. App stores ban tobacco sales, so tobacco is web-only. */
  channels: Array<"ios" | "android" | "web">;
  enabled: boolean;
}
export const CATEGORIES: Record<CategoryId, Category> = {
  everyday: { id: "everyday", name: "Everyday", minAge: 0, level: 0, licensed: false, channels: ["ios", "android", "web"], enabled: true },
  adult: { id: "adult", name: "Adult & novelty", minAge: 18, level: 2, licensed: false, channels: ["ios", "android", "web"], enabled: true },
  tobacco: { id: "tobacco", name: "Tobacco & vape", minAge: 21, level: 1, licensed: true, channels: ["web"], enabled: true },
};
// Alcohol and cannabis are off the platform by owner decision (2026-10-18).
