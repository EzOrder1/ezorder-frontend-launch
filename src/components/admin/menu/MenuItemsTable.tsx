import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Plus } from "lucide-react";
import { MenuItem } from "./MenuItemForm";
import { Badge } from "@/components/ui/badge";

interface MenuItemsTableProps {
    items: MenuItem[];
    onEdit: (item: MenuItem) => void;
    onDelete: (id: number) => void;
    onCreate: () => void;
}

export function MenuItemsTable({
    items,
    onEdit,
    onDelete,
    onCreate,
}: MenuItemsTableProps) {
    const currency = (value: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            value || 0
        );

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Menu Items</h2>
                <Button onClick={onCreate} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Item
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No menu items found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{item.category}</Badge>
                                </TableCell>
                                <TableCell>{currency(item.price)}</TableCell>
                                <TableCell className="hidden max-w-[200px] truncate md:table-cell text-muted-foreground">
                                    {item.description}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(item)}
                                        >
                                            <Edit2 className="h-4 w-4 text-blue-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => item.id && onDelete(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
