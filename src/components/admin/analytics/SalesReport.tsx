import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesOverviewChart } from "../SalesOverviewChart";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface SalesDataPoint {
    date: string;
    day: string;
    orders: number;
    revenue: number;
}

interface SalesReportProps {
    data: SalesDataPoint[];
}

export function SalesReport({ data }: SalesReportProps) {
    const currency = (value: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            value || 0
        );

    // Prepare chart data format
    const chartData = data.map(s => ({
        name: s.day,
        uv: s.orders,
        pv: s.revenue / 2, // Scaling factor for dual axis simulation if needed, or just visual
        amt: s.revenue
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Sales Report</h1>

            {/* Chart Section */}
            <div className="grid gap-6">
                <SalesOverviewChart data={chartData} />
            </div>

            {/* Detailed Table Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Day</TableHead>
                                <TableHead className="text-right">Orders</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                                <TableHead className="text-right">Avg. Order Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No sales data available.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                [...data].reverse().map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.day}</TableCell>
                                        <TableCell className="text-right">{row.orders}</TableCell>
                                        <TableCell className="text-right text-emerald-600 font-medium">
                                            {currency(row.revenue)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {currency(row.orders > 0 ? row.revenue / row.orders : 0)}
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
