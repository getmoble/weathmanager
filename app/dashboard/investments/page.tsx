"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { TransactionTable } from "@/components/TransactionTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactions } from "@/lib/mockTransactionData";
import { getStocks } from "@/lib/mockStockData";
import { Transaction, Stock } from "@/types/types";
import { Wallet, TrendingUp, BarChart3, PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function InvestmentDashboardPage() {
    const [invData, setInvData] = useState<{
        totalInvested: number;
        portfolioValue: number;
        performance: number;
        holdings: { name: string; value: number; ticker: string }[];
        transactions: Transaction[];
        chartData: { date: string; value: number }[];
    } | null>(null);

    useEffect(() => {
        async function loadData() {
            const txs = await getTransactions();
            const invTxs = txs.filter(t => t.type === 'investment');
            const stocks = await getStocks();

            const totalInvested = invTxs.reduce((sum, t) => sum + t.amount, 0);

            // Mock portfolio value (some gain/loss)
            const performance = 14.2;
            const portfolioValue = totalInvested * (1 + performance / 100);

            // Mock holdings based on invTxs
            const holdingsMap: Record<string, number> = {};
            invTxs.forEach(t => {
                const ticker = t.description.split(' ').pop() || 'Misc';
                holdingsMap[ticker] = (holdingsMap[ticker] || 0) + t.amount;
            });
            const holdings = Object.entries(holdingsMap).map(([ticker, value]) => ({
                ticker,
                name: stocks.find(s => s.ticker === ticker)?.companyName || ticker,
                value: value * (1 + performance / 100)
            })).sort((a, b) => b.value - a.value);

            // Mock chart data
            const chartData = [
                { date: 'Jul', value: totalInvested * 0.7 },
                { date: 'Aug', value: totalInvested * 0.82 },
                { date: 'Sep', value: totalInvested * 0.88 },
                { date: 'Oct', value: totalInvested * 0.95 },
                { date: 'Nov', value: totalInvested * 1.05 },
                { date: 'Dec', value: portfolioValue },
            ];

            setInvData({
                totalInvested,
                portfolioValue,
                performance,
                holdings,
                transactions: invTxs,
                chartData
            });
        }
        loadData();
    }, []);

    if (!invData) return <div className="p-8">Loading investment data...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Investment Portfolio</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Portfolio Value"
                    value={`₹${invData.portfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                    icon={Wallet}
                    trend={{ value: invData.performance, isPositive: true }}
                    description="Total current value"
                    valueClassName="text-blue-500"
                />
                <MetricCard
                    title="Total Invested"
                    value={`₹${invData.totalInvested.toLocaleString('en-IN')}`}
                    icon={TrendingUp}
                    description="Net contributions"
                />
                <MetricCard
                    title="Total Gain/Loss"
                    value={`+₹${(invData.portfolioValue - invData.totalInvested).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                    icon={BarChart3}
                    description="Unrealized performance"
                    valueClassName="text-green-500"
                />
                <MetricCard
                    title="Asset Count"
                    value={invData.holdings.length}
                    icon={PieChartIcon}
                    description="Diversified assets"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Performance History</CardTitle>
                        <CardDescription>Portfolio growth over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={invData.chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Asset Allocation</CardTitle>
                        <CardDescription>Breakdown by ticker</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={invData.holdings}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        nameKey="ticker"
                                    >
                                        {invData.holdings.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Investment History</CardTitle>
                    <CardDescription>Recent buy/sell activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <TransactionTable transactions={invData.transactions} />
                </CardContent>
            </Card>
        </div>
    );
}
