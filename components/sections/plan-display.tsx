import { PRODUCT_IDS } from "@/config/stripe-products";
import { getFormattedPrice } from "@/lib/promotion-utils";

function CheckmarkIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M16.6667 5L7.50004 14.1667L3.33337 10"
        stroke="var(--color-dark-navy)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface PlanDisplayProps {
  planName: string;
  price: string;
  period: string;
  features: string[];
  systemName?: string;
  productId?: string;
}

const planFeatures: Record<string, string[]> = {
  "Single System": [
    "Access to 1 system",
    "Daily selections",
    "Full results history",
    "Email support",
    "Cancel anytime",
  ],
  "All Systems - Monthly": [
    "Access to all systems",
    "Daily selections for all",
    "Full results history",
    "Priority email support",
    "Cancel anytime",
    "Save £20/month",
  ],
  "All Systems - Yearly": [
    "Access to all systems",
    "Daily selections for all",
    "Full results history",
    "Priority support",
    "Cancel anytime",
    "Save £120/year",
  ],
};

const planPrices: Record<string, { price: number; period: string }> = {
  "Single System": {
    price: 10,
    period: "/month",
  },
  "All Systems - Monthly": {
    price: 30,
    period: "/month",
  },
  "All Systems - Yearly": {
    price: 240,
    period: "/year",
  },
};

export function PlanDisplay({
  planName,
  systemName,
  productId,
}: {
  planName: string;
  systemName?: string;
  productId?: string;
}) {
  // Determine the correct plan key based on planName and productId
  let planKey = planName;

  // If planName is "ALL SYSTEMS", determine if it's monthly or yearly based on productId
  if (planName === "ALL SYSTEMS" || planName === "All Systems") {
    if (productId === PRODUCT_IDS.ALL_SYSTEMS_YEARLY) {
      planKey = "All Systems - Yearly";
    } else if (productId === PRODUCT_IDS.ALL_SYSTEMS_MONTHLY) {
      planKey = "All Systems - Monthly";
    } else {
      // Default to monthly if productId not provided
      planKey = "All Systems - Monthly";
    }
  }

  const features = planFeatures[planKey] || planFeatures["Single System"];
  const { price: originalPrice, period } =
    planPrices[planKey] || planPrices["Single System"];

  // Get promotional pricing if available
  const priceInfo = getFormattedPrice(productId, originalPrice, period);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-dark-navy mb-1">
          {systemName ? `${systemName} - ${planName}` : planName}
        </h3>
        <p className="text-sm text-gray-600">
          {systemName
            ? "Perfect for testing one system"
            : planKey === "All Systems - Yearly"
            ? "Best value for committed traders"
            : planKey === "All Systems - Monthly" || planKey === "ALL SYSTEMS"
            ? "Full portfolio access"
            : "Full portfolio access"}
        </p>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200">
        {priceInfo.isPromotional && priceInfo.discountBadge && (
          <div className="mb-2">
            <span className="inline-block bg-gold text-white px-3 py-1 rounded-sm text-sm font-bold">
              {priceInfo.discountBadge}
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          {priceInfo.isPromotional ? (
            <>
              <span className="text-4xl font-bold text-dark-navy">
                {priceInfo.displayPrice}
              </span>
              <span className="text-lg text-gray-600">{period}</span>
              <span className="text-lg text-gray-400 line-through ml-2">
                {priceInfo.originalPrice}
              </span>
            </>
          ) : (
            <>
              <span className="text-4xl font-bold text-dark-navy">
                {priceInfo.displayPrice}
              </span>
              <span className="text-lg text-gray-600">{period}</span>
            </>
          )}
        </div>
      </div>

      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckmarkIcon />
            <span className="text-dark-navy text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
