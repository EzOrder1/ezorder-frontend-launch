import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Types derived or shared
type OrderStatus =
    | "confirmed"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface Order {
    order_number: string;
    user_name: string;
    phone_number: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    created_at: string;
}

interface OrdersTableProps {
    orders: Order[];
    onOrderClick: (order: Order) => void;
    onStatusChange: (orderNumber: string, status: OrderStatus) => void;
    selectable?: boolean;
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
}

const orderStatusOptions: { value: OrderStatus; label: string }[] = [
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "ready", label: "Ready" },
    { value: "out_for_delivery", label: "Out for delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

const statusBadgeTone: Record<OrderStatus, string> = {
    confirmed: "bg-blue-100 text-blue-900",
    preparing: "bg-amber-100 text-amber-900",
    ready: "bg-emerald-100 text-emerald-900",
    out_for_delivery: "bg-cyan-100 text-cyan-900",
    delivered: "bg-lime-100 text-lime-900",
    cancelled: "bg-rose-100 text-rose-900",
};

export function OrdersTable({
    orders,
    onOrderClick,
    onStatusChange,
    selectable = false,
    selectedIds = [],
    onSelectionChange,
}: OrdersTableProps) {
    const currency = (value: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            value || 0
        );

    const handleSelectAll = (checked: boolean) => {
        if (onSelectionChange) {
            if (checked) {
                onSelectionChange(orders.map((o) => o.order_number));
            } else {
                onSelectionChange([]);
            }
        }
    };

    const handleSelectOne = (checked: boolean, id: string) => {
        if (onSelectionChange) {
            if (checked) {
                onSelectionChange([...selectedIds, id]);
            } else {
                onSelectionChange(selectedIds.filter((sid) => sid !== id));
            }
        }
    };

    const allSelected = orders.length > 0 && selectedIds.length === orders.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < orders.length;

    return (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            {selectable && (
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={allSelected || (someSelected ? "indeterminate" : false)}
                                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                    />
                                </TableHead>
                            )}
                            <TableHead>Order #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={selectable ? 6 : 5}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow
                                    key={order.order_number}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onOrderClick(order)}
                                >
                                    {selectable && (
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedIds.includes(order.order_number)}
                                                onCheckedChange={(checked) =>
                                                    handleSelectOne(!!checked, order.order_number)
                                                }
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell className="font-medium text-emerald-600">
                                        {order.order_number}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.user_name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {order.phone_number}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {currency(order.total)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn(
                                                "font-semibold capitalize shadow-none",
                                                statusBadgeTone[order.status]
                                            )}
                                        >
                                            {order.status.replace(/_/g, " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Select
                                            value={order.status}
                                            onValueChange={(value: OrderStatus) =>
                                                onStatusChange(order.order_number, value)
                                            }
                                        >
                                            <SelectTrigger className="w-[140px] h-8 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {orderStatusOptions.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
