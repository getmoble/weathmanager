"use client";

import { useEffect, useState } from "react";
import { StockCard } from "@/components/StockCard";
import { getStocks } from "@/lib/mockStockData";
import { Stock } from "@/types/types";
import { Search, Filter, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OpportunitiesPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const data = await getStocks();
            setStocks(data);
            setIsLoading(false);
        }
        loadData();
    }, []);

    const filteredStocks = stocks.filter(s => {
        const matchesSearch = s.ticker.toLowerCase().includes(search.toLowerCase()) ||
            s.companyName.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" || s.recommendation.action === filter;
        return matchesSearch && matchesFilter;
    });

    if (isLoading) return <div className="p-8">Analyzing market opportunities...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-8 w-8 text-primary" /> Stock Opportunities
                    </h1>
                    <p className="text-muted-foreground">Intelligent analysis & recommendations based on fundamental and technical indicators</p>
                </div>
            </div>

            <div className="flex flex-col sm:row items-center gap-4 bg-card p-4 rounded-lg border">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search ticker or name..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Recommendation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Recommendations</SelectItem>
                            <SelectItem value="buy">Buy Only</SelectItem>
                            <SelectItem value="hold">Hold Only</SelectItem>
                            <SelectItem value="sell">Sell Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                    Showing {filteredStocks.length} assets
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredStocks.map(stock => (
                    <StockCard key={stock.ticker} stock={stock} />
                ))}
            </div>

            {filteredStocks.length === 0 && (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground italic">No stocks match your current filters.</p>
                </div>
            )}
        </div>
    );
}
