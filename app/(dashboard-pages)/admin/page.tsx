"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Upload,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { COUNTRIES, MEETINGS } from "@/data";
const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

// Format points helper (2 decimal places)
function formatCurrency(num: number): string {
  return num.toFixed(2);
}

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
  date: string;
  country?: string;
  meeting?: string;
  time?: string;
  horse: string;
  isNew: boolean;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  // Result fields
  result?: string;
  winBsp?: number;
  winPL?: number;
  runningWinPL?: number;
  placeBsp?: number;
  placePL?: number;
  runningPlacePL?: number;
  hasResult?: boolean;
  createdAt: string;
  updatedAt: string;
}

const selectionFormSchema = z.object({
  systemId: z.string().min(1, "System is required"),
  date: z.string().min(1, "Date is required"),
  country: z.string().optional(),
  meeting: z.string().optional(),
  time: z.string().optional(),
  horse: z.string().min(1, "Horse name is required"),
});

type SelectionFormData = z.infer<typeof selectionFormSchema>;

const resultFormSchema = z.object({
  result: z.string().optional(),
  winBsp: z.any().optional(),
  placeBsp: z.any().optional(),
});

type ResultFormDataRaw = z.infer<typeof resultFormSchema>;

type ResultFormData = {
  result?: string;
  winBsp?: number;
  placeBsp?: number;
};

interface BulkSelectionRow {
  id: string;
  horse: string;
  country: string;
  meeting: string;
  time: string;
}

