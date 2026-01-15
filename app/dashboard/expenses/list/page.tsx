"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseTable } from "@/components/ExpenseTable";
import { ExpenseFilter, ExpenseFilters } from "@/components/ExpenseFilter";
import { SingleTransactionModal } from "@/components/SingleTransactionModal"; // Updated to support edit
import { DataService } from "@/lib/dataService";
import { Transaction } from "@/types/types";
import { Search, Filter, Download, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ExpensesListPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
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

    // Edit Modal State
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // Initial Load
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await DataService.getTransactions();
            setTransactions(data.filter(t => t.type === 'expense')); // Only expenses
        } catch (error) {
            console.error("Failed to load transactions", error);
        } finally {
            setLoading(false);
        }
    };

    // Filtering & Searching
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            // Search
            const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.category.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchesSearch) return false;

            // Filters
            if (filters.startDate && new Date(t.date) < new Date(filters.startDate)) return false;
            if (filters.endDate && new Date(t.date) > new Date(filters.endDate)) return false;

            if (filters.category !== 'all' && t.category !== filters.category) return false;

            if (filters.source === 'manual' && t.isRecurring) return false;
            if (filters.source === 'recurring' && !t.isRecurring) return false;

            if (filters.minAmount && t.amount < parseFloat(filters.minAmount)) return false;
            if (filters.maxAmount && t.amount > parseFloat(filters.maxAmount)) return false;

            return true;
        });
    }, [transactions, searchQuery, filters]);

    // Sorting (Default Date Desc)
    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [filteredTransactions]);

    // Derived Categories
    const categories = useMemo(() => Array.from(new Set(transactions.map(t => t.category))), [transactions]);

    // Handlers
    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            await DataService.deleteTransaction(id);
            setTransactions(prev => prev.filter(t => t.id !== id));
        }
    };

    const handleDownloadCSV = () => {
        const headers = ["Date", "Description", "Category", "Amount", "Source", "Type"];
        const rows = sortedTransactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            `"${t.description}"`, // Quote description to handle commas
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
        link.setAttribute("download", `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/expenses">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">All Expenses</h1>
                    <p className="text-muted-foreground">Manage and track your spending history.</p>
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
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                            <Button variant="outline" onClick={handleDownloadCSV}>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                            <SingleTransactionModal
                                type="expense"
                                onSave={loadData}
                                trigger={
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Expense
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading expenses...</div>
                    ) : (
                        <ExpenseTable
                            transactions={sortedTransactions}
                            onEdit={(t) => setEditingTransaction(t)}
                            onDelete={handleDelete}
                        />
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

            {/* Hidden Edit Modal - conditionally rendered when we have a transaction to edit */}
            {editingTransaction && (
                <SingleTransactionModal
                    type="expense"
                    transactionToEdit={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    onSave={() => {
                        loadData();
                        setEditingTransaction(null);
                    }}
                    // Force mount/remount to reset internal state if needed, though key or useEffect inside modal handles it
                    // But key is safest
                    key={editingTransaction.id}
                />
            )}
        </div>
    );
}
