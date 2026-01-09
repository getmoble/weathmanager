"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { TransactionTable } from "@/components/TransactionTable";
import { ExpenseReductionSuggestion } from "@/components/ExpenseReductionSuggestion";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactions } from "@/lib/mockTransactionData";
import { generateExpenseSuggestions } from "@/lib/expenseAnalysis";
import { Transaction, ExpenseSuggestion } from "@/types/types";
import { TrendingDown, IndianRupee, Calendar, CreditCard, Sparkles, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#8b5cf6", "#ec4899", "#3b82f6"];

export default function ExpenseDashboardPage() {
    const [expenseData, setExpenseData] = useState<{
        totalExpenses: number;
        avgMonthly: number;
        transactions: Transaction[];
        categoryData: { name: string; value: number }[];
        monthlyData: { month: string; amount: number }[];
        suggestions: ExpenseSuggestion[];
    } | null>(null);

    useEffect(() => {
        async function loadData() {
            const txs = await getTransactions();
            const expenseTxs = txs.filter(t => t.type === 'expense');

            const totalExpenses = expenseTxs.reduce((sum, t) => sum + t.amount, 0);

            // Group by category
            const categories: Record<string, number> = {};
            expenseTxs.forEach(t => {
                categories[t.category] = (categories[t.category] || 0) + t.amount;
            });
            const categoryData = Object.entries(categories)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);

            // Group by month
            const months: Record<string, number> = {};
            expenseTxs.forEach(t => {
                const month = new Date(t.date).toLocaleString('default', { month: 'short' });
                months[month] = (months[month] || 0) + t.amount;
            });
            const monthlyData = Object.entries(months).map(([month, amount]) => ({ month, amount }));

            // Generate suggestions
            const suggestions = generateExpenseSuggestions(expenseTxs, txs);

            setExpenseData({
                totalExpenses,
                avgMonthly: totalExpenses / (monthlyData.length || 1),
                transactions: expenseTxs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                categoryData,
                monthlyData,
                suggestions
            });
        }
        loadData();
    }, []);

    if (!expenseData) return <div className="p-8">Loading expense data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Expense Tracking</h1>
                <AddTransactionDialog />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Expenses"
                    value={`₹${expenseData.totalExpenses.toLocaleString('en-IN')}`}
                    icon={TrendingDown}
                    trend={{ value: 4.2, isPositive: false }}
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