export default function AdminSelectionsPage() {
  const { data: session } = useSession();
  const [selections, setSelections] = useState<Selection[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState<Selection | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main tab state (Manage Selections vs Manage Results)
  const [activeMainTab, setActiveMainTab] = useState<string>("selections");

  // Bulk entry state
  const [activeSystemTab, setActiveSystemTab] = useState<string>("");
  const [bulkEntryDates, setBulkEntryDates] = useState<Record<string, string>>(
    {}
  );
  const [bulkEntryRows, setBulkEntryRows] = useState<
    Record<string, BulkSelectionRow[]>
  >({});
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [isCsvUploading, setIsCsvUploading] = useState(false);

  // Results upload state
  const [isResultsUploading, setIsResultsUploading] = useState(false);

  // Unmatched selections notification state
  interface UnmatchedSelection {
    dateISO?: string;
    date?: string;
    time: string;
    horse: string;
    reason: string;
    systemId?: string;
    systemName?: string;
    row?: number;
  }
  const [unmatchedSelections, setUnmatchedSelections] = useState<
    UnmatchedSelection[]
  >([]);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm<SelectionFormData>({
    resolver: zodResolver(selectionFormSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setValueEdit,
  } = useForm<SelectionFormData>({
    resolver: zodResolver(selectionFormSchema),
  });

  const {
    register: registerResult,
    handleSubmit: handleSubmitResult,
    formState: { errors: errorsResult },
    reset: resetResult,
    setValue: setValueResult,
  } = useForm<ResultFormDataRaw>({
    resolver: zodResolver(resultFormSchema),
    mode: "onSubmit",
    shouldUnregister: false,
  });

  // Load unmatched selections from localStorage on mount
  useEffect(() => {
    const storedUnmatched = localStorage.getItem("admin_unmatched_selections");
    if (storedUnmatched) {
      try {
        const parsed = JSON.parse(storedUnmatched);
        setUnmatchedSelections(parsed);
      } catch (err) {
        console.error(
          "Error parsing unmatched selections from localStorage:",
          err
        );
        localStorage.removeItem("admin_unmatched_selections");
      }
    }
  }, []);

  // Fetch systems
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/performance/systems`);
        const data = await response.json();
        if (data.success && data.data) {
          setSystems(data.data);
          // Initialize bulk entry state for each system
          if (data.data.length > 0) {
            const initialDates: Record<string, string> = {};
            const initialRows: Record<string, BulkSelectionRow[]> = {};
            data.data.forEach((system: System) => {
              initialDates[system._id] = new Date().toISOString().split("T")[0];
              initialRows[system._id] = [];
            });
            setBulkEntryDates(initialDates);
            setBulkEntryRows(initialRows);
            setActiveSystemTab(data.data[0]._id);
          }
        }
      } catch (err) {
        console.error("Error fetching systems:", err);
        toast.error("Failed to load systems");
      }
    };
    fetchSystems();
  }, []);

  // Fetch selections with pagination
  const fetchSelections = async (reset = false) => {
    if (!session?.accessToken || !activeSystemTab) return;

    const currentOffset = reset ? 0 : offset;
    const isLoadingMore = !reset && currentOffset > 0;

    if (isLoadingMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams();
      params.append("systemId", activeSystemTab); // Filter by selected system
      params.append("limit", "50");
      params.append("offset", currentOffset.toString());
      params.append("sortBy", "rowOrder");
      params.append("sortOrder", "desc");

      const response = await fetch(
        `${apiUrl}/api/selections?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        if (reset) {
          setSelections(data.data || []);
          setOffset(0);
        } else {
          setSelections((prev) => [...prev, ...(data.data || [])]);
          setOffset(currentOffset + (data.data?.length || 0));
        }
        // Check if there are more results
        // If we got less than the limit, there are no more
        setHasMore((data.data?.length || 0) === 50);
      } else {
        toast.error(data.error || "Failed to load selections");
      }
    } catch (err) {
      console.error("Error fetching selections:", err);
      toast.error("Failed to load selections");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more selections
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    await fetchSelections(false);
  };

  useEffect(() => {
    if (session?.accessToken && activeSystemTab) {
      fetchSelections(true);
    }
  }, [session?.accessToken, activeSystemTab]);

  const onCreateSubmit = async (data: SelectionFormData) => {
    if (!session?.accessToken) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/api/selections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Selection created successfully");
        setCreateDialogOpen(false);
        resetCreate();
        fetchSelections(true); // Reset pagination
      } else {
        toast.error(result.error || "Failed to create selection");
      }
    } catch (err) {
      console.error("Error creating selection:", err);
      toast.error("Failed to create selection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEditSubmit = async (data: SelectionFormData) => {
    if (!session?.accessToken || !selectedSelection) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/selections/${selectedSelection._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Selection updated successfully");
        setEditDialogOpen(false);
        setSelectedSelection(null);
        resetEdit();
        fetchSelections(true); // Reset pagination
      } else {
        toast.error(result.error || "Failed to update selection");
      }
    } catch (err) {
      console.error("Error updating selection:", err);
      toast.error("Failed to update selection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!session?.accessToken || !selectedSelection) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/selections/${selectedSelection._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Selection deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedSelection(null);
        fetchSelections(true); // Reset pagination
      } else {
        toast.error(result.error || "Failed to delete selection");
      }
    } catch (err) {
      console.error("Error deleting selection:", err);
      toast.error("Failed to delete selection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (selection: Selection) => {
    setSelectedSelection(selection);
    setValueEdit("systemId", selection.systemId._id);
    setValueEdit("date", selection.dateISO);
    setValueEdit("country", selection.country || "");
    setValueEdit("meeting", selection.meeting || "");
    setValueEdit("time", selection.time || "");
    setValueEdit("horse", selection.horse);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (selection: Selection) => {
    setSelectedSelection(selection);
    setDeleteDialogOpen(true);
  };

  const openResultDialog = (selection: Selection) => {
    setSelectedSelection(selection);
    setValueResult("result", selection.result || "");
    setValueResult("winBsp", selection.winBsp || undefined);
    setValueResult("placeBsp", selection.placeBsp || undefined);
    setResultDialogOpen(true);
  };

  const onResultSubmit = async (dataRaw: ResultFormDataRaw) => {
    if (!session?.accessToken || !selectedSelection) return;

    // Convert string numbers to numbers and handle empty values
    const data: ResultFormData = {
      result: dataRaw.result,
      winBsp:
        dataRaw.winBsp === "" ||
        dataRaw.winBsp === null ||
        dataRaw.winBsp === undefined
          ? undefined
          : typeof dataRaw.winBsp === "string"
          ? isNaN(Number(dataRaw.winBsp))
            ? undefined
            : Number(dataRaw.winBsp)
          : dataRaw.winBsp,
      placeBsp:
        dataRaw.placeBsp === "" ||
        dataRaw.placeBsp === null ||
        dataRaw.placeBsp === undefined
          ? undefined
          : typeof dataRaw.placeBsp === "string"
          ? isNaN(Number(dataRaw.placeBsp))
            ? undefined
            : Number(dataRaw.placeBsp)
          : dataRaw.placeBsp,
    };

    // Placeholder function - log all relevant data
    console.log("=== Save Results - Function Called ===");
    console.log("Selection ID:", selectedSelection._id);
    console.log("Selection Data:", {
      _id: selectedSelection._id,
      systemId: selectedSelection.systemId._id,
      systemName: selectedSelection.systemId.name,
      dateISO: selectedSelection.dateISO,
      horse: selectedSelection.horse,
      meeting: selectedSelection.meeting,
      time: selectedSelection.time,
      country: selectedSelection.country,
    });
    console.log("Form Data (Result Params):", {
      result: data.result,
      winBsp: data.winBsp,
      placeBsp: data.placeBsp,
    });
    console.log(
      "API Endpoint:",
      `${apiUrl}/api/selections/${selectedSelection._id}/results`
    );
    console.log("Request Method:", "PUT");
    console.log("Request Headers:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken?.substring(0, 20)}...`,
    });
    console.log("Request Body:", JSON.stringify(data, null, 2));
    console.log("=====================================");

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/selections/${selectedSelection._id}/results`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        toast.success("Results updated successfully");
        setResultDialogOpen(false);
        setSelectedSelection(null);
        resetResult();
        fetchSelections(true); // Reset pagination
      } else {
        toast.error(result.error || "Failed to update results");
      }
    } catch (err) {
      console.error("Error updating results:", err);
      toast.error("Failed to update results");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bulk entry handlers
  const addBulkRow = (systemId: string) => {
    const newRow: BulkSelectionRow = {
      id: `row-${Date.now()}-${Math.random()}`,
      horse: "",
      country: "",
      meeting: "",
      time: "",
    };
    setBulkEntryRows((prev) => ({
      ...prev,
      [systemId]: [...(prev[systemId] || []), newRow],
    }));
  };

  const removeBulkRow = (systemId: string, rowId: string) => {
    setBulkEntryRows((prev) => ({
      ...prev,
      [systemId]: (prev[systemId] || []).filter((row) => row.id !== rowId),
    }));
  };

  const updateBulkRow = (
    systemId: string,
    rowId: string,
    field: keyof BulkSelectionRow,
    value: string
  ) => {
    setBulkEntryRows((prev) => ({
      ...prev,
      [systemId]: (prev[systemId] || []).map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      ),
    }));
  };

  const handleBulkSubmit = async (systemId: string) => {
    if (!session?.accessToken) return;

    const date = bulkEntryDates[systemId];
    const rows = bulkEntryRows[systemId] || [];

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (rows.length === 0) {
      toast.error("Please add at least one selection");
      return;
    }

    // Validate rows
    const invalidRows = rows.filter((row) => !row.horse.trim());
    if (invalidRows.length > 0) {
      toast.error("Please fill in the horse name for all selections");
      return;
    }

    setIsBulkSubmitting(true);
    try {
      const selections = rows.map((row) => ({
        systemId,
        date,
        horse: row.horse.trim(),
        country: row.country || undefined,
        meeting: row.meeting || undefined,
        time: row.time || undefined,
      }));

      const response = await fetch(`${apiUrl}/api/selections/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ selections }),
      });

      const result = await response.json();
      if (result.success) {
        const createdCount = result.created || selections.length;
        toast.success(`Successfully created ${createdCount} selection(s)`);
        // Clear rows for this system
        setBulkEntryRows((prev) => ({
          ...prev,
          [systemId]: [],
        }));
        // Refresh selections table
        fetchSelections(true); // Reset pagination
      } else {
        toast.error(result.error || "Failed to create selections");
      }
    } catch (err) {
      console.error("Error creating bulk selections:", err);
      toast.error("Failed to create selections");
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  const handleCsvUpload = async (
    systemId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!session?.accessToken) return;

    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      toast.error("Please upload a CSV file");
      return;
    }

    const date = bulkEntryDates[systemId];
    if (!date) {
      toast.error("Please select a date first");
      event.target.value = ""; // Reset file input
      return;
    }

    setIsCsvUploading(true);
    try {
      const formData = new FormData();
      formData.append("csv", file);
      formData.append("systemId", systemId);
      formData.append("date", date);
      console.log("formData", formData);

      const response = await fetch(`${apiUrl}/api/selections/upload-csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        const createdCount = result.created || 0;
        toast.success(
          `Successfully uploaded and created ${createdCount} selection(s) from CSV`
        );
        // Refresh selections table
        fetchSelections(true); // Reset pagination
      } else {
        toast.error(result.error || "Failed to upload CSV");
      }
    } catch (err) {
      console.error("Error uploading CSV:", err);
      toast.error("Failed to upload CSV");
    } finally {
      setIsCsvUploading(false);
      event.target.value = ""; // Reset file input
    }
  };

  const handleResultsCsvUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!session?.accessToken) return;

    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      toast.error("Please upload a CSV file");
      return;
    }

    setIsResultsUploading(true);
    try {
      const formData = new FormData();
      formData.append("csv", file);

      const response = await fetch(
        `${apiUrl}/api/selections/upload-results-csv`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log("result", result);
      if (result.success) {
        const updatedCount = result.updated || 0;
        toast.success(
          `Successfully uploaded and updated ${updatedCount} selection(s) with results`
        );

        // Store unmatched selections in localStorage and state
        if (result.unmatched && result.unmatched.length > 0) {
          // Save to localStorage for persistence
          localStorage.setItem(
            "admin_unmatched_selections",
            JSON.stringify(result.unmatched)
          );
          // Update state to show notification
          setUnmatchedSelections(result.unmatched);

          toast.error(
            `${result.unmatched.length} row(s) could not be matched to existing selections`,
            { duration: 5000 }
          );
        }
        if (result.errors && result.errors.length > 0) {
          toast.error(
            `${result.errors.length} row(s) had errors during processing`,
            { duration: 5000 }
          );
        }

        // Reset file input
        event.target.value = "";
        // Refresh selections table if we're on the selections tab
        if (activeMainTab === "selections") {
          fetchSelections(true); // Reset pagination
        }
      } else {
        toast.error(result.error || "Failed to upload results CSV");
      }
    } catch (err) {
      console.error("Error uploading results CSV:", err);
      toast.error("Failed to upload results CSV");
    } finally {
      setIsResultsUploading(false);
      event.target.value = ""; // Reset file input
    }
  };

  const handleDismissUnmatched = () => {
    setUnmatchedSelections([]);
    localStorage.removeItem("admin_unmatched_selections");
  };

  const columns: ColumnDef<Selection>[] = [
    {
      accessorKey: "dateISO",
      header: "Date",
    },
    {
      accessorKey: "systemId.name",
      header: "System",
      cell: ({ row }) => row.original.systemId.name,
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "meeting",
      header: "Meeting",
    },
    {
      accessorKey: "time",
      header: "Time",
    },
    {
      accessorKey: "horse",
      header: "Horse",
    },
    // {
    //   accessorKey: "isNew",
    //   header: "Status",
    //   cell: ({ row }) => (
    //     <span
    //       className={
    //         row.original.isNew ? "text-green font-semibold" : "text-gray-500"
    //       }
    //     >
    //       {row.original.isNew ? "New" : "Viewed"}
    //     </span>
    //   ),
    // },
    {
      accessorKey: "result",
      header: "Result",
      cell: ({ row }) => {
        // console.log("row", row);
        const result = row.getValue("result") as string;
        return (
          <span
            className={
              result === "LOST"
                ? "text-green font-semibold"
                : result === "WON"
                ? "text-red-600 font-semibold"
                : result === "NR" || result === "VOID" || result === "CANCELLED"
                ? "text-yellow-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {result}
          </span>
        );
      },
    },
    {
      accessorKey: "winBsp",
      header: "Win BSP",
      cell: ({ row }) => (
        <span className={row.original.hasResult ? "" : "text-gray-400"}>
          {row.original.winBsp ? row.original.winBsp.toFixed(2) : "-"}
        </span>
      ),
    },
    {
      accessorKey: "winPL",
      header: "Win PL",
      cell: ({ row }) => (
        <span
          className={
            row.original.hasResult
              ? row.original.winPL && row.original.winPL >= 0
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
              : "text-gray-400"
          }
        >
          {row.original.winPL !== undefined
            ? formatCurrency(row.original.winPL)
            : "-"}
        </span>
      ),
    },
    {
      accessorKey: "runningWinPL",
      header: "Running Win PL",
      cell: ({ row }) => (
        <span
          className={
            row.original.hasResult
              ? row.original.runningWinPL && row.original.runningWinPL >= 0
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
              : "text-gray-400"
          }
        >
          {row.original.runningWinPL !== undefined
            ? formatCurrency(row.original.runningWinPL)
            : "-"}
        </span>
      ),
    },
    // {
    //   accessorKey: "placeBsp",
    //   header: "Place BSP",
    //   cell: ({ row }) => (
    //     <span className={row.original.hasResult ? "" : "text-gray-400"}>
    //       {row.original.placeBsp ? row.original.placeBsp.toFixed(2) : "-"}
    //     </span>
    //   ),
    // },
    // {
    //   accessorKey: "placePL",
    //   header: "Place PL",
    //   cell: ({ row }) => (
    //     <span
    //       className={
    //         row.original.hasResult
    //           ? row.original.placePL && row.original.placePL >= 0
    //             ? "text-green-600 font-semibold"
    //             : "text-red-600 font-semibold"
    //           : "text-gray-400"
    //       }
    //     >
    //       {row.original.placePL !== undefined
    //         ? row.original.placePL.toFixed(2)
    //         : "-"}
    //     </span>
    //   ),
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditDialog(row.original)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openResultDialog(row.original)}
            className={
              row.original.hasResult
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : ""
            }
            title={row.original.hasResult ? "Edit Results" : "Add Results"}
          >
            {row.original.hasResult ? "Edit Results" : "Add Results"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeleteDialog(row.original)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: selections,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Unmatched Selections Notification */}
      {unmatchedSelections.length > 0 && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-1">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                  {unmatchedSelections.length} Unmatched Selection
                  {unmatchedSelections.length !== 1 ? "s" : ""} Found
                </h3>
                <p className="text-xs text-yellow-800 mb-3">
                  The following selections could not be matched to rows in the
                  uploaded CSV:
                </p>
                <div className="max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {unmatchedSelections.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white border border-yellow-200 rounded p-2 text-xs"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {item.horse}
                            </p>
                            <p className="text-gray-600 mt-1">
                              {item.dateISO || item.date} at {item.time}
                              {item.systemName && (
                                <span className="ml-2 text-gray-500">
                                  ({item.systemName})
                                </span>
                              )}
                            </p>
                            {item.reason && (
                              <p className="text-gray-500 mt-1 italic">
                                {item.reason}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDismissUnmatched}
              className="ml-4 text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100 flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark-navy mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage selections and upload results</p>
      </div>

      {/* Main Tabs */}
      <Tabs
        value={activeMainTab}
        onValueChange={setActiveMainTab}
        className="w-full mb-6"
      >
        <TabsList className="bg-cream/50 border border-gray-200 mb-6">
          <TabsTrigger
            value="selections"
            className="data-[state=active]:bg-gold data-[state=active]:text-dark-navy cursor-pointer"
          >
            Manage Selections
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="data-[state=active]:bg-gold data-[state=active]:text-dark-navy cursor-pointer"
          >
            Manage Results
          </TabsTrigger>
        </TabsList>

        {/* Manage Selections Tab */}
        <TabsContent value="selections" className="space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-dark-navy">
                Manage Selections
              </h2>
              <p className="text-gray-600 mt-1">
                Create, update, and delete daily selections
              </p>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Single Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Selection</DialogTitle>
                  <DialogDescription>
                    Add a new selection to the system.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitCreate(onCreateSubmit)}>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="systemId">System *</Label>
                      <select
                        id="systemId"
                        {...registerCreate("systemId")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      >
                        <option value="">Select a system</option>
                        {systems.map((system) => (
                          <option key={system._id} value={system._id}>
                            {system.name}
                          </option>
                        ))}
                      </select>
                      {errorsCreate.systemId && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsCreate.systemId.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        {...registerCreate("date")}
                      />
                      {errorsCreate.date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsCreate.date.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <select
                        id="country"
                        {...registerCreate("country")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      >
                        <option value="">Select a country</option>
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="meeting">Meeting</Label>
                      <select
                        id="meeting"
                        {...registerCreate("meeting")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                      >
                        <option value="">Select a meeting</option>
                        {MEETINGS.map((meeting) => (
                          <option key={meeting} value={meeting}>
                            {meeting}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        {...registerCreate("time")}
                        placeholder="12:45"
                      />
                    </div>
                    <div>
                      <Label htmlFor="horse">Horse *</Label>
                      <Input
                        id="horse"
                        {...registerCreate("horse")}
                        placeholder="Ronnies Reflection"
                      />
                      {errorsCreate.horse && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsCreate.horse.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCreateDialogOpen(false);
                        resetCreate();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Bulk Entry Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-dark-navy mb-2">
                Bulk Entry - Daily Selections
              </h2>
              <p className="text-sm text-gray-600">
                Select a system and date, then add multiple selections at once.
                You can either manually add rows or upload a CSV file.
              </p>
              <p className="text-xs text-gray-500 mt-1"></p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4 mb-6">
                <p className="text-sm font-semibold text-blue-900">
                  Upload exactly the same CSV as xCloudBot without editing it.
                </p>
              </div>
            </div>

            {systems.length > 0 && (
              <Tabs
                value={activeSystemTab}
                onValueChange={setActiveSystemTab}
                className="w-full"
              >
                <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0 scrollbar-hide mb-4">
                  <TabsList className="bg-cream/50 border border-gray-200 inline-flex flex-nowrap w-auto min-w-full sm:min-w-0 sm:justify-center justify-start">
                    {systems.map((system) => (
                      <TabsTrigger
                        key={system._id}
                        value={system._id}
                        className="data-[state=active]:bg-gold data-[state=active]:text-dark-navy cursor-pointer whitespace-nowrap flex-shrink-0"
                      >
                        {system.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {systems.map((system) => (
                  <TabsContent key={system._id} value={system._id}>
                    <div className="space-y-4">
                      {/* Date Picker */}
                      <div className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b border-gray-200">
                        <div className="flex-1">
                          <Label htmlFor={`date-${system._id}`}>Date *</Label>
                          <Input
                            id={`date-${system._id}`}
                            type="date"
                            value={bulkEntryDates[system._id] || ""}
                            onChange={(e) =>
                              setBulkEntryDates((prev) => ({
                                ...prev,
                                [system._id]: e.target.value,
                              }))
                            }
                            className="mt-1"
                          />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end gap-2">
                          <div className="relative">
                            <Input
                              type="file"
                              accept=".csv,text/csv"
                              onChange={(e) => handleCsvUpload(system._id, e)}
                              disabled={isCsvUploading}
                              className="hidden"
                              id={`csv-upload-${system._id}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const input = document.getElementById(
                                  `csv-upload-${system._id}`
                                ) as HTMLInputElement;
                                input?.click();
                              }}
                              disabled={
                                isCsvUploading || !bulkEntryDates[system._id]
                              }
                              className="mt-6 w-full md:w-auto"
                            >
                              {isCsvUploading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload CSV
                                </>
                              )}
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => addBulkRow(system._id)}
                            className=""
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Row
                          </Button>
                        </div>
                      </div>

                      {/* Bulk Entry Table */}
                      {bulkEntryRows[system._id]?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-3 text-sm font-semibold text-dark-navy">
                                  Horse *
                                </th>
                                <th className="text-left py-2 px-3 text-sm font-semibold text-dark-navy">
                                  Country
                                </th>
                                <th className="text-left py-2 px-3 text-sm font-semibold text-dark-navy">
                                  Meeting
                                </th>
                                <th className="text-left py-2 px-3 text-sm font-semibold text-dark-navy">
                                  Time
                                </th>
                                <th className="text-left py-2 px-3 text-sm font-semibold text-dark-navy w-20">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {bulkEntryRows[system._id].map((row) => (
                                <tr
                                  key={row.id}
                                  className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                  <td className="py-2 px-3">
                                    <Input
                                      value={row.horse}
                                      onChange={(e) =>
                                        updateBulkRow(
                                          system._id,
                                          row.id,
                                          "horse",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Horse name"
                                      className={
                                        !row.horse.trim()
                                          ? "border-red-300"
                                          : ""
                                      }
                                    />
                                  </td>
                                  <td className="py-2 px-3">
                                    <select
                                      value={row.country}
                                      onChange={(e) =>
                                        updateBulkRow(
                                          system._id,
                                          row.id,
                                          "country",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                                    >
                                      <option value="">Select country</option>
                                      {COUNTRIES.map((country) => (
                                        <option key={country} value={country}>
                                          {country}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="py-2 px-3">
                                    <select
                                      value={row.meeting}
                                      onChange={(e) =>
                                        updateBulkRow(
                                          system._id,
                                          row.id,
                                          "meeting",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                                    >
                                      <option value="">Select meeting</option>
                                      {MEETINGS.map((meeting) => (
                                        <option key={meeting} value={meeting}>
                                          {meeting}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="py-2 px-3">
                                    <Input
                                      value={row.time}
                                      onChange={(e) =>
                                        updateBulkRow(
                                          system._id,
                                          row.id,
                                          "time",
                                          e.target.value
                                        )
                                      }
                                      placeholder="12:45"
                                      className="text-sm"
                                    />
                                  </td>
                                  <td className="py-2 px-3">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        removeBulkRow(system._id, row.id)
                                      }
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                          <p>No selections added yet.</p>
                          <p className="text-sm mt-1">
                            Click &quot;Add Row&quot; to start entering
                            selections
                          </p>
                        </div>
                      )}

                      {/* Submit Button */}
                      {bulkEntryRows[system._id]?.length > 0 && (
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                              {bulkEntryRows[system._id].length} selection(s)
                              ready to submit
                            </span>
                            <Button
                              onClick={() => handleBulkSubmit(system._id)}
                              disabled={
                                isBulkSubmitting || !bulkEntryDates[system._id]
                              }
                            >
                              {isBulkSubmitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Submit All
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Selection</DialogTitle>
                <DialogDescription>
                  Update the selection details.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitEdit(onEditSubmit)}>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="edit-systemId">System *</Label>
                    <select
                      id="edit-systemId"
                      {...registerEdit("systemId")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="">Select a system</option>
                      {systems.map((system) => (
                        <option key={system._id} value={system._id}>
                          {system.name}
                        </option>
                      ))}
                    </select>
                    {errorsEdit.systemId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsEdit.systemId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="edit-date">Date *</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      {...registerEdit("date")}
                    />
                    {errorsEdit.date && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsEdit.date.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="edit-country">Country</Label>
                    <select
                      id="edit-country"
                      {...registerEdit("country")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="">Select a country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="edit-meeting">Meeting</Label>
                    <select
                      id="edit-meeting"
                      {...registerEdit("meeting")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="">Select a meeting</option>
                      {MEETINGS.map((meeting) => (
                        <option key={meeting} value={meeting}>
                          {meeting}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="edit-time">Time</Label>
                    <Input
                      id="edit-time"
                      {...registerEdit("time")}
                      placeholder="12:45"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-horse">Horse *</Label>
                    <Input
                      id="edit-horse"
                      {...registerEdit("horse")}
                      placeholder="Ronnies Reflection"
                    />
                    {errorsEdit.horse && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsEdit.horse.message}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditDialogOpen(false);
                      setSelectedSelection(null);
                      resetEdit();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Selection</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this selection? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              {selectedSelection && (
                <div className="py-4">
                  <p className="text-sm text-gray-600">
                    <strong>Date:</strong> {selectedSelection.dateISO}
                    <br />
                    <strong>System:</strong> {selectedSelection.systemId.name}
                    <br />
                    <strong>Horse:</strong> {selectedSelection.horse}
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setSelectedSelection(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Result Dialog */}
          <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedSelection?.hasResult
                    ? "Edit Results"
                    : "Add Results"}
                </DialogTitle>
                <DialogDescription>
                  {selectedSelection && (
                    <>
                      Update results for{" "}
                      <strong>{selectedSelection.horse}</strong> on{" "}
                      {selectedSelection.dateISO}
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitResult(onResultSubmit)} noValidate>
                <div className="space-y-4 py-4">
                  {selectedSelection && (
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>System:</strong>{" "}
                        {selectedSelection.systemId.name}
                        <br />
                        <strong>Meeting:</strong>{" "}
                        {selectedSelection.meeting || "N/A"}
                        <br />
                        <strong>Time:</strong> {selectedSelection.time || "N/A"}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="result">Result *</Label>
                    <select
                      id="result"
                      {...registerResult("result")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold mt-1"
                    >
                      <option value="">Select result</option>
                      <option value="WON">WON</option>
                      <option value="LOST">LOST</option>
                      <option value="NR">NR</option>
                      <option value="VOID">VOID</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    {errorsResult.result && (
                      <p className="text-red-500 text-sm mt-1">
                        {errorsResult.result.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="winBsp">Win BSP (Optional)</Label>
                      <Input
                        id="winBsp"
                        type="number"
                        step="0.01"
                        {...registerResult("winBsp", {
                          setValueAs: (v) => {
                            if (
                              v === "" ||
                              v === null ||
                              v === undefined ||
                              v === "0.00" ||
                              v === 0
                            ) {
                              return undefined;
                            }
                            return v;
                          },
                        })}
                        placeholder="0.00"
                        className="mt-1"
                      />
                      {errorsResult.winBsp && (
                        <p className="text-red-500 text-sm mt-1">
                          {String(
                            errorsResult.winBsp.message || "Invalid input"
                          )}
                        </p>
                      )}
                    </div>
                    {/* <div>
                      <Label htmlFor="placeBsp">Place BSP (Optional)</Label>
                      <Input
                        id="placeBsp"
                        type="number"
                        step="0.01"
                        {...registerResult("placeBsp", {
                          setValueAs: (v) => {
                            // Convert empty, null, undefined, 0, or "0.00" to undefined
                            if (
                              v === "" ||
                              v === null ||
                              v === undefined ||
                              v === "0.00" ||
                              v === 0 ||
                              (typeof v === "string" && v.trim() === "")
                            ) {
                              return undefined;
                            }
                            // Convert string numbers to actual numbers
                            if (typeof v === "string") {
                              const num = Number(v);
                              return isNaN(num) ? undefined : num;
                            }
                            return v;
                          },
                          required: false,
                        })}
                        placeholder="0.00"
                        className="mt-1"
                      />
                      {errorsResult.placeBsp && (
                        <p className="text-red-500 text-sm mt-1">
                          {typeof errorsResult.placeBsp === "object" &&
                          "message" in errorsResult.placeBsp
                            ? String(errorsResult.placeBsp.message)
                            : "Invalid input"}
                        </p>
                      )}
                    </div> */}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Win PL and Running Win PL will be
                      calculated automatically on the backend.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setResultDialogOpen(false);
                      setSelectedSelection(null);
                      resetResult();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Results"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Selections Table */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-dark-navy mb-2">
                Selections Table
              </h2>
              {activeSystemTab && systems.length > 0 && (
                <p className="text-sm text-gray-600">
                  Showing selections for:{" "}
                  <span className="font-semibold text-dark-navy">
                    {systems.find((s) => s._id === activeSystemTab)?.name ||
                      "All Systems"}
                  </span>
                </p>
              )}
            </div>
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-600 mt-4">Loading selections...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (
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
                      {table.getRowModel().rows.map((row) => (
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
                {selections.length === 0 && !loading && (
                  <div className="text-center py-12 text-dark-navy">
                    No selections found. Create your first selection above.
                  </div>
                )}

                {hasMore && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="default"
                      size="lg"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More Selections"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* Manage Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-dark-navy mb-2">
                Upload Results CSV
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Upload a CSV file to update results for existing selections
                across all systems. The CSV will match selections by date, time,
                and horse name.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <p className="text-sm font-semibold text-blue-900">
                  Upload exactly the same CSV as RBD without editing it.
                </p>
                {/* <ul className="text-xs text-blue-800 list-disc list-inside space-y-1">
                  <li>Date of Race (format: DD/MM/YYYY)</li>
                  <li>Country</li>
                  <li>Track</li>
                  <li>Time</li>
                  <li>Horse</li>
                  <li>Betfair SP</li>
                  <li>Betfair Lay Return</li>
                  <li>Betfair Place SP</li>
                  <li>Place Lay Return</li>
                </ul> */}
              </div>
            </div>

            <div className="space-y-4">
              {/* CSV Upload */}
              <div>
                <Label htmlFor="results-csv-upload">CSV File *</Label>
                <div className="mt-1">
                  <Input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleResultsCsvUpload}
                    disabled={isResultsUploading}
                    id="results-csv-upload"
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload a CSV file with the results data. The file will be
                  processed to match existing selections across all systems.
                </p>
              </div>

              {/* Upload Button */}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById(
                      "results-csv-upload"
                    ) as HTMLInputElement;
                    input?.click();
                  }}
                  disabled={isResultsUploading}
                  className="w-full sm:w-auto"
                >
                  {isResultsUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading and Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Results CSV
                    </>
                  )}
                </Button>
              </div>

              {/* Info Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> The system will match each row in your
                  CSV to existing selections across all systems based on:
                </p>
                <ul className="text-xs text-gray-600 list-disc list-inside mt-2 space-y-1">
                  <li>Date of Race (converted to ISO format)</li>
                  <li>Time</li>
                  <li>Horse name</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  Rows that cannot be matched will be reported after upload.
                  Results will be calculated automatically based on Betfair SP
                  and Lay Return values.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
