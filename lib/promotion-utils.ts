"use client";

import {
  getPromotionalPrice,
  getBestActivePromotionForProduct,
  type Promotion,
} from "@/config/promotions";

/**
 * Get formatted price string with promotional information
 */
export function getFormattedPrice(
  productId: string | undefined,
  originalPrice: number,
  period: string
): {
  displayPrice: string;
  originalPrice: string;
  isPromotional: boolean;
  promotion?: Promotion;
  discountBadge?: string;
} {
  // Diagnostic logging
  if (process.env.NODE_ENV !== "production") {
    console.log("[PROMOTION DEBUG] getFormattedPrice called:", {
      productId,
      originalPrice,
      period,
      hasProductId: !!productId,
    });
  }

  if (!productId) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[PROMOTION DEBUG] No productId provided, returning original price"
      );
    }
    return {
      displayPrice: `£${originalPrice}`,
      originalPrice: `£${originalPrice}`,
      isPromotional: false,
    };
  }

  const priceInfo = getPromotionalPrice(productId, originalPrice);

  if (priceInfo.isPromotional && priceInfo.promotion) {
    const result = {
      displayPrice: `£${priceInfo.price}`,
      originalPrice: `£${originalPrice}`,
      isPromotional: true,
      promotion: priceInfo.promotion,
      discountBadge: `${priceInfo.promotion.discountPercentage}% OFF`,
    };

    if (process.env.NODE_ENV !== "production") {
      console.log("[PROMOTION DEBUG] Returning promotional price:", result);
    }

    return result;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[PROMOTION DEBUG] Returning original price (no promotion)");
  }

  return {
    displayPrice: `£${originalPrice}`,
    originalPrice: `£${originalPrice}`,
    isPromotional: false,
  };
}

/**
 * Check if a product has an active promotion
 */
export function hasActivePromotion(productId: string | undefined): boolean {
  if (!productId) return false;
  const promotion = getBestActivePromotionForProduct(productId);
  return promotion !== null;
}
