"use client"

import { Liability } from "@/types/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Landmark, CreditCard, ReceiptText, Calculator, Percent, Info, TrendingDown } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts"

interface LiabilityProjectionDialogProps {
    liability: Liability | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function LiabilityProjectionDialog({ liability, open, onOpenChange }: LiabilityProjectionDialogProps) {
    if (!liability) return null

    const formatCurrency = (value: number) => {
        const absValue = Math.abs(value)
        if (absValue >= 10000000) {
            return `₹${(value / 10000000).toFixed(2)} Cr`
        } else if (absValue >= 100000) {
            return `₹${(value / 100000).toFixed(2)} L`
        } else if (absValue >= 1000) {
            return `₹${(value / 1000).toFixed(1)} K`
        }
        return `₹${value.toLocaleString('en-IN')}`
    }

    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "credit card": return <CreditCard className="h-5 w-5" />
            case "home loan": return <Landmark className="h-5 w-5" />
            case "personal loan": return <ReceiptText className="h-5 w-5" />
            default: return <CreditCard className="h-5 w-5" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "credit card": return "bg-rose-500/10 text-rose-500 border-rose-500/20"
            case "home loan": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            case "personal loan": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
            default: return "bg-slate-500/10 text-slate-500 border-slate-500/20"
        }
    }

    const calculateRepaymentProjection = (l: Liability) => {
        const projection = []
        let balance = l.outstandingAmount
        const monthlyRate = (l.interestRate / 100) / 12
        const emi = l.emi || 0
        const currentYear = new Date().getFullYear()

        if (emi <= balance * monthlyRate) {
            return { data: [], totalInterest: 0, months: -1 } // Won't close
        }

        let totalInterest = 0
        let months = 0

        while (balance > 0 && months < 600) {
            const interest = balance * monthlyRate
            const principal = emi - interest
            totalInterest += interest
            balance -= principal
            months++

            if (months % 12 === 0 || balance <= 0) {
                projection.push({
                    year: currentYear + Math.floor(months / 12),
                    balance: Math.max(0, balance),
                    interestPaid: totalInterest
                })
            }
        }

        return { data: projection, totalInterest, months }
    }

    const projectionData = calculateRepaymentProjection(liability)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(liability.type)}`}>
                            {getIcon(liability.type)}
                        </div>
                        <div>
                            <DialogTitle className="text-2xl">{liability.name}</DialogTitle>
                            <DialogDescription>
                                Repayment Timeline & Closure Projection
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 mt-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-muted/50 border-none shadow-none">
                            <CardContent className="pt-4">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1 flex items-center gap-1">
                                    <Calculator className="h-3 w-3" /> Time to Close
                                </p>
                                <p className="text-xl font-bold text-rose-600">
                                    {projectionData.months === -1 ? "Never (EMI < Interest)" :
                                        `${Math.floor(projectionData.months / 12)} yrs ${projectionData.months % 12} mos`}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted/50 border-none shadow-none">
                            <CardContent className="pt-4">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1 flex items-center gap-1">
                                    <Percent className="h-3 w-3" /> Total Interest
                                </p>
                                <p className="text-xl font-bold">
                                    {formatCurrency(projectionData.totalInterest)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted/50 border-none shadow-none">
                            <CardContent className="pt-4">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1 flex items-center gap-1">
                                    <Info className="h-3 w-3" /> Total Cost
                                </p>
                                <p className="text-xl font-bold">
                                    {formatCurrency(liability.outstandingAmount + projectionData.totalInterest)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="h-[350px] w-full bg-slate-50/50 dark:bg-zinc-900/50 rounded-xl border p-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Projected Balance Reduction</p>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projectionData.data}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="year"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis hide domain={[0, 'auto']} />
                                <ChartTooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white dark:bg-zinc-950 border rounded-lg shadow-xl p-3">
                                                    <p className="text-xs font-bold text-muted-foreground mb-1">Year {payload[0].payload.year}</p>
                                                    <p className="text-sm font-bold text-rose-600">Balance: {formatCurrency(payload[0].value as number)}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-1">Interest Paid: {formatCurrency(payload[0].payload.interestPaid)}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#e11d48"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorBalance)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg dark:bg-rose-950/20 dark:border-rose-900/30">
                        <div className="flex gap-3">
                            <div className="p-2 bg-white rounded-md shadow-sm dark:bg-zinc-900 h-fit">
                                <TrendingDown className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-rose-900 dark:text-rose-100">Estimated Closure Date</h4>
                                <p className="text-sm text-rose-700 dark:text-rose-300 mt-1">
                                    If you continue paying ₹{liability.emi?.toLocaleString('en-IN')} monthly, your <strong>{liability.name}</strong> will be fully closed in
                                    <strong> {Math.floor(projectionData.months / 12)} years and {projectionData.months % 12} months</strong> (approx. {new Date(new Date().setMonth(new Date().getMonth() + projectionData.months)).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
