"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, LayoutGrid } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Row {
    id: number;
    description: string;
    amount: string;
    category: string;
    type: 'income' | 'expense' | 'investment';
}

export function MultipleTransactionsModal() {
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState<Row[]>([
        { id: Date.now(), description: "", amount: "", category: "", type: 'expense' }
    ]);

    const addRow = () => {
        setRows([...rows, { id: Date.now(), description: "", amount: "", category: "", type: 'expense' }]);
    };

    const removeRow = (id: number) => {
        if (rows.length > 1) {
            setRows(rows.filter(r => r.id !== id));
        }
    };

    const updateRow = (id: number, field: keyof Row, value: string) => {
        setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const handleSaveAll = () => {
        console.log("Saving multiple transactions:", rows);
        setOpen(false);
        setRows([{ id: Date.now(), description: "", amount: "", category: "", type: 'expense' }]);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <LayoutGrid className="h-4 w-4" /> Bulk Entry
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Bulk Transaction Entry</DialogTitle>
                    <DialogDescription>
                        Enter multiple transactions quickly like an Excel sheet.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-auto py-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[150px]">Amount</TableHead>
                                <TableHead className="w-[150px]">Category</TableHead>
                                <TableHead className="w-[150px]">Type</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Input
                                            value={row.description}
                                            onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                                            placeholder="Merchant/Source"
                                            className="h-8"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={row.amount}
                                            onChange={(e) => updateRow(row.id, 'amount', e.target.value)}
                                            placeholder="₹ 0.00"
                                            className="h-8"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={row.category}
                                            onChange={(e) => updateRow(row.id, 'category', e.target.value)}
                                            placeholder="Category"
                                            className="h-8"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select value={row.type} onValueChange={(v: any) => updateRow(row.id, 'type', v)}>
                                            <SelectTrigger className="h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="expense">Expense</SelectItem>
                                                <SelectItem value="income">Income</SelectItem>
                                                <SelectItem value="investment">Investment</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                            onClick={() => removeRow(row.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button variant="ghost" className="mt-2 gap-2 w-full border-dashed border-2 h-10" onClick={addRow}>
                        <Plus className="h-4 w-4" /> Add Row
                    </Button>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveAll}>Submit All Transactions ({rows.length})</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
