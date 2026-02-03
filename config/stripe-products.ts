/**
 * Stripe Product IDs Configuration
 *
 * This file contains product IDs for both test mode (development) and production.
 * The correct set is selected based on NODE_ENV.
 */

const isProduction = process.env.NODE_ENV === "production";

// Test Mode Product IDs (Development)
const TEST_PRODUCT_IDS = {
  ALL_SYSTEMS_YEARLY: "prod_TuX5CZShsGjSV3",
  ALL_SYSTEMS_MONTHLY: "prod_TuWZ5QV2ICNGoZ",
  SINGLE_SYSTEM_1: "prod_TuWY39xLvpurco",
  SINGLE_SYSTEM_2: "prod_TuWYybtPZAmjk9",
  SINGLE_SYSTEM_3: "prod_TuWYZoWwjZiM5t",
  SINGLE_SYSTEM_4: "prod_TuWY4ULAcIrsHl",
};

// Production Product IDs
const PRODUCTION_PRODUCT_IDS = {
  ALL_SYSTEMS_YEARLY: "prod_TePQBlRJx6Yfol",
  ALL_SYSTEMS_MONTHLY: "prod_TePPJPkddMweFM",
  SINGLE_SYSTEM_1: "prod_TePN1px9j4zOuA", // System 1 (unchanged)
  SINGLE_SYSTEM_2: "prod_TsiAlPhzZIKfHW", // NEW System 2
  SINGLE_SYSTEM_3: "prod_TsiAjjN0MymyAv", // NEW System 3
  SINGLE_SYSTEM_4: "prod_TsiBgb2TuYyr0p", // System 4 (was System 8)
};

// Export the appropriate product IDs based on environment
export const PRODUCT_IDS = isProduction
  ? PRODUCTION_PRODUCT_IDS
  : TEST_PRODUCT_IDS;

// Helper function to get all single system product IDs as an array
export const getSingleSystemProductIds = (): string[] => {
  if (isProduction) {
    return [
      PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_1,
      PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_2,
      PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_3,
      PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_4,
    ];
  } else {
    return [
      TEST_PRODUCT_IDS.SINGLE_SYSTEM_1,
      TEST_PRODUCT_IDS.SINGLE_SYSTEM_2,
      TEST_PRODUCT_IDS.SINGLE_SYSTEM_3,
      TEST_PRODUCT_IDS.SINGLE_SYSTEM_4,
    ];
  }
};

// Helper function to map product ID to system name
export const getProductIdToSystemName = (): Record<string, string> => {
  if (isProduction) {
    return {
      [PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_1]: "System 1",
      [PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_2]: "System 2",
      [PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_3]: "System 3",
      [PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_4]: "System 4",
    };
  } else {
    return {
      [TEST_PRODUCT_IDS.SINGLE_SYSTEM_1]: "System 1",
      [TEST_PRODUCT_IDS.SINGLE_SYSTEM_2]: "System 2",
      [TEST_PRODUCT_IDS.SINGLE_SYSTEM_3]: "System 3",
      [TEST_PRODUCT_IDS.SINGLE_SYSTEM_4]: "System 4",
    };
  }
};

// Helper function to check if a product ID is a single system product
export const isSingleSystemProduct = (productId: string): boolean => {
  return getSingleSystemProductIds().includes(productId);
};

// Helper function to check if a product ID is an all systems product
export const isAllSystemsProduct = (productId: string): boolean => {
  return (
    productId === PRODUCT_IDS.ALL_SYSTEMS_MONTHLY ||
    productId === PRODUCT_IDS.ALL_SYSTEMS_YEARLY
  );
};

// Helper function to get all system slugs as a comma-separated string
export const getAllSystemSlugsString = (): string => {
  const count = 4; // Both dev and prod now have 4 systems
  return Array.from({ length: count }, (_, i) => `system-${i + 1}`).join(",");
};

// Helper function to get all system slugs as an array
export const getAllSystemSlugsArray = (): string[] => {
  const count = 4; // Both dev and prod now have 4 systems
  return Array.from({ length: count }, (_, i) => `system-${i + 1}`);
};
