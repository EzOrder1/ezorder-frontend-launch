import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrdersTable, Order } from "./OrdersTable";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ActiveOrdersProps {
    onOrderClick: (order: Order) => void;
}

export function ActiveOrders({ onOrderClick }: ActiveOrdersProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const activeOrdersQuery = useQuery({
        queryKey: ["active-orders"],
        queryFn: async () => {
            const res = await api.get("/api/v1/orders/active");
            return res.data as Order[];
        },
        refetchInterval: 15000, // Auto-refresh every 15s for kitchen view
    });

    const orderStatusMutation = useMutation({
        mutationFn: async (payload: { orderNumber: string; status: string }) => {
            await api.put(`/api/v1/orders/${payload.orderNumber}/status`, {
                status: payload.status,
            });
        },
        onSuccess: () => {
            toast({ title: "Order status updated" });
            queryClient.invalidateQueries({ queryKey: ["active-orders"] });
            // Invalidate main orders too so everything stays in sync
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order-stats"] });
        },
        onError: () => {
            toast({ title: "Failed to update status", variant: "destructive" });
        }
    });

    if (activeOrdersQuery.isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Active Orders</h1>
                <span className="text-sm text-muted-foreground">
                    Auto-refreshing every 15s
                </span>
            </div>

            <OrdersTable
                orders={activeOrdersQuery.data || []}
                onOrderClick={onOrderClick}
                onStatusChange={(id, status) =>
                    orderStatusMutation.mutate({ orderNumber: id, status })
                }
            />
        </div>
    );
}
