import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

export interface ComputedProduct {
    name: string;
    sales: number;
    revenue: number;
    status: string;
}

interface TopProductsProps {
    products: ComputedProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
    const currency = (value: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            value || 0
        );

    return (
        <Card className="col-span-full mb-8 border-0 shadow-sm lg:col-span-6">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Top Products (Last 100 Orders)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b text-muted-foreground">
                                <th className="pb-3 font-medium">Product</th>
                                <th className="pb-3 font-medium">Sales</th>
                                <th className="pb-3 font-medium">Revenue</th>
                                <th className="pb-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.length > 0 ? products.map((product, index) => (
                                <tr key={index}>
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <span className="font-medium">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3">{product.sales}</td>
                                    <td className="py-3">{currency(product.revenue)}</td>
                                    <td className="py-3">
                                        <Badge variant="outline">
                                            Calculated
                                        </Badge>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                                        Not enough data to calculate top products.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
