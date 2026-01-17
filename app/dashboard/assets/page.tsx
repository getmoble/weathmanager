"use client"

import { useEffect, useState } from "react"
import { DataService } from "@/lib/dataService"
import { Asset } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Coins, Car, Landmark, TrendingUp, ArrowUpRight, MapPin, Calculator, Calendar as CalendarIcon, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"
import { ASSET_GROWTH_RATES } from "@/lib/config/assetConfig"

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

    useEffect(() => {
        async function loadData() {
            const data = await DataService.getAssets()
            setAssets(data)
            setIsLoading(false)
        }
        loadData()
    }, [])

    if (isLoading) return <div className="p-8">Loading Assets...</div>

    const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0)
    const totalPurchaseValue = assets.reduce((sum, asset) => sum + asset.purchaseValue, 0)
    const totalGains = totalValue - totalPurchaseValue
    const percentageGains = (totalGains / totalPurchaseValue) * 100

    const getIcon = (type: string) => {
        switch (type) {
            case "Real Estate": return <Building2 className="h-5 w-5" />
            case "Gold": return <Coins className="h-5 w-5" />
            case "Vehicle": return <Car className="h-5 w-5" />
            default: return <Landmark className="h-5 w-5" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case "Real Estate": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            case "Gold": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
            case "Vehicle": return "bg-rose-500/10 text-rose-500 border-rose-500/20"
            default: return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
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

    const generateProjection = (asset: Asset) => {
        const rate = ASSET_GROWTH_RATES[asset.type] || ASSET_GROWTH_RATES["default"]
        const currentYear = new Date().getFullYear()
        const data = []

        for (let i = 0; i <= 10; i++) {
            const year = currentYear + i
            const value = asset.currentValue * Math.pow(1 + rate, i)
            data.push({
                year: year.toString(),
                value: Math.round(value)
            })
        }
        return { data, isDepreciating: rate < 0, rate }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
                    <p className="text-muted-foreground">Track and manage your physical and fixed-income assets.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/assets/list">
                        All Assets
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Asset Value</CardDescription>
                        <CardTitle className="text-3xl font-bold">{formatCurrency(totalValue)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
                            <TrendingUp className="h-4 w-4" />
                            <span>+{percentageGains.toFixed(1)}% Appreciation</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Unrealized Gains</CardDescription>
                        <CardTitle className="text-3xl font-bold">{formatCurrency(totalGains)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Across {assets.length} major holdings</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Cost Basis</CardDescription>
                        <CardTitle className="text-3xl font-bold">{formatCurrency(totalPurchaseValue)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Since first acquisition</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6">
                <h2 className="text-xl font-semibold">Your Holdings</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {assets.map((asset) => {
                        const gains = asset.currentValue - asset.purchaseValue
                        const appreciation = (gains / asset.purchaseValue) * 100

                        return (
                            <Card
                                key={asset.id}
                                className="group hover:border-primary/40 transition-all overflow-hidden cursor-pointer"
                                onClick={() => setSelectedAsset(asset)}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-3 items-center">
                                            <div className={`p-2 rounded-lg ${getTypeColor(asset.type)}`}>
                                                {getIcon(asset.type)}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{asset.name}</CardTitle>
                                                <CardDescription className="flex items-center gap-1">
                                                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider px-1.5 h-4 border-muted-foreground/30">
                                                        {asset.type}
                                                    </Badge>
                                                    {asset.location && (
                                                        <span className="flex items-center gap-0.5 text-xs">
                                                            • <MapPin className="h-3 w-3" /> {asset.location}
                                                        </span>
                                                    )}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold">{formatCurrency(asset.currentValue)}</div>
                                            <div className={`text-xs font-medium ${gains >= 0 ? 'text-emerald-500' : 'text-rose-500 flex items-center justify-end gap-1'}`}>
                                                {gains >= 0 ? '+' : ''}{appreciation.toFixed(1)}% {gains >= 0 ? 'gains' : 'depreciation'}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Acquired for {formatCurrency(asset.purchaseValue)}</p>
                                            <p className="text-xs font-mono text-muted-foreground/60">{new Date(asset.purchaseDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        {asset.notes && (
                                            <div className="text-[11px] bg-muted/50 px-2 py-1 rounded italic text-muted-foreground max-w-[200px] truncate">
                                                "{asset.notes}"
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <div className="h-1 w-full bg-muted mt-2">
                                    <div className={`h-full bg-primary/40`} style={{ width: `${(asset.currentValue / totalValue) * 100}%` }} />
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>

            <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
                <DialogContent className="sm:max-w-[600px] bg-slate-950 border-slate-800 text-slate-100">
                    {selectedAsset && (() => {
                        const { data, isDepreciating, rate } = generateProjection(selectedAsset)
                        const themeColor = isDepreciating ? "#ef4444" : "#3b82f6"
                        const themeClass = isDepreciating ? "text-rose-400" : "text-blue-400"
                        const bgBadgeClass = isDepreciating ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"

                        return (
                            <>
                                <DialogHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`p-2 rounded-lg ${getTypeColor(selectedAsset.type)}`}>
                                            {getIcon(selectedAsset.type)}
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl text-white">{selectedAsset.name}</DialogTitle>
                                            <DialogDescription className="text-slate-400">
                                                10-Year {isDepreciating ? 'Depreciation' : 'Growth'} Projection based on {(rate * 100).toFixed(1)}% annual rate
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <div className="mt-6 space-y-6">
                                    <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-6 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-4">
                                            <Calculator className="h-5 w-5 text-slate-700" />
                                        </div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Projected {isDepreciating ? 'Depreciation' : 'Growth'}</h4>

                                        <div className="h-[250px] w-full mt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={data}>
                                                    <defs>
                                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={themeColor} stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis
                                                        dataKey="year"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#64748b', fontSize: 10 }}
                                                        dy={10}
                                                    />
                                                    <YAxis hide />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                                        formatter={(value: number) => [formatCurrency(value), 'Value']}
                                                        labelStyle={{ color: '#94a3b8' }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="value"
                                                        stroke={themeColor}
                                                        strokeWidth={3}
                                                        fillOpacity={1}
                                                        fill="url(#colorValue)"
                                                        dot={{ r: 4, fill: themeColor, strokeWidth: 2, stroke: '#fff' }}
                                                        activeDot={{ r: 6, fill: isDepreciating ? '#f87171' : '#60a5fa' }}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="mt-8 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-400">Projected Value by {(new Date().getFullYear() + 10)}</p>
                                                <div className={`text-3xl font-bold mt-1 ${isDepreciating ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                    {formatCurrency(data[10].value)}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <Badge variant="outline" className={`${bgBadgeClass} px-2 py-0.5`}>
                                                    {isDepreciating ? '' : '+'}{((Math.pow(1 + rate, 10) - 1) * 100).toFixed(0)}% Total {isDepreciating ? 'Loss' : 'Growth'}
                                                </Badge>
                                                <p className="text-[10px] text-slate-500">Compounded Annually</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-900 px-4 py-3 rounded-lg border border-slate-800/50">
                                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Current Value</p>
                                            <p className="text-lg font-bold">{formatCurrency(selectedAsset.currentValue)}</p>
                                        </div>
                                        <div className="bg-slate-900 px-4 py-3 rounded-lg border border-slate-800/50 text-right">
                                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Growth Rate</p>
                                            <p className={`text-lg font-bold ${themeClass}`}>
                                                {(rate * 100).toFixed(1)}% p.a.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    )
}
