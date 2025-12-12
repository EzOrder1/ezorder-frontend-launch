import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    status: string;
    created_at: string;
}

interface CustomerListProps {
    orders: Order[];
}

interface CustomerStats {
    name: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    status: "Active" | "Inactive"; // Simple logic: Active if order in last 30 days
}

export function CustomerList({ orders }: CustomerListProps) {
    const currency = (value: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            value || 0
        );

    const customers = useMemo(() => {
        const customerMap = new Map<string, CustomerStats>();

        orders.forEach(order => {
            const current = customerMap.get(order.phone_number) || {
                name: order.user_name,
                phone: order.phone_number,
                totalOrders: 0,
                totalSpent: 0,
                lastOrderDate: order.created_at,
                status: "Inactive"
            };

            // Update stats
            current.totalOrders += 1;
            current.totalSpent += order.total;

            // Keep most recent name
            current.name = order.user_name;

            // Update last order date if this one is newer
            if (new Date(order.created_at) > new Date(current.lastOrderDate)) {
                current.lastOrderDate = order.created_at;
            }

            customerMap.set(order.phone_number, current);
        });

        // Determine status (Active = ordered in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return Array.from(customerMap.values()).map(c => ({
            ...c,
            status: new Date(c.lastOrderDate) > thirtyDaysAgo ? "Active" : "Inactive"
        })).sort((a, b) => b.totalSpent - a.totalSpent); // Sort by highest spender

    }, [orders]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Customers</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Customer Database ({customers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead className="text-center">Total Orders</TableHead>
                                <TableHead className="text-right">Total Spent</TableHead>
                                <TableHead className="text-right">Last Order</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No customer data found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow key={customer.phone}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {customer.name.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium">{customer.name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell className="text-center">{customer.totalOrders}</TableCell>
                                        <TableCell className="text-right font-medium text-emerald-600">
                                            {currency(customer.totalSpent)}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {new Date(customer.lastOrderDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                                                {customer.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
