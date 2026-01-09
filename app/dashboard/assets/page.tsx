"use client"

import { useEffect, useState } from "react"
import { DataService } from "@/lib/dataService"
import { Asset } from "@/types/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Coins, Car, Landmark, TrendingUp, ArrowUpRight, MapPin } from "lucide-react"

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([])
    const [isLoading, setIsLoading] = useState(true)

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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
                <p className="text-muted-foreground">Track and manage your physical and fixed-income assets.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Asset Value</CardDescription>
                        <CardTitle className="text-3xl font-bold">₹{totalValue.toLocaleString('en-IN')}</CardTitle>
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
                        <CardTitle className="text-3xl font-bold">₹{totalGains.toLocaleString('en-IN')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Across {assets.length} major holdings</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Cost Basis</CardDescription>
                        <CardTitle className="text-3xl font-bold">₹{totalPurchaseValue.toLocaleString('en-IN')}</CardTitle>
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
                            <Card key={asset.id} className="group hover:border-primary/40 transition-all overflow-hidden">
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
                                            <div className="text-lg font-bold">₹{asset.currentValue.toLocaleString('en-IN')}</div>
                                            <div className={`text-xs font-medium ${gains >= 0 ? 'text-emerald-500' : 'text-rose-500 flex items-center justify-end gap-1'}`}>
                                                {gains >= 0 ? '+' : ''}{appreciation.toFixed(1)}% {gains >= 0 ? 'gains' : 'depreciation'}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Acquired for ₹{asset.purchaseValue.toLocaleString('en-IN')}</p>
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
        </div>
    )
}
