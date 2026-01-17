"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Liability } from "@/types/types";
import { MoreHorizontal, CreditCard, Percent, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface LiabilityTableProps {
    liabilities: Liability[];
    onEdit: (liability: Liability) => void;
    onDelete: (id: string) => void;
    onRowClick?: (liability: Liability) => void;
}

export function LiabilityTable({ liabilities, onEdit, onDelete, onRowClick }: LiabilityTableProps) {
    const formatCurrency = (value: number) => {
        const absValue = Math.abs(value)
        if (absValue >= 10000000) {
            return `₹${(value / 10000000).toFixed(2)} Cr`
        } else if (absValue >= 100000) {
            return `₹${(value / 100000).toFixed(2)} L`
        } else if (absValue >= 1000) {
            return `₹${(value / 1000).toFixed(1)} K`
        }
        return `₹${value.toLocaleString('en-IN')}`
    }

    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead>Liability Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                        <TableHead className="text-right">Outstanding</TableHead>
                        <TableHead className="text-right">Interest Rate</TableHead>
                        <TableHead className="text-right">EMI (Monthly)</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {liabilities.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                                No liabilities found matching your criteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        liabilities.map((liability) => {
                            const repaymentProgress = ((liability.totalAmount - liability.outstandingAmount) / liability.totalAmount) * 100

                            return (
                                <TableRow
                                    key={liability.id}
                                    className={`transition-colors ${onRowClick ? "cursor-pointer hover:bg-muted/50" : "hover:bg-muted/30"}`}
                                    onClick={() => onRowClick && onRowClick(liability)}
                                >
                                    <TableCell className="font-semibold">{liability.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider px-1.5 h-4 border-rose-200 text-rose-700 bg-rose-50">
                                            {liability.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-muted-foreground">
                                        {formatCurrency(liability.totalAmount)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums font-bold text-rose-600">
                                        {formatCurrency(liability.outstandingAmount)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        <div className="flex items-center justify-end gap-1 font-medium">
                                            <Percent className="h-3 w-3 text-muted-foreground" />
                                            {liability.interestRate}%
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums font-medium">
                                        {liability.emi ? formatCurrency(liability.emi) : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <span>{liability.startDate}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEdit(liability)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-500"
                                                    onClick={() => onDelete(liability.id)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
