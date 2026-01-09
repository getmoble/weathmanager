"use client";

import { useEffect, useState, use } from "react";
import { getStockByTicker } from "@/lib/mockStockData";
import { Stock } from "@/types/types";
import { RecommendationBadge } from "@/components/RecommendationBadge";
import { AnalysisChart } from "@/components/AnalysisChart";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ExternalLink, ShieldCheck, Zap, History, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function StockDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
    const resolvedParams = use(params);
    const ticker = resolvedParams.ticker.toUpperCase();
    const [stock, setStock] = useState<Stock | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getStockByTicker(ticker);
                if (!data) {
                    setIsError(true);
                } else {
                    setStock(data);
                }
            } catch (err) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [ticker]);

    if (isLoading) return <div className="p-8">Loading analysis...</div>;
    if (isError || !stock) return notFound();

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/opportunities">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">{stock.companyName} ({stock.ticker})</h1>
                        <RecommendationBadge recommendation={stock.recommendation.action} />
                    </div>
                    <p className="text-muted-foreground">{stock.sector}</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <MetricCard title="Current Price" value={`₹${stock.currentPrice.toLocaleString('en-IN')}`} icon={Zap} valueClassName="text-primary" />
                <MetricCard title="Day Change" value={`${stock.priceChange}% (₹${stock.priceChangeAmount})`} icon={BarChart2} valueClassName={stock.priceChange >= 0 ? "text-green-500" : "text-red-500"} />
                <MetricCard title="Market Cap" value={`${(stock.marketCap / 1e7).toFixed(1)} Cr`} icon={ShieldCheck} />
                <MetricCard title="Score" value={stock.fundamentals.fundamentalScore} icon={History} />
            </div>

            <Card className="border-l-4 border-l-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" /> Analyst Reasoning
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg leading-relaxed">
                        {stock.recommendation.reasoning}
                    </p>
                </CardContent>
            </Card>

            <Tabs defaultValue="technical" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
                    <TabsTrigger value="fundamental">Fundamental Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="technical" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Technical Indicators (SMA & Price)</CardTitle>
                                <CardDescription>50-day SMA overlay</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AnalysisChart
                                    data={stock.historicalPrices.length > 0 ? stock.historicalPrices : [{ date: 'N/A', price: stock.currentPrice }]}
                                    type="technical"
                                    indicators={["sma"]}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Indicator Scores</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>RSI (14)</span>
                                        <span className="font-bold">{stock.technicals.rsi}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className={`h-full ${stock.technicals.rsi > 70 ? 'bg-red-500' : stock.technicals.rsi < 30 ? 'bg-green-500' : 'bg-primary'}`}
                                            style={{ width: `${stock.technicals.rsi}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        {stock.technicals.rsi > 70 ? 'Overbought' : stock.technicals.rsi < 30 ? 'Oversold' : 'Neutral'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">MACD Signal</p>
                                    <p className={`text-xl font-bold ${stock.technicals.macd.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {stock.technicals.macd.value > 0 ? 'Bullish' : 'Bearish'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="fundamental" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Health Check</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Valuation</span>
                                    <span className="font-semibold capitalize">{stock.fundamentals.valuationStatus}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground">5Y Return</span>
                                    <span className="font-semibold">{stock.fundamentals.historicalReturn5Y}%</span>
                                </div>
                                <div className="flex items-center gap-2 mt-4 text-green-500">
                                    <ShieldCheck className="h-5 w-5" />
                                    <span className="font-bold">Score: {stock.fundamentals.fundamentalScore}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Business Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {stock.companyName} is a leading player in the {stock.sector} sector.
                                    The company shows strong fundamental resilience with a valuation status of {stock.fundamentals.valuationStatus}.
                                    Analyst consistency is rated as {stock.fundamentals.consistency}.
                                </p>
                                <Button variant="outline" className="mt-6 gap-2">
                                    Read Full Profile <ExternalLink className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
