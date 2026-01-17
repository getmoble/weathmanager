"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/types";
import { TrendingUp, MoreHorizontal, RefreshCw, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface IncomeTableProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
}

export function IncomeTable({ transactions, onEdit, onDelete }: IncomeTableProps) {
    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[140px]">Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No income records found matching your criteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((t) => (
                            <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="whitespace-nowrap font-medium text-muted-foreground">
                                    {format(new Date(t.date), 'do MMM yyyy')}
                                </TableCell>
                                <TableCell className="font-medium">{t.description}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/10 uppercase tracking-tighter">
                                        {t.category}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        {t.isRecurring ? (
                                            <>
                                                <RefreshCw className="h-3 w-3 text-emerald-500" />
                                                <span>Recurring</span>
                                            </>
                                        ) : (
                                            <>
                                                <Hand className="h-3 w-3 text-emerald-500" />
                                                <span>Manual</span>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-emerald-500 tabular-nums">
                                    +₹{t.amount.toLocaleString('en-IN')}
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
