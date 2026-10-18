import { describe, expect, it } from "vitest";
import { blockReason, negotiatedQuote, prop22TopUp, quote, toCents } from "../src/index";

// Each expected total matches an order checked by hand and in the clickable prototype.
describe("quote", () => {
  it("Basic member, $19.99 vape, 28 mi, 2pm: half mileage, $10 licensed fee, $5 admin, 5% off delivery", () => {
    const q = quote({ lines: [{ category: "tobacco", shelfPrice: toCents(19.99), qty: 1 }], legs: [{ miles: 28 }], tier: "basic", hour: 14 });
    expect(q).toMatchObject({ items: 1999, mileage: 2800, licensedFee: 1000, adminFee: 500, discount: 190, total: 6109, driverPay: 2800, rebuTake: 1310 });
  });

  it("same order at 1am pays full mileage and the $25 night fee", () => {
    const q = quote({ lines: [{ category: "tobacco", shelfPrice: toCents(19.99), qty: 1 }], legs: [{ miles: 28 }], tier: "basic", hour: 1 });
    expect(q.mileage).toBe(5600);
    expect(q.licensedFee).toBe(2500);
    expect(q.total).toBe(1999 + 5600 + 2500 + 500 - Math.round((5600 + 2500) * 0.05));
  });

  it("no plan, $20 everyday item in town: shelf × 2 and a 3-mile minimum at full rate", () => {
    const q = quote({ lines: [{ category: "everyday", shelfPrice: 2000, qty: 1 }], legs: [{ miles: 0 }], tier: "none", hour: 14 });
    expect(q).toMatchObject({ items: 4000, mileage: 600, total: 4600, driverPay: 600, rebuTake: 2000 });
  });

  it("Platinum takes 20% off the whole order, licensed store price excluded", () => {
    const q = quote({ lines: [{ category: "everyday", shelfPrice: 2000, qty: 1 }], legs: [{ miles: 5 }], tier: "platinum", hour: 14 });
    expect(q.discount).toBe(Math.round((4000 + 500) * 0.2));
  });
});

describe("negotiatedQuote", () => {
  it("$12 agreed delivery on vape + charger: 50/50 split plus the $5 admin fee", () => {
    const q = negotiatedQuote(
      [{ category: "tobacco", shelfPrice: 1999, qty: 1 }, { category: "everyday", shelfPrice: 900, qty: 1 }],
      1200,
    );
    expect(q).toMatchObject({ items: 3799, total: 5499, driverPay: 600, rebuTake: 2000 });
  });
});

describe("blockReason", () => {
  it("keeps tobacco out of the iOS and Android apps", () => {
    expect(blockReason("tobacco", { age: 30, tier: "basic", channel: "ios" })).toBe("Order on the web");
    expect(blockReason("tobacco", { age: 30, tier: "basic", channel: "web" })).toBeNull();
  });
  it("gates by age, then by plan", () => {
    expect(blockReason("adult", { age: 17, tier: "gold", channel: "ios" })).toBe("18+ only");
    expect(blockReason("adult", { age: 30, tier: "basic", channel: "ios" })).toBe("Upgrade plan");
  });
});

describe("prop22TopUp", () => {
  it("tops up a short in-town run that pays below the floor", () => {
    // $3 base pay for 15 engaged minutes and 3 miles; floor = 0.25h × $20.28 + 3 × $0.37 = $6.18
    const r = prop22TopUp([{ driverPay: 300, engagedMinutes: 15, engagedMiles: 3 }]);
    expect(r.floor).toBe(507 + 111);
    expect(r.topUp).toBe(618 - 300);
  });
  it("adds nothing when long runs already clear the floor", () => {
    expect(prop22TopUp([{ driverPay: 2800, engagedMinutes: 45, engagedMiles: 28 }]).topUp).toBe(0);
  });
});
