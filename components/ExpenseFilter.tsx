"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface ExpenseFilters {
    startDate: string;
    endDate: string;
    category: string;
    source: 'all' | 'manual' | 'recurring';
    minAmount: string;
    maxAmount: string;
}

interface ExpenseFilterProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    filters: ExpenseFilters;
    onFilterChange: (filters: ExpenseFilters) => void;
    categories: string[];
}

export function ExpenseFilter({ open, onOpenChange, filters, onFilterChange, categories }: ExpenseFilterProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleApply = () => {
        onFilterChange(localFilters);
        onOpenChange(false);
    };

    const handleReset = () => {
        const resetFilters: ExpenseFilters = {
            startDate: "",
            endDate: "",
            category: "all",
            source: "all",
            minAmount: "",
            maxAmount: ""
        };
        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
        // Keep open or close? Usually keep open or user choice. Let's keep open for now.
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filter Expenses</SheetTitle>
                    <SheetDescription>
                        Narrow down your transaction list.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label>Date Range</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="date"
                                value={localFilters.startDate}
                                onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
                            />
                            <span>to</span>
                            <Input
                                type="date"
                                value={localFilters.endDate}
                                onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={localFilters.category}
                            onValueChange={(v) => setLocalFilters({ ...localFilters, category: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Source</Label>
                        <Select
                            value={localFilters.source}
                            onValueChange={(v: any) => setLocalFilters({ ...localFilters, source: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Sources" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sources</SelectItem>
                                <SelectItem value="manual">Manual Entry</SelectItem>
                                <SelectItem value="recurring">Recurring Payment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Amount Range</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={localFilters.minAmount}
                                onChange={(e) => setLocalFilters({ ...localFilters, minAmount: e.target.value })}
                            />
                            <span>-</span>
                            <Input
                                type="number"
                                placeholder="Max"
                                value={localFilters.maxAmount}
                                onChange={(e) => setLocalFilters({ ...localFilters, maxAmount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <Button className="flex-1" onClick={handleApply}>Apply Filters</Button>
                        <Button variant="outline" onClick={handleReset}>Reset</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
