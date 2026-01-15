"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { TransactionTable } from "@/components/TransactionTable";
import { ExpenseReductionSuggestion } from "@/components/ExpenseReductionSuggestion";
import { SingleTransactionModal } from "@/components/SingleTransactionModal";
import { MultipleTransactionsModal } from "@/components/MultipleTransactionsModal";
import { SmartOCRModal } from "@/components/SmartOCRModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataService } from "@/lib/dataService";
import { generateExpenseSuggestions } from "@/lib/expenseAnalysis";
import { Transaction, ExpenseSuggestion } from "@/types/types";
import { TrendingDown, IndianRupee, Calendar, CreditCard, Sparkles, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#8b5cf6", "#ec4899", "#3b82f6"];

export default function ExpenseDashboardPage() {
    const [expenseData, setExpenseData] = useState<{
        totalExpenses: number;
        avgMonthly: number;
        transactions: Transaction[];
        categoryData: { name: string; value: number }[];
        monthlyData: { month: string; amount: number }[];
        suggestions: ExpenseSuggestion[];
        trend: { value: number; isPositive: boolean };
    } | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const txs = await DataService.getTransactions();
                const expenseTxs = txs.filter(t => t.type === 'expense');

                const now = new Date();
                const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
                const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const prevMonthKey = `${prevMonthDate.getFullYear()}-${prevMonthDate.getMonth()}`;

                // Calculate Month-over-Month Trend
                let currentMonthTotal = 0;
                let prevMonthTotal = 0;

                const months: Record<string, number> = {};
                const categories: Record<string, number> = {};

                expenseTxs.forEach(t => {
                    const d = new Date(t.date);
                    const key = `${d.getFullYear()}-${d.getMonth()}`;
                    const monthName = d.toLocaleString('default', { month: 'short' });

                    // Montly Data for Chart
                    months[monthName] = (months[monthName] || 0) + t.amount;

                    // Category Data
                    categories[t.category] = (categories[t.category] || 0) + t.amount;

                    // Trend Calculation Buckets
                    if (key === currentMonthKey) currentMonthTotal += t.amount;
                    if (key === prevMonthKey) prevMonthTotal += t.amount;
                });

                const totalExpenses = expenseTxs.reduce((sum, t) => sum + t.amount, 0);

                const categoryData = Object.entries(categories)
                    .map(([name, value]) => ({ name, value }))
                    .sort((a, b) => b.value - a.value);

                const monthlyData = Object.entries(months).map(([month, amount]) => ({ month, amount }));

                // Avoid division by zero
                const trendValue = prevMonthTotal > 0
                    ? ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100
                    : 0;

                const suggestions = generateExpenseSuggestions(
                    expenseTxs.filter(t => {
                        const d = new Date(t.date);
                        return `${d.getFullYear()}-${d.getMonth()}` === currentMonthKey;
                    }),
                    expenseTxs
                );

                setExpenseData({
                    totalExpenses,
                    avgMonthly: totalExpenses / (Object.keys(months).length || 1),
                    transactions: expenseTxs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                    categoryData,
                    monthlyData,
                    suggestions,
                    trend: {
                        value: Math.abs(trendValue),
                        isPositive: trendValue > 0
                    }
                });
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        }
        loadData();
    }, []);

    if (!expenseData) return <div className="p-8">Loading expense data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Expense Tracking</h1>
                <div className="flex items-center gap-2">
                    <SingleTransactionModal type="expense" />
                    <MultipleTransactionsModal />
                    <SmartOCRModal />
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/expenses/list">View All</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Expenses"
                    value={`₹${expenseData.totalExpenses.toLocaleString('en-IN')}`}
                    icon={TrendingDown}
                    trend={expenseData.trend}
                    description="vs last month"
                    valueClassName="text-red-500"
                />
                <MetricCard
                    title="Avg. Monthly"
                    value={`₹${Math.round(expenseData.avgMonthly).toLocaleString('en-IN')}`}
                    icon={Calendar}
                    description="Historical average"
                />
                <MetricCard
                    title="Top Category"
                    value={expenseData.categoryData[0]?.name || "N/A"}
                    icon={PieChartIcon}
                    description={`₹${(expenseData.categoryData[0]?.value || 0).toLocaleString('en-IN')}`}
                />
                <MetricCard
                    title="Reduction Potential"
                    value={`₹${expenseData.suggestions.reduce((sum, s) => sum + s.potentialSavings, 0).toLocaleString('en-IN')}`}
                    icon={TrendingUp}
                    description="Estimated monthly savings"
                    valueClassName="text-green-500"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Spending Trends</CardTitle>
                        <CardDescription>Monthly expense distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={expenseData.monthlyData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Spending Breakdown</CardTitle>
                        <CardDescription>Analysis by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseData.categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expenseData.categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-500" /> Smart Reduction Suggestions
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {expenseData.suggestions.map((suggestion) => (
                        <ExpenseReductionSuggestion
                            key={suggestion.id}
                            category={suggestion.category}
                            description={suggestion.suggestion}
                            potentialSavings={suggestion.potentialSavings}
                            impact={suggestion.priority}
                        />
                    ))}
                    {expenseData.suggestions.length === 0 && (
                        <p className="text-muted-foreground text-sm col-span-full italic">
                            No major reduction opportunities detected this month. Great job!
                        </p>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Expenses</CardTitle>
                    <CardDescription>Detailed transaction history</CardDescription>
                </CardHeader>
                <CardContent>
                    <TransactionTable transactions={expenseData.transactions} />
                </CardContent>
            </Card>
        </div>
    );
}
