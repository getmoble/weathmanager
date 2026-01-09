"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecurringTransaction } from "@/types/types";
import { Calendar, Clock, DollarSign, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecurringTransactionCardProps {
    transaction: RecurringTransaction;
    onAcknowledge?: (id: string) => void;
}

export function RecurringTransactionCard({
    transaction,
    onAcknowledge
}: RecurringTransactionCardProps) {
    const isIncome = transaction.type === 'income';

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${isIncome ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {isIncome ? <DollarSign className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold">{transaction.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Day {transaction.recurrence.dayOfMonth}
                                </span>
                                <span className="capitalize px-1.5 py-0.5 rounded-full bg-muted">
                                    {transaction.recurrence.type}
                                </span>
                                <span className="capitalize">
                                    {transaction.category}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right space-y-2">
                        <div className={`text-lg font-bold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                            {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                        </div>
                        {transaction.lastGenerated && (
                            <div className="text-[10px] text-muted-foreground">
                                Last: {new Date(transaction.lastGenerated).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Acknowledgment Section if pending */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-muted-foreground">Status: </span>
                        <span className="font-medium text-amber-500">Awaiting Jan Occurrence</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                            Skip
                        </Button>
                        <Button size="sm" className="h-8 text-xs gap-1" onClick={() => onAcknowledge?.(transaction.id)}>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Acknowledge
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
