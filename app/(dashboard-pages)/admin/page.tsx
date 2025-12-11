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
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

const COUNTRIES = ["GB", "IRE"];

const MEETINGS = [
  "AINTREE",
  "ASCOT",
  "AYR",
  "BALLINROBE",
  "BANGOR-ON-DEE",
  "BATH",
  "BELLEWSTOWN",
  "BEVERLEY",
  "BRIGHTON",
  "CARLISLE",
  "CARTMEL",
  "CATTERICK",
  "CHELMSFORD CITY",
  "CHELTENHAM",
  "CHEPSTOW",
  "CHESTER",
  "CLONMEL",
  "CORK",
  "CURRAGH",
  "DONCASTER",
  "DOWN ROYAL",
  "DOWNPATRICK",
  "DUNDALK",
  "EPSOM",
  "EXETER",
  "FAIRYHOUSE",
  "FAKENHAM",
  "FFOS LAS",
  "FONTWELL",
  "GALWAY",
  "GOODWOOD",
  "GOWRAN PARK",
  "HAMILTON",
  "HAYDOCK",
  "HEXHAM",
  "HEREFORD",
  "HUNTINGDON",
  "KELSO",
  "KEMPTON",
  "KILBEGGAN",
  "KILLARNEY",
  "LAYTOWN",
  "LEICESTER",
  "LEOPARDSTOWN",
  "LIMERICK",
  "LINGFIELD",
  "LISTOWEL",
  "LUDLOW",
  "MARKET RASEN",
  "MUSSELBURGH",
  "NAAS",
  "NAVAN",
  "NEWBURY",
  "NEWCASTLE",
  "NEWMARKET",
  "NEWTON ABBOT",
  "NOTTINGHAM",
  "PERTH",
  "PLUMPTON",
  "PONTEFRACT",
  "PUNCHESTOWN",
  "REDCAR",
  "RIPON",
  "ROSCOMMON",
  "SALISBURY",
  "SANDOWN",
  "SEDGEFIELD",
  "SLIGO",
  "SOUTHWELL",
  "STRATFORD",
  "TAUNTON",
  "THIRSK",
  "TIPPERARY",
  "TRAMORE",
  "UTTOXETER",
  "WARWICK",
  "WETHERBY",
  "WEXFORD",
  "WINCANTON",
  "WINDSOR",
  "WOLVERHAMPTON",
  "WORCESTER",
  "YARMOUTH",
  "YORK",
];

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

export default function AdminSelectionsPage() {
  const { data: session } = useSession();
  const [selections, setSelections] = useState<Selection[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState<Selection | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        toast.error("Failed to load systems");
      }
    };
    fetchSystems();
  }, []);

  // Fetch selections
  const fetchSelections = async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/selections`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setSelections(data.data || []);
      } else {
        toast.error(data.error || "Failed to load selections");
      }
    } catch (err) {
      console.error("Error fetching selections:", err);
      toast.error("Failed to load selections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchSelections();
    }
  }, [session?.accessToken]);

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
        fetchSelections();
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
        fetchSelections();
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
        fetchSelections();
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
    {
      accessorKey: "isNew",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={
            row.original.isNew ? "text-green font-semibold" : "text-gray-500"
          }
        >
          {row.original.isNew ? "New" : "Viewed"}
        </span>
      ),
    },
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark-navy">
            Manage Selections
          </h1>
          <p className="text-gray-600 mt-1">
            Create, update, and delete daily selections
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Selection
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
                  <Input id="date" type="date" {...registerCreate("date")} />
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
              <DialogFooter>
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Selection</DialogTitle>
            <DialogDescription>Update the selection details.</DialogDescription>
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
                <Input id="edit-date" type="date" {...registerEdit("date")} />
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
              Are you sure you want to delete this selection? This action cannot
              be undone.
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

      {/* Selections Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
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
          </>
        )}
      </div>
    </div>
  );
}
