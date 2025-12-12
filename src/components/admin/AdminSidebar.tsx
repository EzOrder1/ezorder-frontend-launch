import {
    LayoutDashboard,
    ShoppingBag,
    List,
    Users,
    BarChart,
    Map,
    FileText,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

const menuItems = [
    {
        category: "Main",
        items: [
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        ],
    },
    {
        category: "Order Management",
        items: [
            { id: "orders", label: "All Orders", icon: ShoppingBag },
            { id: "bulk-update", label: "Bulk Update", icon: FileText },
        ],
    },
    {
        category: "Menu Management",
        items: [
            { id: "menu-items", label: "Menu Items", icon: List },
            { id: "categories", label: "Categories", icon: List },
        ],
    },
    {
        category: "Analytics",
        items: [
            { id: "sales-report", label: "Sales Report", icon: BarChart },
            { id: "customers", label: "Customers", icon: Users },
        ],
    },
];

export function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white transition-transform">
            <div className="flex h-16 items-center border-b px-6">
                <span className="text-xl font-bold uppercase tracking-wider text-primary">
                    ElaAdmin
                </span>
            </div>
            <div className="h-[calc(100vh-64px)] overflow-y-auto py-4">
                <nav className="space-y-6 px-4">
                    {menuItems.map((group, index) => (
                        <div key={index}>
                            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {group.category}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveSection(item.id)}
                                            className={cn(
                                                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                activeSection === item.id
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
