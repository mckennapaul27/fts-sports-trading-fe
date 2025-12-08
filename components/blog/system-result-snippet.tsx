import { SystemResultSnippetComponent } from "@/lib/storyblok-types";

interface SystemResultSnippetProps {
  component: SystemResultSnippetComponent;
}

export function SystemResultSnippet({ component }: SystemResultSnippetProps) {
  const { title, profit_loss, bets, win_rate, roi, comment } = component;

  // Parse profit_loss to determine if it's positive or negative
  const plValue = profit_loss?.trim() || "";
  const isPositive =
    plValue.startsWith("+") || (!plValue.startsWith("-") && plValue !== "");
  const plNumber = parseFloat(plValue.replace(/[+\-pts]/g, "")) || 0;

  return (
    <div className="bg-gray-100 rounded-lg p-6 my-6 border border-gray-200">
      {title && (
        <p className="text-lg font-bold text-dark-navy mb-6 mt-0">{title}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {/* P/L */}
        <div>
          <div className="text-sm text-gray-600 mb-1">P/L</div>
          <div
            className={`text-base font-bold ${
              isPositive ? "text-green" : "text-red-600"
            }`}
          >
            {profit_loss || "—"}
          </div>
        </div>

        {/* Bets */}
        <div>
          <div className="text-sm text-gray-600 mb-1">Bets</div>
          <div className="text-base font-bold text-dark-navy">
            {bets || "—"}
          </div>
        </div>

        {/* Strike Rate */}
        <div>
          <div className="text-sm text-gray-600 mb-1">Strike Rate</div>
          <div className="text-base font-bold text-dark-navy">
            {win_rate || "—"}
          </div>
        </div>

        {/* ROI */}
        <div>
          <div className="text-sm text-gray-600 mb-1">ROI</div>
          <div
            className={`text-base font-bold ${
              roi && parseFloat(roi.replace("%", "")) >= 0
                ? "text-green"
                : "text-red-600"
            }`}
          >
            {roi || "—"}
          </div>
        </div>
      </div>

      {comment && (
        <div className=" border-t border-gray-300">
          <p className="text-gray-700 text-sm mb-0 mt-4">{comment}</p>
        </div>
      )}
    </div>
  );
}
