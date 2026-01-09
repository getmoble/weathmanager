"use client";

import { DataService } from "@/lib/dataService";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Building2, Wallet, Layers, Link2, Trash2, Edit2, CheckCircle2, AlertCircle, TrendingUp, CreditCard, Target, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your bank accounts, categories, and broker connections.</p>
            </div>

            <Tabs defaultValue="goals" className="flex flex-col md:flex-row gap-8">
                <TabsList className="flex flex-col h-auto bg-transparent border-none md:border-r rounded-none p-0 items-start space-y-1 w-full md:w-64 shrink-0">
                    <TabsTrigger
                        value="goals"
                        className="w-full justify-start gap-3 px-4 h-10 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 transition-colors"
                    >
                        <Target className="h-4 w-4" /> Goals
                    </TabsTrigger>
                    <TabsTrigger
                        value="brokers"
                        className="w-full justify-start gap-3 px-4 h-10 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 transition-colors"
                    >
                        <Link2 className="h-4 w-4" /> Brokers
                    </TabsTrigger>
                    <TabsTrigger
                        value="income-categories"
                        className="w-full justify-start gap-3 px-4 h-10 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 transition-colors"
                    >
                        <TrendingUp className="h-4 w-4 text-emerald-500" /> Income Categories
                    </TabsTrigger>
                    <TabsTrigger
                        value="expense-categories"
                        className="w-full justify-start gap-3 px-4 h-10 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 transition-colors"
                    >
                        <CreditCard className="h-4 w-4 text-rose-500" /> Expense Categories
                    </TabsTrigger>
                    <TabsTrigger
                        value="banks"
                        className="w-full justify-start gap-3 px-4 h-10 data-[state=active]:bg-muted data-[state=active]:shadow-none hover:bg-muted/50 transition-colors"
                    >
                        <Building2 className="h-4 w-4" /> Banks
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1">
                    <TabsContent value="goals" className="mt-0 space-y-4 font-normal">
                        <GoalManagement />
                    </TabsContent>

                    <TabsContent value="brokers" className="mt-0 space-y-4">
                        <BrokerManagement />
                    </TabsContent>

                    <TabsContent value="income-categories" className="mt-0 space-y-4">
                        <IncomeCategoryManagement />
                    </TabsContent>

                    <TabsContent value="expense-categories" className="mt-0 space-y-4">
                        <ExpenseCategoryManagement />
                    </TabsContent>

                    <TabsContent value="banks" className="mt-0 space-y-4">
                        <BankManagement />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}


function GoalManagement() {
    const [goals, setGoals] = useState<any[]>([]);

    useEffect(() => {
        DataService.getGoals().then(setGoals);
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
                <Card key={goal.id} className="relative overflow-hidden border-primary/20">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{goal.name}</CardTitle>
                            <Badge variant={goal.status === 'achieved' ? 'default' : 'secondary'}>
                                {goal.status}
                            </Badge>
                        </div>
                        <CardDescription>{goal.category} • Target {goal.targetYear}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Current Progress</span>
                                <span className="font-semibold text-emerald-500">₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Target Amount</span>
                                <span className="font-semibold">₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3" />
                            <span>Inflation: {goal.inflationRate}% • Returns: {goal.expectedReturn}%</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-3 bg-muted/30">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Edit2 className="h-3 w-3" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3" /> Deactivate
                        </Button>
                    </CardFooter>
                </Card>
            ))}
            <Card className="border-dashed flex items-center justify-center py-10 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Plus className="h-8 w-8" />
                    <span className="font-medium">Add New Goal</span>
                </div>
            </Card>
        </div>
    );
}

function BankManagement() {
    const [banks, setBanks] = useState<any[]>([]);

    useEffect(() => {
        DataService.getBanks().then(setBanks);
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {banks.map((bank) => (
                <Card key={bank.id} className="relative overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{bank.name}</CardTitle>
                            {bank.primary && <Badge variant="secondary">Primary</Badge>}
                        </div>
                        <CardDescription>{bank.type} • •••• {bank.last4}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹ {bank.balance.toLocaleString('en-IN')}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-3">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Edit2 className="h-3 w-3" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3" /> Remove
                        </Button>
                    </CardFooter>
                </Card>
            ))}
            <Card className="border-dashed flex items-center justify-center py-10 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Plus className="h-8 w-8" />
                    <span className="font-medium">Link New Bank</span>
                </div>
            </Card>
        </div>
    );
}

function IncomeCategoryManagement() {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        DataService.getCategories().then(data => setCategories(data.income));
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Income Categories
                </CardTitle>
                <CardDescription>Categories for categorizing your inflows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between group">
                        <span className="text-sm">{cat}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                    </div>
                ))}
                <div className="pt-2 flex gap-2">
                    <Input placeholder="New category name" className="h-8 text-xs" />
                    <Button size="sm" className="h-8 px-3">Add</Button>
                </div>
            </CardContent>
        </Card>
    );
}

function ExpenseCategoryManagement() {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        DataService.getCategories().then(data => setCategories(data.expense));
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-rose-500" />
                    Expense Categories
                </CardTitle>
                <CardDescription>Categories for tracking your outflows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between group">
                        <span className="text-sm">{cat}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                    </div>
                ))}
                <div className="pt-2 flex gap-2">
                    <Input placeholder="New category name" className="h-8 text-xs" />
                    <Button size="sm" className="h-8 px-3">Add</Button>
                </div>
            </CardContent>
        </Card>
    );
}

function BrokerManagement() {
    const [brokers, setBrokers] = useState<any[]>([]);

    useEffect(() => {
        DataService.getBrokers().then(setBrokers);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Connected Brokers</CardTitle>
                <CardDescription>Link your brokerage accounts to automatically track your investments.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {brokers.map((broker) => (
                        <div key={broker.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-md flex items-center justify-center font-bold text-white ${broker.name === 'Zerodha' ? 'bg-blue-600' :
                                    broker.name === 'Upstox' ? 'bg-purple-600' : 'bg-orange-500'
                                    }`}>
                                    {broker.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-semibold">{broker.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        {broker.status === 'connected' ? (
                                            <Badge variant="outline" className="text-emerald-500 border-emerald-500 bg-emerald-500/10 gap-1 h-5">
                                                <CheckCircle2 className="h-3 w-3" /> Connected
                                            </Badge>
                                        ) : broker.status === 'disconnected' ? (
                                            <Badge variant="outline" className="text-amber-500 border-amber-500 bg-amber-500/10 gap-1 h-5">
                                                <AlertCircle className="h-3 w-3" /> Reconnection Required
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-muted-foreground gap-1 h-5">
                                                Not Linked
                                            </Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">Last sync: {broker.lastSync}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {broker.status === 'not_linked' ? (
                                    <Button size="sm">Link Account</Button>
                                ) : (
                                    <>
                                        <Button variant="outline" size="sm">Sync Now</Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><SettingsIcon className="h-4 w-4" /></Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}


