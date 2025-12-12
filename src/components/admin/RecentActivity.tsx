import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, CheckCircle, Clock, Truck, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Re-using Order type for simplicity, or defining a subset
interface ActivityOrder {
    order_number: string;
    user_name: string;
    status: string;
    created_at: string;
    total: number;
}

interface RecentActivityProps {
    orders: ActivityOrder[];
}

const statusConfig: Record<string, { icon: any; color: string; text: string }> = {
    confirmed: { icon: ShoppingBag, color: "bg-blue-100 text-blue-600", text: "Order confirmed" },
    preparing: { icon: Clock, color: "bg-amber-100 text-amber-600", text: " preparing" },
    ready: { icon: CheckCircle, color: "bg-emerald-100 text-emerald-600", text: "Order ready" },
    out_for_delivery: { icon: Truck, color: "bg-cyan-100 text-cyan-600", text: "Out for delivery" },
    delivered: { icon: CheckCircle, color: "bg-lime-100 text-lime-600", text: "Delivered" },
    cancelled: { icon: XCircle, color: "bg-rose-100 text-rose-600", text: "Order cancelled" },
};

export function RecentActivity({ orders }: RecentActivityProps) {
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <Card className="col-span-full mb-8 border-0 shadow-sm lg:col-span-6">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {orders.slice(0, 5).map((order, index) => {
                        const config = statusConfig[order.status] || { icon: AlertCircle, color: "bg-gray-100", text: order.status };
                        const Icon = config.icon;

                        return (
                            <div key={index} className="flex">
                                <div className={cn("mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full", config.color)}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none text-foreground">
                                        {config.text} #{order.order_number}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.user_name} - ${order.total}
                                    </p>
                                    <p className="text-xs text-muted-foreground pt-1">
                                        {timeAgo(order.created_at)}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    {orders.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground">No recent activity.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
