import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, ShoppingBag, Users, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
}

export function DashboardStats({
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
}: DashboardStatsProps) {
    const currency = (value: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            value || 0
        );

    const stats = [
        {
            label: "Revenue",
            value: currency(totalRevenue),
            icon: DollarSign,
            color: "bg-emerald-500",
            description: "Total revenue",
        },
        {
            label: "Orders",
            value: totalOrders.toString(),
            icon: ShoppingBag,
            color: "bg-purple-500",
            description: "Total orders processed",
        },
        {
            label: "Customers",
            value: totalCustomers.toString(),
            icon: Users,
            color: "bg-blue-500",
            description: "Unique customers (recent)",
        },
        {
            label: "Products",
            value: totalProducts.toString(),
            icon: ChefHat,
            color: "bg-orange-500",
            description: "Active menu items",
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className={cn("border-0 text-white", stat.color)}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                                    <p className="mt-1 text-sm font-medium uppercase opacity-90">
                                        {stat.label}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white/20 p-2">
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm font-medium">
                                <span className="opacity-80">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
