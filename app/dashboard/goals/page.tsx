"use client";

import { useEffect, useState } from "react";
import { DataService } from "@/lib/dataService";
import { Goal } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { Target, TrendingUp, Calendar, ArrowRight, ShieldCheck, PieChart as PieChartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function GoalsDashboardPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const data = await DataService.getGoals();
            setGoals(data);
            setIsLoading(false);
        }
        loadData();
    }, []);

    if (isLoading) return <div className="p-8">Loading goals...</div>;

    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const overallProgress = (totalSaved / totalTarget) * 100;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
                    <p className="text-muted-foreground">Track your progress towards life milestones.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Target"
                    value={`₹${(totalTarget / 10000000).toFixed(2)} Cr`}
                    icon={Target}
                    description="Future value of all goals"
                />
                <MetricCard
                    title="Total Earmarked"
                    value={`₹${(totalSaved / 10000000).toFixed(2)} Cr`}
                    icon={ShieldCheck}
                    description="Currently allocated funds"
                    valueClassName="text-emerald-500"
                />
                <MetricCard
                    title="Overall Progress"
                    value={`${Math.round(overallProgress)}%`}
                    icon={TrendingUp}
                    description="Combined goal achievement"
                />
                <MetricCard
                    title="Active Goals"
                    value={goals.filter(g => g.status !== 'achieved').length}
                    icon={Calendar}
                    description="Milestones in progress"
                />
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Goal Tracker</h2>
                    <Badge variant="outline" className="px-3 py-1">
                        {goals.length} Major Milestones
                    </Badge>
                </div>
                <div className="space-y-8">
                    {goals.map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        return (
                            <div key={goal.id} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg">{goal.name}</span>
                                            {goal.status === 'achieved' && (
                                                <Badge className="bg-emerald-500 hover:bg-emerald-600">Achieved</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">₹{goal.targetAmount.toLocaleString('en-IN')}</div>
                                        <div className="text-xs text-muted-foreground italic">By {goal.targetYear}</div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>Progress: {Math.round(progress)}%</span>
                                        <span>₹{goal.currentAmount.toLocaleString('en-IN')} saved</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                </div>
                                {goal.monthlyContribution > 0 && goal.status !== 'achieved' && (
                                    <div className="flex items-center gap-2 text-xs text-blue-500 bg-blue-500/10 w-fit px-2 py-1 rounded">
                                        <TrendingUp className="h-3 w-3" />
                                        <span>Tracking with ₹{goal.monthlyContribution.toLocaleString('en-IN')}/mo SIP</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Goal Distribution</CardTitle>
                        <CardDescription>Allocation across categories</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center border-t mt-4">
                        <div className="text-muted-foreground italic flex flex-col items-center gap-2">
                            <PieChartIcon className="h-8 w-8 opacity-20" />
                            <span>Allocation matrix coming soon...</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Timeline Visualization</CardTitle>
                        <CardDescription>Target milestones over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center border-t mt-4">
                        <div className="text-muted-foreground italic flex flex-col items-center gap-2">
                            <TrendingUp className="h-8 w-8 opacity-20" />
                            <span>Milestone timeline coming soon...</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
