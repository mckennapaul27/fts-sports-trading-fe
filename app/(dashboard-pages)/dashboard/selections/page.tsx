"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import toast from "react-hot-toast";
import { Loader2, Filter, ArrowRight } from "lucide-react";
import { ClimbingBoxLoader } from "react-spinners";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

interface System {
  _id: string;
  name: string;
  slug: string;
}

interface Selection {
  _id: string;
  systemId: {
    _id: string;
    name: string;
    slug: string;
  };
  dateISO: string;
  country?: string;
  meeting?: string;
  time?: string;
  horse: string;
  isNew: boolean;
}

interface BetResult {
  date: string;
  country: string;
  course: string;
  time: string;
  selection: string;
  result: string;
  bsp: number;
  stake: number;
  liability: number;
  pl: number;
  runningPL: number;
  systemId?: {
    _id: string;
    name: string;
    slug: string;
  };
}

export default function SelectionsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"today" | "results">("today");
  const [todaySelections, setTodaySelections] = useState<Selection[]>([]);
  const [recentResults, setRecentResults] = useState<BetResult[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [userSystems, setUserSystems] = useState<System[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [resultsOffset, setResultsOffset] = useState(0);
  const [hasSubscriptions, setHasSubscriptions] = useState<boolean | null>(
    null
  );

  // Fetch systems
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/performance/systems`);
        const data = await response.json();
        if (data.success && data.data) {
          setSystems(data.data);
        }
      } catch (err) {
        console.error("Error fetching systems:", err);
      }
    };
    fetchSystems();
  }, []);

  // Fetch today's selections
  const fetchTodaySelections = async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSystemId !== "all") {
        params.append("systemId", selectedSystemId);
      }

      const response = await fetch(
        `${apiUrl}/api/selections/today?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const data = await response.json();
      console.log("data", data);
      if (data.success) {
        setTodaySelections(data.data || []);
        // Extract unique systems from selections to determine user's subscriptions
        const uniqueSystems: System[] = Array.from(
          new Map(
            (data.data || []).map((sel: Selection) => [
              sel.systemId._id,
              sel.systemId,
            ])
          ).values()
        ) as System[];
        setUserSystems(uniqueSystems);
        // If API returns success (even with empty data), user has subscriptions
        setHasSubscriptions(true);

        // Mark selections as viewed after a short delay
        if (data.data && data.data.length > 0) {
          setTimeout(() => {
            markSelectionsAsViewed(data.data.map((s: Selection) => s._id));
          }, 1000);
        }
      } else {
        if (data.error?.includes("subscribed") || data.error?.includes("403")) {
          // User not subscribed to any systems
          setTodaySelections([]);
          setUserSystems([]);
          setHasSubscriptions(false);
        } else {
          toast.error(data.error || "Failed to load selections");
          // On other errors, we don't know subscription status, keep it null
        }
      }
    } catch (err) {
      console.error("Error fetching selections:", err);
      toast.error("Failed to load selections");
    } finally {
      setLoading(false);
    }
  };

  // Mark selections as viewed
  const markSelectionsAsViewed = async (selectionIds: string[]) => {
    if (!session?.accessToken || selectionIds.length === 0) return;

    try {
      await fetch(`${apiUrl}/api/selections/mark-viewed`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ selectionIds }),
      });
    } catch (err) {
      console.error("Error marking selections as viewed:", err);
    }
  };

  // Fetch recent results
  const fetchRecentResults = async (offset = 0, append = false) => {
    if (!session?.accessToken || systems.length === 0) return;

    setLoadingResults(true);
    try {
      // For results, we'll fetch from all systems (everyone can see results)
      // Fetch from each system and combine the results
      const params = new URLSearchParams();
      params.append("limit", "20");
      params.append("offset", offset.toString());
      params.append("sortBy", "date");
      params.append("sortOrder", "desc");

      // Fetch results from all systems (results are public)
      const resultsPromises = systems.map((system) =>
        fetch(
          `${apiUrl}/api/performance/results/${
            system._id
          }?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        )
          .then((res) => res.json())
          .catch((err) => {
            console.error(`Error fetching results for ${system.name}:`, err);
            return { success: false, data: { results: [] } };
          })
      );

      const resultsData = await Promise.all(resultsPromises);
      const allResults: BetResult[] = [];

      resultsData.forEach((data, index) => {
        if (data.success && data.data?.results) {
          const systemResults = data.data.results.map((result: BetResult) => ({
            ...result,
            systemId: systems[index],
          }));
          allResults.push(...systemResults);
        }
      });

      // Sort by date descending and remove duplicates
      const uniqueResults = Array.from(
        new Map(
          allResults.map((r) => [
            `${r.date}-${r.time}-${r.selection}-${r.systemId?._id || ""}`,
            r,
          ])
        ).values()
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Limit to 20 most recent results
      const limitedResults = uniqueResults.slice(0, 20);

      if (append) {
        setRecentResults((prev) => [...prev, ...limitedResults]);
      } else {
        setRecentResults(limitedResults);
      }

      // Check if there are more results
      const hasMore = resultsData.some((data) => data.data?.hasMore);
      setHasMoreResults(hasMore && uniqueResults.length >= 20);
      setResultsOffset(offset + 20);
    } catch (err) {
      console.error("Error fetching results:", err);
      toast.error("Failed to load results");
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchTodaySelections();
    }
  }, [session?.accessToken, selectedSystemId]);

  useEffect(() => {
    if (activeTab === "results" && session?.accessToken && systems.length > 0) {
      fetchRecentResults(0, false);
    }
  }, [activeTab, session?.accessToken, systems.length]);

  const handleLoadMoreResults = () => {
    fetchRecentResults(resultsOffset, true);
  };

  // Selections table columns
  const selectionsColumns: ColumnDef<Selection>[] = [
    {
      accessorKey: "systemId.name",
      header: "System",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-300">
          {row.original.systemId.name}
        </span>
      ),
    },
    {
      accessorKey: "dateISO",
      header: "Date",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "meeting",
      header: "Course",
    },
    {
      accessorKey: "time",
      header: "Time",
    },
    {
      accessorKey: "horse",
      header: "Selection",
    },
    // {
    //   accessorKey: "isNew",
    //   header: "Status",
    //   cell: ({ row }) => (
    //     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
    //       {row.original.isNew ? "New" : "Upcoming"}
    //     </span>
    //   ),
    // },
  ];

  // Results table columns
  const resultsColumns: ColumnDef<BetResult>[] = [
    {
      accessorKey: "systemId.name",
      header: "System",
      cell: ({ row }) =>
        row.original.systemId ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-300">
            {row.original.systemId.name}
          </span>
        ) : (
          "-"
        ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date") as string);
        return date.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "course",
      header: "Course",
    },
    {
      accessorKey: "time",
      header: "Time",
    },
    {
      accessorKey: "selection",
      header: "Selection",
    },
    {
      accessorKey: "bsp",
      header: "BSP",
      cell: ({ row }) => (row.getValue("bsp") as number).toFixed(2),
    },
    {
      accessorKey: "result",
      header: "Result",
      cell: ({ row }) => {
        const result = row.getValue("result") as string;
        // For lay betting: Won = loss (danger/red), Lost = win (success/green)
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
              result === "WON"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {result}
          </span>
        );
      },
    },
    {
      accessorKey: "pl",
      header: "Lay Pts",
      cell: ({ row }) => {
        const pl = row.getValue("pl") as number;
        return (
          <span
            className={
              pl >= 0
                ? "text-green font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {pl >= 0 ? "+" : ""}
            {pl}
          </span>
        );
      },
    },
  ];

  const selectionsTable = useReactTable({
    data: todaySelections,
    columns: selectionsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const resultsTable = useReactTable({
    data: recentResults,
    columns: resultsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Check if user has no subscriptions
  // hasSubscriptions is false when we know they don't have any
  // hasSubscriptions is true when API returns success (even with empty selections)
  // hasSubscriptions is null when we haven't determined yet or there was an error
  const hasNoSubscriptions = hasSubscriptions === false && !loading;

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark-navy">Daily Selections</h1>
        <p className="text-gray-600 mt-1">
          Today&apos;s selections and recent results across all your systems.
        </p>
      </div>

      {/* Tabs and Content */}
      {
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "today" | "results")}
          className="w-auto"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-6">
            <div className="flex-shrink-0">
              <TabsList className="bg-cream/50 border border-gray-200 justify-start">
                <TabsTrigger
                  value="today"
                  className="data-[state=active]:bg-gold data-[state=active]:text-dark-navy cursor-pointer"
                >
                  Today&apos;s Selections
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="data-[state=active]:bg-gold data-[state=active]:text-dark-navy cursor-pointer"
                >
                  Recent Results
                </TabsTrigger>
              </TabsList>
            </div>

            {/* System Filter - Only show for Today's Selections */}
            {activeTab === "today" && hasSubscriptions === true && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedSystemId}
                  onChange={(e) => setSelectedSystemId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                >
                  <option value="all">All Systems</option>
                  {userSystems.map((system) => (
                    <option key={system._id} value={system._id}>
                      {system.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <TabsContent value="today" className="mt-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {hasNoSubscriptions ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-dark-navy mb-4">
                    No Active Subscriptions
                  </h2>
                  <p className="text-gray-600 mb-6">
                    You need to subscribe to a system to view daily selections.
                    Choose a plan to get started.
                  </p>
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/dashboard/subscribe">
                      Subscribe Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <ClimbingBoxLoader color="#1e3a8a" />
                </div>
              ) : todaySelections.length === 0 && hasSubscriptions === true ? (
                <div className="text-center py-12 text-dark-navy">
                  <p className="text-lg font-semibold mb-2">
                    No selections for your subscribed systems today
                  </p>
                  <p className="text-gray-600 mb-4">
                    Selections are posted before racing begins each day. Check
                    back later for new selections.
                  </p>
                  <p className="text-sm text-gray-500">
                    Want to see more selections?{" "}
                    <Link
                      href="/membership"
                      className="text-gold hover:underline font-semibold"
                    >
                      Subscribe to more systems
                    </Link>
                  </p>
                </div>
              ) : todaySelections.length > 0 ? (
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      {selectionsTable.getHeaderGroups().map((headerGroup) => (
                        <tr
                          key={headerGroup.id}
                          className="border-b border-gray-200"
                        >
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="text-left py-3 px-4 text-sm font-semibold text-dark-navy whitespace-nowrap"
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {selectionsTable.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="py-3 px-4 text-sm text-dark-navy whitespace-nowrap"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-dark-navy">
                  <p className="text-lg font-semibold mb-2">
                    No selections available
                  </p>
                  <p className="text-gray-600">
                    Selections not yet published for today. Please try again
                    later.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {loadingResults ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <ClimbingBoxLoader color="#1e3a8a" />
                </div>
              ) : recentResults.length === 0 ? (
                <div className="text-center py-12 text-dark-navy">
                  <p className="text-lg font-semibold mb-2">No results found</p>
                  <p className="text-gray-600">
                    Results will appear here after races are completed.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full min-w-[1000px]">
                      <thead>
                        {resultsTable.getHeaderGroups().map((headerGroup) => (
                          <tr
                            key={headerGroup.id}
                            className="border-b border-gray-200"
                          >
                            {headerGroup.headers.map((header) => (
                              <th
                                key={header.id}
                                className="text-left py-3 px-4 text-sm font-semibold text-dark-navy whitespace-nowrap"
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody>
                        {resultsTable.getRowModel().rows.map((row) => (
                          <tr
                            key={row.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            {row.getVisibleCells().map((cell) => (
                              <td
                                key={cell.id}
                                className="py-3 px-4 text-sm text-dark-navy whitespace-nowrap"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {hasMoreResults && (
                    <div className="mt-6 text-center">
                      <Button
                        variant="outline"
                        onClick={handleLoadMoreResults}
                        disabled={loadingResults}
                      >
                        {loadingResults ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load More Results"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      }

      {/* Information Box */}
      <div className="mt-8 bg-cream rounded-lg border border-gold/30 p-6">
        <h2 className="text-xl font-bold text-dark-navy font-heading mb-4">
          How to use daily selections
        </h2>
        <ul className="space-y-2 text-dark-navy list-disc list-inside ml-2">
          <li>Selections are posted before racing begins each day</li>
          <li>Place your lay bets at the stated courses and times</li>
          <li>
            Results are updated using BSP (Betfair Starting Price) after each
            race
          </li>
          <li>
            All historical data is available in the &quot;Recent Results&quot;
            tab
          </li>
        </ul>
      </div>
    </div>
  );
}
