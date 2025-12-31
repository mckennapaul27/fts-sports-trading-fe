import { PRODUCT_IDS } from "./stripe-products";

/**
 * Promotional periods configuration
 *
 * Test Mode:
 * - Coupon ID: 3PTHivK6 (sandbox/test mode)
 * - Promotion Code: JAN50
 * - Promotion Code API ID: promo_1Sjcx0DVmAeT8Z
 *
 * Production:
 * - Coupon ID: 9ymsNuP0 (set via STRIPE_PROMOTION_COUPON_ID env var)
 * - Promotion Code: JAN50
 * - Promotion Code API ID: promo_1SkMQwGUcz2TV8H1FVP0y3kS (set via STRIPE_PROMOTION_CODE_ID env var)
 */

const isProduction = process.env.NODE_ENV === "production";

// Diagnostic logging on module load
if (typeof window === "undefined" || process.env.NODE_ENV !== "production") {
  console.log("[PROMOTION DEBUG] Promotion config initialized:", {
    isProduction,
    NODE_ENV: process.env.NODE_ENV,
    ALL_SYSTEMS_YEARLY_PRODUCT_ID: PRODUCT_IDS.ALL_SYSTEMS_YEARLY,
    currentDate: new Date().toISOString(),
  });
}

// Test Mode Coupon IDs (Sandbox)
const TEST_COUPON_IDS = {
  JANUARY_2026: "3PTHivK6", // Dev/test coupon ID
};

// Production Coupon IDs (Live - to be set when created)
// Note: In Next.js, env vars used in client components need NEXT_PUBLIC_ prefix
// But we also check server-side env vars as fallback for build-time evaluation
const PRODUCTION_COUPON_IDS = {
  JANUARY_2026:
    process.env.NEXT_PUBLIC_STRIPE_PROMOTION_COUPON_ID ||
    process.env.STRIPE_PROMOTION_COUPON_ID ||
    "", // Set when created in live account
};

// Test Mode Promotion Code IDs
const TEST_PROMO_CODE_IDS = {
  JANUARY_2026: "promo_1SjcxODVmAeT8ZSFJaeTtrwp", // Updated with correct test promo code ID
};

// Production Promotion Code IDs (to be set when created)
const PRODUCTION_PROMO_CODE_IDS = {
  JANUARY_2026:
    process.env.NEXT_PUBLIC_STRIPE_PROMOTION_CODE_ID ||
    process.env.STRIPE_PROMOTION_CODE_ID ||
    "", // Set when created in live account
};

export interface Promotion {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  couponId: string; // Stripe coupon ID (environment-specific)
  promotionCodeId?: string; // Stripe promotion code API ID (optional, environment-specific)
  promotionCode?: string; // Human-readable code like "JAN50" (optional)
  applicableProducts: string[]; // Product IDs this promotion applies to
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
}

export const PROMOTIONS: Promotion[] = [
  {
    id: "january-2026",
    name: "January 2026 - 50% Off All Systems Yearly",
    // TESTING: Temporarily set to active dates for testing
    // TODO: Before production, change back to:
    // startDate: "2026-01-01T00:00:00Z",
    // endDate: "2026-01-31T23:59:59Z",
    startDate: "2025-01-01T00:00:00Z", // Testing: past date
    endDate: "2026-12-31T23:59:59Z", // Testing: future date
    couponId: isProduction
      ? PRODUCTION_COUPON_IDS.JANUARY_2026
      : TEST_COUPON_IDS.JANUARY_2026,
    promotionCodeId: isProduction
      ? PRODUCTION_PROMO_CODE_IDS.JANUARY_2026 || undefined
      : TEST_PROMO_CODE_IDS.JANUARY_2026,
    promotionCode: "JAN50",
    applicableProducts: [PRODUCT_IDS.ALL_SYSTEMS_YEARLY],
    discountPercentage: 50,
    originalPrice: 240,
    discountedPrice: 120,
  },
];

/**
 * Get coupon ID for a promotion based on environment
 * Returns empty string if not configured for production
 */
