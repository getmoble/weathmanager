"use client";

import { useEffect, useState, useCallback } from "react";
import { MetricCard } from "@/components/MetricCard";
import { IncomeTable } from "@/components/IncomeTable";
import { SingleTransactionModal } from "@/components/SingleTransactionModal";
import { MultipleTransactionsModal } from "@/components/MultipleTransactionsModal";
import { SmartOCRModal } from "@/components/SmartOCRModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataService } from "@/lib/dataService";
import { Transaction } from "@/types/types";
import { IndianRupee, TrendingUp, Calendar, ArrowUpRight, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function IncomeDashboardPage() {
    const [incomeData, setIncomeData] = useState<{
        totalIncome: number;
        avgMonthly: number;
        transactions: Transaction[];
        categoryData: { name: string; value: number }[];
        monthlyData: { month: string; amount: number }[];
    } | null>(null);

    // Edit Modal State
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(false);

    const [stats, setStats] = useState({
        totalIncome: 0,
        avgMonthly: 0,
        currentMonthTrend: 0,
        growthRate: 0,
        growthTrend: 0,
        highestSource: { name: "N/A", value: 0 }
    });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch all transactions to calculate stats correctly
            const allTxs = await DataService.getTransactions();
            const incomeTxs = allTxs.filter(t => t.type === 'income');

            const totalIncome = incomeTxs.reduce((sum, t) => sum + t.amount, 0);

            // Group by month for trends and chart
            // Format: YYYY-MM
            const monthlyMap: Record<string, number> = {};
            incomeTxs.forEach(t => {
                const date = new Date(t.date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + t.amount;
            });

            const sortedMonthKeys = Object.keys(monthlyMap).sort();
            const monthlyData = sortedMonthKeys.map(key => ({
                month: new Date(key + "-01").toLocaleString('default', { month: 'short' }),
                fullMonth: key,
                amount: monthlyMap[key]
            }));

            // Trend vs Last Month
            let currentMonthTrend = 0;
            if (sortedMonthKeys.length >= 2) {
                const currentMonth = monthlyMap[sortedMonthKeys[sortedMonthKeys.length - 1]];
                const lastMonth = monthlyMap[sortedMonthKeys[sortedMonthKeys.length - 2]];
                if (lastMonth > 0) {
                    currentMonthTrend = ((currentMonth - lastMonth) / lastMonth) * 100;
                }
            }

            // Group by category for pie chart
            const categories: Record<string, number> = {};
            incomeTxs.forEach(t => {
                categories[t.category] = (categories[t.category] || 0) + t.amount;
            });
            const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));
            const highestSource = categoryData.length > 0
                ? categoryData.reduce((prev, curr) => prev.value > curr.value ? prev : curr)
                : { name: "N/A", value: 0 };

            // Growth Rate calculation (average MoM growth of last 6 months)
            let totalGrowth = 0;
            let growthPoints = 0;
            const recentMonths = sortedMonthKeys.slice(-7); // Need 7 to get 6 transitions
            for (let i = 1; i < recentMonths.length; i++) {
                const curr = monthlyMap[recentMonths[i]];
                const prev = monthlyMap[recentMonths[i - 1]];
                if (prev > 0) {
                    totalGrowth += ((curr - prev) / prev) * 100;
                    growthPoints++;
                }
            }
            const avgGrowthRate = growthPoints > 0 ? totalGrowth / growthPoints : 0;

            // For the "Monthly growth" trend in the UI
            // Using the difference between current MoM and average MoM? 
            // Or just last month's growth? Let's use the delta of the last two growth rates.
            let growthTrend = 0;
            if (growthPoints >= 2) {
                const currentMoM = ((monthlyMap[recentMonths[recentMonths.length - 1]] - monthlyMap[recentMonths[recentMonths.length - 2]]) / monthlyMap[recentMonths[recentMonths.length - 2]]) * 100;
                const prevMoM = ((monthlyMap[recentMonths[recentMonths.length - 2]] - monthlyMap[recentMonths[recentMonths.length - 3]]) / monthlyMap[recentMonths[recentMonths.length - 3]]) * 100;
                growthTrend = currentMoM - prevMoM;
            }

            // Avg. Monthly - focus on last 12 months only as requested
            const last12Months = monthlyData.slice(-12);
            const totalLast12Months = last12Months.reduce((sum, m) => sum + m.amount, 0);
            const avgMonthly = totalLast12Months / (last12Months.length || 1);

            setIncomeData({
                totalIncome,
                avgMonthly,
                transactions: incomeTxs.slice(0, 15).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                categoryData,
                monthlyData: monthlyData.slice(-12) // Last 12 months for the chart
            });

            setStats({
                totalIncome,
                avgMonthly,
                currentMonthTrend,
                growthRate: avgGrowthRate,
                growthTrend,
                highestSource
            });

        } catch (error) {
            console.error("Failed to load income data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this income record?")) {
            await DataService.deleteTransaction(id);
            loadData();
        }
    };

    if (!incomeData) return <div className="p-8">Loading income data...</div>;

    const highestSource = incomeData.categoryData.length > 0
        ? incomeData.categoryData.reduce((prev, current) => (prev.value > current.value) ? prev : current)
        : { name: "N/A", value: 0 };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Income Analysis</h1>
                <div className="flex items-center gap-2">
                    <SingleTransactionModal type="income" />
                    <MultipleTransactionsModal />
                    <SmartOCRModal />
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/income/list">View All</Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Income"
                    value={`₹${stats.totalIncome.toLocaleString('en-IN')}`}
                    icon={IndianRupee}
                    trend={{ value: Math.round(Math.abs(stats.currentMonthTrend)), isPositive: stats.currentMonthTrend >= 0 }}
                    description="vs last month"
                    valueClassName="text-green-500"
                />
                <MetricCard
                    title="Avg. Monthly"
                    value={`₹${Math.round(stats.avgMonthly).toLocaleString('en-IN')}`}
                    icon={Calendar}
                    description="Historical average"
                />
                <MetricCard
                    title="Highest Source"
                    value={stats.highestSource.name}
                    icon={PieChartIcon}
                    description={`₹${stats.highestSource.value.toLocaleString('en-IN')}`}
                />
                <MetricCard
                    title="Growth Rate"
                    value={`${stats.growthRate.toFixed(1)}%`}
                    icon={ArrowUpRight}
                    trend={{ value: Math.round(Math.abs(stats.growthTrend)), isPositive: stats.growthTrend >= 0 }}
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
                    <CardDescription>Detailed list of recent income sources</CardDescription>
                </CardHeader>
                <CardContent>
                    <IncomeTable
                        transactions={incomeData.transactions}
                        onEdit={(t) => setEditingTransaction(t)}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            {/* Hidden Edit Modal */}
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
