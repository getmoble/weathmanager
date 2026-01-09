"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpenseReductionSuggestionProps {
    category: string;
    description: string;
    potentialSavings: number;
    impact: "high" | "medium" | "low";
}

export function ExpenseReductionSuggestion({
    category,
    description,
    potentialSavings,
    impact
}: ExpenseReductionSuggestionProps) {
    const impactColor = {
        high: "text-red-500 bg-red-500/10",
        medium: "text-amber-500 bg-amber-500/10",
        low: "text-blue-500 bg-blue-500/10"
    }[impact];

    return (
        <Card className="border-l-4 border-l-blue-500 overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-500" />
                        Save on {category}
                    </CardTitle>
                </div>
                <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${impactColor}`}>
                    {impact} Impact
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    {description}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-green-500 font-bold">
                        <Save className="h-4 w-4" />
                        <span>Potential Savings: ₹{potentialSavings.toLocaleString('en-IN')}/mo</span>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs px-2 h-8">
                        View Tips <ArrowRight className="h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
