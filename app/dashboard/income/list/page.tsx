"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IncomeTable } from "@/components/IncomeTable";
import { ExpenseFilter, ExpenseFilters } from "@/components/ExpenseFilter"; // Reusing filter component
import { SingleTransactionModal } from "@/components/SingleTransactionModal";
import { DataService } from "@/lib/dataService";
import { Transaction } from "@/types/types";
import { Search, Filter, Download, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function IncomeListPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<ExpenseFilters>({
        startDate: "",
        endDate: "",
        category: "all",
        source: "all",
        minAmount: "",
        maxAmount: ""
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);

    // Edit Modal State
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // Initial and Dependency Load
    useEffect(() => {
        loadData();
    }, [currentPage, pageSize, filters, searchQuery]);

    // Reset to page 1 when search or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await DataService.getPaginatedTransactions({
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
                type: 'income',
                startDate: filters.startDate,
                endDate: filters.endDate,
                category: filters.category,
                source: filters.source,
                searchQuery: searchQuery,
            });
            setTransactions(res.data);
            setTotal(res.total);
        } catch (error) {
            console.error("Failed to load transactions", error);
        } finally {
            setLoading(false);
        }
    };

    const [categories, setCategories] = useState<string[]>([]);
    useEffect(() => {
        DataService.getCategories().then(res => setCategories(res.income));
    }, []);

    const totalPages = Math.ceil(total / pageSize);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this income record?")) {
            await DataService.deleteTransaction(id);
            loadData();
        }
    };

    const handleDownloadCSV = async () => {
        try {
            const res = await DataService.getPaginatedTransactions({
                limit: 10000,
                offset: 0,
                type: 'income',
                startDate: filters.startDate,
                endDate: filters.endDate,
                category: filters.category,
                source: filters.source,
                searchQuery: searchQuery,
            });

            const headers = ["Date", "Description", "Category", "Amount", "Source", "Type"];
            const rows = res.data.map(t => [
                new Date(t.date).toLocaleDateString(),
                `"${t.description}"`,
                t.category,
                t.amount.toString(),
                t.isRecurring ? "Recurring" : "Manual",
                t.type
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map(r => r.join(","))
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `income_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to export CSV", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/income">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">All Incomes</h1>
                    <p className="text-muted-foreground">Manage and track your income sources.</p>
                </div>
                <div className="ml-auto">
                    <SingleTransactionModal
                        type="income"
                        onSave={loadData}
                        trigger={
                            <Button size="sm" className="h-9">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Income
                            </Button>
                        }
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search description or category..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(true)} className="h-9">
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDownloadCSV} className="h-9">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading incomes...</div>
                    ) : (
                        <>
                            <IncomeTable
                                transactions={transactions}
                                onEdit={(t) => setEditingTransaction(t)}
                                onDelete={handleDelete}
                            />

                            <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 order-2 md:order-1">
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">Show:</span>
                                    <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(parseInt(v))}>
                                        <SelectTrigger className="w-[100px] h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                            <SelectItem value="200">200</SelectItem>
                                            <SelectItem value="500">500</SelectItem>
                                            <SelectItem value="1000">1000</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="ml-4 text-xs text-muted-foreground">
                                        Total Records: {total}
                                    </div>
                                </div>
                                <div className="order-1 md:order-2">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <ExpenseFilter
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                filters={filters}
                onFilterChange={setFilters}
                categories={categories}
            />

            {editingTransaction && (
                <SingleTransactionModal
                    type="income"
                    transactionToEdit={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    onSave={() => {
                        loadData();
                        setEditingTransaction(null);
                    }}
                    key={editingTransaction.id}
                />
            )}
        </div>
    );
}
