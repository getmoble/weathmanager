"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Asset } from "@/types/types";
import { MoreHorizontal, MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface AssetTableProps {
    assets: Asset[];
    onEdit: (asset: Asset) => void;
    onDelete: (id: string) => void;
}

export function AssetTable({ assets, onEdit, onDelete }: AssetTableProps) {
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
                        <TableHead>Asset Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Purchase Value</TableHead>
                        <TableHead className="text-right">Current Value</TableHead>
                        <TableHead className="text-right">Appreciation</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assets.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No assets found matching your criteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        assets.map((asset) => {
                            const gains = asset.currentValue - asset.purchaseValue
                            const appreciation = (gains / asset.purchaseValue) * 100

                            return (
                                <TableRow key={asset.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-semibold">{asset.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider px-1.5 h-4">
                                            {asset.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {asset.location ? (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                <span>{asset.location}</span>
                                            </div>
                                        ) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums text-muted-foreground">
                                        {formatCurrency(asset.purchaseValue)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums font-bold">
                                        {formatCurrency(asset.currentValue)}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        <div className={`flex items-center justify-end gap-1 font-bold ${gains >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {gains >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                            {gains >= 0 ? '+' : ''}{appreciation.toFixed(1)}%
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
                                                <DropdownMenuItem onClick={() => onEdit(asset)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-500"
                                                    onClick={() => onDelete(asset.id)}
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
