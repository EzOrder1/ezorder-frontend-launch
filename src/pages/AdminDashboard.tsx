import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { SalesOverviewChart } from "@/components/admin/SalesOverviewChart";
import { OrderStatusChart } from "@/components/admin/OrderStatusChart";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { TopProducts, ComputedProduct } from "@/components/admin/TopProducts";
import { MenuItemsTable } from "@/components/admin/menu/MenuItemsTable";
import { MenuItemForm, MenuItem as FormMenuItem } from "@/components/admin/menu/MenuItemForm";
import { CategoryManager } from "@/components/admin/menu/CategoryManager";
import { OrderDetailsModal } from "@/components/admin/orders/OrderDetailsModal";
import { ActiveOrders } from "@/components/admin/orders/ActiveOrders";
import { BulkOrderManager } from "@/components/admin/orders/BulkOrderManager";
import { SalesReport } from "@/components/admin/analytics/SalesReport";
import { CustomerList } from "@/components/admin/analytics/CustomerList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Bell, Search, User, Menu as MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ringtone from "@/assets/ringtone.mp3";

// Types
type OrderStatus =
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  order_number: string;
  user_name: string;
  phone_number: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
};

type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
};

type MenuResponse = {
  items: MenuItem[];
  total: number;
};

type OrderListResponse = {
  orders: Order[];
  total: number;
};

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

