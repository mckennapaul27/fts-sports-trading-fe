export function getDateRange(range: string): { startDate: string | null; endDate: string | null; label: string } {
  const today = new Date();
  const endDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

  switch (range) {
    case "7days": {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      return {
        startDate: sevenDaysAgo.toISOString().split("T")[0],
        endDate,
        label: `Last 7 Days (${formatDate(sevenDaysAgo)} - Present)`,
      };
    }
    case "30days": {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      return {
        startDate: thirtyDaysAgo.toISOString().split("T")[0],
        endDate,
        label: `Last 30 Days (${formatDate(thirtyDaysAgo)} - Present)`,
      };
    }
    case "3months": {
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      return {
        startDate: threeMonthsAgo.toISOString().split("T")[0],
        endDate,
        label: `Last 3 Months (${formatDate(threeMonthsAgo)} - Present)`,
      };
    }
    case "6months": {
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      return {
        startDate: sixMonthsAgo.toISOString().split("T")[0],
        endDate,
        label: `Last 6 Months (${formatDate(sixMonthsAgo)} - Present)`,
      };
    }
    case "ytd": {
      const yearStart = new Date(today.getFullYear(), 0, 1);
      return {
        startDate: yearStart.toISOString().split("T")[0],
        endDate,
        label: `YTD (${formatDate(yearStart)} - Present)`,
      };
    }
    case "all":
    default:
      return {
        startDate: null,
        endDate: null,
        label: "All Time",
      };
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

