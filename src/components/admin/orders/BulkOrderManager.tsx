import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrdersTable, Order } from "./OrdersTable";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface BulkOrderManagerProps {
    onOrderClick: (order: Order) => void;
}

export function BulkOrderManager({ onOrderClick }: BulkOrderManagerProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [targetStatus, setTargetStatus] = useState<string>("");

    // Reusing the general orders query, but maybe we want specific filtering later
    // For now fetch recent orders
    const ordersQuery = useQuery({
        queryKey: ["orders-bulk"],
        queryFn: async () => {
            // Fetching 100 most recent for management
            const res = await api.get("/api/v1/orders", { params: { limit: 100 } });
            return res.data.orders as Order[];
        },
    });

    const bulkUpdateMutation = useMutation({
        mutationFn: async () => {
            if (!targetStatus) throw new Error("No status selected");
            const res = await api.post("/api/v1/orders/bulk/status-update", {
                order_numbers: selectedIds,
                status_update: { status: targetStatus },
            });
            return res.data;
        },
        onSuccess: (data) => {
            toast({
                title: "Bulk update successful",
                description: data.message,
            });
            setSelectedIds([]);
            setTargetStatus("");
            queryClient.invalidateQueries({ queryKey: ["orders-bulk"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] }); // sync main list
            queryClient.invalidateQueries({ queryKey: ["active-orders"] }); // sync active list
            queryClient.invalidateQueries({ queryKey: ["order-stats"] });
        },
        onError: () => {
            toast({ title: "Bulk update failed", variant: "destructive" });
        },
    });

    const singleStatusMutation = useMutation({
        mutationFn: async (payload: { orderNumber: string; status: string }) => {
            await api.put(`/api/v1/orders/${payload.orderNumber}/status`, {
                status: payload.status,
            });
        },
        onSuccess: () => {
            toast({ title: "Order status updated" });
            queryClient.invalidateQueries({ queryKey: ["orders-bulk"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });

    if (ordersQuery.isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 relative pb-20">
            <h1 className="text-2xl font-bold tracking-tight">Bulk Update</h1>

            <OrdersTable
                orders={ordersQuery.data || []}
                onOrderClick={onOrderClick}
                onStatusChange={(id, status) =>
                    singleStatusMutation.mutate({ orderNumber: id, status })
                }
                selectable
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
            />

            {/* Sticky Action Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-lg border bg-white p-4 shadow-lg animate-in slide-in-from-bottom-4">
                    <span className="font-medium">{selectedIds.length} orders selected</span>
                    <div className="h-6 w-px bg-border" />
                    <Select value={targetStatus} onValueChange={setTargetStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Change status to..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="out_for_delivery">Out for delivery</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={() => bulkUpdateMutation.mutate()}
                        disabled={!targetStatus || bulkUpdateMutation.isPending}
                    >
                        {bulkUpdateMutation.isPending ? "Updating..." : "Apply Change"}
                    </Button>
                </div>
            )}
        </div>
    );
}