const currency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value || 0
  );

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState<string>("Admin");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  // Menu State
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<FormMenuItem | null>(null);

  // Order Detail State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Notification State
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Poll for new orders every 30 seconds
  useQuery({
    queryKey: ["latest-orders-poll"],
    queryFn: async () => {
      // Fetch just the most recent order to check timestamp/id
      const res = await api.get("/api/v1/orders", { params: { limit: 1 } });
      const latestOrder = res.data.orders[0] as Order;

      if (latestOrder) {
        const lastKnownOrder = localStorage.getItem("lastKnownOrderNumber");

        // If we have a last known order and this one is different (and presumably newer)
        if (lastKnownOrder && lastKnownOrder !== latestOrder.order_number) {
          // It's a new order!
          setUnreadNotifications(prev => prev + 1);
          toast({
            title: "New Order Received! 🔔",
            description: `Order #${latestOrder.order_number} from ${latestOrder.user_name}`,
            duration: 5000,
            className: "bg-emerald-50 border-emerald-200"
          });

          // Play Sound
          try {
            const audio = new Audio(ringtone);
            audio.play().catch(e => console.error("Audio play failed", e));
          } catch (err) {
            console.error("Failed to initialize audio", err);
          }
        }

        // Update local storage to current latest
        localStorage.setItem("lastKnownOrderNumber", latestOrder.order_number);
      }
      return latestOrder;
    },
    refetchInterval: 30000, // 30 seconds
    enabled: authorized,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/admin/login");
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      setUserName(parsed?.name || "Admin");
      if (parsed?.role === "admin" || parsed?.role === "staff") {
        setAuthorized(true);
      } else {
        toast({
          title: "Access denied",
          variant: "destructive",
        });
        navigate("/");
      }
    } catch {
      navigate("/admin/login");
    }
  }, [navigate, toast]);

  // Queries
  const statsQuery = useQuery({
    queryKey: ["order-stats"],
    queryFn: async () => {
      const res = await api.get("/api/v1/orders/stats");
      return res.data as { total_orders: number; by_status: Record<string, number> };
    },
    enabled: authorized,
  });

  const metricsQuery = useQuery({
    queryKey: ["order-metrics"],
    queryFn: async () => {
      const res = await api.get("/api/v1/orders/metrics/daily", { params: { days: 10 } });
      return res.data as { series: { date: string; day: string; orders: number; revenue: number }[] };
    },
    enabled: authorized,
  });

  const ordersQuery = useQuery({
    queryKey: ["orders", statusFilter],
    queryFn: async () => {
      const res = await api.get("/api/v1/orders", {
        params: { status: statusFilter === "all" ? undefined : statusFilter, limit: 100 },
      });
      return res.data as OrderListResponse;
    },
    enabled: authorized,
    staleTime: 30000,
  });

  const menuQuery = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await api.get("/api/v1/menu/", { params: { limit: 200 } });
      return res.data as MenuResponse;
    },
    enabled: authorized,
  });

  const categoriesQuery = useQuery({
    queryKey: ["menu-categories"],
    queryFn: async () => {
      const res = await api.get("/api/v1/menu/categories");
      return res.data as string[];
    },
    enabled: authorized,
  });

  // Mutations
  const orderStatusMutation = useMutation({
    mutationFn: async (payload: { orderNumber: string; status: OrderStatus }) => {
      const res = await api.put(`/api/v1/orders/${payload.orderNumber}/status`, {
        status: payload.status,
      });
      return res.data as Order;
    },
    onSuccess: () => {
      toast({ title: "Order updated" });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
  });

  const createMenuMutation = useMutation({
    mutationFn: async (payload: FormMenuItem) => {
      const res = await api.post("/api/v1/menu", payload);
      return res.data;
    },
    onSuccess: () => {
      toast({ title: "Item created" });
      setIsMenuItemModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
    onError: () => toast({ title: "Failed to create item", variant: "destructive" }),
  });

  const updateMenuMutation = useMutation({
    mutationFn: async (payload: { id: number; data: FormMenuItem }) => {
      const res = await api.put(`/api/v1/menu/${payload.id}`, payload.data);
      return res.data;
    },
    onSuccess: () => {
      toast({ title: "Item updated" });
      setIsMenuItemModalOpen(false);
      setEditingMenuItem(null);
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
    onError: () => toast({ title: "Failed to update item", variant: "destructive" }),
  });

  const deleteMenuMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/menu/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Item deleted" });
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      await api.post("/api/v1/menu/category", { name });
    },
    onSuccess: () => {
      toast({ title: "Category added" });
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
    },
    onError: () => toast({ title: "Failed to add category", variant: "destructive" }),
  });

  const renameCategoryMutation = useMutation({
    mutationFn: async (payload: { old_category: string; new_category: string }) => {
      await api.put("/api/v1/menu/category/rename", payload);
    },
    onSuccess: () => {
      toast({ title: "Category renamed" });
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      await api.delete("/api/v1/menu/category", { data: { name } });
    },
    onSuccess: () => {
      toast({ title: "Category deleted" });
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
    onError: () => toast({ title: "Failed to delete category", variant: "destructive" }),
  });


  // Data Logic
  const revenueLastWeek = useMemo(() => {
    const series = metricsQuery.data?.series || [];
    return series.reduce((sum, row) => sum + (row.revenue || 0), 0);
  }, [metricsQuery.data]);

  const chartData = useMemo(() => {
    return metricsQuery.data?.series.map(s => ({
      name: s.day,
      uv: s.orders,
      pv: s.revenue / 2,
      amt: s.revenue
    })) || [];
  }, [metricsQuery.data]);

  const statusData = useMemo(() => {
    const byStatus = statsQuery.data?.by_status || {};
    return Object.entries(byStatus).map(([key, value]) => ({
      name: key.replace(/_/g, " "),
      value: value
    })).filter(item => item.value > 0);
  }, [statsQuery.data]);

  const topProducts = useMemo<ComputedProduct[]>(() => {
    if (!ordersQuery.data?.orders) return [];

    const productMap = new Map<string, { sales: number; revenue: number }>();

    ordersQuery.data.orders.forEach(order => {
      if (order.status !== 'cancelled') {
        order.items.forEach(item => {
          const current = productMap.get(item.name) || { sales: 0, revenue: 0 };
          productMap.set(item.name, {
            sales: current.sales + item.quantity,
            revenue: current.revenue + item.subtotal
          });
        });
      }
    });

    return Array.from(productMap.entries())
      .map(([name, data]) => ({
        name,
        sales: data.sales,
        revenue: data.revenue,
        status: "Active"
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [ordersQuery.data]);

  const uniqueCustomers = useMemo(() => {
    if (!ordersQuery.data?.orders) return 0;
    const users = new Set(ordersQuery.data.orders.map(o => o.phone_number));
    return users.size;
  }, [ordersQuery.data]);


  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:translate-x-0 lg:border-r",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <AdminSidebar activeSection={activeSection} setActiveSection={(s) => { setActiveSection(s); setIsSidebarOpen(false); }} />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon className="h-6 w-6" />
            </Button>
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 bg-slate-50 pl-9 focus-visible:ring-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setUnreadNotifications(0)}
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadNotifications}
                </span>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden text-sm font-medium md:inline-block">{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/admin/login");
                }}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              </div>

              <DashboardStats
                totalRevenue={revenueLastWeek}
                totalOrders={statsQuery.data?.total_orders || 0}
                totalCustomers={uniqueCustomers}
                totalProducts={menuQuery.data?.total || 0}
              />

              <div className="grid gap-6 lg:grid-cols-12">
                <SalesOverviewChart data={chartData} />
                <OrderStatusChart data={statusData} />
              </div>

              <div className="grid gap-6 lg:grid-cols-12">
                <RecentActivity orders={ordersQuery.data?.orders || []} />
                <TopProducts products={topProducts} />
              </div>
            </div>
          )}

          {activeSection === "orders" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
              <Card>
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b">
                          <th className="px-3 py-3">Order</th>
                          <th className="px-3 py-3">Customer</th>
                          <th className="px-3 py-3">Total</th>
                          <th className="px-3 py-3">Status</th>
                          <th className="px-3 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(ordersQuery.data?.orders || []).map((order) => (
                          <tr
                            key={order.order_number}
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsOrderModalOpen(true);
                            }}
                          >
                            <td className="px-3 py-3 font-semibold">{order.order_number}</td>
                            <td className="px-3 py-3">
                              <div className="font-medium">{order.user_name}</div>
                            </td>
                            <td className="px-3 py-3">{currency(order.total)}</td>
                            <td className="px-3 py-3">
                              <Badge className={cn("font-semibold capitalize", statusBadgeTone[order.status])}>
                                {order.status.replace(/_/g, " ")}
                              </Badge>
                            </td>
                            <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                              <Select
                                value={order.status}
                                onValueChange={(value: OrderStatus) =>
                                  orderStatusMutation.mutate({ orderNumber: order.order_number, status: value })
                                }
                              >
                                <SelectTrigger className="w-[140px] h-8">
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <OrderDetailsModal
                open={isOrderModalOpen}
                onOpenChange={setIsOrderModalOpen}
                order={selectedOrder}
              />
            </div>
          )}
          {activeSection === "bulk-update" && (
            <BulkOrderManager
              onOrderClick={(order) => {
                setSelectedOrder(order as any);
                setIsOrderModalOpen(true);
              }}
            />
          )}

          {activeSection === "menu-items" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold tracking-tight">Menu Items</h1>
              <MenuItemsTable
                items={menuQuery.data?.items || []}
                onCreate={() => {
                  setEditingMenuItem(null);
                  setIsMenuItemModalOpen(true);
                }}
                onEdit={(item) => {
                  setEditingMenuItem(item);
                  setIsMenuItemModalOpen(true);
                }}
                onDelete={(id) => deleteMenuMutation.mutate(id)}
              />
              <MenuItemForm
                open={isMenuItemModalOpen}
                onOpenChange={setIsMenuItemModalOpen}
                categories={categoriesQuery.data || []}
                initialData={editingMenuItem}
                isSubmitting={createMenuMutation.isPending || updateMenuMutation.isPending}
                onSubmit={(data) => {
                  if (editingMenuItem?.id) {
                    updateMenuMutation.mutate({ id: editingMenuItem.id, data });
                  } else {
                    createMenuMutation.mutate(data);
                  }
                }}
              />
            </div>
          )}

          {activeSection === "categories" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
              <CategoryManager
                categories={categoriesQuery.data || []}
                onCreate={(name) => createCategoryMutation.mutate(name)}
                onRename={(oldName, newName) => renameCategoryMutation.mutate({ old_category: oldName, new_category: newName })}
                onDelete={(name) => deleteCategoryMutation.mutate(name)}
              />
            </div>
          )}

          {activeSection === "sales-report" && (
            <SalesReport data={metricsQuery.data?.series || []} />
          )}

          {activeSection === "customers" && (
            <CustomerList orders={ordersQuery.data?.orders || []} />
          )}

          {(activeSection !== "dashboard" && activeSection !== "orders" && activeSection !== "menu-items" && activeSection !== "categories" && activeSection !== "sales-report" && activeSection !== "customers") && (
            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
              <div className="rounded-full bg-gray-100 p-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Under Construction</h3>
              <p className="text-muted-foreground">The {activeSection.replace("-", " ")} module is coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
