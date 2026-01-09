"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactions } from "@/lib/mockTransactionData";
import { Transaction } from "@/types/types";
import { FileText, Download, TrendingUp, TrendingDown, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

export default function ReportsPage() {
    const [month, setMonth] = useState("January");
    const [reportData, setReportData] = useState<{
        summary: { income: number; expenses: number; investments: number; net: number };
        categoryBreakdown: { name: string; value: number }[];
        dailyFlow: { day: number; income: number; expense: number }[];
    } | null>(null);

    useEffect(() => {
        async function loadData() {
            const txs = await getTransactions();
            // In real app, filter by selected month
            const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
            const investments = txs.filter(t => t.type === 'investment').reduce((s, t) => s + t.amount, 0);

            // Breakdown
            const cats: Record<string, number> = {};
            txs.filter(t => t.type === 'expense').forEach(t => {
                cats[t.category] = (cats[t.category] || 0) + t.amount;
            });
            const categoryBreakdown = Object.entries(cats).map(([name, value]) => ({ name, value }));

            // Mock daily flow
            const dailyFlow = Array.from({ length: 31 }, (_, i) => ({
                day: i + 1,
                income: i === 0 ? 5000 : 0,
                expense: Math.random() * 200
            }));

            setReportData({
                summary: { income, expenses, investments, net: income - expenses - investments },
                categoryBreakdown,
                dailyFlow
            });
        }
        loadData();
    }, [month]);

    if (!reportData) return <div className="p-8">Generating report...</div>;

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Financial Reports</h1>
                    <p className="text-muted-foreground">Comprehensive monthly performance review</p>
                </div>
                <div className="flex gap-2">
                    <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="January">January 2026</SelectItem>
                            <SelectItem value="December">December 2025</SelectItem>
                            <SelectItem value="November">November 2025</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> PDF
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Total Income" value={`₹${reportData.summary.income.toLocaleString('en-IN')}`} icon={FileText} valueClassName="text-green-500" />
                <MetricCard title="Total Expenses" value={`₹${reportData.summary.expenses.toLocaleString('en-IN')}`} icon={TrendingDown} valueClassName="text-red-500" />
                <MetricCard title="Investments" value={`₹${reportData.summary.investments.toLocaleString('en-IN')}`} icon={Landmark} valueClassName="text-blue-500" />
                <MetricCard title="Net Cash Flow" value={`₹${reportData.summary.net.toLocaleString('en-IN')}`} icon={TrendingUp} valueClassName={reportData.summary.net >= 0 ? "text-green-500" : "text-red-500"} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Daily Cash Flow</CardTitle>
                        <CardDescription>Income vs Expenses throughout {month}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reportData.dailyFlow}>
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" fill="#10b981" name="Income" />
                                    <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Monthly Distribution</CardTitle>
                        <CardDescription>Allocation of total income</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Expenses', value: reportData.summary.expenses },
                                            { name: 'Investments', value: reportData.summary.investments },
                                            { name: 'Savings', value: Math.max(0, reportData.summary.net) }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#ef4444" />
                                        <Cell fill="#3b82f6" />
                                        <Cell fill="#10b981" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Spending Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {reportData.categoryBreakdown.sort((a, b) => b.value - a.value).slice(0, 5).map((cat, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-primary" />
                                        <span className="text-sm font-medium">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold">₹{cat.value.toLocaleString('en-IN')}</span>
                                        <span className="text-xs text-muted-foreground w-12 text-right">
                                            {Math.round(cat.value / reportData.summary.expenses * 100)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Financial Health Score</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <div className="relative h-32 w-32">
                            <svg className="h-full w-full" viewBox="0 0 100 100">
                                <circle className="text-muted stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                                <circle className="text-primary stroke-current" strokeWidth="10" strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.85)} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                                85
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-center text-muted-foreground">
                            Your savings rate of {Math.round(reportData.summary.net / reportData.summary.income * 100)}% is excellent!
                            Consider allocating more to your Investment Portfolio.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
