"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LiabilityTable } from "@/components/LiabilityTable";
import { DataService } from "@/lib/dataService";
import { Liability } from "@/types/types";
import { Search as SearchIcon, Plus as PlusIcon, ArrowLeft as ArrowLeftIcon, Download as DownloadIcon } from "lucide-react";
import Link from "next/link";
import { LiabilityProjectionDialog } from "@/components/LiabilityProjectionDialog";

export default function LiabilitiesListPage() {
    const [liabilities, setLiabilities] = useState<Liability[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const [selectedLiability, setSelectedLiability] = useState<Liability | null>(null);
    const [isProjectionOpen, setIsProjectionOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await DataService.getLiabilities();
            setLiabilities(data || []);
        } catch (error) {
            console.error("Failed to load liabilities", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLiabilities = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return liabilities;

        return liabilities.filter(l =>
            l.name.toLowerCase().includes(query) ||
            l.type.toLowerCase().includes(query)
        );
    }, [liabilities, searchQuery]);

    if (!mounted) return null;

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this liability?")) {
            try {
                await DataService.deleteLiability(id);
                loadData();
            } catch (error) {
                console.error("Failed to delete liability", error);
            }
        }
    };

    const handleDownloadCSV = () => {
        const headers = ["Name", "Type", "Total Amount", "Outstanding Amount", "Interest Rate", "Start Date"];
        const rows = filteredLiabilities.map((l: Liability) => [
            `"${l.name}"`,
            l.type,
            l.totalAmount.toString(),
            l.outstandingAmount.toString(),
            l.interestRate.toString(),
            l.startDate
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((r: string[]) => r.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `liabilities_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/liabilities">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Liabilities</h1>
                    <p className="text-muted-foreground">Detailed listing of all your loans and credit obligations.</p>
                </div>
                <div className="ml-auto">
                    <Button size="sm" className="h-9" disabled>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Liability
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or type..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Button variant="outline" size="sm" onClick={handleDownloadCSV} className="h-9">
                                <DownloadIcon className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading liabilities...</div>
                    ) : (
                        <LiabilityTable
                            liabilities={filteredLiabilities}
                            onEdit={(l) => console.log("Edit", l)}
                            onDelete={handleDelete}
                            onRowClick={(l) => {
                                setSelectedLiability(l);
                                setIsProjectionOpen(true);
                            }}
                        />
                    )}
                </CardContent>
            </Card>

            <LiabilityProjectionDialog
                liability={selectedLiability}
                open={isProjectionOpen}
                onOpenChange={setIsProjectionOpen}
            />
        </div>
    );
}
