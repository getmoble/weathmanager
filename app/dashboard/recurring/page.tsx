"use client";

import { useEffect, useState } from "react";
import { RecurringTransactionCard } from "@/components/RecurringTransactionCard";
import { MetricCard } from "@/components/MetricCard";
import { getRecurringTransactions } from "@/lib/mockTransactionData";
import { RecurringTransaction } from "@/types/types";
import { Repeat, Calendar, ArrowRightLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RecurringTransactionsPage() {
    const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const data = await getRecurringTransactions();
            setRecurring(data);
            setIsLoading(false);
        }
        loadData();
    }, []);

    const incomes = recurring.filter(t => t.type === 'income');
    const expenses = recurring.filter(t => t.type === 'expense');

    if (isLoading) return <div className="p-8">Loading recurring transactions...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Recurring Transactions</h1>
                    <p className="text-muted-foreground">Automated monthly cash flows</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> New Recurring Path
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    title="Active Subscriptions"
                    value={expenses.length}
                    icon={Repeat}
                    description="Monthly recurring costs"
                />
                <MetricCard
                    title="Scheduled Income"
                    value={incomes.length}
                    icon={Calendar}
                    description="Consistent monthly inflows"
                />
                <MetricCard
                    title="Monthly Fixed Balance"
                    value={`₹${(incomes.reduce((s, t) => s + t.amount, 0) - expenses.reduce((s, t) => s + t.amount, 0)).toLocaleString('en-IN')}`}
                    icon={ArrowRightLeft}
                    description="Net recurring cash flow"
                />
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All ({recurring.length})</TabsTrigger>
                    <TabsTrigger value="income">Income ({incomes.length})</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses ({expenses.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {recurring.map(t => (
                            <RecurringTransactionCard key={t.id} transaction={t} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="income" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {incomes.map(t => (
                            <RecurringTransactionCard key={t.id} transaction={t} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="expenses" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {expenses.map(t => (
                            <RecurringTransactionCard key={t.id} transaction={t} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
