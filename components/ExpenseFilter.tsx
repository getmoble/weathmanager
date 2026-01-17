"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { subMonths, subYears, format } from "date-fns";

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
    };

    const applyPreset = (months: number) => {
        const end = new Date();
        const start = months >= 12 ? subYears(end, months / 12) : subMonths(end, months);
        setLocalFilters({
            ...localFilters,
            startDate: format(start, 'yyyy-MM-dd'),
            endDate: format(end, 'yyyy-MM-dd')
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Filter Expenses</SheetTitle>
                    <SheetDescription>
                        Narrow down your transaction list.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-6 border-t mt-6">
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Presets</Label>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => applyPreset(1)}>Last Month</Button>
                            <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => applyPreset(3)}>Last 3 Months</Button>
                            <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => applyPreset(12)}>Last Year</Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Custom Date Range</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground">From</span>
                                <Input
                                    type="date"
                                    className="h-9"
                                    value={localFilters.startDate}
                                    onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground">To</span>
                                <Input
                                    type="date"
                                    className="h-9"
                                    value={localFilters.endDate}
                                    onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
                                />
                            </div>
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
