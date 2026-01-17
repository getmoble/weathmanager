"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AssetTable } from "@/components/AssetTable";
import { DataService } from "@/lib/dataService";
import { Asset } from "@/types/types";
import { Search, Plus, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

export default function AssetsListPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await DataService.getAssets();
            setAssets(data || []);
        } catch (error) {
            console.error("Failed to load assets", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAssets = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return assets;

        return assets.filter(asset =>
            asset.name.toLowerCase().includes(query) ||
            asset.type.toLowerCase().includes(query) ||
            (asset.location && asset.location.toLowerCase().includes(query))
        );
    }, [assets, searchQuery]);

    if (!mounted) return null;

    const handleDelete = async (id: string) => {
        // Implementation for deletion if needed, using DataService
        if (confirm("Are you sure you want to delete this asset?")) {
            // Need to add deleteAsset to DataService or call it directly if it exists in actions
            // For now, let's keep it placeholder or check if actions has it
            console.log("Delete asset", id);
        }
    };

    const handleDownloadCSV = () => {
        const headers = ["Name", "Type", "Location", "Purchase Value", "Current Value", "Appreciation %"];
        const rows = filteredAssets.map((a: Asset) => [
            `"${a.name}"`,
            a.type,
            a.location || "",
            a.purchaseValue.toString(),
            a.currentValue.toString(),
            (((a.currentValue - a.purchaseValue) / a.purchaseValue) * 100).toFixed(2)
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((r: string[]) => r.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `assets_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/assets">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Assets</h1>
                    <p className="text-muted-foreground">Detailed listing of all your physical and fixed-income holdings.</p>
                </div>
                <div className="ml-auto">
                    {/* Placeholder for adding assets - usually handled in settings for now */}
                    <Button size="sm" className="h-9" disabled>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Asset
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, type or location..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Button variant="outline" size="sm" onClick={handleDownloadCSV} className="h-9">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading assets...</div>
                    ) : (
                        <AssetTable
                            assets={filteredAssets}
                            onEdit={(a) => console.log("Edit", a)}
                            onDelete={handleDelete}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
