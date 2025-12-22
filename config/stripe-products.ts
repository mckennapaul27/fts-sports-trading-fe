/**
 * Stripe Product IDs Configuration
 *
 * This file contains product IDs for both test mode (development) and production.
 * The correct set is selected based on NODE_ENV.
 */

const isProduction = process.env.NODE_ENV === "production";

// Test Mode Product IDs (Development)
const TEST_PRODUCT_IDS = {
  ALL_SYSTEMS_YEARLY: "prod_TZZdcgHBZ13uZ9",
  ALL_SYSTEMS_MONTHLY: "prod_TZZcEMlv2cNNWl",
  SINGLE_SYSTEM_1: "prod_TZZbjLqthXdjxx",
  SINGLE_SYSTEM_2: "prod_TZZcUfjAmtJfkg",
  SINGLE_SYSTEM_3: "prod_TZZcuPVww3QyDm",
};

// Production Product IDs
const PRODUCTION_PRODUCT_IDS = {
  ALL_SYSTEMS_YEARLY: "prod_TePQBlRJx6Yfol",
  ALL_SYSTEMS_MONTHLY: "prod_TePPJPkddMweFM",
  SINGLE_SYSTEM_1: "prod_TePN1px9j4zOuA",
  SINGLE_SYSTEM_2: "prod_TePNYKgxhmABMa",
  SINGLE_SYSTEM_3: "prod_TePNTzP7ihKJXL",
  SINGLE_SYSTEM_4: "prod_TePOmkdhHUwVjO",
  SINGLE_SYSTEM_5: "prod_TePOjvXyL4Cw2M",
  SINGLE_SYSTEM_6: "prod_TePO49X4qT3CZS",
  SINGLE_SYSTEM_7: "prod_TePOghwnnYDHwq",
  SINGLE_SYSTEM_8: "prod_TePPGZ57M6Rhw2",
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
      PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_5,
      PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_6,
      PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_7,
      PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_8,
    ];
  } else {
    return [
      TEST_PRODUCT_IDS.SINGLE_SYSTEM_1,
      TEST_PRODUCT_IDS.SINGLE_SYSTEM_2,
      TEST_PRODUCT_IDS.SINGLE_SYSTEM_3,
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
      [PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_5]: "System 5",
      [PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_6]: "System 6",
      [PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_7]: "System 7",
      [PRODUCTION_PRODUCT_IDS.SINGLE_SYSTEM_8]: "System 8",
    };
  } else {
    return {
      [TEST_PRODUCT_IDS.SINGLE_SYSTEM_1]: "System 1",
      [TEST_PRODUCT_IDS.SINGLE_SYSTEM_2]: "System 2",
      [TEST_PRODUCT_IDS.SINGLE_SYSTEM_3]: "System 3",
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
  const count = isProduction ? 8 : 3;
  return Array.from({ length: count }, (_, i) => `system-${i + 1}`).join(",");
};

// Helper function to get all system slugs as an array
export const getAllSystemSlugsArray = (): string[] => {
  const count = isProduction ? 8 : 3;
  return Array.from({ length: count }, (_, i) => `system-${i + 1}`);
};
