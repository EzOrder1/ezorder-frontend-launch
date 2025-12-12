import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderStatusChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#06B6D4", "#84CC16", "#EF4444"];
// Colors map to: confirmed, preparing, ready, out_for_delivery, delivered, cancelled

export function OrderStatusChart({ data }: OrderStatusChartProps) {
    // Use provided data or empty fallback to avoid crashes, but no mock data
    const chartData = data || [];

    return (
        <Card className="col-span-full border-0 shadow-sm lg:col-span-4">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
