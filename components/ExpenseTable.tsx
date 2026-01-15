"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/types";
import { TrendingDown, MoreHorizontal, RefreshCw, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ExpenseTableProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
}

export function ExpenseTable({ transactions, onEdit, onDelete }: ExpenseTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No expenses found matching your criteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell className="font-medium">{t.description}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                                        {t.category}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        {t.isRecurring ? (
                                            <>
                                                <RefreshCw className="h-3 w-3" />
                                                <span>Recurring</span>
                                            </>
                                        ) : (
                                            <>
                                                <Hand className="h-3 w-3" />
                                                <span>Manual</span>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right font-bold text-red-500">
                                    -₹{t.amount.toLocaleString('en-IN')}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(t)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-500"
                                                onClick={() => onDelete(t.id)}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