export function getCouponIdForPromotion(promotionId: string): string {
  const promotion = PROMOTIONS.find((p) => p.id === promotionId);
  if (!promotion) return "";

  if (isProduction) {
    return PRODUCTION_COUPON_IDS.JANUARY_2026 || "";
  }
  return TEST_COUPON_IDS.JANUARY_2026;
}

/**
 * Get promotion code ID for a promotion based on environment
 * Returns undefined if not configured
 */
export function getPromotionCodeIdForPromotion(
  promotionId: string
): string | undefined {
  const promotion = PROMOTIONS.find((p) => p.id === promotionId);
  if (!promotion) return undefined;

  if (isProduction) {
    return PRODUCTION_PROMO_CODE_IDS.JANUARY_2026 || undefined;
  }
  return TEST_PROMO_CODE_IDS.JANUARY_2026;
}

/**
 * Check if a promotion is currently active
 */
export function isPromotionActive(promotion: Promotion): boolean {
  const now = new Date();
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);
  const isActive = now >= start && now <= end;

  // Diagnostic logging
  if (process.env.NODE_ENV !== "production") {
    console.log("[PROMOTION DEBUG] isPromotionActive check:", {
      promotionId: promotion.id,
      promotionName: promotion.name,
      now: now.toISOString(),
      start: start.toISOString(),
      end: end.toISOString(),
      isActive,
      couponId: promotion.couponId,
      applicableProducts: promotion.applicableProducts,
    });
  }

  return isActive;
}

/**
 * Get active promotions for a specific product
 */
export function getActivePromotionsForProduct(productId: string): Promotion[] {
  const allPromotions = PROMOTIONS.filter((promo) =>
    promo.applicableProducts.includes(productId)
  );
  const activePromotions = allPromotions.filter((promo) =>
    isPromotionActive(promo)
  );

  // Diagnostic logging
  if (process.env.NODE_ENV !== "production") {
    console.log("[PROMOTION DEBUG] getActivePromotionsForProduct:", {
      productId,
      allPromotionsCount: allPromotions.length,
      activePromotionsCount: activePromotions.length,
      allPromotions: allPromotions.map((p) => ({
        id: p.id,
        name: p.name,
        applicableProducts: p.applicableProducts,
      })),
      activePromotions: activePromotions.map((p) => ({
        id: p.id,
        name: p.name,
        couponId: p.couponId,
      })),
    });
  }

  return activePromotions;
}

/**
 * Get the best active promotion for a product (if multiple exist)
 */
export function getBestActivePromotionForProduct(
  productId: string
): Promotion | null {
  const active = getActivePromotionsForProduct(productId);
  if (active.length === 0) return null;

  // Return the promotion with the highest discount
  return active.reduce((best, current) =>
    current.discountPercentage > best.discountPercentage ? current : best
  );
}

/**
 * Get promotional price for a product, or return original price
 */
export function getPromotionalPrice(
  productId: string,
  originalPrice: number
): { price: number; isPromotional: boolean; promotion?: Promotion } {
  const promotion = getBestActivePromotionForProduct(productId);

  // Diagnostic logging
  if (process.env.NODE_ENV !== "production") {
    console.log("[PROMOTION DEBUG] getPromotionalPrice:", {
      productId,
      originalPrice,
      foundPromotion: !!promotion,
      promotion: promotion
        ? {
            id: promotion.id,
            name: promotion.name,
            couponId: promotion.couponId,
            isActive: isPromotionActive(promotion),
          }
        : null,
      isProduction,
      couponIdConfigured: promotion?.couponId || false,
    });
  }

  if (promotion && isPromotionActive(promotion)) {
    // Show promotional pricing if promotion is active
    // Note: Backend will handle applying the coupon - frontend just displays the price
    // If backend doesn't have coupon configured, checkout will show regular price

    if (process.env.NODE_ENV !== "production") {
      console.log("[PROMOTION DEBUG] Applying promotion:", {
        originalPrice,
        discountedPrice: promotion.discountedPrice,
        discountPercentage: promotion.discountPercentage,
      });
    }

    return {
      price: promotion.discountedPrice,
      isPromotional: true,
      promotion,
    };
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(
      "[PROMOTION DEBUG] No active promotion found, using original price"
    );
  }

  return {
    price: originalPrice,
    isPromotional: false,
  };
}
