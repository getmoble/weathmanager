"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactions, getRecurringTransactions } from "@/lib/mockTransactionData";
import { getStocks } from "@/lib/mockStockData";
import { Transaction, RecurringTransaction, Stock } from "@/types/types";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";

export default function DashboardPage() {
    const [data, setData] = useState<{
        totalIncome: number;
        totalExpenses: number;
        totalInvestments: number;
        availableCash: number;
        recentTransactions: Transaction[];
    } | null>(null);

    useEffect(() => {
        async function loadData() {
            const txs = await getTransactions();

            const totalIncome = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const totalExpenses = txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const totalInvestments = txs.filter(t => t.type === 'investment').reduce((sum, t) => sum + t.amount, 0);

            const availableCash = 15000 + (totalIncome - totalExpenses - totalInvestments); // Mock starting balance

            const recentTransactions = [...txs]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5);

            setData({
                totalIncome,
                totalExpenses,
                totalInvestments,
                availableCash,
                recentTransactions
            });
        }
        loadData();
    }, []);

    if (!data) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="space-y-4">
            {/* Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">+₹{data.totalIncome.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">-₹{data.totalExpenses.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground">+4% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Investments</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">₹{data.totalInvestments.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground">Allocated this month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{data.availableCash.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground">Current liquid assets</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Financial Overview</CardTitle>
                        <CardDescription>Income vs Expenses over time</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md">
                            (Chart Component Placeholder)
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Latest financial activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.recentTransactions.map((t) => (
                                <div key={t.id} className="flex items-center">
                                    <div className={`mr-4 rounded-full p-2 ${t.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {t.type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{t.description}</p>
                                        <p className="text-xs text-muted-foreground">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`ml-auto font-medium ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
