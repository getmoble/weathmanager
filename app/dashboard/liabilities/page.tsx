"use client"

import { useEffect, useState } from "react"
import { DataService } from "@/lib/dataService"
import { Liability } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Percent, Calendar, ArrowUpRight, TrendingDown, ReceiptText, Landmark, X, Calculator, Info } from "lucide-react"
import Link from "next/link"
import { LiabilityProjectionDialog } from "@/components/LiabilityProjectionDialog"

export default function LiabilitiesPage() {
    const [liabilities, setLiabilities] = useState<Liability[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedLiability, setSelectedLiability] = useState<Liability | null>(null)
    const [isProjectionOpen, setIsProjectionOpen] = useState(false)

    useEffect(() => {
        async function loadData() {
            try {
                const data = await DataService.getLiabilities()
                setLiabilities(data)
            } catch (error) {
                console.error("Failed to load liabilities", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    if (isLoading) return <div className="p-8">Loading Liabilities...</div>

    const totalOutstanding = liabilities.reduce((sum, l) => sum + l.outstandingAmount, 0)
    const totalOriginal = liabilities.reduce((sum, l) => sum + l.totalAmount, 0)
    const totalEMI = liabilities.reduce((sum, l) => sum + (l.emi || 0), 0)
    const avgInterestRate = liabilities.length > 0
        ? liabilities.reduce((sum, l) => sum + l.interestRate, 0) / liabilities.length
        : 0
    const repaymentProgress = totalOriginal > 0
        ? ((totalOriginal - totalOutstanding) / totalOriginal) * 100
        : 0

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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Liabilities</h1>
                    <p className="text-muted-foreground">Manage your loans, credit cards, and other financial obligations.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/liabilities/list">
                        All Liabilities
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-rose-500/5 border-rose-500/20">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Outstanding Debt</CardDescription>
                        <CardTitle className="text-3xl font-bold text-rose-600">{formatCurrency(totalOutstanding)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                            <TrendingDown className="h-4 w-4" />
                            <span>Across {liabilities.length} accounts</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-500/5 border-blue-500/20">
                    <CardHeader className="pb-2">
                        <CardDescription>Monthly Commitment (EMI)</CardDescription>
                        <CardTitle className="text-3xl font-bold text-blue-600">{formatCurrency(totalEMI)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground font-medium">Monthly cash outflow</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Repayment Progress</CardDescription>
                        <CardTitle className="text-3xl font-bold">{repaymentProgress.toFixed(1)}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden mt-2">
                            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${repaymentProgress}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2">{formatCurrency(totalOriginal - totalOutstanding)} repaid</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Avg. Interest Rate</CardDescription>
                        <CardTitle className="text-3xl font-bold">{avgInterestRate.toFixed(2)}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Yearly cost of debt</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6">
                <h2 className="text-xl font-semibold">Tracked Accounts</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {liabilities.length === 0 ? (
                        <div className="col-span-full text-center py-12 border rounded-xl bg-muted/20 border-dashed">
                            <p className="text-muted-foreground font-medium">No liabilities tracked yet.</p>
                            <p className="text-xs text-muted-foreground mt-1">Add them in Settings to see them here.</p>
                        </div>
                    ) : (
                        liabilities.map((liability) => {
                            const prog = ((liability.totalAmount - liability.outstandingAmount) / liability.totalAmount) * 100
                            return (
                                <Card
                                    key={liability.id}
                                    className="group hover:border-rose-500/40 transition-all cursor-pointer"
                                    onClick={() => {
                                        setSelectedLiability(liability);
                                        setIsProjectionOpen(true);
                                    }}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-3 items-center">
                                                <div className={`p-2 rounded-lg ${getTypeColor(liability.type)}`}>
                                                    {getIcon(liability.type)}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-md">{liability.name}</CardTitle>
                                                    <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-wider px-1 h-3.5 mt-1 border-muted-foreground/30">
                                                        {liability.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="text-xs font-bold text-rose-600">
                                                {liability.interestRate}% APR
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">Outstanding</p>
                                                    <p className="text-lg font-bold">{formatCurrency(liability.outstandingAmount)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">EMI</p>
                                                    <p className="text-sm font-bold text-blue-600">{liability.emi ? formatCurrency(liability.emi) : "-"}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] font-medium">
                                                    <span>Repayment Progress</span>
                                                    <span>{prog.toFixed(0)}%</span>
                                                </div>
                                                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-rose-500 h-full" style={{ width: `${prog}%` }} />
                                                </div>
                                            </div>
                                            {liability.endDate && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1 border-t">
                                                    <Calendar className="h-3 w-3" />
                                                    Ends by {new Date(liability.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    )}
                </div>
            </div>

            <LiabilityProjectionDialog
                liability={selectedLiability}
                open={isProjectionOpen}
                onOpenChange={setIsProjectionOpen}
            />
        </div>
    )
}
