import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { User, Phone, Calendar, Package } from "lucide-react";

// Reuse types from parent or define shared types
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

interface Order {
    order_number: string;
    user_name: string;
    phone_number: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    created_at: string;
}

interface OrderDetailsModalProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const statusBadgeTone: Record<OrderStatus, string> = {
    confirmed: "bg-blue-100 text-blue-900 border-blue-200",
    preparing: "bg-amber-100 text-amber-900 border-amber-200",
    ready: "bg-emerald-100 text-emerald-900 border-emerald-200",
    out_for_delivery: "bg-cyan-100 text-cyan-900 border-cyan-200",
    delivered: "bg-lime-100 text-lime-900 border-lime-200",
    cancelled: "bg-rose-100 text-rose-900 border-rose-200",
};

export function OrderDetailsModal({
    order,
    open,
    onOpenChange,
}: OrderDetailsModalProps) {
    if (!order) return null;

    const currency = (value: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            value || 0
        );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl overflow-hidden p-0">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <DialogTitle className="text-lg font-bold">
                                Order #{order.order_number}
                            </DialogTitle>
                            <Badge
                                variant="outline"
                                className={`capitalize ${statusBadgeTone[order.status]}`}
                            >
                                {order.status.replace(/_/g, " ")}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(order.created_at)}
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 p-6 md:grid-cols-2">
                    {/* Customer Details */}
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 font-semibold">
                            <User className="h-4 w-4" /> Customer Details
                        </h3>
                        <div className="rounded-lg border bg-slate-50 p-4 text-sm">
                            <div className="grid grid-cols-[80px_1fr] gap-2">
                                <span className="text-muted-foreground">Name:</span>
                                <span className="font-medium">{order.user_name}</span>

                                <span className="text-muted-foreground">Phone:</span>
                                <div className="flex items-center gap-1 font-medium">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    {order.phone_number}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 font-semibold">
                            <Package className="h-4 w-4" /> Order Summary
                        </h3>
                        <div className="rounded-lg border bg-slate-50 p-4 text-sm">
                            <div className="grid grid-cols-[80px_1fr] gap-2">
                                <span className="text-muted-foreground">Items:</span>
                                <span className="font-medium">{order.items.reduce((acc, item) => acc + item.quantity, 0)} items</span>

                                <span className="text-muted-foreground">Total:</span>
                                <span className="text-lg font-bold text-emerald-600">{currency(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <h3 className="mb-4 font-semibold">Order Items</h3>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead className="w-[50%]">Item</TableHead>
                                    <TableHead className="text-center">Qty</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right">{currency(item.price)}</TableCell>
                                        <TableCell className="text-right font-medium">{currency(item.subtotal)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <div className="space-y-1 text-right">
                            <div className="text-sm text-muted-foreground">Total Amount</div>
                            <div className="text-2xl font-bold">{currency(order.total)}</div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
