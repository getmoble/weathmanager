"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Stock } from "@/types/types";
import { RecommendationBadge } from "@/components/RecommendationBadge";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StockCardProps {
    stock: Stock;
}

export function StockCard({ stock }: StockCardProps) {
    const isPositive = stock.priceChange >= 0;

    return (
        <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-xl font-bold">{stock.ticker}</CardTitle>
                    <p className="text-xs text-muted-foreground">{stock.companyName}</p>
                </div>
                <RecommendationBadge recommendation={stock.recommendation.action} />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">₹{stock.currentPrice.toLocaleString('en-IN')}</div>
                    <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        {Math.abs(stock.priceChange)}%
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <p className="text-muted-foreground">Market Cap</p>
                        <p className="font-semibold">{(stock.marketCap / 1e7).toFixed(1)} Cr</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">P/E Ratio</p>
                        <p className="font-semibold">N/A</p>
                    </div>
                </div>

                <div className="p-2 bg-muted/50 rounded-md">
                    <p className="text-[10px] text-muted-foreground italic line-clamp-2">
                        "{stock.recommendation.reasoning}"
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Link href={`/dashboard/opportunities/${stock.ticker}`} className="w-full">
                    <Button variant="outline" className="w-full gap-2 h-8 text-xs">
                        <Info className="h-3 w-3" /> View Detailed Analysis
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
