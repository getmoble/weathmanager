"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { TransactionTable } from "@/components/TransactionTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactions } from "@/lib/mockTransactionData";
import { Transaction } from "@/types/types";
import { IndianRupee, TrendingUp, Calendar, ArrowUpRight, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function IncomeDashboardPage() {
    const [incomeData, setIncomeData] = useState<{
        totalIncome: number;
        avgMonthly: number;
        transactions: Transaction[];
        categoryData: { name: string; value: number }[];
        monthlyData: { month: string; amount: number }[];
    } | null>(null);

    useEffect(() => {
        async function loadData() {
            const txs = await getTransactions();
            const incomeTxs = txs.filter(t => t.type === 'income');

            const totalIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0);

            // Group by category
            const categories: Record<string, number> = {};
            incomeTxs.forEach(t => {
                categories[t.category] = (categories[t.category] || 0) + t.amount;
            });
            const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));

            // Group by month
            const months: Record<string, number> = {};
            incomeTxs.forEach(t => {
                const month = new Date(t.date).toLocaleString('default', { month: 'short' });
                months[month] = (months[month] || 0) + t.amount;
            });
            const monthlyData = Object.entries(months).map(([month, amount]) => ({ month, amount }));

            setIncomeData({
                totalIncome,
                avgMonthly: totalIncome / (monthlyData.length || 1),
                transactions: incomeTxs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                categoryData,
                monthlyData
            });
        }
        loadData();
    }, []);

    if (!incomeData) return <div className="p-8">Loading income data...</div>;

    const highestSource = incomeData.categoryData.length > 0
        ? incomeData.categoryData.reduce((prev, current) => (prev.value > current.value) ? prev : current)
        : { name: "N/A", value: 0 };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Income Analysis</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Income"
                    value={`₹${incomeData.totalIncome.toLocaleString('en-IN')}`}
                    icon={IndianRupee}
                    trend={{ value: 12.5, isPositive: true }}
                    description="vs last month"
                    valueClassName="text-green-500"
                />
                <MetricCard
                    title="Avg. Monthly"
                    value={`₹${Math.round(incomeData.avgMonthly).toLocaleString('en-IN')}`}
                    icon={Calendar}
                    description="Historical average"
                />
                <MetricCard
                    title="Highest Source"
                    value={highestSource.name}
                    icon={PieChartIcon}
                    description={`₹${highestSource.value.toLocaleString('en-IN')}`}
                />
                <MetricCard
                    title="Growth Rate"
                    value="8.2%"
                    icon={ArrowUpRight}
                    trend={{ value: 2.1, isPositive: true }}
                    description="Monthly growth"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Income Trends</CardTitle>
                        <CardDescription>Monthly income distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={incomeData.monthlyData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Income Sources</CardTitle>
                        <CardDescription>Breakdown by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={incomeData.categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {incomeData.categoryData.map((entry, index) => (
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

            <Card>
                <CardHeader>
                    <CardTitle>Recent Income Transactions</CardTitle>
                    <CardDescription>Detailed list of all income sources</CardDescription>
                </CardHeader>
                <CardContent>
                    <TransactionTable transactions={incomeData.transactions} />
                </CardContent>
            </Card>
        </div>
    );
}
